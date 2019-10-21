import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActionSheetController, AlertController, ToastController  } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';

import { ContentCard, EContentType } from 'core/models';
import { BackendApiService, LoadingService } from 'core/services';
import { GlobalStore } from 'state/global.store';

import { environment } from 'environments/environment';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss'],
})
export class ContentCardComponent implements OnInit {

  @Input() public cardData: ContentCard;
  @Input() public cardView: 'default' | 'canvas-view' = 'default';
  public deleted = false;

  private actionSheetButtons: ActionSheetButton[] = [
    {
      text: 'Share',
      icon: 'share',
      handler: () => {
        this.clipboard.copy(`${environment.primaryWebsite}canvas/${this.cardData.id}`);
        this.presentShareLinkCopied();
      },
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
    },
  ];

  constructor(
    private actionSheetController: ActionSheetController,
    private http: BackendApiService,
    private store: GlobalStore,
    private alert: AlertController,
    private loading: LoadingService,
    private location: Location,
    private clipboard: Clipboard,
    private toastController: ToastController,
  ) { }

  /**
   * Initialize the description
   */
  public ngOnInit() {
    if (!this.cardData.description) this.cardData.description = 'No description';

    // Add delete action if you own this card //
    const myId = this.store.state.userId;
    const cardId = this.cardData.users.primary.id;
    const type = this.cardData.type;

    if (
      ((type === EContentType.Canvas || type === EContentType.Meme) && cardId === myId) ||
      (type === EContentType.MemeWithHost && this.cardData.users.secondary.id === myId)
    ) {
      this.actionSheetButtons.push(
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.presentDeleteConfirm();
          },
        },
      );
    }
  }

  /**
   * Cofirm if the user wants to delete the card
   */
  private async presentDeleteConfirm() {
    const alert = await this.alert.create({
      header: 'Delete Card',
      message: 'Are you sure you want to delete this card?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteCard();
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Present the additional actions for canvas cards
   */
  public async presentContentCardActions() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Card Actions',
      buttons: this.actionSheetButtons,
    });

    await actionSheet.present();

  }

  /**
   * Notify the user that the share link has ben copied
   */
  private async presentShareLinkCopied() {
    const toast = await this.toastController.create({
      header: 'Link Copied',
      duration: 1000,
      position: 'bottom',
    });
    toast.present();
  }

  /**
   * Manages the starring action for content cards
   */
  public starToggle() {
    this.cardData.starred = (this.cardData.starred ? false : true);

    if (this.cardData.starred) {
      this.cardData.stars += 1;
      if (this.cardData.type === EContentType.Canvas) this.http.starCanvas(this.cardData.id).toPromise().then(_ => null);
      if (this.cardData.type === EContentType.Meme ||
          this.cardData.type === EContentType.MemeWithHost) this.http.starMeme(this.cardData.id).toPromise().then(_ => null);
    } else {
      this.cardData.stars -= 1;
      if (this.cardData.type === EContentType.Canvas) this.http.unstarCanvas(this.cardData.id).toPromise().then(_ => null);
      if (this.cardData.type === EContentType.Meme ||
          this.cardData.type === EContentType.MemeWithHost) this.http.unstarMeme(this.cardData.id).toPromise().then(_ => null);
    }
  }

  /**
   * Delete this card if the user owns it
   */
  private async deleteCard() {
    console.log('delete');
    let error = false;
    if (this.cardData.type === EContentType.Canvas) {
      await this.http.deleteCanvas(this.cardData.id).toPromise().catch((_) => {
        error = true;
        this.loading.presentError('Cannot delete card');
      });
    } else {
      await this.http.deleteMeme(this.cardData.id).toPromise().catch((_) => {
        error = true;
        this.loading.presentError('Cannot delete card');
      });
    }

    if (this.cardView === 'canvas-view') this.location.back();
    if (!error) this.deleted = true;
  }

}

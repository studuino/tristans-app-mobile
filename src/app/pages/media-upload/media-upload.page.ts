import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { GlobalStore } from 'state/global.store';
import { BackendApiService } from 'services/backend-api/backend-api.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.page.html',
  styleUrls: ['./media-upload.page.scss'],
})
export class MediaUploadPage implements OnInit {

  public webImagePath: string;
  public localImagePath: string;
  public description: string;

  public customActionSheetOptions: any = {
    header: 'Visibility',
  };

  constructor(
    private camera: Camera,
    private webView: WebView,
    private filePath: FilePath,
    private globalStore: GlobalStore,
    private http: BackendApiService,
  ) { }

  /**
   * Check if the camera has taken a picture from the tab button
   */
  public ngOnInit() {

    this.globalStore.state$.subscribe((state) => {
      if (state.stagedCanvasPicture != null) {
        this.displayImagePreview(state.stagedCanvasPicture);
        this.globalStore.resetCanvasPicture();
      }
    });

  }

  /**
   * Open the gallery to select a canvas picture
   */
  public selectCanvasPicture() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };

    this.camera.getPicture(options).then((imageData) => {

      this.globalStore.setCanvasPicture(imageData);
      this.displayImagePreview(imageData);

    });

  }

  /**
   * Display the image in the media-upload view
   * @param  contentURI The content uri of the image on the device
   */
  public displayImagePreview(contentURI: string) {

    this.localImagePath = contentURI;

    this.filePath.resolveNativePath(contentURI).then((path) => {
      this.webImagePath = this.webView.convertFileSrc(path);
    }).catch((e) => {
      console.log(e);
    });

  }

  /**
   * Upload the content, redirect to page hosting the image
   */
  public confirmUpload() {

    if (this.localImagePath != null) {
      console.log('here');

      this.http.uploadCanvas(this.localImagePath, this.description).then(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
          },
      );

    }

  }

  /**
   * Cancel the image upload
   */
  public cancelUpload() {
    this.webImagePath = null;
  }

}

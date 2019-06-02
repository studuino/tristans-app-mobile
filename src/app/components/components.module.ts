import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { PrimaryHeaderComponent } from './interface/primary-header/primary-header.component';
import { SidemenuComponent } from './interface/sidemenu/sidemenu.component';
import { BackButtonComponent } from './interface/back-button/back-button.component';
import { TransparentHeaderComponent } from './interface/transparent-header/transparent-header.component';

@NgModule({
  imports: [IonicModule, RouterModule],
  declarations: [
    PrimaryHeaderComponent,
    SidemenuComponent,
    BackButtonComponent,
    TransparentHeaderComponent
  ],
  exports: [
    PrimaryHeaderComponent,
    SidemenuComponent,
    BackButtonComponent,
    TransparentHeaderComponent
  ]
})
export class ComponentsModule { }

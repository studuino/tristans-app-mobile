import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { IonicModule } from '@ionic/angular';

import { MediaUploadPage } from './media-upload.page';
import { SharedModule } from 'shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MediaUploadPage,
  },
];

@NgModule({
  providers: [
    Camera,
    WebView,
    FilePath,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [MediaUploadPage],
})
export class MediaUploadPageModule {}

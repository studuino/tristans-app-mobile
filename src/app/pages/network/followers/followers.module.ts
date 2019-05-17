import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FollowersPage } from './followers.page';

import { ComponentsModule } from '../../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: FollowersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [FollowersPage]
})
export class FollowersPageModule {}

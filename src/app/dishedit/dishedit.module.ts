import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisheditPageRoutingModule } from './dishedit-routing.module';

import { DisheditPage } from './dishedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisheditPageRoutingModule
  ],
  declarations: [DisheditPage]
})
export class DisheditPageModule {}

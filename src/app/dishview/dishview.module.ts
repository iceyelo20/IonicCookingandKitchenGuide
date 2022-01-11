import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DishviewPageRoutingModule } from './dishview-routing.module';

import { DishviewPage } from './dishview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DishviewPageRoutingModule
  ],
  declarations: [DishviewPage]
})
export class DishviewPageModule {}

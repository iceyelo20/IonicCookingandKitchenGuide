import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewdishPageRoutingModule } from './newdish-routing.module';

import { NewdishPage } from './newdish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewdishPageRoutingModule
  ],
  declarations: [NewdishPage]
})
export class NewdishPageModule {}

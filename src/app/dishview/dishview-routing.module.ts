import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DishviewPage } from './dishview.page';

const routes: Routes = [
  {
    path: '',
    component: DishviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DishviewPageRoutingModule {}

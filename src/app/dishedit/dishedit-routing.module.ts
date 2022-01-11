import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisheditPage } from './dishedit.page';

const routes: Routes = [
  {
    path: '',
    component: DisheditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisheditPageRoutingModule {}

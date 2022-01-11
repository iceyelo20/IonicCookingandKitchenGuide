import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewdishPage } from './newdish.page';

const routes: Routes = [
  {
    path: '',
    component: NewdishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewdishPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AclsComponent } from './acls.component';

const routes: Routes = [
    { path: '', component: AclsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataManagementComponent } from './data-management.component';

const routes: Routes = [
    { path: '', component: DataManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataManagementRoutingModule { }

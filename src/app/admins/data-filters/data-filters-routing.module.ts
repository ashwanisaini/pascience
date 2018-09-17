import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataFiltersComponent } from './data-filters.component';

const routes: Routes = [
    { path: '', component: DataFiltersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataFiltersRoutingModule { }

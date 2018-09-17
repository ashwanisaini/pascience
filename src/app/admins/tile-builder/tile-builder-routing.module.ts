import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TileBuilderComponent } from './tile-builder.component';

const routes: Routes = [
    { path: '', component: TileBuilderComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TileBuilderRoutingModule { }

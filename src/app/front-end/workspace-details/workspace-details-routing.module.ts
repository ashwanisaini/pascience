import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceDetailsComponent } from './workspace-details.component';

const routes: Routes = [
    { path: '', component: WorkspaceDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceDetailsRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontendComponent } from './frontend.component';

const routes: Routes = [
    {
        path: '', component: FrontendComponent,
        children: [
            { path: '', redirectTo:'my_workspaces', pathMatch:'full' },
            { path: 'my_workspaces', loadChildren: './my_workspaces/my-workspaces.module#MyWorkspaceModule' },
            { path: 'workspace-details/:id', loadChildren: './workspace-details/workspace-details.module#WorkspaceDetailsModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FrontendRoutingModule { }

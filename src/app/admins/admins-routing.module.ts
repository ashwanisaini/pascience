import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminsComponent } from './admins.component';

const routes: Routes = [
    {
        path: '', component: AdminsComponent,
        children: [
            { path: '', redirectTo:'company', pathMatch:'full' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'company', loadChildren: './company/company.module#CompanyModule' },
            { path: 'workspaces', loadChildren: './workspaces/workspaces.module#WorkspaceModule' },
            { path: 'acls', loadChildren: './acls/acls.module#AclsModule' },
            { path: 'tile-builder', loadChildren: './tile-builder/tile-builder.module#TileBuilderModule' },
            { path: 'data-management', loadChildren: './data-management/data-management.module#DataManagementModule' },
            { path: 'kanban', loadChildren: './kanban/kanban.module#KanbanModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'sheets', loadChildren: './sheets/sheets.module#SheetsModule' },
            { path: 'data-filters', loadChildren: './data-filters/data-filters.module#DataFiltersModule' },
            // { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            // { path: 'forms', loadChildren: './form/form.module#FormModule' },
            // { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            // { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            // { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            // { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminsRoutingModule { }

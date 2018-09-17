import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { WorkspaceDetailsRoutingModule } from './workspace-details-routing.module';
import { WorkspaceDetailsComponent } from './workspace-details.component';
import { StatModule } from '../../shared';
import { GridsterModule } from 'angular-gridster2';
import { NvD3Module } from 'ng2-nvd3';
import { KanbanModule } from './ws_component/kanban/kanban.module';
import { ChartModule } from './ws_component/chart/chart.module';
import { SheetModule } from './ws_component/sheet/sheet.module';
import {
    PopOverComponent,
    TabsComponent

} from '../../layout/bs-component/components';

import { KanbanComponent, SheetComponent, ChartComponent, KanbanFormComponent, KanbanCardComponent } from './ws_component';
import 'd3';
import 'nvd3';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgbModule,
        WorkspaceDetailsRoutingModule,
        StatModule,
        GridsterModule,
        NvD3Module,
        KanbanModule,
        ChartModule,
        SheetModule
    ],
    declarations: [
        WorkspaceDetailsComponent,
        PopOverComponent,
        TabsComponent,
        KanbanComponent,
        SheetComponent,
        ChartComponent,
        KanbanFormComponent,
        KanbanCardComponent
    ]
})
export class WorkspaceDetailsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { WorkspaceRoutingModule } from './workspaces-routing.module';
import { WorkspaceComponent } from './workspaces.component';
import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        WorkspaceRoutingModule,
        StatModule,
    ],
    declarations: [
        WorkspaceComponent
    ]
})
export class WorkspaceModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataManagementComponent } from './data-management.component';

import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DataManagementRoutingModule,
        StatModule,
    ],
    declarations: [
        DataManagementComponent
    ]
})
export class DataManagementModule { }

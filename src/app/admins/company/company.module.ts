import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import {
    TimelineComponent,
    NotificationComponent
} from './components';
import { StatModule } from '../../shared';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        CompanyRoutingModule,
        StatModule,
        PageHeaderModule
    ],
    declarations: [
        CompanyComponent,
        TimelineComponent,
        NotificationComponent
    ]
})
export class CompanyModule { }

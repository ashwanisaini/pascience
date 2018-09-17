import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { AclsRoutingModule } from './acls-routing.module';
import { AclsComponent } from './acls.component';

import { StatModule } from '../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        AclsRoutingModule,
        StatModule,
    ],
    declarations: [
        AclsComponent
    ]
})
export class AclsModule { }

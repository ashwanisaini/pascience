import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { AdminsRoutingModule } from './admins-routing.module';
import { AdminsComponent } from './admins.component';
import { HeaderComponent, SidebarComponent } from '../shared';
import { AlertComponent } from '../shared/directives/alerts/alert.component';

@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        AdminsRoutingModule,
        TranslateModule
    ],
    declarations: [
        AdminsComponent,
        HeaderComponent,
        SidebarComponent,
        AlertComponent
    ]
})
export class AdminsModule { }

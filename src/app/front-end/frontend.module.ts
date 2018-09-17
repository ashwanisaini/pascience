import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FrontendRoutingModule } from './frontend-routing.module';
import { FrontendComponent } from './frontend.component';
import { HeaderComponent, AlertComponent } from './shared/components/index';



@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        FrontendRoutingModule,
        TranslateModule
    ],
    declarations: [
        FrontendComponent,
        HeaderComponent,
        AlertComponent
    ]
})
export class FrontendModule { }

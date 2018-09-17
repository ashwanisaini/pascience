import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataFiltersRoutingModule } from './data-filters-routing.module';
import { DataFiltersComponent } from './data-filters.component';
import { StatModule } from '../../shared';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        DataFiltersRoutingModule,
        StatModule,
        SharedPipesModule,
        FormsModule,
        CustomFormsModule,
        PageHeaderModule
    ],
    exports: [],
    declarations: [
        DataFiltersComponent
    ]

})
export class DataFiltersModule { }

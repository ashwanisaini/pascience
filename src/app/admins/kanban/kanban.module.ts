import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { KanbanRoutingModule } from './kanban-routing.module';
import { KanbanComponent } from './kanban.component';
import { StatModule } from '../../shared';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { FormWizardModule } from 'angular2-wizard';
//import {ColorPickerModule} from 'angular4-color-picker';
import { FileUploadModule } from 'ng2-file-upload';
import { ColorPickerModule } from 'ngx-color-picker';




@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        KanbanRoutingModule,
        StatModule,
        SharedPipesModule,
        FormsModule,
        FormWizardModule,
        //ColorPickerModule,
        FileUploadModule,
        CustomFormsModule,
        ColorPickerModule
    ],
    exports: [],
    declarations: [
        KanbanComponent
    ]

})
export class KanbanModule { }

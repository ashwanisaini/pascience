import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SheetsRoutingModule } from './sheets-routing.module';
import { SheetsComponent } from './sheets.component';
import { StatModule } from '../../shared';
import {DndModule} from 'ng2-dnd';
//import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotTableModule } from 'ng2-handsontable';
import { ColorPickerModule } from 'ngx-color-picker';


//import {MomentizePipe} from '../../shared/pipes/moment-format-pipes.module'


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        //AccordionModule.forRoot(),
        SheetsRoutingModule,
        StatModule,
        DndModule,
        //DragulaModule,
        SharedPipesModule,
        BsDropdownModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HotTableModule,
        ColorPickerModule
    ],
    exports: [DndModule, HotTableModule],
    declarations: [
        SheetsComponent
    ]

})
export class SheetsModule { }

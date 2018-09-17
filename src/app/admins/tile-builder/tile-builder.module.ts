import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TileBuilderRoutingModule } from './tile-builder-routing.module';
import { TileBuilderComponent } from './tile-builder.component';
import { StatModule } from '../../shared';
import {DndModule} from 'ng2-dnd';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import { GridsterModule } from 'angular-gridster2';
import { BsDropdownModule } from 'ngx-bootstrap';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import {InlineEditorModule} from '@qontu/ngx-inline-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import {MomentizePipe} from '../../shared/pipes/moment-format-pipes.module'


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        AccordionModule.forRoot(),
        TileBuilderRoutingModule,
        StatModule,
        DndModule,
        DragulaModule,
        GridsterModule,
        SharedPipesModule,
        BsDropdownModule.forRoot(),
        InlineEditorModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [DndModule, DragulaModule],
    declarations: [
        TileBuilderComponent
    ]

})
export class TileBuilderModule { }

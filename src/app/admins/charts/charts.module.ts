import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NvD3Module } from 'ng2-nvd3';
import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { StatModule } from '../../shared';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {DndModule} from 'ng2-dnd';
import {ChartModule} from './chart/chart.module';
import { ChartComponent } from './chart/chart.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        NvD3Module,
        ChartsRoutingModule,
        PageHeaderModule,
        StatModule,
        SharedPipesModule,
        NgbModule,
        DragulaModule,
        DndModule,
        FormsModule,
        ChartModule
    ],
    exports: [DragulaModule,DndModule,ChartModule],
    declarations: [ChartsComponent,ChartComponent]
})
export class ChartsModule { }

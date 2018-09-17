import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';


@NgModule({
    imports: [
        CommonModule,
        NvD3Module
    ],
    declarations: []
})
export class ChartModule { }

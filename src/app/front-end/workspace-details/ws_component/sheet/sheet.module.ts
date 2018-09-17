import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotTableModule } from 'ng2-handsontable';

@NgModule({
    imports: [
        CommonModule,
        HotTableModule
    ],
    declarations: [],
    exports: [HotTableModule]
})
export class SheetModule { }

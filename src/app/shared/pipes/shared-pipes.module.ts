import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDateFormatPipe } from './custom-date-format.pipe';
import { KeysPipe } from './object-to-array.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CustomDateFormatPipe, KeysPipe],
    exports:[CustomDateFormatPipe, KeysPipe]
})
export class SharedPipesModule { }

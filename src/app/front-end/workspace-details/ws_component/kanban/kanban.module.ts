import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from 'ng2-dnd';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';
import { SortablejsModule } from "angular-sortablejs";


//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { KanbanFormComponent } from './kanban-form/kanban-form.component';

@NgModule({
    imports: [
        CommonModule,
        DndModule,
        DragulaModule,
        InlineEditorModule,
        DndModule,
        SortablejsModule
    ],
    declarations: [],
    exports: [DndModule,DragulaModule,InlineEditorModule,SortablejsModule]
})
export class KanbanModule { }

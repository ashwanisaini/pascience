import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyWorkspaceRoutingModule } from './my-workspaces-routing.module';
import { MyWorkspaceComponent } from './my-workspaces.component';
import { StatModule } from '../../shared';
import { InlineEditorModule } from '@qontu/ngx-inline-editor';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MyWorkspaceRoutingModule,
        StatModule,
        InlineEditorModule,
        FormsModule
    ],
    declarations: [
        MyWorkspaceComponent
    ],
    exports: [InlineEditorModule,FormsModule]

})
export class MyWorkspaceModule { }

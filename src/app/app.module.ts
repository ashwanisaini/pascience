import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { AuthService } from './shared/services/auth.service';
import { ElasticService } from './shared/services/elastic.service';
import { AlertService } from './shared/services/alert.service';
import { Utils } from './shared/services/utility';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DndModule } from 'ng2-dnd';
import { DragulaService, DragulaModule } from 'ng2-dragula/ng2-dragula';
import { GridsterModule } from 'angular-gridster2';
import { ToastyModule } from 'ng2-toasty';
import { SharedPipesModule } from './shared/pipes/shared-pipes.module';
import { FormWizardModule } from 'angular2-wizard';
import { SortablejsModule } from 'angular-sortablejs';

//import {InlineEditorModule} from '@qontu/ngx-inline-editor';


//import { LayoutModule } from './admins/layout.module';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-4/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CustomFormsModule,
        HttpModule,
        AppRoutingModule,
        NgbModule.forRoot(),
        ToastrModule.forRoot(), // ToastrModule added
        DndModule.forRoot(),
        DragulaModule,
        GridsterModule,
        ToastyModule.forRoot(),
        SharedPipesModule,
        FormWizardModule,
        SortablejsModule.forRoot({ animation: 150 }),
        //InlineEditorModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [Http]
            }
        })
    ],
    exports:[ToastyModule,DndModule],
    providers: [AuthGuard, AuthService, ElasticService, Utils, AlertService, DragulaService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

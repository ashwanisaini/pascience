import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
//import * as moment from 'moment';
//import * as _ from 'lodash';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'fr', 'ur', 'es', 'fa','hi']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur|es|fa|hi/) ? browserLang : 'en');
    }
}

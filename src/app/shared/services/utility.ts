import {Injectable} from "@angular/core";
import * as moment from 'moment';


import {Http} from "@angular/http";
//import {TranslateService} from "ng2-translate";

@Injectable()
export class Utils {
    //static doSomething(val: string) { return val; }
    //static doSomethingElse(val: string) { return val; }

    public generateUUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxyxxxyx4xxxxxyxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    public generateRandomID() {
        var d = new Date().getTime();
        var uuid = 'ctlxxxxyxxxyx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    public dbDate2Format(dbDate){
        return moment(dbDate,'MM-DD-YY');
    }
}
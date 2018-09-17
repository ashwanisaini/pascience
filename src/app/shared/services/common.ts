import {Injectable} from "@angular/core";
import { ElasticService } from './elastic.service';


import {Http} from "@angular/http";
//import {TranslateService} from "ng2-translate";

@Injectable()
export class Common {
    constructor(private _elasticService: ElasticService){}

    public createMetaDataTable = (metadata:any,database_name:string,table_name:string,rowID:string) => {
        this._elasticService.addData(metadata,database_name,'',rowID).subscribe(
            response => {

                //this.getAllSheets(this.userInfo.company_id, 0, 100, 'DESC');
            },
            error => {
                //this.alertMessage = 'Email id already exist. Try with other email id.';
            }
        );
    };



}

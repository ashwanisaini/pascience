import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {routerTransition} from '../../router.animations';
import {AuthService, ElasticService, AlertService, Utils} from '../../shared/services/index';
import * as _ from 'lodash';
import {error} from "util";

@Component({
    moduleId: module.id,
    selector: 'app-data-filters',
    templateUrl: './data-filters.component.html',
    styleUrls: ['./data-filters.component.scss'],
    animations: [routerTransition()]
})

export class DataFiltersComponent implements OnInit {

    public showAllListings:boolean;
    public showAddSheets:boolean;
    public filter:any = {};
    public userInfo: any = {};
    public WorkspaceTables: any;
    public all_filters:any = [];

    constructor(public router: Router, private authService: AuthService,
                private _elasticService: ElasticService,
                private alertService: AlertService,
                private helper: Utils) {

    }

    ngOnInit() {
        this.filter = {};
        this.showAllListings = true;
        this.showAddSheets = false;

        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    console.log(this.userInfo);
                    this.getAllTables(this.userInfo.company_id, 0, 100, 'DESC');
                    this.getAllFilters(this.userInfo.company_id, 0, 100, 'DESC');
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

    }

    openAddWindow = () =>{

        this.showAllListings = false;
        this.showAddSheets = true;

    };

    private getAllTables(company_id: string, offset: number, limit: number, sorttype: string) {
        //let company_id = this.userInfo.company_id;
        this._elasticService.getAllRows(company_id, "exportData", offset, limit, sorttype)
            .subscribe(
                response => {
                    this.WorkspaceTables = response;
                },
                error => {
                    console.log(error);
                }
            );
    }

    private getAllFilters(company_id: string, offset: number, limit: number, sorttype: string) {
        //let company_id = this.userInfo.company_id;
        this._elasticService.getAllRows(company_id, "table_filters", offset, limit, sorttype)
            .subscribe(
                response => {
                    this.all_filters = response;
                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );
    }

    public saveFilter = () => {
        if(this.filter){
            let rowID = this.helper.generateUUID();
            let final_save_data:any = {};
            final_save_data.filter_name = this.filter.name;
            final_save_data.table_name = this.filter.datasource.TableName;
            final_save_data.created = new Date();
            final_save_data.modified = new Date();
            final_save_data.company_id = this.userInfo.company_id;
            final_save_data.user_id = this.userInfo.id;
            final_save_data.workspace_id = '';
            final_save_data.filter_command = this.filter.rule;

            this._elasticService.addData(final_save_data,this.userInfo.company_id,'table_filters',rowID)
                .subscribe(
                    response => {
                        console.log(response);
                        setTimeout(()=>{
                            this.ngOnInit();
                        },1000);

                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }


}

import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {routerTransition} from '../../router.animations';
import {AuthService, ElasticService, AlertService, Utils} from '../../shared/services/index';
import { FileUploader } from 'ng2-file-upload';
import * as _ from 'lodash';
//import {ColorPickerService} from 'angular4-color-picker';
import * as moment from "moment";
//import _date = moment.unitOfTime._date;


const URL = 'http://52.8.103.166:3000/api/containers/kanbanfiles/upload';

@Component({
    moduleId: module.id,
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    animations: [routerTransition()]
})

export class KanbanComponent implements OnInit {
    //@ViewChild('fileInput') fileInput;

    private color: string = "#127bdc";
    public showAllListings = true;
    public all_kanbans: any;
    private userInfo: any;
    public showAddWindow = false;
    public steps:any = {};
    public is_pre_columns:boolean = false;
    public all_filters:any = [];
    public option:any = {};
    // public kanban:any = {};
    // public headers.columns:any= [];
    public kanban:any = {
        name:'',
        kanabantile:'',
        selectedcols:'',
        Kanbancols:'',
        refresh_fequency:'',
        is_label_visible:'',
        col_filter:'',
        col_highlight_rule:'',
        col_highlight_color:'',
        card_editable:true,
        is_user_edit:true,
        selectedHeader:'',
        selectedHeaderType:'',
        headers:{'columns':[]}
    };
    //public kanban.headers:any = [];
    //public kanban.headers.columns = [];
    //public kanban.headers.columns:any = [];
    public kanbanForm:any = {};
    public all_tiles:any = {};
    public showCharts = false;
    public chartsInfo:any = {};

    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;

    public uploader:FileUploader = new FileUploader({
        url: URL
    });

    public tableFields:any = [];
    public tile_data:any;

    constructor(public router: Router, private authService: AuthService,
                private _elasticService: ElasticService,
                private alertService: AlertService,
                private helper: Utils) {

    }

    ngOnInit() {
        //this.kanban = {};
        this.kanban.headers.columns = [];
        this.all_filters = [];
        this.all_kanbans = [];
        this.all_tiles = [];
        this.showAllListings = true;
        this.showAddWindow = false;
        this.option.color = '#1E90FF';
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    this.getAllKanbans();
                    this.getAllTiles();
                    this.getAllFilters(this.userInfo.company_id, 0, 100, 'DESC');
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking user data");
                }
            );
    }

    getAllTiles(){
        this._elasticService.getAllRows(this.userInfo.company_id,'tiles',0,500,'')
            .subscribe(
                response => {
                    this.all_tiles = response;
                    console.log(response);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
                }
            );

    }

    getAllKanbans(){
        this._elasticService.getAllRows(this.userInfo.company_id,'kanban_master',0,100,'DESC','_uid')
            .subscribe(
                response => {
                    this.all_kanbans = response;
                    console.log(response);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
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


    addNewKanban(){
        this.showAllListings = false;
        this.showAddWindow = true;
    }

    resetWindow(){
        this.showAllListings = true;
        this.showAddWindow = false;
    }

    onStep1Next(event){
        console.log(event);

    }

    onStep2Next(event){
        console.log(event);

    }

    onStep3Next(event){
        console.log(event);

    }

    onStep4Next(event){
        console.log(event);

    }

    onComplete(event){
        console.log(this.kanban);
        console.log('form compeleted');

        let re_data:any = {};
        let rowID = this.helper.generateUUID();
        re_data.component_id = rowID;
        re_data.component_name = this.kanban.name;
        re_data.tile_id = this.kanban.kanabantile;
        re_data.cols = this.kanban.selectedcols;
        re_data.mapped_column = this.kanban.kanabancolumn;
        re_data.features = [];
        re_data.header_required = false;
        re_data.filter = this.kanban.col_filter;
        re_data.highlight_filter = this.kanban.col_highlight_rule;
        re_data.highlight_color = this.kanban.col_highlight_color;
        re_data.card_editable = this.kanban.card_editable;
        re_data.is_label_visible = this.kanban.is_label_visible;
        re_data.created = new Date();
        re_data.modified = new Date();
        re_data.company_id = this.userInfo.company_id;
        re_data.refresh_fequency = this.kanban.refresh_fequency;
        re_data.is_user_edit = false;
        re_data.columns = "";
        re_data.header_type = "Image";
        re_data.header_required = this.kanban.selectedHeader;


        if (this.kanban.headers) {
            re_data.columns = this.kanban.headers.columns;
            re_data.header_type = this.kanban.selectedHeaderType;
            re_data.header_required = this.kanban.selectedHeader;
            re_data.is_user_edit = this.kanban.is_user_edit;
        }else {
            let range = {};
            for (let i = 1; i <= re_data.cols; i++) {
                range[i] = "Col_" + i;
            }

            re_data.columns = "";
            re_data.columns = range;
        }

        console.log(re_data);

        this._elasticService.addData(re_data, this.userInfo.company_id,'kanban_master', rowID)
            .subscribe(
                response => {
                    setTimeout(()=>{
                        re_data = {};
                        this.ngOnInit();
                    },1000);
                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while saving kanban designer");
                }
            );

    }

    fileUploadChange(i:number, column:any){
        console.log(i);
        const queueIndex = 0;// Single file upload Concept
        column.file = {};
        column.file_name = this.uploader.queue[queueIndex].file.name;
        this.uploader.queue[queueIndex].upload();
        this.uploader.queue = [];
        console.log(column);
        console.log('file upload changes detected');
    }

    public fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e:any):void {
        this.hasAnotherDropZoneOver = e;
    }


    onHeaderTypeChange = function() {
        console.log('onHeaderTypeChange');
        //this.kanban.headers = [];
        this.kanban.headers.columns = [];
        this.chartsInfo = {};
        this.showCharts = false;
        var tmp_obj:any = {};

        console.log(this.kanban.Kanbancols);
        console.log(Object.keys(this.kanban.Kanbancols).length);


        if (this.kanban.Kanbancols && Object.keys(this.kanban.Kanbancols).length > 0) {
            tmp_obj = {};
            for (let i = 0; i <= this.kanban.Kanbancols.length - 1; i++) {

                tmp_obj = {
                    "col": this.kanban.Kanbancols[i],
                    "actual_col": this.kanban.Kanbancols[i],
                    "file": null
                };

                if (this.kanban.selectedHeaderType == "Image") {
                    tmp_obj.file = null;
                } else {
                    tmp_obj.charts = null;
                }

                this.kanban.headers.columns.push(tmp_obj);

            }

        } else {
            tmp_obj = {};
            for (let i = 1; i <= this.kanban.selectedcols; i++) {

                tmp_obj = {
                    "col": "column" + i,
                    "actual_col": "column" + i,
                    "file": null
                };

                if (this.kanban.selectedHeaderType == "Image") {
                    tmp_obj.file = null;
                } else {
                    tmp_obj.charts = null;
                }

                //      console.log(tmp_obj);
                this.kanban.headers.columns.push(tmp_obj);

            }
            console.log(this.kanban.headers);
        }

        if (this.kanban.selectedHeaderType == "Chart") {
            this.showCharts = true;
            // ElasticAPI.getTableSearch('ELASTIC_CLIENT', $rootScope.dbId, 'chart_data').success(function(response) {
            //     this.chartsInfo = response;
            // });
        }


    };

    checkCols = (tile_id:string) => {

        //console.log(tile_id);
        //console.log(this.all_tiles);
        this.tableFields = [];
        this.tile_data = _.find(this.all_tiles, { 'ROWID': tile_id });
        //console.log(this.tile_data);

        if(this.tile_data){
            //get table cols
            this._elasticService.getAllRows(this.userInfo.company_id, 'tbl_'+this.tile_data.datasourceName+'_metadata', 0, 1, 'DESC')
                .subscribe(
                    response => {
                        // let response_arr = response;
                        let that = this;
                        _.forEach(response[0], function(value:any, key:any) {
                            //console.log(value,'###',key);
                            if(key == 'cal_field_data'){
                                _.forEach(value, function(val:any, keyinner:any) {
                                    that.tableFields.push(val.field_name);
                                });

                            }
                        });
                    },
                    error => {
                        console.log(error);
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                    }
                );

            //console.log(this.tableFields);
        }

    };

    checkUniqueCols = (unique_col:string) => {
        this.kanban.Kanbancols = '';
        this.kanban.selectedcols = '';
        this._elasticService.getAllRows(this.userInfo.company_id, this.tile_data.datasourceName, 0, 1000, 'DESC')
            .subscribe(
                response => {
                    // let response_arr = response;
                    let that = this;
                    let response1 = _.filter(response,function(n:any){
                    //    console.log(n);
                        return n.ROWID != ""
                    });

                    let temp = _.uniq(_.map(response1, unique_col));
                    this.kanban.selectedcols = Object.keys(temp).length;
                    this.kanban.Kanbancols = temp;
                    //console.log(temp);
                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

    };


    matchChartConfig(){

    }

    // optionCheck(option){
    //     //option.color = null;
    //     this.kanban.colHighlightcolor = null;
    // }

    changeColorPickerValue($event,rule){
        this.kanban.col_highlight_color = $event;
    }


}

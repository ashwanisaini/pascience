import {Component, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService, ElasticService, Utils} from "../../../../shared/services";
import * as _ from "lodash";
import * as Handsontable from 'handsontable/dist/handsontable.full.js';

@Component({
  selector: 'app-component-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SheetComponent implements OnInit {
    @Input() component_data: any = [];
    @Input() board: string;

    public colHeaders: any;
    public columns: any[];
    public options: any;
    public userInfo: any = {};
    public table_data:any;
    public isSheetReady:boolean = false;
    public rules:any = [];
    public rule_options:any = [];
    public sheet_properties:any = {};
    public component_details:any;
    public table_meta_data:any;
    public data:any;
    public hot_table_id:string;

    constructor(private _elasticService: ElasticService,
                private authService: AuthService,
                private helper: Utils) {}



    ngOnInit() {
        console.log(this.component_data);
        if(this.component_data){
            this.isSheetReady = false;
            this.hot_table_id = this.helper.generateRandomID();
            this.options = {
                height: 600,
                stretchH: 'all',
                className: 'htCenter htMiddle',
                columnSorting: true,
                contextMenu: true
            };

            this.authService.CheckUserCredentials()
                .subscribe(
                    response => {
                        this.userInfo = response;
                        console.log(this.userInfo);

                    },
                    error => {
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                    }
                );
            let component_id = this.component_data.component_id;
            let company_id = this.component_data.company_id;
            this._elasticService.getData(company_id, 'conditional_formating', component_id)
                .subscribe(
                    response => {
                        this.component_details = response;
                        console.log('***sheet details**');
                        console.log(JSON.stringify(response));
                        this.sheet_properties = {};
                        this.sheet_properties.table_name = this.component_details.table_name;
                        this.sheet_properties.rules = this.component_details.rules;
                        this.sheet_properties.table_data = [];
                        this.continueSheetStep1(this.component_details.table_name);

                    },
                    error => {
                        console.log(error);
                        //this.alertMessage = 'error in response';
                    }
                );

        }
    }

    public continueSheetStep1 = (table_name:string) => {
        if (table_name) {
            this._elasticService.getAllRows(this.userInfo.company_id, 'tbl_' + table_name + '_metadata', 0, 1, 'DESC')
                .subscribe(
                    response => {
                        // let response_arr = response;
                        this.table_meta_data = response;
                        let tmpColumns:any = [];
                        let tmpHeaders:any = [];
                        let that = this;
                        _.forEach(response[0], function (value: any, key: any) {
                            if (key == 'cal_field_data') {
                                _.forEach(value, function (val: any, keyinner: any) {
                                    let tmpdata:any;

                                    if(val.field_datatype == 'DATE'){
                                        tmpdata = {type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true};
                                    }else if(val.field_datatype == 'INTEGER'){
                                        tmpdata = {type: 'numeric', format: '0.00'};
                                    }else{
                                        tmpdata = {type: 'text'};
                                    }

                                    tmpColumns.push(tmpdata);
                                    tmpHeaders.push(val.field_name);

                                });
                            }
                        });

                        this.columns = tmpColumns;
                        this.colHeaders = tmpHeaders;
                        this.loadSheetData(table_name);
                    },
                    error => {
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                    }
                );
        }

    };

    public loadSheetData = (table_name:string) => {
        this.data = [];
        this._elasticService.getAllRows(this.userInfo.company_id, table_name, 0, 10000, 'DESC')
            .subscribe(
                response => {
                    this.table_data = response;
                    this.data = this.reorderData(_.values(response),this.colHeaders);
                    this.applyRules();
                    this.isSheetReady = true;
                },
                error=>{

                }
            );
    };


    private reorderData = (data:any,columns:any) => {
        let final_data:any = [];

        _.forEach(data, function (val: any, keyinner: any) {
            let tmp_data_parent:any = [];
            _.forEach(columns, function (column: any, keyinner: any) {
                let tmp_data_child:any = [];
                tmp_data_child = val[column];
                tmp_data_parent.push(val[column]);
            });
            final_data.push(tmp_data_parent);
        });
        return final_data;
    };

    applyRules(){
        this.options = {
            height: 600,
            stretchH: 'all',
            className: 'htCenter htMiddle',
            columnSorting: true,
            contextMenu: true,
            cells: (row, col, prop): any => {
                const cellProperties: any = {};
                Object.assign(cellProperties, {renderer: this.boldAndAlignRenderer});
                cellProperties.custom_rules = this.sheet_properties.rules;
                return cellProperties;
            }
        };

    }

    boldAndAlignRenderer(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        _.forEach(cellProperties.custom_rules, function (rule: any, keyinner: any) {
            let hotcolname = instance.getColHeader(col);
            if(rule.condition.column === hotcolname){
                //proceed with formatting
                let format = rule.format;
                if(rule.condition.where == 'is Equal to' && value == rule.condition.value1){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Not Equal to' && rule.condition.value1){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'contains' && value.indexOf(rule.condition.value1) >= 0){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Greater than' && value >= rule.condition.value1){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Less than' && value <= rule.condition.value1){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Blank' && value == ''){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Not blank' && value !== ''){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }else if(rule.condition.where == 'is Between' && (value >= rule.condition.value1 && value <= rule.condition.value2)){
                    td.style.fontWeight = format.font;
                    td.style.verticalAlign = 'middle';
                    td.style.color = format.color;
                }
            }

        });


    }

}

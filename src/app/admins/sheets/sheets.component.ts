import {Component, OnInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {getFinanceData} from './data';
import {routerTransition} from '../../router.animations';
import {AuthService, ElasticService, AlertService, Utils} from '../../shared/services/index';
import {DragulaService} from 'ng2-dragula';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';
import * as _ from "lodash";
import * as Handsontable from 'handsontable/dist/handsontable.full.js';


@Component({
    selector: 'app-sheets',
    templateUrl: './sheets.component.html',
    styleUrls: ['./sheets.component.scss'],
    animations: [routerTransition()]
})
export class SheetsComponent implements OnInit {
    closeResult: string;
    public data: any[];
    public colHeaders: any;
    public columns: any[];
    public options: any;
    public showAllListings = true;
    public showAddSheets = false;
    public WorkspaceTables: any;
    public userInfo: any = {};
    public allSheets: any;
    public objTblSelected: any = {'TableName': ''};
    public table_data:any;
    public isSheetReady:boolean = false;
    public rules:any = [];
    public rule_options:any = [];
    public sheetTitle:string;
    public table_meta_data:any;
    public ruleSelectedColumn:string;


    constructor(public router: Router,
                private authService: AuthService,
                private _elasticService: ElasticService,
                private alertService: AlertService,
                private dragulaService: DragulaService,
                private helper: Utils,
                private modalService: NgbModal,
                private toastyService: ToastyService,
                private toastyConfig: ToastyConfig,private _elementRef : ElementRef) {


        //this.data = getFinanceData();
        // this.colHeaders = ['Price', 'Date', '1D Chg', 'YTD Chg', 'Vol BTC'];
        // this.columns = [
        //     {type: 'numeric', format: '$0,0.00'},
        //     {type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true},
        //     {type: 'numeric', format: '0.00%'},
        //     {type: 'numeric', format: '0.00%'},
        //     {type: 'numeric', format: '0.00'}
        // ];


    }

    ngOnInit() {
        this.isSheetReady = false;
        this.options = {
            height: 600,
            stretchH: 'all',
            className: 'htCenter htMiddle',
            columnSorting: true,
            contextMenu: true
        };
        // this.rule_options = ['is Equal to','is Not Equal to',
        //     'contains','is Greater than','is Less than','is Between','is Blank','is Not blank','is a Number','is Not a Number'];

        this.rule_options = [
            {'label':'is Equal to','value_required':1},
            {'label':'is Not Equal to','value_required':1},
            {'label':'contains','value_required':1},
            {'label':'is Greater than','value_required':1},
            {'label':'is Less than','value_required':1},
            {'label':'is Between','value_required':2},
            {'label':'is Blank','value_required':0},
            {'label':'is Not blank','value_required':0},
            {'label':'is a Number','value_required':0},
            {'label':'is Not a Number','value_required':0},
        ];
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    console.log(this.userInfo);
                    this.getAllTables(this.userInfo.company_id, 0, 100, 'DESC');
                    this.getAllSheets(this.userInfo.company_id, 0, 100, 'DESC');
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

    }



    private getAllTables(company_id: string, offset: number, limit: number, sorttype: string) {
        //let company_id = this.userInfo.company_id;
        this._elasticService.getAllRows(company_id, "exportData", offset, limit, sorttype)
            .subscribe(
                response => {
                    this.WorkspaceTables = response;
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );
    }


    private getAllSheets(company_id: string, offset: number, limit: number, sorttype: string) {
        //let company_id = this.userInfo.company_id;
        this._elasticService.getAllRows(company_id, "conditional_formating", offset, limit, sorttype)
            .subscribe(
                response => {
                    console.log(response);
                    this.allSheets = response;
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );
    }

    public continueSheetDesigner = (table) => {
        if (table) {
            //console.log(table);
            // map with old tables
            //this.isMappedTile = true;
            this.objTblSelected = table;
            //get selected table fields
            //console.log('tbl_' + table.TableName + '_metadata');
            this._elasticService.getAllRows(this.userInfo.company_id, 'tbl_' + table.TableName + '_metadata', 0, 1, 'DESC')
                .subscribe(
                    response => {
                        // let response_arr = response;
                        this.table_meta_data = response;
                        let tmpColumns:any = [];
                        let tmpHeaders:any = [];
                        let that = this;
                        _.forEach(response[0], function (value: any, key: any) {

                            //console.log(value, '###', key);
                            if (key == 'cal_field_data') {
                                _.forEach(value, function (val: any, keyinner: any) {
                                    //console.log(val);
                                    let tmpdata:any;
                                    if(val.field_datatype == 'DATE'){
                                        tmpdata = {type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true};
                                    }else if(val.field_datatype == 'INTEGER'){
                                        tmpdata = {type: 'numeric', format: '0.00'};
                                    }else{
                                        tmpdata = {type: 'text'};
                                    }
                                    //this.columns.push(tmpdata);
                                    //console.log(tmpdata);
                                    tmpColumns.push(tmpdata);
                                    tmpHeaders.push(val.field_name);

                                });
                            }
                        });

                        this.columns = tmpColumns;
                        this.colHeaders = tmpHeaders;
                        this.loadSheetData();

                        console.log(this.colHeaders);
                        //console.log(this.columns);
                        //console.log(tmp_fields);
                        //this.WorkspaceTables = response;
                    },
                    error => {
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                    }
                );
        }
        this.showAllListings = false;
        this.showAddSheets = true;
    };

    public loadSheetData = () => {
      this.data = [];
        this._elasticService.getAllRows(this.userInfo.company_id, this.objTblSelected.TableName, 0, 10000, 'DESC')
            .subscribe(
                response => {
                    // console.log(response);
                    // console.log(_.values(response));
                    //this.data = _.values(response);
                    this.table_data = response;
                    this.data = this.reorderData(_.values(response),this.colHeaders);



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
        console.log(final_data);
        console.log(this.colHeaders);

        return final_data;
    };


    open(content, size:any ='md') {
        this.modalService.open(content,{size:size}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }


    public updateSelectedColumn = ($event,column) => {
      console.log($event);
      //console.log(column);
      this.ruleSelectedColumn = $event.target.value;
    };

    public addRule = (column:any) => {
        console.clear();
        console.log(column);
        let rule:any = {};
        rule.id = this.helper.generateRandomID();
        rule.condition = {'column':column,'where':'','value1':'','value2':''};
        rule.format = {'color':'#CCC','font':'bold'};
        rule.applied_to = 'entire row';
        rule.created = new Date();
        this.rules.push(rule);
    };

    public viewRule = (rule_id:string) => {
        console.log(rule_id);
    };

    public selectColumn = () => {

    };


    public saveSheetForm = () => {
      console.log('save sheet', this.sheetTitle);
      if(this.sheetTitle !==''){
          //console.log(this.table_data);
          let that = this;
          let columns:any = [];
          columns = this.colHeaders;
          let temp_table_data:any =_.map(this.table_data,function(row,key){
             return row = _.pick(row, columns);

          });

          let temp_data:any = {};
          _.forEach(temp_table_data,function (row:any,key) {
              let ROWID = that.helper.generateUUID();
              //let tmp_obj:any = {};
              temp_data[ROWID] = row;
              //temp_data.push(tmp_obj);
          });
          // //console.log(final_data);
          let rowID = this.helper.generateUUID();
          let rel_data:any = {};
          rel_data.TableName = this.sheetTitle;
          let final_data:any = temp_data;//JSON.stringify(temp_data);
          let meta_table_name:string= 'tbl_' + this.sheetTitle + '_metadata';
          //console.log(final_data);
          //console.log(this.table_meta_data);
          let json_table_meta_data = this.table_meta_data[0];
          console.log(final_data);
          this._elasticService.addData(json_table_meta_data, this.userInfo.company_id, meta_table_name, this.helper.generateUUID())
              .subscribe(
              response => {
                  this._elasticService.addData(rel_data, this.userInfo.company_id,'exportData', rowID)
                      .subscribe(
                          response => {
                              console.log(response);
                              this._elasticService.addBulkData(final_data,this.userInfo.company_id,this.sheetTitle)
                                  .subscribe(
                                      response => {
                                          console.log(response);
                                          //save conditional formatting rules
                                           this.saveRules(rowID);
                                      },
                                      error=>{
                                          console.log(error);
                                      }
                                  );
                          },
                          error=>{
                              console.log(error);
                          }
                      );

              },
              error => {
                  console.log(error);
              }
          );
        };
    };

    public saveRules = (table_id:string) => {
        if(this.rules) {
            let data:any = {
                table_id: table_id,
                table_name : this.sheetTitle,
                created : new Date(),
                modified : new Date(),
                company_id : this.userInfo.company_id,
                status : 1,
                rules : this.rules
            };
            let rowID = this.helper.generateUUID();
            console.log(data);
            this._elasticService.addData(data,this.userInfo.company_id,'conditional_formating',rowID)
            .subscribe(
                response => {
                    console.log(response);
                    //save conditional formatting rules
                    this.getAllTables(this.userInfo.company_id, 0, 100, 'DESC');
                    this.getAllSheets(this.userInfo.company_id, 0, 100, 'DESC');
                    this.showAddSheets = false;
                    this.showAllListings = true;
                },
                error => {
                    console.log(error);
                }
            );
        }
    };

    changeColorPickerValue($event,rule){
        rule.format.color = $event;
    }

    applyRules(){
        console.log(JSON.stringify(this.rules));
        //console.log(this.rules);
        //console.log(this.columns);
        this.options = {
            height: 600,
            stretchH: 'all',
            className: 'htCenter htMiddle',
            columnSorting: true,
            contextMenu: true,
            cells: (row, col, prop): any => {
                //console.log(this.instance.getDataAtCol(col));;

                const cellProperties: any = {};
                Object.assign(cellProperties, {renderer: this.boldAndAlignRenderer});
                // if (row === 0) {
                //     Object.assign(cellProperties, {renderer: this.headerRenderer});
                // } else if (row === 1) {
                //     Object.assign(cellProperties, {renderer: this.boldAndAlignRenderer});
                // }

                cellProperties.custom_rules = this.rules;

                // if ([1, 2, 3].indexOf(row) !== -1 && col >= 1) {
                //     cellProperties.readOnly = true;
                // }
                //
                // const a42 = Array.apply(0, Array(42)).map((x, y) => y + 1);
                // if (a42.indexOf(row) !== -1 && col >= 1) {
                //     cellProperties.type = 'numeric';
                //     cellProperties.numericFormat = { pattern: '$0,0.00', culture: 'en-US' };
                // }

                return cellProperties;

            }
            };

    }

    deleteRule(rule:any){
        let index = this.rules.indexOf(rule);
        this.rules.splice(index, 1);
    }

    boldAndAlignRenderer(instance, td, row, col, prop, value, cellProperties) {
        // tslint:disable-next-line:no-invalid-this
        //console.log(cellProperties.custom_rules[0]['condition']);
        //console.log(cellProperties.custom_rules[0]['format']);


        Handsontable.renderers.TextRenderer.apply(this, arguments);
         _.forEach(cellProperties.custom_rules, function (rule: any, keyinner: any) {
             console.log(rule);
             let hotcolname = instance.getColHeader(col);
             if(rule.condition.column === hotcolname){
                //proceed with formatting
                 let format = rule.format;
                 console.log(format);

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

    // headerRenderer(instance, td, row, col, prop, value, cellProperties) {
    //     // tslint:disable-next-line:no-invalid-this
    //
    //     Handsontable.renderers.TextRenderer.apply(this, arguments);
    //     td.style.fontWeight = 'bold';
    //     td.style.textAlign = 'center';
    //     console.log(instance);
    //
    //     console.log();
    // }





}

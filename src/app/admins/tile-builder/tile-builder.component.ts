import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { AuthService, ElasticService, AlertService, Utils } from '../../shared/services/index';
import { DragulaService } from 'ng2-dragula';
import { GridsterConfig, GridsterItem }  from 'angular-gridster2';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
//import {MomentizePipe} from '../../shared/pipes/moment-format-pipes.module'
//import { BsDropdownModule } from 'ngx-bootstrap';

@Component({
    moduleId: module.id,
    selector: 'app-dashboard',
    templateUrl: 'tile-builder.component.html',
    styleUrls: ['tile-builder.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    animations: [routerTransition()]
})

export class TileBuilderComponent implements OnInit {
    public form: any = [];
    public userInfo = {id:null,'company_id':null};
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public allUsers: Array<any> = [];
    public alertMessage;
    public options: GridsterConfig;
    public dashboard: Array<GridsterItem>;
    public formTitle = '';
    public titleHeader = false;
    public isEditTitle = false;
    public itemProperties:any = [];
    public droplists:any = [];
    public allTiles = [];
    public WorkspaceTables = [];
    public isMappedTile = false;
    public objTblSelected = {'TableName':''};
    public tableFields = [];
    public modalRef: NgbModalRef;
    public properties_index = 0;
    private meta_fields = {
        field_name : null,
        field_alias : null,
        field_datatype : null,
        field_visible_boolean : false,
        field_format : null,
        field_options : null,
        foreign_key_table : null,
        foreign_key_field : null,
        addititive_boolean : false,
        dimension_or_fact : null,
        calculation_formula : null,
        calculated_persist_boolean : false,
        recalculation_frequency : null,
        is_editable : false,
    };

    private meta_cal_fields = {
        field_name : null,
        field_alias : null,
        field_datatype : null,
        field_visible_boolean : null,
        field_format : null,
        field_options : null,
        foreign_key_table : null,
        foreign_key_field : null,
        addititive_boolean : null,
        dimension_or_fact : null,
        calculation_formula : null,
        calculated_persist_boolean : null,
        recalculation_frequency : null,
    };

    private tbl_metadata_final = {
        field_data:null,
        cal_field_data:null,
        source_connectivity: null
    };


    //public droplists = {basic:{},workflow:[],data:[],social:[],rules:[],others:[]};
    public isCollapsed = false;
    public status: any = {
        isFirstOpen: true,
        isOpen: true,
        isFirstDisabled:false
    };

    public showAllListings = true;
    public showAddTiles = false;
    public showEditTiles = false;
    public modalEvents = {};


    public msg = '';
    public simpleDrop: any = null;
    public groups: any[] = [
        {
            title: 'Dynamic Group Header - 1',
            content: 'Dynamic Group Body - 1'
        },
        {
            title: 'Dynamic Group Header - 2',
            content: 'Dynamic Group Body - 2'
        }
    ];

    public transferData: Object = {id: 1, msg: 'Hello'};
    public receivedData: Array<any> = [];
    closeResult: string;

   // private modalRef: NgbModalRef;

    constructor(public router: Router,
                private authService: AuthService,
                private _elasticService:ElasticService,
                private alertService: AlertService,
                private dragulaService:DragulaService,
                private helper: Utils,
                private modalService: NgbModal,
                private toastyService:ToastyService,
                private toastyConfig: ToastyConfig) {

        // this.form = this.fb.group({
        //     'first_name': ['', Validators.compose([Validators.required])],
        //     'last_name': ['', Validators.compose([Validators.required])]
        // });
        // dragulaService.drag.subscribe((value:any) => {
        //     // console.log(`drag: ${value[0]}`); // value[0] will always be bag name
        //     this.onDrag(value.slice(1));
        // });
        // dragulaService.drop.subscribe((value:any) => {
        //     // console.log(`drop: ${value[0]}`);
        //     this.onDrop(value.slice(1));
        // });
        // dragulaService.over.subscribe((value:any) => {
        //     // console.log(`over: ${value[0]}`);
        //     this.onOver(value.slice(1));
        // });
        // dragulaService.out.subscribe((value:any) => {
        //     // console.log(`out: ${value[0]}`);
        //     this.onOut(value.slice(1));
        // });
        this.toastyConfig.theme = 'default';

    }

    ngOnInit() {
    this.showAllListings = true;
    this.showAddTiles = false;
       this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    console.log(this.userInfo);
                    this.getAllTables(this.userInfo.company_id, 0, 100, 'DESC');
                    this.getAllTiles(this.userInfo.company_id, 0, 100, 'DESC');
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );

        this.formTitle = "new_tile_" + this.helper.generateRandomID();

        // this.droplists['basic'] = [
        //     {
        //
        //         'type' :'text_input',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'options':[],
        //         'tags':[]
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'text_area',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'options':[],
        //         'tags':[]
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'checkbox',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'options':['Option One', 'Option Two'],
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'tags':[]
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'slider',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'options':[],
        //         'tags':[]
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'radio',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'options':['Option One', 'Option Two'],
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'tags':[]
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'select',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'options':['Option One', 'Option Two'],
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'tags':[]
        //
        //     },
        //     {
        //         //'ctl_id': this.helper.generateRandomID(),
        //         'type' :'date',
        //         'label' :'Label',
        //         'value' :null,
        //         'placeholder' :'placeholder here',
        //         'required' :false,
        //         'help-text' :null,
        //         'minimise' :false,
        //         'map_field'  : null,
        //         'table-mapping':{
        //             'field_name':''
        //         },
        //         'options':[],
        //         'tags':[]
        //     }
        // ];
        this.droplists['basic'] = ['text_input','text_area','checkbox','radio','select','date'];
        this.droplists['workflow'] = ["Task List", "Approval List", "Workflow"];
        this.droplists['data'] = ["Models", "KPI", "Chart", "Sheets", "Data Change track"];
        this.droplists['social'] = ["Chat", "Tags", "News"];
        this.droplists['rules'] = ["Condition Format", "Action Rules"];
        this.droplists['others'] = ["Map", "Picture", "External (iFrame)", "Attachments"];

        this.options = {
            gridType:'verticalFixed',
            itemChangeCallback: TileBuilderComponent.itemChange,
            itemResizeCallback: TileBuilderComponent.itemResize,
            fixedColWidth: 50, // fixed col width for gridType: 'fixed'
            fixedRowHeight: 100, // fixed row height for gridType: 'fixed'
            compactType:'compactUp&Left',
            maxCols:6,
            minRows:2,
            draggable: {
                enabled: true, // enable/disable draggable items
                ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
                ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
                dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
                stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
                start: undefined // callback when dragging an item starts.
                // Arguments: item, gridsterItem, event
            }
        };

        this.dashboard = [];

        //this.addToast();

    }

    static itemChange(item, itemComponent) {
        console.info('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        console.info('itemResized', item, itemComponent);
    }

    changedOptions() {
        this.options.api.optionsChanged();
    }

    removeItem(item) {
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }

    addItem(obj:string) {
        console.log(obj);
        //obj.ctl_id = this.helper.generateRandomID();
        let element:any;
        switch (obj){
            case "text_input":
                element = {
                            'ctl_id': this.helper.generateRandomID(),
                            'type' :'text_input',
                            'label' :'Label',
                            'value' :null,
                            'placeholder' :'placeholder here',
                            'required' :false,
                            'help_text' :null,
                            'minimise' :false,
                            'backview' :false,
                            'map_field'  : null,
                            'options':[],
                            'tags':[]
                };
                break;
            case "text_area":
                element = {
                    'ctl_id': this.helper.generateRandomID(),
                    'type' :'text_area',
                    'label' :'Label',
                    'value' :null,
                    'placeholder' :'placeholder here',
                    'required' :false,
                    'help_text' :null,
                    'minimise' :false,
                    'backview' :false,
                    'map_field'  : null,
                    'options':[],
                    'tags':[]
                };
                break;
            case "checkbox":
                element = {
                    'ctl_id': this.helper.generateRandomID(),
                    'type' :'checkbox',
                    'label' :'Label',
                    'value' :null,
                    'placeholder' :'placeholder here',
                    'required' :false,
                    'help_text' :null,
                    'minimise' :false,
                    'backview' :false,
                    'map_field'  : null,
                    'options':['value1','value2'],
                    'tags':[]
                };
                break;

            case "radio":
                element = {
                    'ctl_id': this.helper.generateRandomID(),
                    'type' :'radio',
                    'label' :'Label',
                    'value' :null,
                    'placeholder' :'placeholder here',
                    'required' :false,
                    'help_text' :null,
                    'minimise' :false,
                    'backview' :false,
                    'map_field'  : null,
                    'options':['value1','value2'],
                    'tags':[]
                };
                break;

            case "select":
                element = {
                    'ctl_id': this.helper.generateRandomID(),
                    'type' :'select',
                    'label' :'Label',
                    'value' :null,
                    'placeholder' :'placeholder here',
                    'required' :false,
                    'help_text' :null,
                    'minimise' :false,
                    'backview' :false,
                    'map_field'  : null,
                    'options':['value1','value2'],
                    'tags':[]
                };
                break;

            case "date":
                element = {
                    'ctl_id': this.helper.generateRandomID(),
                    'type' :'date',
                    'label' :'Label',
                    'value' :null,
                    'placeholder' :'placeholder here',
                    'required' :false,
                    'help_text' :null,
                    'minimise' :false,
                    'backview' :false,
                    'map_field'  : null,
                    'options':[],
                    'tags':[]
                };
                break;
            default:
                element = {};
        }
        this.dashboard.push(element);
    }

    convertOptionStringToValue(optString:string){
        let value = optString.split(',');
        console.log(value);
        return value;
    }

    transferDataSuccess($event: any) {
        console.log($event);
        this.receivedData.push($event);
        // let tmpObj = {
        //     'cols':1,
        //     'rows':1,
        //     'y':0,
        //     'x':2
        // };
        // //console.log(this.options.api.getNextPossiblePosition(this.dashboard));

        this.addItem($event.dragData);
    }
    showControlProperties(content,item,index:number){

        //let content;
        console.log(item);
        if(item.options){
            item.optionsString = item.options.join(',');
            //data.options = this.convertOptionStringToValue(data.optionsString);
        }

        this.itemProperties[index] = item;
        this.properties_index = index;
        //this.itemProperties.ctl_id = this.helper.generateRandomID();
        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            console.log(reason);
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

    }

    private getDismissReason(reason: any): string {
        console.log('reason3',this.closeResult);
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return  `with: ${reason}`;
        }
    }

    addToast() {
        // Just add default Toast with title only
        // this.toastyService.default('Hi there');
        // // Or create the instance of ToastOptions
        // var toastOptions:ToastOptions = {
        //     title: "My title",
        //     msg: "The message",
        //     showClose: true,
        //     timeout: 50000,
        //     theme: 'default',
        //     onAdd: (toast:ToastData) => {
        //         console.log('Toast ' + toast.id + ' has been added!');
        //     },
        //     onRemove: function(toast:ToastData) {
        //         console.log('Toast ' + toast.id + ' has been removed!');
        //     }
        // };
        // // Add see all possible types in one shot
        // this.toastyService.info(toastOptions);
        // this.toastyService.success(toastOptions);
        // this.toastyService.wait(toastOptions);
        // this.toastyService.error(toastOptions);
        // this.toastyService.warning(toastOptions);
    }

    private getAllTiles(company_id:string, offset:number, limit:number, sorttype:string){
        //let company_id = this.userInfo.company_id;
        this._elasticService.getAllRows(company_id, "tiles", offset, limit, sorttype)
            .subscribe(
                response => {
                    this.allTiles = response;
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );
    }

    private getAllTables(company_id:string, offset:number, limit:number, sorttype:string){
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

    public continueTileDesigner(table){
        if(table){
            console.log(table);
            // map with old tables
            this.isMappedTile = true;
            this.objTblSelected = table;
            //get selected table fields
            console.log('tbl_' + table.TableName + '_metadata');
            this._elasticService.getAllRows(this.userInfo.company_id, 'tbl_'+table.TableName+'_metadata', 0, 1, 'DESC')
            .subscribe(
                response => {
                   // let response_arr = response;
                     let that = this;
                    _.forEach(response[0], function(value:any, key:any) {
                        console.log(value,'###',key);
                        if(key == 'cal_field_data'){
                            _.forEach(value, function(val:any, keyinner:any) {
                                that.tableFields.push(val.field_name);
                                //console.log(this.tableFields);
                            });
                        }
                    });
                    //console.log(tmp_fields);
                    //this.WorkspaceTables = response;
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                }
            );




        }else{
            //create new table
            this.isMappedTile = false;
            this.objTblSelected = {'TableName':''};
        }
        console.log(this.tableFields);
        this.showAllListings = false;
        this.showAddTiles = true;

    }


    savePropertyModal(data){
        console.log(data);
        if(data.optionsString){
            data.options = this.convertOptionStringToValue(data.optionsString);
        }
        console.log(data);
        this.modalRef.close();
    }

    deletePropertyModal(data){
        console.log(data);
        this.modalRef.close();
    }

    closePropertyModal(data){
        console.log(data);
        this.modalRef.close();
    }

    saveTileForm(){
        console.log('saved tile form called');
        console.log(this.dashboard);
        var len = Object.keys(this.dashboard).length;

        if (len < 1) {
            //showError('Please add some controls before saving the tile.');
            console.log('len is #',len);
            return false;
        }
        //console.log('working till here');
        var rowID = this.helper.generateUUID();
        var form_data;
        form_data = {
            'title': this.formTitle,
            'userId': this.userInfo.id,
            'company_id': this.userInfo.company_id,
            'datasourceName': this.formTitle.trim(),
            'formName': this.formTitle,
            'created': new Date(),
            'modified': new Date(),
            'formData': this.dashboard,
            'is_existing_table': this.isMappedTile
        };
        console.log(form_data);

        var checkMinimise = 0;
        var checkBackView = 0;

        _.each(form_data.formData, function(value, key) {
            if (value.minimise == true) {
                checkMinimise = checkMinimise + 1;
            }
            if (value.backview == true) {
                checkBackView = checkBackView + 1;
            }

        });

        if (checkBackView == len) {
            alert("You cannot have all form components in back view");
            //showError("You cannot have all form components in back view");
            return;
        }


        if(this.isMappedTile){
            //tile is mapped to existing table data
            form_data.datasourceName = this.objTblSelected.TableName;
            form_data.is_existing_table = true;
            console.log(form_data);

            this._elasticService.addData(form_data, this.userInfo.company_id,'tiles', this.helper.generateUUID())
                .subscribe(
                    response => {
                        console.log('2');
                        console.log('tile saved');
                        var that = this;
                        setTimeout(function(){
                                that.ngOnInit();
                            }, 1000);

                        //this.router.navigate(['/admin/tile-builder']);
                     },
                    error => {
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                        console.log(error);
                    }
                );


        }else{
            //tile is new
            var data_field_json = [];
            var cal_field_json = [];

            for(var i = 1;i <= len; i++){
                var fields = this.meta_fields;
                fields.field_name = form_data.formData[ i- 1 ].label;
                fields.field_alias = form_data.formData[ i-1 ].label;
                data_field_json.push(fields);

                var cal_field_inner_json = this.meta_cal_fields;
                cal_field_inner_json.field_name = form_data.formData[ i-1 ].label;
                cal_field_inner_json.field_alias = form_data.formData[ i-1 ].label;
                cal_field_json.push(cal_field_inner_json);
            }

            var tbl_metadata_final = this.tbl_metadata_final;
            tbl_metadata_final.field_data = data_field_json;
            tbl_metadata_final.cal_field_data = cal_field_json;
            var connectionSrc = {
                source: this.formTitle.trim(),
                external_refresh_boolean: "optiomakeLocal"
            };

            tbl_metadata_final.source_connectivity = connectionSrc;
            var rowId = this.helper.generateUUID();

            //check if tablename exist
            this._elasticService.getCountRows(this.userInfo.company_id, this.formTitle.trim(),'')
                .subscribe(
                    response=>{
                        console.log('1');
                        var resp:any = response['count'];
                        console.log('count');
                        console.log(resp);

                        if(resp == 0){
                            //continue add new tile
                            console.log('OK');
                            this._elasticService.addData(form_data, this.userInfo.company_id,'tiles', rowId)
                                .subscribe(
                                    response => {
                                        console.log('2');
                                         let resp:any = response;
                                         //add reference to exportdata table
                                         let rel_data:any = {
                                             TableName: this.formTitle.trim()
                                           };
                                         this._elasticService.addData(rel_data, this.userInfo.company_id,'exportData', rowId)
                                            .subscribe(
                                                response=>{
                                                    console.log('3');
                                                    //
                                                    let meta_table_name = "tbl_" + this.formTitle.trim() + "_metadata";
                                                    let rel_metadata = {};
                                                    rel_metadata = {
                                                        metaTableName : meta_table_name,
                                                        tb_name : this.formTitle.trim()
                                                    };
                                                    //rel_metadata.tb_name = this.formTitle.trim();
                                                    this._elasticService.addData(rel_metadata, this.userInfo.company_id,'exportMetaData', this.helper.generateUUID())
                                                        .subscribe(
                                                            response=>{
                                                                console.log('4');
                                                                //
                                                                this._elasticService.addData(tbl_metadata_final, this.userInfo.company_id, meta_table_name, this.helper.generateUUID())
                                                                    .subscribe(
                                                                        response=>{
                                                                            //all data saved and now go to listing page
                                                                            console.log('tile saved');
                                                                            var that = this;
                                                                            setTimeout(function(){
                                                                                that.ngOnInit();
                                                                            }, 1000);
                                                                            //this.router.navigate(['/admin/tile-builder']);

                                                                        },
                                                                        error=>{
                                                                            console.log(error);

                                                                        }
                                                                    )

                                                            },
                                                            error=>{
                                                                console.log(error);

                                                            }
                                                        )

                                                },
                                                error=>{
                                                    //could not add entry to exportdata table
                                                    console.log(error);

                                                }
                                            )



                                    },
                                    error => {
                                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                                        console.log(error);
                                    }
                                );

                        }else{
                            //table already exist
                            console.log("table already exist");
                        }

                    },
                    error=>{
                        console.log(error);
                    }
                );
            return;

            // this._elasticService.addData(form_data, this.userInfo.company_id,'tiles', rowId)
            //     .subscribe(
            //         response => {
            //             // let response_arr = response;
            //
            //
            //         },
            //         error => {
            //             //this.alertMessage = 'Email id already exist. Try with other email id.';
            //         }
            //     );



        }

        //var tbl_meta_data = {};
        // var data_field_json = [];
        // var cal_field_json = [];
        //
        // for(var i = 1;i <= len; i++){
        //     var fields = this.meta_fields;
        //     fields.field_name = form_data.formData[ i- 1 ].label;
        //     fields.field_alias = form_data.formData[ i-1 ].label;
        //     data_field_json.push(fields);
        //
        //     var cal_field_inner_json = this.meta_cal_fields;
        //     cal_field_inner_json.field_name = form_data.formData[ i-1 ].label;
        //     cal_field_inner_json.field_alias = form_data.formData[ i-1 ].label;
        //     cal_field_json.push(cal_field_inner_json);
        // }
        //
        // var tbl_metadata_final = this.tbl_metadata_final;
        // tbl_metadata_final.field_data = data_field_json;
        // tbl_metadata_final.cal_field_data = cal_field_json;
        // var connectionSrc = {
        //     source: this.formTitle.trim(),
        //     external_refresh_boolean: "optiomakeLocal"
        // };
        //
        // tbl_metadata_final.source_connectivity = connectionSrc;

        //console.log(tbl_metadata_final);
        return;

    }


    deleteTile = (tile:any) => {
        let isConfirm = confirm('Are you sure want to delete selected tile and all associated data? This action cannot be rolled back.');
        if (isConfirm) {


            this._elasticService.deleteData(this.userInfo.company_id,'tiles', tile.ROWID)
                .subscribe(
                    response => {
                        console.log('tile deleted');
                        this.ngOnInit();
                    },
                    error => {
                        console.log(error);
                    }
                );

        }
    };



}

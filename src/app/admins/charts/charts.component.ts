import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { routerTransition } from '../../router.animations';
import {AuthService, ElasticService, AlertService, Utils} from '../../shared/services/index';
import { DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';
//import ChartProperty from './chart-property';


@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    // bar chart
    public all_charts:any = [];
    public userInfo:any = {};
    public showAllListings:boolean = true;
    public showAddWindow:boolean = false;
    public all_tables:any = [];
    public active_table:any = {};
    public table_columns:any = [];
    public chart_rows: Array<string> = [];
    public chart_columns: Array<string> = [];
    public chart_properties:any = {};
    public chart_agg_type:any;
    public chart_types : any = [];
    public selected_chart:any;
    public dragulaOptions: any = {
        copy: true,
        revertOnSpill: true
    };
    public chart_format:any = {
        "general": {
            "stacked": "stack1",
            "multi_series": "no",
            "drilldown": "no",
            "show_data_values": "on"
        },
        "xaxis": {
            "title": "X Axis",
            "label_rotation": "off"
        },
        "yaxis": {
            "title": "Y Axis",
            "scale": "log",
            "interval": null,
            "min": 0,
            "max": null
        },
        "overlay": {
            "overlay": null,
            "axis_view": null,
            "title": null,
            "scale": null,
            "interval": null,
            "min": null,
            "max": null
        },
        "legend": {
            "position": "top",
            "truncation": "log",
            "schema": "rgb(2,8,0)"
        }
    };

    constructor(public router: Router,
                private authService: AuthService,
                private _elasticService: ElasticService,
                private alertService: AlertService,
                private helper: Utils,
                private dragulaService:DragulaService) {

        this.chart_properties = {
            'color':'red',
            'type':'',
            'rows':'',
            'columns':'',
            'aggregation':'SUM',
            'data':''
        };

        this.chart_types = [{
            "id": "1",
            "name": "Line Chart",
            "icon": 'assets/images/chart_icons/line.png',
            "chart_type": "Line Chart"
        }, {
            "id": "2",
            "name": "Area Chart",
            "icon": 'assets/images/chart_icons/area.png',
            "chart_type": "Area Chart"
        }, {
            "id": "3",
            "name": "Bar Chart",
            "icon": 'assets/images/chart_icons/bar.png',
            "chart_type": "Horizontalbar Chart"


        }, {
            "id": "4",
            "name": "Column Chart",
            "icon": 'assets/images/chart_icons/column.png',
            "chart_type": "Bar Chart"


        }, {
            "id": "5",
            "name": "Pie Chart",
            "icon": 'assets/images/chart_icons/pie.png',
            "chart_type": "Pie Chart"
        }, {
            "id": "6",
            "name": "Scatter Chart",
            "icon": 'assets/images/chart_icons/scatter.png',
            "chart_type": "Scatter Chart"
        }, {
            "id": "7",
            "name": "Bubble Chart",
            "icon": 'assets/images/chart_icons/bubble.png',
            "chart_type": "Bubble Chart"
        }, {
            "id": "8",
            "name": "Single Value Chart",
            "icon": 'assets/images/chart_icons/singlevalue.png',
            "chart_type": "Single Value Chart"
        }, {
            "id": "9",
            "name": "Radial Gauge Chart",
            "icon": 'assets/images/chart_icons/radialGauge.png',
            "chart_type": "Radial Gauge Chart"
        }, {
            "id": "10",
            "name": "Filter Gauge Chart",
            "icon": 'assets/images/chart_icons/fillerGauge.png',
            "chart_type": "Filler Gauge Chart"
        }, {
            "id": "11",
            "name": "Marker Gauge Chart",
            "icon": 'assets/images/chart_icons/markerGauge.png',
            "chart_type": "Marker Gauge Chart"
        }, {
            "id": "12",
            "name": "Mapping Chart",
            "icon": 'assets/images/chart_icons/mapping.png',
            "chart_type": "Mapping Chart"
        }];
        // dragulaService.drag.subscribe((value) => {
        //     console.log(`drag: ${value[0]}`);
        //     this.onDrag(value.slice(1));
        // });
        // dragulaService.drop.subscribe((value) => {
        //     console.log(`drop: ${value[0]}`);
        //     this.onDrop(value.slice(1));
        // });
        // dragulaService.over.subscribe((value) => {
        //     console.log(`over: ${value[0]}`);
        //     this.onOver(value.slice(1));
        // });
        // dragulaService.out.subscribe((value) => {
        //     console.log(`out: ${value[0]}`);
        //     this.onOut(value.slice(1));
        // });
        // dragulaService.dropModel.subscribe((value) => {
        //     console.log(value);
        //     this.onDropModel(value.slice(1));
        // });
        // dragulaService.removeModel.subscribe((value) => {
        //     console.log(value);
        //     this.onRemoveModel(value.slice(1));
        // });


    }

    ngOnInit() {
        this.showAllListings = true;
        this.showAddWindow = false;
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {
                    this.userInfo = response;
                    this.getAllCharts();
                    this.getAllTables();
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking user data");
                }
            );
    }

    private getAllCharts = () => {
        this.all_charts = [];
        this._elasticService.getAllRows(this.userInfo.company_id,'chart_data',0,500,'ASC')
            .subscribe(
                response => {
                    console.log('chart_data' , response);
                    this.all_charts = response;

                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking user data");
                }
            );

    };

    private getAllTables = () => {
        this.all_tables = [];
        this._elasticService.getAllRows(this.userInfo.company_id,'exportdata',0,500,'ASC')
            .subscribe(
                response => {
                    console.log('table_data' , response);
                    this.all_tables = response;
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking user data");
                }
            );
    };

    public addNewChart = (table:any) => {
        this.resetWindow();
        console.log(table);
        this.active_table = table;
        this.getAllTableColumns();
        this.showAddWindow = true;
    };

    private getAllTableColumns = () => {
        this.table_columns = [];
        if (Object.keys(this.active_table).length > 0) {
            this._elasticService.getAllRows(this.userInfo.company_id, 'tbl_'+this.active_table.TableName+'_metadata', 0, 500, 'ASC')
                .subscribe(
                    response => {
                        console.log('table_columns_response', response);
                        let all_fields = response[0]['cal_field_data'];
                        let columns = _.pickBy(all_fields,'field_name');
                        console.log(columns);
                        this.table_columns = _.values(columns);
                    },
                    error => {
                        //this.alertMessage = 'Email id already exist. Try with other email id.';
                        console.log("error while checking user data");
                    }
                );
        }
    };


    private resetWindow = () => {
        this.showAllListings = false;
        this.showAddWindow = false;
    };

    public goBack = () => {
        this.resetWindow();
        this.showAllListings = true;
    };

    // private hasClass(el: any, name: string) {
    //     return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    // }
    //
    // private addClass(el: any, name: string) {
    //     if (!this.hasClass(el, name)) {
    //         el.className = el.className ? [el.className, name].join(' ') : name;
    //     }
    // }
    //
    // private removeClass(el: any, name: string) {
    //     if (this.hasClass(el, name)) {
    //         el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    //     }
    // }
    //
    // private onDrag(args) {
    //     let [e, el] = args;
    //     this.removeClass(e, 'ex-moved');
    // }
    //
    // private onDrop(args) {
    //     let [e, el] = args;
    //     this.addClass(e, 'ex-moved');
    // }
    //
    // private onOver(args) {
    //     let [e, el, container] = args;
    //     this.addClass(el, 'ex-over');
    // }
    //
    // private onOut(args) {
    //     let [e, el, container] = args;
    //     this.removeClass(el, 'ex-over');
    // }
    //
    // private onDropModel(args) {
    //     let [el, target, source] = args;
    //     console.log(el, target, source);
    //     // do something else
    // }
    //
    // private onRemoveModel(args) {
    //     let [el, source] = args;
    //     console.log(args);
    //     // do something else
    // }


    transferDataSuccessRow = ($event) => {
        console.log($event);
        let data = $event.dragData;
        this.chart_rows.push(data.field_name);
        this.chart_rows = Array.from(new Set(this.chart_rows));
        this.refreshChart();
    };

    transferDataSuccessCols = ($event) => {
        console.log($event);
        let data = $event.dragData;
        this.chart_columns.push(data.field_name);
        //this.chart_rows = Array.from(new Set(this.chart_rows));
        this.chart_columns = Array.from(new Set(this.chart_columns));
        this.refreshChart();
    };

    removeItem = (data:any,type:string) => {
        if(type == 'row'){
            //remove from rows
            let index:number = this.chart_rows.indexOf(data);
            if(index > -1){
                this.chart_rows.splice(index,1);
            }
        }else if(type == 'column'){
            //remove from columns
            let index = this.chart_columns.indexOf(data);
            if(index > -1){
                this.chart_columns.splice(index,1);
            }
        }
        this.refreshChart();

    };

    private refreshChart = () => {
        this.chart_properties = {};
        this.chart_properties.columns = this.chart_columns;
        this.chart_properties.rows = this.chart_rows;
        this.chart_properties.type = this.selected_chart;
        if(!this.chart_agg_type){
            this.chart_agg_type = 'SUM';
        }
        this.chart_properties.aggregation = this.chart_agg_type;
        let temp_data:any = [];
        temp_data.table = this.active_table;
        temp_data.company_id = this.userInfo.company_id;
        this.chart_properties.data = temp_data;
    };

    public changeAggregation = () => {
        this.refreshChart();
    };

    public changeChartType = (type:any) => {
        console.log(type);
        this.selected_chart = type.name;
        this.refreshChart();
    };


    saveChart = (name:string) => {
      let chart_data : any = {};
      let rowId= this.helper.generateUUID();
      chart_data.tableName = this.active_table;
      chart_data.col_name = this.chart_properties.columns;
      chart_data.row_name = this.chart_properties.rows;
      chart_data.chart_name = name.trim();
      chart_data.chartId = rowId;
      chart_data.chartType = this.chart_properties.type;
      chart_data.format = this.chart_format;
      chart_data.aggType = this.chart_properties.aggregation;
      chart_data.created = new Date();
      chart_data.modified = new Date();

        console.log(chart_data);
        //save data
        this._elasticService.addData(chart_data, this.userInfo.company_id,'chart_data', rowId)
            .subscribe(
                response => {
                    console.log(response);
                    this.ngOnInit();
                    //this.goBack();
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while saving chart data");
                    console.log(error);
                }
            );


    };


}

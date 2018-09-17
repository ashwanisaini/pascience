import {Component, OnInit, Input, Output, ViewEncapsulation, OnChanges, SimpleChange, ViewChild} from '@angular/core';
import {AuthService, ElasticService, Utils} from '../../../../shared/services';
import * as _ from 'lodash';

declare let d3: any;


@Component({
    selector: 'app-component-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnChanges {
    @ViewChild('nvd3') nvd3;
    private chart_properties: any = [];
    @Input() component_data: any;
    @Input() random_unique_number:string;
    @Input() board: string;

    public options: any;
    public data: any;
    public isChartReady = false;
    public component_details: any = {};
    public chart_height = 450;

    constructor(private _elasticService: ElasticService, private helper: Utils) {
        this.isChartReady = false;
    }

    ngOnChanges() {
        if (this.component_data) {
            console.log(this.component_data);
            let component_id = this.component_data.component_id;
            let company_id = this.component_data.company_id;
            this.chart_height = (!this.component_data.chart.height)?450: this.component_data.chart.height;
            this._elasticService.getData(company_id, 'chart_data', component_id)
                .subscribe(
                    response => {
                        this.component_details = response;
                        console.log('***chart details**');
                        console.log(JSON.stringify(response));
                        this.chart_properties = {};
                        this.chart_properties.name = this.component_details.chart_name;
                        this.chart_properties.columns = this.component_details.col_name[0];
                        this.chart_properties.rows = this.component_details.row_name[0];
                        this.chart_properties.type = this.component_details.chartType;
                        if (!this.component_details.aggType) {
                            this.chart_properties.aggregation = 'SUM';
                        } else {
                            this.chart_properties.aggregation = this.component_details.aggType;
                        }

                        let temp_data: any = [];
                        temp_data.table = this.component_details.tableName.TableName;
                        temp_data.company_id = company_id;
                        this.chart_properties.data = temp_data;
                        this.continueChart();

                    },
                    error => {
                        console.log(error);
                        //this.alertMessage = 'error in response';
                    }
                );

        }
    }

    private continueChart() {
        if (this.chart_properties) {
            console.log(this.chart_properties);
            switch (this.chart_properties.type) {
                case 'Line Chart': {
                    this.drawLineChart();
                    break;
                }
                case 'Area Chart': {
                    this.drawAreaChart();
                    break;
                }
                case 'Horizontalbar Chart': {
                    this.drawHorizontalBarChart();
                    break;
                }
                case 'Column Chart': {
                    this.drawDiscreteBarChart();
                    break;
                }
                case 'Pie Chart': {
                    this.drawPieChart();
                    break;
                }
                case 'Scatter Chart': {

                    break;
                }
                case 'Bubble Chart': {
                    break;
                }
                case 'Single Value Chart': {
                    break;
                }
                case 'Radial Gauge Chart': {
                    break;
                }
                case 'Filter Gauge Chart': {
                    break;
                }
                case 'Marker Gauge Chart': {
                    break;
                }
                case 'Mapping Chart': {
                    break;
                }
                default: {
                    break;
                }


            }

        }
    }

    public drawDiscreteBarChart = () => {
        this.data = [];
        let company_id = this.chart_properties.data.company_id;
        let table = this.chart_properties.data.table;
        let column = this.chart_properties.columns;
        let rows = this.chart_properties.rows;
        let aggType = this.chart_properties.aggregation;

        this._elasticService.getAllAggregate(company_id, table, rows, column, aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp: any = response;
                    console.log(response);
                    var finalJson: any = [];
                    var finalVals: any = [];

                    let data: any = {
                        "key": column,
                        "values": []
                    };
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            // var temp = {};
                            // temp["key"] = key;
                            // temp["y"] = value;
                            // finalVals.push(value);
                            // finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        _.forEach(resp.aggregations[rows].buckets, function (value: any, key) {
                            let tmpb: any = {};
                            tmpb.label = value['key'];
                            tmpb.value = value[aggType]['value'];
                            finalVals.push(value[aggType]["value"]);
                            data.values.push(tmpb);
                            //temp_data_values.push(tmpb);
                        });
                    }

                    this.options = {
                        chart: {
                            type: 'discreteBarChart',
                            height: 450,
                            color: this.checkColorCodes(finalVals),
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 55
                            },
                            x: function (d) {
                                return d.label;
                            },
                            y: function (d) {
                                return d.value;
                            },
                            showValues: true,
                            valueFormat: function (d) {
                                return d3.format(',.4f')(d);
                            },
                            duration: 500,
                            xAxis: {
                                axisLabel: 'X Axis'
                            },
                            yAxis: {
                                axisLabel: 'Y Axis',
                                axisLabelDistance: -10
                            }
                        }
                    };

                    this.data.push(data);
                    this.isChartReady = true;
                    console.log(JSON.stringify(this.data));
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
                }
            );


    };


    public drawMultiBarChart = () => {

    };

    public drawLineChart = () => {
        this.data = [];
        let company_id = this.chart_properties.data.company_id;
        let table = this.chart_properties.data.table;
        let column = this.chart_properties.columns;
        let rows = this.chart_properties.rows;
        let aggType = this.chart_properties.aggregation;

        this._elasticService.getAllAggregate(company_id, table, rows, column, aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp: any = response;
                    console.log(response);
                    var finalJson: any = [];
                    var finalVals: any = [];
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            var temp = {};
                            temp["key"] = key;
                            temp["y"] = value;
                            finalVals.push(value);
                            finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        let line_data:any = [];
                        _.forEach(resp.aggregations[rows].buckets, function (value: any, key) {
                            var sin_data = {
                                "key": value['key'],
                                "strokeWidth": 2,
                                //"classed": "dashed",
                                //"area":true,
                                //"color":'#'+Math.floor(Math.random()*16777215).toString(16),
                                "values": [{x: 0, y: 0}]
                            };

                            //var is_first = true;
                            _.times(2, function (num) {
                                let temp:any = {};
                                if (num == 0) {
                                    temp.x = 0;
                                    temp.y = 0;
                                } else {
                                    temp.x = num;
                                    temp.y = value[aggType]['value'];
                                }
                                sin_data.values.push(temp);
                            });
                            line_data.push(sin_data);
                        });
                        finalJson.push(line_data);
                    }

                    this.options = {
                        chart: {
                            type: 'lineChart',
                            height: 450,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 40,
                                left: 55
                            },
                            x: function (d) {
                                return d.x;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            //color: checkColorCodes(finalVals),
                            useInteractiveGuideline: true,
                            dispatch: {
                                stateChange: function (e) {
                                    console.log("stateChange");
                                },
                                changeState: function (e) {
                                    console.log("changeState");
                                },
                                tooltipShow: function (e) {
                                    console.log("tooltipShow");
                                },
                                tooltipHide: function (e) {
                                    console.log("tooltipHide");
                                }
                            },
                            xAxis: {
                                //axisLabel: $scope.format.xaxis.title
                            },
                            yAxis: {
                                //axisLabel: $scope.format.yaxis.title,
                                tickFormat: function (d) {
                                    return d3.format('.02f')(d);
                                },
                                axisLabelDistance: -10
                            }
                        }
                    };
                    this.data = finalJson;
                    this.isChartReady = true;
                    console.log(this.data);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking line chart");
                }
            );

    };

    public drawAreaChart = () => {

    };

    public drawHorizontalBarChart = () => {

    };

    public drawMultiHorizontalBarChart = () => {

    };

    public drawPieChart = () => {
        this.data = [];
        let company_id = this.chart_properties.data.company_id;
        let table = this.chart_properties.data.table;
        let column = this.chart_properties.columns;
        let rows = this.chart_properties.rows;
        let aggType = this.chart_properties.aggregation;

        this._elasticService.getAllAggregate(company_id, table, rows, column, aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp: any = response;
                    console.log(response);
                    var finalJson: any = [];
                    var finalVals: any = [];
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            var temp = {};
                            temp["key"] = key;
                            temp["y"] = value;
                            finalVals.push(value);
                            finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        _.forEach(resp.aggregations[rows].buckets, function (value: any, key) {
                            var temp = {};
                            temp["key"] = value["key"];
                            temp["y"] = value[aggType]["value"];
                            finalVals.push(value[aggType]["value"]);
                            finalJson.push(temp);
                        });
                    }

                    this.options = {
                        chart: {
                            type: 'pieChart',
                            height: this.chart_height,
                            color: this.checkColorCodes(finalVals),
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 55
                            },
                            x: function (d) {
                                return d.key;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            useInteractiveGuideline: true,
                            //color: checkColorCodes(finalVals),
                            showLabels: true,
                            showLegend: false,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            // legend: {
                            //     margin: {
                            //         top: 5,
                            //         right: 35,
                            //         bottom: 5,
                            //         left: 0
                            //     }
                            // }
                        }
                    };

                    this.data = finalJson;
                    this.isChartReady = true;
                    //this.component_data.chart.api.update();
                    //console.log();

                    //console.log(d3);
                    // setTimeout(function(){
                    //     console.log('**************',this.nvd3);
                    //     this.nvd3.chart.update();
                    // },1000);

                    //this.nvd3.api.update();
                    //this.nvd3.chart.update();
                    //this.api.update();
                    //this.nvd3.chart.update();
                    console.log(this.data);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
                }
            );


    };

    public deleteComponent = (component:any) => {
        let component_name = this.chart_properties.name;

        let ans = confirm('Are you sure want to delete ['+ component_name +'] from current board');
        if(ans){
            console.log(component);
            console.log(this.board);
            console.log(this.component_data);
        }

    };

    public rgb2hex(rgb) {
        console.log('i am in rgb2ex function');
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : rgb;
    }



    public checkColorCodes = (valuesArray) => {
        // if ($scope.chart_bg_color) {
        //     $('.nvd3_tab_color').css('background', $scope.chart_bg_color);
        // } else {
        //     $('.nvd3_tab_color').css('background', '#ffffff');
        // }

        //valuesArray.reverse();
        let maxvalue:any = _.max(valuesArray);
        let minvalue:any = _.min(valuesArray);
        let codes:any = [];
        let rgb_color:string = 'Red';
        let rgb_extract;

        if (rgb_color) {
            let that = this;
            _.forEach(valuesArray, function (value:number) {
                //let roundRes = Math.round(255 * (value - minvalue) / (maxvalue - minvalue), 0);
                let roundRes = Math.round(255 * (value - minvalue) / (maxvalue - minvalue));
                console.log('roundres ' + roundRes,value);

                if (rgb_color == 'Red') {
                    if (roundRes == 255) {

                        roundRes = roundRes - 30;
                        rgb_extract = "rgba(" + 255 + ',' + roundRes + ',' + roundRes + ")";

                    } else {

                        rgb_extract = "rgba(" + 255 + ',' + roundRes + ',' + roundRes + ")";

                    }

                } else if (rgb_color == 'Green') {
                    if (roundRes == 255) {

                        roundRes = roundRes - 30;
                        rgb_extract = "rgba(" + roundRes + ',' + 255 + ',' + roundRes + ")";

                    } else {

                        rgb_extract = "rgba(" + roundRes + ',' + 255 + ',' + roundRes + ")";

                    }
                } else if (rgb_color == 'Blue') {
                    if (roundRes == 255) {

                        roundRes = roundRes - 30;
                        rgb_extract = "rgba(" + roundRes + ',' + roundRes + ',' + 255 + ")";

                    } else {

                        rgb_extract = "rgba(" + roundRes + ',' + roundRes + ',' + 255 + ")";

                    }
                }

                //codes.push(this.rgb2hex(rgb_extract));

                let fin_color = that.rgb2hex(rgb_extract);
                console.log(fin_color);
                codes.push(fin_color);
            });

            return codes;
        } else {

            return null;

        }
    };


}

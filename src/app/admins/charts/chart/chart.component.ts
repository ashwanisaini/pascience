import {Component, Input, ViewEncapsulation, OnChanges} from '@angular/core';
import {ElasticService, Utils} from '../../../shared/services/index';
import * as _ from 'lodash';
import {number} from "ng2-validation/dist/number";
declare let d3: any;

@Component({
    selector: 'admin-chart-designer',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnChanges {

    @Input() property: any;
    public options: any;
    public data: any = [];
    public isChartReady = false;


    constructor(private _elasticService:ElasticService,private helper:Utils) {
        this.isChartReady = false;
    }

    ngOnChanges(){
        if(this.property){
        console.log(this.property);
        switch(this.property.type){
            case 'Line Chart':{
                this.drawLineChart();
                break;
            }
            case 'Area Chart':{
                this.drawAreaChart();
                break;
            }
            case 'Horizontalbar Chart':{
                this.drawDiscreteBarChart();
                break;
            }
            case 'Column Chart':{
                this.drawDiscreteBarChart();
                break;
            }
            case 'Pie Chart':{
                this.drawPieChart();
                break;
            }
            case 'Scatter Chart':{

                break;
            }
            case 'Bubble Chart':{
                break;
            }
            case 'Single Value Chart':{
                break;
            }
            case 'Radial Gauge Chart':{
                break;
            }case 'Filter Gauge Chart':{
            break;
        }
            case 'Marker Gauge Chart':{
                break;
            }
            case 'Mapping Chart':{
                break;
            }
            default:{
                break;
            }


        }

        }
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     // changes.prop contains the old and the new value...
    // }

    public drawBarChart = () => {


    };

    public drawMultiBarChart = () => {

    };

    public drawLineChart = () => {
        this.data = [];
        this.isChartReady = false;
        let company_id = this.property.data.company_id;
        let table = this.property.data.table.TableName;
        let column = this.property.columns[0];
        let rows = this.property.rows[0];
        let aggType = this.property.aggregation;

        this._elasticService.getAllAggregate(company_id, table, rows, column, aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp: any = response;
                    console.log(response);
                    let finalJson: any = [];
                    let finalVals: any = [];
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            let temp = {};
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
                            let sin_data = {
                                "key": value['key'],
                                "strokeWidth": 2,
                                "values": [{x: 0, y: 0}]
                            };
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
        this.data = [];
        let company_id = this.property.data.company_id;
        let table = this.property.data.table.TableName;
        let column = this.property.columns[0];
        let rows = this.property.rows[0];
        let aggType = this.property.aggregation;
        let temp_data_values:any = [];
        this._elasticService.getAllAggregate(company_id,table,rows,column,aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp:any = response;
                    console.log(response);
                    let finalJson:any = [];
                    let finalVals:any = [];

                    let data:any = [{
                        "key": column,
                        "bar": true,
                        "values": []
                    }];
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            let temp = {};
                            temp["key"] = key;
                            temp["y"] = value;
                            finalVals.push(value);
                            finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        _.forEach(resp.aggregations[rows].buckets, function (value:any, key) {
                            let tmpb:any = {};
                            tmpb.label = value['key'];
                            tmpb.value = value[aggType]['value'];
                            finalVals.push(value[aggType]['value']);
                            temp_data_values.push(tmpb);
                        });
                    }

                    this.options = {
                        chart: {
                            type: 'discreteBarChart',
                            height: 450,
                            x: function (d) {
                                return d.label;
                            },
                            y: function (d) {
                                return d.value;
                            },
                            //color: checkColorCodes(finalVals),
                            showControls: false,
                            showValues: true,
                            duration: 500,
                            stacked: false,
                            xAxis: {
                                showMaxMin: false,
                                //axisLabel: $scope.format.xaxis.title
                            },
                            yAxis: {
                                //axisLabel: $scope.format.yaxis.title,
                                tickFormat: function (d) {
                                    return d3.format(',.02f')(d);
                                }
                            }
                        }
                    };


                    this.data = {
                        "key": column,
                        "bar": true,
                        "values": temp_data_values
                    };

                    this.isChartReady = true;
                    console.log(this.data);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
                }
            );


    };

    public drawDiscreteBarChart = () => {
        this.data = [];
        let company_id = this.property.data.company_id;
        let table = this.property.data.table.TableName;
        let column = this.property.columns[0];
        let rows = this.property.rows[0];
        let aggType = this.property.aggregation;
        let temp_data_values:any = [];
        this._elasticService.getAllAggregate(company_id,table,rows,column,aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp:any = response;
                    console.log(response);
                    let finalJson:any = [];
                    let finalVals:any = [];

                    let data:any = {
                        "key": column,
                        "values": []
                    };
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            // let temp = {};
                            // temp["key"] = key;
                            // temp["y"] = value;
                            // finalVals.push(value);
                            // finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        _.forEach(resp.aggregations[rows].buckets, function (value:any, key) {
                            let tmpb:any = {};
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
                            margin : {
                                top: 20,
                                right: 20,
                                bottom: 50,
                                left: 55
                            },
                            x: function(d){return d.label;},
                            y: function(d){return d.value;},
                            showValues: true,
                            valueFormat: function(d){
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

    public drawMultiHorizontalBarChart = () => {

    };

    public drawPieChart = () => {
        this.data = [];
        let company_id = this.property.data.company_id;
        let table = this.property.data.table.TableName;
        let column = this.property.columns[0];
        let rows = this.property.rows[0];
        let aggType = this.property.aggregation;
        //http://52.8.103.166:8080/platform/aggregate/ELASTIC_CLIENT/f8d5a6dbbe43170a8acee52b/products?
        // aggFactField=complaint_intensity&aggNumericDataField=customer&aggType=SUM&rawQuery=
        this._elasticService.getAllAggregate(company_id,table,rows,column,aggType)
            .subscribe(
                response => {
                    //this.all_tiles = response;
                    console.log(JSON.stringify(response));
                    let resp:any = response;
                    console.log(response);
                    let finalJson:any = [];
                    let finalVals:any = [];
                    if (aggType == "FACET") {
                        _.forEach(resp, function (value, key) {
                            let temp = {};
                            temp["key"] = key;
                            temp["y"] = value;
                            finalVals.push(value);
                            finalJson.push(temp);

                        });
                    } else {
                        console.log(resp['aggregations']);
                        console.log(resp['aggregations'][rows]);
                        _.forEach(resp.aggregations[rows].buckets, function (value:any, key) {
                            let temp = {};
                            temp["key"] = value["key"];
                            temp["y"] = value[aggType]["value"];
                            finalVals.push(value[aggType]["value"]);
                            finalJson.push(temp);
                        });
                    }

                    this.options = {
                        chart: {
                            type: 'pieChart',
                            height: 500,
                            color: this.checkColorCodes(finalVals),
                            x: function (d) {
                                return d.key;
                            },
                            y: function (d) {
                                return d.y;
                            },
                            //color: checkColorCodes(finalVals),
                            showLabels: true,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            legend: {
                                margin: {
                                    top: 5,
                                    right: 35,
                                    bottom: 5,
                                    left: 0
                                }
                            }
                        }
                    };

                    this.data = finalJson;
                    this.isChartReady = true;
                    console.log(this.data);
                },
                error => {
                    //this.alertMessage = 'Email id already exist. Try with other email id.';
                    console.log("error while checking tiles");
                }
            );

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

        valuesArray.reverse();
        let maxvalue:any = _.max(valuesArray);
        let minvalue:any = _.min(valuesArray);
        let codes:any = [];
        let rgb_color:string = 'Red';
        let rgb_extract;

        if (rgb_color) {
            let that = this;
            _.forEach(valuesArray, function (value:number, key) {
                //let roundRes = Math.round(255 * (value - minvalue) / (maxvalue - minvalue), 0);
                let roundRes = Math.round(255 * (value - minvalue) / (maxvalue - minvalue));

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

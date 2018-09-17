import {
    Component,
    OnInit,
    forwardRef,
    Input,
    OnChanges,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef
} from '@angular/core';
import {AuthService, ElasticService, Utils} from '../../../../../shared/services';
import {DragulaService} from 'ng2-dragula';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SortablejsOptions} from 'angular-sortablejs';


@Component({
    selector: 'app-kanban-card',
    templateUrl: './kanban-card.component.html',
    styleUrls: ['./kanban-card.component.scss']
})
export class KanbanCardComponent implements OnInit {
    //@ViewChild('builder') builder:ElementRef;
    //@Input() carddata: any;
    @Input() column_name: any;
    // @Input() tiledetails: any;
    @Input() component_details: any;
    //The parent can bind to this event
    @Output() update = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<boolean>();

    public cards: any = [];
    public showAddLink: boolean;
    public tiledetails: any;
    public objectKeys = Object.keys;
    public form_data: any;
    public modalRef: NgbModalRef;
    closeResult: string;
    public item: any;
    public edit_form_data: any;
    options: SortablejsOptions = {
        group: 'test'
    };

    constructor(private _elasticService: ElasticService,
                private authService: AuthService,
                private helper: Utils,
                private dragulaService: DragulaService,
                private modalService: NgbModal) {
        // this.dragulaService = dragulaService;
        // dragulaService.drop.subscribe((value) => {
        //     console.log(`drop: ${value[0]}`);
        //     this.onDrop(value);
        // });

        this.options = {
            onUpdate: (event: any) => {
                console.log(event);
                //this.postChangesToServer();
            }
        };

        // this.dragulaService.dropModel.subscribe((value) => {
        //     this.onDropModel(value.slice(1));
        // });
        // dragulaService.drag.subscribe((value) => {
        //     console.log(`drag: ${value[0]}`);
        //     //this.onDrag(value.slice(1));
        // });
        // dragulaService.drop.subscribe((value) => {
        //     console.log(`drop: ${value[0]}`);
        //     //this.onDrop(value.slice(1));
        // });
        // dragulaService.over.subscribe((value) => {
        //     console.log(`over: ${value[0]}`);
        //     //this.onOver(value.slice(1));
        // });
        // dragulaService.out.subscribe((value) => {
        //     console.log(`out: ${value[0]}`);
        //     //this.onOut(value.slice(1));
        // });

    }

    ngOnInit() {
        console.log(this.component_details);
        console.log(this.column_name);
        //console.log(this.tiledetails);
        //this.getCards(this.column_name);
        this.cards.data = [];
        //this.cards.properties = {};
        this.getTilesDetails();
    }


    getCards() {
        this.cards = [];
        this._elasticService.getAllRows(this.component_details.company_id, this.tiledetails.datasourceName, 0, 500, 'ASC', '_uid')
            .subscribe(
                response_all => {
                    let response_all_rows = response_all;
                    let mapped_column = this.component_details.mapped_column;
                    if(this.component_details.filter && this.component_details.highlight_filter && this.component_details.highlight_color) {
                        console.log('Highlights with filter');
                        this._elasticService.getData(this.component_details.company_id, 'table_filters', this.component_details.filter)
                            .subscribe(
                                response => {
                                    let rawquery:string = response['filter_command'];
                                    this._elasticService.getTableDataByRawQueryFields(this.component_details.company_id, this.tiledetails.datasourceName, rawquery, '', 0, 100, 'ASC',)
                                        .subscribe(
                                            response_table_filtered => {
                                                let data_after_filter = response_table_filtered;
                                                //get highlight filter data
                                                console.log(data_after_filter);
                                                this._elasticService.getData(this.component_details.company_id, 'table_filters', this.component_details.highlight_filter)
                                                    .subscribe(
                                                        response => {
                                                            let rawquery:string = response['filter_command'];
                                                            this._elasticService.getTableDataByRawQueryFields(this.component_details.company_id, this.tiledetails.datasourceName, rawquery, '', 0, 100, 'ASC',)
                                                                .subscribe(
                                                                    response_highlight_filtered => {
                                                                        let that = this;
                                                                        _.map(data_after_filter,function(i:any){
                                                                            _.forEach(response_highlight_filtered, function(value:any, key) {
                                                                               if(value.ROWID === i.ROWID){
                                                                                   i.highlight_color = that.component_details.highlight_color;
                                                                               }else{
                                                                                   //console.log('not found');
                                                                                   i.highlight_color = 'inherit';

                                                                               }
                                                                            });

                                                                        });

                                                                        if (Object.keys(data_after_filter).length > 0) {
                                                                            let result: any = _.groupBy(data_after_filter, function (b) {
                                                                                return b[mapped_column]
                                                                            });

                                                                            this.form_data = this.tiledetails.formData;

                                                                            let all_forms_mapped_keys = [];
                                                                            _.forEach(this.form_data, function (value: any) {
                                                                                all_forms_mapped_keys.push(value.map_field);
                                                                            });
                                                                            this.cards = result[this.column_name];
                                                                        }

                                                                    },
                                                                    error => {
                                                                        console.log(error);
                                                                    }
                                                                );
                                                        },
                                                        error => {
                                                            console.log(error);
                                                        }
                                                    );

                                            },
                                            error => {
                                                console.log(error);
                                            }
                                        );
                                },
                                error => {
                                    console.log(error);
                                }
                            );

                    }else if(this.component_details.filter && !this.component_details.highlight_filter){
                        console.log('only kanban filter');
                        this._elasticService.getData(this.component_details.company_id, 'table_filters', this.component_details.filter)
                            .subscribe(
                                response => {
                                    let rawquery:string = response['filter_command'];
                                    this._elasticService.getTableDataByRawQueryFields(this.component_details.company_id, this.tiledetails.datasourceName, rawquery, '', 0, 100, 'ASC',)
                                        .subscribe(
                                            data_after_filter => {
                                                _.map(data_after_filter,function(i:any){
                                                    i.highlight_color = 'inherit';
                                                });

                                                if (Object.keys(data_after_filter).length > 0) {
                                                    let result: any = _.groupBy(data_after_filter, function (b) {
                                                        return b[mapped_column]
                                                    });

                                                    this.form_data = this.tiledetails.formData;

                                                    let all_forms_mapped_keys = [];
                                                    _.forEach(this.form_data, function (value: any) {
                                                        all_forms_mapped_keys.push(value.map_field);
                                                    });
                                                    this.cards = result[this.column_name];
                                                }

                                            },
                                            error => {
                                                console.log(error);
                                            }
                                        );

                                },
                                error => {
                                    console.log(error);
                                });
                    }else if(!this.component_details.filter && this.component_details.highlight_filter){
                        console.log('only highlights type kanban filter');
                        this._elasticService.getData(this.component_details.company_id, 'table_filters', this.component_details.highlight_filter)
                            .subscribe(
                                response => {
                                    let rawquery:string = response['filter_command'];
                                    console.log(rawquery);
                                    this._elasticService.getTableDataByRawQueryFields(this.component_details.company_id, this.tiledetails.datasourceName, rawquery, '', 0, 100, 'ASC',)
                                        .subscribe(
                                            data_after_filter => {
                                                //console.log(data_after_filter);
                                                let that = this;
                                                // _.map(data_after_filter,function(i:any){
                                                //     i.highlight_color = that.component_details.highlight_color;
                                                // });
                                                 _.map(response_all_rows,function(i:any){
                                                    _.forEach(data_after_filter, function(value:any) {
                                                        if(value.ROWID == i.ROWID){
                                                            i.highlight_color = that.component_details.highlight_color;
                                                            //i = value;
                                                        }else{
                                                            //console.log('not found');
                                                            i.highlight_color = 'inherit';

                                                        }
                                                    });

                                                });
                                                console.log(response_all_rows);

                                                if (Object.keys(response_all_rows).length > 0) {
                                                    let result: any = _.groupBy(response_all_rows, function (b) {
                                                        return b[mapped_column]
                                                    });
                                                    //console.log(result);
                                                    this.form_data = this.tiledetails.formData;
                                                    //let that = this;
                                                    let all_forms_mapped_keys = [];
                                                    _.forEach(this.form_data, function (value: any) {
                                                        all_forms_mapped_keys.push(value.map_field);
                                                    });
                                                    this.cards = result[this.column_name];
                                                    console.log(JSON.stringify(this.cards));
                                                    //console.log(this.cards);
                                                }
                                            },
                                            error => {
                                                console.log(error);
                                            }
                                        );
                                },
                                error => {
                                    console.log(error);
                                });
                    }else{
                        console.log('no kanban filter');
                        if (Object.keys(response_all).length > 0) {
                            let result: any = _.groupBy(response_all, function (b) {
                                return b[mapped_column]
                            });
                            //console.log(result);
                            this.form_data = this.tiledetails.formData;
                            //let that = this;
                            let all_forms_mapped_keys = [];
                            _.forEach(this.form_data, function (value: any) {
                                all_forms_mapped_keys.push(value.map_field);
                            });
                            this.cards = result[this.column_name];
                            //console.log(this.cards);
                        }
                    }

                },
                error => {
                    console.log(error);
                }
            );
    }

    getTilesDetails = () => {
        let component_id = this.component_details.component_id;

        this._elasticService.getTableSearchByRowId(this.component_details.company_id, 'tiles', this.component_details.tile_id)
            .subscribe(
                response => {
                    //this.all_boards = response;
                    //console.log('***tile details**');
                    this.tiledetails = response;
                    //console.log(this.tiledetails);
                    this.getCards();
                    //this.getCards(this.tile_details.datasourceName);
                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'error in response';
                }
            );

    };

    showControlProperties(content, item) {
        //let content;
        console.log(content, item);
        this.item = item;
        _.map(this.form_data, function (o: any) {
            return o.value = item[o.map_field];
        });
        //console.log(this.edit_form_data);


        this.modalRef = this.modalService.open(content);
        this.modalRef.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            console.log(reason);
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        // console.log('reason3',this.closeResult);
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    public updateCard = (form_data: any, item: any) => {
        //save card changes
        //let new_data = _.pick(item,{'ROWID':item.ROWID});
        //  if(_.isEqual(this.item, item)){
        //      return;
        //  }
        //onsole.log(form_data);
        _.map(form_data, function (o: any) {
            console.log(item[o.map_field], o.value);
            item[o.map_field] = o.value;
        });

        console.log(item);
        let row_id = (item.ROWID) ? item.ROWID : this.helper.generateUUID();

        this._elasticService.addData(item, this.component_details.company_id, this.tiledetails.datasourceName, row_id)
            .subscribe(
                response => {
                    console.log('record updated');
                    this.item = [];
                    //this.cards = [];
                    this.modalRef.close();
                    //setTimeout(this.getCards(),200);

                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'error in response';
                }
            );

    };


    public addNewCard = (form_data: any) => {
        let item: any = [];
        _.forEach(_.first(this.cards), function (value: any, key) {
            console.log(value, key);

            //let key =
            if (_.isString(value)) {
                //item[Object.keys()]
                console.log('string');
                item[key] = '';
            }
            ;
            if (_.isArray(value)) {
                //return [];
                console.log('array');
                item[key] = [];
            }
            ;
            if (_.isObject(value)) {
                //return [];
                console.log('object');
                item[key] = {};
            }
            ;
        });


        // let item:any = [];
        // _.forEach(table_fields,function(v:any){
        //     item[v] = '';
        // });
        // //console.log(item);
        _.map(form_data, function (o: any) {
            item[o.map_field] = o.value;
        });
        let fin_item = Object.assign({}, item);
        console.log(fin_item);
        if (fin_item) {
            let ROWID = this.helper.generateUUID();
            fin_item.ROWID = ROWID;
            console.log(fin_item);
            this._elasticService.addData(fin_item, this.component_details.company_id, this.tiledetails.datasourceName, ROWID)
                .subscribe(
                    response => {
                        console.log('record added');
                        item = [];
                        _.map(form_data, function (o: any) {
                            o.value = '';
                        });
                        setTimeout(this.getCards(), 1000);

                    },
                    error => {
                        console.log(error);
                    }
                );
        }

    };

    onDrop(args: any) {
        console.log(args);
        // var cardId = args[0].firstElementChild.id;
        // var toLane = args[1].id;
        // var fromLane = args[2].id;
        // console.log(args);
        // console.log(this.cards);

        // if(toLane !== fromLane) {
        //     this.cardService.transferCard(cardId, fromLane, toLane).subscribe(data => {
        //         console.log(data);
        //     });
        // }
    }

    transferDataSuccess($event: any) {
        console.log($event);
    }




}

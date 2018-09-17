import {Component, OnInit, ViewEncapsulation,ElementRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {routerTransition} from '../../router.animations';
import {AuthService, ElasticService, Utils} from '../../shared/services/index';
import * as _ from 'lodash';
import {GridsterConfig, GridsterItem} from 'angular-gridster2';
import {DragulaService} from 'ng2-dragula';
import * as $ from 'jquery';


@Component({
    selector: 'workspace-details-dashboard',
    templateUrl: 'workspace-details.component.html',
    styleUrls: ['workspace-details.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [routerTransition()]
})
export class WorkspaceDetailsComponent implements OnInit {
    public form: any = [];
    public alerts: Array<any> = [];
    public alertMessage;
    public user: any = {};
    public all_boards: any = [];
    public id: string;
    //public widgets: Array<any> = [];
    public options: GridsterConfig;
    public dashboard: Array<GridsterItem>;
    private sub: any;
    public all_component_lists: any = [];
    public active_board: number;
    public chart_properties: any;
    public random_unique_number:string;
    public showBoardEdit:boolean = false;
    public inviteEmail:string;
    public workspace_details:any;
    public invalidemail:boolean;
    emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
    // @Output() itemChange: EventEmitter<GridsterItem> = new EventEmitter();
    // @Output() itemResize: EventEmitter<GridsterItem> = new EventEmitter();

    constructor(private route: ActivatedRoute,
                private router: Router,
                private _elasticService: ElasticService,
                private authService: AuthService,
                private helper: Utils,
                private dragulaService: DragulaService,
                private el: ElementRef) {
        console.log('testtttttt');
        this.verifyUser();
    }

    ngOnInit() {
        this.invalidemail = false;
        this.id = this.route.snapshot.params['id'];

        this.random_unique_number = this.helper.generateRandomID();
        this.options = {
            gridType: 'fixed',
            itemChangeCallback: WorkspaceDetailsComponent.itemChange,
            itemResizeCallback: WorkspaceDetailsComponent.itemResize,
            displayGrid: 'onDrag&Resize', // display background grid of rows and columns
            fixedColWidth: 150, // fixed col width for gridType: 'fixed'
            fixedRowHeight: 150, // fixed row height for gridType: 'fixed'
            margin: 10,
            outerMargin: true,
            compactType: 'none',
            mobileBreakpoint: 600,
            defaultItemCols: 3, // default width of an item in columns
            defaultItemRows: 3, // default height of an item in rows
            minCols: 1,
            maxCols: 500,
            minRows: 2,
            maxRows: 500,
            resizable: {
                delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
                enabled: true, // enable/disable resizable items
                handles: {
                    s: true,
                    e: true,
                    n: true,
                    w: true,
                    se: true,
                    ne: true,
                    sw: true,
                    nw: true
                }, // resizable edges of an item
                stop: undefined,
                start: undefined
            },
            draggable: {
                enabled: true, // enable/disable draggable items
                ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
                ignoreContent: true, // if true drag will start only from elements from `dragHandleClass`
                dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
                stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
                start: undefined // callback when dragging an item starts.
                // Arguments: item, gridsterItem, event
            }
        };
        this.dashboard = [];
        this.inviteEmail = '';
        this.getWorkspaceDetails(this.id);

    }

    static itemChange(item, itemComponent) {
        //this.
        //this.saveGridsterItemLocation(item, itemComponent);
        //let ROWID = item.data.ROWID;
        console.log(item);
        console.log(itemComponent);
        let component_id = item.data.component_id;
        let board_id = item.data.board_id;
        let new_position: any = {};
        new_position.rows = item.rows;
        new_position.cols = item.cols;
        new_position.x = item.x;
        new_position.y = item.y;
        item.data.board_position = new_position;
        if(itemComponent.height){
            //item.data.chart.height = itemComponent.height;
        }



        //this.saveItemPosition(item.data, item.data.ROWID);

         console.log(item);
        // console.info('itemChanged', itemComponent);

        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event(''))
        //this.random_unique_number = Math.floor(Math.random() * 1000);
    }

    static itemResize(item, itemComponent) {
        console.info('itemResized', item, itemComponent);
        console.log(itemComponent.height);
        window.dispatchEvent(new Event('resize'));
        //if()
    }

    changedOptions = () => {
        this.options.api.optionsChanged();
    };

    removeItem = (item) => {
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    };

    getWorkspaceDetails = (id:string) => {
        this._elasticService.getData('pa_science','workspaces', id)
            .subscribe(
                response=>{
                    console.log(response);
                    this.workspace_details = response;
                },
                error=>{
                    console.log(error);
                });
    };

    public addItem = (obj: any) => {
        this.dashboard.push(obj);
        console.log(this.dashboard);
    };

    getAllBoards = () => {
        this._elasticService.getDataByColumnName(this.user.company_id, 'boards', 'ws_id', this.id)
            .subscribe(
                response => {

                    //this.all_boards = response;
                    this.all_boards = _.sortBy(response, 'ordernumber');
                    console.log(response);
                    if(this.all_boards[0]['ROWID']){
                        console.log('Loading default board: ' ,this.all_boards[0]['ROWID']);
                        this.loadComponents(this.all_boards[0]['ROWID']);
                    }

                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );

    };

    addBoard = (position: number) => {
        //alert('board added');
        let rowID = this.helper.generateUUID();
        let boards = {
            b_id: rowID,
            name: 'New Board',
            company_id: this.user.company_id,
            ordernumber: position + 1,
            ws_id: this.id
        };

        this._elasticService.addData(boards, this.user.company_id, 'boards', rowID)
            .subscribe(
                response => {

                    //this.all_boards = response;
                    setTimeout(() => {
                        this.getAllBoards();
                    }, 500);

                    console.log(response);
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );


    };

    loadComponents = (board_id: number) => {
        this.dashboard = [];
        this.active_board = board_id;
        console.log(board_id);
        let components: any = [];
        this._elasticService.getTableSearch(this.user.company_id, 'board_components', 'board_id', board_id, '', '', 0, 500)
            .subscribe(
                response => {
                    console.log(response);
                    if (Object.keys(response).length > 0) {
                        let that = this;
                        _.each(response, function (row: any, key) {
                            //this.all_component_lists
                            if(row.component_type == 'charts'){
                                let tmpchart:any = {};
                                tmpchart.api = {};
                                tmpchart.height = 450;
                                row.chart = tmpchart;
                                console.log(tmpchart);
                            }

                            console.log(row);

                            let widget: any = {
                                data: row,
                                cols: row.board_position.cols,
                                rows: row.board_position.rows,
                                x: row.board_position.x,
                                y: row.board_position.y
                            };
                            console.log('widget data loaded');
                            // if(row.component_type == 'charts'){
                            //     widget.chart.api = {};
                            // }
                            that.addItem(widget);
                            //this.dashboard.push(widget);
                            //components.push(widget);

                        });
                    }
                    // if(components.length > 0){
                    //     console.log(components);
                    //     this.addItem(components);
                    // }

                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );

    };

    private verifyUser = () => {
        this.authService.CheckUserCredentials()
            .subscribe(
                response => {

                    this.user = response;
                    this.getAllComponentsList();
                    this.getAllBoards();
                },
                error => {
                    this.router.navigate(['/login']);
                    this.alertMessage = 'error in response';
                }
            );
    };

    getAllComponentsList = () => {
        //this.all_component_lists = [];
        let temp_all_components: any = [];
        //get data from kanban table
        this._elasticService.getAllRows(this.user.company_id, 'kanban_master', 0, 500, '')
            .subscribe(
                response => {
                    if (Object.keys(response).length > 0) {
                        _.each(response, function (value: any, key: any) {
                            if (value.component_name && value.ROWID) {
                                var temp: any = {};
                                temp.value = value.component_name;
                                temp.name = value.component_name;
                                temp.ROWID = value.ROWID;
                                temp.type = "Kanban Component";
                                temp.label = '<img class="list_drp_icon" src="assets/img/admin_dashboard/kanban-128.svg" alt="kanban" title="kanban"/> ' + value.component_name;
                                temp_all_components.push(temp);
                            }
                        });
                    }
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );


        //get data from charts
        this._elasticService.getAllRows(this.user.company_id, 'chart_data', 0, 500, '')
            .subscribe(
                response => {
                    if (Object.keys(response).length > 0) {
                        _.each(response, function (value: any, key: any) {
                            if (value.chart_name && value.ROWID) {
                                var temp: any = {};
                                temp.value = value.chart_name;
                                temp.name = value.chart_name;
                                temp.ROWID = value.ROWID;
                                temp.type = "Report Component";
                                temp.label = '<img class="list_drp_icon" src="assets/img/admin_dashboard/charts-combo-icon.svg" alt="kanban" title="chart"/> ' + value.chart_name;
                                temp_all_components.push(temp);
                            }
                        });
                    }
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );


        //get data from sheets

        this._elasticService.getAllRows(this.user.company_id, 'conditional_formating', 0, 500, '')
            .subscribe(
                response => {
                    if (Object.keys(response).length > 0) {
                        _.each(response, function (value: any, key: any) {
                            if (value.table_name && value.ROWID) {
                                var temp: any = {};
                                temp.value = value.table_name;
                                temp.name = value.table_name;
                                temp.ROWID = value.ROWID;
                                temp.type = "Sheet Component";
                                temp.label = '<img class="list_drp_icon" src="assets/img/admin_dashboard/table-icon-21.svg" alt="kanban" title="Sheet"/> ' + value.table_name;
                                temp_all_components.push(temp);
                            }
                        });
                    }
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );


        this.all_component_lists = temp_all_components;

    };

    addComponent2Board = (component: any) => {
        console.log(component);
        if (!this.active_board) {
            return;
        }
        let componentType = component.type;
        let data: any = {};
        data.component_id = component.ROWID;
        data.company_id = this.user.company_id;
        data.board_id = this.active_board;
        data.ws_id = this.id;
        data.created = new Date();
        data.modified = new Date();
        data.status = 1;
        let tmp: any = {};
        tmp.size = {
            x: 501.333,
            y: 241
        };
        tmp.position = [
            20, 20
        ];
        data.board_position = tmp;

        if (componentType == 'Kanban Component') {
            data.component_type = 'kanban';
        } else if (componentType == 'Report Component') {
            data.component_type = 'charts';
        } else if (componentType == 'bucket') {
            data.component_type = 'bucket';
        } else if (componentType == 'Sheet Component') {
            data.component_type = 'sheets';
        } else {
            data.component_type = '';
        }

        let raw_query: string = "ws_id: '" + data.ws_id + "' AND board_id:'" + data.board_id + "' AND component_type:'" + data.component_type + "' AND component_id:'" + data.component_id + "'";
        let fields: string = 'ROWID';
        console.log(data);

        this._elasticService.getTableDataByRawQueryFields(this.user.company_id, 'board_components', raw_query, fields, 0, 500, 'DESC')
            .subscribe(
                response => {
                    console.log('if found', response);
                    if (Object.keys(response).length > 0) {
                        //already added
                        console.log('already added');
                        return;
                    } else {
                        //continue adding
                        let rowId = this.helper.generateUUID();
                        this._elasticService.addData(data, this.user.company_id, 'board_components', rowId)
                            .subscribe(
                                response => {
                                    console.log('saving', response);
                                    setTimeout(() => {
                                        this.loadComponents(this.active_board);
                                    }, 500);
                                },
                                error => {
                                    this.alertMessage = 'error in response';
                                }
                            );
                    }

                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );

    };

    public saveItemPosition = (item,itemComponent) => {
            let ROWID = item.data.ROWID;
            let new_position: any = {};
            new_position.rows = item.rows;
            new_position.cols = item.cols;
            new_position.x = item.x;
            new_position.y = item.y;
            item.data.board_position = new_position;
            console.log(item);
        // this._elasticService.addData(item.data, this.user.company_id, 'board_components', ROWID)
        //     .subscribe(
        //         response => {
        //             console.log(response, 'saved');
        //         },
        //         error => {
        //             this.alertMessage = 'error in response';
        //         }
        //     );
    };

    deleteBoard (id:string) {
        this._elasticService.deleteData(this.user.company_id, 'boards', id)
            .subscribe(
                response => {
                    console.log('saving', response);
                    setTimeout(() => {
                        this.getAllBoards();
                    }, 500);
                },
                error => {
                    this.alertMessage = 'error in response';
                }
            );

    };

    ngAfterViewChecked() {
        let self = this;
        $(".inputEditBoard").off().on('keypress', function (e) {
            console.log('keypress');
            if(e.which == 13) {
                var parent = $(this).closest('.btngroupboards');
                var new_board_name = $(parent).find('.inputEditBoard').val();
                if(new_board_name.length > 2){
                    var board_id = $(parent).attr('id');
                    $(parent).find('.btnboardname').show();
                    $(parent).find('.inputeditboardname').hide();
                    self.saveBoardName(board_id,new_board_name);
                }else{
                    $(parent).find('.inputEditBoard').focus();
                }


            }

        });

        $(".dropdown-item-rename").off().on('click',function(){
            var parent = $(this).closest('.btngroupboards');
            $(parent).find('.btnboardname').hide();
            $(parent).find('.inputeditboardname').show();
            $(parent).find('.inputEditBoard').focus();
        });

    }

    // editBoardName(board:any,$event){
    //     // let self = this;
    //     // let board_id = board.ROWID;
    //     // console.log(board);
    //     // console.log($event);
    //     // //this.showBoardEdit = true;
    //     // $(this).closest('#'+board_id).html();
    //
    // }

    saveBoardName(board_id:string, new_name:string){
        let board = _.find(this.all_boards,['ROWID',board_id]);
        if(board && new_name!==''){
            board.name = new_name;
            //save new data to database
            this._elasticService.addData(board, this.user.company_id, 'boards', board.ROWID)
                .subscribe(
                    response => {
                        console.log(response, 'board name updated');
                    },
                    error => {
                        this.alertMessage = 'error in response';
                    }
                );

        }
    }

    inviteUser = (email:string) => {
        this.invalidemail = false;
        //console.log(email);
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //return re.test(email.toLowerCase());
        //console.log(re.test(email.toLowerCase()));
        if (email != "" && !re.test(email.toLowerCase())) {
            console.log('cant send');
            this.invalidemail = true;
            return;
            //return { "incorrectMailFormat": true };
        }
        let invite:any = {};
        invite.board_id = this.active_board;
        invite.wsp_id = this.id;
        invite.email = email;
        //console.log(invite);
        this._elasticService.addData(invite, this.user.company_id, 'workspace_invites', this.helper.generateUUID())
            .subscribe(
                response => {
                    let inviteData:any = {};
                    inviteData.ws_name = this.workspace_details.ws_name;
                    inviteData.guest_email = email;
                    inviteData.wsp_id = this.id;
                    inviteData.author_id = this.user.id;
                    //console.log(inviteData);
                    this.authService.sendGuestWspNotification(inviteData)
                        .subscribe(
                            response => {
                                console.log(response, 'invite sent');
                                //console.log(response);
                            },
                            error => {
                                console.log(error);
                            }
                        );

                    this.inviteEmail = '';
                    invite = {};

                },
                error => {
                    console.log(error);
                }
            );

    }


}

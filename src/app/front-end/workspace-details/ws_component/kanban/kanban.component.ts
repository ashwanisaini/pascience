import { Component, OnInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import {AuthService, ElasticService, Utils} from '../../../../shared/services';
import { DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'app-component-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})

export class KanbanComponent implements OnInit {
    @Input() data: any = [];
    // The parent can bind to this event
    @Output() dataSelected = new EventEmitter();
    @Input() board: string;

    public cards:any = [];
    public card:any = {};
    public kanban_component:any;
    public company_id:string;
    public component_details:any = {};
    public component_details_columns = [];
    public tile_details:any = {};
    public showAddLink = true;
    public activeForm:string = '';
    public card_data:any = [];

    constructor(private _elasticService: ElasticService,
                private authService: AuthService,
                private helper: Utils,
                private dragulaService:DragulaService,
                private el: ElementRef) {

        // this.dragulaService = dragulaService;
        //
        // this.dragulaService.dropModel.subscribe((value) => {
        //     this.onDropModel(value.slice(1));
        // });

        // dragulaService.drag.subscribe((value) => {
        //     console.log(`drag: ${value[0]}`);
        //     this.onDrag(value.slice(1));
        //     console.log(value);
        // });
        // dragulaService.drop.subscribe((value) => {
        //     console.log(`drop: ${value[0]}`);
        //     this.onDrop(value.slice(1));
        //     console.log(value);
        // });
        // dragulaService.over.subscribe((value) => {
        //     console.log(`over: ${value[0]}`);
        //     this.onOver(value.slice(1));
        // });
        // dragulaService.out.subscribe((value) => {
        //     console.log(`out: ${value[0]}`);
        //     this.onOut(value.slice(1));
        // });

    }

  ngOnInit() {
      console.log('serving from component',this.data);
      this.kanban_component = this.data.data;
      this.getKanbanComponentDetails();
  }

    private hasClass(el: any, name: string) {
        return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
    }

    private addClass(el: any, name: string) {
        if (!this.hasClass(el, name)) {
            el.className = el.className ? [el.className, name].join(' ') : name;
        }
    }

    private removeClass(el: any, name: string) {
        if (this.hasClass(el, name)) {
            el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
        }
    }

    // onDropModel(args) {
    //     console.log(args);
    //     var cardId = args[0].firstElementChild.id;
    //     var toLane = args[1].id;
    //     var fromLane = args[2].id;
    //     console.log(args);
    //     console.log(this.cards);
    //
    //     // if(toLane !== fromLane) {
    //     //     this.cardService.transferCard(cardId, fromLane, toLane).subscribe(data => {
    //     //         console.log(data);
    //     //     });
    //     // }
    // }

    private onDrag(args) {
        let [e, el] = args;
        this.removeClass(e, 'ex-moved');
    }

    private onDrop(args) {
        let [e, el] = args;
        this.addClass(e, 'ex-moved');
    }

    private onOver(args) {
        let [e, el, container] = args;
        this.addClass(el, 'ex-over');
    }

    private onOut(args) {
        let [e, el, container] = args;
        this.removeClass(el, 'ex-over');
    }

    toggleAddCard = (col_number:string) =>{
        console.log(col_number);
        this.activeForm = col_number;
        this.showAddLink = !this.showAddLink;
    };

    hideAllCards = () =>{
        this.showAddLink = !this.showAddLink;
    };

    checkme = (event) =>{
        console.log(event);

    };


    getAddFormClass(colnumber:string){
        // console.log(colnumber)
        // let cssClasses;
        // if(colnumber === this.activeForm){
        //     cssClasses = {
        //         'activeformclass': true,
        //         'hideformclass': false
        //     }
        //
        // }else{
        //     cssClasses = {
        //         'activeformclass': false,
        //         'hideformclass': true
        //     }
        // }
        //
        // return cssClasses;
    }

    // hideAddForm(event){
    //
    // }

    public getKanbanComponentDetails = () => {
        let component_id = this.kanban_component.component_id;

        this._elasticService.getTableSearch(this.kanban_component.company_id,'kanban_master','component_id',component_id)
            .subscribe(
                response => {

                    this.component_details = response[0];
                    this.component_details_columns = _.values(this.component_details.columns);
                    console.log('***kanban details**');
                    console.log(JSON.stringify(response[0]));
                    if(this.kanban_component.company_id && _.isObject(this.component_details)){
                        this._elasticService.getTableSearchByRowId(this.kanban_component.company_id,'tiles', this.component_details.tile_id)
                            .subscribe(
                                response => {
                                    //this.all_boards = response;
                                    console.log('***tile details**');
                                    this.tile_details = response;
                                    console.log(this.tile_details);
                                    //this.getCards(this.tile_details.datasourceName);
                                },
                                error => {
                                    console.log(error);
                                    //this.alertMessage = 'error in response';
                                }
                            );
                    }


                },
                error => {
                    console.log(error);
                    //this.alertMessage = 'error in response';
                }
            );
    };

    ngAfterViewChecked() {
        let self = this;
        //console.log(self);
        $(".addFormLink").off().on('click', function () {
            //console.log(self);
            //console.log($(self).find('.showAddForm').html());
            console.log($(this).closest('.card-footer').find('.showAddForm').html());

            $('.showAddForm').hide();
            $('.addFormLink').show();
            $(this).hide();
            $(this).closest('.card-footer').find('.showAddForm').show();


        });

        $(".form-cancel-btn").off().on('click',function(){
            $('.showAddForm').hide();
            $('.addFormLink').show();
        });
    }

    cardMoved = ($event :any) => {
        console.log($event);
        let data = $event.dragData;
        data.id = _.uniqueId('id_drag_');
        this.cards.push($event.dragData);
    };

    // editColumn(current_col_name:string, col_number:number) {
    //     //this.currentTitle = this.column.title;
    //     this.editingColumn = true;
    //     let input = this.el.nativeElement
    //         .getElementsByClassName('column-header')[col_number]
    //         .getElementsByTagName('input')[col_number];
    //     setTimeout(function() { input.focus(); }, 0);
    // }

    // updateColumnOnBlur() {
    //     if (this.editingColumn) {
    //         this.updateColumn();
    //         this.clearAddCard();
    //     }
    // }
    //
    // addColumnOnEnter(event: KeyboardEvent) {
    //     if (event.keyCode === 13) {
    //         this.updateColumn();
    //     } else if (event.keyCode === 27) {
    //         this.cleadAddColumn();
    //     }
    // }
    //
    // clearAddCard() {
    //     //this.addingCard = false;
    //     //this.addCardText = '';
    // }
    //
    // updateColumn() {
    //     this.cleadAddColumn();
    //     // if (this.column.title && this.column.title.trim() !== '') {
    //     //     this._columnService.put(this.column).then(res => {
    //     //         this._ws.updateColumn(this.column.boardId, this.column);
    //     //     });
    //     //     this.editingColumn = false;
    //     // } else {
    //     //     this.cleadAddColumn();
    //     // }
    // }
    //
    // cleadAddColumn() {
    //     //this.column.title = this.currentTitle;
    //     this.editingColumn = false;
    // }

    public saveEditable = (value:string,component:any) => {
        console.log(value);
        console.log(component);
    };

    public deleteComponent = (component:any) => {
        let component_name = component.component_name;

        let ans = confirm('Are you sure want to delete ['+ component_name +'] from current board');
        if(ans){
            console.log(component);
            console.log(this.board);
        }

    };





}

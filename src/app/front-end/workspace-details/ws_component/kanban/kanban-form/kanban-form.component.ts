import { Component, OnInit, forwardRef, Input, OnChanges,EventEmitter, Output,ViewChild, ElementRef } from '@angular/core';


import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
//import {}    from '@angular/common';

@Component({
  selector: 'app-kanban-form',
  templateUrl: './kanban-form.component.html',
  styleUrls: ['./kanban-form.component.scss']
})
export class KanbanFormComponent implements OnInit {
    //@ViewChild('builder') builder:ElementRef;
    //@Input() carddata: any;
    @Input() tiledetails: any;
    @Input() colNumber:number;
    // The parent can bind to this event
    @Output() update = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<boolean>();
    public card:any = {};
    public showAddLink:boolean;

  constructor() {
      this.showAddLink = true;
  }

  ngOnInit() {
      console.log(this.tiledetails);
      console.log(this.colNumber);
  }

    addNewCard = (form_data:any) => {

        let tmpcard:any = this.tiledetails;
        this.update.emit(tmpcard);
        //this.cards.push(tmpcard);
    };

    // cancelAddNewCard = () =>{
    //     console.log('form add canceled');
    //     this.cancel.emit(true);
    // };

    // toggleAddCard = () =>{
    //     this.showAddLink = !this.showAddLink;
    //
    // }


}

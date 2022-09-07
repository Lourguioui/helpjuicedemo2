import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {CommonService} from "../../common/common.service";
import {Event} from "../../data/model/models";

@Component({
  selector: 'app-delete-event-modal',
  templateUrl: './delete-event-modal.component.html',
  styleUrls: ['./delete-event-modal.component.css']
})
export class DeleteEventModalComponent implements OnInit {

  @Input() event: Event;
  @Output() deleteEventEmitter = new EventEmitter<any>();
  constructor(public common: CommonService) { }

  ngOnInit(): void {
  }

  deleteEvent(){
    this.common.toggleModal('deleteEvent');
    this.deleteEventEmitter.emit();
  }

}

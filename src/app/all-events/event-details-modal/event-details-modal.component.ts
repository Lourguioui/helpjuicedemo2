import {Component, OnInit, Input} from '@angular/core';
import {Event} from "../../data/model/models";
import {CommonService} from "../../common/common.service";

@Component({
    selector: 'app-event-details-modal',
    templateUrl: './event-details-modal.component.html',
    styleUrls: ['./event-details-modal.component.css']
})
export class EventDetailsModalComponent implements OnInit {

    @Input() event: Event;
    @Input() settings: any = {};

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {

    }

}

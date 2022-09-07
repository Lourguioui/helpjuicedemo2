import {Component, Input, OnInit} from "@angular/core";
import {CommonService} from "../../common/common.service";

@Component({
    selector: "app-calendar-event-details",
    templateUrl: "./calendar-event-details.component.html",
    styleUrls: ["./calendar-event-details.component.css"],
})

export class CalendarEventDetailsComponent implements OnInit {

    @Input() item: any;
    @Input() settings: any;

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {
    }

    editEvent() {
        this.common.goTo(`/edit-event/${this.item.id}`);
        this.common.toggleModal('calendarEventDetails');
    }
}

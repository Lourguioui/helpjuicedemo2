import {Component, Input, OnInit} from "@angular/core";
import {
    addDays,
    areIntervalsOverlapping,
    differenceInCalendarDays,
    endOfDay,
    getHours,
    startOfDay,
} from "date-fns";
import {CommonService} from "../../common/common.service";
import {CalendarSettings, EventStatus} from "../../data/model/models";

@Component({
    selector: "app-calendar-body",
    templateUrl: "./calendar-body.component.html",
    styleUrls: ["./calendar-body.component.css"],
})

export class CalendarBodyComponent implements OnInit {

    @Input() view: "month" | "day";
    @Input() start: Date;
    @Input() data: any[];
    @Input() infoCells: any[];
    @Input() headerCells: any[];
    @Input() calendarSettings: CalendarSettings;
    @Input() settings: any;
    activeEvent: Event;
    eventStatus = EventStatus;

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {
    }

    renderEvent(event: any) {
        if (this.view === "month") {
            return this.renderEventMonthly(event);
        } else if (this.view === "day") {
            return this.renderEventDaily(event);
        }
    }

    renderEventDaily(event: any) {
        let interval = {
            start: getHours(new Date(event.startTime)),
            end: getHours(new Date(event.endTime)),
        };
        let calendarInterval = {
            start: getHours(this.start),
            end: getHours(endOfDay(this.start)),
        };

        let display = "none";
        let calendarCell = document.querySelector(".calendar-cell");
        let cellWidth = calendarCell.getBoundingClientRect().width;
        let cellHeight = calendarCell.getBoundingClientRect().height;
        if (areIntervalsOverlapping(interval, calendarInterval, {inclusive: true})) {
            display = "flex";
        }
        let start = interval.start - calendarInterval.start;
        if (start < 0) {
            start = 0;
        }
        let length = 0;
        if (calendarInterval.start > interval.start) {
            length = interval.end - calendarInterval.start;
        } else {
            length = interval.end - interval.start;
        }
        let left: string;
        if (start === 0) {
            left = `${0}px`;
        } else {
            left = `${start * cellWidth}px`;
        }
        return {
            left: left,
            width: `${length * cellWidth + cellWidth}px`,
            height: `${cellHeight}px`,
            display: `${display}`,
        };
    }

    renderEventMonthly(event: any) {
        let interval = {
            start: startOfDay(new Date(event.startDate)),
            end: startOfDay(new Date(event.endDate)),
        };
        let calendarInterval = {
            start: this.start,
            end: startOfDay(addDays(this.start, this.calendarSettings.columns)),
        };
        let display = "none";
        let calendarCell = document.querySelector(".calendar-cell");
        let cellWidth = calendarCell.getBoundingClientRect().width;
        let cellHeight = calendarCell.getBoundingClientRect().height;
        if (areIntervalsOverlapping(interval, calendarInterval, {inclusive: true})) {
            display = "flex";
        }
        let start = differenceInCalendarDays(interval.start, calendarInterval.start);
        if (start < 0) {
            start = 0;
        }
        let length = 0;
        if (calendarInterval.start > interval.start) {
            length = differenceInCalendarDays(interval.end, calendarInterval.start);
        } else {
            length = differenceInCalendarDays(interval.end, interval.start);
        }
        let left: string;
        if (start === 0) {
            left = `${0}px`;
        } else {
            left = `${start * cellWidth}px`;
        }
        return {
            left: left,
            width: `${length * cellWidth + cellWidth}px`,
            height: `${cellHeight}px`,
            display: `${display}`,
        };

    }

    eventOnClick(data: any) {
        this.activeEvent = data;
        this.common.toggleModal("calendarEventDetails");
    }

    displayData(object: Object, key: string): any {
        if (key.indexOf(".") !== -1) {
            return key.split(".").reduce((object, key) => object[key], object);
        } else {
            return object[key];
        }
    }
}

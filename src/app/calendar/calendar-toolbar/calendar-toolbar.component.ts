import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { addDays, startOfDay, startOfToday, subDays } from "date-fns";
import { CommonService } from "../../common/common.service";

@Component({
	selector: "app-calendar-toolbar",
	templateUrl: "./calendar-toolbar.component.html",
	styleUrls: ["./calendar-toolbar.component.css"],
})

export class CalendarToolbarComponent implements OnInit {

	@Input() view: "month" | "day";
	@Input() renderCalendar: Function;
	@Input() start: Date;
	@Input() settings: any = {};
	@Output() startChange: EventEmitter<Date> = new EventEmitter<Date>();
	@Output() viewChange: EventEmitter<"month" | "day"> = new EventEmitter<"month" | "day">();

	constructor(public common: CommonService) {}

	ngOnInit(): void {}

	toggleDayView() {
		this.view = "day";
		this.viewChange.emit(this.view);
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	toggleMonthView() {
		this.view = "month";
		this.viewChange.emit(this.view);
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	dateOnChange(date: Date) {
		this.start = date;
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	goToToday(): void {
		this.start = startOfToday();
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	next(days: number): void {
		if (this.view === "day") {
			days = 1;
		}
		this.start = startOfDay(addDays(this.start, days));
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	previous(days: number): void {
		if (this.view === "day") {
			days = 1;
		}
		this.start = startOfDay(subDays(this.start, days));
		this.startChange.emit(this.start);
		this.renderCalendar();
	}

	openCalendarSettings() {
		this.common.toggleModal("calendarSettings");
	}
}

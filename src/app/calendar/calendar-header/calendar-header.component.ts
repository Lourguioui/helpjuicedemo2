/**
 * Component Modules/Components
 */
import { Component, Input, OnInit } from "@angular/core";
import { CommonService } from "../../common/common.service";
import { CalendarSettings } from "../../data/model/models";
/**
 * Component Decorator
 */
@Component({
	selector: "app-calendar-header",
	templateUrl: "./calendar-header.component.html",
	styleUrls: ["./calendar-header.component.css"],
})
/**
 * Component Class
 */
export class CalendarHeaderComponent implements OnInit {
	/**
	 * Component Properties
	 */
	@Input() view: "month" | "day";
	@Input() infoCells: any[];
	@Input() headerCells: any[];
	@Input() calendarSettings: CalendarSettings;
	days: string[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
	months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
	/**
	 * Get day name
	 * @param date {Date}
	 */
	getDayName(date: Date): string {
		return this.days[date.getUTCDay()];
	}
	/**
	 * Get month name
	 * @param date {Date}
	 */
	getMonthName(date: Date): string {
		return this.months[date.getMonth()];
	}
}

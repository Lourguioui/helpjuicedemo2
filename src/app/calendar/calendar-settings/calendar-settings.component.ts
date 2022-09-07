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
	selector: "app-calendar-settings",
	templateUrl: "./calendar-settings.component.html",
	styleUrls: ["./calendar-settings.component.css"],
})
/**
 * Component Class
 */
export class CalendarSettingsComponent implements OnInit {
	/**
	 * Component Properties
	 */
	@Input() renderCalendar: Function;
	@Input() calendarSettings: CalendarSettings;
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {
		this.sliderColumnFormatter = this.sliderColumnFormatter.bind(this);
	}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {
		this.setCalendarSettings("restore");
	}
	/**
	 * Set calendar settings
	 */
	setCalendarSettings(action: string) {
		try {
			let calendarSettings: any;
			calendarSettings = localStorage.getItem("calendar-settings");
			if (!calendarSettings) {
				calendarSettings = {
					columns: this.calendarSettings.columns,
				};
				localStorage.setItem("calendar-settings", JSON.stringify(calendarSettings));
			} else {
				calendarSettings = JSON.parse(calendarSettings);
			}
			if (action === "save") {
				calendarSettings.columns = this.calendarSettings.columns;
				localStorage.setItem("calendar-settings", JSON.stringify(calendarSettings));
			} else if (action === "restore") {
				this.calendarSettings.columns = calendarSettings.columns;
			}
		} catch (err) {
			this.common.alert("error", this.common.translate("Unexpected Error!"));
		}
	}
	/**
	 * Number of columns on change
	 * @param cells {number}
	 */
	columnsOnChange(columns: number) {
		this.setCalendarSettings("save");
		this.renderCalendar();
	}
	/**
	 * Slider column formatter
	 */
	sliderColumnFormatter(value: number): string {
		return `${value} ${this.common.translate("Columns")}`;
	}
}

import {Component, OnInit} from "@angular/core";
import {addDays, eachDayOfInterval, eachHourOfInterval, endOfDay, startOfDay, startOfToday} from "date-fns";
import {CommonService} from "../common/common.service";
import {CalendarSettings} from "../data/model/models";
import {DateTimeFormats} from "../data/model/susoft-date-time-format";
import {DatesService} from "../common/services/dates/dates.service";
import moment from "moment";

@Component({
    selector: "app-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
})

export class CalendarComponent implements OnInit {

    loading: boolean = false;
    calendarSettings: CalendarSettings = new CalendarSettings();
    view: "month" | "day" = "month";
    start: Date = startOfToday();
    headerTitle: string[] = ["Event", "Type"];
    headerCells: any[] = [];
    infoCells: any[] = [
        {
            title: ["Event", "Name"],
            key: "name",
        },
    ];
    data: any[] = [];
    settings: any = {};

    constructor(public common: CommonService, public datesServices: DatesService) {
        this.renderCalendar = this.renderCalendar.bind(this);
    }

    async ngOnInit() {
        await this.getSettings();
        this.renderCalendar();
    }

    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.loading = false;
    }

    async renderCalendar() {
        await this.getData();
        this.renderHeaderCells();
        let element = document.getElementById("calendar-body");
        setTimeout(() => {
            if (element.scrollHeight > element.clientHeight) {
                element.style.width = `calc(100% + 17px)`;
            } else {
                element.style.width = `100%`;
            }
        }, 100);
    }

    async getData() {
        this.loading = true;
        let params: any;
        if (this.view === "month") {
            params = {
                start: moment(this.start).format(DateTimeFormats.YEAR_MONTH_DAY_TOGETHER).toString(),
                end: moment(startOfDay(addDays(this.start, this.calendarSettings.columns))).format(DateTimeFormats.YEAR_MONTH_DAY_TOGETHER).toString(),
            };
        } else if (this.view === "day") {
            params = {
                start: moment(startOfDay(new Date(this.start))).format(DateTimeFormats.YEAR_MONTH_DAY_TOGETHER).toString(),
                end: moment(endOfDay(new Date(this.start))).format(DateTimeFormats.YEAR_MONTH_DAY_TOGETHER).toString(),
            };
        }
        let res = await this.common.post(`/calendar/get-events`, params);
        if (res) {
            this.data = res;
            this.data.map(item => {
                item.map(record => {
                    record.startDate = this.datesServices.convertDBStringFormatToDate(record.startDate);
                    record.endDate = this.datesServices.convertDBStringFormatToDate(record.endDate);
                    record.startTime = this.datesServices.convertTimeStringToDate(record.startTime);
                    record.endTime = this.datesServices.convertTimeStringToDate(record.endTime);
                    return record;
                });
                return item;
            })
        }
        this.loading = false;
    }

    renderHeaderCells() {
        if (this.view === "month") {
            let start = startOfDay(new Date(this.start));
            let interval = {
                start: startOfDay(new Date(this.start)),
                end: startOfDay(addDays(start, this.calendarSettings.columns)),
            };
            this.headerCells = eachDayOfInterval(interval);
        } else if (this.view === "day") {
            let interval = {
                start: startOfDay(new Date(this.start)),
                end: endOfDay(new Date(this.start)),
            };
            this.headerCells = eachHourOfInterval(interval);
        }
    }
}

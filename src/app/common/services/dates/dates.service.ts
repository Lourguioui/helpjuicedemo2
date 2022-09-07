import {Injectable} from '@angular/core';
import {DateTimeFormats} from "../../../data/model/susoft-date-time-format";
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DatesService {


    constructor() {
    }

    convertDateToDBStringFormat(date: any) {
        return moment(date).format(DateTimeFormats.yyyymmddHHmmss).toString();
    }

    convertDBStringFormatToDate(date: any) {
        return moment(date, DateTimeFormats.yyyymmddHHmmss).toDate();
    }

    convertDateDBFormatToTimeString(time: any){
        return moment(time).format(DateTimeFormats.HOUR24_MINUTES).toString()
    }
    convertTimeToDBFormat(time: any){
        return moment(time).format(DateTimeFormats.HOUR_24H_MIN_TOGETHER).toString();
    }

    convertTimeStringToDate(time: any){
        return moment(time, DateTimeFormats.HOUR_24H_MIN_TOGETHER).toDate();
    }

    convertYearMonthDateFormat(date: any){
        return moment(date).format(DateTimeFormats.yyyymmddHHmmss);
    }
}

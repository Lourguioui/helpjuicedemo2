import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Event} from "../../../data/model/models";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {DatesService} from "../dates/dates.service";

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(public router: Router,
                public http: HttpClient,
                public datesService: DatesService) {
    }

    getEvents(params: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/events`, params, {withCredentials: true}).pipe(
            map(events => {
                events.data.map(record => {
                    record.startDate = this.datesService.convertDBStringFormatToDate(record.startDate);
                    record.endDate = this.datesService.convertDBStringFormatToDate(record.endDate);
                    record.startTime = this.datesService.convertTimeStringToDate(record.startTime);
                    record.endTime = this.datesService.convertTimeStringToDate(record.endTime);
                    return record;
                });
                return events;
            })
        );
    }

    getEventById(id: string): Observable<Event> {
        return this.http.get<Event>(`${environment.apiUrl}/events/${id}`, {withCredentials: true}).pipe(
            map(event => {
                event.endDate = this.datesService.convertTimeStringToDate(event.endDate);
                event.startDate = this.datesService.convertTimeStringToDate(event.startDate);
                event.endTime = this.datesService.convertTimeStringToDate(event.endTime);
                event.startTime = this.datesService.convertTimeStringToDate(event.startTime);
                return event;
            })
        )
    }

    createEvent(event: Event): Observable<any> {
        let data = new FormData();
        if (event.files && event.files.length > 0) {
            event.files.forEach((file: any) => {
                data.append(`EventImages[]`, file);
            });
            event.files = undefined;
            event.thumbnails = undefined;
        }
        event.startDate = this.datesService.convertDateToDBStringFormat(event.startDate);
        event.endDate = this.datesService.convertDateToDBStringFormat(event.endDate);
        event.startTime = this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(event.startTime));
        event.endTime = this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(event.endTime));
        data.append("item", JSON.stringify(event));

        return this.http.post<any>(`${environment.apiUrl}/events/create`, data, {withCredentials: true});
    }

    updateEvent(event: FormData): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/events/update`, event, {withCredentials: true});
    }

    deleteEvent(event: Event): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/events/delete`, event, {withCredentials: true});
    }

}

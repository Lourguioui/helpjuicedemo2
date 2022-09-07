import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {EventType} from "../../../data/model/models";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventTypesService {

    constructor(public router: Router,
                public http: HttpClient) {
    }

    getEventTypes(): Observable<EventType[]> {
        return this.http.get<EventType[]>(`${environment.apiUrl}/events/get-event-types`, {withCredentials: true});
    }

    updateEventType(eventType: EventType): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/event-types/update`, eventType, {withCredentials: true});
    }

    deleteEventType(id: string): Observable<any> {
        return this.http.get(`${environment.apiUrl}/event-types/delete/${id}`, {withCredentials: true});
    }

    createEventType(eventType: EventType): Observable<any> {
        return this.http.post(`${environment.apiUrl}/event-types/create`, eventType, {withCredentials: true});
    }

}

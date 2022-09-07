import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventRegistrationService {

    constructor(public http: HttpClient) {
    }

    getEvent(params: any): Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/public/get-event`, params);
    }

    getUserEvents(uuid): Observable<any>{
        return this.http.get<any>(`${environment.apiUrl}/public/get-events/${uuid}`);
    }

    eventRegister(params: any): Observable<any>{
        return this.http.post<any>(`${environment.apiUrl}/public/event-register`, params);
    }

}

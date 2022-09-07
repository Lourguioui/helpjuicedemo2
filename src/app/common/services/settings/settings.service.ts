import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(public http: HttpClient) {
    }

    getGeneralSettings(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/settings/get-general`);
    }

    getEmailSettings(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/settings/get-email-template`);
    }

    setGeneralSettings(formData: any): Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/settings/set-general`, formData);
    }

    setEmailSettings(formData: any): Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/settings/set-email-template`, formData)
    }

    setAgeSettings(params: any): Observable<any>{
      return this.http.post<any>(`${environment.apiUrl}/settings/set-age`, params);
    }

}

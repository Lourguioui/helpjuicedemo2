/**
 * Required Modules/Components
 */
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {catchError, map, mergeMap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {CommonService} from "./common.service";
import {LocalStorageRepository} from "../data/repository/local-storage.repository";
import {fromPromise} from "rxjs/internal-compatibility";

/**
 * Component Decorator
 */
@Injectable({
	providedIn: "root",
})
/**
 * Component Class
 */
export class AuthGuardService implements CanActivate {
	/**
	 * Component Properties
	 */

	/**
	 * Component Constructor
	 */
	constructor(private common: CommonService, private httpClient: HttpClient) {
	}

	/**
	 * Can activate method
	 * @param route {ActivatedRouteSnapshot}
	 * @returns {Observable<boolean>}
	 */
	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		try {
			let authToken = LocalStorageRepository.getToken();
			let user = LocalStorageRepository.getLoginResponse();
			let isLoggedIn = !authToken || !user;
			if (isLoggedIn) {
				return this.logout();
			}
			let model = route.data.model;
			let permission = route.data.permission;
			//Here we don't check permission for management but for every item of it
			//if the user has no access to any item of management then we don't activate management
			if (model && permission && model !== 'Management') {
				if (!this.common.isAccessAllowed(model, permission)) {
					return this.logout();
				}
			}
			return this.httpClient.get(`${environment.apiUrl}/auth/token-auth/${authToken}`).pipe(
				map((res) => !!res),
				catchError(() => this.logout())
			);
		} catch (err) {
			return this.logout();
		}
	}

	private logout() {
		return fromPromise(this.common.logout()).pipe(mergeMap(() => of(false)));
	}
}

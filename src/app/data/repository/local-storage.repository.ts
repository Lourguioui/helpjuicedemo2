import {LoginResponse} from "../model/login-response";

export class LocalStorageRepository {
	private static TOKEN_KEY = "token";
	private static USER_KEY = "user";

	public static setToken(token: string) {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	public static getToken(): string {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	public static removeToken() {
		localStorage.removeItem(this.TOKEN_KEY);
	}

	public static setUser(user: LoginResponse) {
		localStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	public static removeUser() {
		localStorage.removeItem(this.USER_KEY);
	}

	public static getLoginResponse(): LoginResponse {
		return JSON.parse(localStorage.getItem(this.USER_KEY));
	}

	public static asyncLocalStorage = {
		setItem: function (key, value) {
			return Promise.resolve().then(function () {
				localStorage.setItem(key, value);
			});
		},
		getItem: function (key) {
			return Promise.resolve().then(function () {
				return localStorage.getItem(key);
			});
		},
		removeItem: function (key) {
			return Promise.resolve().then(function () {
				return localStorage.removeItem(key);
			});
		}
	};
	
}

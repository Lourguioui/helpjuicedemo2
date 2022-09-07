
import {ApplicationRef, Injectable, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {HttpClient} from "@angular/common/http";
import {DatePipe, DecimalPipe, KeyValue} from "@angular/common";
import {environment} from "../../environments/environment";
import Days from "../common/days.json";
import Months from "../common/months.json";
import {LocalStorageRepository} from "../data/repository/local-storage.repository";
import * as moment from 'moment';

@Injectable({
	providedIn: "root",
})

export class CommonService implements OnInit {
	public uploadsUrl = environment.apiUrl;
	allowedRoles = ["company", "admin"];
	modals: any = {};
	days: string[] = Days;
	months: string[] = Months;
	mailFormat: any = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	language: string = "en";
	dateFormat: string = "dd/MM/yyyy";
	dateFormats: any[] = [];
	currencyFormat: string = "1.2-2";
	currencyFormats: any[] = [];
	timeFormat: string = "h:mm a";
	timeFormats: any[] = [];
	translation: any = {};


	constructor(
		public router: Router,
		public ALERT: NzMessageService,
		public http: HttpClient,
		public appRef: ApplicationRef,
		public datePipe: DatePipe,
		public decimalPipe: DecimalPipe,
		public notification: NzNotificationService
	) {
		this.disablePastDates = this.disablePastDates.bind(this);
		this.setDefaultFormats();
		this.setLanguage();
		this.getTranslation();
	}

	async ngOnInit() {}
	/****************************************************************
	 * GET/POST DATA
	 ****************************************************************/

	async getTranslation() {
		this.translation = await this.get(`/public/get-translation`, (err: any) => {
			if (err) {
				this.alert("error", `${this.translate(["Error", "loading", "translation", "file"])}!`);
			}
		});
	}

	async logout() {
		await this.get(`/auth/log-out`);

		LocalStorageRepository.removeToken();
		LocalStorageRepository.removeUser();

		this.goTo('/log-in');
	}

	async getUser() {
		let user = await this.get(`/auth/get-user`);
		if (user) {
			return user;
		} else {
			this.logout();
		}
	}

	async get(url: string, errCallback: Function = null): Promise<any> {
		try {
			let res = await this.http
				.get(`${environment.apiUrl}${url}`, { withCredentials: true })
				.toPromise();
			return res;
		} catch (err: any) {
			if (errCallback) {
				errCallback(err);
			} else {
				console.log(err);
				if (err && err.error.msg) {
					this.alert("error", this.translate(err.error.msg));
				} else {
					this.alert("error", this.translate(`Unexpected Error!`));
				}
			}
			return false;
		}
	}

	async post(url: string, data: any, errCallback: Function = null): Promise<any> {
		try {
			let res = await this.http
				.post(`${environment.apiUrl}${url}`, data, { withCredentials: true })
				.toPromise();
			return res;
		} catch (err) {
			if (errCallback) {
				errCallback(err);
			} else {
				console.log(err);
				if (err && err.error.msg) {
					this.alert("error", this.translate(err.error.msg));
				} else {
					this.alert("error", this.translate(`Unexpected Error!`));
				}
			}
			return false;
		}
	}
	/****************************************************************
	 * TRANSLATION
	 ****************************************************************/

	setLanguage() {
		let language = localStorage.getItem("language");
		if (!language) {
			localStorage.setItem("language", "en");
			language = "en";
		}
		this.language = language;
	}

	translate(sentence: string | string[], extra: any[] = null): string {
		let translated = ``;
		if (Array.isArray(sentence)) {
			for (let i = 0; i < sentence.length; i++) {
				let word = sentence[i];
				translated += `${this.getTranslatedWord(word)} `;
			}
		} else {
			translated = this.getTranslatedWord(sentence);
		}
		if (extra) {
			extra.map((item) => {
				translated += ` ${item}`;
			});
		}
		return translated;
	}

	getTranslatedWord(word: string): string {
		let translatedWord = ``;
		if (this.translation[word] && this.translation[word][this.language]) {
			translatedWord = `${this.translation[word][this.language]}`;
		} else {
			translatedWord = `${word}-(translation-missing)`;
		}
		return translatedWord;
	}

	changeLanguage(language: string) {
		localStorage.setItem("language", language);
		this.language = language;
		this.appRef.tick();
	}

	formatTime(time){
		return moment.utc(time, "HH:mm").toISOString()
	}

	/****************************************************************
	 * ACCESS PERMISSIONS
	 ****************************************************************/

	user(): any {
		try {
			return LocalStorageRepository.getLoginResponse();
		} catch (err) {
			return this.logout();
		}
	}

	isAccessAllowed(model: Array<string> | string, permission: string): boolean {
		try {
			let allowed = false;
			let user = LocalStorageRepository.getLoginResponse();
			if (user.role && this.allowedRoles.includes(user.role)) {
				allowed = true;
			}
			if (user.permissions) {
				if (Array.isArray(model)) {
					for (let modelItem of  model) {
						if (user.permissions[modelItem][permission]) {
							allowed = true;
						}
					}
				} else {
					if (user.permissions[model][permission]) {
						allowed = true;
					}
				}
			}
			return allowed;
		} catch (err) {
			this.alert("error", this.translate(`Unexpected Error!`));
			return false;
		}
	}
	/****************************************************************
	 * FORMAT CONFIGS
	 ****************************************************************/
	/**
	 * Set date/time/currency formats
	 */
	setDefaultFormats() {
		let dateFormat = localStorage.getItem("date-format");
		if (!dateFormat) {
			localStorage.setItem("date-format", "dd/MM/yyyy");
		}
		let timeFormat = localStorage.getItem("time-format");
		if (!timeFormat) {
			localStorage.setItem("time-format", "h:mm a");
		}
		let currencyFormat = localStorage.getItem("currency-format");
		if (!currencyFormat) {
			localStorage.setItem("currency-format", "1.2-2");
		}
	}

	// HELPERS

	goTo(routeName?: string, queryParams?: any) {
		if (routeName === "/") {
			this.router.navigate([`/`]);
		} else if(!routeName && !!queryParams) {
			this.router.navigate([], {
				queryParams: queryParams
			});
		} else if(!!queryParams) {
			this.router.navigate([`/${routeName}`], {
				queryParams: queryParams
			});
		} else {
			this.router.navigate([routeName]);
		}
	}

	alert(type: "error" | "success" | "warning" | "info", msg: string, duration: number = null) {
		switch (type) {
			case "error":
				this.ALERT.error(msg, { nzDuration: duration || 5000 });
				break;
			case "success":
				this.ALERT.success(msg, { nzDuration: duration || 5000 });
				break;
			case "warning":
				this.ALERT.warning(msg, { nzDuration: duration || 5000 });
				break;
			case "info":
				this.ALERT.info(msg, { nzDuration: duration || 5000 });
				break;
			default:
				break;
		}
	}

	notify(type: "error" | "success" | "warning" | "info", notification: { title: string; text: string }) {
		switch (type) {
			case "error":
				this.notification.error(notification.title, notification.text);
				break;
			case "success":
				this.notification.success(notification.title, notification.text);
				break;
			case "warning":
				this.notification.warning(notification.title, notification.text);
				break;
			case "info":
				this.notification.info(notification.title, notification.text);
				break;
			default:
				break;
		}
	}

	toggleModal(name: string) {
		this.modals[name] = !this.modals[name];
	}

	fillArrayWithNumbers(length: number, start: number): Array<number> {
		return new Array(length).fill(start).map((value, index) => value + index);
	}

	getDaysOfTheMonth(date: Date): number {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}
	/**
	 * Pipe original order object ngFor
	 */
	originalOrder(a: KeyValue<number, string>, b: KeyValue<number, string>): number {
		return 0;
	}

	acceptNumbersOnly(event: any): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}

	validEmail(value: string): boolean {
		let valid = true;
		if (!value.match(this.mailFormat)) {
			valid = false;
		}
		return valid;
	}

	disablePastDates(date: Date): boolean {
		if (date < new Date()) {
			return true;
		}
		return false;
	}

	print(id: string) {
		const content = document.getElementById(id);
		const printWindow = window.open("", "", "left=0,top=0,width=900,height=900");
		const styles = `
			<style>
				table th,
				table td {
					text-align:left;
					padding:15px;
					border:1px;
				}
				.actions,
				.ant-table-pagination,
				.ant-table-filter-trigger-container {
					display:none;
				}
			</style>
		`;
		printWindow.document.write(styles);
		printWindow.document.write(content.innerHTML);
		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	}

	isArray(data: any): boolean {
		return Array.isArray(data);
	}
	/**
	 * Print
	 * @param divId {any}
	 */
	/*
	print(divId: any) {
		let printContents = document.getElementById(divId).innerHTML;
		let originalContents = document.body.innerHTML;
		document.body.innerHTML = printContents;
		window.print();
		document.body.innerHTML = originalContents;
		window.location.reload();
	}
	*/
}

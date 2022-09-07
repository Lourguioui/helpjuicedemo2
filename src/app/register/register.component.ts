/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../common/common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.css"],
})
/**
 * Component Register
 */
export class RegisterComponent implements OnInit {
	/**
	 * Component Properties
	 */
	loading: boolean = false;
	disabled: boolean = false;
	formGroup!: FormGroup;
	countries: any[] = [];
	currencies: any[] = [];
	/**
	 * Component Constructor
	 */
	constructor(public formBuilder: FormBuilder, public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			name: [null, [Validators.required]],
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
			country: [null, [Validators.required]],
			currency: [null, [Validators.required]],
		});
		this.getCountries();
		this.getCurrencies();
	}
	/**
	 * Get countries
	 */
	async getCountries() {
		this.loading = true;
		let res = await this.common.get(`/public/get-country`);
		if (res) {
			this.countries = res;
		}
		this.loading = false;
	}
	/**
	 * Get currencies
	 */
	async getCurrencies() {
		this.loading = true;
		let res = await this.common.get(`/public/get-currency`);
		if (res) {
			this.currencies = Object.keys(res).map((key) => {
				return { label: res[key].code, value: res[key].code };
			});
		}
		this.loading = false;
	}
	/**
	 * Register
	 */
	async submit() {
		this.loading = true;
		for (const i in this.formGroup.controls) {
			this.formGroup.controls[i].markAsDirty();
			this.formGroup.controls[i].updateValueAndValidity();
		}
		if (this.formGroup.valid) {
			let params = this.formGroup.getRawValue();
			let res = await this.common.post(`/auth/sign-up`, params);
			if (res) {
				this.disabled = true;
				this.common.alert("success", this.common.translate(res.msg), 30000);
			}
		}
		this.loading = false;
	}
}

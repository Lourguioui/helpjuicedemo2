/**
 * Component Modules/Components
 */
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "../common/common.service";
import {LocalStorageRepository} from "../data/repository/local-storage.repository";
import {LoginResponse} from "../data/model/login-response";

/**
 * Component decorator
 */
@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
/**
 * Component Class
 */
export class LoginComponent implements OnInit {
	/**
	 * Component properties
	 */
	loading: boolean = false;
	formGroup!: FormGroup;

	/**
	 * Component constructor
	 */
	constructor(public formBuilder: FormBuilder, public common: CommonService) {
	}

	/**
	 * Component on init
	 */
	ngOnInit() {
		this.formGroup = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, [Validators.required]],
		});
	}

	/**
	 * Submit form
	 */
	async submit() {
		this.loading = true;
		for (const i in this.formGroup.controls) {
			this.formGroup.controls[i].markAsDirty();
			this.formGroup.controls[i].updateValueAndValidity();
		}
		if (this.formGroup.valid) {
			let params = this.formGroup.getRawValue();
			let res: LoginResponse = await this.common.post(`/auth/log-in`, params);
			if (res) {
				LocalStorageRepository.setToken(res.token);
				LocalStorageRepository.setUser(res);
				this.common.goTo("/");
			}
		}
		this.loading = false;
	}
}

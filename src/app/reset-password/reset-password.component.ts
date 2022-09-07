/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
/**
 * Component Decorator
 */
@Component({
	selector: "app-reset-password",
	templateUrl: "./reset-password.component.html",
	styleUrls: ["./reset-password.component.css"],
})
/**
 * Component Class
 */
export class ResetPasswordComponent implements OnInit {
	/**
	 * Component Properties
	 */
	loading: boolean = false;
	formGroup!: FormGroup;
	token: string;
	/**
	 * Component Constructor
	 */
	constructor(
		public formBuilder: FormBuilder,
		public common: CommonService,
		public route: ActivatedRoute
	) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {
		this.token = this.route.snapshot.queryParams.token;
		if (!this.token) {
			this.common.goTo("/404");
		}
		this.formGroup = this.formBuilder.group({
			password: [null, [Validators.required]],
			confirmPassword: [null, [Validators.required]],
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
			params.token = this.token;
			let res = await this.common.post(`/auth/reset-password`, params);
			if (res) {
				this.common.alert("success", this.common.translate(res.msg));
				setTimeout(() => {
					this.common.goTo("/log-in");
				}, 5000);
			}
		}
		this.loading = false;
	}
}

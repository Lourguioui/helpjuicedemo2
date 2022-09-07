import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../common/common.service";

@Component({
	selector: "app-forgot-password",
	templateUrl: "./forgot-password.component.html",
	styleUrls: ["./forgot-password.component.css"],
})

export class ForgotPasswordComponent implements OnInit {
	
	loading: boolean = false;
	formGroup!: FormGroup;
	
	constructor(public formBuilder: FormBuilder, public common: CommonService) {}
	
	ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
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
			let res = await this.common.post(`/auth/forgot-password`, params);
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

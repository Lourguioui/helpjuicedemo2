import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../common/common.service";
import {PaymentTypes} from "../data/model/settings-payment-types.model";

@Component({
	selector: "app-stripe-payment",
	templateUrl: "./stripe-payment.component.html",
	styleUrls: ["./stripe-payment.component.css"],
})

export class StripePaymentComponent implements OnInit {

	loading: boolean = false;
	formGroup!: FormGroup;
	stripe: any = {};
	paymentTypes = PaymentTypes;

	constructor(public formBuilder: FormBuilder, public common: CommonService) {}

	ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			stripePK: [this.stripe.stripePK, [Validators.required]],
			stripeSK: [this.stripe.stripeSK, [Validators.required]],
			enableOnlinePayment: [this.stripe.enableOnlinePayment],
		});
		this.getStripePayment();
	}

	async getStripePayment() {
		this.loading = true;
		let res = await this.common.get(`/settings/get-stripe-payment`);
		if (res) {
			this.stripe = res;
			this.formGroup.controls["stripePK"].setValue(this.stripe.stripePK);
			this.formGroup.controls["stripeSK"].setValue(this.stripe.stripeSK);
			this.formGroup.controls["enableOnlinePayment"].setValue(this.stripe.enableOnlinePayment);
		}
		this.loading = false;
	}

	async submit() {
		this.loading = true;
		for (const i in this.formGroup.controls) {
			this.formGroup.controls[i].markAsDirty();
			this.formGroup.controls[i].updateValueAndValidity();
		}
		if (this.formGroup.valid) {
			let params = this.formGroup.getRawValue();
			params = {...params, type: this.paymentTypes.Stripe};
			let res = await this.common.post(`/settings/set-stripe-payment`, params);
			if (res) {
				this.common.alert("success", this.common.translate(res.msg));
			}
		}
		this.loading = false;
	}
}

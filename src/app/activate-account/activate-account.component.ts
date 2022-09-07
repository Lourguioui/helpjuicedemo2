import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-activate-account",
	templateUrl: "./activate-account.component.html",
	styleUrls: ["./activate-account.component.css"],
})

export class ActivateAccountComponent implements OnInit {
	
	loading: boolean = true;
	
	constructor(public common: CommonService, public route: ActivatedRoute) {}
	
	ngOnInit(): void {
		this.activateAccount();
	}
	/**
	 * Activate account
	 */
	async activateAccount() {
		let token = this.route.snapshot.queryParams.token;
		let res = await this.common.get(`/auth/activate-account/${token}`);
		if (res) {
			this.common.alert("success", this.common.translate(res.msg));
			setTimeout(() => {
				window.location.href = "/log-in";
			}, 3000);
		}
		this.loading = false;
	}
}

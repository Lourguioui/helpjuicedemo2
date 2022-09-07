/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-terms-and-conditions",
	templateUrl: "./terms-and-conditions.component.html",
	styleUrls: ["./terms-and-conditions.component.css"],
})
/**
 * Component Class
 */
export class TermsAndConditionsComponent implements OnInit {
	/**
	 * Component Properties
	 */
	loading: boolean = false;
	content: string = "";
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {
		this.getContent();
	}
	/**
	 * Get content
	 */
	async getContent() {
		this.loading = true;
		let res = await this.common.get(`/public/get-terms-content`);
		if (res) {
			this.content = res.content;
		}
		this.loading = false;
	}
}

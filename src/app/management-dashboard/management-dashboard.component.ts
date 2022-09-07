/**
 * Required Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-management-dashboard",
	templateUrl: "./management-dashboard.component.html",
	styleUrls: ["./management-dashboard.component.css"],
})
/**
 * Component Class
 */
export class ManagementDashboardComponent implements OnInit {
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
		let res = await this.common.get(`/dashboard/get-tutorial-content`);
		if (res) {
			this.content = res.content;
		}
		this.loading = false;
	}
}

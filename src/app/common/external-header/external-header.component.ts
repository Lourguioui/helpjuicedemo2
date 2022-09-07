/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-external-header",
	templateUrl: "./external-header.component.html",
	styleUrls: ["./external-header.component.css"],
})
/**
 * Component Class
 */
export class ExternalHeaderComponent implements OnInit {
	/**
	 * Component Properties
	 */
	languages: string[] = [];
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component OnInit
	 */
	ngOnInit(): void {
		this.getLanguages();
	}
	/**
	 * Get languages
	 */
	async getLanguages() {
		let res = await this.common.get(`/public/get-languages`);
		if (res) {
			this.languages = res;
		}
	}
}

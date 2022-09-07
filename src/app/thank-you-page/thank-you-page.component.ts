/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-thank-you-page",
	templateUrl: "./thank-you-page.component.html",
	styleUrls: ["./thank-you-page.component.css"],
})
/**
 * Component Class
 */
export class ThankYouPageComponent implements OnInit {
	/**
	 * Component Properties
	 */
	loading: boolean = false;
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
}

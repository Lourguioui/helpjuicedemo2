/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["./footer.component.css"],
})
/**
 * Component Class
 */
export class FooterComponent implements OnInit {
	/**
	 * Component Properties
	 */
	year: number = new Date().getFullYear();
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
}

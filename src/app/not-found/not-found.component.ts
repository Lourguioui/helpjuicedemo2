/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-not-found",
	templateUrl: "./not-found.component.html",
	styleUrls: ["./not-found.component.css"],
})
/**
 * Component Class
 */
export class NotFoundComponent implements OnInit {
	/**
	 * Component Properties
	 */
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
}

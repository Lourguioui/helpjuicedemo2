/**
 * Required modules/components
 */
import { Component, Input, OnInit } from "@angular/core";
/**
 * Component Decorator
 */
@Component({
	selector: "app-external-page",
	templateUrl: "./external-page.component.html",
	styleUrls: ["./external-page.component.css"],
})
/**
 * Component Class
 */
export class ExternalPageComponent implements OnInit {
	/**
	 * Component Properties
	 */
	@Input() display: string = "flex";
	/**
	 * Component Constructor
	 */
	constructor() {}

	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
}

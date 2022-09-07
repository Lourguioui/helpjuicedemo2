/**
 * Component Modules/Components
 */
import { Component } from "@angular/core";
import { DatePipe, DecimalPipe } from "@angular/common";
/**
 * Component decorator
 */
@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
	providers: [DatePipe, DecimalPipe],
})
/**
 * Component Class
 */
export class AppComponent {
	/**
	 * Component Properties
	 */
	title = "susoft-events";
	/**
	 * Component Constructor
	 */
	constructor() {}
}

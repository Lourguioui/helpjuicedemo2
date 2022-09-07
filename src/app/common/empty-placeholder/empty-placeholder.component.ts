/**
 * Component Modules/Components
 */
import { Component, OnInit, Input } from "@angular/core";
import { CommonService } from "../common.service";
/**
 * Component Decorator
 */
@Component({
	selector: "app-empty-placeholder",
	templateUrl: "./empty-placeholder.component.html",
	styleUrls: ["./empty-placeholder.component.css"],
})
/**
 * Component Class
 */
export class EmptyPlaceholderComponent implements OnInit {
	/**
	 * Component Properties
	 */
	@Input() text?: string;
	/**
	 * Component Constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Component On Init
	 */
	ngOnInit(): void {}
}

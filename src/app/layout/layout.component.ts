/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common/common.service";
/**
 * Component decorator
 */
@Component({
	selector: "app-layout",
	templateUrl: "./layout.component.html",
	styleUrls: ["./layout.component.css"],
})
/**
 * Component Class
 */
export class LayoutComponent implements OnInit {
	/**
	 * Component properties
	 */
	loading: boolean = false;
	/**
	 * Component constructor
	 */
	constructor(public common: CommonService) {}
	/**
	 * Submit form
	 */
	async ngOnInit() {}
}

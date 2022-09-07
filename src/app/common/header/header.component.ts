/**
 * Component Modules/Components
 */
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../common.service";
import Links from "./links.json";
import {environment} from "../../../environments/environment";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"],
})

export class HeaderComponent implements OnInit {
	loading: boolean = false;
	links: any[] = Links;
	languages: string[] = [];
	apiUrl = environment.apiUrl;

	constructor(public common: CommonService) {}

	async ngOnInit() {
		this.getLanguages();
	}

	async getLanguages() {
		let res = await this.common.get(`/public/get-languages`);
		if (res) {
			this.languages = res;
		}
	}

	toggleFullscreen() {
		const html = document.documentElement;
		if (html.requestFullscreen) {
			html.requestFullscreen();
		}
	}
}

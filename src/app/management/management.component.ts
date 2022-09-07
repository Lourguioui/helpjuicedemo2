import {Component, OnInit} from "@angular/core";
import {CommonService} from "../common/common.service";
import LinkSections from "./links.json";

@Component({
    selector: "app-management",
    templateUrl: "./management.component.html",
    styleUrls: ["./management.component.css"],
})

export class ManagementComponent implements OnInit {

    linkSections: any = LinkSections;
    isCollapsed: boolean = false;

    constructor(public common: CommonService) {
    }

    async ngOnInit() {
    }
}

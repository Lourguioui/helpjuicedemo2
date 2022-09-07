import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../common/common.service";
import { Event } from "../data/model/models";
import {DeviceInfoService} from "../common/services/device-info.service";

@Component({
	selector: "app-checking-in",
	templateUrl: "./checking-in.component.html",
	styleUrls: ["./checking-in.component.css"],
})

export class CheckingInComponent implements OnInit {

	loading: boolean = false;
	isHandset = false;
	event: Event = new Event();
	settings: any = {};

	constructor(public common: CommonService,
				private deviceInfoService: DeviceInfoService,
				public route: ActivatedRoute) { }
	ngOnInit(): void {
		this.deviceInfoService.getIsHandset$().subscribe(result => this.isHandset = result);
		this.getSettings();
		this.getEvent();
	}

	ngAfterViewInit(): void {
	}

	async getEvent() {
		this.loading = true;
		let res = await this.common.get(`/events/${this.route.snapshot.params.id}`);
		if (res) {
			this.event = res;
		}
		this.loading = false;
	}

	async getSettings() {
		this.loading = true;
		let res = await this.common.get(`/settings/get-general`);
		if (res) {
			this.settings = res;
		}
		this.loading = false;
	}

	async checkInParticipant(EventParticipantId: number) {
		this.loading = true;
		let params = {
			id: this.route.snapshot.params.id,
			EventParticipantId: EventParticipantId,
		};
		let res = await this.common.post(`/events/check-in-participant`, params);
		if (res) {
			this.common.alert("success", this.common.translate(res.msg));
		}
		this.loading = false;
		this.getEvent();
	}

	async onQrCodeScanSuccess(decodedText: any) {
		this.loading = true;
		try {
			let object = JSON.parse(decodedText);
			let res = await this.common.post(`/events/check-in-with-qr`, object);
			if (res) {
				this.common.alert("success", this.common.translate(res.msg));
				await this.getEvent();
			}
		} catch (err) {
			this.common.alert("error", this.common.translate("Unexpected Error!"));
		}
		this.loading = false;
	}
}

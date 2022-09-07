import {Component, OnInit} from "@angular/core";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {CommonService} from "../common/common.service";
import {EmailTemplate} from "./models/email-template-model";
import {GeneralSettings} from "./models/user-settings.model";

@Component({
    selector: "app-user-settings",
    templateUrl: "./user-settings.component.html",
    styleUrls: ["./user-settings.component.css"],
})
export class UserSettingsComponent implements OnInit {
    loading: boolean = false;
    generalSettings: any = GeneralSettings;
    emailTemplate: any = EmailTemplate;

    settings: any = {};
    emailSettings: any = {};
    ageSettings: any = {};

    siteUrl: string = `${window.location.protocol}//${window.location.hostname}`;
    onlineRegisterWidget: string;
    iframeLink: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.siteUrl}/user-events/${this.settings.uuid}`
    );

    constructor(public common: CommonService, public sanitizer: DomSanitizer) {
        this.saveSettings = this.saveSettings.bind(this);
        this.saveEmailSettings = this.saveEmailSettings.bind(this);

    }

    ngOnInit(): void {
        this.getSettings();
        this.getEmailSettings();
    }

    // Get settings
    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
            this.ageSettings = {
                childAge: res.childAge,
                adultAge: res.adultAge,
                oldAge: res.oldAge
            };
            this.onlineRegisterWidget = `<iframe src="${this.siteUrl}/user-events/${this.settings.uuid}"></iframe>`;
            this.iframeLink = this.sanitizer.bypassSecurityTrustResourceUrl(
                `${this.siteUrl}/user-events/${this.settings.uuid}`
            );
        }
        this.loading = false;
    }


    async getEmailSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-email-template`);
        if (res) {
            this.emailSettings = res
        }
        this.loading = false;

    }

    // Save user settings
    async saveSettings() {
        this.loading = true;
        let formData = new FormData();
        if (this.settings.file) {
            formData.append("logo", this.settings.file);
            delete this.settings.file;
        }
        if (
            this.settings.emailTemplateImage &&
            this.settings.emailTemplateImage.name
        ) {
            formData.append("emailTemplateImage", this.settings.emailTemplateImage);
        }
        this.settings.logo = undefined;
        formData.append("item", JSON.stringify(this.settings));
        let res = await this.common.post(`/settings/set-general`, formData);
        if (res) {
            this.common.alert("success", this.common.translate(res.msg.en));
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        this.loading = false;
    }

    async saveEmailSettings() {
        this.loading = true;
        let formData = new FormData();

        if (this.emailSettings.file) {
            formData.append("file", this.emailSettings.file);
            this.emailSettings.images = this.emailSettings.file.name
        }
        formData.append("item", JSON.stringify(this.emailSettings));


        let res = await this.common.post(`/settings/set-email-template`, formData);
        if (res) {
            this.common.alert("success", this.common.translate(res.msg.en));
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        this.loading = false;
    }

    async saveAgeSettings() {
        this.loading = true;
        let res = await this.common.post(`/settings/set-age`, this.ageSettings);
        if (res) {
            this.common.alert("success", this.common.translate(res.msg.en));
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
        this.loading = false;
    }
}

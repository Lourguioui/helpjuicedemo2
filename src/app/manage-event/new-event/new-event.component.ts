import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "../../common/common.service";
import { Event } from "../../data/model/models";
import { EventDetailsComponent } from "../event-details/event-details.component";
import { EventDatesComponent } from "../event-dates/event-dates.component";
import { EventOrganizersComponent } from "../event-organizers/event-organizers.component";
import { EventParticipantsComponent } from "../event-participants/event-participants.component";
import { EventsService } from "../../common/services/events/events.service";

@Component({
    selector: "app-new-event",
    templateUrl: "./new-event.component.html",
    styleUrls: ["./new-event.component.css"],
})

export class NewEventComponent implements OnInit {

    @ViewChild(EventDetailsComponent) eventDetailsComponent: EventDetailsComponent;
    @ViewChild(EventDatesComponent) eventDatesComponent: EventDatesComponent;
    @ViewChild(EventOrganizersComponent) eventOrganizersComponent: EventOrganizersComponent;
    @ViewChild(EventParticipantsComponent) eventParticipantsComponent: EventParticipantsComponent;

    loading: boolean = false;
    currentStep: number = 0;
    event: Event = new Event();
    settings: any = {};

    constructor(public common: CommonService,
        public eventsService: EventsService) {
    }

    async ngOnInit() {
        await this.getSettings();
    }

    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.loading = false;
    }

    next() {
        switch (this.currentStep) {
            case 0:
                if (this.eventDatesComponent.submitDates()) {
                    this.currentStep++;
                }
                break;
            case 1:
                if (this.eventDetailsComponent.submitDetails()) {
                    this.currentStep++;
                }
                break;
            case 2:
                if (this.eventOrganizersComponent.submitForms()) {
                    this.currentStep++;
                }
                break;
            case 3:
                if (this.eventParticipantsComponent.submitForms()) {
                    this.submit();
                }
                break;
            default:
                break;
        }
    }


    previous() {
        if (this.currentStep > 0) {
            this.currentStep--;
        }
    }

    submit() {
        this.loading = true;
        this.eventsService.createEvent(this.event).subscribe((res) => {
            this.common.alert("success", this.common.translate("Event Created Successfully!"));
            setTimeout(() => {
                this.common.goTo("/calendar");
            }, 2000);
            this.loading = false;
        },
            error => {
                this.loading = false;
                this.common.alert("error", this.common.translate("Unexpected Error!"));
            });
    }
}

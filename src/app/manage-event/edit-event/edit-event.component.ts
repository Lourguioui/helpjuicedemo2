import {Component, OnInit, ViewChild} from "@angular/core";
import {Event, EventType} from "../../data/model/models";
import {CommonService} from "../../common/common.service";
import {ActivatedRoute} from "@angular/router";
import {EventTypesService} from "../../common/services/events/event-types.service";
import {EventsService} from "../../common/services/events/events.service";
import {EventDetailsComponent} from "../event-details/event-details.component";
import {EventDatesComponent} from "../event-dates/event-dates.component";
import {EventOrganizersComponent} from "../event-organizers/event-organizers.component";
import {EventParticipantsComponent} from "../event-participants/event-participants.component";

@Component({
    selector: "app-edit-event",
    templateUrl: "./edit-event.component.html",
    styleUrls: ["./edit-event.component.css"],
})

export class EditEventComponent implements OnInit {

    @ViewChild(EventDetailsComponent) eventDetailsComponent: EventDetailsComponent;
    @ViewChild(EventDatesComponent) eventDatesComponent: EventDatesComponent;
    @ViewChild(EventOrganizersComponent) eventOrganizersComponent: EventOrganizersComponent;
    @ViewChild(EventParticipantsComponent) eventParticipantsComponent: EventParticipantsComponent;

    loading: boolean = true;
    event: Event = new Event();
    settings: any = {};
    EventTypes: EventType[] = [];
    data;

    constructor(public common: CommonService,
                public route: ActivatedRoute,
                public eventTypesService: EventTypesService,
                public eventsService: EventsService) {
    }

    async ngOnInit() {
        await this.getSettings();
        await this.getEventTypes();
        this.getEvent();
    }

    getEvent() {
        this.loading = true;
        this.eventsService.getEventById(this.route.snapshot.params.id).subscribe((res: Event) => {
                this.event = res;
                this.loading = false;
            },
            error => {
                this.common.alert("error", this.common.translate('Unexpected Error!'));
                this.loading = false
            })
    }

    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.loading = false;
    }

    getEventTypes() {
        this.eventTypesService.getEventTypes().subscribe((res: EventType[]) => {
                this.EventTypes = res;
            },
            error => {
                this.common.alert("error", this.common.translate('Unexpected Error!'));
            })
    }

    valid(): boolean {
        return this.eventDetailsComponent.submitDetails() &&
            this.eventDatesComponent.submitDates() &&
            this.eventOrganizersComponent.submitForms() &&
            this.eventParticipantsComponent.submitForms();
    }

    submitClicked() {
        if (!this.valid()) {
            return this.common.alert("error", this.common.translate("Please fill all the required fields!"));
        }
        if (this.event.repeat) {
            this.common.toggleModal("editEvent");
        } else {
            this.submit();
        }
    }

    submit() {
        this.loading = true;
        let data = new FormData();
        if (this.event.files && this.event.files.length > 0) {
            this.event.files.forEach((file: any) => {
                data.append(`EventImages[]`, file);
            });
            this.event.files = undefined;
        }
        data.append("item", JSON.stringify(this.event));
        this.eventsService.updateEvent(data).subscribe((res) => {
                this.common.alert("success", this.common.translate(res.msg));
                if (this.common.modals.editEvent) {
                    this.common.toggleModal("editEvent");
                }
                setTimeout(() => {
                    this.common.goTo("/all-events");
                }, 1000);
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.common.alert("error", this.common.translate("Unexpected Error!"));
            });
    }
}

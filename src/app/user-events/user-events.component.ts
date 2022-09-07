import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../common/common.service";
import {Event} from "../data/model/models";
import {EventRegistrationService} from "../common/services/public/event-registration.service";

@Component({
    selector: "app-user-events",
    templateUrl: "./user-events.component.html",
    styleUrls: ["./user-events.component.css"],
})

export class UserEventsComponent implements OnInit {
    loading: boolean = false;
    user: any = {};
    events: Event[] = [];

    constructor(public common: CommonService,
                public route: ActivatedRoute,
                public eventRegistrationService: EventRegistrationService) {
    }

    ngOnInit(): void {
        this.getEvents();
    }

    getEvents() {
        this.loading = true;
        let uuid = this.route.snapshot.params.uuid;
        this.eventRegistrationService.getUserEvents(uuid).subscribe(res => {
            if (res) {
                this.user = res.user;
                this.events = res.events;
            }
        }, error => {
            this.common.alert("error", this.common.translate(`Unexpected Error!`));
        });
        this.loading = false;
    }

    viewEvent(id: number) {
        this.common.goTo(`/event-register/${this.route.snapshot.params.uuid}/${id}`);
    }
}

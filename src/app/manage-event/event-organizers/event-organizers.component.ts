import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit
} from "@angular/core";
import {Event, EventOrganizer, Organizer} from "../../data/model/models";
import {CommonService} from "../../common/common.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "app-event-organizers",
    templateUrl: "./event-organizers.component.html",
    styleUrls: ["./event-organizers.component.css"],
})

export class EventOrganizersComponent implements OnInit {
    @Input() event: Event;
    loading: boolean = false;
    selectedTab;
    organizerFormGroups: FormGroup[] = [];

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {
        this.initForms();
    }

    initForms() {
        for (const eventOrganizer of this.event.EventOrganizers) {
            this.organizerFormGroups.push(this.generateFormGroupForOrganizer(eventOrganizer.Organizer));
        }
    }
    addOrganizer() {
        let newEventOrganizer = new EventOrganizer();
        newEventOrganizer.Organizer = new Organizer();
        this.event.EventOrganizers.push(newEventOrganizer);
        this.selectedTab = this.event.EventOrganizers.length;

        this.organizerFormGroups.push(this.generateFormGroupForOrganizer(newEventOrganizer.Organizer));
    }

    removeOrganizer(event: any) {
        if (!this.event.removedOrganizers) {
            this.event.removedOrganizers = [];
        }
        //remove the formGroup of the selected organizer
        this.organizerFormGroups.splice(event.index, 1);

        let eventOrganizer = this.event.EventOrganizers.splice(event.index, 1);
        if (eventOrganizer[0].id) {
            this.event.removedOrganizers.push(eventOrganizer[0].id);
        }
    }

    validateForm(): boolean {
        let valid = true;
        for (const organizer of this.organizerFormGroups) {
            for (const i in organizer.controls) {
                organizer.controls[i].markAsDirty();
                organizer.controls[i].markAsTouched();
                organizer.controls[i].updateValueAndValidity();
                valid = valid && organizer.valid;
            }
        }
        return valid;
    }

    generateFormGroupForOrganizer(organizer?: Organizer): FormGroup {
        if (organizer) {
            return new FormGroup({
                name: new FormControl(organizer.name, Validators.required),
                email: new FormControl(organizer.email, [Validators.required, Validators.email]),
                phone: new FormControl(organizer.phone)
            });
        }
        return null;
    }

    submitForms(): boolean {
        let result = this.validateForm();
        if (result) {
            this.event.EventOrganizers.forEach((elt, index) => {
                elt.Organizer.name = this.organizerFormGroups[index].get('name').value;
                elt.Organizer.email = this.organizerFormGroups[index].get('email').value;
                if (this.organizerFormGroups[index].get('phone').value) {
                    elt.Organizer.phone = this.organizerFormGroups[index].get('phone').value.e164Number;
                } else {
                    elt.Organizer.phone = undefined;
                }
            });
        }
        return result;
    }
}

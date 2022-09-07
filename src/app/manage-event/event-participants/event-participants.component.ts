import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Event, EventParticipant, Participant} from "../../data/model/models";
import {CommonService} from "../../common/common.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: "app-event-participants",
    templateUrl: "./event-participants.component.html",
    styleUrls: ["./event-participants.component.css"],
})

export class EventParticipantsComponent implements OnInit {
    @Input() event: Event;
    loading: boolean = false;
    selectedTab;
    participantFormGroups: FormGroup[] = [];

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {
        this.initForms();
    }

    initForms() {
        for (const eventParticipant of this.event.EventParticipants) {
            this.participantFormGroups.push(this.generateFormGroupForParticipant(eventParticipant.Participant));
        }
    }

    addParticipant() {
        let newEventParticipant = new EventParticipant();
        newEventParticipant.Participant = new Participant();
        this.event.EventParticipants.push(newEventParticipant);
        this.selectedTab = this.event.EventParticipants.length;

        this.participantFormGroups.push(this.generateFormGroupForParticipant(newEventParticipant.Participant));
    }

    removeParticipant(event: any) {
        if (!this.event.removedParticipants) {
            this.event.removedParticipants = [];
        }
        this.participantFormGroups.splice(event.index, 1);
        let eventParticipant = this.event.EventParticipants.splice(event.index, 1);
        if (eventParticipant[0].id) {
            this.event.removedParticipants.push(eventParticipant[0].id);
        }
    }

    validateForm(): boolean {
        let valid = true;
        for (const participant of this.participantFormGroups) {
            for (const i in participant.controls) {
                participant.controls[i].markAsDirty();
                participant.controls[i].markAsTouched();
                participant.controls[i].updateValueAndValidity();
                valid = valid && participant.valid;
            }
        }
        return valid;
    }

    generateFormGroupForParticipant(participant?: Participant): FormGroup {
        if (participant) {
            return new FormGroup({
                name: new FormControl(participant.name, Validators.required),
                email: new FormControl(participant.email, [Validators.required, Validators.email]),
                age: new FormControl(participant.age, Validators.required),
                phone: new FormControl(participant.phone)
            });
        }
        return null;
    }

    submitForms(): boolean {
        let result = this.validateForm();
        if (result) {
            this.event.EventParticipants.forEach((elt, index) => {
                elt.Participant.name = this.participantFormGroups[index].get('name').value;
                elt.Participant.email = this.participantFormGroups[index].get('email').value;
                elt.Participant.age = this.participantFormGroups[index].get('age').value;
                if (this.participantFormGroups[index].get('phone').value) {
                    elt.Participant.phone = this.participantFormGroups[index].get('phone').value.e164Number;
                } else {
                    elt.Participant.phone = undefined;
                }
            });
        }
        return result;
    }
}

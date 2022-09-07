import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {Event, EventType, EventStatus} from "../../data/model/models";
import {CommonService} from "../../common/common.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EventTypesService} from "../../common/services/events/event-types.service";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    styleUrls: ["./event-details.component.css"],
})

export class EventDetailsComponent implements OnInit {

    @Input() event: Event;

    loading: boolean = false;
    EventTypes: EventType[] = [];
    eventStatus = EventStatus;

    nameFormControl = new FormControl('', [Validators.required]);
    typeIdFormControl = new FormControl('', [Validators.required]);
    statusFormControl = new FormControl(this.eventStatus.Pending, Validators.required);
    locationFormControl = new FormControl('', [Validators.required]);
    maxParticipantsFormControl = new FormControl('', [Validators.required, Validators.min(1)]);
    priceFormControl = new FormControl('', [Validators.required, Validators.min(0)]);
    freeFormControl = new FormControl(false);
    samePriceForChildFormControl = new FormControl(true, [Validators.required]);
    samePriceForStudentFormControl = new FormControl(true, [Validators.required]);
    samePriceForAdultFormControl = new FormControl(true, [Validators.required]);
    samePriceForSeniorFormControl = new FormControl(true, [Validators.required]);
    seniorPriceFormControl = new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(0)]);
    adultPriceFormControl = new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(0)]);
    childPriceFormControl = new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(0)]);
    studentPriceFormControl = new FormControl({value: null, disabled: false}, [Validators.required, Validators.min(0)]);
    descriptionFormControl = new FormControl('', [Validators.required]);
    notesFormControl = new FormControl('');

    eventDetailsFormGroup = new FormGroup({
        name: this.nameFormControl,
        typeId: this.typeIdFormControl,
        status: this.statusFormControl,
        maxParticipants: this.maxParticipantsFormControl,
        price: this.priceFormControl,
        free: this.freeFormControl,
        seniorPrice: this.seniorPriceFormControl,
        adultPrice: this.adultPriceFormControl,
        childPrice: this.childPriceFormControl,
        studentPrice: this.studentPriceFormControl,
        description: this.descriptionFormControl,
        notes: this.notesFormControl,
        location: this.locationFormControl
    });

    constructor(public common: CommonService, public eventTypesService: EventTypesService) {
    }

    ngOnInit(): void {
        this.getEventTypes();
        this.initForm();
    }

    initForm() {
        if (this.event) {
            this.nameFormControl.setValue(this.event.name);
            this.statusFormControl.setValue(this.event.status);
            this.maxParticipantsFormControl.setValue(this.event.numOfParticipants);
            this.freeFormControl.setValue(this.event.free);
            this.priceFormControl.setValue(this.event.price);
            this.seniorPriceFormControl.setValue(this.event.seniorPrice);
            this.adultPriceFormControl.setValue(this.event.adultPrice);
            this.studentPriceFormControl.setValue(this.event.studentPrice);
            this.childPriceFormControl.setValue(this.event.childPrice);
            // If the price is false => samePrice is true;
            this.samePriceForSeniorFormControl.setValue(!this.seniorPriceFormControl.value);
            this.samePriceForAdultFormControl.setValue(!this.adultPriceFormControl.value);
            this.samePriceForChildFormControl.setValue(!this.childPriceFormControl.value);
            this.samePriceForStudentFormControl.setValue(!this.studentPriceFormControl.value);
            this.descriptionFormControl.setValue(this.event.description);
            this.notesFormControl.setValue(this.event.notes);
            this.typeIdFormControl.setValue(this.event.EventTypeId);

            if (!!this.event.location) {
                this.locationFormControl.setValue(!!this.event?.location ? this.event.location.name : '');
            }

            if (this.event.free) {
                this.priceFormControl.setValue(0);
                this.priceFormControl.disable();
                this.samePriceForSeniorFormControl.setValue(true);
                this.seniorPriceFormControl.setValue(null);
                this.seniorPriceFormControl.disable();
                this.samePriceForAdultFormControl.setValue(true);
                this.adultPriceFormControl.setValue(null);
                this.adultPriceFormControl.disable();
                this.samePriceForChildFormControl.setValue(true);
                this.childPriceFormControl.setValue(null);
                this.childPriceFormControl.disable();
                this.samePriceForStudentFormControl.setValue(true);
                this.studentPriceFormControl.setValue(null);
                this.studentPriceFormControl.disable();
            }
        }
    }

    getEventTypes() {
        this.loading = true;
        this.eventTypesService.getEventTypes().subscribe((res: EventType[]) => {
                this.EventTypes = res;
                this.loading = false;
            },
            error => {
                this.common.alert("error", this.common.translate("Unexpected Error!"));
                this.loading = false;
            }
        );
    }

    locationOnChange(event: any) {
        try {
            this.event.location = {
                name: event.formatted_address,
                lat: event.geometry.location.lat(),
                lng: event.geometry.location.lng(),
            };

            this.locationFormControl.setErrors(null);
            this.locationFormControl.markAsTouched();
        } catch (err) {
            this.common.alert("error", this.common.translate("Unexpected Error!"));
        }
    }

    onChangeFree(isEventFree) {
        if (isEventFree) {
            this.priceFormControl.disable();
            this.seniorPriceFormControl.disable();
            this.adultPriceFormControl.disable();
            this.childPriceFormControl.disable();
            this.studentPriceFormControl.disable();
        } else {
            this.priceFormControl.enable();
            this.seniorPriceFormControl.enable();
            this.adultPriceFormControl.enable();
            this.childPriceFormControl.enable();
            this.studentPriceFormControl.enable();
        }
    }

    submitDetails(): boolean {
        this.updateFormValidity();
        if (this.eventDetailsFormGroup.valid) {
            this.event.name = this.eventDetailsFormGroup.value.name;
            this.event.EventTypeId = this.eventDetailsFormGroup.value.typeId;
            this.event.status = this.eventDetailsFormGroup.value.status;
            this.event.numOfParticipants = this.eventDetailsFormGroup.value.maxParticipants;
            this.event.free = this.eventDetailsFormGroup.value.free;
            this.event.price = this.eventDetailsFormGroup.value.price;
            this.event.seniorPrice = this.eventDetailsFormGroup.value.seniorPrice;
            this.event.adultPrice = this.eventDetailsFormGroup.value.adultPrice;
            this.event.childPrice = this.eventDetailsFormGroup.value.childPrice;
            this.event.studentPrice = this.eventDetailsFormGroup.value.studentPrice;
            if (this.samePriceForChildFormControl.value) {
                this.event.childPrice = null;
            }
            if (this.samePriceForStudentFormControl.value) {
                this.event.studentPrice = null;
            }
            if (this.samePriceForAdultFormControl.value) {
                this.event.adultPrice = null;
            }
            if (this.samePriceForSeniorFormControl.value) {
                this.event.seniorPrice = null;
            }
            if (this.event.free) {
                if (!this.event.price) {
                    this.event.price = 0;
                }
            }
            this.event.description = this.eventDetailsFormGroup.value.description;
            this.event.notes = this.eventDetailsFormGroup.value.notes;
        }

        return !!this.eventDetailsFormGroup?.valid;
    }

    updateFormValidity() {
        // Check form controls if they are valid
        for (const key in this.eventDetailsFormGroup.controls) {
            if (this.eventDetailsFormGroup.controls.hasOwnProperty(key)) {
                this.eventDetailsFormGroup.controls[key].markAsDirty();
                this.eventDetailsFormGroup.controls[key].updateValueAndValidity();
            }
            if (key == "childPrice" && this.samePriceForChildFormControl.value) {
                this.childPriceFormControl.setErrors(null);
            }
            if (key == "studentPrice" && this.samePriceForStudentFormControl.value) {
                this.studentPriceFormControl.setErrors(null);
            }
            if (key == "adultPrice" && this.samePriceForAdultFormControl.value) {
                this.adultPriceFormControl.setErrors(null);
            }
            if (key == "seniorPrice" && this.samePriceForSeniorFormControl.value) {
                this.seniorPriceFormControl.setErrors(null);
            }
        }
        /* Special check for location Form control
         * If locationFormControl has a value but event.location is empty it means that
         * the location chosen is not from the list of locations offered by Google, so we need to show an error
         */
        if (!this.event?.location) {
            this.locationFormControl.setErrors({locationNotFromList: true});
            this.locationFormControl.markAsTouched();
        }
    }
}

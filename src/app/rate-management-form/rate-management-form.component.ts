import {Component, OnInit, Input} from '@angular/core';
import {CommonService} from "../common/common.service";
import {EventType, Event} from "../data/model/models";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompareUtils} from "../../utils/compare-utils";
import {defaultRateDays} from "../data/model/rates/defaultRateDays"
import {defaultRateMonths} from "../data/model/rates/defaultRateMonths";
import {NumberFormats} from "../../utils/number-formats-utils";
import {DatesService} from "../common/services/dates/dates.service";

@Component({
    selector: 'app-rate-management-form',
    templateUrl: './rate-management-form.component.html',
    styleUrls: ['./rate-management-form.component.css']
})
export class RateManagementFormComponent implements OnInit {

    @Input() model: any = {};
    @Input() item: any = {};
    @Input() submit: Function;
    settings: any = {};
    isLoading: boolean = false;
    eventTypes: EventType[] = [];
    events: Event[] = [];
    allDays: boolean = false;
    allMonths: boolean = false;
    days = defaultRateDays;
    months = defaultRateMonths;
    numberFormats = NumberFormats;
    filterParams: any = {
        filter: [],
        filters: {
            date: null,
            generic: null
        },
        paging: null,
        sort: [],
    };
    nameFormControl = new FormControl('', [Validators.required]);
    allEventsTypesFormControl = new FormControl(false);
    eventTypesFormControl = new FormControl([]);
    eventsFormControl = new FormControl([]);
    minTicketsFormControl = new FormControl(1);
    percentageFormControl = new FormControl(0);
    useIntervalFormControl = new FormControl(false);
    activeFormControl = new FormControl(false);
    startDateFormControl = new FormControl('');
    endDateFormControl = new FormControl('');
    startTimeFormControl = new FormControl('');
    endTimeFormControl = new FormControl('');

    rateFormGroup = new FormGroup({
        name: this.nameFormControl,
        all: this.allEventsTypesFormControl,
        eventTypes: this.eventTypesFormControl,
        events: this.eventsFormControl,
        minTickets: this.minTicketsFormControl,
        percentage: this.percentageFormControl,
        useInterval: this.useIntervalFormControl,
        active: this.activeFormControl,
        startDate: this.startDateFormControl,
        endDate: this.endDateFormControl,
        startTime: this.startTimeFormControl,
        endTime: this.endTimeFormControl
    });

    constructor(public common: CommonService, public datesService: DatesService) {
    }

    ngOnInit(): void {
        this.getSettings();
        this.getFormData();
    }

    async getFormData() {
        this.isLoading = true;
        const [events, eventTypes] = await Promise.all([this.getEvents(), this.getEventTypes()]);
        this.events = events.data;
        this.eventTypes = eventTypes;
        this.initForm();
    }

    initForm() {
        if (this.item) {
            this.nameFormControl.setValue(this.item.name);
            this.eventTypesFormControl.setValue(this.item.EventTypeRates);
            this.eventsFormControl.setValue(this.item.EventsRates);
            this.minTicketsFormControl.setValue(this.item.minTickets);
            this.percentageFormControl.setValue(this.item.percentage);
            if ((this.item.startDate && this.item.endDate) || (this.item.startTime && this.item.endTime)) {
                this.useIntervalFormControl.setValue(true);
                this.startDateFormControl.setValue(this.datesService.convertDBStringFormatToDate(this.item.startDate));
                this.endDateFormControl.setValue(this.datesService.convertDBStringFormatToDate(this.item.endDate));
                this.startTimeFormControl.setValue(this.datesService.convertDateDBFormatToTimeString(this.item.startTime));
                this.endTimeFormControl.setValue(this.datesService.convertDateDBFormatToTimeString(this.item.endTime));
            } else {
                this.useIntervalFormControl.setValue(false);
            }
            this.activeFormControl.setValue(this.item.active);
            if (this.item.days) {
                this.days = this.item.days;
            }
            if (this.item.months) {
                this.months = this.item.months;
            }

        }
        this.isLoading = false;
    }


    async getSettings() {
        this.isLoading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.isLoading = false;
    }

    async getEventTypes() {
        return await this.common.get('/events/get-event-types');
    }

    async getEvents() {
        return await this.common.post('/events', {all: true});
    }


    onChangeAll(event) {
        if (!this.allEventsTypesFormControl.value) {
            this.eventTypesFormControl.setValidators([Validators.required]);
        } else {
            this.eventTypesFormControl.setValue(this.eventTypes.map(item => item.id));
            this.eventsFormControl.setValue(this.events.map(item => item.id));
            this.eventTypesFormControl.clearValidators();
        }
    }

    selectAllDays(event: any) {
        Object.keys(this.days).map((key) => {
            this.days[key] = event;
        });
    }

    selectAllMonths(event: any) {
        Object.keys(this.months).map((key) => {
            this.months[key] = event;
        });
    }

    updateFormValidity() {
        for (const key in this.rateFormGroup.controls) {
            if (this.rateFormGroup.controls.hasOwnProperty(key)) {
                this.rateFormGroup.controls[key].markAsDirty();
                this.rateFormGroup.controls[key].updateValueAndValidity();
            }
        }
        if ((CompareUtils.compareDates(this.startTimeFormControl.value, this.endTimeFormControl.value) === 1)) {
            this.endTimeFormControl.setErrors({'invalid': true});
            this.endTimeFormControl.markAsTouched();
            this.endTimeFormControl.markAsDirty();
        }

        if (CompareUtils.compareDates(this.startDateFormControl.value, this.endDateFormControl.value) === 1) {
            this.endDateFormControl.setErrors({'invalid': true});
            this.endDateFormControl.markAsTouched();
            this.endDateFormControl.markAsDirty();
        }
    }

    submitForm() {
        this.updateFormValidity();
        if (this.rateFormGroup.valid) {
            this.item.name = this.nameFormControl.value;
            this.item.all = this.allEventsTypesFormControl.value;
            this.item.EventsRates = this.eventsFormControl.value;
            this.item.EventTypeRates = this.eventTypesFormControl.value;
            this.item.minTickets = this.minTicketsFormControl.value;
            this.item.percentage = this.percentageFormControl.value;
            this.item.useInterval = this.useIntervalFormControl.value;
            if (this.item.useInterval) {
                this.item.startDate = this.datesService.convertDateToDBStringFormat(this.startDateFormControl.value);
                this.item.endDate = this.datesService.convertDateToDBStringFormat(this.endDateFormControl.value);
                this.item.startTime = this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(this.startTimeFormControl.value));
                this.item.endTime = this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(this.endTimeFormControl.value));
            }
            this.item.active = this.activeFormControl.value;
            if (Object.values(this.days).indexOf(true) > -1) {
                this.item.days = this.days;
            }
            if (Object.values(this.months).indexOf(true) > -1) {
                this.item.months = this.months;
            }
            this.submit();
        }
    }

}

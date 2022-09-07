import {
    Component,
    Input,
    OnInit
} from "@angular/core";
import {Event} from "../../data/model/models";
import {CommonService} from "../../common/common.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {ClockTheme} from "../../data/model/clock-styles";
import {EndTypes, IntervalTypes} from "../../data/model/models";
import {weekDays} from "../../data/model/week-days";
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {CompareUtils} from "../../../utils/compare-utils";
import {DatesService} from "../../common/services/dates/dates.service";

@Component({
    selector: "app-event-dates",
    templateUrl: "./event-dates.component.html",
    styleUrls: ["./event-dates.component.css"],
})

export class EventDatesComponent implements OnInit {

    @Input() event: Event;
    @Input() settings: any = {};
    weekDays = weekDays;
    clockTheme: NgxMaterialTimepickerTheme = ClockTheme;
    endTypes = EndTypes;
    intervalTypes = IntervalTypes;
    startDateFormControl = new FormControl('', [Validators.required]);
    endDateFormControl = new FormControl('', [Validators.required]);
    startTimeFormControl = new FormControl('', [Validators.required]);
    endTimeFormControl = new FormControl('', [Validators.required]);
    repeatFormControl = new FormControl(false);
    repeatDaysFormControl = new FormControl([1], [Validators.required]);
    intervalCountFormControl = new FormControl(1, [Validators.required, Validators.min(0)]);
    intervalTypeFormControl = new FormControl(IntervalTypes.Day, [Validators.required]);
    endTypeFormControl = new FormControl(EndTypes.Never, [Validators.required]);
    endValueFormControl = new FormControl('');

    eventDatesFormGroup = new FormGroup({
        startDate: this.startDateFormControl,
        endDate: this.endDateFormControl,
        startTime: this.startTimeFormControl,
        endTime: this.endTimeFormControl,
        repeat: this.repeatFormControl,
        repeatDays: this.repeatDaysFormControl,
        intervalCount: this.intervalCountFormControl,
        intervalType: this.intervalTypeFormControl,
        endType: this.endTypeFormControl,
        endValue: this.endValueFormControl,
    });

    constructor(public common: CommonService, public datesService: DatesService) {
    }

    ngOnInit(): void {
        this.initForm();
    }


    initForm() {
        if (this.event) {
            this.startDateFormControl.setValue(this.event.startDate);
            this.endDateFormControl.setValue(this.event.endDate);
            this.startTimeFormControl.setValue(this.datesService.convertDateDBFormatToTimeString(this.event.startTime));
            this.endTimeFormControl.setValue(this.datesService.convertDateDBFormatToTimeString(this.event.endTime));
            this.repeatFormControl.setValue(this.event.repeat);
            if (this.event.repeat) {
                this.repeatDaysFormControl.setValue(this.event.EventRepeat.days);
                this.intervalCountFormControl.setValue(this.event.EventRepeat.intervalCount);
                this.intervalTypeFormControl.setValue(this.event.EventRepeat.intervalType);
                this.endTypeFormControl.setValue(this.event.EventRepeat.endType);
                this.endValueFormControl.setValue(this.event.EventRepeat.endValue);
            }
        }
    }

    openDatePicker(picker: NzDatePickerComponent, value?: Date) {
        this.endDateFormControl.setValue(value);
        picker.open();
    }

    endsOnDateDisabler(date: Date): boolean {
        return date.getTime() < new Date().getTime();
    }

    addRepeatPerDay() {
        this.event.EventRepeat.repeatsPerDay.push({
            startTime: new Date(),
            endTime: new Date(),
        });
    }

    removeRepeatPerDay(index: number) {
        this.event.EventRepeat.repeatsPerDay.splice(index, 1);
    }

    endsTypeOnChange(type: string) {
        if (type === this.endTypes.After) {
            this.event.EventRepeat.endValue = 1;
        } else if (type === this.endTypes.On) {
            this.event.EventRepeat.endValue = new Date();
        } else {
            this.event.EventRepeat.endValue = null;
        }
    }

    submitDates(): boolean {
        for (const key in this.eventDatesFormGroup.controls) {
            if (this.eventDatesFormGroup.controls.hasOwnProperty(key)) {
                this.eventDatesFormGroup.controls[key].markAsDirty();
                this.eventDatesFormGroup.controls[key].updateValueAndValidity();
            }
        }

        if ((CompareUtils.compareDates(this.startDateFormControl.value.getTime(), this.endDateFormControl.value.getTime()) === 0) && (CompareUtils.compareDates(this.startTimeFormControl.value, this.endTimeFormControl.value) === 1)) {
            this.endTimeFormControl.setErrors({'invalid': true});
            this.endTimeFormControl.markAsTouched();
            this.endTimeFormControl.markAsDirty();
        }

        if (CompareUtils.compareDates(this.startDateFormControl.value, this.endDateFormControl.value) === 1) {
            this.endDateFormControl.setErrors({'invalid': true});
            this.endDateFormControl.markAsTouched();
            this.endDateFormControl.markAsDirty();
        }
        if (this.eventDatesFormGroup.valid) {
            this.event.startDate =  this.startDateFormControl.value;
            this.event.endDate = this.endDateFormControl.value;
            this.event.startTime = this.startTimeFormControl.value;
            this.event.endTime = this.endTimeFormControl.value;
            this.event.repeat = this.repeatFormControl.value;
            this.event.EventRepeat.days = this.repeatDaysFormControl.value;
            this.event.EventRepeat.intervalCount = this.intervalCountFormControl.value;
            this.event.EventRepeat.intervalType = this.intervalTypeFormControl.value;
            this.event.EventRepeat.endType = this.endTypeFormControl.value;
            this.event.EventRepeat.endValue = this.endValueFormControl.value;
            this.event.EventRepeat.repeatsPerDay = this.event.EventRepeat.repeatsPerDay.map(item => {
                return {
                    startTime: this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(item.startTime)),
                    endTime: this.datesService.convertTimeToDBFormat(this.datesService.convertTimeStringToDate(item.endTime))
                }
            });
        }

        return !!this.eventDatesFormGroup?.valid;
    }

}

import {Component, OnInit, Input} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Event} from "../../data/model/models";
import {EventRegistrationService} from "../../common/services/public/event-registration.service";
import {PaymentTypes} from "../../data/model/settings-payment-types.model";

@Component({
    selector: 'app-registration-modal',
    templateUrl: './event-registration-modal.component.html',
    styleUrls: ['./event-registration-modal.component.css']
})
export class EventRegistrationModalComponent implements OnInit {

    @Input() event: Event;
    @Input() user: any;
    @Input() userUuid: any;
    @Input() payment: any;
    nameFormControl = new FormControl('', [Validators.required]);
    emailFormControl = new FormControl('', [Validators.required, Validators.email]);
    phoneFormControl = new FormControl('');
    ticketTypePriceFormControl = new FormControl();
    loading: boolean = false;
    isPaymentLoading: boolean = false;
    stripe: any = {};
    price: string = "adultPrice";
    paymentTypes = PaymentTypes
    registrationFormGroup = new FormGroup({
        name: this.nameFormControl,
        email: this.emailFormControl,
        phone: this.phoneFormControl,
        ticketTypePrice: this.ticketTypePriceFormControl
    });
    registrationFormGroups: FormGroup[] = [];
    bookedTickets: number = 1;

    constructor(public common: CommonService,
                public eventRegistrationService: EventRegistrationService) {
        this.submit = this.submit.bind(this);
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.ticketTypePriceFormControl.setValue(this.event.price);
    }

    addNewTicket() {
        if (this.bookedTickets + 1 >= this.event.freeSpots) {
            this.common.alert('error', this.common.translate("You can't pass the limit"));
        } else {
            this.registrationFormGroups.push(this.generateFormGroup());
            this.bookedTickets += 1;
        }
    }

    removeTicket(index: number) {
        this.registrationFormGroups.splice(index, 1);
        this.bookedTickets -= 1;
    }

    getTotalPrice(): number {
        let price: number = this.ticketTypePriceFormControl.value ? this.ticketTypePriceFormControl.value : this.event.price;
        for (let formGroup of this.registrationFormGroups) {
            price += formGroup.value.ticketTypePrice
        }
        return price;
    }

    generateFormGroup() {
        return new FormGroup({
            name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.email]),
            phone: new FormControl(''),
            ticketTypePrice: new FormControl(this.event.price)
        });
    }

    async openPaymentModal() {
        if (this.updateFormValidity()) {
            if (this.payment.enableOnlinePayment) {
                this.common.toggleModal('paymentModal');
            } else {
                this.submit();
            }
        }
    }

    updateFormValidity(): boolean {
        let valid = true;
        for (const key in this.registrationFormGroup.controls) {
            if (this.registrationFormGroup.controls.hasOwnProperty(key)) {
                this.registrationFormGroup.controls[key].markAsDirty();
                this.registrationFormGroup.controls[key].updateValueAndValidity();
            }
        }
        for (let formGroup of this.registrationFormGroups) {
            for (const key in formGroup.controls) {
                if (!formGroup.valid) {
                    valid = false;
                }
                if (formGroup.controls.hasOwnProperty(key)) {
                    formGroup.controls[key].markAsDirty();
                    formGroup.controls[key].updateValueAndValidity();
                }
            }
        }

        return (valid && this.registrationFormGroup.valid);
    }

    submit(paymentToken?: any) {
        this.isPaymentLoading = true;
        let EventParticipants = this.registrationFormGroups.map((formGroup: FormGroup) => {
            return {
                name: formGroup.value.name,
                email: formGroup.value.email,
                phone: formGroup.get('phone').value?.e164Number || undefined
            }
        });
        EventParticipants.unshift({
            name: this.nameFormControl.value,
            email: this.emailFormControl.value,
            phone: this.phoneFormControl.value?.e164Number
        });
        let params: any = {
            id: this.event.id,
            uuid: this.userUuid,
            Customer: {
                name: this.nameFormControl.value,
                email: this.emailFormControl.value,
                phone: this.phoneFormControl.value?.e164Number
            },
            EventParticipants: EventParticipants,
            price: this.getTotalPrice(),
            paymentType: this.paymentTypes.Stripe,
            paymentToken: paymentToken
        };
        this.register(params);
        this.isPaymentLoading = false;
    }

    register(params: any) {
        this.loading = true;
        this.eventRegistrationService.eventRegister(params).subscribe(res => {
            if (res) {
                this.loading = false;
                this.common.goTo(`/thank-you`);
            }
            this.loading = false;
            this.common.toggleModal('paymentModal');
        }, error => {
            this.common.alert("error", this.common.translate(`Unexpected Error!`));
        })
    }

}

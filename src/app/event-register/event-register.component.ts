import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../common/common.service";
import {Event} from "../data/model/models";
import {EventRegistrationService} from "../common/services/public/event-registration.service";
import {PaymentTypes} from "../data/model/settings-payment-types.model";

@Component({
    selector: "app-event-register",
    templateUrl: "./event-register.component.html",
    styleUrls: ["./event-register.component.css"],
})

export class EventRegisterComponent implements OnInit {

    loading: boolean = false;
    user: any = {};
    payment: any = {}
    stripe: any = {};
    price: string = "adultPrice";
    event: Event = new Event();
    location: any = {};
    paymentTypes = PaymentTypes;

    constructor(public common: CommonService,
                public route: ActivatedRoute,
                public eventRegistrationService: EventRegistrationService) {
    }

    async ngOnInit() {
        this.getEvent();
    }

    getEvent() {
        try {
            this.loading = true;
            let params = {
                id: this.route.snapshot.params.id,
                uuid: this.route.snapshot.params.uuid,
                paymentType: this.paymentTypes.Stripe
            };
            this.eventRegistrationService.getEvent(params).subscribe(res => {
                if (res) {
                    this.user = res.user;
                    this.payment = res.payment;

                    this.event = res.event;
                    this.location = this.event.location;
                }
            }, error => {
                this.common.alert("error", this.common.translate(`Unexpected Error!`));
            });
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.common.alert("error", this.common.translate("Unexpected Error!"));
        }
    }

    openRegistrationModal() {
        this.common.toggleModal('registrationModal');
    }
}

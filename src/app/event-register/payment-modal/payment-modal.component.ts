import {Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {Event} from "../../data/model/models";
import {PaymentService} from "../../common/services/payment/payment.service";

@Component({
    selector: 'app-payment-modal',
    templateUrl: './payment-modal.component.html',
    styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent implements OnInit {

    @ViewChild('cardElement') cardElement: ElementRef;
    @Input() user: any;
    @Input() event: Event;
    @Input() totalPrice: any;
    @Input() currency: any;
    @Input() payment: any;
    @Output() submit = new EventEmitter<any>();

    loading: boolean = false;
    stripe: any = {};
    creditCard: any;
    stripeCardElement: any;

    constructor(public common: CommonService, public paymentService: PaymentService) {
    }

    async ngOnInit() {
        this.loadStripe();
    }

    async loadStripe() {
        this.loading = true;
        if (this.payment.enableOnlinePayment && this.payment.data.stripePK) {
            //this.stripe = await loadStripe(this.user.stripePK);
            this.stripe = await this.paymentService.getStripe(this.payment.data);
            let elements = this.stripe.elements();
            // Create an instance of the card Element.
            const card = this.paymentService.createCard(elements);
            // Add an instance of the card Element into the `card-element` <div>.
            card.mount(this.cardElement.nativeElement);
            // Handle real-time validation errors from the card Element.
            card.addEventListener("change", (event) => {
                let displayError = document.getElementById("card-error");
                if (event.error) {
                    this.creditCard = "";
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = "";
                    this.creditCard = "filled";
                }
            });
            this.stripeCardElement = card;
        }
        this.loading = false;
    }

    submitPayment() {
        this.loading = true;
        if (this.payment.enableOnlinePayment) {
            this.stripe.createToken(this.stripeCardElement).then((result: any) => {
                if (result.error) {
                    let errorElement = document.getElementById("card-error");
                    errorElement.textContent = result.error.message;
                    return this.common.alert("error", result.error.message);
                } else {
                    this.submit.emit(result.token);
                }
            });
        }
        this.loading = false;
    }

}

import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {loadStripe} from "@stripe/stripe-js";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    style = {
        base: {
            color: "#32325d",
            lineHeight: "18px",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    };

    constructor(public http: HttpClient) {
    }

    async getStripe(data): Promise<any>{
        return await loadStripe(data.stripePK);
    }

    createCard(elements: any){
        return elements.create("card", {style: this.style});
    }


}

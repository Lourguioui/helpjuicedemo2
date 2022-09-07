import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class PhoneService {
    phoneTable: { phoneNumber: string, codeDial :string ,valid: boolean }[] = [];

    setPhoneDetails(phoneNumber: string,code :string, v: boolean) {
        let add = true;
        this.phoneTable.find(elt => {
            if (elt.phoneNumber === phoneNumber) {
                add = false;
            };
        })
        if (add) {
            this.phoneTable.push({ phoneNumber: phoneNumber,codeDial :code , valid: v });
        }
    }
    getValidation(phone: string): boolean {
        let validation = true;
        this.phoneTable.find(elt => {
            if (elt.phoneNumber == phone) {
                validation = elt.valid;
            };
        })
        return validation;
    }
}
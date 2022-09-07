import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { CommonService } from "../common.service";
import { NgForm } from '@angular/forms';
import { PhoneService } from "../phone-input/phone-input.service";

@Component({
    selector: "app-dynamic-form",
    templateUrl: "./dynamic-form.component.html",
    styleUrls: ["./dynamic-form.component.css"],
})

export class DynamicFormComponent implements OnInit {

    @ViewChild('dynamicForm', { static: false }) public dynamicForm: NgForm;
    @Input() hideTitle?: boolean = false;
    @Input() model: any = {};
    @Input() item: any = {};
    @Input() submit: Function;
    @Input() settings: any = {};
    mailFormat: any = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    options: any = {};
    htmlConfig: any = {};
    accept ="image/*";

    constructor(public common: CommonService, public phoneService: PhoneService) {
    }

    ngOnInit(): void {
        this.loadSelectData(this.model.fields);
        if (this.model.subField) {
            this.loadSelectData(this.model.subField.fields);
            if (!this.item[this.model.subField.model] || this.item[this.model.subField.model].length < 1) {
                this.item[this.model.subField.model] = [];
            }
        }
    }

    submitForm() {
        let phoneValidation = true;
        this.model.fields.filter(field => {
            if (field.type == "tel") {
                if (this.item[field.name] && this.item[field.name] != "") {
                    let table = [];
                    for (let i = this.phoneService.phoneTable.length - 1; i >= 0; i--) {
                        table.push(this.phoneService.phoneTable[i]);
                    }
                    let phone = table.find(elt => elt.phoneNumber == (elt.codeDial + this.item[field.name].split(" ").join("").split("-").join("")));
                    if (phone) {
                        phoneValidation = phoneValidation && this.phoneService.getValidation(phone.phoneNumber);
                        if (phoneValidation) {
                            this.item[field.name] = phone.phoneNumber;
                        }
                    }
                }
            }
        })
        let valid = this.validateInputs() && phoneValidation;
        if (this.model.subField) {
            valid = this.validateSubFieldInputs();
        }
        if (valid) {
            this.submit();
        } else {
            return;
        }
    }

    validateInputs(): boolean {
        for (const key in this.dynamicForm?.controls) {
            this.dynamicForm.controls[key].markAsDirty();
            this.dynamicForm.controls[key].markAsTouched();
            this.dynamicForm.controls[key].updateValueAndValidity();
        }
        return !!this.dynamicForm?.valid;
    }

    validateSubFieldInputs(): boolean {
        let valid = true;
        if (this.item[this.model.subField.model].length < 1) {
            this.common.alert(
                "error",
                this.common.translate(["You need to add at least one", this.model.subField.title])
            );
            return false;
        }
        for (let s = 0; s < this.item[this.model.subField.model].length; s++) {
            let item = this.item[this.model.subField.model][s];
            for (let i = 0; i < this.model.subField.fields.length; i++) {
                let field = this.model.subField.fields[i];
                if (field.required && !item[field.name]) {
                    valid = false;
                }
                if (field.inputType === "email" && item[field.name]) {
                    if (!item[field.name].match(this.mailFormat)) {
                        valid = false;
                    }
                }
                if (!field.required && !item[field.name]) {
                    item[field.name] = undefined;
                }
            }
        }

        return valid;
    }

    async loadSelectData(fields: any[]) {
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            if (field.type === "select" && field.loadExternal) {
                if (field.isPublic) {
                    let res = await this.common.get(field.url);
                    if (res) {
                        if (field.name === "currency") {
                            this.options[field.name] = Object.keys(res).map((key) => {
                                return { label: res[key].code, value: res[key].code };
                            });
                        } else if (field.name === "country" || field.name === "nationality") {
                            this.options[field.name] = res.map((record: any) => {
                                return { label: record.country, value: record.country };
                            });
                        } else {
                            this.options[field.name] = res.map((record: any) => {
                                return { label: record.name, value: record.id };
                            });
                        }
                    }
                } else {
                    let res = await this.common.post(field.url, { all: true });
                    if (res) {
                        this.options[field.name] = res.map((record: any) => {
                            return { label: record.name, value: record.id };
                        });
                    }
                }
            }
        }
    }

    addSubItem() {
        if (this.item[this.model.subField.model]) {
            this.item[this.model.subField.model].push({});
        }
    }

    removeSubItem(item: any) {
        let index = this.item[this.model.subField.model].indexOf(item);
        this.item[this.model.subField.model].splice(index, 1);
    }
}
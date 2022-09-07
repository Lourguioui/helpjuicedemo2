import {KeyValue} from "@angular/common";
import {Component, OnInit, Input} from "@angular/core";
import {CommonService} from "../common/common.service";
import {permissions} from "../data/model/staff/staffGroupPermiossions";
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: "app-staff-group-form",
    templateUrl: "./staff-group-form.component.html",
    styleUrls: ["./staff-group-form.component.css"],
})

export class StaffGroupFormComponent implements OnInit {
    @Input() model: any = {};
    @Input() item: any = {};
    @Input() submit: Function;
    settings: any = {};
    loading: boolean = false;
    permissions = permissions;
    nameFormControl = new FormControl('', [Validators.required]);

    constructor(public common: CommonService) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        if (this.item) {
            this.nameFormControl.setValue(this.item.name);
            if (this.item.permissions) {
                this.permissions = this.item.permissions;
            }
        }
    }

    // Select all the actions in all the routines
    selectAllOnChange(event: boolean) {
        this.loading = true;
        Object.keys(this.permissions).map((key) => {
            Object.keys(this.permissions[key]).map((key2) => {
                this.permissions[key][key2] = event;
            });
        });
        this.loading = false;
    }
    // Select all the actions in a specific routine
    modelSelectAllOnChange(event: boolean, model: any) {
        this.loading = true;
        Object.keys(this.permissions[model]).map((key) => {
            this.permissions[model][key] = event;
        });
        this.loading = false;
    }

    submitForm() {
        this.updateFormValidity();
        if (this.nameFormControl.valid) {
            this.item.name = this.nameFormControl.value;
            this.item.permissions = this.permissions;
            this.submit();
        } else {
            return;
        }
    }

    updateFormValidity() {
        this.nameFormControl.markAsDirty();
        this.nameFormControl.updateValueAndValidity();
    }
}

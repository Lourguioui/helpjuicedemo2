import {Component, OnInit, ChangeDetectorRef} from "@angular/core";
import {FormGroup, Validators, FormControl} from "@angular/forms";
import {CommonService} from "../common/common.service";
import {LocalStorageRepository} from "../data/repository/local-storage.repository";

@Component({
    selector: 'app-staff-login',
    templateUrl: './staff-login.component.html',
    styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent implements OnInit {
    loading: boolean = false;
    formGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required])
    });

    constructor(public common: CommonService, public cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.cd.detectChanges();
    }

    async submit() {
        for (const i in this.formGroup.controls) {
            this.formGroup.controls[i].markAsDirty();
            this.formGroup.controls[i].updateValueAndValidity();
        }
        if (this.formGroup.valid) {
            let params = this.formGroup.getRawValue();
            let res = await this.common.post(`/auth/staff-log-in`, params);
            if (res) {
                LocalStorageRepository.setToken(res.token);
                LocalStorageRepository.setUser(res);
                //Redirect the staff member to the view that he has access to
                if (res.permissions.Dashboard.view) {
                    return this.common.goTo("/");
                } else if (res.permissions.Calendar.view) {
                    return this.common.goTo("/calendar");
                } else if (res.permissions.Event.view) {
                    return this.common.goTo("/all-events");
                } else {
                    let permissions = Object.keys(res.permissions);
                    for (let i = 0; i < permissions.length; i++) {
                        let permission = permissions[i];
                        if (res.permissions[permission].view && res.permissions[permission].management) {
                            return this.common.goTo(`/management/${res.permissions[permission].url}`);
                        }
                    }
                }
            }
        }
    }

}

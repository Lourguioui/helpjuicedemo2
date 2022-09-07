import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {CommonService} from "../common/common.service";
import models from "./models";

@Component({
    selector: "app-crud",
    templateUrl: "./crud.component.html",
    styleUrls: ["./crud.component.css"],
})

export class CRUDComponent implements OnInit {

    loading: boolean = false;
    model: any = {};
    item: any = {};
    data: any[] = [];
    settings: any = {};
    paging: { pageIndex: number; total: number; limit: number; offset: number } = {
        pageIndex: 1,
        total: 1,
        limit: 10,
        offset: 0,
    };
    filters: any = {
        generic: {
            visible: false,
            searchValue: "",
            type: "generic",
        },
        eventTypes: [],
        events: []
    };

    constructor(public common: CommonService, public route: ActivatedRoute) {
        this.submit = this.submit.bind(this);
        this.route.params.subscribe((params) => {
            this.data = [];
            this.model = models[params.model];
            if (!this.common.isAccessAllowed(this.model.name, "view")) {
                this.common.logout();
            }
        });
    }

    async ngOnInit() {
        await this.getSettings();
    }

    add() {
        this.item = {};
        this.common.toggleModal("addEditModal");
    }

    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.loading = false;
    }

    async edit(id: any) {
        this.loading = true;
        let res = await this.common.get(`${this.model.url}/${id}`);
        if (res) {
            this.item = res;
            this.common.toggleModal("addEditModal");
        }
        this.loading = false;
    }

    async view(id: any) {
        this.loading = true;
        let res = await this.common.get(`${this.model.url}/${id}`);
        if (res) {
            this.item = res;
            this.common.toggleModal("detailsModal");
        }
        this.loading = false;
    }

    async confirmDelete(id: any) {
        this.loading = true;
        let res = await this.common.get(`${this.model.url}/delete/${id}`);
        if (res) {
            this.common.alert("success", this.common.translate(res.msg));
            this.getData({paging: this.paging});
        }
        this.loading = false;
    }

    async submit() {
        this.loading = true;
        let params = Object.assign({}, this.item);
        let url = "";
        if (params.id) {
            url = `${this.model.url}/update`;
        } else {
            url = `${this.model.url}/create`;
        }
        let res: any;
        if (this.model.withFiles) {
            let formData = new FormData();
            let fileInput = this.model.fields.find((field) => field.type === "file");
            if (Array.isArray(params[fileInput.name])) {
                params[fileInput.name].forEach((file: any) => {
                    formData.append(`${fileInput.name}[]`, file);
                });
                params[fileInput.name] = undefined;
            } else {
                formData.append(`${fileInput.name}`, params[fileInput.name]);
                params[fileInput.name] = undefined;
            }
            formData.append("item", JSON.stringify(params));
            res = await this.common.post(url, formData);
        } else {
            res = await this.common.post(url, params);
        }
        if (res) {
            this.common.alert("success", this.common.translate(res.msg));
            this.item = {};
            this.common.toggleModal("addEditModal");
            this.getData({paging: this.paging});
        }
        this.loading = false;
    }

    async getData(params: any) {
        this.loading = true;
        params.filters = this.filters;
        let res = await this.common.post(`${this.model.url}`, params);
        if (res) {
            this.paging.total = res.total;
            this.data = res.data;
        }
        this.loading = false;
    }

    onTableQueryParamsChange(params: NzTableQueryParams): void {
        this.paging.limit = params.pageSize;
        this.paging.offset = (params.pageIndex - 1) * params.pageSize;
        let dataParams = {
            paging: this.paging,
            filter: params.filter,
            sort: params.sort,
        };
        this.getData(dataParams);
    }

    displayData(data: any, item: any) {
        let value = "";
        if (data.indexOf(".") !== -1) {
            value = data.split(".").reduce((o, i) => o[i], item);
        } else {
            value = item[data];
        }
        return value;
    }

    searchOnChange(event: any) {
        this.getData({paging: this.paging});
    }
}

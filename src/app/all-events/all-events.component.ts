import {Component, OnInit} from "@angular/core";
import {CommonService} from "../common/common.service";
import {NzTableQueryParams} from "ng-zorro-antd/table";
import {Event} from "../data/model/models";
import {ActivatedRoute} from "@angular/router";
import {DatesService} from "../common/services/dates/dates.service";
import {EventsService} from "../common/services/events/events.service";
import {DeviceInfoService} from "../common/services/device-info.service";

@Component({
    selector: "app-all-events",
    templateUrl: "./all-events.component.html",
    styleUrls: ["./all-events.component.css"],
})

export class AllEventsComponent implements OnInit {

    isHandset = false;
    loading: boolean = false;
    eventInFocus: Event;
    data: any[] = [];
    settings: any = {};
    filterParams: any = {
        filter: [],
        filters: {
            date: null,
            generic: {
                visible: false,
                searchValue: "",
                type: "generic",
            },
        },
        paging: {
            pageIndex: 1,
            total: 1,
            limit: 10,
        },
        sort: []
    };

    constructor(public common: CommonService,
                public eventsService: EventsService,
                public activatedRoute: ActivatedRoute,
                public datesService: DatesService,
                private deviceInfoService: DeviceInfoService,) {
    }

    async ngOnInit() {
        await this.getSettings();

        this.deviceInfoService.getIsHandset$().subscribe(isHandset => {
            this.isHandset = isHandset;
        })

        this.activatedRoute.queryParamMap.subscribe(queryParams => {
            if (queryParams.get('date')) {
                this.filterParams.filters.date = this.datesService.convertDBStringFormatToDate(queryParams.get('date'));
            }

            if (queryParams.get('visible') === 'true') {
                this.filterParams.filters.generic.visible = true;
            }

            if (!!queryParams.get('searchValue')) {
                this.filterParams.filters.generic.search = queryParams.get('searchValue');
            }

            if (!!queryParams.get('type')) {
                this.filterParams.filters.generic.type = queryParams.get('type');
            }

            const pageIndex = parseInt(queryParams.get('pageIndex'));
            if (!isNaN(pageIndex)) {
                this.filterParams.paging.pageIndex = pageIndex;
            }

            const total = parseInt(queryParams.get('total'));
            if (!isNaN(total)) {
                this.filterParams.paging.total = total;
            }

            const limit = parseInt(queryParams.get('limit'));
            if (!isNaN(limit)) {
                this.filterParams.paging.limit = limit;
            }
            const offset = parseInt(queryParams.get('offset'));
            if (!isNaN(offset)) {
                this.filterParams.paging.offset = offset;
            }

            this.getEvents();
        });
    }

    createEvent() {
        this.common.goTo("/new-event");
    }

    viewEvent(id: any) {
        this.loading = true;
        this.eventsService.getEventById(id).subscribe((res: Event) => {
                this.eventInFocus = res;
                this.common.toggleModal("detailsModal");
                this.loading = false;
            },
            error => {
                this.common.alert("error", this.common.translate("Unexpected Error!"));
                this.loading = false;
            }
        );
    }

    async getSettings() {
        this.loading = true;
        let res = await this.common.get(`/settings/get-general`);
        if (res) {
            this.settings = res;
        }
        this.loading = false;
    }

    checkIn(id: any) {
        this.common.goTo(`/checking-in/${id}`);
    }

    editEvent(id: any) {
        this.common.goTo(`/edit-event/${id}`);
    }

    deleteEventClicked(event: Event) {
        this.eventInFocus = event;
        this.common.toggleModal("deleteEvent");
    }

    deleteEvent(event: any) {
        this.loading = true;
        this.eventsService.deleteEvent(this.eventInFocus).subscribe((res) => {
                this.common.alert("success", this.common.translate(res.msg));
                this.getEvents();
                this.loading = false;
            },
            error => {
                this.common.alert("error", this.common.translate("Unexpected Error!"));
                this.loading = false;
            });
    }

    getEvents() {
        this.loading = true;
        const params = {
            filter: this.filterParams.filter,
            filters: {
                date: !!this.filterParams.filters.date ? this.datesService.convertDateToDBStringFormat(this.filterParams.filters.date) : null,
                generic: this.filterParams.filters.generic
            },
            paging: this.filterParams.paging,
            sort: this.filterParams.sort

        };
        this.eventsService.getEvents(params).subscribe((res: any) => {
                this.filterParams.paging.total = res.total;
                this.data = res.data;
                window.scroll({top: 0});
                this.loading = false;
            },
            error => {
                this.common.alert("error", this.common.translate("Unexpected Error!"));
                this.loading = false;
            })
    }

    onPaginatorPageChange(pageIndex: number) {
        this.filterParams.paging.pageIndex = pageIndex;
        this.renavigate();
    }

    onTableQueryParamsChange(params: NzTableQueryParams): void {
        this.filterParams.paging.limit = params.pageSize;
        this.filterParams.paging.pageIndex = params.pageIndex;
        this.renavigate();
    }

    renavigate() {
        const queryParams = {
            date: !!this.filterParams.filters.date ?
                this.datesService.convertYearMonthDateFormat(this.filterParams.filters.date) : '',
            visible: this.filterParams.filters.generic.visible,
            searchValue: this.filterParams.filters.generic.searchValue,
            type: this.filterParams.filters.generic.type,
            pageIndex: this.filterParams.paging.pageIndex,
            total: this.filterParams.paging.total,
            limit: this.filterParams.paging.limit,
            offset: this.filterParams.paging.offset
        };

        this.common.goTo(undefined, queryParams);
    }
}

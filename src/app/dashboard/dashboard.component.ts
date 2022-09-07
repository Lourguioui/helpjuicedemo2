import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonService } from "../common/common.service";
import {
	eachDayOfInterval,
	endOfDay,
	lastDayOfMonth,
	lastDayOfWeek,
	lastDayOfYear,
	startOfDay,
	startOfToday,
} from "date-fns";
const firstDayOfWeek = (date: Date): Date => {
	let day = date.getDay();
	let diff = date.getDate() - day + (day == 0 ? -6 : 1);
	return new Date(date.setDate(diff));
};
const firstDayOfMonth = (date: Date): Date => {
	return new Date(date.getFullYear(), date.getMonth(), 1);
};
const firstDayOfYear = (date: Date): Date => {
	return new Date(date.getFullYear(), 0, 1);
};

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.css"],
})

export class DashboardComponent implements OnInit {

	loading: boolean = false;
	pickerMode: string = "month";
	date: Date = startOfToday();
	mostBookedDay: Date;
	chartAnalyticsDate: Date = startOfToday();
	currency: string = "";
	totals: any = {
		activeEvents: 0,
		upcomingEvents: 0,
		totalEvents: 0,
	};

	salesByEventTypeChart: any = {};
	eventsByEventTypeChart: any = {};
	incomeAnalyticsChart: any = {};
	eventInsightsChart: any = {};
	salesByEventTypeData: any[] = [];
	eventsByEventTypeData: any[] = [];
	incomeAnalyticsData: any = {};
	eventInsightsData: any[] = [];

	constructor(public common: CommonService, public changeDetector: ChangeDetectorRef) {}

	async ngOnInit() {
		this.getTotals();
		this.getSalesByEventType();
		this.getEventsByEventType();
		this.getIncomeAnalytics();
		this.getEventInsights();
		this.changeDetector.detectChanges();
	}

	async getIncomeAnalytics() {
		this.loading = true;
		let interval: any;
		if (this.pickerMode === "date") {
			interval = {
				start: startOfDay(this.chartAnalyticsDate),
				end: endOfDay(this.chartAnalyticsDate),
			};
		}
		if (this.pickerMode === "week") {
			interval = {
				start: firstDayOfWeek(this.chartAnalyticsDate),
				end: lastDayOfWeek(this.chartAnalyticsDate),
			};
		}
		if (this.pickerMode === "month") {
			interval = {
				start: firstDayOfMonth(this.chartAnalyticsDate),
				end: lastDayOfMonth(this.chartAnalyticsDate),
			};
		}
		if (this.pickerMode === "year") {
			interval = {
				start: firstDayOfYear(this.chartAnalyticsDate),
				end: lastDayOfYear(this.chartAnalyticsDate),
			};
		}
		let days = eachDayOfInterval(interval);
		let res = await this.common.post(`/dashboard/get-income-analytics`, { dates: days });
		if (res) {
			let salesData = res.salesData;
			let expensesData = res.expensesData;
			let profitsData = salesData.map((value, index) => {
				return value - expensesData[index];
			});
			let totalSales = salesData.reduce((total, value) => {
				return total + value;
			}, 0);
			totalSales = Math.round((totalSales + Number.EPSILON) * 100) / 100;
			let totalExpenses = expensesData.reduce((total, value) => {
				return total + value;
			}, 0);
			totalExpenses = Math.round((totalExpenses + Number.EPSILON) * 100) / 100;
			this.incomeAnalyticsData = {
				labels: days.map((date: Date) => startOfDay(date).toDateString()),
				salesData: salesData,
				expensesData: expensesData,
				profitsData: profitsData,
				totalSales: totalSales,
				totalExpenses: totalExpenses,
				totalProfits: totalSales - totalExpenses,
			};
			this.renderIncomeAnalyticsChart();
		}
		this.loading = false;
	}

	async getEventsByEventType() {
		this.loading = true;
		let res = await this.common.post(`/dashboard/get-events-by-event-type`, { date: this.date });
		if (res) {
			this.eventsByEventTypeData = res;
			this.renderEventsByEventType();
		}
		this.loading = false;
	}

	async getSalesByEventType() {
		this.loading = true;
		let res = await this.common.post(`/dashboard/get-sales-by-event-type`, { date: this.date });
		if (res) {
			this.salesByEventTypeData = res;
			this.renderSalesByEventType();
		}
		this.loading = false;
	}

	async getTotals() {
		this.loading = true;
		let res = await this.common.get(`/dashboard/get-totals`);
		if (res) {
			this.totals = res;
		}
		this.loading = false;
	}

	async getEventInsights() {
		this.loading = true;
		let res = await this.common.get(`/dashboard/get-event-insights`);
		if (res) {
			this.eventInsightsData = res.data;
			this.mostBookedDay = res.day;
			setTimeout(() => {
				this.renderEventInsightsChart();
			}, 500);
		}
		this.loading = false;
	}

	renderEventInsightsChart() {
		this.eventInsightsChart = {
			series: this.eventInsightsData,
			chart: {
				height: 350,
				type: "heatmap",
			},
			dataLabels: {
				enabled: false,
			},
			title: {
				text: this.common.translate("Register time of the day"),
			},
			xaxis: {
				categories: [
					"0.00",
					"1.00",
					"2.00",
					"3.00",
					"4.00",
					"5.00",
					"6.00",
					"7.00",
					"8.00",
					"9.00",
					"10.00",
					"11.00",
					"12.00",
					"13.00",
					"14.00",
					"15.00",
					"16.00",
					"17.00",
					"18.00",
					"19.00",
					"20.00",
					"21.00",
					"22.00",
					"23.00",
				],
				labels: {
					show: true,
					rotateAlways: true,
					rotate: -45,
				},
			},
		};
	}

	renderIncomeAnalyticsChart() {
		this.incomeAnalyticsChart = {
			chart: {
				type: "area",
				sparkline: {
					enabled: true,
				},
			},
			stroke: {
				curve: "straight",
			},
			fill: {
				opacity: 1,
			},
			yaxis: {
				min: 0,
			},
			xaxis: {
				type: "datetime",
			},
			colors: ["#DCE6EC"],
			labels: this.incomeAnalyticsData.labels,
			//Specific chart config
			sales: {
				series: [
					{
						name: this.common.translate("Sales"),
						data: this.incomeAnalyticsData.salesData || [],
					},
				],
				title: {
					text: `${this.common.user().currency} ${this.incomeAnalyticsData?.totalSales || 0}`,
					offsetX: 30,
					offsetY: 30,
					style: {
						fontSize: "30px",
					},
				},
				subtitle: {
					text: this.common.translate("Sales"),
					offsetX: 30,
					offsetY: 70,
					style: {
						fontSize: "18px",
					},
				},
			},
			expenses: {
				series: [
					{
						name: this.common.translate("Expenses"),
						data: this.incomeAnalyticsData.expensesData || [],
					},
				],
				title: {
					text: `${this.common.user().currency} ${this.incomeAnalyticsData?.totalExpenses || 0}`,
					offsetX: 30,
					offsetY: 30,
					style: {
						fontSize: "30px",
					},
				},
				subtitle: {
					text: this.common.translate("Expenses"),
					offsetX: 30,
					offsetY: 70,
					style: {
						fontSize: "18px",
					},
				},
			},
			profits: {
				series: [
					{
						name: this.common.translate("Profits"),
						data: this.incomeAnalyticsData.profitsData || [],
					},
				],
				title: {
					text: `${this.common.user().currency} ${this.incomeAnalyticsData?.totalProfits || 0}`,
					offsetX: 30,
					offsetY: 30,
					style: {
						fontSize: "30px",
					},
				},
				subtitle: {
					text: this.common.translate("Profits"),
					offsetX: 30,
					offsetY: 70,
					style: {
						fontSize: "18px",
					},
				},
			},
		};
	}

	renderEventsByEventType() {
		this.eventsByEventTypeChart = {
			series: [
				{
					name: this.common.translate("Events"),
					data: this.eventsByEventTypeData.map((eventType) => eventType.Events.length),
				},
			],
			chart: {
				type: "bar",
				dropShadow: {
					enabled: true,
				},
				height: 350,
			},
			stroke: {
				show: false,
			},
			xaxis: {
				categories: this.eventsByEventTypeData.map((eventType) => eventType.name),
			},
		};
	}

	renderSalesByEventType() {
		this.salesByEventTypeChart = {
			series: [
				{
					name: this.common.user().currency,
					data: this.salesByEventTypeData.map((eventType) => eventType.value),
				},
			],
			chart: {
				type: "line",
				dropShadow: {
					enabled: true,
				},
				height: 350,
			},
			stroke: {
				curve: "smooth",
			},
			xaxis: {
				categories: this.salesByEventTypeData.map((eventType) => eventType.key),
			},
		};
	}

	async goToToday(type: "daily" | "sales") {
		if (type === "sales") {
			this.chartAnalyticsDate = startOfToday();
			this.getIncomeAnalytics();
		}
	}

	async dateOnChange(date: Date, type: "daily" | "sales") {
		if (type === "sales") {
			this.getIncomeAnalytics();
		}
	}
}

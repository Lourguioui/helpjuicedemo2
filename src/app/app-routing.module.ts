import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { RegisterComponent } from "./register/register.component";
import { ActivateAccountComponent } from "./activate-account/activate-account.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { CRUDComponent } from "./crud/crud.component";
import { ThankYouPageComponent } from "./thank-you-page/thank-you-page.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { ManagementComponent } from "./management/management.component";
import { ManagementDashboardComponent } from "./management-dashboard/management-dashboard.component";
import { NewEventComponent } from "./manage-event/new-event/new-event.component";
import { AllEventsComponent } from "./all-events/all-events.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { EventRegisterComponent } from "./event-register/event-register.component";
import { UserEventsComponent } from "./user-events/user-events.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { EditEventComponent } from "./manage-event/edit-event/edit-event.component";
import { CheckingInComponent } from "./checking-in/checking-in.component";
import {StaffLoginComponent} from "./staff-login/staff-login.component";

import { AuthGuardService } from "./common/auth-guard.service";

const routes: Routes = [
	{
		path: "thank-you",
		component: ThankYouPageComponent,
	},
	{
		path: "terms-conditions",
		component: TermsAndConditionsComponent,
	},
	{
		path: "register",
		component: RegisterComponent,
	},
	{
		path: "activate-account",
		component: ActivateAccountComponent,
	},
	{
		path: "forgot-password",
		component: ForgotPasswordComponent,
	},
	{
		path: "reset-password",
		component: ResetPasswordComponent,
	},
	{
		path: "log-in",
		component: LoginComponent,
	},
	{
		path: "staff-log-in",
		component: StaffLoginComponent,
	},
	{
		path: "user-events/:uuid",
		component: UserEventsComponent,
	},
	{
		path: "event-register/:uuid/:id",
		component: EventRegisterComponent,
	},
	{
		path: "",
		component: LayoutComponent,
		canActivate: [AuthGuardService],
		children: [
			{
				path: "",
				component: DashboardComponent,
				canActivate: [AuthGuardService],
				data: { model: "Dashboard", permission: "view" },
			},
			{
				path: "calendar",
				component: CalendarComponent,
				canActivate: [AuthGuardService],
				data: { model: "Calendar", permission: "view" },
			},
			{
				path: "new-event",
				component: NewEventComponent,
				canActivate: [AuthGuardService],
				data: { model: "Event", permission: "create" },
			},
			{
				path: "edit-event/:id",
				component: EditEventComponent,
				canActivate: [AuthGuardService],
				data: { model: "Event", permission: "update" },
			},
			{
				path: "checking-in/:id",
				component: CheckingInComponent,
				canActivate: [AuthGuardService],
				data: { model: "Event", permission: "update" },
			},
			{
				path: "all-events",
				component: AllEventsComponent,
				canActivate: [AuthGuardService],
				data: { model: "Event", permission: "view" },
			},
			{
				path: "management",
				component: ManagementComponent,
				canActivate: [AuthGuardService],
				data: { model: "Management", permission: "view" },
				children: [
					{
						path: "",
						component: ManagementDashboardComponent,
					},
					{
						path: "settings",
						component: UserSettingsComponent,
						canActivate: [AuthGuardService],
						data: { model: "Settings", permission: "update" },
					},
					{
						path: ":model",
						component: CRUDComponent,
					},
				],
			},
		],
	},
	{
		path: "**",
		component: NotFoundComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
	exports: [RouterModule],
})

export class AppRoutingModule {}

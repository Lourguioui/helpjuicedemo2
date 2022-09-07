import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { CommonModule, registerLocaleData, DatePipe, DecimalPipe } from "@angular/common";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { AngularEditorModule } from "@kolkov/angular-editor";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatIconModule } from '@angular/material/icon';

import { NgZorroAntdModule } from "./ng-zorro-antd.module";

import { AppRoutingModule } from "./app-routing.module";

import { NZ_I18N } from "ng-zorro-antd/i18n";
import { en_US } from "ng-zorro-antd/i18n";
import { NZ_ICONS } from "ng-zorro-antd/icon";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import en from "@angular/common/locales/en";
registerLocaleData(en);
const antDesignIcons = AllIcons as {
	[key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map((key) => antDesignIcons[key]);

import { CommonService } from "./common/common.service";

import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RegisterComponent } from "./register/register.component";
import { ActivateAccountComponent } from "./activate-account/activate-account.component";
import { HeaderComponent } from "./common/header/header.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ManagementComponent } from "./management/management.component";
import { FooterComponent } from "./common/footer/footer.component";
import { DynamicFormComponent } from "./common/dynamic-form/dynamic-form.component";
import { EmptyPlaceholderComponent } from "./common/empty-placeholder/empty-placeholder.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { CRUDComponent } from "./crud/crud.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { ThankYouPageComponent } from "./thank-you-page/thank-you-page.component";
import { ExternalHeaderComponent } from "./common/external-header/external-header.component";
import { ExternalPageComponent } from "./common/external-page/external-page.component";
import { StripePaymentComponent } from "./stripe-payment/stripe-payment.component";
import { FileUploadComponent } from "./common/file-upload/file-upload.component";
import { ManagementDashboardComponent } from "./management-dashboard/management-dashboard.component";
import { PhoneInputComponent } from "./common/phone-input/phone-input.component";
import { NewEventComponent } from "./manage-event/new-event/new-event.component";
import { AllEventsComponent } from "./all-events/all-events.component";
import { UserSettingsComponent } from "./user-settings/user-settings.component";
import { EventDatesComponent } from "./manage-event/event-dates/event-dates.component";
import { EventDetailsComponent } from "./manage-event/event-details/event-details.component";
import { EventParticipantsComponent } from "./manage-event/event-participants/event-participants.component";
import { EventOrganizersComponent } from "./manage-event/event-organizers/event-organizers.component";
import { EventRegisterComponent } from "./event-register/event-register.component";
import { UserEventsComponent } from "./user-events/user-events.component";
import { GoogleMapComponent } from "./common/google-map/google-map.component";
import { EditEventComponent } from "./manage-event/edit-event/edit-event.component";
import { CheckingInComponent } from "./checking-in/checking-in.component";
import { TextInputComponent } from "./common/text-input/text-input.component";
import { NumberInputComponent } from "./common/number-input/number-input.component";
import { CalendarToolbarComponent } from "./calendar/calendar-toolbar/calendar-toolbar.component";
import { CalendarHeaderComponent } from './calendar/calendar-header/calendar-header.component';
import { CalendarBodyComponent } from './calendar/calendar-body/calendar-body.component';
import { CalendarSettingsComponent } from './calendar/calendar-settings/calendar-settings.component';
import { CalendarEventDetailsComponent } from './calendar/calendar-event-details/calendar-event-details.component';
import { DeleteEventModalComponent } from './all-events/delete-event-modal/delete-event-modal.component';
import { EventDetailsModalComponent } from './all-events/event-details-modal/event-details-modal.component';
import { RateManagementFormComponent } from './rate-management-form/rate-management-form.component';
import { ClockTimePickerComponent } from './common/clock-time-picker/clock-time-picker.component';
import { EventRegistrationModalComponent } from './event-register/event-registration-modal/event-registration-modal.component';
import { ImageCropperModule } from "./common/picker-component/image-cropper/image-cropper.module";
import { ImagePickerModule } from "./common/picker-component/image-picker.module";
import { StaffGroupFormComponent } from './staff-group-form/staff-group-form.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { PaymentModalComponent } from './event-register/payment-modal/payment-modal.component';
import {QrScannerComponent} from "./common/qr-scanner/qr-scanner.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		LayoutComponent,
		ForgotPasswordComponent,
		RegisterComponent,
		ActivateAccountComponent,
		HeaderComponent,
		NotFoundComponent,
		DashboardComponent,
		CalendarComponent,
		ManagementComponent,
		FooterComponent,
		DynamicFormComponent,
		EmptyPlaceholderComponent,
		ResetPasswordComponent,
		CRUDComponent,
		TermsAndConditionsComponent,
		ThankYouPageComponent,
		ExternalHeaderComponent,
		ExternalPageComponent,
		StripePaymentComponent,
		FileUploadComponent,
		ManagementDashboardComponent,
		PhoneInputComponent,
		NewEventComponent,
		AllEventsComponent,
		UserSettingsComponent,
		EventDatesComponent,
		EventDetailsComponent,
		EventParticipantsComponent,
		EventOrganizersComponent,
		EventRegisterComponent,
		UserEventsComponent,
		GoogleMapComponent,
		EditEventComponent,
		CheckingInComponent,
		TextInputComponent,
		NumberInputComponent,
		CalendarToolbarComponent,
		CalendarHeaderComponent,
		CalendarBodyComponent,
		CalendarSettingsComponent,
		CalendarEventDetailsComponent,
		DeleteEventModalComponent,
		EventDetailsModalComponent,
		RateManagementFormComponent,
		ClockTimePickerComponent,
		StaffGroupFormComponent,
		StaffLoginComponent,
		EventRegistrationModalComponent,
		PaymentModalComponent,
		QrScannerComponent
	],
    imports: [
        GooglePlaceModule,
        NgxIntlTelInputModule,
        NgZorroAntdModule,
        ScrollingModule,
        HttpClientJsonpModule,
        ReactiveFormsModule,
        HttpClientModule,
        DragDropModule,
        NgApexchartsModule,
        AngularEditorModule,
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
        NgxMaterialTimepickerModule,
        MatIconModule,
        ImageCropperModule,
        ImagePickerModule
	],
	providers: [
		CommonService,
		DatePipe,
		DecimalPipe,
		{ provide: NZ_I18N, useValue: en_US },
		{ provide: NZ_ICONS, useValue: icons },
	],
	bootstrap: [AppComponent],
})

export class AppModule { }

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExternalHeaderComponent } from "./external-header.component";

describe("ExternalHeaderComponent", () => {
	let component: ExternalHeaderComponent;
	let fixture: ComponentFixture<ExternalHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ExternalHeaderComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ExternalHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});

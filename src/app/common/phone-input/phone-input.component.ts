
import { Component, forwardRef, Input, OnInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { PhoneService } from "./phone-input.service";
@Component({
	selector: "app-phone-input",
	templateUrl: "./phone-input.component.html",
	styleUrls: ["./phone-input.component.css"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PhoneInputComponent),
			multi: true,
		},
	],
})
export class PhoneInputComponent implements ControlValueAccessor ,OnInit {
	@ViewChild("tel") tel;
	@Input() msgError:string ="";
	@Input() label: string ="";
	@Input() labelAlignment: string = "inline";
	@Input() formControl: FormControl;
	@Input() value:any;
	@Input() required:boolean;
	id: string = `id-${Math.random().toString(16).slice(2)}`;
	
	constructor(private phoneService :PhoneService) {}
	ngOnInit(): void {
		this.phoneService.phoneTable=[];
	}

	onChange: (_: any) => void = (_: any) => {}
	onTouched: () => void = () => {};
	writeValue(value: any): void {
		if(value){
			this.value= value;
			this.onChange(this.value);
		}
	}
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
	updateChanges(event) {
		if (this.value && this.value.e164Number) {
			this.onChange(this.value.number);
		} else {
			this.onChange(this.value);
		}
		if(event){
			this.phoneService.setPhoneDetails(this.value.e164Number,this.value.dialCode,this.tel.valid);
		}
	}	
}

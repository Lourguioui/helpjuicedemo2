/**
 * Component Modules/Components
 */
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
/**
 * Component Decorator
 */
@Component({
	selector: "app-text-input",
	templateUrl: "./text-input.component.html",
	styleUrls: ["./text-input.component.css"],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TextInputComponent),
			multi: true,
		},
	],
})
/**
 * Component Class
 */
export class TextInputComponent implements ControlValueAccessor {
	/**
	 * Component Properties
	 */
	@Input() required: boolean = false;
	@Input() label: string;
	value: any;
	id: string = `id-${Math.random().toString(16).slice(2)}`;
	/**
	 * Invoked when the model has been changed
	 */
	onChange: (_: any) => void = (_: any) => {};
	/**
	 * Invoked when the model has been touched
	 */
	onTouched: () => void = () => {};
	/**
	 * Component Constructor
	 */
	constructor() {}
	/**
	 * Method that is invoked on an update of a model.
	 */
	updateChanges() {
		this.onChange(this.value);
	}
	/**
	 * Writes a new item to the element.
	 * @param value the value
	 */
	writeValue(value: any): void {
		this.value = value;
		this.updateChanges();
	}
	/**
	 * Registers a callback function that should be called when the control's value changes in the UI.
	 * @param fn
	 */
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	/**
	 * Registers a callback function that should be called when the control receives a blur event.
	 * @param fn
	 */
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}
}

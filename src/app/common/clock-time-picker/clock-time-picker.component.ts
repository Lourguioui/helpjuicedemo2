import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgxMaterialTimepickerComponent, NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {ClockTheme} from "../../data/model/clock-styles";
import {CommonService} from "../common.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-clock-time-picker',
  templateUrl: './clock-time-picker.component.html',
  styleUrls: ['./clock-time-picker.component.css']
})
export class ClockTimePickerComponent implements OnInit {

  @Input() clockFormControl: FormControl;
  @Input() inputLabel: string;
  @Input() format: number;
  clockTheme: NgxMaterialTimepickerTheme = ClockTheme;
  constructor(public common: CommonService) { }

  ngOnInit(): void {
  }

}

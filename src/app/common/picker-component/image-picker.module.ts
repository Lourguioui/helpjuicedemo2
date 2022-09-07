import {NgModule} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {ImagePickerComponent} from './image-picker.component';
import {ImageCropperModule} from './image-cropper/image-cropper.module';
import { NzSpinModule } from "ng-zorro-antd/spin";
import { NzButtonModule } from "ng-zorro-antd/button";

@NgModule({
    imports: [
        MatButtonModule,
        CommonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        ImageCropperModule,
        NzSpinModule,
        NzButtonModule
    ],
    declarations: [
        ImagePickerComponent
    ],
    exports: [
        ImagePickerComponent,
        NzSpinModule,
        NzButtonModule
    ]
})
export class ImagePickerModule {
}

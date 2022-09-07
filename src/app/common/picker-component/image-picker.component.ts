import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Optional, Output} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ImageData} from './image-data';
import {ImageCroppedEvent, ImageTransform} from './image-cropper/interfaces';
import { base64ToFile } from './image-cropper/utils/blob.utils';
import { CommonService } from '../common.service';

export type ImageFormat = 'png' | 'jpeg' | 'bmp' | 'webp';

@Component({
    selector: 'webshop-image-picker',
    templateUrl: './image-picker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePickerComponent {
    croppedImageResult: ImageCroppedEvent;
    @Input() imageChangedEvent: string;
    showImageCropper: boolean=true;
    image: ImageData;
    showUpload: boolean =false;
    isUploading: boolean = true;
    transform: ImageTransform = {};
    scale = 1.0;
    zoomIntensity = 0.1;
    @Input() file={};
    @Input() aspectRatio = 1;
    @Input() returnBlob = false;
    @Output() saveClickedEvent: EventEmitter<ImageData> = new EventEmitter<ImageData>();
    @Output() fileEvent: EventEmitter<Blob> = new EventEmitter<Blob>();
    @Input() resizeHeight: number =0;
    @Input() resizeWidth: number= 0;
    @Input() outputFormat: ImageFormat = 'png';
    @Input() sizeOptions: { aspectRatio: number; text: string; }[] = [];
    @Input() enableCustomRatio: boolean;
    @Input() maintainAspectRatio: boolean = true;
    
    constructor(public common: CommonService,
        protected cdk: ChangeDetectorRef,
                @Optional() private matDialogRef?: MatDialogRef<ImagePickerComponent>) {
    }

    ngOnInit(): void {
        if (this.enableCustomRatio) {
            this.sizeOptions.push({
                text: 'custom',
                aspectRatio: 1
            });
        }
    }

    onImageCropped(event: ImageCroppedEvent) {
        this.croppedImageResult = event;
    }

    crop(): void {
        const base64 = this.croppedImageResult.base64;

        this.image = new ImageData();
        this.image.image = base64.slice(base64.indexOf(';base64,') + ';base64,'.length);
        this.image.mime = base64.slice(base64.indexOf('data:') + 'data:'.length, base64.indexOf(';'));
        this.imageChangedEvent = null;
        this.showImageCropper = false;
        this.showUpload = true;
    }

    onImageLoadingFailed() {
        this.isUploading = false;
    }

    getImage(image: ImageData): string {
        return 'data:' + image.mime + ';base64,' + image.image;
    }

    saveClicked() {
        this.fileEvent.emit(this.croppedImageResult.file);
        this.saveClickedEvent.emit(this.image);
        this.closeSelf(this.croppedImageResult.base64, base64ToFile(this.croppedImageResult.base64));
        this.reset();
    }

    public reset() {
        this.croppedImageResult = undefined;
        this.imageChangedEvent = undefined;
        this.showImageCropper = undefined;
        this.image = undefined;
        this.showUpload = undefined;
        this.transform = {};
        this.scale = 1.0;
    }

    onImageLoaded() {
        this.isUploading = false;
    }

    cancelClick() {
        this.closeSelf();
    }

    scaleImage($event) {
        const wheel = $event.deltaY < 0 ? 1 : -1;


        if (wheel > 0) {
            // Zoom in
            this.scale += this.zoomIntensity;
            this.transform = {...this.transform, scale: this.scale};
        } else {
            // Zoom out
            this.scale -= this.zoomIntensity;
            this.transform = {...this.transform, scale: this.scale};
        }
    }

    sizeOptionClicked(sizeOption: { aspectRatio: number; text: string }, position: number) {
        this.maintainAspectRatio = this.enableCustomRatio && position !== this.sizeOptions.length - 1;
        this.aspectRatio = sizeOption.aspectRatio;
    }

    private closeSelf(i? :any,f?: any) {
        if (this.matDialogRef) {
            if(i){
                this.matDialogRef.close({image :i,file:f});
            }else{
                this.matDialogRef.close();  
            }
        }
    }
}

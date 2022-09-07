import {AfterViewInit, Component, Output, EventEmitter} from '@angular/core';
import {Html5Qrcode} from 'html5-qrcode';
import {timer} from 'rxjs';
import {Camera} from './data/model/camera.interface';
import {FormControl} from '@angular/forms';
import {CommonService} from "../common.service";

@Component({
    selector: 'app-qr-scanner',
    templateUrl: './qr-scanner.component.html',
    styleUrls: ['./qr-scanner.component.scss']
})

export class QrScannerComponent implements AfterViewInit {
    @Output() scanResult: EventEmitter<string> = new EventEmitter<string>();
    showInfo: boolean = false;
    html5QrCode: Html5Qrcode;
    config = {fps: 10, qrbox: {width: 250, height: 250}};
    cameras: Camera[];
    selectedCameraFormControl = new FormControl('');

    constructor(public common: CommonService) {
    }

    ngAfterViewInit(): void {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                this.cameras = devices;
                this.selectedCameraFormControl.setValue(this.cameras[this.cameras.length-1].id);
            }
        }).catch(() => {
            this.common.alert('error', this.common.translate('No camera detected'));
        });
    }

    initiateScanner() {
        if (!!document.getElementById('reader') && !!this.selectedCameraFormControl.value) {
            this.html5QrCode = new Html5Qrcode('reader', false);
            this.html5QrCode.start(
                {deviceId: {exact: this.selectedCameraFormControl.value}},
                this.config,
                this.qrCodeSuccessCallback,
                this.qrCodeErrorCallback
            );
        }
    }

    pauseScanner() {
        this.html5QrCode.pause();
    }

    qrCodeSuccessCallback = (decodedText) => {
        this.pauseScanner();
        this.scanResult.emit(decodedText);
        timer(8000).subscribe(() => {
            this.html5QrCode.resume();
        });
    }

    qrCodeErrorCallback = () => {
    }
}

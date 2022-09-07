import {Component, Input, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {environment} from "projects/main/src/environments/environment";
import {CommonService} from "../common.service";
import {ImagePickerComponent} from "../picker-component/image-picker.component";


@Component({
    selector: "app-file-upload",
    templateUrl: "./file-upload.component.html",
    styleUrls: ["./file-upload.component.css"],
})

export class FileUploadComponent implements OnInit {

    @Input() imageWidth: any;
    @Input() imageHeight: any;
    @Input() imageType: any;
    @Input() accept: any;
    @Input() item: any;
    @Input() field: any;
    @Input() multiple: boolean = false;
    thumbnails: any[] = [];
    files: any[] = [];
    file: any = {};
    loading: boolean = false;
    apiUrl = `${environment.apiUrl}/`;
    dialogRef: any;
    size: number = 5;

    constructor(public common: CommonService, private matDialog: MatDialog) {
    }

    ngOnInit(): void {
        if (this.item.files) {
            this.files = this.item.files;
        }
    }

    removeFile(index: number) {
        this.files.splice(index, 1);
        this.thumbnails.splice(index, 1);
        this.item.thumbnails?.splice(index, 1);
        if (this.multiple) {
            this.item.files = this.files;
        } else {
            this.item.file = undefined;
        }
    }

    removeOldFile(file: any) {
        if (!this.item.removedFiles) {
            this.item.removedFiles = [];
        }
        let index = this.item[this.field].indexOf(file);
        this.item.removedFiles.push(file.id);
        this.files?.splice(index, 1);
        this.item[this.field].splice(index, 1);
        this.item.thumbnails?.splice(index, 1);
    }

    fileOnChange(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            for (let file of event.target.files) {
                if (!this.validateFileType(file)) {
                    return;
                }
                if (!this.validateFileSize(file)) {
                    return;
                }
                this.openDialog(event);
                this.dialogRef.afterClosed().subscribe(result => {
                    if (result.file) {
                        let file = result.file;
                        this.files.push(file);
                        this.item.files = this.files;
                        this.item.thumbnails?.push(result.image);
                        this.thumbnails?.push(result.image);
                    }
                })
            }
        }
    }

    openDialog(event: any) {
        this.dialogRef = this.matDialog.open(ImagePickerComponent, {
            height: '60%',
            width: '60%',
            panelClass: 'trend-dialog'
        });
        this.dialogRef.componentInstance.imageChangedEvent = event;
        this.dialogRef.componentInstance.aspectRatio = 1;
        this.dialogRef.componentInstance.resizeWidth = this.imageWidth;
        this.dialogRef.componentInstance.resizeHeight = this.imageHeight;
        this.dialogRef.componentInstance.outputFormat = this.imageType;
    }

    validateFileType(file: File): boolean {
        let fileName = file.name;
        let idxDot = fileName.lastIndexOf(".") + 1;
        let extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
            return true;
        } else {
            this.common.alert("error", "Only image files are allowed!");
            return false;
        }
    }

    validateFileSize(file: File): boolean {
        this.size = file.size / 1024 / 1024; // size with MB
        if (this.size < 5) {
            return true;
        } else {
            this.common.alert("error", "Only image files < 5Mb!");
            return false;
        }
    }

}

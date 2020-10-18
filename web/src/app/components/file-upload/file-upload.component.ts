import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.sass']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  @Input() placeholder = 'Choose a file';
  @Input() required = true;
  @Output() fileChange: EventEmitter<FileList> = new EventEmitter();

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  private file: File = null;
  private fileInputEventListener: EventListener = null;

  ngOnInit(): void {
    this.fileInputEventListener = (event: Event) => {
      const nextSibling = (event.target as HTMLElement).nextElementSibling as HTMLElement;
      if (!this.file) {
        nextSibling.innerText = this.placeholder;
        return;
      }
      nextSibling.innerText = this.file.name;
    };
    this.fileInput.nativeElement.addEventListener('change', this.fileInputEventListener);
  }

  ngOnDestroy() {
    this.fileInput.nativeElement.removeEventListener('change', this.fileInputEventListener);
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
    this.fileChange.emit(files);
  }
}

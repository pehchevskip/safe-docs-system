import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upload-docs-form',
  templateUrl: './upload-docs-form.component.html',
  styleUrls: ['./upload-docs-form.component.sass']
})
export class UploadDocsFormComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: FileUpload;

  apiUrl: string;

  creatorUsername: string;
  sharedToUsername: string;

  disableUploadButton = true;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
  }

  uploadDocument() {
    const file = this.fileUpload.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('creatorUsername', this.creatorUsername);
    formData.append('sharedToUsername', this.sharedToUsername);
    this.http.post(this.apiUrl + '/crypt/encrypt', formData).subscribe(
      () => alert('Uploaded'),
      () => alert('Error')
    );
  }

  checkIfUploadButtonShouldBeDisabled() {
    this.disableUploadButton = !(this.fileUpload.files.length > 0 && this.creatorUsername.length > 0 && this.sharedToUsername.length > 0);
  }

  // saveInLocalStorage(blob: Blob) {
  //   const fileReader = new FileReader();
  //   fileReader.onload = () => {
  //     // @ts-ignore
  //     localStorage.setItem('file', fileReader.result);
  //   };
  //   fileReader.readAsDataURL(blob);
  // }

}

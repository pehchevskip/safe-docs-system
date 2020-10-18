import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-upload-docs-form',
  templateUrl: './upload-docs-form.component.html',
  styleUrls: ['./upload-docs-form.component.sass']
})
export class UploadDocsFormComponent implements OnInit {

  apiUrl: string;
  spinnerVisible = false;

  uploadSuccess = false;
  uploadError = false;

  sharedToUsername: string;
  private creatorUsername: string;

  private documentFile: File = null;

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.creatorUsername = this.authService.getLoggedInUsername();
  }

  uploadDocument() {
    const file = this.documentFile;
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('creatorUsername', this.creatorUsername);
    formData.append('sharedToUsername', this.sharedToUsername);

    this.spinnerVisible = true;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.http.post(this.apiUrl + '/crypt/encrypt', formData).pipe(
      finalize(() => this.spinnerVisible = false)
    ).subscribe(
      () => {
        this.uploadSuccess = true;
        this.uploadError = false;
      },
      () => {
        this.uploadSuccess = false;
        this.uploadError = true;
      }
    );
  }

  handleDocumentFileInput(files: FileList) {
    this.documentFile = files.item(0);
  }
}

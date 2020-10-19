import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { CryptService } from '../../service/crypt.service';
import { getFileFromLocalStorageAsText, localStorageKeys } from '../../utils/local-storage.utils';
import { isNilOrEmpty } from '../../utils/string.utils';
import { environment } from '../../../environments/environment';
import { EncryptedDocument } from '../../model/encrypted-document.model';

@Component({
  selector: 'app-crypting-comp',
  templateUrl: './crypting.component.html',
  styleUrls: [ './crypting.component.sass' ]
})
export class CryptingComponent implements OnInit {

  encryptedDocuments: EncryptedDocument[];

  decryptingSuccess = false;
  decryptingError = false;
  privateKeyError = false;
  loadingDocsError = false;
  spinnerVisible = false;

  private privateKey: string;
  private apiUrl: string;

  constructor(private cryptService: CryptService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.apiUrl = environment.apiUrl;
    this.loadDocumentsForUser();
  }

  private loadDocumentsForUser() {
    const url = this.apiUrl + '/encrypted-documents/shared-to';

    this.spinnerVisible = true;
    this.http.get(url).pipe(
      finalize(() => this.spinnerVisible = false)
    ).subscribe((encryptedDocuments: EncryptedDocument[]) => this.encryptedDocuments = encryptedDocuments,
      (error) => {
        this.loadingDocsError = true;
      });
  }

  readPrivateKey(): boolean {
    this.privateKey = getFileFromLocalStorageAsText(localStorageKeys.privateKeyFile);
    return !isNilOrEmpty(this.privateKey) && (this.privateKey.indexOf('BEGIN PRIVATE KEY') > 0);
  }

  downloadAndDecrypt(encryptedDocument: EncryptedDocument) {
    if (this.spinnerVisible) {
      return;
    }
    this.decryptingSuccess = false;
    this.decryptingError = false;
    this.privateKeyError = false;
    this.spinnerVisible = true;

    const url = this.apiUrl + '/encrypted-documents/' + encryptedDocument.id;
    this.spinnerVisible = true;
    this.http.get(url, { responseType: 'blob' }).pipe(
      finalize(() => this.spinnerVisible = false)
    ).subscribe((response: Blob) => {
      const encryptedFile = new File([ response ], encryptedDocument.filename);
      this.decrypt(encryptedFile, encryptedDocument.filename);
    });
  }

  private decrypt(encryptedFile: File, filename: string) {
    if (!this.readPrivateKey()) {
      this.privateKeyError = true;
      this.spinnerVisible = false;
      return;
    }

    if (encryptedFile.size < 256) {
      this.decryptingError = true;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;

      let resultHex;
      try {
        resultHex = this.cryptService.decrypt(this.privateKey, buffer as string);
      } catch (error) {
        this.decryptingError = true;
        this.spinnerVisible = false;
        return;
      }
      const binaryArray = this.cryptService.hexToBinaryArray(resultHex);

      const byteArray = new Uint8Array(binaryArray);
      const blob = new Blob([ byteArray ], { type: 'application/octet-stream' });

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.decryptingSuccess = true;
      this.spinnerVisible = false;
    };
    reader.readAsBinaryString(encryptedFile);
  }
}

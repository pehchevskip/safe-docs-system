import { Component} from '@angular/core';

import { CryptService } from '../../service/crypt.service';
import { getFileFromLocalStorageAsText, localStorageKeys } from '../../utils/local-storage.utils';
import { isNilOrEmpty } from '../../utils/string.utils';

@Component({
  selector: 'app-crypting-comp',
  templateUrl: './crypting.component.html',
  styleUrls: ['./crypting.component.sass']
})
export class CryptingComponent {

  privateKey: string;
  encryptedDocumentFile: File = null;

  decryptingSuccess = false;
  decryptingError = false;
  privateKeyError = false;
  spinnerVisible = false;

  constructor(private cryptService: CryptService) {
  }

  decrypt() {
    this.decryptingSuccess = false;
    this.decryptingError = false;
    this.privateKeyError = false;
    this.spinnerVisible = true;

    if (!this.readPrivateKey()) {
      this.privateKeyError = true;
      this.spinnerVisible = false;
      return;
    }

    if (this.encryptedDocumentFile.size < 256) {
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

      const fileName = 'decrypted-document';
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.decryptingSuccess = true;
      this.spinnerVisible = false;
    };
    reader.readAsBinaryString(this.encryptedDocumentFile);
  }

  readPrivateKey(): boolean {
    this.privateKey = getFileFromLocalStorageAsText(localStorageKeys.privateKeyFile);
    return !isNilOrEmpty(this.privateKey) && (this.privateKey.indexOf('BEGIN PRIVATE KEY') > 0);
  }

  handleEncryptedDocumentFileInput(files: FileList) {
    this.encryptedDocumentFile = files.item(0);
  }
}

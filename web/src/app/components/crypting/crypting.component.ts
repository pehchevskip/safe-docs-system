import { Component} from '@angular/core';

import { CryptService } from '../../service/crypt.service';

@Component({
  selector: 'app-crypting-comp',
  templateUrl: './crypting.component.html',
  styleUrls: ['./crypting.component.sass']
})
export class CryptingComponent {

  privateKey: string;

  private privateKeyFile: File = null;
  private encryptedDocumentFile: File = null;

  constructor(private cryptService: CryptService) {
  }

  decrypt() {
    this.readPrivateKey();

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;

      const resultHex = this.cryptService.decrypt(this.privateKey, buffer as string);
      const binaryArray = this.cryptService.hexToBinaryArray(resultHex);

      const byteArray = new Uint8Array(binaryArray);
      const blob = new Blob([ byteArray ], { type: 'application/octet-stream' });

      const fileName = '';
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    setTimeout(() => {
      reader.readAsBinaryString(this.encryptedDocumentFile);
    }, 1500);
  }

  readPrivateKey() {
    const reader = new FileReader();
    reader.onload = () => {
      this.privateKey = reader.result as string;
    };
    reader.readAsText(this.privateKeyFile);
  }

  handlePrivateKeyFileInput(files: FileList) {
    this.privateKeyFile = files.item(0);
  }

  handleEncryptedDocumentFileInput(files: FileList) {
    this.encryptedDocumentFile = files.item(0);
  }
}

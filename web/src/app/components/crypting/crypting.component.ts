import { Component, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';

import { CryptService } from '../../service/crypt.service';

@Component({
  selector: 'app-crypting-comp',
  templateUrl: './crypting.component.html',
  styleUrls: ['./crypting.component.sass']
})
export class CryptingComponent {

  @ViewChild('fileUpload') fileUpload: FileUpload;
  @ViewChild('privateKeyUpload') privateKeyUpload: FileUpload;

  privateKey: string;

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
      reader.readAsBinaryString(this.fileUpload.files[0]);
    }, 1500);
  }

  readPrivateKey() {
    const reader = new FileReader();
    reader.onload = () => {
      this.privateKey = reader.result as string;
    };
    reader.readAsText(this.privateKeyUpload.files[0]);
  }

}

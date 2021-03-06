import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

@Injectable({ providedIn: 'root'})
export class CryptService {

  decrypt(privateKeyStr: string, file: string): string {
    const extractedEsk = file.substr(0, 256);
    const remainingFile = file.substr(256);

    try {
      const privateKey = forge.pki.privateKeyFromPem(privateKeyStr);
      const symmetricKey = forge.util.bytesToHex(privateKey.decrypt(extractedEsk));

      const cipher = forge.cipher.createDecipher('AES-ECB', forge.util.hexToBytes(symmetricKey));
      cipher.start();
      cipher.update(forge.util.createBuffer(remainingFile));
      cipher.finish();

      return cipher.output.toHex();
    } catch (error) {
      throw error;
    }
  }

  hexToBinaryArray(hex: string): number[] {
    const binary = [];
    for (let i = 0; i < hex.length / 2; ++i) {
      const h = hex.substr(i * 2, 2);
      binary[i] = parseInt(h, 16);
    }
    return binary;
  }

}

package com.pehchevskip.safedocssystem.service;

import com.pehchevskip.safedocssystem.model.User;
import javassist.NotFoundException;
import org.apache.tomcat.util.buf.HexUtils;
import org.bouncycastle.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.security.*;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Service
public class CryptService {

  @Autowired
  private UserService userService;

  @Autowired
  private EncryptedDocumentService encryptedDocumentService;

  Cipher rsaCipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
  Cipher aesCipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
  KeyFactory rsaKeyFactory = KeyFactory.getInstance("RSA");
  KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");

  public KeyPair getPair() {
    return keyPairGenerator.generateKeyPair();
  }

  public void encryptAndSave(MultipartFile file, String creatorUsername, String sharedToUsername) throws BadPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, IOException, NotFoundException, InvalidKeyException, InvalidKeySpecException {
    byte[] encryptedContent = encrypt(file, sharedToUsername);
    User creator = userService.getUserByUsername(creatorUsername);
    User sharedTo = userService.getUserByUsername(sharedToUsername);
    encryptedDocumentService.saveEncryptedDocument(encryptedContent, creator, sharedTo);
  }

  public byte[] encrypt(MultipartFile file, String username) throws InvalidKeySpecException, BadPaddingException, InvalidKeyException, IllegalBlockSizeException, NoSuchAlgorithmException, IOException, NotFoundException {
    var user = userService.getUserByUsername(username);
    var x509keySpec = new X509EncodedKeySpec(user.getPublicKey());
    var publicKey = (RSAPublicKey) rsaKeyFactory.generatePublic(x509keySpec);

    var symmetricKey = generateSymmetricKey();
    byte[] encryptedSymmetricKey = encrypt(publicKey, symmetricKey.getEncoded(), false);
    System.out.println("*** SK:\n" + HexUtils.toHexString(symmetricKey.getEncoded()));
    System.out.println("*** ESK:\n" + HexUtils.toHexString(encryptedSymmetricKey));

    var result = encrypt(symmetricKey, file.getBytes(), true);
    System.out.println("FILE LENGTH: " + file.getSize());
    System.out.println("LENGTH: " + (encryptedSymmetricKey.length + result.length));

    return Arrays.concatenate(encryptedSymmetricKey, result);
  }

  private byte[] encrypt(Key key, byte[] content, boolean symmetric) throws InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
    Cipher cipher = symmetric ? aesCipher : rsaCipher;
    cipher.init(Cipher.ENCRYPT_MODE, key);
    return cipher.doFinal(content);
  }

  public byte[] decrypt(MultipartFile file, String privateKeyHex) throws IOException, InvalidKeySpecException, BadPaddingException, InvalidKeyException, IllegalBlockSizeException {
    // SHOULD NOT BE USED ON THE BACKEND SIDE
    var esk = java.util.Arrays.copyOfRange(file.getBytes(), 0, 256);
    var encContent = java.util.Arrays.copyOfRange(file.getBytes(), 256, file.getBytes().length);

    var keySpec = new PKCS8EncodedKeySpec(HexUtils.fromHexString(privateKeyHex));
    var privateKey = rsaKeyFactory.generatePrivate(keySpec);

    var symmetricKey = decrypt(privateKey, esk, false);
    var symmetricKeySpec = new SecretKeySpec(symmetricKey, "AES");

    return decrypt(symmetricKeySpec, encContent, true);
  }

  private byte[] decrypt(Key key, byte[] content, boolean symmetric) throws BadPaddingException, IllegalBlockSizeException, InvalidKeyException {
    Cipher cipher = symmetric ? aesCipher : rsaCipher;
    cipher.init(Cipher.DECRYPT_MODE, key);
    return cipher.doFinal(content);
  }

  private SecretKey generateSymmetricKey() throws NoSuchAlgorithmException {
    var keyGenerator = KeyGenerator.getInstance("AES");
    keyGenerator.init(256, new SecureRandom());
    return keyGenerator.generateKey();
  }

  public CryptService() throws NoSuchPaddingException, NoSuchAlgorithmException {
  }
}

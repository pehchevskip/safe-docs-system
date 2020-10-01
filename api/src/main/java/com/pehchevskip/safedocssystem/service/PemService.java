package com.pehchevskip.safedocssystem.service;

import org.apache.tomcat.util.buf.HexUtils;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import org.bouncycastle.util.io.pem.PemWriter;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

@Service
public class PemService {

  public void generatePrivatePem(String privateKey, PrintWriter writer) throws NoSuchAlgorithmException, InvalidKeySpecException, IOException {
    var pkcs8 = new PKCS8EncodedKeySpec(HexUtils.fromHexString(privateKey));
    var privateKey1 = KeyFactory.getInstance("RSA").generatePrivate(pkcs8);

    PemObject privatePem = new PemObject("PRIVATE KEY", privateKey1.getEncoded());
    PemWriter pemWriter = new PemWriter(writer);
    pemWriter.writeObject(privatePem);
    pemWriter.close();
  }

  public void generatePublicPem(String publicKey, PrintWriter writer) throws IOException, InvalidKeySpecException, NoSuchAlgorithmException {
    var x509 = new X509EncodedKeySpec(HexUtils.fromHexString(publicKey));
    var publicKey1 = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(x509);

    PemObject publicPem = new PemObject("PUBLIC KEY", publicKey1.getEncoded());
    PemWriter pemWriter = new PemWriter(writer);
    pemWriter.writeObject(publicPem);
    pemWriter.close();
  }

  public PublicKey readPublicKeyFromMultipartFile(MultipartFile file) throws IOException {
    byte[] bytes = parsePemMultipartFile(file);
    return getPublicKey(bytes);
  }

  private byte[] parsePemMultipartFile(MultipartFile file) throws IOException {
    PemReader pemReader = new PemReader(new InputStreamReader(file.getInputStream()));
    PemObject pemObject = pemReader.readPemObject();
    byte[] content = pemObject.getContent();
    pemReader.close();
    return content;
  }

  private PublicKey getPublicKey(byte[] keyBytes) {
    PublicKey result = null;
    try {
      KeyFactory keyFactory = KeyFactory.getInstance("RSA");
      EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
      result = keyFactory.generatePublic(keySpec);
    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      e.printStackTrace();
    }
    return result;
  }

}

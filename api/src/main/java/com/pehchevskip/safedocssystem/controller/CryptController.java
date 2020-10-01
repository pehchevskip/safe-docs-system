package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.service.CryptService;
import javassist.NotFoundException;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
@RequestMapping("/api/crypt")
public class CryptController {

  @Autowired
  private CryptService cryptService;

  @GetMapping("/get-pair")
  public String getPair() {
    KeyPair keyPair = cryptService.getPair();
    String pubk = HexUtils.toHexString(keyPair.getPublic().getEncoded());
    String privk = HexUtils.toHexString(keyPair.getPrivate().getEncoded());
    return "PUBLIC\n" + pubk + "\nPRIVATE\n" + privk;
  }

  @PostMapping("/encrypt")
  public void encrypt(@RequestParam MultipartFile file, @RequestParam String creatorUsername, @RequestParam String sharedToUsername) throws BadPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, IOException, InvalidKeyException, InvalidKeySpecException, NotFoundException {
    cryptService.encryptAndSave(file, creatorUsername, sharedToUsername);
  }

  @PostMapping("/decrypt")
  public void decrypt(@RequestParam MultipartFile file, @RequestParam String privateKey, HttpServletResponse response) throws IOException, IllegalBlockSizeException, InvalidKeyException, InvalidKeySpecException, BadPaddingException {
    // SHOULD NOT BE USED ON THE BACKEND SIDE !!!
    response.getOutputStream().write(cryptService.decrypt(file, privateKey));
    response.getOutputStream().close();
  }

}

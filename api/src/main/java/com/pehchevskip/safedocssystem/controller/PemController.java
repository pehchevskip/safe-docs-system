package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.service.PemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
@RequestMapping("/api/pem")
public class PemController {

  @Autowired
  private PemService pemService;

  @PostMapping("/generate-public-pem")
  public void generatePublicPem(@RequestParam String publicKey, HttpServletResponse response) throws IOException, InvalidKeySpecException, NoSuchAlgorithmException {
    this.pemService.generatePublicPem(publicKey, response.getWriter());
  }

  @PostMapping("/generate-private-pem")
  public void generatePrivatePem(@RequestParam String privateKey, HttpServletResponse response) throws IOException, InvalidKeySpecException, NoSuchAlgorithmException {
    this.pemService.generatePrivatePem(privateKey, response.getWriter());
  }

}

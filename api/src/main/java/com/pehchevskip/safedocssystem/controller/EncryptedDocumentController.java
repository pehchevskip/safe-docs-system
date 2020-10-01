package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.model.EncryptedDocument;
import com.pehchevskip.safedocssystem.service.EncryptedDocumentService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encrypted-documents")
public class EncryptedDocumentController {

  @Autowired
  private EncryptedDocumentService encryptedDocumentService;

  @GetMapping("/creator")
  public List<EncryptedDocument> getDocumentsByCreator(@RequestParam String username) throws NotFoundException {
    return encryptedDocumentService.getDocumentsByCreator(username);
  }

  @GetMapping("/shared-to")
  public List<EncryptedDocument> getDocumentsSharedTo(@RequestParam String username) throws NotFoundException {
    return encryptedDocumentService.getDocumentsSharedTo(username);
  }

  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  public byte[] getDocumentById(@PathVariable Long id) throws NotFoundException {
    var encryptedDocument = encryptedDocumentService.getDocumentById(id);
    return encryptedDocument.getContent();
  }

}

package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.dto.EncryptedDocumentDto;
import com.pehchevskip.safedocssystem.model.EncryptedDocument;
import com.pehchevskip.safedocssystem.service.EncryptedDocumentService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/encrypted-documents")
public class EncryptedDocumentController {

  @Autowired
  private EncryptedDocumentService encryptedDocumentService;

  @GetMapping("/creator")
  public List<EncryptedDocumentDto> getDocumentsByCreator(Principal principal) throws NotFoundException {
    String username = principal.getName();
    return encryptedDocumentService.getDocumentsByCreator(username).stream()
        .map(encryptedDocumentDtoMapper)
        .collect(Collectors.toList());
  }

  @GetMapping("/shared-to")
  public List<EncryptedDocumentDto> getDocumentsSharedTo(Principal principal) throws NotFoundException {
    String username = principal.getName();
    return encryptedDocumentService.getDocumentsSharedTo(username).stream()
        .map(encryptedDocumentDtoMapper)
        .collect(Collectors.toList());
  }

  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
  public byte[] getDocumentById(@PathVariable Long id) throws NotFoundException {
    var encryptedDocument = encryptedDocumentService.getDocumentById(id);
    return encryptedDocument.getContent();
  }

  private final Function<EncryptedDocument, EncryptedDocumentDto> encryptedDocumentDtoMapper = encryptedDocument ->
      new EncryptedDocumentDto(
          encryptedDocument.getId(),
          encryptedDocument.getFilename(),
          encryptedDocument.getCreator().getUsername(),
          encryptedDocument.getSharedTo().getUsername()
      );

}

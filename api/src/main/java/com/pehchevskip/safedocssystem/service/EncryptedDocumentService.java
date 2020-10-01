package com.pehchevskip.safedocssystem.service;

import com.pehchevskip.safedocssystem.model.EncryptedDocument;
import com.pehchevskip.safedocssystem.model.User;
import com.pehchevskip.safedocssystem.repository.EncryptedDocumentRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EncryptedDocumentService {

  @Autowired
  private EncryptedDocumentRepository encryptedDocumentRepository;

  @Autowired
  private UserService userService;

  public EncryptedDocument getDocumentById(Long id) throws NotFoundException {
    return encryptedDocumentRepository.findById(id).orElseThrow(() -> new NotFoundException("EncryptedDocument with id: " + id + " not found."));
  }

  public List<EncryptedDocument> getDocumentsByCreator(String username) throws NotFoundException {
    var user = userService.getUserByUsername(username);
    return encryptedDocumentRepository.findByCreator(user);
  }

  public List<EncryptedDocument> getDocumentsSharedTo(String username) throws NotFoundException {
    var user = userService.getUserByUsername(username);
    return encryptedDocumentRepository.findBySharedTo(user);
  }

  public EncryptedDocument saveEncryptedDocument(byte[] content, User creator, User sharedTo) {
    return encryptedDocumentRepository.save(new EncryptedDocument(null, content, creator, sharedTo));
  }

}

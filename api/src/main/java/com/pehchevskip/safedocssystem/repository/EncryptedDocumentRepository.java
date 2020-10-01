package com.pehchevskip.safedocssystem.repository;

import com.pehchevskip.safedocssystem.model.EncryptedDocument;
import com.pehchevskip.safedocssystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EncryptedDocumentRepository extends JpaRepository<EncryptedDocument, Long> {

  List<EncryptedDocument> findByCreator(User user);

  List<EncryptedDocument> findBySharedTo(User user);

}

package com.pehchevskip.safedocssystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EncryptedDocumentDto {

  private Long id;
  private String filename;
  private String creator;
  private String sharedTo;

}

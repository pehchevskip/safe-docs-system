package com.pehchevskip.safedocssystem.service;

import com.pehchevskip.safedocssystem.model.User;
import com.pehchevskip.safedocssystem.repository.UserRepository;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.PublicKey;
import java.util.List;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PemService pemService;

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User saveNewUser(String username, MultipartFile publicKeyPem) throws IOException {
    PublicKey publicKey = pemService.readPublicKeyFromMultipartFile(publicKeyPem);
    return userRepository.save(new User(null, username, publicKey.getEncoded()));
  }

  public User getUserById(Long id) throws NotFoundException {
    return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User with id: " + id + " not found."));
  }

  public User getUserByUsername(String username) throws NotFoundException {
    return userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("User with username: " + username + " not found."));
  }

}

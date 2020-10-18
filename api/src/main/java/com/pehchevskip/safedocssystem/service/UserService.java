package com.pehchevskip.safedocssystem.service;

import com.pehchevskip.safedocssystem.model.User;
import com.pehchevskip.safedocssystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import java.io.IOException;
import java.security.PublicKey;
import java.util.List;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PemService pemService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  public User saveNewUser(String username, String password, MultipartFile publicKeyPem) throws IOException {
    PublicKey publicKey = pemService.readPublicKeyFromMultipartFile(publicKeyPem);
    String encodedPassword = passwordEncoder.encode(password);
    return userRepository.save(new User(null, username, encodedPassword, publicKey.getEncoded()));
  }

  public User getUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("User with id: " + id + " cannot be found"));
  }

  public User getUserByUsername(String username) {
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User with username: " + username + " cannot be found"));
  }

}

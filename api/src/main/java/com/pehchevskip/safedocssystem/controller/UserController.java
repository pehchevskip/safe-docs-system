package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.model.User;
import com.pehchevskip.safedocssystem.service.UserService;
import javassist.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping
  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/{id}")
  public User getUserById(@PathVariable Long id) throws NotFoundException {
    return userService.getUserById(id);
  }

  @PostMapping
  public User saveUser(@RequestParam String username, @RequestParam MultipartFile publicKeyPem) throws IOException {
    return userService.saveNewUser(username, publicKeyPem);
  }

}

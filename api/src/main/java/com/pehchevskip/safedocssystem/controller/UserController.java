package com.pehchevskip.safedocssystem.controller;

import com.pehchevskip.safedocssystem.dto.UserDto;
import com.pehchevskip.safedocssystem.model.User;
import com.pehchevskip.safedocssystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping
  public List<UserDto> getAllUsers() {
    return userService.getAllUsers().stream()
        .map(user -> new UserDto(user.getId(), user.getUsername()))
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  public User getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
  }

  @PostMapping
  public User saveUser(@RequestParam String username,
                       @RequestParam String password,
                       @RequestParam MultipartFile publicKeyPem) throws IOException {
    return userService.saveNewUser(username, password, publicKeyPem);
  }

}

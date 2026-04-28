package com.renato.sportsapp.controller;

import com.renato.sportsapp.dto.PaswordChangeDto;
import com.renato.sportsapp.dto.UserUpdateDto;
import com.renato.sportsapp.entity.User;
import com.renato.sportsapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public User getMe(Authentication auth){
        return userService.getByEmail(auth.getName());
    }

    @PutMapping("/me")
    public User updateMe(@RequestBody UserUpdateDto dto, Authentication auth){
        return userService.updateProfile(auth.getName(),dto);
    }

    @PutMapping("/me/password")
    public void changePassword(@RequestBody PaswordChangeDto dto, Authentication auth){
        userService.changePassword(auth.getName(),dto);
    }
}

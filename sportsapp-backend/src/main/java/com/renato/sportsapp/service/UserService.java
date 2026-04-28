package com.renato.sportsapp.service;

import com.renato.sportsapp.dto.PaswordChangeDto;
import com.renato.sportsapp.dto.UserUpdateDto;
import com.renato.sportsapp.entity.User;
import com.renato.sportsapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService
{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, UserUpdateDto dto) {
        User user = getByEmail(email);

        if (dto.getUsername() != null && !dto.getUsername().equals(user.getUsername())) {
            if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
                throw new RuntimeException("Korisničko ime već postoji.");
            }
            user.setUsername(dto.getUsername());
        }

        if(dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())){
            if(userRepository.findByEmail(dto.getEmail()).isPresent()){
                throw new RuntimeException("Email je zauzet.");
            }
            user.setEmail(dto.getEmail());
        }
        return userRepository.save(user);
    }

    public void changePassword(String email, PaswordChangeDto dto){
        User user = getByEmail(email);

        if(!passwordEncoder.matches(dto.getCurrentPassword(),user.getPassword())){
            throw new RuntimeException("Trenutna lozinka nije ispravna");
        }
        if(dto.getNewPassword() == null || dto.getNewPassword().length() < 6){
            throw  new RuntimeException("Nova lozinka mora imati najmanje 6 karaktera!");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }
}

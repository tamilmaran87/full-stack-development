package com.recruitment.system.service;

import com.recruitment.system.dto.UserRegistrationDto;
import com.recruitment.system.model.User;
import com.recruitment.system.model.enums.Role;
import com.recruitment.system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public User registerUser(UserRegistrationDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already registered: " + dto.getEmail());
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .phone(dto.getPhone())
                .skills(dto.getSkills())
                .experience(dto.getExperience())
                .role(Role.valueOf(dto.getRole()))
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateProfile(Long userId, String fullName, String phone, String skills,
                               Integer experience, MultipartFile resumeFile) {
        User user = findById(userId);
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setSkills(skills);
        user.setExperience(experience);

        if (resumeFile != null && !resumeFile.isEmpty()) {
            String filePath = fileStorageService.storeFile(resumeFile);
            user.setResumePath(filePath);
        }

        return userRepository.save(user);
    }

    public List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public void toggleUserStatus(Long userId) {
        User user = findById(userId);
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    public long countByRole(Role role) {
        return userRepository.countByRole(role);
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }
}

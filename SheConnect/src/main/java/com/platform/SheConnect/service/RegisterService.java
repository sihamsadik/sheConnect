package com.platform.SheConnect.service;
 
 import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.entity.Role;
 import com.platform.SheConnect.entity.User;
 import com.platform.SheConnect.repository.RoleRepository;
 import com.platform.SheConnect.service.UserService;
 import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 import org.springframework.stereotype.Service;
 import com.platform.SheConnect.service.JwtService;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.RegisterResquest;

@Service
public class RegisterService {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterService(UserService userService,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private boolean isStrongPassword(String password) {
        if (password == null) return false;
        if (password.length() < 8) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        if (!password.matches(".*[a-z].*")) return false;
        if (!password.matches(".*\\d.*")) return false;
        if (!password.matches(".*[!@#$%^&*()].*")) return false;
        return true;
    }

    public RegisterResponse register(User user) {

        // 1️⃣ Basic validation
        if (user.getName() == null || user.getName().isEmpty()) {
            throw new RuntimeException("Name required");
        }

        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new RuntimeException("Email required");
        }

        if (!isStrongPassword(user.getPassword())) {
            throw new RuntimeException("Weak password");
        }

        // 2️⃣ Check email already exists
        if (userService.findUserByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }

        // 3️⃣ Get role from DB
        Role role = roleRepository.findByName(user.getRole().getName())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // 4️⃣ Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(role);

        // 5️⃣ Save
        User savedUser = userService.saveUser(user);
        return new LoginResponse(savedUser.getName(), savedUser.getEmail(), savedUser.getRole().getName(), jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().getName()));
    }
}
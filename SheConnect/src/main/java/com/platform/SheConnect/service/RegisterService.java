// package com.platform.SheConnect.service;
 
//  import com.platform.SheConnect.dto.LoginResponse;
// import com.platform.SheConnect.entity.Role;
//  import com.platform.SheConnect.entity.User;
//  import com.platform.SheConnect.repository.RoleRepository;
//  import com.platform.SheConnect.service.UserService;
//  import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//  import org.springframework.stereotype.Service;
//  import com.platform.SheConnect.security.JwtService;
// import com.platform.SheConnect.dto.LoginResponse;
// import com.platform.SheConnect.dto.RegisterRequest;

// @Service
// public class RegisterService {

//     private final JwtService jwtService;
//     private final UserService userService;
//     private final RoleRepository roleRepository;
//     private final PasswordEncoder passwordEncoder;

//     public RegisterService(JwtService jwtService,
//                            UserService userService,
//                            RoleRepository roleRepository,
//                            PasswordEncoder passwordEncoder) {
//         this.userService = userService;
//         this.roleRepository = roleRepository;
//         this.passwordEncoder = passwordEncoder;
//         this.jwtService = jwtService;
//     }

//     private boolean isStrongPassword(String password) {
//         if (password == null) return false;
//         if (password.length() < 8) return false;
//         if (!password.matches(".*[A-Z].*")) return false;
//         if (!password.matches(".*[a-z].*")) return false;
//         if (!password.matches(".*\\d.*")) return false;
//         if (!password.matches(".*[!@#$%^&*()].*")) return false;
//         return true;
//     }

//     public LoginResponse register(RegisterRequest request) {

//         // 1️⃣ Basic validation
//         if (request.getName() == null || request.getName().isEmpty()) {
//             throw new RuntimeException("Name required");
//         }

//         if (request.getEmail() == null || request.getEmail().isEmpty()) {
//             throw new RuntimeException("Email required");
//         }

//         if (!isStrongPassword(request.getPassword())) {
//             throw new RuntimeException("Weak password");
//         }

//         // 2️⃣ Check email already exists
//         if (userService.findUserByEmail(request.getEmail()).isPresent()) {
//             throw new RuntimeException("Email already used");
//         }

//         // 3️⃣ Get role from DB
//         Role role = roleRepository.findByName(request.getRole())
//                 .orElseThrow(() -> new RuntimeException("Role not found"));

//         // 4️⃣ Encrypt password
//         // request.setPassword(passwordEncoder.encode(request.getPassword()));
//         request.setRole(role.getName());
                
//         User user = new User();
//         user.setName(request.getName());
//         user.setEmail(request.getEmail());
//         user.setPassword(passwordEncoder.encode(request.getPassword()));
//         user.setRole(role);

//         User savedUser = userService.saveUser(user);

        
//         return new LoginResponse(savedUser.getName(), savedUser.getEmail(), savedUser.getRole().getName(), jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().getName()));
//     }
// }
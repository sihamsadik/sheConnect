// package com.platform.SheConnect.service;

// import org.apache.tomcat.util.net.openssl.ciphers.Authentication;

// import com.platform.SheConnect.entity.User;
// import com.platform.SheConnect.repository.UserRepository;

// public class UserFinderService {
//     private final UserRepository userRepository;

//     public UserFinderService(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     public User findUserByAuthentication(Authentication authentication) {
//         User user = (User) authentication.getPrincipal();
//         return userRepository.findByEmail(user.getEmail()).orElse(null);
//     }
// }

package com.youtube.clone.backend.config;

import com.youtube.clone.backend.model.ERole;
import com.youtube.clone.backend.model.Role;
import com.youtube.clone.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            System.out.println("Initializing roles in the database...");

            Role userRole = new Role();
            userRole.setName(ERole.ROLE_USER);
            roleRepository.save(userRole);

            Role modRole = new Role();
            modRole.setName(ERole.ROLE_MODERATOR);
            roleRepository.save(modRole);

            Role adminRole = new Role();
            adminRole.setName(ERole.ROLE_ADMIN);
            roleRepository.save(adminRole);

            System.out.println("Roles initialized successfully!");
        }
    }
}
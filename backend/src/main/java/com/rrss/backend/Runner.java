package com.rrss.backend;

import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.service.MerchantRequestService;
import com.rrss.backend.service.ProductService;
import com.rrss.backend.util.ImageUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;

@Component
public class Runner implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AuthorityRepository authorityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CartRepository cartRepository;
    private final MerchantRequestRepository merchantRequestRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final MerchantRequestService merchantRequestService;
    private final ProductRepository productRepository;


    public Runner(RoleRepository roleRepository, AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CartRepository cartRepository, MerchantRequestRepository merchantRequestRepository, ProductCategoryRepository productCategoryRepository, MerchantRequestService merchantRequestService, ProductRepository productRepository) {
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartRepository = cartRepository;
        this.merchantRequestRepository = merchantRequestRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.merchantRequestService = merchantRequestService;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        createAuthorities();
        createRoles();
        createUser();
        saveProductCategories();
        createCommunityModerator();
        createMerchantWithRequest();
        createAdmin();
    }

    private User getUser(String username, String password, String email, String firstName, String lastName, String role) {
        Cart cart =  cartRepository.save(new Cart());
        return new User(
                username,
                passwordEncoder.encode(password),
                email,
                firstName,
                lastName,
                roleRepository.findByName(role)
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cart
        );
    }

    private void createAuthorities() {
        authorityRepository.save(new Authority("MANAGE_PRODUCT"));
        authorityRepository.save(new Authority("MANAGE_REVIEW"));
        authorityRepository.save(new Authority("MANAGE_RECOMMENDATION"));
        authorityRepository.save(new Authority("APPROVE_MERCHANT_REQUEST"));
        authorityRepository.save(new Authority("SEE_MERCHANT_REQUEST"));
        authorityRepository.save(new Authority("MANAGE_PRODUCT_CATEGORY"));
        authorityRepository.save(new Authority("MANAGE_POST"));
        authorityRepository.save(new Authority("MANAGE_TOPIC"));
        authorityRepository.save(new Authority("MANAGE_FORUM_CATEGORY"));
        authorityRepository.save(new Authority("BAN_USER"));
    }

    private void createRoles() {
        roleRepository.save(new Role("USER"));

        Role roleCommunityModerator = roleRepository.save(new Role("COMMUNITY_MODERATOR"));
        roleCommunityModerator.getAuthorities().add(authorityRepository.findByName("MANAGE_POST").orElseThrow());
        roleCommunityModerator.getAuthorities().add(authorityRepository.findByName("MANAGE_TOPIC").orElseThrow());
        roleCommunityModerator.getAuthorities().add(authorityRepository.findByName("MANAGE_FORUM_CATEGORY").orElseThrow());
        roleRepository.save(roleCommunityModerator);

        Role roleAdmin = roleRepository.save(new Role("ADMIN"));
        roleAdmin.getAuthorities().add(authorityRepository.findByName("APPROVE_MERCHANT_REQUEST").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("SEE_MERCHANT_REQUEST").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_PRODUCT_CATEGORY").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("BAN_USER").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_REVIEW").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_POST").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_TOPIC").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_FORUM_CATEGORY").orElseThrow());
        roleAdmin.getAuthorities().add(authorityRepository.findByName("MANAGE_RECOMMENDATION").orElseThrow());
        roleRepository.save(roleAdmin);

        Role roleMerchant = roleRepository.save(new Role("MERCHANT"));
        roleMerchant.getAuthorities().add(authorityRepository.findByName("MANAGE_PRODUCT").orElseThrow());
        roleRepository.save(roleMerchant);

    }

    private void createCommunityModerator() {
        User user = getUser("jon_moderator","securepass","example9@gmail.com","jon","doe","COMMUNITY_MODERATOR");
        userRepository.save(user);
    }

    private void saveProductCategories() {
        productCategoryRepository.save(new ProductCategory("coffee bean", "just a coffee beans"));
        productCategoryRepository.save(new ProductCategory("tea", "只是一杯茶，我爱约翰-塞纳"));
        productCategoryRepository.save(new ProductCategory("tea equipment", "只是一杯茶，我爱约翰-塞纳"));
        productCategoryRepository.save(new ProductCategory("coffee equipments", "just a coffee equipment"));
    }

    private void createUser() {
        userRepository.save(getUser("jon_user","securepass","example341@gmail.com","jon","doe","USER"));
    }

    private void createMerchantWithRequest() {
        createMerchant("jon_merchant","securepass","example1@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant","securepass","example2@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant2","securepass","example47@gmail.com","jon","doe","USER");

        merchantRequestService.answerRequest("jon_real_merchant", "added from runner", true);
        merchantRequestService.answerRequest("jon_real_merchant2", "added from runner", true);

        Merchant merchant = userRepository.findByUsername("jon_real_merchant").get().getMerchant();
        Merchant merchant2 = userRepository.findByUsername("jon_real_merchant2").get().getMerchant();

        createProduct("black tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        createProduct("green tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10));
        createProduct("white tea","very good taste",merchant,"tea",BigDecimal.valueOf(10));
        createProduct("oolong tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        createProduct("panama","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        createProduct("guetemala","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));

    }

    private void createMerchant(String username, String password, String email, String firstName, String lastName, String role) {
        User merchant = getUser(username,password,email,firstName,lastName,role);
        User newMerchant = userRepository.save(merchant);
        merchantRequestRepository.save(new MerchantRequest(newMerchant));
    }

    private void createProduct(String name, String description, Merchant merchant, String productCategoryName, BigDecimal price) {
        productRepository.save(
                new Product(
                    name,
                    description,
                    merchant,
                    productCategoryRepository.findByName(productCategoryName).orElseThrow(),
                    price,
                    null
                )
        );
    }


    private void createAdmin() {
        User admin = getUser("jon_admin","securepass","example3@gmail.com","jon","doe","ADMIN");
        userRepository.save(admin);
    }
}
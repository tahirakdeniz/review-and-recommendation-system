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


    public Runner(RoleRepository roleRepository, AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CartRepository cartRepository, MerchantRequestRepository merchantRequestRepository, ProductCategoryRepository productCategoryRepository, MerchantRequestService merchantRequestService) {
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartRepository = cartRepository;
        this.merchantRequestRepository = merchantRequestRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.merchantRequestService = merchantRequestService;
    }

    @Override
    public void run(String... args) throws Exception {
        createUser();
        saveProductCategories();
        createMerchantWithRequest();
        createAdmin();
    }

    private void saveProductCategories() {
        productCategoryRepository.save(new ProductCategory("coffee bean", "just a coffee beans"));
        productCategoryRepository.save(new ProductCategory("tee", "只是一杯茶，我爱约翰-塞纳"));
    }

    private void createUser() {
        Role roleUser = new Role("USER");
        roleRepository.save(roleUser);

        Cart cartUser =  cartRepository.save(new Cart());
        User user = new User(
                "jon_user",
                passwordEncoder.encode("securepass"),
                "example@gmail.com",
                "jon",
                "doe",
                roleRepository.findByName("USER")
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cartUser
        );
        userRepository.save(user);

    }

    private void createMerchantWithRequest() {
        Role roleMerchant = roleRepository.save(new Role("MERCHANT"));
        Authority authorityAddProduct = authorityRepository.save(new Authority("MANAGE_PRODUCT"));
        roleMerchant.getAuthorities().add(authorityAddProduct);
        roleRepository.save(roleMerchant);

        Cart cartMerchant = cartRepository.save(new Cart());
        Cart cartRealMerchant = cartRepository.save(new Cart());


        User merchant = new User(
                "jon_merchant",
                passwordEncoder.encode("securepass"),
                "example1@gmail.com",
                "jon",
                "doe",
                roleRepository.findByName("USER")
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cartMerchant
        );
        User newMerchant = userRepository.save(merchant);

        User realMerchant = new User(
                "jon_real_merchant",
                passwordEncoder.encode("securepass"),
                "example2@gmail.com",
                "jon",
                "doe",
                roleRepository.findByName("USER")
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cartRealMerchant
        );
        User newRealMerchant = userRepository.save(realMerchant);

        merchantRequestRepository.save(new MerchantRequest(newMerchant));
        merchantRequestRepository.save(new MerchantRequest(newRealMerchant));

        merchantRequestService.answerRequest("jon_real_merchant", "added from runner", true);

    }

    private void createAdmin() {
        Authority authorityManageReview = authorityRepository.save(new Authority("MANAGE_REVIEW"));
        Authority authorityApprove = authorityRepository.save(new Authority("APPROVE_MERCHANT_REQUEST"));
        Authority authoritySee = authorityRepository.save(new Authority("SEE_MERCHANT_REQUEST"));
        Authority addProductCategory = authorityRepository.save(new Authority("MANAGE_PRODUCT_CATEGORY"));
        Role roleAdmin = roleRepository.save(new Role("ADMIN"));
        roleAdmin.getAuthorities().add(authorityApprove);
        roleAdmin.getAuthorities().add(authoritySee);
        roleAdmin.getAuthorities().add(addProductCategory);
        roleAdmin.getAuthorities().add(authorityManageReview);
        roleRepository.save(roleAdmin);

        Cart cartAdmin = cartRepository.save(new Cart());

        User admin = new User(
                "jon_admin",
                passwordEncoder.encode("securepass"),
                "example3@gmail.com",
                "jon",
                "doe",
                roleRepository.findByName("ADMIN")
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cartAdmin
        );
        userRepository.save(admin);

    }
}
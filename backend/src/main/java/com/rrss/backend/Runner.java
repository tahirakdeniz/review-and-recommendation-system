package com.rrss.backend;

import com.rrss.backend.dto.AddProductRequest;
import com.rrss.backend.dto.ProductCategoryRequest;
import com.rrss.backend.dto.ProductDto;
import com.rrss.backend.enums.ForumCategoryHeader;
import com.rrss.backend.exception.custom.ForumCategoryNotFoundException;
import com.rrss.backend.exception.custom.InsufficientBalanceException;
import com.rrss.backend.exception.custom.ProductCategoryNotFoundException;
import com.rrss.backend.exception.custom.ProductNotFoundException;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.service.MerchantRequestService;
import com.rrss.backend.service.ProductCategoryService;
import com.rrss.backend.util.ImageUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
    private final ForumCategoryRepository forumCategoryRepository;
    private final TopicRepository topicRepository;
    private final PostRepository postRepository;
    private final CartItemRepository cartItemRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final PurchaseRepository purchaseRepository;
    private final WishlistRepository wishlistRepository;
    private final ProductCategoryService productCategoryService;

    public Runner(RoleRepository roleRepository, AuthorityRepository authorityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, CartRepository cartRepository, MerchantRequestRepository merchantRequestRepository, ProductCategoryRepository productCategoryRepository, MerchantRequestService merchantRequestService, ProductRepository productRepository, ForumCategoryRepository forumCategoryRepository, TopicRepository topicRepository, PostRepository postRepository, CartItemRepository cartItemRepository, PurchaseItemRepository purchaseItemRepository, PurchaseRepository purchaseRepository, WishlistRepository wishlistRepository, ProductCategoryService productCategoryService) {
        this.roleRepository = roleRepository;
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.cartRepository = cartRepository;
        this.merchantRequestRepository = merchantRequestRepository;
        this.productCategoryRepository = productCategoryRepository;
        this.merchantRequestService = merchantRequestService;
        this.productRepository = productRepository;
        this.forumCategoryRepository = forumCategoryRepository;
        this.topicRepository = topicRepository;
        this.postRepository = postRepository;
        this.cartItemRepository = cartItemRepository;
        this.purchaseItemRepository = purchaseItemRepository;
        this.purchaseRepository = purchaseRepository;
        this.wishlistRepository = wishlistRepository;
        this.productCategoryService = productCategoryService;
    }

    @Override
    public void run(String... args) throws Exception {
        createAuthorities();
        createRoles();
        saveProductCategories();
        createCommunityModerator();
        createMerchantWithRequest();
        User admin1 = createAdmin();
        createForumCategories();
        User user1 = createUser();
        createTopicsAndPosts(user1);
    }

    private User getUser(String username, String password, String email, String firstName, String lastName, String role) {
        Cart cart =  cartRepository.save(new Cart());
        Wishlist wishlist = wishlistRepository.save(new Wishlist());
        return new User(
                username,
                passwordEncoder.encode(password),
                email,
                firstName,
                lastName,
                roleRepository.findByName(role)
                        .orElseThrow(),
                LocalDate.of(1995, 5, 5),
                cart,
                wishlist

        );
    }

    private ForumCategory getForumCategory(String name, String description, ForumCategoryHeader header) {
        return forumCategoryRepository.save(new ForumCategory(
                name,
                description,
                header
        ));
    }

    private Topic getTopic(User user, String title, String categoryName, Boolean isAnonymous, String posts) {
        Topic topic = new Topic(
                title,
                user,
                forumCategoryRepository.findByName(categoryName)
                        .orElseThrow(() -> new ForumCategoryNotFoundException("Forum Category not found.")),
                isAnonymous
        );

        var savedTopic = topicRepository.save(topic);

        Post post = new Post(
                savedTopic,
                user,
                posts,
                isAnonymous
        );

        var savedPost = postRepository.save(post);

        savedTopic.getPosts().add(savedPost);

        return topicRepository.save(savedTopic);
    }

    private Post getPost(User user, Topic topic, Boolean isAnonymous, String posts) {
        return postRepository.save(new Post(
                topic,
                user,
                posts,
                isAnonymous
        ));
    }

    private Product getProduct(String name, String description, Merchant merchant, String productCategoryName, BigDecimal price) {
        return productRepository.save(
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
        authorityRepository.save(new Authority("REVIEW_REPLY"));
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
        roleMerchant.getAuthorities().add(authorityRepository.findByName("REVIEW_REPLY").orElseThrow());
        roleRepository.save(roleMerchant);
    }

    private void createForumCategories(){
        getForumCategory("Q&A","Q&A description",ForumCategoryHeader.Q_A);
        getForumCategory("New Users","New Users description",ForumCategoryHeader.GENERAL_FIELD);
        getForumCategory("Meeting Area","Meeting Area description",ForumCategoryHeader.GENERAL_FIELD);
        getForumCategory("Discussion About Tea","Discussion About Tea description",ForumCategoryHeader.DISCUSSION);
        getForumCategory("Discussion About Coffee","Discussion About Coffee description",ForumCategoryHeader.DISCUSSION);
        getForumCategory("OTHER 1","OTHER 1 description",ForumCategoryHeader.OTHERS);
        getForumCategory("OTHER 2","OTHER 2 description",ForumCategoryHeader.OTHERS);
    }

    private void createTopicsAndPosts(User user1) {
        List<String> categoryName = new ArrayList<>(Arrays.asList("New Users", "Q&A", "Meeting Area", "Meeting Area", "Discussion About Tea", "Discussion About Coffee", "OTHER 1", "OTHER 2"));

        for (int i = 0; i < categoryName.size(); i++) {
            Topic topic = getTopic(user1,"Topic"+ String.valueOf(i+1),categoryName.get(i),i%2==0,"Lorem ipsum dolor");
            for(int j = 0; j < 5; j++) {
                getPost(user1,topic,i+j%2==0,"Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet");
            }
        }
    }

    private void createCommunityModerator() {
        User user = getUser("jon_moderator","securepass","example9@gmail.com","jon","doe","COMMUNITY_MODERATOR");
        userRepository.save(user);
    }

    private void saveProductCategories() {
        productCategoryService.addProductCategory(new ProductCategoryRequest("coffee bean", "just a coffee beans"));
        productCategoryService.addProductCategory(new ProductCategoryRequest("tea", "只是一杯茶，我爱约翰-塞纳"));
        productCategoryService.addProductCategory(new ProductCategoryRequest("tea equipment", "只是一杯茶，我爱约翰-塞纳"));
        productCategoryService.addProductCategory(new ProductCategoryRequest("coffee equipments", "just a coffee equipment"));
    }

    private User createUser() {
        return userRepository.save(getUser("jon_user","securepass","example341@gmail.com","jon","doe","USER"));
    }

    public void addProduct(String name, String description, Merchant merchant, String productCategoryName, BigDecimal price, MultipartFile file) throws IOException {
        Product product = new Product(
                name,
                description,
                merchant,
                productCategoryRepository.findByName(productCategoryName)
                        .orElseThrow(() -> new ProductCategoryNotFoundException("no such category")),
                price,
                ImageUtil.compressImage(file.getBytes())
        );

        productRepository.save(product);
    }

    private void createMerchantWithRequest() {
        createMerchant("jon_merchant","securepass","example1@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant","securepass","example2@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant2","securepass","example47@gmail.com","jon","doe","USER");

        merchantRequestService.answerRequest("jon_real_merchant", "added from runner", true);
        merchantRequestService.answerRequest("jon_real_merchant2", "added from runner", true);

        Merchant merchant = userRepository.findByUsername("jon_real_merchant").get().getMerchant();
        Merchant merchant2 = userRepository.findByUsername("jon_real_merchant2").get().getMerchant();

        String[] paths = {
                "src/main/java/com/rrss/backend/image/blacktea.jpeg",
                "src/main/java/com/rrss/backend/image/brezilyacoffee.jpeg",
                "src/main/java/com/rrss/backend/image/etiyopyacoffee.jpeg",
                "src/main/java/com/rrss/backend/image/greentea.jpeg",
                "src/main/java/com/rrss/backend/image/guetemalacoffee.jpeg",
                "src/main/java/com/rrss/backend/image/kenyacoffee.jpeg",
                "src/main/java/com/rrss/backend/image/oolongtea.jpeg",
                "src/main/java/com/rrss/backend/image/panamacoffee.jpeg",
                "src/main/java/com/rrss/backend/image/whitetea.jpeg",
        };

        HashMap<String,MultipartFile> multipartFiles = new HashMap<>();


        try {
            for (String s: paths) {
                File file = new File(s);
                FileInputStream fileInputStream = new FileInputStream(file);

                MultipartFile multipartFile = new MockMultipartFile(
                        "file",
                        file.getName(),
                        "image/png",
                        fileInputStream
                );
                multipartFiles.put(s,multipartFile);

                fileInputStream.close();
            }

            addProduct("black tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/blacktea.jpeg"));
            addProduct("green tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/greentea.jpeg"));
            addProduct("white tea","very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/whitetea.jpeg"));
            addProduct("oolong tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/oolongtea.jpeg"));
            addProduct("panama","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/panamacoffee.jpeg"));
            addProduct("guetemala","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/guetemalacoffee.jpeg"));
            addProduct("black2 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/blacktea.jpeg"));
            addProduct("green2 tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/greentea.jpeg"));
            addProduct("white2 tea","very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/whitetea.jpeg"));
            addProduct("oolong2 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/oolongtea.jpeg"));
            addProduct("black3 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/blacktea.jpeg"));
            addProduct("green3 tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/greentea.jpeg"));
            addProduct("white3 tea","very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/whitetea.jpeg"));
            addProduct("oolong3 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/oolongtea.jpeg"));
            addProduct("etiyopya","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/etiyopyacoffee.jpeg"));
            addProduct("brezilya","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/brezilyacoffee.jpeg"));
            addProduct("etiyopya2","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/etiyopyacoffee.jpeg"));
            addProduct("brezilya2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/brezilyacoffee.jpeg"));
            addProduct("kenya","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/kenyacoffee.jpeg"));
            addProduct("kenya2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/kenyacoffee.jpeg"));
            addProduct("panama2","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/panamacoffee.jpeg"));
            addProduct("guetemala2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/guetemalacoffee.jpeg"));
            addProduct("panama3","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/panamacoffee.jpeg"));
            addProduct("guetemala3","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10),multipartFiles.get("src/main/java/com/rrss/backend/image/guetemalacoffee.jpeg"));
        } catch (Exception e){}

    }

    private void createMerchant(String username, String password, String email, String firstName, String lastName, String role) {
        User merchant = getUser(username,password,email,firstName,lastName,role);
        User newMerchant = userRepository.save(merchant);
        merchantRequestRepository.save(new MerchantRequest(newMerchant));
    }

    private User createAdmin() {
        return userRepository.save(getUser("jon_admin","securepass","example3@gmail.com","jon","doe","ADMIN"));
    }
}
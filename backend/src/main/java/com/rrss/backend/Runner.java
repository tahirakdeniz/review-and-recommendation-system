package com.rrss.backend;

import com.rrss.backend.dto.ProductCategoryRequest;
import com.rrss.backend.enums.ForumCategoryHeader;
import com.rrss.backend.exception.custom.ForumCategoryNotFoundException;
import com.rrss.backend.exception.custom.InsufficientBalanceException;
import com.rrss.backend.exception.custom.ProductNotFoundException;
import com.rrss.backend.model.*;
import com.rrss.backend.repository.*;
import com.rrss.backend.service.MerchantRequestService;
import com.rrss.backend.service.ProductCategoryService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
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
        asdf(user1,1L,1);
        asdf(user1,2L,1);
        asdf2(user1);
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

    private CartItem incrementQuantity(CartItem item, int additionalQuantity) {
        return new CartItem(
                item.getId(),
                item.getCart(),
                item.getProduct(),
                item.getQuantity() + additionalQuantity
        );
    }

    private CartItem createNewItem(Cart cart, Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        return new CartItem(null, cart, product, quantity);
    }

    private PurchaseItem processCartItem(CartItem item) {
        Product product = item.getProduct();
        PurchaseItem purchaseItem = new PurchaseItem(null, product, product.getPrice(), item.getQuantity());
        purchaseItem = purchaseItemRepository.save(purchaseItem);

        return purchaseItem;
    }

    private void asdf(User user1, Long productId, int quantity) {
        Cart cart = user1.getCart();

        CartItem newCartItem = cart.getItems()
                .stream()
                .filter(item -> Objects.equals(item.getProduct().getId(), productId))
                .findFirst()
                .map(item -> incrementQuantity(item, quantity))
                .orElseGet(() -> createNewItem(cart, productId,quantity));

        cartItemRepository.save(newCartItem);
    }

    private void asdf2(User user) {
        Cart cart = user.getCart();

        List<PurchaseItem> purchaseItems = cart.getItems()
                .stream()
                .map(this::processCartItem)
                .collect(Collectors.toList());

        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);

        BigDecimal totalCost = purchaseItems.stream()
                .map(purchaseItem -> purchaseItem.getProduct().getPrice().multiply(BigDecimal.valueOf(purchaseItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (user.getAccountBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException("Can't buy the product due to insufficient balance.");
        }

        BigDecimal newAccountBalance = user.getAccountBalance().subtract(totalCost);
        userRepository.save(new User(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getDescription(),
                user.isEnabled(),
                user.isCredentialsNonExpired(),
                user.isAccountNonExpired(),
                user.isAccountNonLocked(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePicture(),
                user.getRole(),
                user.getDateOfBirth(),
                user.getMerchant(),
                user.getReviews(),
                newAccountBalance,
                user.getCart(),
                user.getSocialCredit(),
                user.getPurchases(),
                user.getWishlist()
        ));

        Purchase purchase = new Purchase(null, user, purchaseItems, totalCost, LocalDateTime.now());
        purchaseRepository.save(purchase);
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

    private void createMerchantWithRequest() {
        createMerchant("jon_merchant","securepass","example1@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant","securepass","example2@gmail.com","jon","doe","USER");
        createMerchant("jon_real_merchant2","securepass","example47@gmail.com","jon","doe","USER");

        merchantRequestService.answerRequest("jon_real_merchant", "added from runner", true);
        merchantRequestService.answerRequest("jon_real_merchant2", "added from runner", true);

        Merchant merchant = userRepository.findByUsername("jon_real_merchant").get().getMerchant();
        Merchant merchant2 = userRepository.findByUsername("jon_real_merchant2").get().getMerchant();

        getProduct("black tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("green tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10));
        getProduct("white tea","very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("oolong tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("panama","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("guetemala","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
        getProduct("black2 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("green2 tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10));
        getProduct("white2 tea","very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("oolong2 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("black3 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("green3 tea","very very good taste",merchant2,"tea",BigDecimal.valueOf(10));
        getProduct("white3 tea","very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("oolong3 tea","very very good taste",merchant,"tea",BigDecimal.valueOf(10));
        getProduct("etiyopya","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("brezilya","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
        getProduct("etiyopya2","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("brezilya2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
        getProduct("kenya","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("kenya2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
        getProduct("panama2","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("guetemala2","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
        getProduct("panama3","very good taste",merchant2,"coffee bean",BigDecimal.valueOf(10));
        getProduct("guetemala3","very very good taste",merchant,"coffee bean",BigDecimal.valueOf(10));
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
package com.rrss.backend.service;

import com.rrss.backend.dto.AddForumCategoryRequest;
import com.rrss.backend.dto.ForumCategoryDto;
import com.rrss.backend.model.ForumCategory;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.ForumCategoryRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class ForumCategoryService {

    private final ForumCategoryRepository repository;
    private final UserUtil userUtil;

    public ForumCategoryService(ForumCategoryRepository repository, UserUtil userUtil) {
        this.repository = repository;
        this.userUtil = userUtil;
    }


    public ForumCategoryDto addForumCategory(Principal currentUser, AddForumCategoryRequest addForumCategoryRequest) {
        User user = userUtil.extractUser(currentUser);

        ForumCategory forumCategory = new ForumCategory(
                addForumCategoryRequest.name(),
                addForumCategoryRequest.description()
        );
        
        return(ForumCategoryDto.convert(repository.save(forumCategory)));
    }
}

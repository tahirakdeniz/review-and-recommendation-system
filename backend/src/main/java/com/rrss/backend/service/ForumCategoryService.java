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

    public ForumCategoryService(ForumCategoryRepository repository) {
        this.repository = repository;
    }


    public ForumCategoryDto addForumCategory(AddForumCategoryRequest addForumCategoryRequest) {

        ForumCategory forumCategory = new ForumCategory(
                addForumCategoryRequest.name(),
                addForumCategoryRequest.description()
        );
        
        return ForumCategoryDto.convert(repository.save(forumCategory));
    }
}

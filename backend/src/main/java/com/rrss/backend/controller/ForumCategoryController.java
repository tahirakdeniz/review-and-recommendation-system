package com.rrss.backend.controller;

import com.rrss.backend.dto.AddForumCategoryRequest;
import com.rrss.backend.dto.ForumCategoryDto;
import com.rrss.backend.service.ForumCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/forum-categories")
public class ForumCategoryController {

    private final ForumCategoryService forumCategoryService;

    public ForumCategoryController(ForumCategoryService forumCategoryService) {
        this.forumCategoryService = forumCategoryService;
    }


    public ResponseEntity<ForumCategoryDto> addForumCategory(Principal currentUser, @RequestBody AddForumCategoryRequest addForumCategoryRequest) {
        return new ResponseEntity<>(forumCategoryService.addForumCategory(currentUser,addForumCategoryRequest), HttpStatus.CREATED);
    }

}

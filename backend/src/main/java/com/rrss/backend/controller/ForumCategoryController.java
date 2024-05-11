package com.rrss.backend.controller;

import com.rrss.backend.dto.AddForumCategoryRequest;
import com.rrss.backend.dto.ForumCategoryDto;
import com.rrss.backend.dto.TopicDto;
import com.rrss.backend.service.ForumCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/forum-categories")
public class ForumCategoryController {

    private final ForumCategoryService forumCategoryService;

    public ForumCategoryController(ForumCategoryService forumCategoryService) {
        this.forumCategoryService = forumCategoryService;
    }

    @PostMapping
    public ResponseEntity<ForumCategoryDto> addForumCategory(@RequestBody AddForumCategoryRequest addForumCategoryRequest) {
        return new ResponseEntity<>(forumCategoryService.addForumCategory(addForumCategoryRequest), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ForumCategoryDto>> getCategories() {
        return ResponseEntity.ok(forumCategoryService.getCategories());
    }

}

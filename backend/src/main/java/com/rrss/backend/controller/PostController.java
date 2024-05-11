package com.rrss.backend.controller;


import com.rrss.backend.dto.AddForumCategoryRequest;
import com.rrss.backend.dto.AddPostRequest;
import com.rrss.backend.dto.ForumCategoryDto;
import com.rrss.backend.dto.PostDto;
import com.rrss.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<PostDto> addPost(Principal currentUser, @RequestBody AddPostRequest addPostRequest) {
        return new ResponseEntity<>(postService.addPost(currentUser,addPostRequest), HttpStatus.CREATED);
    }


}

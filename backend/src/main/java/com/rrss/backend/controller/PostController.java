package com.rrss.backend.controller;


import com.rrss.backend.dto.AddPostRequest;
import com.rrss.backend.dto.PostDto;
import com.rrss.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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

    @GetMapping("/{topic-id}")
    public ResponseEntity<List<PostDto>> getPosts(@PathVariable("topic-id") Long topicId) {
        return ResponseEntity.ok(postService.getPosts(topicId));
    }

    @PutMapping("/{post-id}")
    public ResponseEntity<PostDto> updatePost(Principal currentUser, @RequestBody AddPostRequest addPostRequest, @PathVariable("post-id") Long postId) {
        return ResponseEntity.ok(postService.updatePost(currentUser,addPostRequest,postId));
    }

    @DeleteMapping("/{post-id}")
    public ResponseEntity<String> deletePostByOwner(Principal currentUser, @PathVariable("post-id") Long postId) {
        return ResponseEntity.ok(postService.deletePostByOwner(currentUser,postId));
    }

    @DeleteMapping("/admin/{post-id}")
    @PreAuthorize("hasAuthority('MANAGE_POST')")
    public ResponseEntity<String> deletePost(@PathVariable("post-id") Long postId) {
        return ResponseEntity.ok(postService.deletePost(postId));
    }

}

package com.rrss.backend.service;

import com.rrss.backend.dto.AddPostRequest;
import com.rrss.backend.dto.PostDto;
import com.rrss.backend.dto.UpdatePostRequest;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.PostNotFoundException;
import com.rrss.backend.exception.custom.TopicNotFoundException;
import com.rrss.backend.model.Post;
import com.rrss.backend.model.Topic;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.PostRepository;
import com.rrss.backend.repository.TopicRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@Service
public class PostService {
    
    private final PostRepository repository;
    private final UserUtil userUtil;
    private final TopicRepository topicRepository;

    public PostService(PostRepository repository, UserUtil userUtil, TopicRepository topicRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.topicRepository = topicRepository;
    }
    
    public PostDto addPost(Principal currentUser, AddPostRequest addPostRequest) {
    User user = userUtil.extractUser(currentUser);

    Post post = new Post(
            topicRepository.findById(addPostRequest.topicId())
                    .orElseThrow(() -> new TopicNotFoundException("Topic not found.")),
            user,
            addPostRequest.content(),
            addPostRequest.isAnonymous()
    );

    return PostDto.convert(repository.save(post));
    }

    public List<PostDto> getPosts(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found"));

        return topic.getPosts()
                .stream()
                .map(PostDto::convert)
                .toList();
    }

    public PostDto updatePost(Principal currentUser, UpdatePostRequest updatePostRequest, Long postId) {
        User user = userUtil.extractUser(currentUser);

        Post post = repository.findById(postId).orElseThrow(() -> new PostNotFoundException("Post not found."));

        if (!Objects.equals(user.getId(), post.getCreatedBy().getId())) {
            throw new PermissionDeniedException("You are not the owner of this post.");
        }

        Post newPost = new Post(
                post.getId(),
                post.getTopic(),
                post.getCreatedBy(),
                updatePostRequest.content(),
                updatePostRequest.isAnonymous()
        );

        return PostDto.convert(repository.save(newPost));
    }

    public String deletePostByOwner(Principal currentUser, Long postId) {
        User user = userUtil.extractUser(currentUser);

        Post post = repository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found."));

        if (!Objects.equals(user.getId(), post.getCreatedBy().getId())) {
            throw new PermissionDeniedException("You are not the owner of this post.");
        }

        repository.deleteById(postId);

        return "Post deleted successfully";
    }

    public String deletePost(Long postId) {
        Post post = repository.findById(postId)
                .orElseThrow(() -> new PostNotFoundException("Post not found."));
        repository.deleteById(postId);
        return "Post deleted successfully";
    }
}

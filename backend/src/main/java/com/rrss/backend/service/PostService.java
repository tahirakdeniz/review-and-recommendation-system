package com.rrss.backend.service;

import com.rrss.backend.dto.AddPostRequest;
import com.rrss.backend.dto.PostDto;
import com.rrss.backend.exception.custom.TopicNotFoundException;
import com.rrss.backend.model.Post;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.PostRepository;
import com.rrss.backend.repository.TopicRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.security.Principal;

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
}

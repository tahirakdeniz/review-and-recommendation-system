package com.rrss.backend.service;

import com.rrss.backend.dto.AddTopicRequest;
import com.rrss.backend.dto.TopicDto;
import com.rrss.backend.exception.custom.ForumCategoryNotFoundException;
import com.rrss.backend.model.ForumCategory;
import com.rrss.backend.model.Post;
import com.rrss.backend.model.Topic;
import com.rrss.backend.model.User;
import com.rrss.backend.repository.ForumCategoryRepository;
import com.rrss.backend.repository.PostRepository;
import com.rrss.backend.repository.TopicRepository;
import com.rrss.backend.util.UserUtil;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
public class TopicService {

    private final TopicRepository repository;
    private final UserUtil userUtil;
    private final ForumCategoryRepository forumCategoryRepository;
    private final PostRepository postRepository;

    public TopicService(TopicRepository repository, UserUtil userUtil, ForumCategoryRepository forumCategoryRepository, PostRepository postRepository) {
        this.repository = repository;
        this.userUtil = userUtil;
        this.forumCategoryRepository = forumCategoryRepository;
        this.postRepository = postRepository;
    }

    public TopicDto addTopic(Principal currentUser, AddTopicRequest addTopicRequest) {
        User user = userUtil.extractUser(currentUser);

        Topic topic = new Topic(
                addTopicRequest.title(),
                user,
                forumCategoryRepository.findByName(addTopicRequest.categoryName())
                        .orElseThrow(() -> new ForumCategoryNotFoundException("Forum Category not found.")),
                addTopicRequest.isAnonymous()
        );

        var savedTopic = repository.save(topic);

        Post post = new Post(
                savedTopic,
                user,
                addTopicRequest.post(),
                addTopicRequest.isAnonymous()
        );

        var savedPost = postRepository.save(post);

        savedTopic.getPosts().add(savedPost);

        return TopicDto.convert(repository.save(savedTopic));
    }

    public List<TopicDto> getTopics(Long categoryId) {
        ForumCategory forumCategory = forumCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ForumCategoryNotFoundException("Forum Category not found."));

        return forumCategory
                .getTopics()
                .stream()
                .map(TopicDto::convert).toList();
    }
}

package com.rrss.backend.service;

import com.rrss.backend.dto.AddTopicRequest;
import com.rrss.backend.dto.TopicDto;
import com.rrss.backend.dto.UpdateTopicRequest;
import com.rrss.backend.exception.custom.ForumCategoryNotFoundException;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.exception.custom.TopicNotFoundException;
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
import java.util.Objects;

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

    public TopicDto updateTopic(Principal currentUser, Long topicId, UpdateTopicRequest updateTopicRequest) {
        User user = userUtil.extractUser(currentUser);

        Topic topic = repository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found"));

        if(!Objects.equals(user.getId(), topic.getCreatedBy().getId())) {
            throw new PermissionDeniedException("You are not the owner of this post.");
        }

        Topic newTopic = new Topic(
                topic.getId(),
                updateTopicRequest.title(),
                topic.getCreatedBy(),
                topic.getCreationDate(),
                topic.getPosts(),
                topic.getCategory(),
                updateTopicRequest.isAnonymous()
        );

        return TopicDto.convert(repository.save(newTopic));
    }

    public String deleteTopicByOwner(Principal currentUser, Long topicId) {
        User user = userUtil.extractUser(currentUser);

        Topic topic = repository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found."));

        if (!Objects.equals(user.getId(), topic.getCreatedBy().getId())) {
            throw new PermissionDeniedException("You are not the owner of this topic.");
        }

        repository.deleteById(topicId);

        return "Topic deleted successfully";

    }

    public String deleteTopic(Long topicId) {
        Topic topic = repository.findById(topicId)
                .orElseThrow(() -> new TopicNotFoundException("Topic not found."));
        repository.deleteById(topicId);
        return "Topic deleted successfully";
    }

}

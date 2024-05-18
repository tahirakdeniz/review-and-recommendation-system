package com.rrss.backend.controller;

import com.rrss.backend.dto.AddTopicRequest;
import com.rrss.backend.dto.TopicDto;
import com.rrss.backend.dto.UpdateTopicRequest;
import com.rrss.backend.service.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping
    public ResponseEntity<TopicDto> addTopic(Principal currentUser, @RequestBody AddTopicRequest addTopicRequest) {
        return new ResponseEntity<>(topicService.addTopic(currentUser,addTopicRequest), HttpStatus.CREATED);
    }

    @GetMapping("/get/{forum-category-id}")
    public ResponseEntity<List<TopicDto>> getTopics(@PathVariable("forum-category-id") Long categoryId) {
        return ResponseEntity.ok(topicService.getTopics(categoryId));
    }

    @PutMapping("/{topic-id}")
    public ResponseEntity<TopicDto> updateTopic(Principal currentUser, @PathVariable("topic-id") Long topicId, @RequestBody UpdateTopicRequest updateTopicRequest) {
        return ResponseEntity.ok(topicService.updateTopic(currentUser,topicId,updateTopicRequest));
    }

    @DeleteMapping("/{topic-id}")
    public ResponseEntity<String> deleteTopicByOwner(Principal currentUser,@PathVariable("topic-id") Long topicId) {
        return ResponseEntity.ok(topicService.deleteTopicByOwner(currentUser,topicId));
    }

    @DeleteMapping("/topic-id")
    @PreAuthorize("hasAnyAuthority('MANAGE_TOPIC')")
    public ResponseEntity<String> deleteTopic(@PathVariable("topic-id") Long topicId) {
        return ResponseEntity.ok(topicService.deleteTopic(topicId));
    }
}

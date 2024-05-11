package com.rrss.backend.controller;

import com.rrss.backend.dto.AddTopicRequest;
import com.rrss.backend.dto.TopicDto;
import com.rrss.backend.service.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

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

}

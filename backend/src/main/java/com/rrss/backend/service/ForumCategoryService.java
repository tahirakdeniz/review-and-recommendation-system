package com.rrss.backend.service;

import com.rrss.backend.dto.AddForumCategoryRequest;
import com.rrss.backend.dto.ForumCategoryDto;
import com.rrss.backend.enums.ForumCategoryHeader;
import com.rrss.backend.exception.custom.ForumCategoryNotFoundException;
import com.rrss.backend.exception.custom.PermissionDeniedException;
import com.rrss.backend.model.ForumCategory;
import com.rrss.backend.repository.ForumCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ForumCategoryService {

    private final ForumCategoryRepository repository;

    public ForumCategoryService(ForumCategoryRepository repository) {
        this.repository = repository;
    }


    public ForumCategoryDto addForumCategory(AddForumCategoryRequest addForumCategoryRequest) {

        ForumCategory forumCategory = new ForumCategory(
                addForumCategoryRequest.name(),
                addForumCategoryRequest.description(),
                addForumCategoryRequest.header()
        );
        
        return ForumCategoryDto.convert(repository.save(forumCategory));
    }

    public List<ForumCategoryDto> getForumCategories() {
        return repository.findAll()
                .stream()
                .map(ForumCategoryDto::convert)
                .toList();
    }

    public List<ForumCategoryDto> getForumCategoriesByHeader(ForumCategoryHeader forumCategoryHeader) {
        return repository.findAllByHeader(forumCategoryHeader)
                .stream()
                .map(ForumCategoryDto::convert)
                .toList();
    }

    public ForumCategoryDto updateForumCategory(AddForumCategoryRequest addForumCategoryRequest, Long forumCategoryId) {
        ForumCategory forumCategory = repository.findById(forumCategoryId)
                .orElseThrow(() -> new ForumCategoryNotFoundException("Forum Category not found."));

        ForumCategory newForumCategory = new ForumCategory(
                forumCategory.getId(),
                addForumCategoryRequest.name(),
                addForumCategoryRequest.description(),
                forumCategory.getTopics(),
                addForumCategoryRequest.header()
        );

        return ForumCategoryDto.convert(repository.save(newForumCategory));
    }

    public String deleteForumCategory(Long forumCategoryId) {
        ForumCategory forumCategory = repository.findById(forumCategoryId)
                .orElseThrow(() -> new ForumCategoryNotFoundException("Forum Category not found."));
        repository.deleteById(forumCategoryId);
        return "Forum Category deleted successfully";
    }

    public ForumCategoryDto getForumCategoryById(Long id) {
        return ForumCategoryDto.convert(
                repository.findById(id)
                        .orElseThrow(
                                () -> new ForumCategoryNotFoundException("Forum category not found.")
                        )
        );
    }
}

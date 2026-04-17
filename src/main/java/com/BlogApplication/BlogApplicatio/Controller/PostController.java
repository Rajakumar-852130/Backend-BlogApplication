package com.BlogApplication.BlogApplicatio.Controller;


import com.BlogApplication.BlogApplicatio.Model.Post;
import com.BlogApplication.BlogApplicatio.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/posts")
public class PostController {


    @Autowired
    private PostService service;


    @GetMapping
    public List<Post> getAll() {

        return service.getAll();
    }

    @GetMapping("/{id}")
    public Post getOne(@PathVariable Long id) {
        return service.grtById(id);

    }

    @PostMapping

    public Post create(@RequestBody Post post) {
        return service.create(post);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);


    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id,@RequestBody Post post) {
        return service.update(id, post);

    }

}
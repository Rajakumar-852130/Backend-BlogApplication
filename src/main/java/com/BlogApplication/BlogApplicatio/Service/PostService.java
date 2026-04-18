package com.BlogApplication.BlogApplicatio.Service;


import com.BlogApplication.BlogApplicatio.Model.Post;
import com.BlogApplication.BlogApplicatio.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {


    @Autowired
    private PostRepository repo ;

    public List<Post> getAll() {
        return repo.findAll();
    }


    public Post getById(Long id){
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
    }


    public Post create(Post post) {
        return repo.save(post);
    }


    public  void delete(Long id){
        repo.deleteById(id);
    }

    public Post update(Long id,Post post) {
        Post pre=repo.findById(id).orElseThrow();

        pre.setTitle(post.getTitle());
        pre.setContent(post.getContent());
        pre.setAuthor(post.getAuthor());
        pre.setCategory(post.getCategory());
        pre.setImageUrl(post.getImageUrl());

        return repo.save(pre);
    }

    public Post incrementLike(Long id) {
        Post post = repo.findById(id).orElseThrow();
        post.setLikes(post.getLikes() + 1);
        return repo.save(post);
    }

    public Post incrementView(Long id) {
        Post post = repo.findById(id).orElseThrow();
        post.setViews(post.getViews() + 1);
        return repo.save(post);
    }
}
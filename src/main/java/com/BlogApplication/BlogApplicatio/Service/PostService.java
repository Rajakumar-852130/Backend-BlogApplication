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


    public Post grtById(Long id){
        return repo.findById(id).orElse(null);

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

        return repo.save(pre);
}
}
package com.BlogApplication.BlogApplicatio.Service;

import com.BlogApplication.BlogApplicatio.Model.Comment;
import com.BlogApplication.BlogApplicatio.Model.Post;
import com.BlogApplication.BlogApplicatio.Repository.CommentRepository;
import com.BlogApplication.BlogApplicatio.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private PostRepository postRepo;

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepo.findByPostId(postId);
    }

    public Comment addComment(Long postId, Comment comment) {
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        comment.setPost(post);
        return commentRepo.save(comment);
    }

    public void deleteComment(Long id) {
        commentRepo.deleteById(id);
    }
}

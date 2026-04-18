package com.BlogApplication.BlogApplicatio.Controller;

import com.BlogApplication.BlogApplicatio.Model.Comment;
import com.BlogApplication.BlogApplicatio.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping("/post/{postId}")
    public Comment addComment(@PathVariable Long postId, @RequestBody Comment comment) {
        return commentService.addComment(postId, comment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }
}

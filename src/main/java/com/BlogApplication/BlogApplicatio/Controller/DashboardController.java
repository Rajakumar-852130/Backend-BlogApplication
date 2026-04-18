package com.BlogApplication.BlogApplicatio.Controller;

import com.BlogApplication.BlogApplicatio.Model.Post;
import com.BlogApplication.BlogApplicatio.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private PostService postService;

    @GetMapping
    public Map<String, Object> getStats() {
        List<Post> posts = postService.getAll();
        
        long totalPosts = posts.size();
        long totalLikes = posts.stream().mapToLong(Post::getLikes).sum();
        long totalViews = posts.stream().mapToLong(Post::getViews).sum();
        
        Set<String> uniqueAuthors = posts.stream()
                .map(Post::getAuthor)
                .filter(author -> author != null && !author.isEmpty())
                .collect(Collectors.toSet());
        
        long totalUsers = uniqueAuthors.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("totalLikes", totalLikes);
        stats.put("totalViews", totalViews);
        stats.put("totalUsers", totalUsers);
        
        // Also send top 3 posts by likes
        List<Post> topPosts = posts.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getLikes(), p1.getLikes()))
                .limit(3)
                .collect(Collectors.toList());
        
        stats.put("topPosts", topPosts);

        return stats;
    }
}

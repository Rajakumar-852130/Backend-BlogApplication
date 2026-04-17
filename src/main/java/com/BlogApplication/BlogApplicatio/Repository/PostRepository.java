package com.BlogApplication.BlogApplicatio.Repository;

import com.BlogApplication.BlogApplicatio.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository  extends JpaRepository<Post,Long> {
}

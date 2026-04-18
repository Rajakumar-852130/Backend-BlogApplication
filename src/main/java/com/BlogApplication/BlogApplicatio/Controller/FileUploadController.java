package com.BlogApplication.BlogApplicatio.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file selected"));
        }

        try {
            // Create uploads directory if it doesn't exist
            Path path = Paths.get(UPLOAD_DIR);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = path.resolve(filename);
            
            // Save the file
            Files.copy(file.getInputStream(), filePath);

            // Return the direct URL
            String fileUrl = "http://localhost:8080/uploads/" + filename;
            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }
}

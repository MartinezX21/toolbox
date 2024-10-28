package com.kamvusoft.toolbox.controllers;

import com.kamvusoft.toolbox.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.nio.file.Path;

@Controller
@RequestMapping(value = "/files")
public class FileStorageController {
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws Exception {
        Resource file = fileStorageService.loadAsResource(filename);

        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @GetMapping("/pdf/{id}")
    @ResponseBody
    public ResponseEntity<Resource> getDocumentFile(@PathVariable("id") String documentId) throws Exception {
        Path filePath = fileStorageService.resolveFilePath(documentId);
        Resource file = fileStorageService.loadAsResource(filePath.getFileName().toString());

        if (file == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }
}

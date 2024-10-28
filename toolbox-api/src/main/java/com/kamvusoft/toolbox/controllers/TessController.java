package com.kamvusoft.toolbox.controllers;

import com.kamvusoft.toolbox.service.TessService;
import com.kamvusoft.toolbox.utils.Lang;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(value = "/img-processing")
public class TessController {
    @Autowired
    private TessService tessService;

    @PostMapping("/extract-text")
    public String extractText(
            @RequestParam("image") MultipartFile image,
            @RequestParam("lang") Lang lang) throws Exception {
        return tessService.extractTextFromImage(image, lang);
    }
}

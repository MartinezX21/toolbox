package com.kamvusoft.toolbox.controllers;

import com.kamvusoft.toolbox.model.PdfDocument;
import com.kamvusoft.toolbox.service.FileStorageService;
import com.kamvusoft.toolbox.service.PdfManipulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = "/pdf/manipulate")
public class PdfManipulationController {
    @Autowired
    private PdfManipulationService pdfManipulationService;
    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/pages")
    public PdfDocument getPages(@RequestParam("file") MultipartFile file) throws Exception {
        return pdfManipulationService.parseDocument(file);
    }

    @PostMapping("/split/{id}/{filename}")
    public List<PdfDocument> split(
            @PathVariable("id") String documentId,
            @PathVariable("filename") String filename,
            @RequestParam("points") List<Integer> splitPoints) throws Exception {
        return pdfManipulationService.splitDocument(documentId, filename, splitPoints);
    }

    @PostMapping("/merge")
    public PdfDocument merge(@RequestParam("document_ids") List<String> documentIds) throws Exception {
        List<File> fileList = new ArrayList<>();
        for (var id: documentIds) {
            fileList.add(fileStorageService.load(id));
        }
        return pdfManipulationService.merge(fileList);
    }

    @PostMapping("/remove-pages/{id}/{filename}")
    public PdfDocument removePages(
            @PathVariable("id") String documentId,
            @PathVariable("filename") String filename,
            @RequestParam("page_numbers") List<Integer> pageNumbers) throws Exception {
        return pdfManipulationService.removePages(documentId, filename, pageNumbers);
    }

    @PostMapping("/extract-pages/{id}/{filename}")
    public PdfDocument extractPages(
            @PathVariable("id") String documentId,
            @PathVariable("filename") String filename,
            @RequestParam("page_numbers") List<Integer> pageNumbers) throws Exception {
        return pdfManipulationService.extractPages(documentId, filename, pageNumbers);
    }
}

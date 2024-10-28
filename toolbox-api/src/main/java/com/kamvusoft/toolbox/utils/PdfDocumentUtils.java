package com.kamvusoft.toolbox.utils;

import com.kamvusoft.toolbox.model.PdfDocument;
import com.kamvusoft.toolbox.model.PdfPage;
import com.kamvusoft.toolbox.service.FileStorageService;
import jakarta.annotation.Nullable;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class PdfDocumentUtils {
    public static String getBaseName(@Nullable String filename) {
        if(filename == null) {
            return null;
        }
        return filename.substring(0, filename.lastIndexOf("."));
    }

    public static PdfDocument parse(PDDocument pdf, String documentId, String filename, FileStorageService fileStorageService) throws Exception {
        try {
            var document = new PdfDocument();
            document.setId(documentId);
            PDFRenderer renderer = new PDFRenderer(pdf);
            PdfPage page;
            for (int i = 0; i < pdf.getNumberOfPages(); i++) {
                BufferedImage image = null;
                image = renderer.renderImage(i);
                File imgFile = fileStorageService.storeImage(image);
                page = new PdfPage(i, imgFile.getName());
                document.addPage(page);
            }
            document.setFilename(filename);
            document.setFirstPageIndex(0);
            document.setLastPageIndex(pdf.getNumberOfPages() - 1);
            return document;
        } catch (Exception e) {
            throw new Exception("Error parsing the document: " + documentId , e);
        }
    }

    public static PdfDocument removePages(PDDocument pdf, List<Integer> pageNumbers, String targetFilename, FileStorageService fileStorageService) throws Exception {
        List<Integer> sortedPageNumbers = pageNumbers.stream()
                .sorted((x, y) -> y - x)
                .toList();
        for(var pageNumber: sortedPageNumbers) {
            pdf.removePage(pageNumber);
        }
        File file = fileStorageService.createTempFile(".pdf").toFile();
        try {
            pdf.save(file.getAbsolutePath());
        } catch (IOException e) {
            throw new Exception("Error while saving the file", e);
        }
        String id = PdfDocumentUtils.getBaseName(file.getName());
        return PdfDocumentUtils.parse(pdf, id, targetFilename, fileStorageService);
    }
}

package com.kamvusoft.toolbox.service;

import com.kamvusoft.toolbox.model.PdfDocument;
import com.kamvusoft.toolbox.utils.PdfDocumentUtils;
import com.kamvusoft.toolbox.utils.PdfSplitter;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessStreamCache;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class PdfManipulationService {
    @Autowired
    private FileStorageService fileStorageService;

    public PdfDocument parseDocument(MultipartFile file) throws Exception {
        String documentId = fileStorageService.storePdf(file);
        File pdfFile = fileStorageService.load(documentId);
        try (PDDocument pdf = Loader.loadPDF(pdfFile)) {
            var document = PdfDocumentUtils.parse(pdf, documentId, PdfDocumentUtils.getBaseName(file.getOriginalFilename()), fileStorageService);
            pdf.close();
            return document;
        } catch (Exception e) {
            throw new Exception("Could not load the document: " + documentId);
        }

    }

    public List<PdfDocument> splitDocument(String documentId, String filename, List<Integer> splitPoints) throws Exception {
        File pdfFile = fileStorageService.load(documentId);
        try (PDDocument pdf = Loader.loadPDF(pdfFile)) {
            List<PdfDocument> output = new ArrayList<>();
            PdfSplitter splitter = new PdfSplitter(splitPoints);
            List<PDDocument> pages = splitter.split(pdf);
            Iterator<PDDocument> iterator = pages.listIterator();
            int i = 1;
            while(iterator.hasNext()) {
                PDDocument pd = iterator.next();
                File file = fileStorageService.createTempFile(".pdf").toFile();
                pd.save(file.getAbsolutePath());
                String id = PdfDocumentUtils.getBaseName(file.getName());
                String name = filename + " " + (i++);
                output.add(PdfDocumentUtils.parse(pd, id, name, fileStorageService));
            }
            pdf.close();
            return output;
        } catch (Exception e) {
            throw new Exception("Could not load the document: " + documentId);
        }
    }

    public PdfDocument merge(List<File> files) throws Exception {
        Path destinationPath = fileStorageService.createTempFile(FileStorageService.PDF_FILE_EXTENSION);
        PDFMergerUtility pdfMerger = new PDFMergerUtility();
        pdfMerger.setDestinationFileName(destinationPath.toString());
        for (var file: files) {
            try {
                pdfMerger.addSource(file);
            } catch (FileNotFoundException e) {
                throw new Exception("File not found", e);
            }
        }
        try {
            pdfMerger.mergeDocuments(null);
        } catch (IOException e) {
            throw new Exception("Error while merging the files", e);
        }
        String documentId = PdfDocumentUtils.getBaseName(destinationPath.getFileName().toString());
        try (PDDocument pdf = Loader.loadPDF(destinationPath.toFile())) {
            return  PdfDocumentUtils.parse(pdf, documentId, String.format("Merged %s files", files.size()), fileStorageService);
        } catch (Exception e) {
            throw new Exception("Could not load the document: " + documentId);
        }
    }

    public PdfDocument removePages(String documentId, String filename, List<Integer> pageNumbers) throws Exception {
        File pdfFile = fileStorageService.load(documentId);
        try (PDDocument pdf = Loader.loadPDF(pdfFile)) {
            String name = String.format("%s - removed %s page(s)", filename, pageNumbers.size());
            PdfDocument output = PdfDocumentUtils.removePages(pdf, pageNumbers, name, fileStorageService);
            pdf.close();
            return output;
        } catch (Exception e) {
            throw new Exception("Could not load the document: " + documentId);
        }
    }

    public PdfDocument extractPages(String documentId, String filename, List<Integer> pageNumbers) throws Exception {
        File pdfFile = fileStorageService.load(documentId);
        try (PDDocument pdf = Loader.loadPDF(pdfFile)) {
            List<Integer> pagesToRemove = new ArrayList<>();
            for (int p = 0; p < pdf.getNumberOfPages(); p++) {
                if(!pageNumbers.contains(p)) {
                    pagesToRemove.add(p);
                }
            }
            String name = String.format("%s - extracted %s page(s)", filename, pageNumbers.size());
            PdfDocument output = PdfDocumentUtils.removePages(pdf, pagesToRemove, name, fileStorageService);
            pdf.close();
            return output;
        } catch (Exception e) {
            throw new Exception("Could not load the document: " + documentId);
        }
    }
}

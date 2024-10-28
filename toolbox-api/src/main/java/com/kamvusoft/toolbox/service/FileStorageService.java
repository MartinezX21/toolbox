package com.kamvusoft.toolbox.service;

import com.kamvusoft.toolbox.utils.PdfDocumentUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class FileStorageService {
    public static final String TMP_DIR_PREFIX = "toolbox_";
    public static final String TMP_FILE_PREFIX = "tb_";
    public static final String PDF_FILE_EXTENSION = ".pdf";

    private static Path tempDir;

    public String storePdf(MultipartFile file) throws Exception {
        Path path;
        try {
            path = this.createTempFile(PDF_FILE_EXTENSION);
            file.transferTo(path);
        } catch (Exception e) {
            throw new Exception("Failed to store the file", e);
        }
        return PdfDocumentUtils.getBaseName(path.getFileName().toString());
    }

    public File storeImage(BufferedImage image) throws Exception {
        File imgFile;
        try {
            imgFile = this.createTempFile(".jpg").toFile();
            ImageIO.write(image, "JPEG", imgFile);
        } catch (Exception e) {
            throw new Exception("Failed to store the image", e);
        }
        return imgFile;
    }

    public File load(String baseName) throws Exception {
        File file = this.resolveFilePath(baseName).toFile();
        if(!file.isFile()) {
            throw new Exception("File not found");
        }
        return file;
    }

    public Resource loadAsResource(String filename) throws Exception {
        Path file = getTempDir().resolve(filename);
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            }
            else {
                throw new Exception("Could not read file: " + filename);
            }
        }
        catch (MalformedURLException e) {
            throw new Exception("Could not read file: " + filename, e);
        }
    }

    public Path resolveFilePath(String baseName) throws Exception {
        return getTempDir().resolve(baseName + PDF_FILE_EXTENSION);
    }

    public Path createTempFile(String extension) throws Exception {
        try {
            return  Files.createTempFile(getTempDir(), TMP_FILE_PREFIX, extension);
        } catch (IOException e) {
            throw new Exception("Failed to create the file", e);
        }
    }

    private static Path getTempDir() throws Exception {
        if(tempDir == null) {
            try {
                tempDir = Files.createTempDirectory(TMP_DIR_PREFIX);
            } catch (IOException e) {
                throw new Exception("Error when creating the temp dir", e);
            }
        }
        return tempDir;
    }
}

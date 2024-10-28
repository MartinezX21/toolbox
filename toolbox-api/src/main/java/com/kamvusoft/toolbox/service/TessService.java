package com.kamvusoft.toolbox.service;

import com.kamvusoft.toolbox.utils.Lang;
import net.sourceforge.tess4j.ITessAPI;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@Service
public class TessService {
    @Autowired
    ResourceLoader resourceLoader;

    public String extractTextFromImage(MultipartFile file, Lang lang) throws Exception {
        Resource tessData = resourceLoader.getResource("classpath:tessdata");
        Tesseract tesseract = new Tesseract();
        tesseract.setLanguage(lang.name());
        tesseract.setOcrEngineMode(ITessAPI.TessOcrEngineMode.OEM_TESSERACT_LSTM_COMBINED);

        try {
            tesseract.setDatapath(tessData.getFile().getAbsolutePath());
            BufferedImage image = ImageIO.read(file.getInputStream());
            return tesseract.doOCR(image);
        } catch (Exception e) {
            throw new Exception("Error while processing the image", e);
        }
    }
}

package com.kamvusoft.toolbox.utils;

import org.apache.pdfbox.multipdf.Splitter;

import java.util.List;

public class PdfSplitter extends Splitter {
    List<Integer> splitPoints;

    public PdfSplitter(List<Integer> splitPoints) {
        this.splitPoints = splitPoints;
    }

    @Override
    public boolean splitAtPage(int pageNumber) {
        return splitPoints.contains(pageNumber);
    }
}

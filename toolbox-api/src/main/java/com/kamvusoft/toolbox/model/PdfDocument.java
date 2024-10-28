package com.kamvusoft.toolbox.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PdfDocument {
    private String id;
    private String filename;
    private int firstPageIndex;
    private int lastPageIndex;
    private List<PdfPage> pages;

    public void addPage(PdfPage page) {
        if(pages == null) {
            pages = new ArrayList<>();
        }
        pages.add(page);
    }
}

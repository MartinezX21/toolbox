package com.kamvusoft.toolbox.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PdfPage {
    private int pageIndex;
    private String previewImage;
}

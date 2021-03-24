package com.entity.wrapper;

import com.entity.Colors;
import com.entity.Products;
import lombok.Data;

import java.util.List;

@Data
public class RequestWrapper {
    private Products product;
    private List<Colors> colors;
}

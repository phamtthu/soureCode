package com.service;

import com.entity.Colors;

import java.util.List;


public interface ColorsService {
    void save(Colors color);
    List<Colors> findAllByProduct_ProductID(int productID);
    void deleteByID(int colorID);
}

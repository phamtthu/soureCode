package com.service;

import com.entity.Products;

import java.util.List;

public interface ProductsService {
    void save(Products product);
    List<Products> getProducts();
    void deleteProduct(int productID);
    Products findByProductID(int productID);
}

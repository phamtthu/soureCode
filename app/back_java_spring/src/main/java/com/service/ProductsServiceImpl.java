package com.service;

import com.entity.Products;
import com.entity.repository.ProductsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductsServiceImpl implements ProductsService {
    private final ProductsRepository productsRepository;

    public ProductsServiceImpl(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
    }

    @Override
    public void save(Products product) {
        productsRepository.save(product);
    }

    @Override
    public List<Products> getProducts() {
        return productsRepository.findAll();
    }

    @Override
    public void deleteProduct(int productID) {
        productsRepository.deleteById(productID);
    }

    @Override
    public Products findByProductID(int productID) {
        return productsRepository.findByProductID(productID);
    }

}

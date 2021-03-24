package com.rest;

import com.entity.Colors;
import com.entity.Products;
import com.service.ColorsService;
import com.service.ProductsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:3000")
public class RESTController {
    private final ProductsService productsService;
    private final ColorsService colorsService;

    public RESTController(ProductsService productsService, ColorsService colorsService) {
        this.productsService = productsService;
        this.colorsService = colorsService;
    }

    @GetMapping("/products")
    public List<Products> getProducts() {
        return productsService.getProducts();
    }

    @PostMapping("/product") // JSON - > POJO
    public Products createAProduct(@RequestBody Products product) {
        // Everything in Product is OK to save, now just continue to handle with Color (inside Product Class)
        productsService.save(product); // Saving product -> saving color (cascade)
        return product;
    }

    @PutMapping("/product")
    public void updateProduct(@RequestBody Products clientProduct) {
        Products databaseProduct = productsService.findByProductID(clientProduct.getProductID());
        databaseProduct.getColorsList().clear();
        for (Colors color : colorsService.findAllByProduct_ProductID(clientProduct.getProductID())) {
            colorsService.deleteByID(color.getId());
        }
        databaseProduct.setProductName(clientProduct.getProductName());
        databaseProduct.setColorsList(clientProduct.getColorsList());
        productsService.save(databaseProduct);
    }

    @DeleteMapping("/product")
    public void deleteProduct(@RequestBody Products product) {
        productsService.deleteProduct(product.getProductID());
    }


}

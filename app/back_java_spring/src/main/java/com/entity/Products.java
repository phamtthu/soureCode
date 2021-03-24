package com.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productID;
    private String productName;
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference
    List<Colors> colorsList;

    public void setColorsList(List<Colors> colorsList) {
        for (Colors color : colorsList) {
            color.setProduct(this);
        }
        this.colorsList = colorsList;
    }
    public void addColor(Colors color) {
        if (colorsList == null)
            colorsList = new ArrayList<>();
        colorsList.add(color);
        color.setProduct(this);
    }
}

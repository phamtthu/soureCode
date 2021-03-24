package com.service;

import com.entity.Colors;
import com.entity.repository.ColorsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ColorServiceImpl implements ColorsService {
    private final ColorsRepository colorsRepository;

    public ColorServiceImpl(ColorsRepository colorsRepository) {
        this.colorsRepository = colorsRepository;
    }

    @Override
    public void save(Colors color) {
        colorsRepository.save(color);
    }

    @Override
    public List<Colors> findAllByProduct_ProductID(int productID) {
        return colorsRepository.findAllByProduct_ProductID(productID);
    }

    @Override
    public void deleteByID(int colorID) {
        colorsRepository.deleteById(colorID);
    }
}

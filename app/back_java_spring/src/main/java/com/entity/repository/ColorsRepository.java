package com.entity.repository;

import com.entity.Colors;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ColorsRepository extends JpaRepository<Colors, Integer> {
    List<Colors> findAllByProduct_ProductID(int productID);

    void deleteById(int colorID);
}

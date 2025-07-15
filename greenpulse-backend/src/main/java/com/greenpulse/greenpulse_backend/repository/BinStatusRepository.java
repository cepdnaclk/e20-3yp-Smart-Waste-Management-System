package com.greenpulse.greenpulse_backend.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.greenpulse.greenpulse_backend.model.BinInventory;
import com.greenpulse.greenpulse_backend.model.BinStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BinStatusRepository extends JpaRepository<BinStatus, String> {
    String bin(BinInventory bin);

    Optional<BinStatus> findByBinId(String binId);

//    List<BinStatus> findByLastEmptiedAtBetween(LocalDateTime now, LocalDateTime lastEmptiedAt);
//    List<BinStatus> findByFillLevelGreaterThan(int fillLevel);

    @Query("SELECT b FROM BinStatus b WHERE (b.plasticLevel > :level OR b.paperLevel > :level OR b.glassLevel > :level)")
    List<BinStatus> findBinsWithHighFillLevel(
            @Param("level") Long level
    );

    List<BinStatus> findByPlasticLevelGreaterThanEqual(Long threshold);
    List<BinStatus> findByPaperLevelGreaterThanEqual(Long threshold);
    List<BinStatus> findByGlassLevelGreaterThanEqual(Long threshold);

    // Query to find bins not emptied for a certain period
    @Query("SELECT b FROM BinStatus b WHERE b.lastEmptiedAt < :date OR b.lastEmptiedAt IS NULL")
    List<BinStatus> findBinsNotEmptiedSince(@Param("date") LocalDateTime date);



}

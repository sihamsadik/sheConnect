package com.platform.SheConnect.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platform.SheConnect.entity.InvestorInterested;

public interface InvestorInterestRepository extends JpaRepository<InvestorInterested, Long> {
    Optional<InvestorInterested> findByInvestorIdAndStartUpIdeaId(Long investorId, Long startUpIdeaId);
    void deleteByInvestorIdAndStartUpIdeaId(Long investorId, Long startUpIdeaId);
    List<InvestorInterested> findAllByInvestorId(Long investorId);//use this as a short listed
    long  countByStartUpIdeaId(Long startUpIdeaId);
    long countByInvestorId(Long investorId);
    List<InvestorInterested> findAllByStartUpIdeaId(Long startUpIdeaId);//for entrepreneur feature
}
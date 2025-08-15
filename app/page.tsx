"use client";

import React, { useMemo, useState, useEffect } from "react";
import { allArticles, mockOverallData } from "../data/mockData";
import { UserDisposition } from "../types";
import Article from "@/components/Article";
import EmailDrawer from "@/components/EmailDrawer";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type StatusCounts = {
  fulfilled: number;
  bookmarked: number;
  notCompliant: number;
  notApplicable: number;
  total: number;
  totalDispositioned: number;
};

function computeGlobalCounts(): StatusCounts {
  const counts: StatusCounts = {
    fulfilled: 0,
    bookmarked: 0,
    notCompliant: 0,
    notApplicable: 0,
    total: 0,
    totalDispositioned: 0,
  };
  allArticles.forEach((article) => {
    article.requirements.forEach((req) => {
      req.productReviews.forEach((review) => {
        counts.total++;
        switch (review.userReview.status) {
          case UserDisposition.FULFILLED:
            counts.fulfilled++;
            break;
          case UserDisposition.BOOKMARKED:
            counts.bookmarked++;
            break;
          case UserDisposition.NOT_COMPLIANT:
            counts.notCompliant++;
            break;
          case UserDisposition.NOT_APPLICABLE:
            counts.notApplicable++;
            break;
        }
      });
    });
  });
  counts.totalDispositioned =
    counts.fulfilled +
    counts.bookmarked +
    counts.notCompliant +
    counts.notApplicable;
  return counts;
}

export default function Home() {
  const globalCounts = useMemo(() => computeGlobalCounts(), []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate total issues for badge - removed unused variable
  useMemo(() => {
    let count = 0;
    allArticles.forEach((article) => {
      article.requirements.forEach((req) => {
        req.productReviews.forEach((review) => {
          if (
            review.bixbyReview.status === "UNCLEAR" ||
            review.bixbyReview.status === "NOT_COMPLIANT" ||
            review.userReview.status === UserDisposition.BOOKMARKED ||
            review.userReview.status === UserDisposition.NOT_COMPLIANT
          ) {
            count++;
          }
        });
      });
    });
    return count;
  }, []);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      // Check if escape key was pressed
      if (event.key === "Escape") {
        // Check if any input or textarea is currently focused (editing)
        const activeElement = document.activeElement;
        const isEditing =
          activeElement?.tagName === "TEXTAREA" ||
          activeElement?.tagName === "INPUT";

        // Only close drawer if it's open and not editing
        if (isDrawerOpen && !isEditing) {
          setIsDrawerOpen(false);
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDrawerOpen]);

  // Fixed drawer width since items panel is always visible
  const drawerWidth = 800;

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <motion.div
        className="flex-1 min-w-0 overflow-y-auto"
        animate={{
          marginRight: isDrawerOpen ? `${drawerWidth}px` : "0px",
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 350,
        }}
      >
        {/* Thin header bar to match app chrome */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {mockOverallData.projectTitle}
              </h1>

              <div className="flex items-center gap-3">
                {/* Review Progress */}
                <div className="bg-blue-50 rounded-xl px-3 py-2 shadow-sm border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-64">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[13px] font-semibold text-black leading-[18px] tracking-[-0.08px]">
                          Review Progress
                        </span>
                        <span className="text-[11px] font-semibold text-black/70 leading-[13px] tracking-[0.07px]">
                          {globalCounts.totalDispositioned}/{globalCounts.total}
                        </span>
                      </div>
                      <div className="w-64 bg-black/8 rounded-lg h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-2xl shadow-inner"
                          style={{
                            width: `${
                              (globalCounts.totalDispositioned /
                                globalCounts.total) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-[13px] leading-[18px] tracking-[-0.08px] transition-colors duration-200 whitespace-nowrap">
                      Resume
                    </button>
                  </div>
                </div>

                {/* Email Button with smooth hide animation */}
                <AnimatePresence mode="popLayout">
                  {!isDrawerOpen && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                      onClick={() => setIsDrawerOpen(true)}
                      className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-xl cursor-pointer text-[13px] leading-[18px] tracking-[-0.08px] transition-all duration-200 whitespace-nowrap flex items-center gap-2 border border-gray-200 shadow-xs h-14"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Compose AI Email</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Two-column area */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            {/* Left card: Spec + Submittal */}
            <div className="flex-1 min-w-0 bg-white border border-black/4 rounded-xl shadow-sm">
              <div className="p-3">
                <div className="mb-2">
                  <h3 className="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.41px] mb-px">
                    Spec Summary
                  </h3>
                  <div className="text-[12px] text-black/40 leading-[16px] truncate">
                    {mockOverallData.specSummary.fileName}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-black/4">
                  <div className="text-[13px] text-black/80 leading-[18px] tracking-[-0.08px] space-y-2">
                    <p>{mockOverallData.specSummary.description}</p>
                    <p>{mockOverallData.specSummary.productsDescription}</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-black/8"></div>
              <div className="p-3">
                <div className="mb-2">
                  <h3 className="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.41px] mb-px">
                    Submittal Summary
                  </h3>
                  <div className="text-[12px] text-black/40 leading-[16px] truncate">
                    {mockOverallData.submittalSummary.fileName}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-black/4">
                  <div className="text-[13px] text-black/80 leading-[18px] tracking-[-0.08px] space-y-2">
                    <p>{mockOverallData.submittalSummary.description}</p>
                    <p>{mockOverallData.submittalSummary.subcontractor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right card: tiles + assessment */}
            <div className="flex-1 min-w-0 bg-white border border-black/4 rounded-xl shadow-sm">
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-green-50 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-green-700">
                      Fulfilled
                    </span>
                    <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                      <span className="text-[11px] font-semibold text-green-700">
                        {globalCounts.fulfilled}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-gray-700">
                      Not Applicable
                    </span>
                    <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                      <span className="text-[11px] font-semibold text-gray-700">
                        {globalCounts.notApplicable}
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-yellow-700">
                      Bookmarked
                    </span>
                    <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                      <span className="text-[11px] font-semibold text-yellow-700">
                        {globalCounts.bookmarked}
                      </span>
                    </div>
                  </div>
                  <div className="bg-red-50 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-red-700">
                      Not Compliant
                    </span>
                    <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                      <span className="text-[11px] font-semibold text-red-700">
                        {globalCounts.notCompliant}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px bg-black/8"></div>
              <div className="p-3">
                <div className="mb-2">
                  <h3 className="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.41px] mb-px">
                    AI Assessment
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-black/4">
                  <div className="text-[13px] text-black/80 leading-[18px] tracking-[-0.08px]">
                    {mockOverallData.bixbyAssessment.summary}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles section */}
          <div className="space-y-3">
            {allArticles.map((article) => {
              // Calculate stats for this article
              const productCount = new Set(
                article.requirements.flatMap((req) =>
                  req.productReviews.map((review) => review.productId)
                )
              ).size;

              const totalReviews = article.requirements.reduce(
                (acc, req) => acc + req.productReviews.length,
                0
              );

              const reviewedCount = article.requirements.reduce(
                (acc, req) =>
                  acc +
                  req.productReviews.filter(
                    (review) => review.userReview.status !== null
                  ).length,
                0
              );

              return (
                <Article
                  key={article.articleDetails.articleNumber}
                  article={article}
                  productCount={productCount}
                  reviewed={reviewedCount}
                  total={totalReviews}
                  onOpenEmailDrawer={() => setIsDrawerOpen(true)}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Email Composer Sidebar - Fixed position with animation */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              x: {
                type: "spring",
                damping: 35,
                stiffness: 350,
              },
              opacity: {
                duration: 0.3,
              },
            }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: drawerWidth,
              zIndex: 50,
            }}
          >
            <EmailDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

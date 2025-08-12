"use client";

import React, { useState } from "react";
import { Article as ArticleType, BixbyPOVDisposition } from "../types";
import { Box, ListCheck, ChevronDown, CircleHelp, Flag } from "lucide-react";
import ReviewRow from "./ReviewRow";

interface ArticleProps {
  article: ArticleType;
  productCount: number;
  reviewed: number;
  total: number;
}

export default function Article({
  article,
  productCount,
  reviewed,
  total
}: ArticleProps) {
  const [open, setOpen] = useState(false);

  // Count Bixby status indicators for the light indicators
  const getBixbyStatusCounts = () => {
    let unclearCount = 0;
    let notCompliantCount = 0;

    article.requirements.forEach(req => {
      req.productReviews.forEach(review => {
        switch (review.bixbyReview.status) {
          case BixbyPOVDisposition.UNCLEAR:
            unclearCount++;
            break;
          case BixbyPOVDisposition.NOT_COMPLIANT:
            notCompliantCount++;
            break;
        }
      });
    });

    return { unclearCount, notCompliantCount };
  };

  const bixbyStatusCounts = getBixbyStatusCounts();
  const requirementCount = article.requirements.length;

  return (
    <div className="bg-white border border-black/4 rounded-xl shadow-sm mb-2">
      <div className="p-3 cursor-pointer" onClick={() => setOpen(p => !p)}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex flex-col gap-0.5">
              <div className="text-lg font-semibold text-black leading-[22px] tracking-[-0.24px]">
                {article.articleDetails.text}
              </div>
              <div className="flex items-start gap-3">
                <div className="text-black/80 flex items-center gap-1">
                  <span className="text-black/50">
                    <Box className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[13px] leading-[18px]">
                    {productCount} products
                  </span>
                </div>
                <div className="text-black/80 flex items-center gap-">
                  <ListCheck className="w-3.5 h-3.5" />
                  <span className="text-[13px] leading-[18px]">
                    {requirementCount} requirements
                  </span>
                </div>
                {/* Light Bixby indicators to mimic Summary visuals */}
                {bixbyStatusCounts.unclearCount > 0 && (
                  <div className="flex items-center gap-1">
                    <CircleHelp className="w-4 h-4 mr-1 text-yellow-500" />
                    <span className="text-[13px] leading-[18px] text-yellow-500">
                      {bixbyStatusCounts.unclearCount}
                    </span>
                  </div>
                )}
                {bixbyStatusCounts.notCompliantCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4 mr-1 text-red-600" />
                    <span className="text-[13px] leading-[18px] text-red-600">
                      {bixbyStatusCounts.notCompliantCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-8 rounded-lg px-2.5 py-0 flex items-center gap-1.5 border border-black/4 shadow-sm bg-gray-50 text-gray-700">
              <span className="text-[13px] font-semibold leading-[18px] tracking-[-0.08px]">
                {reviewed}/{total} Reviewed
              </span>
            </button>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>
      {open && (
        <div className="border-t border-black/8 px-3 py-2">
          <div className="space-y-1">
            {article.requirements.map((r, i) => (
              <ReviewRow key={i} requirement={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import {
  manufacturersArticle,
  windDrivenRainArticle,
  standardBladeArticle,
  materialsArticle,
  allArticles,
  mockOverallData
} from "../data/mockData";
import { UserDisposition } from "../types";
import Article from "../components/Article";

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
    totalDispositioned: 0
  };
  allArticles.forEach(article => {
    article.requirements.forEach(req => {
      req.productReviews.forEach(review => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Thin header bar to match app chrome */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {mockOverallData.projectTitle}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top row copied from SummaryAnalysisSummary formatting */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <h2 className="text-xl font-bold text-black mb-1">
              {mockOverallData.projectTitle}
            </h2>
          </div>
          <div className="bg-blue-50 rounded-xl px-3 py-2 shadow-sm border border-black/5 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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
                        (globalCounts.totalDispositioned / globalCounts.total) *
                        100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-[13px] leading-[18px] tracking-[-0.08px] transition-colors duration-200 whitespace-nowrap">
                Resume
              </button>
            </div>
          </div>
        </div>

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
                <div className="bg-red-50 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-red-600">
                    Non-Compliant
                  </span>
                  <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                    <span className="text-[11px] font-semibold text-red-600">
                      {globalCounts.notCompliant}
                    </span>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg px-2 py-1 h-[34px] flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-orange-700">
                    Bookmarked
                  </span>
                  <div className="bg-white rounded-full border border-black/4 min-w-[17px] px-1 py-0.5 text-center">
                    <span className="text-[11px] font-semibold text-orange-700">
                      {globalCounts.bookmarked}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-px bg-black/8"></div>
            <div className="bg-white p-3">
              <div className="mb-2">
                <div className="flex items-center gap-1">
                  <h3 className="text-[17px] font-semibold text-black leading-[22px] tracking-[-0.41px]">
                    Bixby Assessment
                  </h3>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg border border-black/4">
                <div className="p-2">
                  <div className="space-y-3">
                    {mockOverallData.bixbyAssessment.details.map((d, i) => (
                      <p
                        key={i}
                        className="text-[13px] text-black/80 leading-[1.8] pl-1"
                      >
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products section */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-black leading-[25px] tracking-[-0.4px] mb-3">
            Part 2 - Products
          </h2>
          <div className="space-y-2">
            <Article
              article={manufacturersArticle}
              productCount={2}
              reviewed={0}
              total={1}
            />
            <Article
              article={windDrivenRainArticle}
              productCount={1}
              reviewed={4}
              total={17}
            />
            <Article
              article={standardBladeArticle}
              productCount={1}
              reviewed={0}
              total={17}
            />
            <Article
              article={materialsArticle}
              productCount={2}
              reviewed={0}
              total={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

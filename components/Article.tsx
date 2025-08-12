"use client";

import React, { useState } from "react";
import {
  Article as ArticleType,
  BixbyPOVDisposition,
  RequirementItemType,
  UserDisposition
} from "../types";
import {
  Box,
  ListCheck,
  ChevronDown,
  CircleHelp,
  Flag,
  Check,
  X,
  BookmarkIcon
} from "lucide-react";

// Inline copy of UserDispositionIcon
function UserDispositionIcon({ status }: { status: UserDisposition }) {
  if (status === UserDisposition.NOT_COMPLIANT) {
    return (
      <div>
        <X className="w-4 h-4" />
      </div>
    );
  }

  if (status === UserDisposition.NOT_APPLICABLE) {
    return (
      <div className="w-4 h-4 flex items-center justify-center">
        <span className="text-[8.67px] font-semibold leading-normal">NA</span>
      </div>
    );
  }

  if (status === UserDisposition.FULFILLED) {
    return (
      <div>
        <Check className="w-4 h-4" />
      </div>
    );
  }

  if (status === UserDisposition.BOOKMARKED) {
    return (
      <div>
        <BookmarkIcon className="w-4 h-4" />
      </div>
    );
  }

  return null;
}

interface ArticleProps {
  article: ArticleType;
  productCount: number;
  reviewed: number;
  total: number;
}

function ReviewRow({ requirement }: { requirement: RequirementItemType }) {
  const getUserStatus = (): UserDisposition | null => {
    // Priority: NOT_COMPLIANT > FULFILLED > NOT_APPLICABLE > BOOKMARKED
    let foundStatus: UserDisposition | null = null;

    for (const review of requirement.productReviews) {
      const status = review.userReview.status;
      if (!status) continue;
      if (status === UserDisposition.NOT_COMPLIANT) return status;
      if (
        status === UserDisposition.FULFILLED &&
        foundStatus !== UserDisposition.FULFILLED
      )
        foundStatus = status;
      if (status === UserDisposition.NOT_APPLICABLE && !foundStatus)
        foundStatus = status;
      if (status === UserDisposition.BOOKMARKED && !foundStatus)
        foundStatus = status;
    }

    return foundStatus;
  };

  const getUserStatusButton = () => {
    const status = getUserStatus();
    if (!status) return null;

    const statusConfig: Record<
      UserDisposition,
      { label: string; textColor: string; hoverColor: string }
    > = {
      [UserDisposition.FULFILLED]: {
        label: "Fulfilled",
        textColor: "text-green-600",
        hoverColor: "hover:text-green-700"
      },
      [UserDisposition.NOT_COMPLIANT]: {
        label: "Non-Compliant",
        textColor: "text-red-600",
        hoverColor: "hover:text-red-700"
      },
      [UserDisposition.NOT_APPLICABLE]: {
        label: "Not applicable",
        textColor: "text-gray-600",
        hoverColor: "hover:text-gray-700"
      },
      [UserDisposition.BOOKMARKED]: {
        label: "Bookmarked",
        textColor: "text-orange-700",
        hoverColor: "hover:text-orange-800"
      }
    };

    const cfg = statusConfig[status];
    return (
      <button
        className={`${cfg.textColor} ${cfg.hoverColor} text-[12px] font-semibold flex items-center gap-1`}
      >
        <UserDispositionIcon status={status} />
        {cfg.label}
      </button>
    );
  };

  // Check if any product reviews have UNCLEAR or NOT_COMPLIANT Bixby POV
  const hasUnclearOrNotCompliant = requirement.productReviews.some(
    review =>
      review.bixbyReview.status === BixbyPOVDisposition.UNCLEAR ||
      review.bixbyReview.status === BixbyPOVDisposition.NOT_COMPLIANT
  );

  // Get the first non-compliant status to determine which icon to show
  const getIconStatus = () => {
    for (const review of requirement.productReviews) {
      if (review.bixbyReview.status === BixbyPOVDisposition.NOT_COMPLIANT) {
        return BixbyPOVDisposition.NOT_COMPLIANT;
      }
      if (review.bixbyReview.status === BixbyPOVDisposition.UNCLEAR) {
        return BixbyPOVDisposition.UNCLEAR;
      }
    }
    return null;
  };

  const iconStatus = getIconStatus();

  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2">
        {hasUnclearOrNotCompliant &&
          iconStatus === BixbyPOVDisposition.UNCLEAR && (
            <CircleHelp className="w-4 h-4 text-yellow-500" />
          )}
        {hasUnclearOrNotCompliant &&
          iconStatus === BixbyPOVDisposition.NOT_COMPLIANT && (
            <Flag className="w-4 h-4 text-red-600" />
          )}
        <div className="text-[12px] text-black/80">
          {requirement.requirement.shortDescription}
        </div>
      </div>
      {getUserStatusButton() ?? (
        <button className="text-[12px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
          Review →
        </button>
      )}
    </div>
  );
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

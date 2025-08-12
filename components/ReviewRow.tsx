"use client";

import React from "react";
import {
  BixbyPOVDisposition,
  RequirementItemType,
  UserDisposition
} from "../types";
import { CircleHelp, Flag } from "lucide-react";
import UserDispositionIcon from "./UserDispositionIcon";

interface ReviewRowProps {
  requirement: RequirementItemType;
}

export default function ReviewRow({ requirement }: ReviewRowProps) {
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

"use client";

import React, { useState } from "react";
import {
  BixbyPOVDisposition,
  RequirementItemType,
  UserDisposition,
  Article as ArticleType,
} from "../types";
import { CircleHelp, Flag, Mail } from "lucide-react";
import UserDispositionIcon from "./UserDispositionIcon";
import { useEmail } from "@/contexts/EmailContext";
import { EmailItem } from "@/components/AddItemsPanel";
import { cn } from "@/lib/utils";

interface ReviewRowProps {
  requirement: RequirementItemType;
  article: ArticleType;
  onOpenEmailDrawer?: () => void;
}

export default function ReviewRow({
  requirement,
  article,
  onOpenEmailDrawer,
}: ReviewRowProps) {
  const { emailItems, setEmailItems } = useEmail();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleAddToEmail = () => {
    // Create email item from this requirement
    const emailItem: EmailItem = {
      id: `${article.articleDetails.articleNumber}-${requirement.id}`,
      articleName: article.articleDetails.text,
      articleNumber: article.articleDetails.articleNumber,
      requirementId: requirement.id,
      requirement: requirement.requirement.shortDescription,
      products: requirement.productReviews.map((review) => {
        // Get product name based on productId (temporary hardcoding like AddItemsPanel)
        const productName =
          review.productId === 123
            ? "EHH-501 Wind-Driven Rain Resistant Louver"
            : "ESD-435 Standard Blade Louver";

        return {
          productId: review.productId,
          productName,
          reviewId: review.id,
          status: review.bixbyReview.status,
          userStatus: review.userReview.status,
          note: review.userReview.bookmarkNote || "",
        };
      }),
    };

    // Check if item is already in email
    const isAlreadyAdded = emailItems.some((item) => item.id === emailItem.id);

    if (!isAlreadyAdded) {
      setEmailItems([...emailItems, emailItem]);
    }

    // Open the email drawer
    if (onOpenEmailDrawer) {
      onOpenEmailDrawer();
    }
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
        hoverColor: "hover:text-green-700",
      },
      [UserDisposition.NOT_COMPLIANT]: {
        label: "Non-Compliant",
        textColor: "text-red-600",
        hoverColor: "hover:text-red-700",
      },
      [UserDisposition.NOT_APPLICABLE]: {
        label: "Not applicable",
        textColor: "text-gray-600",
        hoverColor: "hover:text-gray-700",
      },
      [UserDisposition.BOOKMARKED]: {
        label: "Bookmarked",
        textColor: "text-orange-700",
        hoverColor: "hover:text-orange-800",
      },
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
    (review) =>
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
  const userStatus = getUserStatus();
  const showEmailButton = userStatus !== UserDisposition.FULFILLED;

  return (
    <div
      className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
      <div className="flex items-center gap-2">
        {showEmailButton && (
          <button
            onClick={handleAddToEmail}
            className={cn(
              "text-gray-600 hover:text-gray-700 transition-all duration-200 p-1.5 rounded-sm hover:bg-gray-200",
              isHovered
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            )}
            title="Add to email"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}
        {getUserStatusButton() ?? (
          <button className="text-[12px] font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
            Review →
          </button>
        )}
      </div>
    </div>
  );
}

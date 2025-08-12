"use client";

import React from "react";
import { UserDisposition } from "../types";
import { Check, X, BookmarkIcon } from "lucide-react";

interface UserDispositionIconProps {
  status: UserDisposition;
}

export default function UserDispositionIcon({
  status
}: UserDispositionIconProps) {
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

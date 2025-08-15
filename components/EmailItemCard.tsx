"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalizeStatus } from "@/lib/emailUtils";
import { EmailItem } from "./AddItemsPanel";

interface EmailItemCardProps {
  item: EmailItem;
  note: string;
  onNoteChange: (note: string) => void;
  onRemove: () => void;
  isDisabled?: boolean;
}

export default function EmailItemCard({
  item,
  note,
  onNoteChange,
  onRemove,
  isDisabled = false,
}: EmailItemCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-600">
              {item.articleName}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {item.productName}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
            <span>
              <span className="font-medium">Bixby:</span>{" "}
              <span
                className={cn(
                  "font-medium",
                  item.status === "COMPLIANT"
                    ? "text-green-700"
                    : item.status === "NOT_COMPLIANT"
                    ? "text-red-700"
                    : "text-yellow-700"
                )}
              >
                {capitalizeStatus(item.status)}
              </span>
            </span>
            <span>
              <span className="font-medium">User:</span>{" "}
              <span
                className={cn(
                  "font-medium",
                  item.userStatus === "fulfilled"
                    ? "text-green-700"
                    : item.userStatus === "not_compliant"
                    ? "text-red-700"
                    : item.userStatus === "not_applicable"
                    ? "text-gray-500"
                    : item.userStatus === "bookmarked"
                    ? "text-red-700"
                    : "text-gray-400"
                )}
              >
                {item.userStatus
                  ? capitalizeStatus(item.userStatus)
                  : "Not reviewed"}
              </span>
            </span>
          </div>
          <p className="text-xs text-gray-600">{item.requirement}</p>
        </div>
        <button
          onClick={onRemove}
          disabled={isDisabled}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3">
        <label className="text-xs font-medium text-gray-700 block mb-1">
          Notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={isDisabled}
          placeholder="Add context or specific details about this item..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50 bg-gray-50 focus:bg-white transition-colors"
          rows={2}
        />
      </div>
    </div>
  );
}

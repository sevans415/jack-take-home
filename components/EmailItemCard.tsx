"use client";

import React from "react";
import { X, AlertCircle, Bookmark, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { capitalizeStatus } from "@/lib/emailUtils";
import { EmailItem } from "./AddItemsPanel";
import { UserDisposition, BixbyPOVDisposition } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">
              {item.articleName}
            </span>
          </div>
          {/* Requirement as primary */}
          <p className="text-sm font-medium text-gray-900 mb-3">
            {item.requirement}
          </p>

          {/* Products affected */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Affected Products:
            </p>
            <div className="space-y-1.5 ">
              {item.products.map((product) => (
                <div key={product.reviewId} className="flex items-start gap-2">
                  <div className="flex items-center gap-1 mt-0.5">
                    {product.userStatus === UserDisposition.BOOKMARKED && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Bookmark className="h-3 w-3 text-orange-700" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bookmarked</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {product.userStatus === UserDisposition.NOT_COMPLIANT && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <X className="h-3 w-3 text-red-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Non-Compliant</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {(product.userStatus === null ||
                      product.status === BixbyPOVDisposition.NOT_COMPLIANT) &&
                      product.userStatus !== UserDisposition.NOT_COMPLIANT && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Clock className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Not Reviewed</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-700">
                      {product.productName}
                    </p>
                    {product.note && (
                      <p className="text-xs text-blue-600 italic mt-0.5">
                        {product.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={onRemove}
          disabled={isDisabled}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <label className="text-xs font-medium text-gray-700 block mb-1">
          Additional Notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          disabled={isDisabled}
          placeholder="Add context or questions about this requirement..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50 bg-gray-50 focus:bg-white transition-colors"
          rows={2}
        />
      </div>
    </div>
  );
}

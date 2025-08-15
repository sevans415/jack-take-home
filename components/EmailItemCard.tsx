"use client";

import React, { useState } from "react";
import { X, Bookmark, Clock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailItem } from "./AddItemsPanel";
import { UserDisposition, BixbyPOVDisposition } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmailItemCardProps {
  item: EmailItem;
  onProductNoteChange: (productReviewId: string, note: string) => void;
  onRemove: () => void;
  isDisabled?: boolean;
}

export default function EmailItemCard({
  item,
  onProductNoteChange,
  onRemove,
  isDisabled = false,
}: EmailItemCardProps) {
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>("");

  const handleEditClick = (productReviewId: string, currentNote: string) => {
    setEditingProductId(productReviewId);
    setTempNote(currentNote || "");
  };

  const handleSaveNote = (productReviewId: string) => {
    onProductNoteChange(productReviewId, tempNote);
    setEditingProductId(null);
    setTempNote("");
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setTempNote("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, productReviewId: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveNote(productReviewId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

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
            <div className="space-y-1.5">
              {item.products.map((product) => (
                <div
                  key={product.reviewId}
                  className="flex items-start gap-2"
                  onMouseEnter={() => setHoveredProductId(product.reviewId)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
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
                    {editingProductId === product.reviewId ? (
                      <div className="mt-1">
                        <textarea
                          value={tempNote}
                          onChange={(e) => setTempNote(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, product.reviewId)}
                          onBlur={() => handleSaveNote(product.reviewId)}
                          placeholder="Add a note..."
                          className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:outline-none focus:border-blue-500 resize-none bg-white"
                          rows={2}
                          autoFocus
                          disabled={isDisabled}
                        />
                        <div className="text-[10px] text-gray-500 mt-1">
                          Press Enter to save, Esc to cancel
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1 group">
                        {product.note ? (
                          <p className="text-xs text-blue-600 italic mt-0.5 flex-1">
                            {product.note}
                          </p>
                        ) : (
                          hoveredProductId === product.reviewId && (
                            <p className="text-xs text-gray-400 italic mt-0.5 flex-1">
                              Add a note...
                            </p>
                          )
                        )}
                        {hoveredProductId === product.reviewId &&
                          !isDisabled && (
                            <button
                              onClick={() =>
                                handleEditClick(product.reviewId, product.note)
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer hover:bg-gray-100 rounded-sm"
                              title="Edit note"
                            >
                              <Pencil className="h-3 w-3 text-gray-500" />
                            </button>
                          )}
                      </div>
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
    </div>
  );
}

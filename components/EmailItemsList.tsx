"use client";

import React from "react";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import EmailItemCard from "./EmailItemCard";
import { EmailItem } from "./AddItemsPanel";

interface EmailItemsListProps {
  emailItems: EmailItem[];
  onProductNoteChange: (
    itemId: string,
    productReviewId: string,
    note: string
  ) => void;
  onRemoveItem: (itemId: string) => void;
  onGenerateEmail: () => void;
  isGenerating: boolean;
}

export default function EmailItemsList({
  emailItems,
  onProductNoteChange,
  onRemoveItem,
  onGenerateEmail,
  isGenerating,
}: EmailItemsListProps) {
  return (
    <div className="flex-1 h-full flex flex-col relative">
      {/* Header and Description */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Email Content</h3>
          <span className="text-sm text-gray-500">
            {emailItems.length} {emailItems.length === 1 ? "item" : "items"}{" "}
            selected
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Add items from the panel to include them in your email. Once the email
          is generated, you can edit it before it&apos;s sent.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50 rounded-lg border border-gray-200 p-4">
        {emailItems.length > 0 ? (
          <div className="space-y-3">
            {emailItems.map((item) => (
              <EmailItemCard
                key={item.id}
                item={item}
                onProductNoteChange={(productReviewId, note) =>
                  onProductNoteChange(item.id, productReviewId, note)
                }
                onRemove={() => onRemoveItem(item.id)}
                isDisabled={isGenerating}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                No items added yet
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Select items from the panel to get started
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 pt-4">
        <button
          onClick={onGenerateEmail}
          disabled={emailItems.length === 0 || isGenerating}
          className={cn(
            "w-full rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all shadow-sm",
            emailItems.length > 0 && !isGenerating
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-medium">Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Generate Email</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

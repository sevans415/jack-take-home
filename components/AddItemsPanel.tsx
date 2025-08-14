"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, X, ChevronDown, ChevronRight } from "lucide-react";
import { allArticles } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Article, BixbyPOVDisposition, UserDisposition } from "@/types";

export interface EmailItem {
  id: string;
  articleName: string;
  articleNumber: string;
  requirement: string;
  productName: string;
  status: BixbyPOVDisposition;
  userStatus: UserDisposition | null;
  note: string;
}

interface AddItemsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: EmailItem) => void;
  addedItems: EmailItem[];
}

export default function AddItemsPanel({
  isOpen,
  onClose,
  onAddItem,
  addedItems,
}: AddItemsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
    new Set()
  );

  // Process all articles into a flat list of items
  const allItems = useMemo(() => {
    const items: EmailItem[] = [];
    const seenIds = new Set<string>();

    allArticles.forEach((article) => {
      article.requirements.forEach((req) => {
        req.productReviews.forEach((review) => {
          // Filter out items that are fulfilled or not applicable
          if (
            review.userReview.status === UserDisposition.FULFILLED ||
            review.userReview.status === UserDisposition.NOT_APPLICABLE
          ) {
            return; // Skip this item
          }

          // Deduplicate by review ID
          if (seenIds.has(review.id)) {
            return; // Skip duplicate
          }
          seenIds.add(review.id);

          // Get product name from the mock data
          const productName =
            review.productId === 123
              ? "EHH-501 Wind-Driven Rain Resistant Louver"
              : "ESD-435 Standard Blade Louver";

          items.push({
            id: review.id,
            articleName: article.articleDetails.text,
            articleNumber: article.articleDetails.articleNumber,
            requirement: req.requirement.shortDescription,
            productName: productName,
            status: review.bixbyReview.status,
            userStatus: review.userReview.status,
            note: review.userReview.bookmarkNote || "",
          });
        });
      });
    });

    return items;
  }, []);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return allItems;
    }

    const query = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.articleName.toLowerCase().includes(query) ||
        item.requirement.toLowerCase().includes(query) ||
        item.productName.toLowerCase().includes(query) ||
        item.note.toLowerCase().includes(query)
    );
  }, [allItems, searchQuery]);

  // Group items by article
  const groupedItems = useMemo(() => {
    const groups = new Map<string, EmailItem[]>();

    filteredItems.forEach((item) => {
      const key = item.articleNumber;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [filteredItems]);

  const toggleArticle = (articleNumber: string) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleNumber)) {
      newExpanded.delete(articleNumber);
    } else {
      newExpanded.add(articleNumber);
    }
    setExpandedArticles(newExpanded);
  };

  const isItemAdded = (itemId: string) => {
    return addedItems.some((item) => item.id === itemId);
  };

  const getStatusColor = (status: BixbyPOVDisposition) => {
    switch (status) {
      case BixbyPOVDisposition.COMPLIANT:
        return "bg-green-100 text-green-700";
      case BixbyPOVDisposition.NOT_COMPLIANT:
        return "bg-red-100 text-red-700";
      case BixbyPOVDisposition.UNCLEAR:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getUserStatusIcon = (status: UserDisposition | null) => {
    if (!status) return null;

    switch (status) {
      case UserDisposition.FULFILLED:
        return "✓";
      case UserDisposition.BOOKMARKED:
        return "🔖";
      case UserDisposition.NOT_COMPLIANT:
        return "✗";
      case UserDisposition.NOT_APPLICABLE:
        return "N/A";
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg">
        <h3 className="text-sm font-semibold">Project Items</h3>
        <span className="text-xs text-gray-500">
          {addedItems.length} selected
        </span>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
        {groupedItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">
            No items found
          </p>
        ) : (
          <div className="space-y-3">
            {groupedItems.map(([articleNumber, items]) => {
              const isExpanded = expandedArticles.has(articleNumber);
              const articleName = items[0].articleName;

              return (
                <div key={articleNumber} className="border rounded-lg bg-white">
                  {/* Article Header */}
                  <button
                    onClick={() => toggleArticle(articleNumber)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-1.5">
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-500 flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium text-left line-clamp-1">
                        {articleNumber} - {articleName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      {items.length}
                    </span>
                  </button>

                  {/* Article Items */}
                  {isExpanded && (
                    <div className="border-t">
                      {items.map((item) => {
                        const added = isItemAdded(item.id);

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "px-3 py-2.5 border-b last:border-b-0 transition-colors",
                              added ? "bg-green-50" : "hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span
                                    className={cn(
                                      "text-xs px-1.5 py-0.5 rounded-full font-medium",
                                      getStatusColor(item.status)
                                    )}
                                  >
                                    {item.status}
                                  </span>
                                  {item.userStatus && (
                                    <span className="text-xs">
                                      {getUserStatusIcon(item.userStatus)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-medium text-gray-900 mb-0.5 line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {item.requirement}
                                </p>
                                {item.note && (
                                  <p className="text-xs text-blue-600 italic mt-1">
                                    Note: {item.note}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => !added && onAddItem(item)}
                                disabled={added}
                                className={cn(
                                  "flex items-center gap-0.5 px-2 py-1 rounded-md transition-colors flex-shrink-0 text-xs",
                                  added
                                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                                    : "border hover:bg-blue-50 text-blue-600 hover:border-blue-300"
                                )}
                              >
                                {added ? (
                                  <>
                                    <span className="text-xs">✓</span>
                                    <span className="font-medium">Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3" />
                                    <span className="font-medium">Add</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

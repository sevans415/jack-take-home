"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  Filter,
  Bookmark,
  AlertCircle,
  Clock,
  Check,
} from "lucide-react";
import { allArticles } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Article, BixbyPOVDisposition, UserDisposition } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EmailItem {
  id: string;
  articleName: string;
  articleNumber: string;
  requirementId: string;
  requirement: string;
  products: {
    productId: number;
    productName: string;
    reviewId: string;
    status: BixbyPOVDisposition;
    userStatus: UserDisposition | null;
    note: string;
  }[];
}

interface AddItemsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: EmailItem) => void;
  addedItems: EmailItem[];
}

type FilterType = "bookmarked" | "non-compliant" | "not-reviewed";

interface FilterOption {
  value: FilterType;
  label: string;
  icon?: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  {
    value: "bookmarked",
    label: "Bookmarked",
    icon: <Bookmark className="h-3.5 w-3.5" />,
  },
  {
    value: "non-compliant",
    label: "Non-Compliant",
    icon: <X className="h-3.5 w-3.5" />,
  },
  {
    value: "not-reviewed",
    label: "Not Reviewed",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
];

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
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(
    new Set(["bookmarked", "non-compliant", "not-reviewed"])
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Process all articles into grouped requirements
  const allItems = useMemo(() => {
    const items: EmailItem[] = [];
    const requirementMap = new Map<string, EmailItem>();

    allArticles.forEach((article) => {
      article.requirements.forEach((req) => {
        const requirementKey = `${article.articleDetails.articleNumber}-${req.id}`;

        // Collect all products for this requirement that match our filter criteria
        const relevantProducts = req.productReviews
          .filter(
            (review) =>
              review.userReview.status !== UserDisposition.FULFILLED &&
              review.userReview.status !== UserDisposition.NOT_APPLICABLE
          )
          .map((review) => {
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
          });

        // Only create an item if there are relevant products
        if (relevantProducts.length > 0) {
          items.push({
            id: requirementKey,
            articleName: article.articleDetails.text,
            articleNumber: article.articleDetails.articleNumber,
            requirementId: req.id,
            requirement: req.requirement.shortDescription,
            products: relevantProducts,
          });
        }
      });
    });

    return items;
  }, []);

  // Apply filter based on active filter types
  const filteredByType = useMemo(() => {
    if (activeFilters.size === 0) {
      return [];
    }

    return allItems.filter((item) => {
      // Check if any product in this requirement matches the active filters
      return item.products.some((product) => {
        if (
          activeFilters.has("bookmarked") &&
          product.userStatus === UserDisposition.BOOKMARKED
        ) {
          return true;
        }
        if (
          activeFilters.has("non-compliant") &&
          (product.userStatus === UserDisposition.NOT_COMPLIANT ||
            product.status === BixbyPOVDisposition.NOT_COMPLIANT)
        ) {
          return true;
        }
        if (activeFilters.has("not-reviewed") && product.userStatus === null) {
          return true;
        }
        return false;
      });
    });
  }, [allItems, activeFilters]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredByType;
    }

    const query = searchQuery.toLowerCase();
    return filteredByType.filter(
      (item) =>
        item.articleName.toLowerCase().includes(query) ||
        item.requirement.toLowerCase().includes(query) ||
        item.products.some(
          (p) =>
            p.productName.toLowerCase().includes(query) ||
            p.note.toLowerCase().includes(query)
        )
    );
  }, [filteredByType, searchQuery]);

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

  const getUserStatusLabel = (status: UserDisposition | null) => {
    if (!status) return "Not Reviewed";

    switch (status) {
      case UserDisposition.FULFILLED:
        return "Fulfilled";
      case UserDisposition.BOOKMARKED:
        return "Bookmarked";
      case UserDisposition.NOT_COMPLIANT:
        return "Non-Compliant";
      case UserDisposition.NOT_APPLICABLE:
        return "Not Applicable";
      default:
        return null;
    }
  };

  const getUserStatusColor = (status: UserDisposition | null) => {
    if (!status) return "text-gray-600";

    switch (status) {
      case UserDisposition.FULFILLED:
        return "text-green-600";
      case UserDisposition.BOOKMARKED:
        return "text-orange-700";
      case UserDisposition.NOT_COMPLIANT:
        return "text-red-600";
      case UserDisposition.NOT_APPLICABLE:
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  // Get counts for each filter
  const filterCounts = useMemo(() => {
    let bookmarked = 0;
    let nonCompliant = 0;
    let notReviewed = 0;

    allItems.forEach((item) => {
      item.products.forEach((product) => {
        if (product.userStatus === UserDisposition.BOOKMARKED) {
          bookmarked++;
        }
        if (
          product.userStatus === UserDisposition.NOT_COMPLIANT ||
          product.status === BixbyPOVDisposition.NOT_COMPLIANT
        ) {
          nonCompliant++;
        }
        if (product.userStatus === null) {
          notReviewed++;
        }
      });
    });

    return {
      bookmarked,
      "non-compliant": nonCompliant,
      "not-reviewed": notReviewed,
    };
  }, [allItems]);

  const toggleFilter = (filterType: FilterType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterType)) {
      newFilters.delete(filterType);
    } else {
      newFilters.add(filterType);
    }
    setActiveFilters(newFilters);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown-container")) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showFilterDropdown]);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Available Items</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {filteredItems.length} items
        </span>
      </div>

      {/* Search Bar with integrated Filter */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="relative filter-dropdown-container">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white transition-all"
          />

          {/* Filter button inside search bar */}
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-md transition-all",
              showFilterDropdown
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100 text-gray-400 hover:text-gray-600",
              activeFilters.size < filterOptions.length &&
                !showFilterDropdown &&
                "text-blue-600"
            )}
            title="Filter items"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>

          {/* Filter Dropdown */}
          {showFilterDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-2 border-b">
                <div className="text-xs font-medium text-gray-500 px-2">
                  FILTER BY
                </div>
              </div>
              {filterOptions.map((option) => {
                const isSelected = activeFilters.has(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter(option.value)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between",
                      isSelected && "bg-blue-50"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon && (
                        <span className={cn("text-gray-500")}>
                          {option.icon}
                        </span>
                      )}
                      <span
                        className={cn(
                          isSelected ? " font-medium" : "text-gray-800"
                        )}
                      >
                        {option.label}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs text-gray-500",
                          isSelected ? " font-medium" : "text-gray-500"
                        )}
                      >
                        {filterCounts[option.value]}
                      </span>
                      <div
                        className={cn(
                          "w-4 h-4 border rounded flex items-center justify-center",
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300"
                        )}
                      >
                        {isSelected && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {activeFilters.size < filterOptions.length && (
                <div className="border-t p-2 hover:bg-gray-50 rounded-b-lg transition-colors cursor-pointer">
                  <button
                    onClick={() => {
                      setActiveFilters(
                        new Set(["bookmarked", "non-compliant", "not-reviewed"])
                      );
                      setShowFilterDropdown(false);
                    }}
                    className="flex flex-col items-center w-full text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Select all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-white rounded-lg">
        {groupedItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-6 w-6 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-600">
                {searchQuery
                  ? "No items found"
                  : activeFilters.size === 0
                  ? "Select filters to see items"
                  : "No items match your filters"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? "Try adjusting your search"
                  : activeFilters.size === 0
                  ? "Use the filter button above"
                  : "Try different filter options"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {groupedItems.map(([articleNumber, items]) => {
              const isExpanded = expandedArticles.has(articleNumber);
              const articleName = items[0].articleName;

              return (
                <div
                  key={articleNumber}
                  className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                >
                  {/* Article Header */}
                  <button
                    onClick={() => toggleArticle(articleNumber)}
                    className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium text-gray-900 text-left line-clamp-1">
                        {articleName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                      {items.length}
                    </span>
                  </button>

                  {/* Article Items */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {items.map((item) => {
                        const added = isItemAdded(item.id);

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "px-3 py-3 border-b border-gray-50 last:border-b-0 transition-all",
                              "hover:bg-gray-50"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                {/* Requirement */}
                                <p className="text-xs font-medium text-gray-900 mb-2">
                                  {item.requirement}
                                </p>

                                {/* Products */}
                                <div className="space-y-1.5">
                                  {item.products.map((product, idx) => (
                                    <div
                                      key={product.reviewId}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="flex items-center gap-1 mt-0.5">
                                        {product.userStatus ===
                                          UserDisposition.BOOKMARKED && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Bookmark className="h-3 w-3 text-orange-700" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Bookmarked</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                        {product.userStatus ===
                                          UserDisposition.NOT_COMPLIANT && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <X className="h-3 w-3 text-red-600" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Non-Compliant</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                        {!product.userStatus && (
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
                              <button
                                onClick={() => !added && onAddItem(item)}
                                disabled={added}
                                className={cn(
                                  "flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all flex-shrink-0 text-xs font-medium border",
                                  added
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                                )}
                              >
                                {added ? (
                                  <>
                                    <span className="text-xs">✓</span>
                                    <span>Added</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3" />
                                    <span>Add</span>
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

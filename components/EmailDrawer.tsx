"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Mail,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddItemsPanel, { EmailItem } from "./AddItemsPanel";

interface EmailRecipient {
  email: string;
  name: string;
}

// Mock email contacts for autocomplete
const mockContacts: EmailRecipient[] = [
  { email: "john.doe@example.com", name: "John Doe" },
  { email: "jane.smith@example.com", name: "Jane Smith" },
  { email: "bob.johnson@example.com", name: "Bob Johnson" },
  { email: "alice.williams@example.com", name: "Alice Williams" },
  { email: "charlie.brown@example.com", name: "Charlie Brown" },
  { email: "diana.prince@example.com", name: "Diana Prince" },
  { email: "evan.peters@example.com", name: "Evan Peters" },
  { email: "frank.miller@example.com", name: "Frank Miller" },
];

interface EmailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailDrawer({ isOpen, onClose }: EmailDrawerProps) {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<EmailRecipient[]>(
    []
  );
  const [showItemsPanel, setShowItemsPanel] = useState(true); // Start with panel open
  const [emailItems, setEmailItems] = useState<EmailItem[]>([]);
  const [itemNotes, setItemNotes] = useState<Map<string, string>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = mockContacts.filter(
        (contact) =>
          !recipients.some((r) => r.email === contact.email) &&
          (contact.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            contact.email.toLowerCase().includes(inputValue.toLowerCase()))
      );
      setFilteredContacts(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredContacts([]);
      setShowDropdown(false);
    }
  }, [inputValue, recipients]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset items panel state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setShowItemsPanel(true);
    }
  }, [isOpen]);

  const addRecipient = (recipient: EmailRecipient) => {
    setRecipients([...recipients, recipient]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredContacts.length > 0) {
      e.preventDefault();
      addRecipient(filteredContacts[0]);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      recipients.length > 0
    ) {
      removeRecipient(recipients[recipients.length - 1].email);
    }
  };

  const handleAddItem = (item: EmailItem) => {
    setEmailItems([...emailItems, item]);
    // Initialize note with existing note if available
    if (item.note && !itemNotes.has(item.id)) {
      const newNotes = new Map(itemNotes);
      newNotes.set(item.id, item.note);
      setItemNotes(newNotes);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setEmailItems(emailItems.filter((item) => item.id !== itemId));
    const newNotes = new Map(itemNotes);
    newNotes.delete(itemId);
    setItemNotes(newNotes);
  };

  const handleNoteChange = (itemId: string, note: string) => {
    const newNotes = new Map(itemNotes);
    newNotes.set(itemId, note);
    setItemNotes(newNotes);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer - Made skinnier and more focused */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-white shadow-xl transition-all duration-200 ease-out",
          showItemsPanel ? "w-full max-w-5xl" : "w-full max-w-2xl"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Compose AI Email</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-72px)] overflow-y-auto">
          <div className="p-6">
            {/* To Field */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <label className="text-sm font-medium text-gray-700 mt-2">
                  To:
                </label>
                <div className="flex-1 relative">
                  <div className="flex flex-wrap items-center gap-2 min-h-[40px] px-3 py-2 border rounded-lg bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
                    {/* Email Chips */}
                    {recipients.map((recipient) => (
                      <div
                        key={recipient.email}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-1 pr-2 py-1"
                      >
                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-medium">
                          {getInitials(recipient.name)}
                        </div>
                        <span className="text-sm">{recipient.name}</span>
                        <button
                          onClick={() => removeRecipient(recipient.email)}
                          className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3 text-gray-500" />
                        </button>
                      </div>
                    ))}

                    {/* Input Field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => {
                        if (inputValue && filteredContacts.length > 0) {
                          setShowDropdown(true);
                        }
                      }}
                      placeholder={
                        recipients.length === 0
                          ? "Type to add recipients..."
                          : ""
                      }
                      className="flex-1 min-w-[200px] outline-none bg-transparent text-sm"
                    />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto z-10"
                    >
                      {filteredContacts.map((contact) => (
                        <button
                          key={contact.email}
                          onClick={() => addRecipient(contact)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-medium">
                            {getInitials(contact.name)}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {contact.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {contact.email}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Email Content Section with integrated items panel */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold">Email Content:</h3>
                <button
                  onClick={() => setShowItemsPanel(!showItemsPanel)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {showItemsPanel ? (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">Hide Items</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Add Items</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {showItemsPanel
                  ? "Select items from the right panel. AI will generate a professional email based on your selections."
                  : "Add project items and notes. AI will generate a professional email based on your selections."}
              </p>

              {/* Content Area with Items Panel */}
              <div className="flex gap-4">
                {/* Email Items Column */}
                <div
                  className={cn(
                    "transition-all duration-200 ease-out",
                    showItemsPanel ? "flex-1" : "w-full"
                  )}
                >
                  {emailItems.length > 0 ? (
                    <div className="space-y-3">
                      {emailItems.map((item) => (
                        <div
                          key={item.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-gray-600">
                                  {item.articleNumber} - {item.articleName}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                    item.status === "COMPLIANT"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "NOT_COMPLIANT"
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  )}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-600">
                                {item.requirement}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Note Field */}
                          <div className="mt-3">
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                              Notes (optional)
                            </label>
                            <textarea
                              value={itemNotes.get(item.id) || ""}
                              onChange={(e) =>
                                handleNoteChange(item.id, e.target.value)
                              }
                              placeholder="Add context or specific details about this item..."
                              className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:border-blue-500"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg">
                      <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No items added yet</p>
                      <p className="text-xs mt-1">
                        {showItemsPanel
                          ? "Select items from the panel on the right"
                          : "Click 'Add Items' to get started"}
                      </p>
                    </div>
                  )}

                  {/* Generate Button - Always visible */}
                  <button
                    disabled={emailItems.length === 0}
                    className={cn(
                      "w-full mt-4 rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors",
                      emailItems.length > 0
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="font-medium">Generate Email</span>
                  </button>
                </div>

                {/* Items Panel - Slides out from the body section */}
                <div
                  className={cn(
                    "border-l rounded-lg bg-gray-50 transition-all duration-200 ease-out",
                    showItemsPanel
                      ? "w-96 opacity-100 translate-x-0"
                      : "w-0 opacity-0 translate-x-4"
                  )}
                  style={{
                    overflow: showItemsPanel ? "visible" : "hidden",
                  }}
                >
                  {showItemsPanel && (
                    <div className="h-[600px] w-96 overflow-hidden rounded-lg">
                      <AddItemsPanel
                        isOpen={true}
                        onClose={() => setShowItemsPanel(false)}
                        onAddItem={handleAddItem}
                        addedItems={emailItems}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

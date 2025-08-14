"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Mail,
  Plus,
  Sparkles,
  Search,
  Loader2,
  Send,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AddItemsPanel, { EmailItem } from "./AddItemsPanel";
import { useEmail } from "@/contexts/EmailContext";
import { motion, AnimatePresence } from "framer-motion";

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
  // Use context for persistent state
  const {
    recipients,
    setRecipients,
    emailItems,
    setEmailItems,
    itemNotes,
    setItemNotes,
    generatedEmail,
    setGeneratedEmail,
    emailGenerated,
    setEmailGenerated,
    resetEmailState,
  } = useEmail();

  // Local state for UI interactions only
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<EmailRecipient[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentToRecipients, setSentToRecipients] = useState<string[]>([]);
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

  // Reset success state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowSuccess(false);
        setSentToRecipients([]);
      }, 300);
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

  const handleGenerateEmail = async () => {
    if (emailItems.length === 0) return;

    setIsGenerating(true);
    try {
      const itemsWithNotes = emailItems.map((item) => ({
        ...item,
        note: itemNotes.get(item.id) || item.note || "",
      }));

      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          items: itemsWithNotes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedEmail(data.emailBody);
        setEmailGenerated(true);
      } else {
        console.error("Failed to generate email:", data.error);
      }
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipients,
          emailBody: generatedEmail,
          subject: "Review Required: Submittal Compliance Issues",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSentToRecipients(data.recipients);
        setShowSuccess(true);
      } else {
        console.error("Failed to send email:", data.error);
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    } finally {
      setIsSending(false);
    }
  };

  const handleComposeNew = () => {
    resetEmailState();
    setInputValue("");
    setShowSuccess(false);
    setSentToRecipients([]);
  };

  const handleCloseDrawer = () => {
    if (showSuccess) {
      resetEmailState();
      setInputValue("");
      setShowSuccess(false);
      setSentToRecipients([]);
    }
    onClose();
  };

  const handleRegenerate = () => {
    setEmailGenerated(false);
    setGeneratedEmail("");
  };

  return (
    <div className="h-full bg-white border-l shadow-xl flex flex-col w-[800px] relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Compose AI Email</h2>
        </div>
        <div className="flex items-center gap-2">
          {!showSuccess &&
            (recipients.length > 0 ||
              emailItems.length > 0 ||
              generatedEmail) && (
              <button
                onClick={() => {
                  if (
                    confirm("Are you sure you want to reset all email content?")
                  ) {
                    resetEmailState();
                    setInputValue("");
                  }
                }}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                title="Reset email"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}
          <button
            onClick={handleCloseDrawer}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-6 h-full flex flex-col">
          {/* To Field */}
          <div className="mb-6 flex-shrink-0">
            <div className="flex items-start gap-3">
              <label className="text-sm font-medium text-gray-700 mt-2">
                To:
              </label>
              <div className="flex-1 relative">
                <div className="flex flex-wrap items-center gap-2 min-h-[40px] px-3 py-2 border rounded-lg bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
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
                      recipients.length === 0 ? "Type to add recipients..." : ""
                    }
                    className="flex-1 min-w-[200px] outline-none bg-transparent text-sm"
                  />
                </div>

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

          {/* Email Content Section */}
          <div className="border-t pt-6 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-base font-semibold">Email Content:</h3>
              {emailGenerated && (
                <button
                  onClick={handleRegenerate}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Edit Items
                </button>
              )}
            </div>

            {!emailGenerated && (
              <p className="text-sm text-gray-600 mb-4 flex-shrink-0">
                Select items from the right panel. AI will generate a
                professional email based on your selections.
              </p>
            )}

            {emailGenerated ? (
              // Generated Email View
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto min-h-0">
                  <textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:border-blue-500 font-sans text-sm leading-relaxed"
                    placeholder="Generated email will appear here..."
                  />
                </div>
                <div className="flex-shrink-0 pt-4">
                  <button
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className={cn(
                      "w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors",
                      !isSending
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    )}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span className="font-medium">Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Items Selection View
              <div className="flex gap-4 flex-1 min-h-0">
                <div className="flex-1 h-full flex flex-col relative">
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">
                          Generating email...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          This may take a few seconds
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex-1 overflow-y-auto min-h-0 transition-opacity duration-300",
                      isGenerating && "opacity-50"
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
                                disabled={isGenerating}
                                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-3">
                              <label className="text-xs font-medium text-gray-700 block mb-1">
                                Notes (optional)
                              </label>
                              <textarea
                                value={itemNotes.get(item.id) || ""}
                                onChange={(e) =>
                                  handleNoteChange(item.id, e.target.value)
                                }
                                disabled={isGenerating}
                                placeholder="Add context or specific details about this item..."
                                className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                rows={2}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400 rounded-lg">
                          <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No items added yet</p>
                          <p className="text-xs mt-1">
                            Select items from the panel on the right
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 pt-4">
                    <button
                      onClick={handleGenerateEmail}
                      disabled={emailItems.length === 0 || isGenerating}
                      className={cn(
                        "w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-colors",
                        emailItems.length > 0 && !isGenerating
                          ? "bg-gray-900 text-white hover:bg-gray-800"
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

                <div
                  className={cn(
                    "w-80 border-l rounded-lg bg-gray-50 h-full relative transition-opacity duration-300",
                    isGenerating && "opacity-50"
                  )}
                >
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 rounded-lg" />
                  )}
                  <div className="h-full w-full rounded-lg">
                    <AddItemsPanel
                      isOpen={true}
                      onClose={() => {}}
                      onAddItem={handleAddItem}
                      addedItems={emailItems}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Overlay with Blur */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />

            {/* Success Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative z-10 max-w-md w-full mx-6"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                  }}
                  className="mb-6 inline-flex"
                >
                  <div className="relative">
                    <CheckCircle className="h-20 w-20 text-green-500" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0"
                    >
                      <CheckCircle className="h-20 w-20 text-green-500 opacity-30" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Email Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your email has been delivered to{" "}
                    <span className="font-semibold text-gray-900">
                      {sentToRecipients.length} recipient
                      {sentToRecipients.length !== 1 ? "s" : ""}
                    </span>
                  </p>
                </motion.div>

                {/* Recipients List */}
                {sentToRecipients.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 rounded-xl p-4 mb-6 text-sm"
                  >
                    <div className="font-medium text-gray-700 mb-2">
                      Sent to:
                    </div>
                    <div className="space-y-1">
                      {sentToRecipients.map((email, index) => (
                        <motion.div
                          key={email}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="text-gray-600"
                        >
                          {email}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleComposeNew}
                    className="w-full bg-blue-600 text-white rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Mail className="h-5 w-5" />
                    Compose New Email
                  </button>
                  <button
                    onClick={handleCloseDrawer}
                    className="w-full text-gray-600 hover:text-gray-900 px-6 py-2.5 transition-colors text-sm font-medium hover:bg-gray-50 rounded-xl"
                  >
                    Close & Reset
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

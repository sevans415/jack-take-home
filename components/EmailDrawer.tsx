"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, ChevronsRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import AddItemsPanel, { EmailItem } from "./AddItemsPanel";
import { useEmail } from "@/contexts/EmailContext";
import RecipientField from "./RecipientField";
import EmailComposer from "./EmailComposer";
import EmailItemsList from "./EmailItemsList";
import EmailSuccessOverlay from "./EmailSuccessOverlay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sentToRecipients, setSentToRecipients] = useState<string[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [isResetPopoverOpen, setIsResetPopoverOpen] = useState(false);

  // Reset success state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowSuccess(false);
        setSentToRecipients([]);
      }, 300);
    }
  }, [isOpen]);

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
        setEmailSubject(
          data.subject || "Review Required: Submittal Compliance Issues"
        );
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
          subject: emailSubject,
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
    setShowSuccess(false);
    setSentToRecipients([]);
    setEmailSubject("");
  };

  const handleCloseDrawer = () => {
    if (showSuccess) {
      resetEmailState();
      setShowSuccess(false);
      setSentToRecipients([]);
      setEmailSubject("");
    }
    onClose();
  };

  const handleRegenerate = () => {
    setEmailGenerated(false);
    setGeneratedEmail("");
    setEmailSubject("");
  };

  const handleReset = () => {
    resetEmailState();
    setIsResetPopoverOpen(false);
  };

  return (
    <div className="h-full bg-white border-l shadow-xl flex flex-col w-[800px] relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pl-2 pr-2 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCloseDrawer}
            className="rounded-lg p-1.5 hover:bg-gray-200/50 transition-colors cursor-pointer"
            title="Close drawer"
          >
            <ChevronsRight className="h-4 w-4 text-gray-800" />
          </button>
          <h2 className="text-sm font-medium text-gray-900">New Message</h2>
        </div>
        <div className="flex items-center gap-1">
          {!showSuccess && (
            <Popover
              open={isResetPopoverOpen}
              onOpenChange={setIsResetPopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  disabled={
                    recipients.length === 0 &&
                    emailItems.length === 0 &&
                    !generatedEmail
                  }
                  className={cn(
                    "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
                    recipients.length > 0 ||
                      emailItems.length > 0 ||
                      generatedEmail
                      ? "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      : "text-gray-400 cursor-not-allowed hover:bg-gray-50"
                  )}
                  title="Reset email"
                >
                  <RotateCcw
                    className={cn(
                      "h-3 w-3 font-semibold",
                      recipients.length > 0 ||
                        emailItems.length > 0 ||
                        generatedEmail
                        ? "text-gray-600 hover:text-gray-800"
                        : "text-gray-400"
                    )}
                  />
                  <span>Reset</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4" align="end">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-900">
                    Reset email?
                  </p>
                  <p className="text-sm text-gray-600">
                    This will clear all recipients and selected items.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsResetPopoverOpen(false)}
                      className="text-xs w-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs w-full"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 h-full flex flex-col">
          {/* To Field */}
          <div className="mb-4 flex-shrink-0">
            <RecipientField
              recipients={recipients}
              onRecipientsChange={setRecipients}
            />
          </div>

          {/* Email Content Section */}
          <div className="border-t border-gray-100 flex-1 flex flex-col min-h-0">
            {emailGenerated ? (
              // Generated Email View - Full Width
              <EmailComposer
                emailSubject={emailSubject}
                onSubjectChange={setEmailSubject}
                emailBody={generatedEmail}
                onBodyChange={setGeneratedEmail}
                onSend={handleSendEmail}
                isSending={isSending}
                onEditItems={handleRegenerate}
              />
            ) : (
              // Items Selection View - With Side Panel
              <div className="flex gap-4 flex-1 min-h-0 pt-4">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    // Full-width loading screen with fade animation
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-700">
                          Generating email...
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          This may take a few seconds
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    // Regular content with fade animation
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex gap-4 flex-1"
                    >
                      <EmailItemsList
                        emailItems={emailItems}
                        itemNotes={itemNotes}
                        onNoteChange={handleNoteChange}
                        onRemoveItem={handleRemoveItem}
                        onGenerateEmail={handleGenerateEmail}
                        isGenerating={isGenerating}
                      />

                      <div className="w-80 h-full relative">
                        <div className="h-full w-full sticky top-0">
                          <AddItemsPanel
                            isOpen={true}
                            onClose={() => {}}
                            onAddItem={handleAddItem}
                            addedItems={emailItems}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Overlay with Blur */}
      <AnimatePresence>
        {showSuccess && (
          <EmailSuccessOverlay
            sentToRecipients={sentToRecipients}
            onComposeNew={handleComposeNew}
            onClose={handleCloseDrawer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

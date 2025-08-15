"use client";

import React from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmail } from "@/contexts/EmailContext";

interface EmailComposerProps {
  emailSubject: string;
  onSubjectChange: (subject: string) => void;
  emailBody: string;
  onBodyChange: (body: string) => void;
  onSend: () => void;
  isSending: boolean;
  onEditItems: () => void;
}

export default function EmailComposer({
  emailSubject,
  onSubjectChange,
  emailBody,
  onBodyChange,
  onSend,
  isSending,
  onEditItems,
}: EmailComposerProps) {
  // Get recipients from context to check if send button should be enabled
  const { recipients } = useEmail();

  // Check if the send button should be disabled
  const isSendDisabled =
    isSending || !emailBody.trim() || recipients.length === 0;

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-shrink-0 pt-4">
        <h3 className="text-base font-semibold">Email Content:</h3>
        <button
          onClick={onEditItems}
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          Edit Items
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Subject Line */}
        <div className="mb-4 flex-shrink-0">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Subject
          </label>
          <input
            type="text"
            value={emailSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
            placeholder="Enter email subject..."
          />
        </div>

        {/* Email Body */}
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-sm font-medium text-gray-700 block mb-2 flex-shrink-0">
            Message
          </label>
          <div className="flex-1 min-h-0">
            <textarea
              value={emailBody}
              onChange={(e) => onBodyChange(e.target.value)}
              className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:border-blue-500 font-sans text-sm leading-relaxed"
              placeholder="Generated email will appear here..."
            />
          </div>
        </div>
        <div className="flex-shrink-0 pt-4">
          <button
            onClick={onSend}
            disabled={isSendDisabled}
            className={cn(
              "w-full rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors",
              !isSendDisabled
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
    </>
  );
}

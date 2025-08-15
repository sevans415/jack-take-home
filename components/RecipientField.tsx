"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EmailRecipient,
  mockContacts,
  getInitials,
  validateEmail,
} from "@/lib/emailUtils";

interface RecipientFieldProps {
  recipients: EmailRecipient[];
  onRecipientsChange: (recipients: EmailRecipient[]) => void;
  autoFocus?: boolean;
}

export default function RecipientField({
  recipients,
  onRecipientsChange,
  autoFocus = false,
}: RecipientFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<EmailRecipient[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-focus when autoFocus is true and recipients are empty
  useEffect(() => {
    if (autoFocus && recipients.length === 0 && inputRef.current) {
      // Small delay to ensure drawer animation has started
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus, recipients.length]);

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

  const addRecipient = (recipient: EmailRecipient) => {
    onRecipientsChange([...recipients, recipient]);
    setInputValue("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const removeRecipient = (email: string) => {
    onRecipientsChange(recipients.filter((r) => r.email !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // If there are filtered contacts, add the first one
      if (filteredContacts.length > 0) {
        addRecipient(filteredContacts[0]);
      }
      // Otherwise, if input looks like an email, add it as a custom recipient
      else if (inputValue.trim() && inputValue.includes("@")) {
        if (validateEmail(inputValue.trim())) {
          const customRecipient: EmailRecipient = {
            email: inputValue.trim(),
            name: inputValue.trim(),
          };
          addRecipient(customRecipient);
        }
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      recipients.length > 0
    ) {
      removeRecipient(recipients[recipients.length - 1].email);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">To:</label>
      <div className="flex-1 relative">
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 min-h-[40px] p-1 px-3 border rounded-lg bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-colors",
            recipients.length > 0 && "pl-1"
          )}
        >
          {recipients.map((recipient) => (
            <div
              key={recipient.email}
              className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-px pr-1"
            >
              <div className="w-5 h-5 m-0.5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-medium">
                {getInitials(recipient.name)}
              </div>
              <span className="text-sm">{recipient.name}</span>
              <button
                onClick={() => removeRecipient(recipient.email)}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors cursor-pointer"
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
              recipients.length === 0 ? "Type name or email address..." : ""
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
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(contact.name)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{contact.name}</div>
                  <div className="text-xs text-gray-500">{contact.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

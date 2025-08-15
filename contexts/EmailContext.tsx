"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { EmailItem } from "@/components/AddItemsPanel";

interface EmailRecipient {
  email: string;
  name: string;
}

interface EmailContextType {
  // Recipients
  recipients: EmailRecipient[];
  setRecipients: (recipients: EmailRecipient[]) => void;

  // Email items
  emailItems: EmailItem[];
  setEmailItems: (items: EmailItem[]) => void;

  // Generated email
  generatedEmail: string;
  setGeneratedEmail: (email: string) => void;
  emailGenerated: boolean;
  setEmailGenerated: (generated: boolean) => void;

  // Reset function
  resetEmailState: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export function EmailProvider({ children }: { children: ReactNode }) {
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [emailItems, setEmailItems] = useState<EmailItem[]>([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [emailGenerated, setEmailGenerated] = useState(false);

  const resetEmailState = () => {
    setRecipients([]);
    setEmailItems([]);
    setGeneratedEmail("");
    setEmailGenerated(false);
  };

  return (
    <EmailContext.Provider
      value={{
        recipients,
        setRecipients,
        emailItems,
        setEmailItems,
        generatedEmail,
        setGeneratedEmail,
        emailGenerated,
        setEmailGenerated,
        resetEmailState,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
}

export function useEmail() {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider");
  }
  return context;
}

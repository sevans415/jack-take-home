"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Mail } from "lucide-react";

interface EmailSuccessOverlayProps {
  sentToRecipients: string[];
  onComposeNew: () => void;
  onClose: () => void;
}

export default function EmailSuccessOverlay({
  sentToRecipients,
  onComposeNew,
  onClose,
}: EmailSuccessOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
    >
      {/* Success Content - Directly on blur */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-sm w-full mx-6 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
          className="mb-4 inline-flex"
        >
          <CheckCircle className="h-12 w-12 text-green-600" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Email sent successfully
          </h3>
        </motion.div>

        {/* Recipients List */}
        {sentToRecipients.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50/50 rounded-lg p-3 mb-6 text-sm"
          >
            <div className="text-xs font-medium text-gray-700 mb-1.5">
              Sent to:
            </div>
            <div className="space-y-0.5">
              {sentToRecipients.map((email) => (
                <div key={email} className="text-xs text-gray-600">
                  {email}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <button
            onClick={onComposeNew}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Mail className="h-4 w-4" />
            Compose New Email
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 px-4 py-2 transition-colors text-sm hover:bg-gray-100/50 rounded-lg"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export interface EmailRecipient {
  email: string;
  name: string;
}

// Mock email contacts for autocomplete
export const mockContacts: EmailRecipient[] = [
  { email: "john.doe@example.com", name: "John Doe" },
  { email: "jane.smith@example.com", name: "Jane Smith" },
  { email: "bob.johnson@example.com", name: "Bob Johnson" },
  { email: "alice.williams@example.com", name: "Alice Williams" },
  { email: "charlie.brown@example.com", name: "Charlie Brown" },
  { email: "diana.prince@example.com", name: "Diana Prince" },
  { email: "evan.peters@example.com", name: "Evan Peters" },
  { email: "frank.miller@example.com", name: "Frank Miller" },
];

export const getInitials = (name: string): string => {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}`.toUpperCase();
  }
  return name.slice(0, 1).toUpperCase();
};

export const capitalizeStatus = (status: string): string => {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

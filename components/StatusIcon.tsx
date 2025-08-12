import { UserDisposition, BixbyPOVDisposition } from "../types";

interface StatusIconProps {
  disposition: UserDisposition | BixbyPOVDisposition;
  size?: "sm" | "md";
}

export default function StatusIcon({
  disposition,
  size = "md"
}: StatusIconProps) {
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  // Handle UserDisposition
  if (Object.values(UserDisposition).includes(disposition as UserDisposition)) {
    switch (disposition as UserDisposition) {
      case UserDisposition.FULFILLED:
        return (
          <div
            className={`${iconSize} rounded-full bg-green-500 flex items-center justify-center`}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case UserDisposition.NOT_COMPLIANT:
        return (
          <div
            className={`${iconSize} rounded-full bg-red-500 flex items-center justify-center`}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case UserDisposition.NOT_APPLICABLE:
        return (
          <div
            className={`${iconSize} rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold`}
          >
            NA
          </div>
        );
      case UserDisposition.BOOKMARKED:
        return (
          <div
            className={`${iconSize} rounded bg-yellow-500 flex items-center justify-center`}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
        );
    }
  }

  // Handle BixbyPOVDisposition
  switch (disposition as BixbyPOVDisposition) {
    case BixbyPOVDisposition.COMPLIANT:
      return (
        <div
          className={`${iconSize} rounded-full bg-green-500 flex items-center justify-center`}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    case BixbyPOVDisposition.NOT_COMPLIANT:
      return (
        <div
          className={`${iconSize} rounded-full bg-red-500 flex items-center justify-center`}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    case BixbyPOVDisposition.UNCLEAR:
      return (
        <div
          className={`${iconSize} rounded-full bg-yellow-500 flex items-center justify-center`}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    default:
      return null;
  }
}

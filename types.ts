export interface Article {
  articleDetails: {
    text: string;
    articleNumber: string;
  };
  requirements: RequirementItemType[];
}

export interface RequirementItemType {
  id: string;
  requirement: {
    shortDescription: string;
  };
  productReviews: ProductReview[];
}

export interface ProductReview {
  id: string;
  productId: number;
  bixbyReview: BixbyReview;
  userReview: UserReview;
}

export interface BixbyReview {
  status: BixbyPOVDisposition;
  explanation: string;
}

export interface UserReview {
  status: UserDisposition | null;
  bookmarkNote: string | null;
}

export enum UserDisposition {
  FULFILLED = "fulfilled",
  NOT_COMPLIANT = "not_compliant",
  NOT_APPLICABLE = "not_applicable",
  BOOKMARKED = "bookmarked"
}

export enum BixbyPOVDisposition {
  COMPLIANT = "COMPLIANT",
  NOT_COMPLIANT = "NOT_COMPLIANT",
  UNCLEAR = "UNCLEAR"
}

export interface Product {
  id: number;
  productName: string;
  manufacturer: string;
}

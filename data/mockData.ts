import { Article, UserDisposition, BixbyPOVDisposition } from "../types";

export const windLouverProduct = {
  id: 123,
  productName: "EHH-501 Wind-Driven Rain Resistant Louver",
  manufacturer: "Greenheck"
};

export const standardBladeProduct = {
  id: 456,
  productName: "ESD-435 Standard Blade Louver",
  manufacturer: "Greenheck"
};

export const manufacturersArticle: Article = {
  articleDetails: {
    text: "2.1 Manufacturers",
    articleNumber: "2.1"
  },
  requirements: [
    {
      id: "2.1.A",
      requirement: {
        shortDescription:
          "Provide louvers from Airolite, Construction Specialties, Greenheck, Ruskin, or equal."
      },
      productReviews: [
        {
          id: "2.1.A-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "The specification includes acceptable manufacturers for louvers."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        },
        {
          id: "2.1.A-2",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "The specification includes acceptable manufacturers for louvers."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    }
  ]
};

export const windDrivenRainArticle: Article = {
  articleDetails: {
    text: "2.2 Wind-Driven Rain Resistant Louvers",
    articleNumber: "2.2"
  },
  requirements: [
    {
      id: "2.2.A",
      requirement: {
        shortDescription:
          "Wind-driven rain resistant louvers must be AMCA certified."
      },
      productReviews: [
        {
          id: "2.2.A-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify AMCA certification for wind-driven rain resistant louvers."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.B",
      requirement: {
        shortDescription:
          "Product for wind-driven rain resistant louver to be Ruskin EME520DD or equal."
      },
      productReviews: [
        {
          id: "2.2.B-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "Ruskin EME520DD is specified as the acceptable product for wind-driven rain resistant louvers. "
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: "Need to ask architect if EHH-501 is acceptable equal"
          }
        }
      ]
    },
    {
      id: "2.2.C.1",
      requirement: {
        shortDescription:
          "Sizes for wind-driven rain resistant louvers are shown on drawings."
      },
      productReviews: [
        {
          id: "2.2.C.1-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation: "Need to verify sizes match those shown on drawings."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote:
              "Ask Mike (project manager) which drawings are relevant here"
          }
        }
      ]
    },
    {
      id: "2.2.C.2",
      requirement: {
        shortDescription:
          "Wind-driven rain resistant louvers must have a 5-inch nominal depth."
      },
      productReviews: [
        {
          id: "2.2.C.2-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation: "Need to verify 5-inch nominal depth specification."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.C.3",
      requirement: {
        shortDescription:
          "Blade type for wind-driven rain resistant louvers must be drainable."
      },
      productReviews: [
        {
          id: "2.2.C.3-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "Wind-driven rain resistant louvers have drainable blade type as required."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.C.4",
      requirement: {
        shortDescription:
          'Frames/mullions for wind-driven rain louvers must be at least 0.080" thick aluminum.'
      },
      productReviews: [
        {
          id: "2.2.C.4-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              'Need to verify frame/mullion thickness meets 0.080" minimum.'
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.C.5",
      requirement: {
        shortDescription:
          'Blades for wind-driven rain louvers must be at least 0.080" thick aluminum.'
      },
      productReviews: [
        {
          id: "2.2.C.5-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              'Submitted blade is 0.071" thick, not the required 0.080" minimum.'
          },
          userReview: {
            status: UserDisposition.NOT_COMPLIANT,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.C.6",
      requirement: {
        shortDescription:
          'Sill flashing for wind-driven rain louvers to be 0.050" aluminum with welded end dams.'
      },
      productReviews: [
        {
          id: "2.2.C.6-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Sill flashing material thickness and confirmation of welded end dams are not provided"
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.C.7",
      requirement: {
        shortDescription:
          'Bird screens for wind-driven rain louvers to be 5/8" x 0.040" expanded aluminum mesh.'
      },
      productReviews: [
        {
          id: "2.2.C.7-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              'Submitted bird screen is 0.5" x 0.047" stainless steel wire cloth, not the required 5/8" x 0.0040" expanded aluminum mesh'
          },
          userReview: {
            status: UserDisposition.NOT_COMPLIANT,
            bookmarkNote:
              "Owner mentioned in call 8/2 they don't need bird screens after all. need sub to remove bird screen from submittal"
          }
        }
      ]
    },
    {
      id: "2.2.C.8",
      requirement: {
        shortDescription:
          "Exposed finishes on wind-driven rain louvers must match storefront framing."
      },
      productReviews: [
        {
          id: "2.2.C.8-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify exposed finishes match storefront framing."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote:
              "Ask Mike (project manager) what storefront framing finishes will be"
          }
        }
      ]
    },
    {
      id: "2.2.D.1",
      requirement: {
        shortDescription:
          "Wind-driven rain louvers must have a free area of at least 6.99 sq. ft."
      },
      productReviews: [
        {
          id: "2.2.D.1-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              "Submitted free area is 6.89 sq. ft., not the required 6.99 sq. ft."
          },
          userReview: {
            status: null,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.2.D.2",
      requirement: {
        shortDescription:
          "Wind-driven rain louvers must have an air flow of 9514 CFM."
      },
      productReviews: [
        {
          id: "2.2.D.2-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              "Submitted air flow is 9045 CFM, not the required 9514 CFM."
          },
          userReview: {
            status: null,
            bookmarkNote: null
          }
        }
      ]
    }
  ]
};

export const standardBladeArticle: Article = {
  articleDetails: {
    text: "2.3 Standard Blade Louvers",
    articleNumber: "2.3"
  },
  requirements: [
    {
      id: "2.3.A",
      requirement: {
        shortDescription: "Standard blade louvers must be AMCA certified."
      },
      productReviews: [
        {
          id: "2.3.A-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "AMCA certification is present in the product description."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.B",
      requirement: {
        shortDescription:
          "Product for standard blade louver to be Ruskin ELF375X or equal."
      },
      productReviews: [
        {
          id: "2.3.B-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "Ruskin ELF375X is specified as the acceptable product for standard blade louvers."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: "ask architect if this is acceptable equal"
          }
        }
      ]
    },
    {
      id: "2.3.C.1",
      requirement: {
        shortDescription:
          "Sizes for standard blade louvers are shown on drawings."
      },
      productReviews: [
        {
          id: "2.3.C.1-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation: "Need to verify sizes match those shown on drawings."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: "same as last drawings one"
          }
        }
      ]
    },
    {
      id: "2.3.C.2",
      requirement: {
        shortDescription:
          "Standard blade louvers must have a 4-inch nominal depth."
      },
      productReviews: [
        {
          id: "2.3.C.2-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              "4-inch nominal depth is present in the product description."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.C.3",
      requirement: {
        shortDescription:
          "Blade type for standard louvers must be non-drainable."
      },
      productReviews: [
        {
          id: "2.3.C.3-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              "Standard blade louvers require non-drainable blades, but submitted product has drainable blades."
          },
          userReview: {
            status: UserDisposition.NOT_COMPLIANT,
            bookmarkNote: "Non-drainable blade requirement"
          }
        }
      ]
    },
    {
      id: "2.3.C.4",
      requirement: {
        shortDescription:
          'Frames/mullions for standard louvers must be at least 0.080" thick aluminum.'
      },
      productReviews: [
        {
          id: "2.3.C.4-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              'Need to verify frame/mullion thickness meets 0.080" minimum.'
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.C.5",
      requirement: {
        shortDescription:
          'Blades for standard louvers must be at least 0.080" thick aluminum.'
      },
      productReviews: [
        {
          id: "2.3.C.5-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation: 'blade thickness of 0.081" meets 0.080" minimum.'
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.C.6",
      requirement: {
        shortDescription:
          'Sill flashing for standard louvers to be 0.050" aluminum with welded end dams.'
      },
      productReviews: [
        {
          id: "2.3.C.6-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.COMPLIANT,
            explanation:
              'sill flashing is 0.050" aluminum with welded end dams.'
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.C.7",
      requirement: {
        shortDescription:
          'Bird screens for standard louvers to be 3/4" x 0.050" expanded aluminum mesh.'
      },
      productReviews: [
        {
          id: "2.3.C.7-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              'Submitted bird screen is 0.5" x 0.047" stainless steel wire cloth, not the required 3/4" x 0.050" expanded aluminum mesh'
          },
          userReview: {
            status: UserDisposition.NOT_COMPLIANT,
            bookmarkNote:
              "Owner mentioned in call 8/2 they don't need bird screens after all. need sub to remove bird screen from submittal"
          }
        }
      ]
    },
    {
      id: "2.3.C.8",
      requirement: {
        shortDescription:
          "Exposed finishes on standard louvers must match storefront framing."
      },
      productReviews: [
        {
          id: "2.3.C.8-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify exposed finishes match storefront framing."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote:
              "Ask Mike (project manager) what storefront framing finishes will be"
          }
        }
      ]
    },
    {
      id: "2.3.C.9",
      requirement: {
        shortDescription:
          "Concealed steel finishes for standard louvers must be primed per 05 05 13."
      },
      productReviews: [
        {
          id: "2.3.C.9-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify concealed steel finishes are primed per specification 05 05 13."
          },
          userReview: {
            status: UserDisposition.FULFILLED,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.D.1",
      requirement: {
        shortDescription:
          "Standard blade louvers must have a free area of at least 6.99 sq. ft."
      },
      productReviews: [
        {
          id: "2.3.D.1-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              "Submitted free area is 6.81 sq. ft., not the required 6.99 sq. ft."
          },
          userReview: {
            status: null,
            bookmarkNote: null
          }
        }
      ]
    },
    {
      id: "2.3.D.2",
      requirement: {
        shortDescription:
          "Standard blade louvers must have an air flow of 9514 CFM."
      },
      productReviews: [
        {
          id: "2.3.D.2-1",
          productId: standardBladeProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.NOT_COMPLIANT,
            explanation:
              "Submitted air flow is 8920 CFM, not the required 9514 CFM."
          },
          userReview: {
            status: null,
            bookmarkNote: null
          }
        }
      ]
    }
  ]
};

export const materialsArticle: Article = {
  articleDetails: {
    text: "2.4 Materials",
    articleNumber: "2.4"
  },
  requirements: [
    {
      id: "2.4.A.1",
      requirement: {
        shortDescription:
          "Aluminum structural profiles must be ASTM B 308, Alloy 6061-T6."
      },
      productReviews: [
        {
          id: "2.4.A.1-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify aluminum structural profiles meet ASTM B 308, Alloy 6061-T6 specification."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: "no product data confirms this requirement, ask sub"
          }
        },
        {
          id: "2.4.A.1-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify aluminum structural profiles meet ASTM B 308, Alloy 6061-T6 specification."
          },
          userReview: {
            status: UserDisposition.BOOKMARKED,
            bookmarkNote: "no product data confirms this requirement, ask sub"
          }
        }
      ]
    },
    {
      id: "2.4.A.2",
      requirement: {
        shortDescription:
          "Extruded aluminum bars/shapes to be ASTM B 221 with specified alloys."
      },
      productReviews: [
        {
          id: "2.4.A.2-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify extruded aluminum bars/shapes meet ASTM B 221 with specified alloys."
          },
          userReview: {
            status: UserDisposition.NOT_APPLICABLE,
            bookmarkNote: "These product dont have aluminum bars/shapes"
          }
        },
        {
          id: "2.4.A.2-1",
          productId: windLouverProduct.id,
          bixbyReview: {
            status: BixbyPOVDisposition.UNCLEAR,
            explanation:
              "Need to verify extruded aluminum bars/shapes meet ASTM B 221 with specified alloys."
          },
          userReview: {
            status: UserDisposition.NOT_APPLICABLE,
            bookmarkNote: "These product dont have aluminum bars/shapes"
          }
        }
      ]
    }
  ]
};

// Combined array for global stats computation
export const allArticles = [
  manufacturersArticle,
  windDrivenRainArticle,
  standardBladeArticle,
  materialsArticle
];

export const mockOverallData = {
  projectTitle: "Fixed Louvers",
  specSummary: {
    fileName: "fixed_louvers_spec.pdf",
    description:
      "These specs outline the requirements for providing and installing fixed wall louvers including associated materials and procedures.",
    productsDescription:
      "The products section specifies acceptable manufacturers, performance criteria, requisite properties, materials, and accessories for various types of fixed louvers."
  },
  submittalSummary: {
    fileName: "fixed_louvers_submittal.pdf",
    description:
      "The submittal includes the following products: Wind-Driven Rain Resistant Louvers (EHH-501) and Standard Blade Louvers (ESD-435) manufactured by Greenheck.",
    subcontractor: "The subcontractor is LOUVERS 'R US, INC."
  },
  bixbyAssessment: {
    summary:
      "The submitted Standard Blade Louvers (ESD-435) have drainable blades, but the specification requires non-drainable, impermeable multiple-wall and accessory requirements.",
    details: [
      "Both Wind-Driven Rain Resistant (EHH-501) and Standard Blade (ESD-435) louvers exhibit non-compliance with specific dimensional, material, and performance requirements, including blade thickness, free area/airflow, bird screen details, and sill flashing.",
      "The submittal indicates the manufacturer is not providing required items such as aluminum bars/shapes. Finishes must be coordinated with the storefront framing."
    ]
  }
};

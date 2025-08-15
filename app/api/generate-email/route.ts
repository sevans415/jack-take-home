import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, items } = body;

    // Simulate a 3-second delay for LLM processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Check for non-compliant items across all products
    const hasNonCompliant = items.some((item: any) =>
      item.products.some(
        (product: any) =>
          product.status === "NOT_COMPLIANT" ||
          product.userStatus === "not_compliant"
      )
    );
    const hasBookmarked = items.some((item: any) =>
      item.products.some((product: any) => product.userStatus === "bookmarked")
    );

    let subject = "Review Required: ";
    if (hasNonCompliant) {
      subject += "Non-Compliant Items in Submittal";
    } else if (hasBookmarked) {
      subject += "Bookmarked Items Need Clarification";
    } else {
      subject += "Submittal Compliance Review";
    }

    // Add requirement count if multiple
    if (items.length > 1) {
      subject += ` (${items.length} requirements)`;
    }

    // Generate sample email body text
    const emailBody = `Dear ${recipients.map((r: any) => r.name).join(", ")},

I hope this email finds you well. I am writing to bring to your attention several requirements that need review and clarification regarding our current project submission.

After careful review of the specifications and submitted materials, we have identified ${
      items.length
    } requirement${items.length !== 1 ? "s" : ""} that need to be addressed:

${items
  .map((item: any, index: number) => {
    const productsList = item.products
      .map((product: any) => {
        let productNote = product.note ? ` - ${product.note}` : "";
        return `   • ${product.productName}${productNote}`;
      })
      .join("\n");

    return `${index + 1}. ${item.requirement}
   Article: ${item.articleName}
   Affected Products:
${productsList}
   ${item.note ? `Additional Notes: ${item.note}` : ""}`;
  })
  .join("\n\n")}

These requirements have been flagged during our compliance review process. We would appreciate your prompt attention to these matters to ensure the project remains on schedule and meets all specified requirements.

Please review the attached documentation and provide your response at your earliest convenience. If you have any questions or need additional clarification on any of these items, please don't hesitate to reach out.

Thank you for your attention to this matter.

Best regards,
[Your Name]
[Your Title]
[Your Company]`;

    return NextResponse.json({
      success: true,
      emailBody,
      subject,
    });
  } catch (error) {
    console.error("Error generating email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate email" },
      { status: 500 }
    );
  }
}

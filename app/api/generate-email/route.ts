import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, items } = body;

    // Simulate a 3-second delay for LLM processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate subject based on the items
    const hasNonCompliant = items.some(
      (item: any) => item.status === "NOT_COMPLIANT"
    );
    const hasPartiallyCompliant = items.some(
      (item: any) => item.status === "PARTIALLY_COMPLIANT"
    );

    let subject = "Review Required: ";
    if (hasNonCompliant) {
      subject += "Non-Compliant Items in Submittal";
    } else if (hasPartiallyCompliant) {
      subject += "Partially Compliant Items Need Attention";
    } else {
      subject += "Submittal Compliance Review";
    }

    // Add item count if multiple
    if (items.length > 1) {
      subject += ` (${items.length} items)`;
    }

    // Generate sample email body text
    const emailBody = `Dear ${recipients.map((r: any) => r.name).join(", ")},

I hope this email finds you well. I am writing to bring to your attention several items that require review and clarification regarding our current project submission.

After careful review of the specifications and submitted materials, we have identified ${
      items.length
    } item${items.length !== 1 ? "s" : ""} that need to be addressed:

${items
  .map(
    (item: any, index: number) => `
${index + 1}. ${item.productName}
   Article: ${item.articleName}
   Requirement: ${item.requirement}
   Status: ${item.status}
   ${item.note ? `Note: ${item.note}` : ""}
`
  )
  .join("")}

These items have been flagged during our compliance review process. We would appreciate your prompt attention to these matters to ensure the project remains on schedule and meets all specified requirements.

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

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipients, items } = body;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });

    // Prepare context for the LLM
    const recipientNames = recipients.map((r: any) => r.name).join(", ");
    const recipientEmails = recipients.map((r: any) => r.email);

    // Determine the recipient type based on email domain or names
    let recipientType = "team member";
    if (recipientEmails.some((email: string) => email.includes("architect"))) {
      recipientType = "architect";
    } else if (
      recipientEmails.some(
        (email: string) => email.includes("sub") || email.includes("contractor")
      )
    ) {
      recipientType = "subcontractor";
    }

    // Build detailed context about each item
    const itemsContext = items
      .map((item: any, index: number) => {
        const products = item.products
          .map((product: any) => {
            let context = `Product: ${product.productName} (ID: ${product.productId})`;
            context += `\n     Bixby Status: ${product.status}`;
            context += `\n     Bixby Explanation: ${product.explanation}`;
            context += `\n     User Status: ${product.userStatus || "Not set"}`;
            if (product.note) {
              context += `\n     User Note/Question: ${product.note}`;
            }
            return context;
          })
          .join("\n   - ");

        return `Item ${index + 1}:
  Article: ${item.articleNumber} - ${item.articleName}
  Requirement: ${item.requirement}
  Products Affected:
   - ${products}
  ${item.note ? `Additional Context: ${item.note}` : ""}`;
      })
      .join("\n\n");

    // Categorize items by status for better email organization
    const nonCompliantItems = items.filter((item: any) =>
      item.products.some(
        (p: any) =>
          p.status === "NOT_COMPLIANT" || p.userStatus === "not_compliant"
      )
    );
    const bookmarkedItems = items.filter((item: any) =>
      item.products.some((p: any) => p.userStatus === "bookmarked")
    );
    const unclearItems = items.filter((item: any) =>
      item.products.some((p: any) => p.status === "UNCLEAR")
    );

    // Create the prompt for Anthropic
    const prompt = `You are a construction project manager writing an email about submittal compliance issues for fixed louvers. 
    
Context:
- Project: Fixed Louvers installation
- Submittal includes: Wind-Driven Rain Resistant Louvers (EHH-501) and Standard Blade Louvers (ESD-435) by Greenheck
- Subcontractor: LOUVERS 'R US, INC.
- You are writing to: ${recipientNames} (${recipientType})
- Number of items needing attention: ${items.length}

Items requiring attention:
${itemsContext}

Key points to address:
1. Non-compliant items (${nonCompliantItems.length}): These don't meet specifications and need correction
2. Bookmarked items (${bookmarkedItems.length}): These need clarification or have questions
3. Unclear items (${unclearItems.length}): These need additional information

IMPORTANT: Pay special attention to the "User Note/Question" fields - these contain the specific questions or clarifications needed from the recipient.

Generate a professional email that:
1. Opens with a brief summary of what you're reviewing and why you're writing
2. If there are non-compliant items, list them first as they're most urgent
3. Convert user notes/questions into clear ACTION ITEMS (don't create a separate section listing the issues first, jump straight to action items)
4. Be specific about what needs to be done and by when
5. Maintains a professional but friendly tone
6. Closes with next steps and timeline expectations
7. If writing to a subcontractor, be direct about what needs to be corrected in the submittal
8. If writing to an architect, focus on clarification questions and acceptable alternatives

CRITICAL FORMATTING REQUIREMENTS:
- Use PLAIN TEXT ONLY
- DO NOT use any markdown formatting (no **, no *, no #, no backticks)
- DO NOT use markdown bold or italic markers
- Use "ACTION ITEMS:" or similar headers in ALL CAPS
- Use simple dashes (-) for bullet points
- Use line breaks for spacing
- Keep it clean and scannable

Also generate an appropriate subject line that summarizes the key issues (also plain text, no markdown).

Respond in JSON format with two fields:
{
  "subject": "plain text subject line here",
  "body": "plain text email body here"
}`;

    const completion = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Parse the response
    const responseText =
      completion.content[0].type === "text" ? completion.content[0].text : "";

    let emailData;
    try {
      // Try to parse as JSON first
      emailData = JSON.parse(responseText);
    } catch {
      // If not valid JSON, create a fallback structure
      emailData = {
        subject: "Review Required: Submittal Compliance Issues",
        body: responseText,
      };
    }

    // Clean up any markdown formatting that might have slipped through
    const cleanEmailBody = (body: string): string => {
      return (
        body
          // Remove any markdown bold markers just in case
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/__(.*?)__/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/_(.*?)_/g, "$1")
          // Remove any markdown headers
          .replace(/^#{1,6}\s+/gm, "")
          // Remove backticks
          .replace(/`([^`]+)`/g, "$1")
          // Ensure proper line spacing (no more than 2 consecutive newlines)
          .replace(/\n{3,}/g, "\n\n")
          // Trim trailing whitespace from each line
          .replace(/[ \t]+$/gm, "")
          .trim()
      );
    };

    return NextResponse.json({
      success: true,
      emailBody: cleanEmailBody(emailData.body),
      subject: emailData.subject.replace(/\*\*/g, "").replace(/\*/g, ""), // Clean subject too
    });
  } catch (error) {
    console.error("Error generating email:", error);

    // Fallback to a basic template if API fails
    const { recipients, items } = await request.json();

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

    if (items.length > 1) {
      subject += ` (${items.length} requirements)`;
    }

    const emailBody = `Dear ${recipients.map((r: any) => r.name).join(", ")},

I hope this email finds you well. I am writing to bring to your attention several requirements that need review and clarification regarding our Fixed Louvers submittal.

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
  }
}

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getSupabaseAdmin } from "../../supabase";

// 1. Tool to update page metadata
export const updatePageMetadata = tool(
  async ({ pageId, title, description, keywords }) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await (supabase.from("pages") as any)
      .update({
        title,
        meta_description: description,
      })
      .eq("id", pageId)
      .select();

    if (error) return `Error updating metadata: ${error.message}`;

    await (supabase.from("agent_logs") as any).insert({
      goal: "Optimize SEO",
      agent_name: "SEOAgent",
      action: `Updated metadata for page ${pageId}`,
      diff: { title, description, keywords }
    });

    return `Successfully updated metadata for page ${pageId}`;
  },
  {
    name: "update_page_seo",
    description: "Update the SEO title and description for a page.",
    schema: z.object({
      pageId: z.string().describe("The UUID of the page"),
      title: z.string().describe("The SEO title"),
      description: z.string().describe("The meta description"),
      keywords: z.string().optional().describe("Focus keywords"),
    }),
  }
);

// 2. Tool to suggest SEO improvements (Internal implementation)
// This is more of a virtual tool that the agent can use to "think"
export const calculateSeoScore = tool(
  async ({ content }) => {
    // A more complex implementation would analyze keyword density, etc.
    const wordCount = content.split(' ').length;
    let score = 50;
    if (wordCount > 300) score += 20;
    if (content.includes('IV')) score += 10;
    return `SEO Score: ${score}/100. Recommendations: Add more headers, include local keywords like 'Guwahati' or 'Canberra'.`;
  },
  {
    name: "analyze_seo_quality",
    description: "Analyze the content quality and provide a simulated SEO score.",
    schema: z.object({
      content: z.string().describe("The text content to analyze"),
    }),
  }
);

export const seoTools = [updatePageMetadata, calculateSeoScore];

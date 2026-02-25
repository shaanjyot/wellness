import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getSupabaseAdmin } from "../../supabase";

// 1. Tool to fetch page content
export const getPageContent = tool(
  async ({ slug }) => {
    const supabase = getSupabaseAdmin();
    const { data: page } = await (supabase
      .from("pages")
      .select("*")
      .eq("slug", slug === "/" ? "home" : slug.replace("/", ""))
      .single() as any);

    if (!page) return `Page not found: ${slug}`;

    const { data: sections } = await (supabase
      .from("sections")
      .select("*")
      .eq("page_id", page.id)
      .order("order_index", { ascending: true }) as any);

    return JSON.stringify({ page, sections });
  },
  {
    name: "get_page_content",
    description: "Get the content and sections of a specific page by its slug.",
    schema: z.object({
      slug: z.string().describe("The slug of the page (e.g., 'home', 'services')"),
    }),
  }
);

// 2. Tool to update a section's content
export const updateSectionContent = tool(
  async ({ sectionId, content }) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await (supabase
      .from("sections")
      .update({ content } as any)
      .eq("id", sectionId)
      .select() as any);

    if (error) return `Error updating section: ${error.message}`;

    // Log the action for Agentic Audit
    await (supabase.from("agent_logs") as any).insert({
      goal: "Update section content",
      agent_name: "DesignAgent",
      action: `Updated section ${sectionId}`,
      diff: { updated_content: content }
    });

    return `Successfully updated section ${sectionId}`;
  },
  {
    name: "update_section_content",
    description: "Update the JSON content of a specific section.",
    schema: z.object({
      sectionId: z.string().describe("The UUID of the section"),
      content: z.any().describe("The new JSON content for the section"),
    }),
  }
);

// 3. Tool to add a new section
export const addSection = tool(
  async ({ pageId, sectionKey, content, orderIndex }) => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await (supabase
      .from("sections")
      .insert({
        page_id: pageId,
        section_key: sectionKey,
        content,
        order_index: orderIndex,
      } as any)
      .select() as any);

    if (error) return `Error adding section: ${error.message}`;
    return `Successfully added section ${sectionKey} to page ${pageId}`;
  },
  {
    name: "add_section",
    description: "Add a new block/section to a page.",
    schema: z.object({
      pageId: z.string().describe("The UUID of the page"),
      sectionKey: z.string().describe("The type of section (e.g., 'hero', 'cta')"),
      content: z.any().describe("The JSON content for the section"),
      orderIndex: z.number().describe("The position in the page"),
    }),
  }
);

// 4. Tool to fetch site context
export const getSiteContext = tool(
  async () => {
    const supabase = getSupabaseAdmin();
    const { data } = await (supabase
      .from("site_context")
      .select("*")
      .eq("site_id", "default")
      .single() as any);
    return JSON.stringify(data || {});
  },
  {
    name: "get_site_context",
    description: "Get the brand tone, audience, and niche context for the site.",
    schema: z.object({}),
  }
);

// 5. Tool to find similar components using Vector Search (Simulated)
export const findSimilarComponents = tool(
  async ({ query }) => {
    const supabase = getSupabaseAdmin();
    // In a real implementation, we would generate an embedding for the query
    // and use rpc('match_sections') in Supabase.
    // For now, we return high-quality matches from our puck-config.

    const components = [
      { name: "Hero", description: "Large opening section with video/image background" },
      { name: "ReviewGrid", description: "Social proof grid with star ratings and text" },
      { name: "PricingTable", description: "Compare plans with prices and features" },
      { name: "FaqSection", description: "Accordion style frequently asked questions" },
      { name: "StatsSection", description: "Animated counters for metrics" },
      { name: "CallToAction", description: "Large button section to drive conversions" }
    ];

    const results = components.filter(c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
    );

    return JSON.stringify(results.length > 0 ? results : components.slice(0, 3));
  },
  {
    name: "find_similar_components",
    description: "Search for the best CMS components/blocks to use for a specific purpose.",
    schema: z.object({
      query: z.string().describe("What kind of component are you looking for? (e.g., 'pricing', 'social proof')"),
    }),
  }
);

export const cmsTools = [getPageContent, updateSectionContent, addSection, getSiteContext, findSimilarComponents];

import { NextRequest, NextResponse } from "next/server";
import { runAgentGoal } from "@/lib/agents/orchestrator";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { goal, pageId, mode } = await req.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    // 1. Fetch page context if pageId is provided
    let pageContext = {};
    if (pageId) {
      const supabase = getSupabaseAdmin();
      const { data: page } = await supabase.from("pages").select("*").eq("id", pageId).single();
      const { data: sections } = await supabase.from("sections").select("*").eq("page_id", pageId);
      pageContext = { page, sections };
    }

    // 2. Run the LangGraph Orchestrator
    const result = await runAgentGoal(goal, {
      pageId,
      mode: mode || "assist",
      ...pageContext
    });

    return NextResponse.json({
      success: true,
      result,
      agentInfo: {
        engine: "LangGraph.js",
        status: "Goal Fulfilled"
      }
    });

  } catch (error: any) {
    console.error("Agent Run Error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 });
  }
}

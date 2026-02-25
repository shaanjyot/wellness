import { StateGraph, Annotation, MessagesAnnotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { cmsTools } from "./tools/cmsTools";
import { seoTools } from "./tools/seoTools";
import { marketingTools } from "./tools/marketingTools";

// 1. Define the State
// We use MessagesAnnotation to track conversation history
const GraphState = MessagesAnnotation;

// 2. Initialize the Model
// Dynamically choose model based on env
const getModel = () => {
  const modelType = process.env.AGENT_MODEL || "gemini";

  if (modelType.includes("gpt")) {
    return new ChatOpenAI({
      modelName: modelType,
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
  });
};

// 3. Define the Nodes
const callModel = async (state: typeof GraphState.State) => {
  const allTools = [...cmsTools, ...seoTools, ...marketingTools];
  const model = getModel().bindTools(allTools);
  const response = await model.invoke(state.messages);
  return { messages: [response] };
};

// Tool execution node
const toolNode = new ToolNode([...cmsTools, ...seoTools, ...marketingTools]);

// 4. Build the Graph
const workflow = new StateGraph(GraphState)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if ("tool_calls" in lastMessage && (lastMessage.tool_calls as any[]).length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "agent");

// 5. Compile the Graph
export const orchestrator = workflow.compile();

/**
 * Run a goal via the orchestrator
 */
export async function runAgentGoal(goal: string, context?: any) {
  const initialMessage = new HumanMessage(`
    Goal: ${goal}
    Context: ${JSON.stringify(context || {})}

    You are the Agentic CMS Orchestrator. You have access to tools to modify the website content, optimize SEO, and manage the site structure.
    Execute the goal autonomously and report back the results.
  `);

  const config = { configurable: { thread_id: "cms_run_" + Date.now() } };
  const finalState = await orchestrator.invoke({ messages: [initialMessage] }, config);

  return finalState.messages[finalState.messages.length - 1].content;
}

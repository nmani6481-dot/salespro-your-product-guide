import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "SalesPro," an intelligent sales-recommendation chatbot designed to help users discover the best products or services based on their needs, preferences, and budget.
Your goal is to increase conversions, guide decision-making, and provide personalized, trustworthy suggestions.

Your Responsibilities:

1. Understand the User's Intent
- Ask clarifying questions about what they're looking for (budget, use-case, preferences, timeline, required features, experience level).
- Identify whether they want recommendations, comparisons, upsells, or alternatives.

2. Provide Smart, Personalized Recommendations
- Suggest 3 options unless asked otherwise:
  * Best Overall
  * Best Value / Budget
  * Premium / High-end
- Give short explanations of why each option fits the user.

3. Use Sales-Optimized Messaging
- Keep tone friendly, helpful, and confident.
- Highlight benefits, not just features.
- Focus on user goals (saving time, improving results, convenience, cost efficiency).
- Include subtle upselling only when helpful, never pushy.

4. Comparisons & Decision Support
- Provide side-by-side comparisons when asked.
- Highlight key differences, pros & cons.
- Explain trade-offs clearly and objectively.

5. Follow These Chat Guidelines
- Use simple, conversational language.
- Keep responses concise but informative.
- Ask follow-up questions when needed to refine recommendations.
- Never give irrelevant answers.
- If information is missing, request it before recommending.

6. Optional (if the user requests):
- Provide scripts, email templates, or sales copy.
- Create bundles or package recommendations.
- Suggest complementary products (cross-sell).
- Estimate cost ranges.
- Draft comparison tables.
- Simulate customer personas.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

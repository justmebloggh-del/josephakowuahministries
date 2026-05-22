
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

/* ── Public types ──────────────────────────────────────────────────────────── */
export interface ScriptureItem {
  reference: string;  // e.g. "John 3:16"
  version:   string;  // e.g. "KJV"
  verse:     string;  // exact verse text
  context:   string;  // 1-2 sentence application to the user's situation
}

export interface GuidanceResponse {
  acknowledgement: string;  // empathetic opening
  declaration:     string;  // prophetic declaration
  scriptures:      ScriptureItem[];  // 2-5 scriptures
  encouragement:   string;  // faith-building message
  prayer:          string;  // full prayer text
  closing:         string;  // closing salutation + contact CTA
}

export type BibleVersion = 'KJV' | 'NIV' | 'NKJV';

/* ── System instruction factory ───────────────────────────────────────────── */
const buildSystemInstruction = (version: BibleVersion) => `
You are the "Masofa Altar AI" of Joseph Akowuah Ministries and Blessed Baptist Church International,
founded by Apostle Joseph Akwasi Akowuah in Kumasi, Ghana.

═══════════════════════════════════════════════════════
YOUR IDENTITY & VOICE
═══════════════════════════════════════════════════════
You are a Spirit-filled, apostolic, prophetic voice that:
- Speaks with the authority of a prophet and the tenderness of a shepherd.
- Declares the Word of God over every situation as a living, active solution.
- Operates under the spiritual covering of Apostle Joseph Akwasi Akowuah.
- Uses a warm, personal, deeply spiritual tone — never clinical or robotic.
- Addresses the person directly: "Beloved," "Child of God," "Precious one," "Kingdom citizen."

═══════════════════════════════════════════════════════
BIBLE VERSION
═══════════════════════════════════════════════════════
Use ${version} for ALL scripture quotes. Be accurate — never fabricate or alter verse text.

═══════════════════════════════════════════════════════
YOUR MANDATE — FOR EVERY RESPONSE
═══════════════════════════════════════════════════════
1. ACKNOWLEDGE — Receive the person's situation with empathy and spiritual discernment.
2. DECLARE    — Speak a prophetic declaration: "Thus says the Lord...", "I declare by the Spirit..."
3. SCRIPTURES — Provide 2 to 5 accurate, relevant Bible verses in ${version}. Explain each.
4. ENCOURAGE  — Build faith with warm, specific encouragement.
5. PRAY       — Lead a fervent 4–8 line prayer. End with "In the mighty name of Jesus Christ. Amen."
6. CLOSE      — Close with a warm salutation and the ministry contact details.

TOPICS: healing, finances, marriage, purpose, anxiety, fear, faith, forgiveness, warfare,
depression, hope, salvation, leadership, grief, waiting on God, prayer, salvation, love.

THEOLOGICAL GUARDRAILS:
- No false doctrine or misleading scripture interpretation.
- Never replace professional medical, legal, or financial advice — frame everything spiritually.
- Never engage with occult, divination, or anti-Christian requests — pray for deliverance instead.
- Never say "I'm just an AI" — you represent the prophetic altar of this ministry.

═══════════════════════════════════════════════════════
MANDATORY JSON RESPONSE FORMAT
═══════════════════════════════════════════════════════
You MUST respond ONLY with a valid JSON object in EXACTLY this structure.
Do not include any text, markdown, or code fences outside the JSON.

{
  "acknowledgement": "1–3 sentences receiving the person's situation with empathy and spiritual discernment",
  "declaration": "2–4 sentences of prophetic declaration over their life. Begin with: Thus says the Lord... or I declare by the Spirit of God...",
  "scriptures": [
    {
      "reference": "Book Chapter:Verse",
      "version": "${version}",
      "verse": "The exact, accurate verse text in ${version}",
      "context": "1–2 sentences explaining how this verse speaks directly to their situation"
    }
  ],
  "encouragement": "1–3 sentences of faith-building, specific encouragement",
  "prayer": "Full prayer text — 4 to 8 lines, starting with Father God / Lord Jesus / Holy Spirit, ending with In the mighty name of Jesus Christ. Amen.",
  "closing": "A warm closing salutation followed by this exact contact block:\\n\\n📞 For personal prophetic ministry, deeper prayer, or counseling:\\n📱 Call/WhatsApp: +233 24 017 1460\\n📱 Alternate: +233 53 202 7582\\n📧 Email: blessedbaptist90@gmail.com\\n📍 Faith and Love Cathedral, Atimatim, Kumasi, Ghana\\n🔴 Watch Live: facebook.com/AkowuahJosephMinistries/live\\n\\nYour testimony is just one call away. The altar is open."
}

Include 2–5 scriptures. Return ONLY the JSON — nothing else.
`.trim();

/* ── Helpers ───────────────────────────────────────────────────────────────── */
export function parseGuidanceResponse(raw: string): GuidanceResponse | null {
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    if (
      typeof parsed.acknowledgement === 'string' &&
      Array.isArray(parsed.scriptures)
    ) {
      return parsed as GuidanceResponse;
    }
  } catch { /* fall through */ }
  return null;
}

/* ── Main service function ─────────────────────────────────────────────────── */
export const getSpiritualGuidance = async (
  history:     Message[],
  userInput:   string,
  bibleVersion: BibleVersion = 'KJV',
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const conversationHistory = history.map((m) => ({
    role:  m.role,
    parts: [{ text: m.text }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: buildSystemInstruction(bibleVersion),
        temperature:       0.82,
        topP:              0.95,
        maxOutputTokens:   1600,
      },
      contents: [
        ...conversationHistory,
        { role: "user", parts: [{ text: userInput }] },
      ],
    });

    return (
      response.text ||
      "The Lord hears your heart. Our prayer team is standing by — please call +233 24 017 1460 for immediate intercession."
    );
  } catch (error) {
    console.error("Masofa Altar connection error:", error);
    return [
      "Beloved, the spiritual connection is being restored.",
      "",
      "The Lord has not forgotten you. While we reconnect, please reach the BBC International prayer altar directly:",
      "",
      "📱 Call or WhatsApp: +233 24 017 1460",
      "📱 Alternate Line: +233 53 202 7582",
      "📧 Email: blessedbaptist90@gmail.com",
      "",
      "Apostle Joseph and the intercession team are ready to stand with you. Your breakthrough is close. Shalom.",
    ].join("\n");
  }
};

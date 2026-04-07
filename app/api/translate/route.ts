import { NextResponse } from "next/server";

import { TargetLanguage } from "@/lib/types";

const configuredLibreTranslateUrl = process.env.LIBRETRANSLATE_URL;
const libreTranslateCandidates = Array.from(
  new Set(
    [
      configuredLibreTranslateUrl,
      "https://translate.cutie.dating/translate",
      "https://translate.fedilab.app/translate"
    ].filter((value): value is string => Boolean(value))
  )
);
const requestTimeoutMs = 12000;

function isTargetLanguage(value: unknown): value is TargetLanguage {
  return value === "hi" || value === "mr";
}

async function fetchWithTimeout(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
      cache: "no-store"
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function translateWithLibreTranslate(text: string, target: TargetLanguage) {
  if (target === "mr" && !configuredLibreTranslateUrl) {
    throw new Error("Marathi is not available on the default LibreTranslate mirrors right now.");
  }

  let lastError = "LibreTranslate is temporarily unavailable.";

  for (const endpoint of libreTranslateCandidates) {
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target,
        format: "text"
      })
    });

    const payload = (await response.json().catch(() => null)) as { translatedText?: string; error?: string } | null;

    if (response.ok && payload?.translatedText) {
      return payload.translatedText;
    }

    lastError = payload?.error || lastError;
  }

  throw new Error(lastError);
}

function extractGoogleTranslatedText(payload: unknown) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) {
    throw new Error("Fallback translation returned an invalid response.");
  }

  const translatedText = payload[0]
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : ""))
    .join("")
    .trim();

  if (!translatedText) {
    throw new Error("Fallback translation did not return translated text.");
  }

  return translatedText;
}

async function translateWithGoogle(text: string, target: TargetLanguage) {
  const query = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: target,
    dt: "t",
    q: text
  });
  const response = await fetchWithTimeout(`https://translate.googleapis.com/translate_a/single?${query.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Fallback translation is temporarily unavailable.");
  }

  return extractGoogleTranslatedText(await response.json());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { text?: unknown; target?: unknown };
    const text = typeof body.text === "string" ? body.text : "";
    const target = body.target;

    if (!text.trim()) {
      return NextResponse.json({ error: "Text is required for translation." }, { status: 400 });
    }

    if (!isTargetLanguage(target)) {
      return NextResponse.json({ error: "Target language must be hi or mr." }, { status: 400 });
    }

    try {
      const translatedText =
        target === "mr" ? await translateWithGoogle(text, target) : await translateWithLibreTranslate(text, target);

      return NextResponse.json({ translatedText });
    } catch (translationError) {
      try {
        const translatedText = await translateWithGoogle(text, target);
        return NextResponse.json({ translatedText });
      } catch {
        return NextResponse.json(
          {
            error:
              translationError instanceof Error
                ? translationError.message
                : "Translation request failed. Please try again."
          },
          { status: 502 }
        );
      }
    }
  } catch {
    return NextResponse.json(
      {
        error: "Translation request failed. Please verify the input and try again."
      },
      { status: 500 }
    );
  }
}

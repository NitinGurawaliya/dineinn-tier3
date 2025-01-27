import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.STABILITY_API_KEY;

  if (!prompt || !apiKey) {
    return NextResponse.json(
      { error: "Prompt or API key is missing." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-beta-v2-2-2/text-to-image",
      {
        text_prompts: [
          {
            text: prompt, // User-defined prompt
            weight: 1.0, // Ensure weight is included
          },
        ],
        cfg_scale: 7,
        clip_guidance_preset: "FAST_BLUE",
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const image = response.data.artifacts[0].base64;
    return NextResponse.json({ image: `data:image/png;base64,${image}` });
  } catch (error) {
    console.error(
      "Error generating image:",
      error
    );

    return NextResponse.json(
      {
        error:
          error || "Failed to generate the image. Please try again.",
      },
      { status: 500 }
    );
  }
}

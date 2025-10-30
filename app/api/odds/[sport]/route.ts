import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request, { params }: { params: { sport: string } }) {
  try {
    const { sport } = params
    const apiKey = process.env.ODDS_API_KEY

    if (!apiKey) {
      console.error("Missing ODDS_API_KEY environment variable")
      return NextResponse.json(
        { error: "Missing Odds API key (ODDS_API_KEY). Set this environment variable and restart the server." },
        { status: 500 },
      )
    }

    const response = await axios.get(`https://api.the-odds-api.com/v4/sports/${sport}/odds`, {
      params: {
        apiKey,
        regions: "us",
        markets: "h2h",
        oddsFormat: "decimal",
        dateFormat: "iso",
      },
    })

    const games = response.data
    return NextResponse.json(games)
  } catch (error: any) {
    console.error("Error fetching odds - message:", error?.message)
    if (error.response) {
      console.error("Error fetching odds - response status:", error.response.status)
      console.error("Error fetching odds - response data:", JSON.stringify(error.response.data))
    }

    const upstream = error.response?.data

    if (upstream && upstream.error_code === "UNKNOWN_SPORT") {
      try {
        const apiKey = process.env.ODDS_API_KEY
        const sportsResp = await axios.get("https://api.the-odds-api.com/v4/sports", {
          params: { apiKey },
        })
        const available = sportsResp.data
        return NextResponse.json(
          {
            error: "Unknown sport slug",
            upstream,
            available_sports: available,
          },
          { status: 400 },
        )
      } catch (innerErr: any) {
        console.error("Failed to fetch available sports from Odds API:", innerErr?.message || innerErr)
        return NextResponse.json({ error: upstream || "Failed to fetch odds" }, { status: 500 })
      }
    }

    return NextResponse.json({ error: upstream || "Failed to fetch odds" }, { status: 500 })
  }
}

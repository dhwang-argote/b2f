import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const apiKey = process.env.ODDS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Odds API key (ODDS_API_KEY)" }, { status: 500 })
    }

    const response = await axios.get("https://api.the-odds-api.com/v4/sports", {
      params: { apiKey },
    })

    return NextResponse.json(response.data)
  } catch (err: any) {
    console.error("Error fetching sports list from Odds API:", err.response?.data || err.message || err)
    return NextResponse.json(
      { error: err.response?.data || err.message || "Failed to fetch sports list" },
      { status: 500 },
    )
  }
}

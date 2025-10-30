import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: NextRequest, context: { params: Promise<{ sport: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { sport } = resolvedParams;
    const apiKey = process.env.ODDS_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Odds API key" }, { status: 500 })
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

    if (!Array.isArray(games) || games.length === 0) {
      return NextResponse.json({ message: `No games available for ${sport}` })
    }

    const picks = games.map((game: any) => {
      if (!game.bookmakers || game.bookmakers.length === 0) return null
      let bestPick: { price: number; name: string } | null = null
      let bestBookmaker: string | null = null

      game.bookmakers.forEach((bookmaker: any) => {
        const outcomes = Array.isArray(bookmaker.markets?.[0]?.outcomes) ? bookmaker.markets[0].outcomes : []
        const validOutcomes = outcomes.filter((o: any) => typeof o.price === "number" && typeof o.name === "string")

        if (validOutcomes.length === 0) return

        const favorite = validOutcomes.reduce((a: any, b: any) => (a.price < b.price ? a : b), validOutcomes[0])

        if (!bestPick || favorite.price < bestPick.price) {
          bestPick = favorite
          bestBookmaker = bookmaker.title
        }
      })

      if (!bestPick || !bestBookmaker) return null

      const pick = bestPick as { price: number; name: string }
      const pickObj = {
        matchup: `${game.home_team} vs ${game.away_team}`,
        recommended_pick: pick.name,
        best_odds: pick.price,
        bookmaker: bestBookmaker,
        start_time: game.commence_time,
      }

      console.log("[Shark Picks] Pick:", pickObj)
      return pickObj
    })

    const validPicks = picks.filter(Boolean)

    if (validPicks.length === 0) {
      console.warn("[Shark Picks] No valid picks found for sport:", sport)
      return NextResponse.json({ message: `No valid picks available for ${sport}` })
    }

    return NextResponse.json(validPicks)
  } catch (err: any) {
    console.error("Shark Picks error:", err.response?.data || err.message || err)
    return NextResponse.json({ error: "Failed to fetch Shark Picks" }, { status: 500 })
  }
}

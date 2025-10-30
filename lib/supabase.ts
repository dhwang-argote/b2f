export type CreateTradeInput = {
	challengeId: number
	sport: string
	market: string
	selection: string
	odds: number
	stake: number
}

export async function createTrade(input: CreateTradeInput): Promise<any> {
	try {
		const res = await fetch(`/api/trades`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(input),
		});
		// If the route exists and returns JSON, pass it through
		if (res.ok) return res;
		// Fall through to local stub on non-OK
	} catch {
		// Network/server not available; fall back to stub below
	}
	// Stub response for development: mimic minimal shape the caller expects
	return {
		id: Math.floor(Math.random() * 1_000_000),
		challengeId: input.challengeId,
		sport: input.sport,
		market: input.market,
		selection: input.selection,
		odds: input.odds,
		stake: input.stake,
		createdAt: new Date().toISOString(),
		result: null,
		profitLoss: null,
		json: async function () { return this },
	};
}

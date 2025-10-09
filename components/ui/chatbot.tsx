import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  picks?: PickItem[];
}

interface PickItem {
  id?: string;
  matchup?: string;
  recommended_pick?: string;
  best_odds?: number | string;
  bookmaker?: string;
  profit_on_100?: string;
  start_time?: string;
  raw?: any;
}

const Chatbot = () => {
  const [visiblePicks, setVisiblePicks] = useState(5);
  // Track visible picks per bot message id so previous answers remain visible
  const [visiblePicksMap, setVisiblePicksMap] = useState<Record<string, number>>({});
  const [showHelp, setShowHelp] = useState(true);
  const supportedSports = [
    { name: 'EPL (Soccer)', example: 'EPL picks' },
    { name: 'NBA (Basketball)', example: 'NBA odds' },
    { name: 'MLB (Baseball)', example: 'MLB Shark Picks' },
    { name: 'NFL (Football)', example: 'NFL picks' },
    { name: 'NHL (Hockey)', example: 'NHL odds' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm here to help you with any questions about Bet2Fund. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const commonQuestions = [
    'How does the funding process work?',
    'What are the challenge requirements?',
    'How much can I earn?',
    'What sports can I trade?',
    'How do payouts work?',
    'Get EPL Shark Picks',
    'Get EPL Odds',
    'Get NBA Shark Picks',
    'Get NBA Odds',
    'Get MLB Shark Picks',
    'Get MLB Odds',
    'Get NFL Shark Picks',
    'Get NFL Odds',
    'Get NHL Shark Picks',
    'Get NHL Odds',
    'Get Tennis Shark Picks',
    'Get Tennis Odds',
  ];

  const quickAnswers: { [key: string]: string } = {
    'How does the funding process work?':
      'You start by purchasing a challenge, prove your skills by meeting the profit target, and then receive a funded account to trade with our capital.',
    'What are the challenge requirements?':
      'Make 33% profit within 30 days while staying within the 15% maximum drawdown limit and completing at least 5 trading days.',
    'How much can I earn?':
      'You keep 70-80% of profits depending on your challenge level. Our top traders earn $10K+ monthly.',
    'What sports can I trade?':
      'You can trade on all major sports including NFL, NBA, MLB, NHL, soccer, tennis, and more.',
    'How do payouts work?':
      'Payouts are processed bi-weekly to daily depending on your account level, directly to your bank account or preferred payment method.',
  };

  const sendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    // show typing indicator while preparing bot response
    setBotTyping(true);

    setTimeout(async () => {
      let botText = quickAnswers[text];
      // Prepare a botMessage object here so we can attach picks to it during the fetch handling
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        isUser: false,
        timestamp: new Date(),
      };

      const sportMap: { [key: string]: string } = {
        epl: 'soccer_epl',
        nba: 'basketball_nba',
        mlb: 'baseball_mlb',
        nfl: 'americanfootball_nfl',
        nhl: 'icehockey_nhl',
        tennis: 'tennis_atp',
      };

      const lowerText = text.toLowerCase();
      const sportKey = Object.keys(sportMap).find((key) => lowerText.includes(key));
      const wantsShark = lowerText.includes('shark');
      const wantsOdds = lowerText.includes('odds');
      const wantsPick = lowerText.includes('pick');

      if (!botText && sportKey && (wantsShark || wantsOdds || wantsPick)) {
        setIsLoading(true);
        try {
          let endpoint = '';
          if (wantsShark) {
            endpoint = `/api/shark-picks/${sportMap[sportKey]}`;
          } else if (wantsOdds) {
            endpoint = `/api/odds/${sportMap[sportKey]}`;
          } else {
            endpoint = `/api/shark-picks/${sportMap[sportKey]}`;
          }

          const res = await fetch(`http://localhost:5000${endpoint}`);
          const data = await res.json();
          console.log('[Chatbot API Response]', data);

          if (data && typeof data === 'object' && data.error) {
            botText = `Sorry, ${data.error}. Please check the sport or try again later.`;
          } else if (Array.isArray(data) && data.length > 0) {
            // Convert API response into structured pick objects for nicer UI rendering
            const picksArr: PickItem[] = data.map((pick: any, i: number) => {
              const bestOdds = pick.best_odds || pick.odds ||
                (pick.bookmakers?.[0]?.markets?.[0]?.outcomes ?
                  pick.bookmakers[0].markets[0].outcomes[0].price : undefined);

              const potentialProfit = bestOdds ? (Number(bestOdds) * 100 - 100).toFixed(2) : undefined;

              return {
                id: pick.id?.toString() || String(i),
                matchup: pick.matchup || (pick.away_team && pick.home_team ? `${pick.away_team} vs ${pick.home_team}` : undefined),
                recommended_pick: pick.recommended_pick || pick.pick || undefined,
                best_odds: bestOdds,
                bookmaker: pick.bookmaker || (pick.bookmakers?.[0]?.title) || undefined,
                profit_on_100: potentialProfit ? `$${potentialProfit}` : undefined,
                start_time: pick.start_time || pick.commence_time || undefined,
                raw: pick,
              };
            });

            // Attach picks directly to our prepared botMessage so earlier answers remain visible
            botMessage.picks = picksArr;
            // Keep bot message text simple; we render detailed cards in the UI
            botText = `Here are ${picksArr.length} picks:`;
          } else if (data && typeof data === 'object' && data.message) {
            botText = data.message;
          } else {
            botText = `No picks available for ${sportKey ? sportKey.toUpperCase() : 'this sport'} right now.`;
          }
        } catch (err) {
          console.error('[Chatbot Fetch Error]', err);
          botText = `Failed to fetch picks. Please try again later.`;
        }
        setIsLoading(false);
      }

      if (!botText) {
        botText =
          "Thanks for your question! For detailed assistance, please contact our support team at support@bet2fund.com or during business hours (9am-5pm EST) for live chat.";
      }

      // finalize bot message and append
      botMessage.text = isLoading ? 'Fetching picks...' : botText;
      if (botMessage.picks && botMessage.picks.length > 0) {
        setVisiblePicksMap(prev => ({ ...prev, [botMessage.id]: 5 }));
      }
      setMessages((prev) => [...prev, botMessage]);
      // hide typing indicator after bot message is appended
      setBotTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-[0_0_15px_rgba(0,178,255,0.7)] flex items-center justify-center transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[84px] right-6 z-50 w-[380px] h-[500px] bg-[#121212]/95 backdrop-blur-sm border border-primary/30 rounded-xl shadow-[0_0_25px_rgba(0,178,255,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold">Bet2Fund Support</h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-white/80 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-white/5 p-2 text-xs text-white/80 border-b border-primary/20">
              <div className="flex items-center">
                <button
                  className="text-primary font-semibold text-xs px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                  onClick={() => setShowHelp(!showHelp)}
                  aria-label={showHelp ? 'Hide Help' : 'Show Help'}
                  style={{ minWidth: 70, textAlign: 'left' }}
                >
                  {showHelp ? 'Hide Help' : 'Show Help'}
                </button>
              </div>
              {showHelp && (
                <div className="mt-2">
                  <div className="mb-1 font-semibold text-primary">Supported Sports & Example Questions:</div>
                  <ul className="mb-1 list-disc pl-4">
                    {supportedSports.map((sport, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-semibold">{sport.name}:</span> <span className="text-white/90">{sport.example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1  overflow-y-auto p-4 space-y-3">
              {messages.map((message, idx) => {
                // Only show See More for messages that contain picks and where not all picks are visible
                const picksForMsg = message.picks || [];
                const visibleForMsg = visiblePicksMap[message.id] ?? 5;
                const isLastBotMsgWithPicks = !message.isUser && picksForMsg.length > visibleForMsg;

                function loadMorePicks(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
                  event.preventDefault();
                  const current = visiblePicksMap[message.id] ?? 5;
                  const total = picksForMsg.length;
                  const newVisible = Math.min(current + 5, total);
                  setVisiblePicksMap(prev => ({ ...prev, [message.id]: newVisible }));
                }

                // If this bot message has picks, render the structured picks as cards
                const isBotWithCards = !message.isUser && (message.picks || []).length > 0;

                if (isBotWithCards) {
                  const cards = picksForMsg.slice(0, visibleForMsg).map((pick: PickItem, pIdx: number) => (
                    <div key={pick.id || pIdx} className="py-2">
                      <div className="bg-white/6 text-white/90 rounded-md p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{pick.matchup || 'Matchup'}</div>
                            {pick.recommended_pick && (
                              <div className="text-xs text-white/90 mt-1">⭐ Pick: <span className="font-medium">{pick.recommended_pick}</span></div>
                            )}
                            <div className="text-xs text-white/80 mt-1">📊 Odds: <span className="font-medium">{pick.best_odds ?? 'N/A'}</span></div>
                            {pick.profit_on_100 && (
                              <div className="text-xs text-white/80 mt-1">💰 Profit on $100: <span className="font-medium">{pick.profit_on_100}</span></div>
                            )}
                            {pick.bookmaker && (
                              <div className="text-xs text-white/80 mt-1">🏦 Bookmaker: <span className="font-medium">{pick.bookmaker}</span></div>
                            )}
                            <div className="text-xs text-white/70 mt-1">⏰ {pick.start_time ? new Date(pick.start_time).toLocaleString() : 'Time TBD'}</div>
                          </div>
                        </div>
                      </div>
                      {/* Divider */}
                      {pIdx < Math.min(picksForMsg.length, visibleForMsg) - 1 && <div className="h-px bg-white/8 my-2" />}
                    </div>
                  ));

                  return (
                    <div key={message.id} className="flex justify-start w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-[95%]"
                      >
                        <div className="mb-2 text-xs text-white/80">{message.text}</div>
                        <div className="space-y-0">{cards}</div>
                        {isLastBotMsgWithPicks && (
                          <div className="mt-2 flex items-center justify-center">
                            <button
                              className="text-xs text-primary bg-white/5 px-3 py-1 rounded-md hover:bg-white/8"
                              onClick={loadMorePicks}
                            >
                              📈 Show More ({visibleForMsg}/{picksForMsg.length})
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  );
                }

                // Fallback: render normal message bubble
                const displayText = message.text;

                return (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`max-w-[75%] px-3 py-2 rounded-lg ${message.isUser ? 'bg-primary text-white' : 'bg-white/10 text-white/90'}`}
                    >
                      <p className="text-sm whitespace-pre-line">{displayText}</p>
                    </motion.div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {botTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white/90 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                      <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
                      <span className="ml-2 text-xs text-white/70">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-primary"
                />
                <Button type="submit" size="sm" className="px-3 py-2 bg-primary hover:bg-primary/90">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

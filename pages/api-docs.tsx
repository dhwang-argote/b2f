import React from 'react';
import Layout from '@/components/layout/layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const ApiDocs = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">API Documentation</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Access sports data and trading capabilities through our developer API
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-white">API Resources</h2>
              <ul className="space-y-3">
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Authentication</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Sports Data</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Odds</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Account</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Trading</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Analytics</li>
              </ul>
              
              <h2 className="text-xl font-bold mt-8 mb-6 text-white">Developer Tools</h2>
              <ul className="space-y-3">
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">API Keys</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">SDKs</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Code Examples</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Rate Limits</li>
                <li className="text-white/80 hover:text-primary cursor-pointer transition-colors">Webhooks</li>
              </ul>
              
              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/30">
                <h3 className="text-sm font-semibold text-primary">Need Help?</h3>
                <p className="text-white/70 text-sm mt-2">
                  Our developer support team is available to answer any questions you may have.
                </p>
                <Button variant="outline" className="w-full mt-4 border-primary/60 text-white hover:bg-primary/10">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">API Overview</h2>
                  <p className="text-white/80 mb-4">
                    The Bet2Fund API provides programmatic access to sports data, odds, and trading capabilities. With our API, you can:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-white/80 mb-6">
                    <li>Access real-time odds from multiple bookmakers</li>
                    <li>Place trades programmatically</li>
                    <li>Retrieve account information and trading history</li>
                    <li>Receive webhooks for market updates and trade settlements</li>
                    <li>Build custom trading applications and analytics tools</li>
                  </ul>
                  <p className="text-white/80">
                    Our API is RESTful and returns data in JSON format. All API requests must be made over HTTPS.
                  </p>
                </div>
                
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Getting Started</h2>
                  <ol className="list-decimal pl-6 space-y-4 text-white/80">
                    <li>
                      <strong className="text-white">Create an account</strong> - Sign up for a Bet2Fund account if you haven't already.
                    </li>
                    <li>
                      <strong className="text-white">Generate API keys</strong> - Navigate to your account settings to generate API keys.
                    </li>
                    <li>
                      <strong className="text-white">Make your first request</strong> - Use the examples provided to make your first API request.
                    </li>
                    <li>
                      <strong className="text-white">Explore the documentation</strong> - Familiarize yourself with the available endpoints and features.
                    </li>
                  </ol>
                </div>
                
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">Base URL</h2>
                  <div className="bg-[#080808] p-4 rounded border border-primary/30 mb-4 font-mono text-white/90">
                    https://api.bet2fund.com/v1
                  </div>
                  <p className="text-white/80">
                    All API requests should be made to this base URL followed by the specific endpoint path.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="authentication">
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Authentication</h2>
                  <p className="text-white/80 mb-6">
                    The Bet2Fund API uses API keys to authenticate requests. You can view and manage your API keys in your account settings.
                  </p>
                  <p className="text-white/80 mb-4">
                    Authentication is performed by providing your API key in the request header:
                  </p>
                  <div className="bg-[#080808] p-4 rounded border border-primary/30 mb-6 font-mono text-white/90">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                  <p className="text-white/80 mb-6">
                    Keep your API keys secure and do not share them publicly. If you believe your API key has been compromised, you should regenerate it immediately from your account settings.
                  </p>
                  <h3 className="text-xl font-semibold mb-3 text-white">API Key Types</h3>
                  <ul className="list-disc pl-6 space-y-2 text-white/80">
                    <li>
                      <strong className="text-white">Public Key</strong> - Used for read-only operations like retrieving odds and sports data.
                    </li>
                    <li>
                      <strong className="text-white">Private Key</strong> - Required for operations that involve account access or trading.
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-white">Example Authentication Request</h2>
                  <div className="bg-[#080808] p-4 rounded border border-primary/30 mb-4 font-mono text-white/90 overflow-x-auto">
{`curl -X GET "https://api.bet2fund.com/v1/account" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </div>
                  <p className="text-white/80">
                    This request retrieves your account information using your API key for authentication.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="endpoints">
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">API Endpoints</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Sports Data</h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /sports</span>
                            <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns a list of all available sports.</p>
                        </div>
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /sports/{'{sport_key}'}</span>
                            <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns detailed information about a specific sport.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Odds</h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /odds/{'{sport_key}'}</span>
                            <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns current odds for a specific sport.</p>
                        </div>
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /odds/{'{sport_key}'}/{'{event_id}'}</span>
                            <span className="text-xs bg-green-900/40 text-green-400 px-2 py-1 rounded">Public</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns current odds for a specific event.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Account & Trading</h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /account</span>
                            <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded">Private</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns your account information.</p>
                        </div>
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">GET /account/trades</span>
                            <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded">Private</span>
                          </div>
                          <p className="text-white/80 text-sm">Returns your trading history.</p>
                        </div>
                        <div className="p-4 border border-primary/10 rounded bg-black/20">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">POST /trades</span>
                            <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-1 rounded">Private</span>
                          </div>
                          <p className="text-white/80 text-sm">Places a new trade.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="examples">
                <div className="bg-[#121212]/70 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-white">Code Examples</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">JavaScript</h3>
                      <div className="bg-[#080808] p-4 rounded border border-primary/30 font-mono text-white/90 overflow-x-auto">
{`// Fetch upcoming NBA games and odds
const fetchNBAOdds = async () => {
  const apiKey = 'YOUR_API_KEY';
  
  try {
    const response = await fetch('https://api.bet2fund.com/v1/odds/basketball_nba', {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      }
    });
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching NBA odds:', error);
  }
};

fetchNBAOdds();`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Python</h3>
                      <div className="bg-[#080808] p-4 rounded border border-primary/30 font-mono text-white/90 overflow-x-auto">
{`# Place a trade
import requests
import json

api_key = 'YOUR_API_KEY'
url = 'https://api.bet2fund.com/v1/trades'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

trade_data = {
    'sport': 'basketball_nba',
    'market': 'h2h',
    'selection': 'Los Angeles Lakers',
    'odds': 2.10,
    'stake': 100
}

response = requests.post(url, headers=headers, data=json.dumps(trade_data))
print(response.json())`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">Node.js</h3>
                      <div className="bg-[#080808] p-4 rounded border border-primary/30 font-mono text-white/90 overflow-x-auto">
{`// Get account information
const axios = require('axios');

const getAccountInfo = async () => {
  const apiKey = 'YOUR_API_KEY';
  
  try {
    const response = await axios.get('https://api.bet2fund.com/v1/account', {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`
      }
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching account info:', error.response?.data || error.message);
  }
};

getAccountInfo();`}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 text-center">
              <p className="text-white/80 mb-6">
                Ready to start building with the Bet2Fund API?
              </p>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-2 shadow-[0_0_15px_rgba(0,178,255,0.5)]">
                  Get API Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApiDocs;
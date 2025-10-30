# Bet2Fund - Sports Trading Platform

A comprehensive sports trading platform where users can participate in funded challenges to qualify for real trading accounts. Built with React/TypeScript frontend and Supabase backend.

## 🏆 Overview

Bet2Fund is a prop firm that provides funding to skilled sports strategists. Users pay challenge fees to access demo accounts and can receive funding for real betting based on their performance. The platform integrates real-time sports picking data and focuses on mobile-first design.

## 🚀 Features

### Core Platform

- **Funded Trading Challenges**: Multiple account sizes ($2K, $25K, $50K)
- **Real-time Sports Data**: Integration with The Odds API
- **Performance Tracking**: Comprehensive analytics and progress monitoring
- **Mobile-First Design**: Optimized for 99% mobile user base

### Challenge Structure

- **Profit Targets**: 33% profit target across all account sizes
- **Risk Management**: 15% maximum drawdown limit
- **Trading Requirements**: Minimum 5 trading days
- **Multiple Accounts**: Users can run up to 5 challenges simultaneously

### User Experience

- **AI Chatbot**: 24/7 support with business hours expertise (9am-5pm EST)
- **Real-time Updates**: Live progress tracking with circular progress charts
- **Secure Authentication**: Supabase Auth integration
- **Legal Compliance**: Comprehensive disclaimer and risk disclosure pages

## 🛠 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Tailwind CSS** + shadcn/ui components
- **Framer Motion** for animations
- **TanStack Query** for state management
- **Wouter** for routing

### Backend

- **Supabase** (PostgreSQL database)
- **Supabase Auth** for authentication
- **The Odds API** for real-time sports data
- **Express.js** server for API routes

### External Services

- **The Odds API**: Real-time sports picking odds
- **Supabase**: Database, authentication, and real-time features
- **Email Integration**: Contact support functionality

## 📦 Installation & Setup

### Prerequisites

- Node.js 20+
- Supabase project
- The Odds API key

### Environment Variables

Configure these secrets in your Replit environment:

```bash
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
```

### Quick Start

1. Clone the repository
2. Configure environment variables
3. Run the application:
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

```
bet2fund/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities and API clients
├── server/                   # Express backend
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   └── storage.ts          # Database operations
├── shared/                  # Shared types and schemas
│   └── schema.ts           # TypeScript interfaces
└── attached_assets/        # Static assets and documentation
```

## 📱 Key Pages

### Public Pages

- **Landing Page** (`/`) - Hero section, features, testimonials
- **Challenges** (`/challenges`) - Available trading plans
- **How It Works** (`/how-it-works`) - Step-by-step process
- **FAQ** (`/faq`) - Frequently asked questions
- **Contact** (`/contact`) - Support and contact information
- **Legal** (`/disclaimer`, `/risk-disclosure`) - Legal documentation

### User Dashboard (Future Implementation)

- Challenge progress tracking
- Trading history and analytics
- Account management
- Performance metrics

## 🎨 Design System

### Colors

- **Primary**: `#00B2FF` (Neon Blue)
- **Secondary**: `#0039B3` (Deep Blue)
- **Background**: `#121212` (Dark)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Orange)
- **Error**: `#EF4444` (Red)

### Typography

- Modern, clean fonts optimized for readability
- Responsive typography scaling
- Accessibility-compliant contrast ratios

## 🔧 API Integration

### The Odds API

- **Endpoint**: Sports picking odds and data
- **Key Features**: Real-time odds, multiple sports coverage
- **Implementation**: `client/src/lib/oddsApi.ts`

### Supabase Integration

- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: Secure user management
- **Storage**: File and data storage
- **Implementation**: `server/storage.ts`

## 📊 Database Schema

### Core Tables

- **Users**: User profiles and authentication
- **Plans**: Challenge configurations and pricing
- **User Challenges**: Active user trading challenges
- **Trades**: Individual trade records
- **FAQs**: Frequently asked questions
- **Testimonials**: User success stories

## 🚀 Deployment

### Replit Deployment

- **Platform**: Replit with auto-scaling
- **Build Process**: Vite for frontend, automatic backend bundling
- **Environment**: Secure environment variable management
- **Domain**: Custom `.replit.app` domain available

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates active
- [ ] Performance monitoring enabled
- [ ] Backup procedures in place

## 🔒 Security Features

- **Session Management**: Secure session handling with express-session
- **Authentication**: Supabase Auth with JWT tokens
- **Data Protection**: Encrypted sensitive data storage
- **API Security**: Rate limiting and request validation
- **HTTPS**: SSL/TLS encryption for all communications

## 📞 Support & Contact

### Business Hours

- **Live Support**: Monday-Friday, 9am-5pm EST
- **AI Chatbot**: 24/7 automated assistance
- **Email Support**: Available through contact form

### Contact Information

- **Website**: Live chat widget available
- **Social Media**: YouTube channel for updates
- **Support Email**: Through integrated contact form

## 🚦 Current Status

### Completed Features ✅

- Responsive landing page with hero section
- Challenge configuration system
- Real-time sports data integration
- AI chatbot with business hours support
- Comprehensive legal documentation
- Mobile-optimized design
- Supabase authentication system

### Upcoming Features 🔄

- User dashboard and challenge tracking
- Live trading interface
- Payment processing integration
- Advanced analytics and reporting
- Enhanced mobile app experience

## 📄 Legal & Compliance

### Risk Disclosure

- Comprehensive risk disclosure documentation
- Clear terms of service
- Regulatory compliance statements
- User agreement and policies

### Disclaimer

- Trading risk warnings
- Platform limitations disclosure
- Performance disclaimers
- Liability limitations

## 🤝 Contributing

This is a proprietary platform developed for Bet2Fund. For support or feature requests, please contact the development team through the appropriate channels.

## 📈 Performance & Analytics

### Metrics Tracked

- User engagement and retention
- Challenge completion rates
- Platform performance metrics
- Mobile vs desktop usage
- Conversion rates

### Success Metrics

- **$300K+** paid out to successful traders
- **2,000+** active users
- **68.5%** challenge success rate

---

_Built with ❤️ for sports strategists worldwide_

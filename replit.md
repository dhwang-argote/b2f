# Bet2Fund - Sports Trading Platform

## Overview

Bet2Fund is a comprehensive sports trading platform that operates as a prop firm for sports strategists. The platform allows users to participate in funded challenges to qualify for real trading accounts. Built with a modern React/TypeScript frontend and Supabase backend, it provides a mobile-first experience for sports picking simulation and trader evaluation.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and data fetching
- **Animations**: Framer Motion for smooth user interactions

### Backend Architecture

- **Runtime**: Node.js with Express.js server
- **Database**: Supabase (PostgreSQL) for data persistence and real-time features
- **Authentication**: Supabase Auth with session management
- **Session Storage**: Express sessions with memory store for development
- **API Integration**: The Odds API for real-time sports picking odds

## Key Components

### Authentication System

- User registration and login with email/password
- Session-based authentication with Supabase
- Protected routes for authenticated users
- Role-based access control (admin functionality)

### Challenge System

- Multiple account sizes ($2K, $25K, $50K)
- 33% profit target across all account levels
- 15% maximum drawdown limit
- Minimum 5 trading days requirement
- Support for up to 5 simultaneous challenges per user

### Sports Data Integration

- Real-time NBA betting odds via The Odds API
- Live moneyline, point spread, and totals
- Multiple sportsbook comparisons
- Simulated trading environment with virtual "profit points"

### User Interface

- Mobile-first responsive design (99% mobile user base)
- Real-time progress tracking with circular progress charts
- Comprehensive dashboard with trading analytics
- Educational resources and sports picking guides

## Data Flow

1. **User Registration**: Users create accounts through Supabase Auth
2. **Challenge Purchase**: Users select and purchase trading challenges
3. **Sports Data**: Real-time odds fetched from The Odds API
4. **Trade Simulation**: Virtual trades tracked against real market data
5. **Performance Evaluation**: Progress monitored against profit targets and risk limits
6. **Funding Qualification**: Successful traders receive funding for real accounts

## External Dependencies

### Core Services

- **Supabase**: Primary database, authentication, and real-time features
- **The Odds API**: Real-time sports picking odds and market data
- **Email Services**: Contact and support functionality

### Development Tools

- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing and optimization

### UI Libraries

- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Zod**: Schema validation

## Deployment Strategy

### Development Environment

- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Hot-reload with Vite dev server
- **Port Configuration**: Local port 5000, external port 80

### Production Build

- **Build Process**: Vite builds frontend to `dist/public`, ESBuild bundles server
- **Deployment Target**: Autoscale deployment on Replit
- **Asset Management**: Static assets served from build directory
- **Environment Variables**: Supabase credentials and session secrets

### Configuration Files

- **Vite Config**: Handles frontend build and development server
- **TypeScript Config**: Shared configuration for client, server, and shared modules
- **Tailwind Config**: Custom design system with shadcn/ui integration

## Changelog

- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.

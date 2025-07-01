# Social Media Application - GenZ

## Overview

This is a full-stack social media application built with React, Express, and TypeScript. The application features a modern social media interface with posts, stories, user interactions, and an admin dashboard. It uses a client-server architecture with shared type definitions and includes both in-memory storage and PostgreSQL database support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks with local storage persistence
- **Build Tool**: Vite with hot module replacement
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Storage**: PostgreSQL database with full CRUD operations
- **API**: RESTful API with `/api` prefix for posts, comments, stories

### Development Setup
- **Monorepo Structure**: Client, server, and shared code in single repository
- **Hot Reloading**: Vite development server with Express middleware
- **Type Safety**: Shared TypeScript definitions across client and server

## Key Components

### Client Structure
- **Components**: Modular React components for UI elements
  - `SplashScreen`: Animated loading screen
  - `Sidebar`: Navigation with user profile
  - `Stories`: Instagram-style story carousel
  - `CreatePost`: Post creation interface
  - `Post`: Individual post display with interactions
  - `AdminDashboard`: Administrative interface
  - `TrendingPanel`: Trending topics and user suggestions

### Server Structure
- **Routes**: Express route handlers in `/api` namespace
- **Storage**: Abstracted storage interface supporting multiple backends
- **Middleware**: Request logging and error handling

### Shared Resources
- **Schema**: Drizzle ORM schema definitions
- **Types**: TypeScript interfaces for data models
- **Validation**: Zod schemas for input validation

## Data Flow

### User Interactions
1. User actions trigger React component state updates
2. Local storage provides immediate persistence
3. API calls synchronize with backend storage
4. Real-time updates through React state management

### Post Management
1. Posts created through `CreatePost` component
2. Data validated using shared schemas
3. Stored in dual storage system (memory + database)
4. Displayed through `Post` components with interaction handlers

### Admin Operations
1. Admin dashboard provides user and post management
2. Statistics calculated from storage layer
3. CRUD operations through storage interface

## External Dependencies

### Core Framework Dependencies
- **React**: UI framework with hooks and context
- **Express**: Web server framework
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation

### UI/UX Dependencies
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel functionality

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production

### Database Dependencies
- **Neon Serverless**: PostgreSQL database provider
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express middleware
- **Hot Reloading**: Automatic refresh on code changes
- **In-Memory Storage**: Fast development with mock data

### Production Environment
- **Build Process**: 
  1. Vite builds client-side React application
  2. ESBuild bundles server-side Express application
  3. Static files served from `/dist/public`
- **Database**: PostgreSQL with Drizzle migrations
- **Environment Variables**: `DATABASE_URL` for database connection

### Replit Integration
- **Runtime Error Overlay**: Development error handling
- **Cartographer Plugin**: Replit-specific tooling
- **Environment Detection**: Automatic Replit configuration

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Added PostgreSQL database integration with full schema:
  - Users table with profile information
  - Posts table with content and media support
  - Comments table with nested relationships
  - Stories table for story features
  - Implemented DatabaseStorage class replacing MemStorage
  - Added API endpoints for CRUD operations
  - Populated database with sample data
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
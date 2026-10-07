# DevTinder — Frontend

**Discover developers. Build connections. Create together.**

DevTinder is a modern developer networking and collaboration platform that enables developers to discover talent, form meaningful connections through skill-based matching, and collaborate in real-time through integrated chat, video calling, project boards, and coding challenges.

---

## Architecture Overview

DevTinder frontend is built as a production-grade, SaaS-style single-page application (SPA) leveraging modern React patterns, Redux Toolkit for state management, Socket.IO for real-time features, and PeerJS for WebRTC peer-to-peer video calling.

```
┌──────────────────────────────────────────────────────────────────┐
│                       DevTinder Frontend                          │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   React 18   │  │ Redux Toolkit │  │ React Router │           │
│  │   Vite 6.0   │  │    v2.5.4     │  │    v7.0.2    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               State Management (Redux)                    │   │
│  │  • userSlice          • notificationSlice                 │   │
│  │  • feedSlice          • connectionSlice                   │   │
│  │  • requestSlice                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │             Real-Time Communication Layer                 │   │
│  │  • Socket.IO Client (Messages, Typing, Calls)            │   │
│  │  • PeerJS (WebRTC Video/Audio, Screen Share)             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   REST API Client                         │   │
│  │  • Axios (with credentials, base URL, interceptors)      │   │
│  │  • JWT Cookies (httpOnly, secure, SameSite=Lax)          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                Design System & Styling                    │   │
│  │  • Tailwind CSS v3.4                                      │   │
│  │  • DaisyUI v4.12 (24 themes)                              │   │
│  │  • Framer Motion v11 (scroll, gestures, animations)      │   │
│  │  • Custom Glassmorphism Tokens                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                             ↓ ↑
┌──────────────────────────────────────────────────────────────────┐
│                   DevTinder Backend (Express)                     │
│       REST APIs + Socket.IO + MongoDB + Cloudinary + JWT          │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **UI Framework** | React | 18.3.1 | Component-based UI |
| **Build Tool** | Vite | 6.0.9 | Fast dev server, optimized builds |
| **State Management** | Redux Toolkit | 2.5.4 | Global state (user, feed, connections, requests) |
| **Routing** | React Router DOM | 7.0.2 | Client-side routing, protected routes |
| **Styling** | Tailwind CSS | 3.4.16 | Utility-first CSS framework |
| **Component Library** | DaisyUI | 4.12.14 | Pre-built Tailwind components, 24 themes |
| **Animations** | Framer Motion | 11.15.0 | Scroll triggers, drag gestures, page transitions |
| **HTTP Client** | Axios | 1.7.9 | REST API calls with interceptors |
| **Real-Time Chat** | Socket.IO Client | 4.8.1 | WebSocket messaging, typing indicators, read receipts |
| **Video/Audio** | PeerJS | 1.5.5 | WebRTC peer-to-peer calling, screen sharing |
| **Form Validation** | validator | 13.12.0 | Email, password, phone number validation |
| **Media Upload** | Cloudinary (custom integration) | N/A | Profile photo, attachment uploads |

---

## Feature Matrix

| Feature | Components | Backend APIs | Socket Events | Description |
|---------|-----------|--------------|---------------|-------------|
| **Authentication** | `Login.jsx` | `/auth/signUp`, `/auth/login`, `/auth/logout` | — | JWT-based authentication with httpOnly cookies |
| **Developer Discovery** | `Feed.jsx`, `SwipeableCard.jsx`, `FeedFilter.jsx` | `/feed` | — | Tinder-style swipe interface with skill-based filtering |
| **Connection Management** | `Connections.jsx`, `Requests.jsx` | `/request/send`, `/request/review`, `/request/status` | — | Send, accept, ignore, and view connection requests |
| **Real-Time Chat** | `Chat.jsx` | `/chat/:userId` | `sendMessage`, `typing`, `messageRead` | One-on-one messaging with typing indicators and read receipts |
| **Video/Audio Calling** | `VideoCall.jsx` | — | `startCall`, `endCall`, `answerCall`, `callRejected` | WebRTC peer-to-peer calling with screen share |
| **Profile Management** | `Profile.jsx`, `EditProfile.jsx`, `Onboarding.jsx` | `/profile/view`, `/profile/edit`, `/profile/photo` | — | View, edit, and upload profile photos |
| **Collaborative Projects** | `ProjectBoard.jsx` | `/projects` (planned) | — | Post project ideas, find collaborators |
| **Coding Challenges** | `CodingChallenges.jsx` | `/challenges` (planned) | — | Weekly algorithm challenges with streak tracking |
| **Activity Feed** | `ActivityFeed.jsx` | `/activity` (planned) | — | Developer status updates and quick posts |
| **Profile Analytics** | `ProfileAnalytics.jsx` | `/analytics` (planned) | — | Views, match rate, response rate, visibility score (demo data) |
| **GitHub Integration** | `GitHubConnect.jsx` (planned) | `/github/connect` (planned) | — | Link GitHub, showcase repos, contributions |
| **Notifications** | `NavBar.jsx` (dropdown), Redux `notificationSlice` | — | `notification` | Real-time match, message, and request notifications |

---

## Design System Tokens

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| **Brand Dark (Background)** | `#050816` | Page background, deep space |
| **Brand Surface** | `#0B1020` | Elevated panels, card containers |
| **Brand Card** | `#111827` | Secondary surfaces, nested cards |
| **Sub-surface** | `#1E293B` | Tertiary depth, hover states |
| **Violet (Primary)** | `#7C3AED` | Primary CTA buttons, brand accent |
| **Light Violet** | `#8B5CF6` | Hover states, active indicators |
| **Electric Blue** | `#2563EB` | Links, interactive elements |
| **Sky Cyan** | `#06B6D4` | Accent gradients, highlights |
| **Success (Emerald)** | `#22C55E` | Success states, match indicators |
| **Warning (Amber)** | `#F59E0B` | Warning states, challenge badges |
| **Error (Rose)** | `#EF4444` | Error states, destructive actions |
| **Info (Sky)** | `#38BDF8` | Informational badges, tooltips |

### Glassmorphism Utilities

```css
/* Glass panel effect */
.glass-panel {
  background: rgba(11, 16, 32, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Primary glow effect */
.glow-primary {
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.6), 0 0 40px rgba(124, 58, 237, 0.3);
}

/* Cyan glow effect */
.glow-cyan {
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3);
}

/* Brand gradient text */
.brand-gradient-text {
  background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Grid pattern background */
.grid-pattern {
  background-image: 
    linear-gradient(rgba(124, 58, 237, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124, 58, 237, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

### Typography Hierarchy

| Element | Class | Font Weight | Tracking |
|---------|-------|-------------|----------|
| **Hero Heading** | `text-5xl sm:text-6xl` | `font-black` (900) | `tracking-tight` |
| **Page Heading** | `text-3xl sm:text-4xl` | `font-black` (900) | `tracking-tight` |
| **Section Heading** | `text-2xl` | `font-bold` (700) | `tracking-tight` |
| **Card Title** | `text-lg` | `font-bold` (700) | Normal |
| **Body Text** | `text-sm sm:text-base` | `font-normal` (400) | Normal |
| **Caption** | `text-xs` | `font-medium` (500) | `tracking-wide` |
| **Mono Label** | `text-[11px] font-mono` | `font-semibold` (600) | `tracking-wider` |

---

## Environment Variables

Create a `.env` file in the `devTinder-frontend/` directory:

```bash
# Backend API base URL
VITE_API_URL=http://localhost:3000

# Cloudinary configuration (for profile photo uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_here
```

**Important Notes:**
- All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client.
- The Cloudinary upload preset must be **unsigned** for direct client-side uploads.
- Never commit `.env` files to version control. Use `.env.example` as a template.

---

## Setup Instructions

### Prerequisites
- **Node.js** v18.x or higher
- **npm** v9.x or higher
- **Git**
- A running DevTinder backend instance (see `dev-tinder-backend/README.md`)

### Installation

1. **Clone the repository** (if not already cloned):
   ```bash
   git clone <repository-url>
   cd DevTinder/devTinder-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your backend URL and Cloudinary credentials
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173` by default.

5. **Verify backend connection**:
   - Ensure the backend is running at the URL specified in `VITE_API_URL`.
   - The frontend will attempt to authenticate on load and redirect to `/login` if no session exists.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with hot module replacement (HMR) |
| `npm run build` | Build production bundle (output: `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality (if configured) |

---

## Project Structure

```
devTinder-frontend/
├── public/
│   ├── favicon.svg                 # Vector brand favicon
│   ├── devtinder-logo.svg          # Static brand logo asset
│   └── manifest.json               # PWA manifest (theme color, icons)
├── src/
│   ├── app/
│   │   └── store.js                # Redux store configuration
│   ├── assets/                     # Static images, icons (if any)
│   ├── components/
│   │   ├── ui/
│   │   │   └── Logo.jsx            # Custom brand logo component
│   │   ├── landing/                # Modular landing page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── CapabilitiesGrid.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── DiscoveryShowcase.jsx
│   │   │   ├── ChatShowcase.jsx
│   │   │   ├── VideoShowcase.jsx
│   │   │   ├── ProjectShowcase.jsx
│   │   │   ├── GithubShowcase.jsx
│   │   │   ├── ChallengesShowcase.jsx
│   │   │   └── FinalCTA.jsx
│   │   ├── ActivityFeed.jsx        # Developer status posts
│   │   ├── Body.jsx                # App shell (renders all routes)
│   │   ├── Chat.jsx                # Real-time chat component
│   │   ├── CodingChallenges.jsx    # Weekly challenges
│   │   ├── Connections.jsx         # Connections list
│   │   ├── EditProfile.jsx         # Profile editing form
│   │   ├── ErrorBoundary.jsx       # Error boundary wrapper
│   │   ├── Feed.jsx                # Swiping feed container
│   │   ├── FeedFilter.jsx          # Skill/experience filters
│   │   ├── Footer.jsx              # Global footer
│   │   ├── LandingPage.jsx         # Landing page composition
│   │   ├── Login.jsx               # Auth (Login + Signup)
│   │   ├── MatchModal.jsx          # Match celebration modal
│   │   ├── NavBar.jsx              # Global navigation bar
│   │   ├── Onboarding.jsx          # Multi-step onboarding flow
│   │   ├── Profile.jsx             # User profile view
│   │   ├── ProfileAnalytics.jsx    # Analytics dashboard
│   │   ├── ProjectBoard.jsx        # Collaborative projects
│   │   ├── Requests.jsx            # Connection requests inbox
│   │   ├── Shimmer.jsx             # Loading skeletons
│   │   ├── SwipeableCard.jsx       # Single swipeable card
│   │   ├── ThemeToggle.jsx         # DaisyUI theme switcher
│   │   ├── ToastNotifications.jsx  # Toast notifications (if standalone)
│   │   └── VideoCall.jsx           # WebRTC video call UI
│   ├── hooks/
│   │   ├── useAuth.js              # Authentication hook
│   │   ├── useConnections.js       # Connections hook
│   │   ├── useFeed.js              # Feed hook
│   │   ├── useInfiniteScroll.js    # Infinite scroll pagination
│   │   ├── useNotifications.js     # Notification management
│   │   └── useRequests.js          # Requests hook
│   ├── redux/
│   │   ├── connectionSlice.js      # Connections state slice
│   │   ├── feedSlice.js            # Feed state slice
│   │   ├── notificationSlice.js    # Notifications state slice
│   │   ├── requestSlice.js         # Requests state slice
│   │   └── userSlice.js            # User state slice
│   ├── services/
│   │   ├── api.js                  # Axios instance, REST API calls
│   │   ├── cloudinary.js           # Cloudinary upload helper
│   │   ├── peerService.js          # PeerJS initialization, call logic
│   │   └── socketService.js        # Socket.IO client, event handlers
│   ├── utils/
│   │   ├── constants.js            # App-wide constants
│   │   └── validators.js           # Form validation helpers
│   ├── App.jsx                     # Root component (wraps ErrorBoundary, Router)
│   ├── index.css                   # Global styles, design tokens
│   └── main.jsx                    # Vite entry point (ReactDOM render)
├── .env.example                    # Example environment variables
├── .gitignore
├── eslint.config.js                # ESLint configuration
├── index.html                      # HTML entry point
├── package.json
├── postcss.config.js               # PostCSS configuration (Tailwind)
├── README.md                       # This file
├── tailwind.config.js              # Tailwind + DaisyUI configuration
└── vite.config.js                  # Vite configuration
```

---

## Production Build

To create an optimized production build:

```bash
npm run build
```

This will:
- Compile and bundle all React components
- Tree-shake unused code
- Minify JavaScript and CSS
- Generate a `dist/` folder ready for deployment

**Deployment Targets:**
- **Static Hosting**: Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront
- **Server-Side**: Serve `dist/` via Nginx, Apache, or Node.js static server

**Build Verification Checklist:**
- ✅ Zero Vite compilation errors
- ✅ No console warnings in production build
- ✅ All environment variables prefixed with `VITE_`
- ✅ Correct `VITE_API_URL` pointing to production backend
- ✅ All assets (favicon, logo) correctly referenced
- ✅ Service worker (if applicable) registered and functioning

---

## Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Fully supported |
| Firefox | 88+ | Fully supported |
| Safari | 14+ | Fully supported |
| Edge | 90+ | Fully supported |
| Opera | 76+ | Fully supported |

**WebRTC Requirements:**
- Secure context (HTTPS) required for getUserMedia (camera/mic access)
- Peer-to-peer calling may require STUN/TURN servers for NAT traversal (PeerJS default: `0.peerjs.com`)

---

## Design Principles

1. **Glassmorphism First**: Frosted glass panels (`backdrop-blur-xl`), subtle borders (`border-white/10`), layered depth.
2. **Dark Mode Native**: Default dark theme with 24 DaisyUI theme alternatives.
3. **Radiant Gradients**: Violet-to-cyan, amber-to-orange, emerald-to-teal for CTAs, badges, and accents.
4. **SVG Icons Over Emoji**: Scalable Heroicons v2 for professional, consistent iconography.
5. **Honest UI**: Demo/sample data explicitly labeled (e.g., "Demo Analytics Preview" badge).
6. **Shimmer Skeletons**: Gradient shimmer animations during loading states.
7. **Keyboard & Accessibility**: ARIA labels, semantic HTML, keyboard navigation support.

---

## Known Limitations & Future Enhancements

### Current Limitations
- **Profile Analytics**: Backend analytics endpoints not yet implemented; frontend displays demo data with explicit labeling.
- **GitHub Integration**: Planned feature; component scaffolding exists but not connected to backend.
- **Coding Challenges**: Backend challenge submission and leaderboard APIs are placeholders.
- **Activity Feed**: Backend activity feed endpoints return mock data or 404.

### Planned Enhancements
- [ ] Implement live profile analytics with backend integration
- [ ] GitHub OAuth flow and repository showcase
- [ ] Real-time collaborative code editor for pair programming
- [ ] Advanced feed filtering (location, availability, project type)
- [ ] Progressive Web App (PWA) with offline support
- [ ] End-to-end tests (Playwright / Cypress)
- [ ] Accessibility audit and WCAG 2.1 AA compliance

---

## Troubleshooting

### Common Issues

**Problem**: `npm run dev` fails with `EADDRINUSE` error.
- **Solution**: Another process is using port 5173. Kill the process or change the port in `vite.config.js`.

**Problem**: API calls return 404 or CORS errors.
- **Solution**: Verify `VITE_API_URL` in `.env` matches the running backend URL. Ensure backend CORS allows `http://localhost:5173`.

**Problem**: Socket.IO connection fails (chat/notifications not working).
- **Solution**: Check backend Socket.IO server is running and accessible. Verify `socketService.js` connects to correct URL.

**Problem**: Video calling doesn't work.
- **Solution**: Ensure HTTPS (or localhost). Check browser permissions for camera/mic. Verify PeerJS server is reachable.

**Problem**: Cloudinary image uploads fail.
- **Solution**: Verify `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are correct. Ensure upload preset is **unsigned**.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository** and create a feature branch (`feature/your-feature-name`).
2. **Follow the existing code style**: Use Prettier/ESLint configurations.
3. **Test your changes**: Verify no regressions in core flows (login, swiping, chat, video).
4. **Write meaningful commit messages**: Use conventional commits (e.g., `feat:`, `fix:`, `docs:`).
5. **Submit a pull request** with a clear description of changes and motivation.

---

## License

This project is licensed under the **MIT License**. See `LICENSE` file for details.

---

## Support & Community

- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join community discussions for Q&A and feature ideas
- **Email**: support@devtinder.dev (placeholder)

---

**Built with ❤️ by developers, for developers.**

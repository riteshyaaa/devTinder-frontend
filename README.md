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

---

**Built with ❤️ by Ritesh Yadav, for developers.**

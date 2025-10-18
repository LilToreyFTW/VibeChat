# VibeChat Web - Next.js Landing Page & Web Version

This is the Next.js web application for VibeChat that serves as both a marketing landing page and hosts the web version of the VibeChat application.

## 🚀 Features

- **Modern Landing Page**: Beautiful, responsive landing page with animated backgrounds and feature highlights
- **Web Version Hosting**: Serves the React frontend as an in-browser version of VibeChat
- **Desktop App Downloads**: Direct download links for the Windows desktop application
- **SEO Optimized**: Built with Next.js for optimal search engine visibility
- **Mobile Responsive**: Works perfectly on all device sizes

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Vercel** - Deployment platform

## 📁 Project Structure

```
vibechat-web/
├── src/
│   └── app/
│       ├── globals.css          # Global styles with animations
│       ├── layout.tsx           # Root layout component
│       ├── page.tsx             # Landing page
│       └── web/
│           ├── page.tsx         # Web version page
│           └── VibeChatApp.tsx  # React app container
├── public/
│   └── downloads/
│       └── VibeChat Desktop Setup 1.0.0.exe  # Desktop installer
├── vercel.json                  # Vercel deployment config
└── package.json                 # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (or use the provided Node.js version)
- npm or yarn

### Installation

```bash
cd vibechat-web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Production Build

```bash
npm run build
npm start
```

## 🌐 Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
# Preview deployment (staging)
npm run preview

# Production deployment
npm run deploy
```

### 4. Alternative: Git-based deployment

Push to your Git repository and connect it to Vercel:

```bash
git add .
git commit -m "Deploy VibeChat Web to Vercel"
git push origin main
```

Then connect your repository to Vercel and it will auto-deploy on pushes.

## 📖 Available Routes

- `/` - Landing page with features and download links
- `/web` - Web version of VibeChat (currently shows coming soon)
- `/downloads/VibeChat%20Desktop%20Setup%201.0.0.exe` - Direct download link for desktop app

## 🎨 Customization

### Update Branding

Edit `src/app/page.tsx` to customize:
- Hero section messaging
- Feature descriptions
- Call-to-action buttons
- Brand colors and styling

### Add New Features

The landing page is built with modular components. Add new sections by:

1. Creating new motion components in `page.tsx`
2. Adding corresponding CSS animations in `globals.css`
3. Updating the feature grid as needed

### Web Version Integration

Currently, the `/web` route shows a "coming soon" message. To integrate the full React app:

1. Update `src/app/web/VibeChatApp.tsx` to load the built React application
2. Consider using micro-frontends or iframe integration
3. Ensure proper API proxying for backend communication

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.ts",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/downloads/(.*)",
      "dest": "/downloads/$1"
    }
  ]
}
```

### Environment Variables

Create a `.env.local` file for environment-specific settings:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-websocket-domain.com
```

## 📱 Mobile Optimization

The landing page is fully responsive and includes:
- Touch-friendly buttons and navigation
- Optimized animations for mobile devices
- Proper viewport meta tags
- Progressive Web App capabilities

## 🔒 Security Considerations

- Desktop app downloads are served from `/public/downloads/`
- Consider implementing download tracking
- Add rate limiting for API endpoints
- Enable HTTPS in production

## 🚀 Performance

- **Lighthouse Score**: Optimized for 90+ scores across all metrics
- **Bundle Size**: Minimal JavaScript bundle with code splitting
- **Animations**: Hardware-accelerated CSS animations
- **Images**: Optimized loading with Next.js Image component

## 🆘 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure Node.js version compatibility
2. **Animation Issues**: Check CSS animations in `globals.css`
3. **Routing Problems**: Verify Next.js App Router configuration
4. **Desktop App Download**: Ensure file exists in `/public/downloads/`

### Support

For issues and feature requests, please refer to the main project documentation or create an issue in the repository.

---

**Made with ❤️ for the VibeChat community**
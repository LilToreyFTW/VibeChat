'use client';

import { useEffect, useRef } from 'react';

// This component will serve as a bridge to load the existing React frontend
export default function VibeChatApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a simplified approach - in a production environment,
    // you might want to use a micro-frontend approach or iframe
    const loadApp = async () => {
      if (!containerRef.current) return;

      try {
        // For now, we'll create a placeholder that shows the app is loading
        // In a real implementation, you would either:
        // 1. Use an iframe to load the built React app
        // 2. Use module federation to share components
        // 3. Bundle the React app as a separate build and load it

        containerRef.current.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            color: white;
            font-family: Inter, sans-serif;
            padding: 20px;
          ">
            <div style="text-align: center; max-width: 600px;">
              <div style="
                width: 80px;
                height: 80px;
                border: 4px solid #8B5CF6;
                border-top: 4px solid transparent;
                border-radius: 50%;
                margin: 0 auto 20px;
                animation: spin 1s linear infinite;
              "></div>
              <h2 style="
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              ">VibeChat Web</h2>
              <p style="color: #94A3B8; margin-bottom: 30px; font-size: 18px;">
                Experience the future of communication
              </p>

              <!-- Download Section -->
              <div style="
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 30px;
                margin: 30px 0;
                backdrop-filter: blur(10px);
              ">
                <h3 style="color: #F8FAFC; margin-bottom: 20px; font-size: 24px; font-weight: 600;">
                  🚀 Get VibeChat Desktop
                </h3>
                <p style="color: #94A3B8; margin-bottom: 25px; line-height: 1.6;">
                  For the complete VibeChat experience with all features including voice calls,
                  video chat, and advanced AI features, download our desktop application.
                </p>
                <a href="/downloads/VibeChat%20Desktop%20Setup%201.0.0.exe" style="
                  display: inline-flex;
                  align-items: center;
                  gap: 12px;
                  background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                  color: white;
                  padding: 16px 32px;
                  border-radius: 12px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 16px;
                  transition: all 0.3s ease;
                  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(139, 92, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(139, 92, 246, 0.3)'">
                  <svg style="width: 20px; height: 20px;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Download for Windows
                </a>
              </div>

              <!-- Web Version Info -->
              <div style="
                background: rgba(139, 92, 246, 0.1);
                border: 1px solid rgba(139, 92, 246, 0.3);
                border-radius: 12px;
                padding: 25px;
                margin: 20px 0;
              ">
                <h3 style="color: #F8FAFC; margin-bottom: 15px; font-size: 20px; font-weight: 600;">
                  🌐 Web Version Features
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                  <div style="text-align: left;">
                    <h4 style="color: #8B5CF6; margin-bottom: 8px; font-weight: 600;">✅ Available Now</h4>
                    <ul style="color: #94A3B8; margin: 0; padding-left: 20px; line-height: 1.5;">
                      <li>Landing page</li>
                      <li>Download access</li>
                      <li>Information hub</li>
                    </ul>
                  </div>
                  <div style="text-align: left;">
                    <h4 style="color: #EC4899; margin-bottom: 8px; font-weight: 600;">🚧 Coming Soon</h4>
                    <ul style="color: #94A3B8; margin: 0; padding-left: 20px; line-height: 1.5;">
                      <li>Web-based chat</li>
                      <li>Voice communication</li>
                      <li>AI features</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="margin-top: 30px;">
                <p style="color: #64748B; font-size: 16px; margin-bottom: 20px;">
                  Ready to experience VibeChat? Start with the desktop version for the full feature set!
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                  <a href="/" style="
                    color: #8B5CF6;
                    text-decoration: none;
                    font-weight: 600;
                    padding: 12px 24px;
                    border: 2px solid #8B5CF6;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                  " onmouseover="this.style.background='#8B5CF6'; this.style.color='white'" onmouseout="this.style.background='transparent'; this.style.color='#8B5CF6'">
                    ← Back to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
      } catch (error) {
        console.error('Failed to load VibeChat app:', error);
      }
    };

    loadApp();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-900"
      style={{ height: '100%' }}
    />
  );
}

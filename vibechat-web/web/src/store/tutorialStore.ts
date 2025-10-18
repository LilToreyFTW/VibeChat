import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'wait' | 'navigate';
  required?: boolean;
  completed?: boolean;
  skippable?: boolean;
}

export interface TutorialState {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  isVisible: boolean;
  completedSteps: Set<string>;
  isCompleted: boolean;
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeStep: (stepId: string) => void;
  goToStep: (stepIndex: number) => void;
  resetTutorial: () => void;
  setTutorialVisibility: (visible: boolean) => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to VibeChat! 🎉',
    description: 'Hi there! I\'m your friendly guide to help you get started with VibeChat. This quick tutorial will show you everything you need to know to start chatting, creating rooms, and connecting with others!',
    position: 'center',
    action: 'wait',
    required: true,
  },
  {
    id: 'dashboard-overview',
    title: 'Your Dashboard',
    description: 'This is your personal dashboard - your command center for all things VibeChat! Here you can see your rooms, create new ones, and manage your bots.',
    targetElement: '.dashboard-header',
    position: 'bottom',
    action: 'wait',
  },
  {
    id: 'create-room',
    title: 'Create Your First Room',
    description: 'Let\'s start by creating your first chat room! Click the "Create Room" button to begin. This is where you\'ll invite friends and start conversations.',
    targetElement: '.create-room-btn',
    position: 'top',
    action: 'click',
    required: true,
  },
  {
    id: 'room-list',
    title: 'Your Chat Rooms',
    description: 'Here you can see all your created rooms. Each room has a unique code that you can share with friends to invite them to join your conversations.',
    targetElement: '.my-rooms-section',
    position: 'top',
    action: 'wait',
  },
  {
    id: 'room-code',
    title: 'Room Codes & Sharing',
    description: 'Every room has a unique code (like "ABC123"). Copy this code and share it with friends - they can use it to join your room instantly!',
    targetElement: '.room-code-copy',
    position: 'left',
    action: 'click',
  },
  {
    id: 'navigation-intro',
    title: 'Navigation Menu',
    description: 'Use the navigation menu to move around the app. You can access your rooms, create bots, and manage your account from here.',
    targetElement: '.navigation-menu',
    position: 'right',
    action: 'hover',
  },
  {
    id: 'bots-intro',
    title: 'AI Bots - Your Digital Friends!',
    description: 'Create AI-powered bots to keep your rooms lively! Bots can moderate chats, provide information, play games, and much more. Click "Create Bot" to make your first one!',
    targetElement: '.create-bot-nav',
    position: 'bottom',
    action: 'click',
  },
  {
    id: 'bot-features',
    title: 'Bot Features',
    description: 'Bots can do amazing things! They can answer questions, moderate conversations, play music, tell jokes, and even learn from your room\'s personality.',
    targetElement: '.bots-section',
    position: 'top',
    action: 'wait',
  },
  {
    id: 'chat-intro',
    title: 'Joining & Chatting',
    description: 'When you\'re ready to chat, click "Join Chat" on any room. You\'ll enter a real-time conversation where you can talk with friends and bots!',
    targetElement: '.join-chat-btn',
    position: 'top',
    action: 'click',
  },
  {
    id: 'settings-profile',
    title: 'Your Profile & Settings',
    description: 'Click your avatar to access your profile, settings, and account options. You can customize your experience and manage your preferences here.',
    targetElement: '.profile-menu',
    position: 'bottom',
    action: 'click',
  },
  {
    id: 'tutorial-complete',
    title: 'You\'re All Set! 🚀',
    description: 'Congratulations! You now know everything you need to start using VibeChat. Remember, you can always come back to this tutorial by clicking the help icon. Have fun chatting!',
    position: 'center',
    action: 'wait',
    required: true,
  },
];

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      steps: tutorialSteps,
      isVisible: false,
      completedSteps: new Set(),
      isCompleted: false,

      startTutorial: () => {
        set({
          isActive: true,
          currentStep: 0,
          isVisible: true,
          completedSteps: new Set(),
          isCompleted: false,
        });
      },

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        } else {
          set({ isCompleted: true, isActive: false });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      skipTutorial: () => {
        set({
          isActive: false,
          isVisible: false,
          isCompleted: true,
        });
      },

      completeStep: (stepId: string) => {
        const { completedSteps } = get();
        const newCompletedSteps = new Set(completedSteps);
        newCompletedSteps.add(stepId);
        set({ completedSteps: newCompletedSteps });
      },

      goToStep: (stepIndex: number) => {
        const { steps } = get();
        if (stepIndex >= 0 && stepIndex < steps.length) {
          set({ currentStep: stepIndex });
        }
      },

      resetTutorial: () => {
        set({
          isActive: false,
          currentStep: 0,
          isVisible: false,
          completedSteps: new Set(),
          isCompleted: false,
        });
      },

      setTutorialVisibility: (visible: boolean) => {
        set({ isVisible: visible });
      },
    }),
    {
      name: 'vibechat-tutorial',
      partialize: (state) => ({
        isCompleted: state.isCompleted,
        completedSteps: Array.from(state.completedSteps),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        completedSteps: new Set((persistedState as any)?.completedSteps || []),
      }),
    }
  )
);

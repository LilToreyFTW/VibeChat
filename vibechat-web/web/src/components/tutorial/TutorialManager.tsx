import React from 'react';
import { useTutorialStore } from '../../store/tutorialStore';
import TutorialWelcome from './TutorialWelcome';
import TutorialOverlay from './TutorialOverlay';

interface TutorialManagerProps {
  children: React.ReactNode;
}

const TutorialManager: React.FC<TutorialManagerProps> = ({ children }) => {
  const { isActive, isVisible } = useTutorialStore();

  const handleTutorialComplete = () => {
    // Tutorial completed successfully
    console.log('Tutorial completed!');
  };

  const handleTutorialSkip = () => {
    // Tutorial skipped
    console.log('Tutorial skipped!');
  };

  return (
    <>
      {children}

      {/* Tutorial Components */}
      <TutorialWelcome
        onStart={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />

      <TutorialOverlay
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />
    </>
  );
};

export default TutorialManager;

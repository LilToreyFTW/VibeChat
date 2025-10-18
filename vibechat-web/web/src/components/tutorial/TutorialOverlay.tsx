import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Fade,
  Backdrop,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  SkipNext as SkipIcon,
  Help as HelpIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { useTutorialStore, TutorialStep } from '../../store/tutorialStore';

interface TutorialOverlayProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete, onSkip }) => {
  const {
    isActive,
    currentStep,
    steps,
    isVisible,
    nextStep,
    prevStep,
    skipTutorial,
    completeStep,
    completedSteps,
    isCompleted,
  } = useTutorialStore();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const currentTutorialStep = steps[currentStep];

  useEffect(() => {
    if (!currentTutorialStep?.targetElement || !isVisible) {
      setTargetElement(null);
      setHighlightPosition(null);
      return;
    }

    const element = document.querySelector(currentTutorialStep.targetElement) as HTMLElement;
    if (element) {
      setTargetElement(element);
      const rect = element.getBoundingClientRect();
      setHighlightPosition({
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      });
    }
  }, [currentTutorialStep, isVisible]);

  useEffect(() => {
    if (isCompleted && onComplete) {
      onComplete();
    }
  }, [isCompleted, onComplete]);

  const handleNext = () => {
    if (currentTutorialStep) {
      completeStep(currentTutorialStep.id);
    }
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSkip = () => {
    skipTutorial();
    if (onSkip) {
      onSkip();
    }
  };

  const handleClose = () => {
    skipTutorial();
  };

  if (!isActive || !isVisible || !currentTutorialStep) {
    return null;
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Dark backdrop overlay */}
      <Backdrop
        open={true}
        sx={{
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Highlighted element border */}
      {highlightPosition && (
        <Box
          sx={{
            position: 'fixed',
            top: highlightPosition.top,
            left: highlightPosition.left,
            width: highlightPosition.width,
            height: highlightPosition.height,
            border: '3px solid #4CAF50',
            borderRadius: '8px',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
              },
            },
          }}
        />
      )}

      {/* Tutorial tooltip/card */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 10000,
          ...getTooltipPosition(currentTutorialStep.position || 'center'),
        }}
      >
        <Fade in={true}>
          <Paper
            elevation={8}
            sx={{
              maxWidth: 400,
              minWidth: 320,
              p: 3,
              backgroundColor: 'background.paper',
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
            }}
          >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  mr: 2,
                  width: 40,
                  height: 40,
                }}
              >
                <HelpIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {currentTutorialStep.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Step {currentStep + 1} of {steps.length}
                </Typography>
              </Box>
              {!currentTutorialStep.required && (
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{ color: 'text.secondary' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Progress bar */}
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 2, height: 6, borderRadius: 3 }}
            />

            {/* Description */}
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {currentTutorialStep.description}
            </Typography>

            {/* Step indicators */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
              {steps.slice(0, 6).map((step, index) => (
                <Chip
                  key={step.id}
                  icon={
                    completedSteps.has(step.id) ? (
                      <CheckIcon fontSize="small" />
                    ) : (
                      <UncheckedIcon fontSize="small" />
                    )
                  }
                  label={index + 1}
                  size="small"
                  variant={index === currentStep ? 'filled' : 'outlined'}
                  color={index === currentStep ? 'primary' : 'default'}
                  sx={{ minWidth: 32 }}
                />
              ))}
              {steps.length > 6 && (
                <Typography variant="caption" color="text.secondary">
                  ... +{steps.length - 6} more
                </Typography>
              )}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                {!isFirstStep && (
                  <Button
                    startIcon={<PrevIcon />}
                    onClick={handlePrev}
                    size="small"
                    variant="outlined"
                  >
                    Previous
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!currentTutorialStep.required && !isLastStep && (
                  <Button
                    endIcon={<SkipIcon />}
                    onClick={handleSkip}
                    size="small"
                    variant="text"
                    color="inherit"
                  >
                    Skip Tutorial
                  </Button>
                )}

                <Button
                  variant="contained"
                  endIcon={isLastStep ? <CheckIcon /> : <NextIcon />}
                  onClick={handleNext}
                  size="small"
                >
                  {isLastStep ? 'Complete' : 'Next'}
                </Button>
              </Box>
            </Box>

            {/* Required step indicator */}
            {currentTutorialStep.required && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Chip
                  label="Required Step"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </Box>
            )}
          </Paper>
        </Fade>
      </Box>
    </>
  );
};

// Helper function to position the tooltip
const getTooltipPosition = (position: TutorialStep['position']) => {
  const baseStyles = {
    transform: 'translate(-50%, -50%)',
  };

  switch (position) {
    case 'top':
      return {
        top: '20%',
        left: '50%',
        ...baseStyles,
      };
    case 'bottom':
      return {
        top: '80%',
        left: '50%',
        ...baseStyles,
      };
    case 'left':
      return {
        top: '50%',
        left: '20%',
        transform: 'translate(-100%, -50%)',
      };
    case 'right':
      return {
        top: '50%',
        left: '80%',
        transform: 'translate(0%, -50%)',
      };
    case 'center':
    default:
      return {
        top: '50%',
        left: '50%',
        ...baseStyles,
      };
  }
};

export default TutorialOverlay;

import React from 'react';
import Joyride from 'react-joyride';

const steps = [
  {
    target: '.hero-section',
    content: 'Welcome to ProofHire! We help you prove your skills beyond resumes.',
    disableBeacon: true,
  },
  {
    target: '.upload-resume-section',
    content: 'Start by uploading your resume. We use AI to extract your core technical skills and experience.',
  },
  {
    target: '.github-input-section',
    content: 'Connect your GitHub profile to provide verifiable proof of your coding contributions and language proficiency.',
  },
  {
    target: '.jd-input-section',
    content: 'Paste the job description you are targeting. Our semantic engine will analyze the requirements.',
  },
  {
    target: '.analyze-button',
    content: 'Click here to generate your Proof Match score, identifying skill gaps and trainability.',
  },
  {
    target: '.results-dashboard',
    content: 'Here you’ll see your match score and skill breakdown.',
  },
  {
    target: '.validate-skills-section',
    content: 'Once matched, take micro-assessments to verify your top skills and boost your confidence score.',
  }
];

export default function OnboardingTour({ run, setRun }) {
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#4F46E5',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '24px',
          padding: '20px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          borderRadius: '12px',
          fontWeight: 'bold',
        },
        buttonBack: {
          fontWeight: 'bold',
        },
      }}
    />
  );
}

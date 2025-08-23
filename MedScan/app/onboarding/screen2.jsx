import React from 'react';
import OnboardingScreen from '../../components/OnboardingScreen';

export default function Onboarding2() {
  return (
    <OnboardingScreen
      image={require('../../assets/onboarding2.png')}
      text="Scan medicine text and get details"
      backRoute="/onboarding/screen1"
      nextRoute="/onboarding/screen3"
      skipRoute="/auth/signup"
    />
  );
}
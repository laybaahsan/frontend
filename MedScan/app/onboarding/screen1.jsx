import React from 'react';
import OnboardingScreen from '../../components/OnboardingScreen';

export default function Onboarding1() {
  return (
    <OnboardingScreen
      image={require('../../assets/onboarding1.png')}
      text="Search medicine by typing its name"
      isFirst={true}
      nextRoute="/onboarding/screen2"
      skipRoute="/auth/signup"
    />
  );
}
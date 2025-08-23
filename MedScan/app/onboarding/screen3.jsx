import React from 'react';
import OnboardingScreen from '../../components/OnboardingScreen';

export default function Onboarding3() {
  return (
    <OnboardingScreen
      image={require('../../assets/onboarding3.png')}
      text="Save medicine details and also see medicine history"
      isLast={true}
      backRoute="/onboarding/screen2"
      nextRoute="/auth/signup"
      skipRoute="/auth/signup"
    />
  );
}
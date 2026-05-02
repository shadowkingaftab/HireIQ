import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import * as successAnimation from '../animations/success.json';

export default function SuccessAnimation({ message }) {
  const [animationState, setAnimationState] = useState({
    isStopped: false,
    isPaused: false
  });

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation.default || successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {
    // Reset animation when message changes
    setAnimationState({ isStopped: false, isPaused: false });
  }, [message]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-32 h-32">
        <Lottie
          options={defaultOptions}
          height={128}
          width={128}
          isStopped={animationState.isStopped}
          isPaused={animationState.isPaused}
        />
      </div>
      <p className="mt-4 text-2xl font-black text-emerald-600 animate-bounce">{message}</p>
    </div>
  );
}

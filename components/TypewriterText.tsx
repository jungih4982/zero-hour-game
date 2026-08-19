// components/TypewriterText.tsx
import React, { useState, useEffect } from 'react';
import { Text, TextStyle, TouchableWithoutFeedback } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: TextStyle;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 22,
  style,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsCompleted(false);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  const handleSkip = () => {
    if (!isCompleted) {
      setDisplayedText(text);
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleSkip}>
      <Text style={style}>
        {displayedText}
        {!isCompleted && <Text style={{ color: '#00E5FF' }}> ▍</Text>}
      </Text>
    </TouchableWithoutFeedback>
  );
};
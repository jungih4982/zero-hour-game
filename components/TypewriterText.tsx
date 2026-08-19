// components/TypewriterText.tsx
import React, { useState, useEffect } from 'react';
import { Text, TextStyle, Pressable } from 'react-native';

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
        index++;
        // ⭐️ 핵심 해결: 이전 글자에 더하지 않고, 원본 텍스트(text)에서 직접 잘라옵니다. (글자 씹힘 완벽 방지)
        setDisplayedText(text.slice(0, index));
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
    <Pressable onPress={handleSkip}>
      <Text style={style}>
        {displayedText}
        {!isCompleted && <Text style={{ color: '#00E5FF' }}> ▍</Text>}
      </Text>
    </Pressable>
  );
};
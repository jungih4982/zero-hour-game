// components/TypewriterText.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: StyleProp<TextStyle>;
  onComplete?: () => void;
  forceComplete?: boolean; 
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 22,
  style,
  onComplete,
  forceComplete = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // ⭐️ 최신 onComplete 함수를 잃어버리지 않게 꽉 잡아두는 역할 (진행 불가 버그 해결!)
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setIsCompleted(false);
    let index = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (index < text.length) {
        index++;
        setDisplayedText(text.slice(0, index));
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsCompleted(true);
        if (onCompleteRef.current) onCompleteRef.current(); // 신호 발사!
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  useEffect(() => {
    if (forceComplete && !isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(text);
      setIsCompleted(true);
      if (onCompleteRef.current) onCompleteRef.current(); // 신호 발사!
    }
  }, [forceComplete, text, isCompleted]);

  return (
    <Text style={style}>
      {displayedText}
      {!isCompleted && <Text style={{ color: '#8ea8c2' }}> ▍</Text>}
    </Text>
  );
};

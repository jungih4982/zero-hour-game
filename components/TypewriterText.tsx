// components/TypewriterText.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: StyleProp<TextStyle>;
  onComplete?: () => void;
  completionRequest?: number;
  forceComplete?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 22,
  style,
  onComplete,
  completionRequest = 0,
  forceComplete = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);
  const initialCompletionRequestRef = useRef(completionRequest);
  const initialForceCompleteRef = useRef(forceComplete);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText('');
    setIsCompleted(false);
    completedRef.current = false;
    let index = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      if (index < text.length) {
        index++;
        setDisplayedText(text.slice(0, index));
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        if (completedRef.current) return;
        completedRef.current = true;
        setIsCompleted(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text, speed]);

  useEffect(() => {
    if (
      (completionRequest !== initialCompletionRequestRef.current
        || (forceComplete && !initialForceCompleteRef.current))
      && !completedRef.current
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      completedRef.current = true;
      setDisplayedText(text);
      setIsCompleted(true);
      onCompleteRef.current?.();
    }
  }, [completionRequest, forceComplete, text]);

  return (
    <Text style={style}>
      {displayedText}
      {!isCompleted && <Text style={{ color: '#8ea8c2' }}> ▍</Text>}
    </Text>
  );
};

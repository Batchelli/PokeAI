import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
    // A prop to manually control when completion callback is fired
    pauseCompletion?: boolean; 
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 40, onComplete, pauseCompletion = false }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); // Reset on text change
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                if (onComplete && !pauseCompletion) {
                    onComplete();
                }
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, onComplete, pauseCompletion]);

    return <>{displayedText}</>;
};

export default Typewriter;
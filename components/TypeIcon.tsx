import React from 'react';
import {
    Flame,
    Droplets,
    Zap,
    Leaf,
    Snowflake,
    HandMetal,
    FlaskConical,
    Mountain,
    Feather,
    BrainCircuit,
    Bug,
    Gem,
    Ghost,
    Crown,
    Moon,
    Shield,
    Sparkles,
    Circle,
} from 'lucide-react';

interface TypeIconProps {
    typeName: string;
}

const iconProps = {
    size: 14,
    className: "inline-block mr-1.5 opacity-90 flex-shrink-0"
};

const TypeIcon: React.FC<TypeIconProps> = ({ typeName }) => {
    switch (typeName) {
        case 'fire':
            return <Flame {...iconProps} />;
        case 'water':
            return <Droplets {...iconProps} />;
        case 'electric':
            return <Zap {...iconProps} />;
        case 'grass':
            return <Leaf {...iconProps} />;
        case 'ice':
            return <Snowflake {...iconProps} />;
        case 'fighting':
            return <HandMetal {...iconProps} />;
        case 'poison':
            return <FlaskConical {...iconProps} />;
        case 'ground':
            return <Mountain {...iconProps} />;
        case 'flying':
            return <Feather {...iconProps} />;
        case 'psychic':
            return <BrainCircuit {...iconProps} />;
        case 'bug':
            return <Bug {...iconProps} />;
        case 'rock':
            return <Gem {...iconProps} />;
        case 'ghost':
            return <Ghost {...iconProps} />;
        case 'dragon':
            return <Crown {...iconProps} />;
        case 'dark':
            return <Moon {...iconProps} />;
        case 'steel':
            return <Shield {...iconProps} />;
        case 'fairy':
            return <Sparkles {...iconProps} />;
        case 'normal':
        default:
            return <Circle {...iconProps} />;
    }
};

export default TypeIcon;
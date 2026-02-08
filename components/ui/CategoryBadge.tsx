"use client";

interface CategoryBadgeProps {
    category: string;
}

const categoryConfig: Record<string, { color: string; gradient: string; glow: string }> = {
    AI: {
        color: '#b14aed',
        gradient: 'linear-gradient(135deg, #b14aed 0%, #8b3ac7 100%)',
        glow: '0 0 20px rgba(177, 74, 237, 0.4)',
    },
    Space: {
        color: '#00d4ff',
        gradient: 'linear-gradient(135deg, #00d4ff 0%, #0091ff 100%)',
        glow: '0 0 20px rgba(0, 212, 255, 0.4)',
    },
    Gaming: {
        color: '#ff8500',
        gradient: 'linear-gradient(135deg, #ff8500 0%, #ff6b00 100%)',
        glow: '0 0 20px rgba(255, 133, 0, 0.4)',
    },
    Cybersecurity: {
        color: '#ff006e',
        gradient: 'linear-gradient(135deg, #ff006e 0%, #d10052 100%)',
        glow: '0 0 20px rgba(255, 0, 110, 0.4)',
    },
    Innovation: {
        color: '#39ff14',
        gradient: 'linear-gradient(135deg, #39ff14 0%, #2ecc11 100%)',
        glow: '0 0 20px rgba(57, 255, 20, 0.4)',
    },
    Crypto: {
        color: '#ffd700',
        gradient: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
        glow: '0 0 20px rgba(255, 215, 0, 0.4)',
    },
    Tech: {
        color: '#a0a0a0',
        gradient: 'linear-gradient(135deg, #a0a0a0 0%, #808080 100%)',
        glow: '0 0 20px rgba(160, 160, 160, 0.3)',
    },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
    const config = categoryConfig[category] || categoryConfig.Tech;

    return (
        <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider transition-all duration-300 hover:scale-110"
            style={{
                background: config.gradient,
                boxShadow: config.glow,
                color: '#ffffff',
            }}
        >
            {category}
        </span>
    );
}

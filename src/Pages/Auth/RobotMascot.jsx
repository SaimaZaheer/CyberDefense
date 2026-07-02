import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function RobotMascot({ currentState }) {
    const container = useRef();

    useGSAP(() => {
        // Initial setup
        gsap.set('.robot-hands', { y: 60, transformOrigin: '50% 100%' });
        gsap.set('.robot-eyes circle', { transformOrigin: '50% 50%' });

        // Idle floating animation
        gsap.to('.mascot-body', {
            y: -8,
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        // Blinking animation
        const blink = () => {
            gsap.to('.robot-eyes circle', {
                scaleY: 0,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    gsap.delayedCall(Math.random() * 3 + 2, blink);
                }
            });
        }
        gsap.delayedCall(2, blink);
    }, { scope: container });

    useGSAP(() => {
        // Reset defaults before transitioning state
        gsap.killTweensOf('.robot-eyes');
        gsap.killTweensOf('.robot-hands');

        // Quick reset colors
        gsap.to('.robot-eyes circle', {
            fill: '#00F0FF',
            scaleY: 1,
            duration: 0.3
        });

        switch (currentState) {
            case 'idle':
                gsap.to('.robot-eyes', { y: 0, x: 0, duration: 0.3 });
                gsap.to('.robot-hands', { y: 60, rotate: 0, duration: 0.4, ease: 'power2.in' });
                break;
            case 'usernameFocused':
                gsap.to('.robot-eyes', { y: 4, x: 0, duration: 0.3, ease: 'power1.out' });
                gsap.to('.robot-hands', { y: 60, rotate: 0, duration: 0.4 });
                break;
            case 'passwordFocused':
                // Look down slightly
                gsap.to('.robot-eyes', { y: -2, duration: 0.3 });
                // Bring hands up to cover eyes
                gsap.killTweensOf('.robot-hands');
                gsap.to('.robot-hands', { y: -10, rotate: 0, duration: 0.4, ease: 'back.out(1.5)' });
                break;
            case 'typing':
                // Wiggle the hands
                gsap.to('.robot-hands', { y: -10, duration: 0.2 });
                gsap.to('.robot-hands', {
                    rotate: 2,
                    yoyo: true,
                    repeat: -1,
                    duration: 0.1,
                    ease: 'sine.inOut'
                });
                break;
            case 'success':
                gsap.to('.robot-hands', { y: 60, rotate: 0, duration: 0.4 });
                gsap.to('.robot-eyes', { y: -5, duration: 0.3 });
                gsap.to('.robot-eyes circle', { fill: '#00FF66', duration: 0.3 });
                // Make eyes squint / happy
                gsap.to('.robot-eyes circle', { scaleY: 0.3, duration: 0.3 });
                break;
            case 'error':
                gsap.to('.robot-hands', { y: 60, rotate: 0, duration: 0.4 });
                gsap.to('.robot-eyes', { y: 3, duration: 0.3 });
                gsap.to('.robot-eyes circle', { fill: '#FF0055', scaleY: 0.8, duration: 0.3 });
                break;
            default:
                gsap.to('.robot-eyes', { y: 0, duration: 0.3 });
                gsap.to('.robot-hands', { y: 60, rotate: 0, duration: 0.3 });
        }
    }, { dependencies: [currentState], scope: container });

    return (
        <div ref={container} className="mascot-container">
            <svg className="mascot-body" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))' }}>
                {/* Neck base shadow */}
                <ellipse cx="100" cy="145" rx="35" ry="5" fill="rgba(0,0,0,0.5)" />

                {/* Body/Neck */}
                <path d="M70 145 C70 110, 130 110, 130 145" fill="#1C2541" stroke="#00F0FF" strokeWidth="2" />

                {/* Head */}
                <rect x="50" y="30" width="100" height="85" rx="20" fill="#0B132B" stroke="#00F0FF" strokeWidth="3" />
                {/* Visor */}
                <rect x="65" y="45" width="70" height="35" rx="15" fill="#1C2541" />

                {/* Antenna */}
                <path d="M100 30 L100 10" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="10" r="5" fill="#00d2ff" />

                {/* Eyes inside clipping or direct */}
                <g className="robot-eyes">
                    <circle cx="85" cy="62.5" r="5.5" fill="#00F0FF" />
                    <circle cx="115" cy="62.5" r="5.5" fill="#00F0FF" />
                </g>

                {/* Hands */}
                <g className="robot-hands" transform="translate(0, 60)">
                    {/* Left Hand: Positioned to cover left eye when moved up */}
                    <g transform="rotate(-15 75 65)">
                        <rect x="55" y="55" width="42" height="28" rx="14" fill="#3a7bd5" stroke="#00F0FF" strokeWidth="2" />
                        <path d="M 65 65 L 75 65 M 65 70 L 75 70" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
                    </g>

                    {/* Right Hand */}
                    <g transform="rotate(15 125 65)">
                        <rect x="103" y="55" width="42" height="28" rx="14" fill="#3a7bd5" stroke="#00F0FF" strokeWidth="2" />
                        <path d="M 125 65 L 135 65 M 125 70 L 135 70" stroke="#0B132B" strokeWidth="2" strokeLinecap="round" />
                    </g>
                </g>
            </svg>
        </div>
    );
}

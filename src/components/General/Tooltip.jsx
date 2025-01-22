import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Tooltip({ children, content }) {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [tooltipElement, setTooltipElement] = useState(null);

    useEffect(() => {
        // Criar o elemento do portal apenas uma vez
        const el = document.createElement('div');
        document.body.appendChild(el);
        setTooltipElement(el);

        return () => {
            document.body.removeChild(el);
        };
    }, []);

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosition({
            top: rect.top + window.scrollY - 10, // 10px acima do elemento
            left: rect.left + window.scrollX + rect.width / 2
        });
        setIsVisible(true);
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && tooltipElement && createPortal(
                <div 
                    className="fixed z-[9999] px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm dark:bg-gray-700 whitespace-nowrap pointer-events-none"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    {content}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>,
                tooltipElement
            )}
        </div>
    );
} 
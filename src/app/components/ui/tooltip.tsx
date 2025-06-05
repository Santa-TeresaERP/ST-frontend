import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2',
    right: 'left-full ml-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-md shadow-lg whitespace-nowrap ${positionClasses[side]}`}
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -translate-x-1/2 -translate-y-1/2" 
               style={{
                 left: '50%',
                 ...(side === 'top' && { bottom: '-4px' }),
                 ...(side === 'right' && { left: '-4px', top: '50%' }),
                 ...(side === 'bottom' && { top: '-4px' }),
                 ...(side === 'left' && { right: '-4px', top: '50%' })
               }} />
        </div>
      )}
    </div>
  );
};
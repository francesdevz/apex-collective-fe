import { message } from "../../common/appConstants";
import { useState } from "react";

interface CartProps {
    bagCount: number;
}

export default function Bag({ bagCount }: CartProps) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div 
            className="cursor-pointer relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                role="img" 
                aria-hidden="true"
            >
                <path 
                    fillRule="evenodd" 
                    clipRule="evenodd" 
                    d="M21 4H11V8H6V28H26V8H21V4ZM20 9V12H21V9H25V27H7V9H11V12H12V9H20ZM20 8V5H12V8H20Z" 
                    fill="var(--icon-primary-color, #000)"
                />
            </svg>        
            
            {/* Only show message when bag is empty AND being hovered */}
            {bagCount === 0 && isHovered && (
                <div className="absolute 
                                top-5
                                right-0
                                mt-8 
                                w-120 
                                bg-white    
                                border-1
                                border-gray-400
                                radius-2
                                p-3 
                                text-center 
                                border"
                >
                    {message.cartIsEmpty}
                </div>
            )}
            
        </div>
    );
}
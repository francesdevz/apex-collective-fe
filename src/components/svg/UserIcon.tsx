import { useNavigate } from "react-router-dom"

export default function UserIcon() {
    const navigate = useNavigate();
    return <div className="cursor-pointer" onClick={() => {
        navigate('/login')
    }}>
            <svg 
                width="32" 
                height="32"
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                role="img" 
                aria-hidden="true">
                    <path 
                        fill-rule="evenodd" 
                        clip-rule="evenodd" 
                        d="M9.22548 20H22.7744L26.4218 25.7316L25.5781 26.2684L22.2255 21H9.77443L6.42179 26.2684L5.57812 25.7316L9.22548 20Z" 
                        fill="var(--icon-primary-color, #000)">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 17C18.761 17 21 14.761 21 12C21 9.23895 18.761 7 16 7C13.2377 7 11 9.23881 11 12C11 14.7612 13.2377 17 16 17ZM16 18C19.3133 18 22 15.3133 22 12C22 8.68667 19.3133 6 16 6C12.6853 6 9.99996 8.68667 9.99996 12C9.99996 15.3133 12.6853 18 16 18Z" fill="var(--icon-primary-color, #000)">
                    </path>
            </svg>
           </div>
}
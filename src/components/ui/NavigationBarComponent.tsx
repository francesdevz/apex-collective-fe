"use client"

import type React from "react"
import { useState } from "react"
import Heart from "../../common/svg/Heart"
import UserIcon from "../../common/svg/UserIcon"
import Bag from "../../common/svg/BagIcon"
import Logo from "../../common/svg/Logo"

interface NavigationBarProps {
  authenticated?: boolean
  token?: string | null
  refreshToken?: string | null
}

const NavigationBar: React.FC<NavigationBarProps> = (props) => {

  const [searchQuery, setSearchQuery] = useState("")

  return (
      <nav className="w-full bg-white">
        <div className="border-b border-gray-200" style={{paddingTop: '20px'}}>  
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center" style={{marginLeft: '38px'}}>
              <Logo/>
            </div>
            <div className="flex items-center w-[400px] justify-between">
              <button className="font-serif font-medium tracking-wide hover:text-gray-600 transition-color cursor-pointer">
                Shoes
              </button>          
              <button className="font-serif font-medium tracking-wide hover:text-gray-600 transition-color cursor-pointer">
                Clothing
              </button>   
              <button className="font-serif font-medium tracking-wide hover:text-gray-600 transition-color cursor-pointer">
                Accessories
              </button>   
              <button className="font-serif font-medium tracking-wide hover:text-gray-600 transition-color cursor-pointer">
                Sports
              </button>  
              <button className="font-serif font-medium tracking-wide hover:text-gray-600 transition-color cursor-pointer">
                Contact
              </button>
            </div>
             <div className="flex items-center justify-around " style={{ width: '400px'}}>
              <form className="relative flex flex-row">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-none px-2 border-b border-gray-300 focus:outline-none focus:border-black"
                    style={{ width: '200px' }}
                  />          
              </form>    
              <div className="flex justify-between" style={{ width: '120px' }}>
                <UserIcon/>
                <Heart/>  
                <Bag/>
              </div>
            </div>          
          </div>
        </div>
      </nav>
  )
}

export default NavigationBar

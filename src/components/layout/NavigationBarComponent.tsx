import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Heart from "../svg/Heart"
import UserIcon from "../svg/UserIcon"
import Bag from "../svg/BagIcon"
import { useNavigate } from "react-router-dom"
import logo from '../../../public/logo.png'
import * as Const from '../../Utils/appConstants';

/**
 * NavigationBar - A responsive and animated navigation component for the e-commerce application
 * 
 * @component
 * @description Provides main navigation with logo, menu items, search functionality, and user action icons
 * Features smooth animations using Framer Motion and responsive design
 * 
 * @example
 * ```tsx
 * <NavigationBar />
 * ```
 * 
 * @returns {JSX.Element} Rendered navigation bar with animated elements
 */
const NavigationBar: React.FC = () => {

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <AnimatePresence>
      <motion.nav 
        className="w-full bg-white d-flex"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={Const.navVariants}
      >
        <div className="border-b border-gray-200">  
          <div className="flex justify-between items-center mt-5">
            {/* Logo */}
            <motion.div 
              className="ms-[30px] mb-2"
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={Const.logoVariants}
            >
              <motion.img 
                src={logo} 
                alt="Apex Collective Logo" 
                style={{ width: '75px', height: '65px' }} 
                onClick={() => navigate('/')}
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </motion.div>

            {/* Navigation Links */}
            <div className="flex items-center w-[450px] justify-between ms-[230px]">
              {Const.navibarOptions.map((item, index) => (
                <motion.button
                  key={item}
                  className="text-sm tracking-wide font-medium text-gray-600 hover:text-black cursor-pointer transition-all duration-300 relative"
                  initial="hidden"
                  animate="visible"
                  variants={Const.navItemVariants}
                  custom={index}
                  whileHover={{ 
                    y: -2,
                    color: "#000000"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                  <motion.div 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-black"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}            
            </div>

            {/* Search and Icons */}
            <div className="flex items-center justify-around" style={{ width: '400px' }}>
              {/* Search Input */}
              <motion.form className="relative flex flex-row">
                <motion.input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-none px-2 border-b border-gray-300 focus:outline-none focus:border-black transition-colors duration-300"
                  style={{ width: '200px' }}
                  initial="hidden"
                  animate="visible"
                  variants={Const.searchVariants}
                  whileFocus={{ 
                    width: 220,
                    borderColor: "#000000"
                  }}
                />          
              </motion.form>    

              {/* Icons */}
              <div className="flex justify-between" style={{ width: '120px' }}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={Const.iconVariants}
                >
                  <UserIcon/>
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={Const.iconVariants}
                >
                  <Heart/>  
                </motion.div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={Const.iconVariants}
                >
                  <Bag bagCount={0}/>
                </motion.div>
              </div>
            </div>          
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  )
}

export default NavigationBar
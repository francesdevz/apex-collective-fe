import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as Const from '../../common/appConstants'
import useFacebookAuth from "../../auth/useFacebookAuth" 
import ApiService from "../../ApiService/ApiService"

interface formDataType {
  email: string
  password: string
  fullName: string
}

const LoginComponent = () => {

  const [formData, setFormData] = useState<formDataType>({
    email: "",
    password: "",
    fullName: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login")
  const [error, setError] = useState<string | null>(null)

  const { 
      handleFacebookLogin, 
      isAuthenticating, 
      isFacebookReady,
      fbError 
  } = useFacebookAuth({
    setIsLoading,
    onError: (errorMessage) => {
      setError(errorMessage)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   const data = ApiService.getInstance().post("/api/auth/register", formData);
   console.log(data)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    if(provider === "facebook") {
      return await handleFacebookLogin()
    }
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const switchTab = (tab: "login" | "signup") => {
    setActiveTab(tab)
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={Const.pageVariants}
      className="min-h-screen bg-black text-white"
    >
      <div className="flex min-h-screen">
        <motion.div 
          className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-black"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <motion.div 
              className="relative w-full h-96 max-w-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/10 rounded-2xl transform rotate-6 scale-110"
                animate={{ 
                  background: [
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)",
                    "linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(239, 68, 68, 0.1) 100%)",
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              />
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-64">

                <motion.div 
                  className="absolute inset-0 border-2 border-white/30 rounded-lg transform rotate-3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />

                <motion.div 
                  className="absolute inset-4 border border-white/20 rounded-md transform -rotate-2"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                />

                <div className="absolute top-4 left-8 w-24 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-lg transform rotate-12"></div>
                <div className="absolute bottom-8 right-8 w-28 h-20 bg-gradient-to-br from-red-500/30 to-orange-500/20 rounded-full transform -rotate-6"></div>
                <div className="absolute top-12 left-16 flex space-x-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>
                  ))}
                </div>
                
                <motion.div 
                  className="absolute bottom-12 left-12 transform -rotate-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <div className="text-white/60 text-sm font-light tracking-widest">APEX</div>
                  <div className="text-white/40 text-xs font-light">PERFORMANCE</div>
                </motion.div>
              </div>

              <motion.div
                className="absolute top-20 right-20 w-6 h-6 border border-white/20 rounded-full"
                animate={{ 
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-32 left-24 w-3 h-3 bg-white/30 rounded-full"
                animate={{ 
                  y: [0, 8, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute top-40 left-32 w-4 h-4 border border-white/15 rounded-full"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  delay: 1
                }}
              />

              {/* Grid lines */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                <div className="absolute top-0 left-3/4 w-0.5 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -15, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />

          <motion.div 
            className="absolute bottom-12 left-12 max-w-xs"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-2">ELEVATE YOUR GAME</h2>
            <p className="text-white/60 text-sm">
              Premium athletic footwear engineered for peak performance and unmatched style.
            </p>
          </motion.div>
        </motion.div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 lg:py-0">
          <motion.div 
            className="w-full max-w-md"
            variants={Const.containerVariants}
            initial="hidden"
            animate="visible"
          >

            <motion.div variants={Const.itemVariants} className="mb-6">
              <div className="flex bg-gray-900 rounded-lg p-1">
                <motion.button
                  onClick={() => switchTab("login")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors cursor-pointer ${
                    activeTab === "login" 
                      ? "bg-white text-black" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => switchTab("signup")}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors cursor-pointer ${
                    activeTab === "signup" 
                      ? "bg-white text-black" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign Up
                </motion.button>
              </div>
            </motion.div>

            <motion.div variants={Const.itemVariants} className="space-y-3 mb-6">
              <motion.button
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <motion.button
                onClick={() => handleSocialLogin("facebook")}
                disabled={isLoading}
                className="cursor-pointer w-full flex items-center justify-center gap-3 bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </motion.button>
            </motion.div>

            <motion.div variants={Const.itemVariants} className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.form
                key={activeTab}
                onSubmit={handleSubmit}
                className="space-y-4"
                variants={Const.formVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <motion.input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={formData.fullName}
                      required
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-white transition-colors"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                )}

                <motion.div variants={Const.itemVariants}>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <motion.input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-white transition-colors"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                <motion.div variants={Const.itemVariants}>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <motion.input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:border-white transition-colors"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                {activeTab === "signup" && (
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.input
                      id="terms"
                      type="checkbox"
                      required
                      className="w-4 h-4 bg-gray-900 border-gray-700 rounded focus:ring-white cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-400 cursor-pointer">
                      I agree to the{" "}
                      <a href="#" className="text-white hover:underline">
                        Terms & Conditions
                      </a>
                    </label>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -1 }}
                  whileTap={{ scale: 0.98 }}
                  animate={isLoading ? { opacity: [1, 0.7, 1] } : {}}
                  transition={isLoading ? { duration: 1, repeat: Infinity } : {}}
                >
                  {isLoading 
                    ? "Please wait..." 
                    : activeTab === "login" 
                      ? "Member Login" 
                      : "Create Account"
                  }
                </motion.button>
              </motion.form>
            </AnimatePresence>

            {/* Footer Links */}
            <motion.div variants={Const.itemVariants} className="mt-8 text-center space-y-2">
              {activeTab === "login" ? (
                <>
                  <p className="text-gray-500 text-sm">
                    Don't have an account?{" "}
                    <motion.button 
                      onClick={() => switchTab("signup")}
                      className="text-white hover:underline font-medium cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Sign up
                    </motion.button>
                  </p>
                  <p className="text-gray-500 text-sm">
                    <motion.a 
                      href="#" 
                      className="hover:underline cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      Forgot password?
                    </motion.a>
                  </p>
                </>
              ) : (
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <motion.button 
                    onClick={() => switchTab("login")}
                    className="text-white hover:underline font-medium cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default LoginComponent
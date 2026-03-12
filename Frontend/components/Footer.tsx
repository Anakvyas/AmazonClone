"use client"

import {
  Globe,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ChevronUp
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full text-gray-100">

      {/* Back to Top */}
      <div className="bg-[#37475a] hover:bg-[#485769] text-center py-3 cursor-pointer">
        <div className="flex items-center justify-center gap-2 text-sm">
          <ChevronUp size={16}/>
          Back to top
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#232f3e]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">

          <div>
            <h3 className="text-white font-semibold mb-3">Get to Know Us</h3>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">About Amazon</li>
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Press Releases</li>
              <li className="hover:underline cursor-pointer">Amazon Science</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Connect with Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 hover:underline cursor-pointer">
                <Facebook size={16}/> Facebook
              </li>
              <li className="flex items-center gap-2 hover:underline cursor-pointer">
                <Twitter size={16}/> Twitter
              </li>
              <li className="flex items-center gap-2 hover:underline cursor-pointer">
                <Instagram size={16}/> Instagram
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Make Money with Us</h3>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">Sell on Amazon</li>
              <li className="hover:underline cursor-pointer">Sell under Amazon Accelerator</li>
              <li className="hover:underline cursor-pointer">Protect and Build Your Brand</li>
              <li className="hover:underline cursor-pointer">Amazon Global Selling</li>
              <li className="hover:underline cursor-pointer">Supply to Amazon</li>
              <li className="hover:underline cursor-pointer">Become an Affiliate</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Let Us Help You</h3>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">Your Account</li>
              <li className="hover:underline cursor-pointer">Returns Centre</li>
              <li className="hover:underline cursor-pointer">Recalls and Product Safety Alerts</li>
              <li className="hover:underline cursor-pointer">100% Purchase Protection</li>
              <li className="hover:underline cursor-pointer">Amazon App Download</li>
              <li className="hover:underline cursor-pointer">Help</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Logo + Language */}
      <div className="bg-[#232f3e] border-t border-gray-600 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6">

          {/* <img
            src="/amazon-logo.png"
            alt="Amazon"
            className="h-6"
          /> */}

          <div className="flex gap-4 text-sm">

            <div className="flex items-center gap-2 border border-gray-500 px-3 py-1 rounded">
              <Globe size={14}/>
              English
            </div>

            <div className="flex items-center gap-2 border border-gray-500 px-3 py-1 rounded">
              <MapPin size={14}/>
              India
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#131a22] text-gray-400 text-xs py-8">

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">

          <div>
            <p className="text-white font-semibold">AbeBooks</p>
            <p>Books, art & collectibles</p>
          </div>

          <div>
            <p className="text-white font-semibold">Amazon Web Services</p>
            <p>Scalable Cloud Computing Services</p>
          </div>

          <div>
            <p className="text-white font-semibold">Audible</p>
            <p>Download Audio Books</p>
          </div>

          <div>
            <p className="text-white font-semibold">IMDb</p>
            <p>Movies, TV & Celebrities</p>
          </div>

        </div>

        <div className="text-center mt-8 space-y-2">
          <p>
            Conditions of Use & Sale | Privacy Notice | Interest-Based Ads
          </p>
          <p>
            © 1996–2026 Amazon.com, Inc. or its affiliates
          </p>
        </div>

      </div>

    </footer>
  )
}
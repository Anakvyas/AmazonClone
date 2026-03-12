"use client";

import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { sidebarItems } from "@/public/footerdata";

interface SideNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const toggleDropdown = (sectionTitle: string, itemTitle: string) => {
    const key = `${sectionTitle}-${itemTitle}`;
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="bg-amazonLight/20 w-full fixed top-0 left-0 h-full text-black z-50 overflow-y-auto"
        >
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-80 bg-white text-black z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center p-4 bg-amazonLight text-white">
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold">Hello, </h2>
                <button
                  type="button"
                  className="text-2xl font-bold hover:text-amazonOrangeDark hover:underline hoverEffect"
                >
                  Sign in
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-2xl"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>
            <div>
              {sidebarItems.map((section) => (
                <div key={section.title} className="border-b border-gray-200">
                  <h3 className="font-bold p-4">{section.title}</h3>
                  <ul>
                    {section.items.map((item, itemIndex) => {
                      const key = `${section.title}-${item}`;

                      return (
                        <li key={key} className="py-1">
                          <button
                            type="button"
                            onClick={() => toggleDropdown(section.title, item)}
                            className="flex justify-between items-center w-full px-4 py-2 text-sm hover:bg-amazonLight/10"
                            aria-expanded={openDropdowns[key]}
                          >
                            <span>{item}</span>
                            {openDropdowns[key] ? (
                              <MdKeyboardArrowDown className="text-gray-500" />
                            ) : (
                              <MdKeyboardArrowRight className="text-gray-500" />
                            )}
                          </button>
                          <AnimatePresence>
                            {openDropdowns[key] && (
                              <motion.ul
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50 overflow-hidden"
                              >
                                {section.subItems[itemIndex].map((subItem) => (
                                  <li
                                    key={subItem}
                                    className="px-8 py-1 hover:bg-amazonLight/10"
                                  >
                                    <a href="#" className="text-sm">
                                      {subItem}
                                    </a>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SideNavbar;

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface GranolaFaqItem {
  id: string;
  question: string;
  answer: string;
}

interface GranolaAccordionProps {
  items: GranolaFaqItem[];
}

export function GranolaAccordion({ items }: GranolaAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-[768px] mx-auto border-t border-[#D5D5D2]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border-b border-[#D5D5D2] transition-colors"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full py-6 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <h4 className="font-serif text-[20px] sm:text-[23px] font-normal leading-[1.3] text-[#292929] group-hover:text-[#0E0F0C] tracking-[-0.01em]">
                {item.question}
              </h4>
              <span
                className={`p-1.5 rounded-full text-[#72726E] group-hover:text-[#292929] transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 bg-[#F7F7F2]' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4 stroke-[1.8]" />
              </span>
            </button>

            {isOpen && (
              <div className="pb-6 pr-6 sm:pr-10 text-[15px] sm:text-[16px] leading-[1.6] text-[#72726E] font-sans font-normal animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

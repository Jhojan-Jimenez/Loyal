'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface FusionAccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function FusionAccordion({
  items,
  defaultOpenId,
  className = '',
}: FusionAccordionProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [defaultOpenId || items[0]?.id]: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`w-full max-w-[680px] mx-auto divide-y divide-[#EAE4D5] border-t border-[#EAE4D5] ${className}`}>
      {items.map((item) => {
        const isOpen = !!openIds[item.id];
        return (
          <div key={item.id} className="py-6 transition-colors font-sans">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <span className="text-[19px] sm:text-[21px] leading-[28px] sm:leading-[30px] font-serif font-bold text-[#1C1917] group-hover:text-[#5B6F00] transition-colors">
                {item.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-[#EAE4D5] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#5B6F00] text-white border-[#5B6F00]' : 'bg-[#FAF7F2] text-[#1C1917] group-hover:bg-[#F3EFE6]'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="pt-4 pr-6 animate-in fade-in-50 duration-200">
                <div className="text-[15px] sm:text-[16px] leading-[26px] text-[#57534E] font-normal space-y-3">
                  {typeof item.answer === 'string' ? (
                    <p>{item.answer}</p>
                  ) : (
                    item.answer
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

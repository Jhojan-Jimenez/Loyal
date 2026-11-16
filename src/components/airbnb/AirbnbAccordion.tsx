'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

interface AirbnbAccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function AirbnbAccordion({
  items,
  defaultOpenId,
  className = '',
}: AirbnbAccordionProps) {
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
    <div className={`w-full max-w-[632px] mx-auto divide-y divide-[#dddddd] border-t border-[#dddddd] ${className}`}>
      {items.map((item) => {
        const isOpen = !!openIds[item.id];
        return (
          <div key={item.id} className="py-6 transition-colors">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-hidden"
              aria-expanded={isOpen}
            >
              <span className="text-[20px] sm:text-[22px] leading-[30px] sm:leading-[32px] font-normal text-[#222222] group-hover:text-[#000000] transition-colors">
                {item.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#ebebeb]' : 'group-hover:bg-[#f2f2f2]'
                }`}
              >
                <ChevronDown className="w-5 h-5 text-[#222222]" />
              </div>
            </button>

            {isOpen && (
              <div className="pt-4 pr-6 animate-in fade-in-50 duration-200">
                <div className="text-[16px] leading-[26px] text-[#6a6a6a] font-normal space-y-3">
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

'use client';

import React, { useState } from 'react';
import { useLoyal } from '@/context/LoyalContext';
import { MandalaBackground, LotusIcon } from './MandalaBackground';
import { Calendar, Clock, User, Sparkles, MessageCircle, Flame } from 'lucide-react';

export function ClassSchedule() {
  const { classes, config } = useLoyal();
  const [selectedStyle, setSelectedStyle] = useState<string>('TODOS');

  const styles = ['TODOS', 'Vinyasa Flow', 'Hatha Yoga', 'Yin Yoga', 'Kundalini', 'Meditación & Cuencos'];

  const filteredClasses =
    selectedStyle === 'TODOS' ? classes : classes.filter((c) => c.style === selectedStyle);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-800 via-fuchsia-900 to-pink-900 p-8 text-white shadow-xl">
        <MandalaBackground className="right-[-40px] top-[-40px] w-80 h-80 text-purple-300" opacity="opacity-15" />
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-purple-200 border border-white/15">
            <Calendar className="w-3.5 h-3.5" />
            Horario de Práctica Semanal
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight">Clases & Experiencias Zen</h1>
          <p className="text-sm text-purple-100/80 mt-2 leading-relaxed">
            Cada clase a la que asistas suma un sello a tu tarjeta digital. Explora nuestros estilos y
            reserva tu mat con anticipación.
          </p>
        </div>
      </div>

      {/* Style Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStyle === style
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                : 'bg-white text-purple-900/70 hover:bg-purple-50 border border-purple-100'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClasses.map((cls) => {
          return (
            <div
              key={cls.id}
              className="bg-white rounded-3xl p-6 border border-purple-100 shadow-md shadow-purple-900/5 hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                    {cls.style}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-fuchsia-700 bg-fuchsia-50 px-2 py-0.5 rounded-md">
                    <Flame className="w-3 h-3 text-fuchsia-500" />
                    Intensidad {cls.intensity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-purple-950 mt-2.5 leading-snug">{cls.title}</h3>
                <p className="text-xs text-purple-800/70 mt-1.5 leading-relaxed">{cls.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-purple-100 text-xs">
                  <div className="flex items-center gap-1.5 text-purple-900/80">
                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-medium">{cls.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-900/80">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    <span className="font-medium truncate">{cls.instructor}</span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-purple-500 font-medium">
                  Días: {cls.days.join(', ')}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-purple-100/70 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  • {cls.level}
                </span>

                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=Hola!%20Deseo%20reservar%20mi%20mat%20para%20la%20clase%20${encodeURIComponent(cls.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Reservar Mat
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

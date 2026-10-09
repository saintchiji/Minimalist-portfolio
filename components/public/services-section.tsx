'use client';

import React from 'react';
import { ServiceItem, WorkflowStep } from '@/lib/types';
import { Check, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  workflow: WorkflowStep[];
}

export function ServicesSection({ services, workflow }: ServicesSectionProps) {
  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-white dark:bg-black text-black dark:text-white border-b border-neutral-200 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-900 pb-6">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block mb-2">
            Commissions & Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Cinematography & Post Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-8 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/40 dark:bg-neutral-950/40 flex flex-col justify-between space-y-6 hover:border-black dark:hover:border-white transition-colors"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 border border-neutral-300 dark:border-neutral-800 px-2 py-0.5 inline-block">
                  Service 0{service.order}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                  {service.tagline}
                </p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed pt-2">
                  {service.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-900">
                <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  Key Deliverables
                </h4>
                <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300 font-mono">
                  {service.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-black dark:text-white shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>

                {service.turnaround && (
                  <p className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-900">
                    Turnaround: {service.turnaround}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Production Workflow */}
        {workflow && workflow.length > 0 && (
          <div className="pt-12 border-t border-neutral-200 dark:border-neutral-900 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 block mb-2">
                Production Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Our Collaborative Process
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflow.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border border-neutral-200 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-950/20 space-y-3"
                >
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-neutral-300 dark:text-neutral-700 block">
                    {item.step}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

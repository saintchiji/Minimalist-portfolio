'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Film } from 'lucide-react';

interface FilmReelDistributionProps {
  cinematographyCount: number;
  editingCount: number;
  totalFilms: number;
}

export function FilmReelDistribution({
  cinematographyCount,
  editingCount,
  totalFilms,
}: FilmReelDistributionProps) {
  const data = [
    {
      name: 'Cinematography / DP',
      key: 'cinematography',
      count: cinematographyCount,
      percentage: totalFilms > 0 ? Math.round((cinematographyCount / totalFilms) * 100) : 0,
      fill: 'currentColor',
    },
    {
      name: 'Editing / Post',
      key: 'editing',
      count: editingCount,
      percentage: totalFilms > 0 ? Math.round((editingCount / totalFilms) * 100) : 0,
      fill: 'currentColor',
    },
  ];

  return (
    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-900 space-y-3 font-mono">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-500">
        <span className="flex items-center space-x-1.5 font-bold text-black dark:text-white">
          <Film className="w-3.5 h-3.5" />
          <span>Film Reel Distribution</span>
        </span>
        <span className="text-[10px] text-neutral-400">{totalFilms} Total Works</span>
      </div>

      {/* Recharts Horizontal Progress Reel */}
      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 4, right: 10, left: -20, bottom: 4 }}
          >
            <XAxis type="number" domain={[0, totalFilms || 10]} hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: '#737373', fontFamily: 'monospace' }}
              width={120}
            />
            <Tooltip
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-2 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black text-[10px] font-mono shadow-xs uppercase">
                      <p className="font-bold text-black dark:text-white">{item.name}</p>
                      <p className="text-neutral-500">
                        {item.count} Films ({item.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={10}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  className={
                    index === 0
                      ? 'fill-black dark:fill-white'
                      : 'fill-neutral-400 dark:fill-neutral-600'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Discrete monochrome progress bar segment underneath */}
      <div className="space-y-1.5">
        <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 flex overflow-hidden border border-neutral-300 dark:border-neutral-700">
          <div
            style={{ width: `${data[0].percentage}%` }}
            className="bg-black dark:bg-white h-full transition-all duration-500"
            title={`Cinematography: ${data[0].percentage}%`}
          />
          <div
            style={{ width: `${data[1].percentage}%` }}
            className="bg-neutral-400 dark:bg-neutral-600 h-full transition-all duration-500"
            title={`Editing: ${data[1].percentage}%`}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-500">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 inline-block bg-black dark:bg-white" />
            <span>Cinematography ({data[0].percentage}%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 inline-block bg-neutral-400 dark:bg-neutral-600" />
            <span>Editing ({data[1].percentage}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

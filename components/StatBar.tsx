import React from 'react';
import type { Stat } from '../types';
import { STAT_NICKNAMES } from '../constants.tsx';

interface StatBarProps {
  stat: Stat;
  typeColor: string;
}

const MAX_STAT_VALUE = 255;

const StatBar: React.FC<StatBarProps> = ({ stat, typeColor }) => {
  const statName = stat.stat.name;
  const statValue = stat.base_stat;
  const percentage = (statValue / MAX_STAT_VALUE) * 100;

  // Extract just the bg color from the full class string for the bar
  const bgColor = typeColor.split(' ').find(cls => cls.startsWith('bg-')) || 'bg-gray-500';

  return (
    <div className="flex items-center gap-2 w-full">
      <p className="w-1/6 text-sm font-bold text-slate-400 text-right">
        {STAT_NICKNAMES[statName] || statName}
      </p>
      <div className="w-4/6 bg-slate-700 rounded-full h-5 overflow-hidden border border-slate-600">
        <div
          className={`${bgColor} h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
          style={{ width: `${percentage}%` }}
        >
        </div>
      </div>
       <p className="w-1/6 text-lg font-bold text-white text-left">{statValue}</p>
    </div>
  );
};

export default StatBar;
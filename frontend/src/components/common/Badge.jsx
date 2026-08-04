import React from 'react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const style = STATUS_COLORS[status] || STATUS_COLORS['Not Started'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border transition-all ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const style = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Medium'];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${style.bg} ${style.text} ${style.badge}`}
    >
      {priority}
    </span>
  );
};

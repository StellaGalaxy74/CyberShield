import React from 'react';
import { RiskLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const getStyles = () => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-rose-950/50',
          dot: 'bg-rose-500 animate-pulse',
          icon: AlertOctagon,
          label: 'CRITICAL RISK',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-amber-950/50',
          dot: 'bg-amber-500',
          icon: ShieldAlert,
          label: 'HIGH RISK',
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/50 shadow-yellow-950/50',
          dot: 'bg-yellow-400',
          icon: AlertTriangle,
          label: 'SUSPICIOUS',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-emerald-950/50',
          dot: 'bg-emerald-400',
          icon: ShieldCheck,
          label: 'LOW RISK',
        };
    }
  };

  const style = getStyles();
  const IconComponent = style.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 space-x-1.5',
    md: 'text-xs px-3 py-1 space-x-2 font-semibold',
    lg: 'text-sm px-4 py-1.5 space-x-2.5 font-bold tracking-wide',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <span
      id={`risk-badge-${level.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border shadow-sm ${style.bg} ${sizeClasses} backdrop-blur-sm whitespace-nowrap`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {showIcon && <IconComponent className={`${iconSizes} shrink-0`} />}
      <span>{style.label}</span>
    </span>
  );
};

import React from 'react';
import {
  Globe,
  MessageSquare,
  PhoneCall,
  DollarSign,
  CreditCard,
  TrendingUp,
  Briefcase,
  Heart,
  UserX,
  KeyRound,
  Wrench,
  ShoppingBag,
  Gift,
  Coins,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface ScamCategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export const ScamCategoryBadge: React.FC<ScamCategoryBadgeProps> = ({
  category,
  size = 'md',
}) => {
  const getCategoryMeta = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('phish')) return { icon: Globe, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
    if (lower.includes('smish')) return { icon: MessageSquare, color: 'text-blue-400 bg-blue-950/60 border-blue-800/60' };
    if (lower.includes('vish')) return { icon: PhoneCall, color: 'text-purple-400 bg-purple-950/60 border-purple-800/60' };
    if (lower.includes('upi') || lower.includes('payment')) return { icon: CreditCard, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
    if (lower.includes('financial')) return { icon: DollarSign, color: 'text-green-400 bg-green-950/60 border-green-800/60' };
    if (lower.includes('invest')) return { icon: TrendingUp, color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
    if (lower.includes('job') || lower.includes('employ')) return { icon: Briefcase, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/60' };
    if (lower.includes('romance')) return { icon: Heart, color: 'text-pink-400 bg-pink-950/60 border-pink-800/60' };
    if (lower.includes('impersonat')) return { icon: UserX, color: 'text-orange-400 bg-orange-950/60 border-orange-800/60' };
    if (lower.includes('account') || lower.includes('takeover')) return { icon: KeyRound, color: 'text-red-400 bg-red-950/60 border-red-800/60' };
    if (lower.includes('tech-support')) return { icon: Wrench, color: 'text-teal-400 bg-teal-950/60 border-teal-800/60' };
    if (lower.includes('shop')) return { icon: ShoppingBag, color: 'text-violet-400 bg-violet-950/60 border-violet-800/60' };
    if (lower.includes('lottery') || lower.includes('prize')) return { icon: Gift, color: 'text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800/60' };
    if (lower.includes('crypto')) return { icon: Coins, color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800/60' };
    if (lower.includes('kyc') || lower.includes('identity')) return { icon: FileText, color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' };

    return { icon: HelpCircle, color: 'text-slate-400 bg-slate-800/60 border-slate-700/60' };
  };

  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 space-x-1' : 'text-xs px-2.5 py-1 space-x-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border ${meta.color} ${sizeClasses} whitespace-nowrap`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{category}</span>
    </span>
  );
};

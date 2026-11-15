import React from 'react';
import { Calendar, Bell, Image as ImageIcon } from 'lucide-react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-cream-50 rounded-2xl p-6 border border-cream-200/80 shadow-soft animate-pulse"
        >
          <div className="h-44 bg-cream-300/60 rounded-xl mb-4 w-full" />
          <div className="h-6 bg-cream-300/80 rounded-md w-3/4 mb-3" />
          <div className="h-4 bg-cream-200 rounded-md w-1/2 mb-2" />
          <div className="h-4 bg-cream-200 rounded-md w-5/6" />
        </div>
      ))}
    </div>
  );
};

export const NoticeSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-cream-50 rounded-2xl p-5 border border-cream-200 shadow-soft animate-pulse flex items-start space-x-4"
        >
          <div className="w-10 h-10 rounded-full bg-cream-300 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-cream-300 rounded w-1/3" />
            <div className="h-4 bg-cream-200 rounded w-full" />
            <div className="h-4 bg-cream-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = Calendar,
  title = 'No items found',
  message = 'There are no items to display at this time.',
  action,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-cream-50/60 rounded-2xl border border-dashed border-cream-300 my-6">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-skyblue-50 flex items-center justify-center text-skyblue-600 border border-skyblue-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading font-semibold text-lg text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};


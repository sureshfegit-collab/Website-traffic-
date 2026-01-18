
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center text-white text-xl`}>
        <i className={icon}></i>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

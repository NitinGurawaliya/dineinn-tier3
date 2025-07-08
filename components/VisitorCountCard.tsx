"use client";

import { Users, TrendingUp } from "lucide-react";

interface VisitorCountCardProps {
  qrScans: number;
  todayScans: number;
}

export default function VisitorCountCard({ qrScans, todayScans }: VisitorCountCardProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Total Visitors</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-green-400">{qrScans.toLocaleString()}</span>
            <div className="flex items-center text-gray-300 text-sm">
              <TrendingUp className="h-4 w-4 mr-1 text-green-400" />
              <span>QR Scans</span>
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-base font-semibold text-blue-400">Today's Visitors:</span>
            <span className="text-xl font-bold text-blue-400">{todayScans}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-green-400">
            {qrScans}
          </div>
          <p className="text-gray-300 text-sm">people visited</p>
          <div className="text-blue-400 text-sm mt-2">Today: {todayScans}</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Last updated</span>
          <span className="text-gray-400">{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
} 
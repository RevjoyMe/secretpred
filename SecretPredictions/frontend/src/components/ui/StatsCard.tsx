'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string
  change: string
  icon: LucideIcon
  trend: 'up' | 'down' | 'neutral'
}

export function StatsCard({ label, value, change, icon: Icon, trend }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success-600 dark:text-success-400'
      case 'down':
        return 'text-danger-600 dark:text-danger-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTrendBg = () => {
    switch (trend) {
      case 'up':
        return 'bg-success-50 dark:bg-success-900/20'
      case 'down':
        return 'bg-danger-50 dark:bg-danger-900/20'
      default:
        return 'bg-gray-50 dark:bg-gray-800'
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-card-hover transition-all duration-200"
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${getTrendBg()}`}>
          <Icon className={`w-6 h-6 ${getTrendColor()}`} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          vs last month
        </span>
      </div>
    </motion.div>
  )
}


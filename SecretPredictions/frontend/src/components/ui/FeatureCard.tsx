'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: 'primary' | 'success' | 'accent'
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50 dark:bg-primary-900/20',
          icon: 'text-primary-600 dark:text-primary-400',
          title: 'text-primary-900 dark:text-primary-100'
        }
      case 'success':
        return {
          bg: 'bg-success-50 dark:bg-success-900/20',
          icon: 'text-success-600 dark:text-success-400',
          title: 'text-success-900 dark:text-success-100'
        }
      case 'accent':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          icon: 'text-orange-600 dark:text-orange-400',
          title: 'text-orange-900 dark:text-orange-100'
        }
    }
  }

  const colors = getColorClasses()

  return (
    <motion.div
      className="bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-200 dark:border-dark-700 hover:shadow-card-hover transition-all duration-200 group"
      whileHover={{ y: -4 }}
    >
      <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-8 h-8 ${colors.icon}`} />
      </div>
      
      <h3 className={`text-xl font-semibold mb-3 ${colors.title}`}>
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}


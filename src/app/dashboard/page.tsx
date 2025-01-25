'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  BarChart3,
  Calendar,
  Check,
  Clock,
  EllipsisVertical,
  FileText,
  ListTodo,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  User,
  Users,
  X,
} from 'lucide-react';

// Add new interfaces
interface CustomizationOption {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'fields' | 'formatting' | 'delivery';
}

type ProjectId = 'downtown-office' | 'residential-tower' | 'shopping-mall';

export default function DashboardPage() {
  // Add state for modal
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  // Add state for project toggles
  const [projectToggles, setProjectToggles] = useState({
    'downtown-office': true,
    'residential-tower': true,
    'shopping-mall': false,
  });

  const handleToggleChange = (projectId: ProjectId) => {
    setProjectToggles((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Add customization options
  const reportOptions: CustomizationOption[] = [
    {
      id: 'weather',
      label: 'Weather Conditions',
      description: 'Temperature, precipitation, and general conditions',
      enabled: true,
      category: 'fields',
    },
    {
      id: 'personnel',
      label: 'Personnel on Site',
      description: 'List of workers, hours worked, and roles',
      enabled: true,
      category: 'fields',
    },
    {
      id: 'equipment',
      label: 'Equipment Usage',
      description: 'Equipment types and hours of operation',
      enabled: true,
      category: 'fields',
    },
    {
      id: 'materials',
      label: 'Materials Delivered',
      description: 'Inventory of materials received and used',
      enabled: false,
      category: 'fields',
    },
    {
      id: 'logo',
      label: 'Company Logo',
      description: 'Display company logo on reports',
      enabled: true,
      category: 'formatting',
    },
    {
      id: 'email',
      label: 'Email Delivery',
      description: 'Send reports via email',
      enabled: true,
      category: 'delivery',
    },
    {
      id: 'sms',
      label: 'SMS Notifications',
      description: 'Send report links via SMS',
      enabled: false,
      category: 'delivery',
    },
  ];

  // Dummy data for recent reports
  const recentReports = [
    {
      id: 1,
      date: 'Mar 15, 2024',
      project: 'Downtown Office Complex',
      status: 'Completed',
      views: 12,
      author: 'John Smith',
    },
    {
      id: 2,
      date: 'Mar 14, 2024',
      project: 'Riverside Apartments',
      status: 'Pending Review',
      views: 5,
      author: 'Sarah Johnson',
    },
    {
      id: 3,
      date: 'Mar 14, 2024',
      project: 'City Mall Renovation',
      status: 'Draft',
      views: 0,
      author: 'Mike Wilson',
    },
  ];

  // Dummy data for project stats
  const projectStats = [
    {
      label: 'Active Projects',
      value: '12',
      change: '+2',
      trend: 'up',
    },
    {
      label: 'Workers On Site',
      value: '48',
      change: '-3',
      trend: 'down',
    },
    {
      label: 'Reports This Week',
      value: '23',
      change: '+5',
      trend: 'up',
    },
    {
      label: 'Safety Incidents',
      value: '0',
      change: '0',
      trend: 'neutral',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-black'>
      <div className='mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6'>
        {/* Header Section */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-zinc-400'>
              Dashboard
            </h1>
            <p className='mt-2 text-sm text-gray-600 dark:text-zinc-400'>
              Welcome back! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={() => setShowCustomizeModal(true)}
              className='group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
              <Settings className='size-4' />
              Customize Reports
            </button>
            <button className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
              <Plus className='size-4' />
              New Report
            </button>
          </div>
        </div>

        {/* Add Customize Reports Modal */}
        {showCustomizeModal && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
            <div className='w-full max-w-2xl rounded-2xl bg-white p-6 dark:bg-zinc-900'>
              <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Customize Reports
                </h2>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className='rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-800'>
                  <X className='size-5' />
                </button>
              </div>

              <div className='space-y-6'>
                {['fields', 'formatting', 'delivery'].map((category) => (
                  <div key={category}>
                    <h3 className='mb-3 text-lg font-medium capitalize text-gray-900 dark:text-white'>
                      {category}
                    </h3>
                    <div className='space-y-3'>
                      {reportOptions
                        .filter((option) => option.category === category)
                        .map((option) => (
                          <div
                            key={option.id}
                            className='flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-white/10'>
                            <div>
                              <h4 className='font-medium text-gray-900 dark:text-white'>
                                {option.label}
                              </h4>
                              <p className='text-sm text-gray-600 dark:text-zinc-400'>
                                {option.description}
                              </p>
                            </div>
                            <button
                              className={`flex size-6 items-center justify-center rounded-full ${
                                option.enabled
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 dark:bg-zinc-700'
                              }`}>
                              <Check className='size-4' />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-6 flex justify-end gap-3'>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className='rounded-full border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5'>
                  Cancel
                </button>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className='rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className='mt-8 space-y-8'>
          {/* Stats Grid */}
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {projectStats.map((stat) => (
              <div
                key={stat.label}
                className='group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-white/[0.02] dark:hover:border-white/[0.2] dark:hover:bg-white/[0.04]'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-gray-600 dark:text-zinc-400'>
                    {stat.label}
                  </p>
                  <span
                    className={`text-sm ${
                      stat.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : stat.trend === 'down'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-zinc-400'
                    }`}>
                    {stat.change}
                  </span>
                </div>
                <p className='mt-2 text-3xl font-semibold text-gray-900 dark:text-white'>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                icon: Calendar,
                label: 'Schedule',
                description: 'View work schedule',
              },
              {
                icon: Users,
                label: 'Team',
                description: 'Manage workers',
              },
              {
                icon: MessageSquare,
                label: 'Messages',
                description: '3 unread messages',
              },
              {
                icon: BarChart3,
                label: 'Analytics',
                description: 'View project metrics',
              },
            ].map((action) => (
              <Link
                key={action.label}
                href='#'
                className='group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:border-gray-300 hover:bg-gray-50 dark:border-white/[0.1] dark:bg-white/[0.02] dark:hover:border-white/[0.2] dark:hover:bg-white/[0.04]'>
                <div className='flex size-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-blue-600/10'>
                  <action.icon className='size-6 text-blue-500' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    {action.label}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-zinc-400'>
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* Projects Grid */}
          <div
            id='projects-grid'
            className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.02]'>
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Downtown Office Complex
                    </h3>
                    <span className='mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-white/10 dark:text-zinc-400'>
                      High Priority
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button className='rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5'>
                      <EllipsisVertical className='size-4 text-gray-600 dark:text-zinc-400' />
                    </button>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input
                        type='checkbox'
                        className='peer sr-only'
                        checked={projectToggles['downtown-office']}
                        onChange={() => handleToggleChange('downtown-office')}
                      />
                      <div className='peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-500 dark:bg-white/10'></div>
                    </label>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500 dark:text-zinc-400'>
                      Progress
                    </span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      75%
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-white/10'>
                    <div className='h-2 w-3/4 rounded-full bg-blue-500'></div>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Budget</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        $2.4M
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Tasks</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        45/60
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10'>
                    <div className='flex -space-x-2'>
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=101'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 1'
                        width={32}
                        height={32}
                      />
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=102'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 2'
                        width={32}
                        height={32}
                      />
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=103'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 3'
                        width={32}
                        height={32}
                      />
                      <div className='flex size-8 items-center justify-center rounded-full border-2 border-white bg-neutral-100'>
                        <span className='text-xs text-neutral-600'>+2</span>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <Calendar className='mr-2 size-3 text-gray-500 dark:text-zinc-400' />
                      <span className='text-sm text-gray-500 dark:text-zinc-400'>
                        Due: Mar 2025
                      </span>
                    </div>
                  </div>
                </div>
                <div className='mt-6 flex space-x-2'>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <ListTodo className='mr-2 size-3' />
                    Tasks
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <FileText className='mr-2 size-3' />
                    Files
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <MessageSquare className='mr-2 size-3' />
                    Chat
                  </button>
                </div>
              </div>
            </div>
            <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.02]'>
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Residential Tower
                    </h3>
                    <span className='mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-white/10 dark:text-zinc-400'>
                      Medium Priority
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button className='rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5'>
                      <EllipsisVertical className='size-4 text-gray-600 dark:text-zinc-400' />
                    </button>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input
                        type='checkbox'
                        className='peer sr-only'
                        checked={projectToggles['residential-tower']}
                        onChange={() => handleToggleChange('residential-tower')}
                      />
                      <div className='peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-500 dark:bg-white/10'></div>
                    </label>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500 dark:text-zinc-400'>
                      Progress
                    </span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      45%
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-white/10'>
                    <div className='h-2 w-[45%] rounded-full bg-blue-500'></div>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Budget</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        $1.8M
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Tasks</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        30/65
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10'>
                    <div className='flex -space-x-2'>
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=104'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 4'
                        width={32}
                        height={32}
                      />
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=105'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 5'
                        width={32}
                        height={32}
                      />
                      <div className='flex size-8 items-center justify-center rounded-full border-2 border-white bg-neutral-100'>
                        <span className='text-xs text-neutral-600'>+3</span>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <Calendar className='mr-2 size-3 text-gray-500 dark:text-zinc-400' />
                      <span className='text-sm text-gray-500 dark:text-zinc-400'>
                        Due: Jun 2025
                      </span>
                    </div>
                  </div>
                </div>
                <div className='mt-6 flex space-x-2'>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <ListTodo className='mr-2 size-3' />
                    Tasks
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <FileText className='mr-2 size-3' />
                    Files
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <MessageSquare className='mr-2 size-3' />
                    Chat
                  </button>
                </div>
              </div>
            </div>
            <div className='rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.02]'>
              <div className='p-6'>
                <div className='mb-4 flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                      Shopping Mall Extension
                    </h3>
                    <span className='mt-2 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-white/10 dark:text-zinc-400'>
                      Low Priority
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <button className='rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5'>
                      <EllipsisVertical className='size-4 text-gray-600 dark:text-zinc-400' />
                    </button>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <input
                        type='checkbox'
                        className='peer sr-only'
                        checked={projectToggles['shopping-mall']}
                        onChange={() => handleToggleChange('shopping-mall')}
                      />
                      <div className='peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-500 dark:bg-white/10'></div>
                    </label>
                  </div>
                </div>
                <div className='space-y-4'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-500 dark:text-zinc-400'>
                      Progress
                    </span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      90%
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200 dark:bg-white/10'>
                    <div className='h-2 w-[90%] rounded-full bg-blue-500'></div>
                  </div>
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Budget</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        $3.2M
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-500 dark:text-zinc-400'>Tasks</p>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        58/60
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center justify-between border-t border-gray-100 pt-4 dark:border-white/10'>
                    <div className='flex -space-x-2'>
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=106'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 4'
                        width={32}
                        height={32}
                      />
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=107'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 5'
                        width={32}
                        height={32}
                      />
                      <Image
                        src='https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=108'
                        className='size-8 rounded-full border-2 border-white'
                        alt='User 6'
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className='flex items-center'>
                      <Calendar className='mr-2 size-3 text-gray-500 dark:text-zinc-400' />
                      <span className='text-sm text-gray-500 dark:text-zinc-400'>
                        Due: Apr 2025
                      </span>
                    </div>
                  </div>
                </div>
                <div className='mt-6 flex space-x-2'>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <ListTodo className='mr-2 size-3' />
                    Tasks
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <FileText className='mr-2 size-3' />
                    Files
                  </button>
                  <button className='flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'>
                    <MessageSquare className='mr-2 size-3' />
                    Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Recent Reports */}
          <div>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Recent Reports
              </h2>
              <Link
                href='#'
                className='text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white'>
                View all
              </Link>
            </div>
            <div className='mt-4 rounded-2xl border border-gray-200 bg-white dark:border-white/[0.1] dark:bg-white/[0.02]'>
              <div className='divide-y divide-gray-200 dark:divide-white/[0.1]'>
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className='flex items-center justify-between p-4'>
                    <div className='flex items-center gap-4'>
                      <div className='flex size-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-blue-600/10'>
                        <FileText className='size-5 text-blue-500' />
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                          {report.project}
                        </h3>
                        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='size-3' />
                            {report.date}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='size-3' />
                            {report.views} views
                          </span>
                          <span className='flex items-center gap-1'>
                            <User className='size-3' />
                            {report.author}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          report.status === 'Completed'
                            ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                            : report.status === 'Pending Review'
                              ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                              : 'bg-gray-50 text-gray-600 dark:bg-zinc-500/10 dark:text-zinc-400'
                        }`}>
                        {report.status}
                      </span>
                      <button className='flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white'>
                        <Mail className='size-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  User,
  Users,
} from 'lucide-react';

export default function DashboardPage() {
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
            <button className='group inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]'>
              <Settings className='h-4 w-4' />
              Customize Reports
            </button>
            <button className='group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'>
              <Plus className='h-4 w-4' />
              New Report
            </button>
          </div>
        </div>

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
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-blue-600/10'>
                  <action.icon className='h-6 w-6 text-blue-500' />
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
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-gradient-to-b dark:from-blue-500/10 dark:to-blue-600/10'>
                        <FileText className='h-5 w-5 text-blue-500' />
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                          {report.project}
                        </h3>
                        <div className='flex items-center gap-3 text-sm text-gray-600 dark:text-zinc-400'>
                          <span className='flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            {report.date}
                          </span>
                          <span className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {report.views} views
                          </span>
                          <span className='flex items-center gap-1'>
                            <User className='h-3 w-3' />
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
                      <button className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:text-white'>
                        <Mail className='h-4 w-4' />
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

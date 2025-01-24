import Link from 'next/link';

import {
  AlertTriangle,
  BarChart3,
  Building2,
  Clipboard,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className='container mx-auto p-6'>
      {/* Header Stats */}
      <div className='mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div className='flex items-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <Building2 className='size-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-500'>Active Projects</p>
              <p className='text-2xl font-semibold text-gray-700'>4</p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div className='flex items-center'>
            <div className='rounded-full bg-green-100 p-3'>
              <Clock className='size-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-500'>Hours This Week</p>
              <p className='text-2xl font-semibold text-gray-700'>32.5</p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div className='flex items-center'>
            <div className='rounded-full bg-yellow-100 p-3'>
              <Clipboard className='size-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-500'>Tasks Due Today</p>
              <p className='text-2xl font-semibold text-gray-700'>7</p>
            </div>
          </div>
        </div>
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div className='flex items-center'>
            <div className='rounded-full bg-purple-100 p-3'>
              <BarChart3 className='size-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-500'>Completion Rate</p>
              <p className='text-2xl font-semibold text-gray-700'>94%</p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Current Projects */}
        <div className='rounded-lg bg-white p-6 shadow-md'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-800'>
              Current Projects
            </h2>
            <Link
              href='/projects'
              className='text-sm text-blue-600 hover:text-blue-800'>
              View all
            </Link>
          </div>
          <div className='space-y-4'>
            {[
              {
                name: 'Downtown Office Complex',
                progress: 75,
                dueDate: '2024-04-15',
              },
              {
                name: 'Riverside Apartments',
                progress: 45,
                dueDate: '2024-06-30',
              },
              {
                name: 'City Mall Renovation',
                progress: 90,
                dueDate: '2024-03-20',
              },
            ].map((project) => (
              <div
                key={project.name}
                className='rounded-lg border border-gray-200 p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='font-semibold text-gray-700'>
                    {project.name}
                  </h3>
                  <span className='text-sm text-gray-500'>
                    Due: {project.dueDate}
                  </span>
                </div>
                <div className='h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-600'
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className='mt-2 text-right text-sm text-gray-600'>
                  {project.progress}% Complete
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Alerts & Tasks */}
        <div className='space-y-6'>
          {/* Safety Alerts */}
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center'>
              <AlertTriangle className='mr-2 size-5 text-red-500' />
              <h2 className='text-xl font-bold text-gray-800'>Safety Alerts</h2>
            </div>
            <div className='space-y-4'>
              <div className='rounded-lg border-l-4 border-red-500 bg-red-50 p-4'>
                <p className='font-medium text-red-800'>
                  High Wind Advisory - Exercise Caution
                </p>
                <p className='mt-1 text-sm text-red-700'>
                  Wind speeds exceeding 20mph expected today
                </p>
              </div>
              <div className='rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4'>
                <p className='font-medium text-yellow-800'>
                  Equipment Inspection Due
                </p>
                <p className='mt-1 text-sm text-yellow-700'>
                  Crane inspection required by end of week
                </p>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className='rounded-lg bg-white p-6 shadow-md'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-bold text-gray-800'>
                Today&apos;s Tasks
              </h2>
              <span className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600'>
                7 remaining
              </span>
            </div>
            <div className='space-y-3'>
              {[
                {
                  task: 'Site safety inspection',
                  time: '9:00 AM',
                  completed: true,
                },
                {
                  task: 'Team briefing',
                  time: '9:30 AM',
                  completed: true,
                },
                {
                  task: 'Foundation inspection',
                  time: '11:00 AM',
                  completed: false,
                },
                {
                  task: 'Material delivery check',
                  time: '2:00 PM',
                  completed: false,
                },
              ].map((item) => (
                <div
                  key={item.task}
                  className='flex items-center justify-between rounded-lg border border-gray-200 p-3'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={item.completed}
                      readOnly
                      className='size-4 rounded border-gray-300 text-blue-600'
                    />
                    <span
                      className={`ml-3 ${
                        item.completed ? 'text-gray-400 line-through' : ''
                      }`}>
                      {item.task}
                    </span>
                  </div>
                  <span className='text-sm text-gray-500'>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

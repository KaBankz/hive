'use client';

import {
  Cloud,
  GripVertical,
  ListChecks,
  Puzzle,
  Truck,
  Users,
} from 'lucide-react';

const FIELD_ITEMS = [
  {
    id: 'weather',
    title: 'Weather Conditions',
    description: 'Temperature, precipitation, wind speed',
    icon: Cloud,
    color: 'blue',
  },
  {
    id: 'workforce',
    title: 'Workforce Summary',
    description: 'Staff count, roles, hours worked',
    icon: Users,
    color: 'green',
  },
  {
    id: 'activities',
    title: 'Daily Activities',
    description: 'Tasks, progress, milestones',
    icon: ListChecks,
    color: 'purple',
  },
  {
    id: 'equipment',
    title: 'Equipment Usage',
    description: 'Machinery, tools, maintenance',
    icon: Truck,
    color: 'orange',
  },
];

export function Sidebar() {
  return (
    <div className='w-96 rounded-xl bg-white p-6 shadow-sm'>
      <div className='mb-6'>
        <h3 className='mb-4 flex items-center font-semibold text-gray-800'>
          <Puzzle className='mr-2 size-5 text-blue-600' />
          Available Fields
        </h3>
        <div className='space-y-3'>
          {FIELD_ITEMS.map((field) => (
            <div
              key={field.id}
              className={`group cursor-move rounded-xl border border-${field.color}-100 bg-gradient-to-r from-${field.color}-50 to-white p-4 transition-all hover:border-${field.color}-300`}>
              <div className='flex items-center'>
                <div
                  className={`mr-3 flex size-10 items-center justify-center rounded-lg bg-${field.color}-600 text-white`}>
                  <field.icon className='size-5' />
                </div>
                <div>
                  <div className='font-medium text-gray-800'>{field.title}</div>
                  <div className='text-sm text-gray-500'>
                    {field.description}
                  </div>
                </div>
                <GripVertical
                  className={`ml-auto size-5 text-gray-300 group-hover:text-${field.color}-400`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

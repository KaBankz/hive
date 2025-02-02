'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Clock,
  FileText,
  MoreVertical,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import { usePostHog } from 'posthog-js/react';

import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

import dailyReportData from '../../../public/dailyReportData.json';

type DailyLog = {
  dailyLogDate: string;
  projectNumber: string;
  projectName: string;
};

type Project = {
  id: string;
  title: string;
  projectNumber: string;
  lastModified: string;
  owner: string;
  collaborators: Array<{
    id: string;
    avatar: string;
  }>;
  starred: boolean;
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>(
    dailyReportData.dailyLogs.map((log: DailyLog, index: number) => ({
      id: index.toString(),
      title: log.projectName,
      projectNumber: log.projectNumber,
      lastModified: log.dailyLogDate,
      owner: dailyReportData.preparedBy,
      collaborators: [
        {
          id: '1',
          avatar:
            'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=101',
        },
        {
          id: '2',
          avatar:
            'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=102',
        },
        {
          id: '3',
          avatar:
            'https://api.dicebear.com/7.x/notionists/png?scale=200&seed=103',
        },
      ],
      starred: false,
    }))
  );

  const toggleStar = (projectId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, starred: !project.starred }
          : project
      )
    );
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredProjects = filteredProjects.filter((project) => project.starred);
  const unstarredProjects = filteredProjects.filter(
    (project) => !project.starred
  );

  const posthog = usePostHog();

  return (
    <div className='min-h-screen bg-zinc-950 pt-16'>
      <div className='mx-auto max-w-7xl px-4 py-8'>
        <div className='mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <h1 className='text-2xl font-semibold text-white'>
            Construction Projects
          </h1>
          <Button disabled>
            <Plus className='size-4' />
            New Project
          </Button>
        </div>

        <div className='mb-8'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search projects'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-white placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>
        </div>

        {starredProjects.length > 0 && (
          <div className='mb-8'>
            <h2 className='mb-4 text-sm font-medium text-zinc-300'>
              Starred Projects
            </h2>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {starredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/editor?project=${project.id}`}
                  onClick={() =>
                    posthog.capture('opened-starred-project', {
                      projectId: project.id,
                    })
                  }
                  className='group relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <FileText className='size-5 text-blue-600' />
                      <div>
                        <h3 className='font-medium text-gray-900 dark:text-white'>
                          {project.title}
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-zinc-400'>
                          {project.projectNumber}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleStar(project.id);
                        if (project.starred) {
                          posthog.capture('starred-project', {
                            projectId: project.id,
                          });
                        } else {
                          posthog.capture('unstarred-project', {
                            projectId: project.id,
                          });
                        }
                      }}
                      className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800'>
                      <Star
                        className={cn('size-5', {
                          'fill-yellow-400 text-yellow-400': project.starred,
                          'text-gray-400': !project.starred,
                        })}
                      />
                    </button>
                  </div>
                  <div className='flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400'>
                    <div className='flex items-center gap-2'>
                      <Clock className='size-4' />
                      <span>Last modified {project.lastModified}</span>
                    </div>
                    <div className='flex items-center'>
                      <div className='flex -space-x-2'>
                        {project.collaborators.map((collaborator) => (
                          <Image
                            key={collaborator.id}
                            src={collaborator.avatar}
                            alt='Collaborator'
                            width={24}
                            height={24}
                            className='size-6 rounded-full border-2 border-white dark:border-zinc-900'
                          />
                        ))}
                      </div>
                      <button className='ml-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800'>
                        <MoreVertical className='size-4' />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className='mb-4 text-sm font-medium text-zinc-300'>
            All Projects
          </h2>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {unstarredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/editor?project=${project.id}`}
                onClick={() =>
                  posthog.capture('opened-unstarred-project', {
                    projectId: project.id,
                  })
                }
                className='group relative rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
                <div className='mb-2 flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <FileText className='size-5 text-blue-600' />
                    <div>
                      <h3 className='font-medium text-gray-900 dark:text-white'>
                        {project.title}
                      </h3>
                      <p className='text-sm text-gray-500 dark:text-zinc-400'>
                        {project.projectNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleStar(project.id);
                    }}
                    className='rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800'>
                    <Star
                      className={cn('size-5', {
                        'fill-yellow-400 text-yellow-400': project.starred,
                        'text-gray-400': !project.starred,
                      })}
                    />
                  </button>
                </div>
                <div className='flex items-center justify-between text-sm text-gray-500 dark:text-zinc-400'>
                  <div className='flex items-center gap-2'>
                    <Clock className='size-4' />
                    <span>Last modified {project.lastModified}</span>
                  </div>
                  <div className='flex items-center'>
                    <div className='flex -space-x-2'>
                      {project.collaborators.map((collaborator) => (
                        <Image
                          key={collaborator.id}
                          src={collaborator.avatar}
                          alt='Collaborator'
                          width={24}
                          height={24}
                          className='size-6 rounded-full border-2 border-white dark:border-zinc-900'
                        />
                      ))}
                    </div>
                    <button className='ml-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-800'>
                      <MoreVertical className='size-4' />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

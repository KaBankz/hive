import Image from 'next/image';

import { Bold, Italic, Link2, List, Table } from 'lucide-react';

export function Toolbar() {
  return (
    <div className='flex space-x-1 border-b border-gray-100 bg-gray-50 px-6 py-3'>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <Bold className='size-4' />
      </button>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <Italic className='size-4' />
      </button>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <List className='size-4' />
      </button>
      <div className='mx-2 my-auto h-6 w-px bg-gray-200'></div>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <Image src='/images/image.png' alt='Image' width={16} height={16} />
      </button>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <Table className='size-4' />
      </button>
      <button className='rounded-lg p-2.5 text-gray-600 transition-all hover:bg-white hover:text-blue-600'>
        <Link2 className='size-4' />
      </button>
    </div>
  );
}

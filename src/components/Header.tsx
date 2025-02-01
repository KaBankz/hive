import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LogOut, Menu, Settings, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { createClient } from '@/utils/supabase/server';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function handleLogout() {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <header className='fixed top-0 z-50 w-full border-b border-white/[0.1] bg-zinc-950/30 backdrop-blur-xl backdrop-saturate-150'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <div className='flex items-center gap-4 md:gap-10'>
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className='md:hidden'>
              <Button
                variant='outline'
                size='icon'
                className='size-9 border-white/10 bg-white/5 p-0 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-white'>
                <Menu className='size-5' />
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-full border-white/[0.1] bg-zinc-950/30 p-0 backdrop-blur-xl backdrop-saturate-150'>
              <SheetHeader className='flex border-b border-white/[0.1] px-6 py-4'>
                <Link href='/' className='flex items-center gap-2'>
                  <Image
                    src='/icon.png'
                    alt='Hive'
                    width={100}
                    height={100}
                    className='size-6'
                  />
                  <SheetTitle>Hive</SheetTitle>
                </Link>
              </SheetHeader>
              <SheetDescription className='sr-only px-6 py-4 text-sm text-zinc-400'>
                Empowering construction managers with next-generation project
                management tools.
              </SheetDescription>

              <div className='flex-1 overflow-y-auto'>
                <div className='flex flex-col gap-1 p-2'>
                  <SheetClose asChild>
                    <Link
                      href='/#features'
                      className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'>
                      Features
                    </Link>
                  </SheetClose>
                  {/* <SheetClose asChild>
                    <Link
                      href='#'
                      className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'>
                      Pricing
                    </Link>
                  </SheetClose> */}
                  <SheetClose asChild>
                    <Link
                      href='#'
                      className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'>
                      About
                    </Link>
                  </SheetClose>
                </div>

                {user ? (
                  <div className='mt-4 flex flex-col gap-1 border-t border-white/[0.1] p-2'>
                    <div className='mb-2 flex items-center gap-3 px-4 py-2'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/notionists/png?seed=${user.id}`}
                          alt={user.email ?? 'User avatar'}
                        />
                        <AvatarFallback className='bg-white/5 text-sm text-zinc-400'>
                          {user.email?.[0].toUpperCase() ?? 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-white'>
                          {user.email}
                        </span>
                        <span className='text-xs text-zinc-400'>
                          Personal Account
                        </span>
                        <span className='text-xs text-zinc-400'>Free Plan</span>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <Link
                        href='/dashboard'
                        className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'>
                        <UserIcon className='size-4' />
                        Dashboard
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href='#'
                        className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'>
                        <Settings className='size-4' />
                        Settings
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={handleLogout}
                        className='flex items-center gap-2 rounded-md px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-400'>
                        <LogOut className='size-4' />
                        Log out
                      </button>
                    </SheetClose>
                  </div>
                ) : (
                  <div className='mt-4 flex flex-col gap-2 border-t border-white/[0.1] p-2'>
                    <SheetClose asChild>
                      <Link href='/login'>
                        <Button
                          variant='outline'
                          className='w-full justify-center border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10'>
                          Log in
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href='/signup'>
                        <Button cta className='w-full justify-center'>
                          Get Started
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 transition-opacity hover:opacity-80'>
            <Image
              src='/icon.png'
              alt='Hive'
              width={100}
              height={100}
              className='size-6'
            />
            <span className='text-lg font-bold text-white'>Hive</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className='hidden md:flex'>
            <NavigationMenuList className='space-x-1'>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'
                  href='/#features'>
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <NavigationMenuLink
                  className='rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'
                  href='#'>
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  className='rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white'
                  href='#'>
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Section */}
        <div className='flex items-center gap-4'>
          {user ? (
            <>
              <Link
                href='/dashboard'
                className='hidden items-center md:inline-flex'>
                <Button cta>Dashboard</Button>
              </Link>
              <div className='hidden items-center md:flex'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='size-auto p-0'>
                      <Avatar>
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/notionists/png?seed=${user.id}`}
                          alt={user.email ?? 'User avatar'}
                        />
                        <AvatarFallback>
                          <UserIcon className='size-4' />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-64 border-white/[0.1] bg-zinc-950/30 p-2 backdrop-blur-xl backdrop-saturate-150'>
                    <div className='flex items-center gap-3 px-2 pb-3'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/notionists/png?seed=${user.id}`}
                          alt={user.email ?? 'User avatar'}
                        />
                        <AvatarFallback className='bg-white/5 text-sm text-zinc-400'>
                          <UserIcon className='size-4' />
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium text-white'>
                          {user.email}
                        </span>
                        <span className='text-xs text-zinc-400'>
                          Personal Account
                        </span>
                        <span className='text-xs text-zinc-400'>Free Plan</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className='bg-white/[0.1]' />
                    <DropdownMenuGroup className='p-1'>
                      <DropdownMenuItem
                        className='cursor-pointer rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white'
                        asChild>
                        <Link
                          href='/dashboard'
                          className='flex items-center gap-2'>
                          <UserIcon className='size-4' />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='cursor-pointer rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white'
                        asChild>
                        <Link href='#' className='flex items-center gap-2'>
                          <Settings className='size-4' />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='bg-white/[0.1]' />
                    <div className='p-1'>
                      <DropdownMenuItem
                        className='cursor-pointer rounded-md text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 focus:text-red-400'
                        onClick={handleLogout}>
                        <LogOut className='mr-2 size-4' />
                        Log out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Link
                href='/login'
                className='hidden items-center text-sm text-zinc-400 transition-colors hover:text-white md:inline-flex'>
                Log in
              </Link>
              <Link
                href='/signup'
                className='hidden items-center md:inline-flex'>
                <Button cta>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import { type ReactNode } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut as LogOutIcon } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';

export default function Navbar(): ReactNode {
    const { user, isLoading: isUserLoading } = useUser();
    return (
        <header className="flex items-center justify-between px-4 py-3 bg-gray-500 shadow">
            <h1 className="text-white text-xl">
                <Link href="/">Marketplace</Link>
            </h1>
            <div className="w-[40px] h-[40px] ml-auto shadow-3xl cursor-pointer">
                {!isUserLoading && user?.picture && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Image
                                width={40}
                                height={40}
                                src={user.picture}
                                alt={user.name ?? ''}
                                className="rounded-full"
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-4">
                            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/my-products">My products</Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogOutIcon className="mr-3 h-5 w-5" />
                                <a href="/api/auth/logout">Logout</a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {isUserLoading && (
                    <LoadingSpinner size={40} className="text-gray-200" />
                )}
            </div>
        </header>
    );
}

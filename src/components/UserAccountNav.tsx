"use client"
import { FC } from "react";
import { User } from "next-auth";
import UserAvatar from "./UserAvatar";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuSeparator,DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { signOut } from 'next-auth/react';


interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate tex-sm text-zinc-700">
                {user.email}
              </p>
            )}
          </div>
        </div>

      <DropdownMenuSeparator />


      <DropdownMenuItem onSelect={(event) => {
        // sign out method
        event.preventDefault();
        signOut({
          callbackUrl: `${window.location.origin}/sign-in`
        })
      }} className="cursor-pointer">Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;

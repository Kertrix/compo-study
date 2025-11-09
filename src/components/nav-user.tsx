"use client";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";
import { logoutAction } from "./log-out";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NavUser({ name, email }: { name: string; email: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="p-2!">
          <Avatar className="flex items-center">
            {(() => {
              // Generate a fallback avatar with initials and a background color based on the name
              const hash = Array.from(name).reduce(
                (acc, char) => acc + char.charCodeAt(0),
                0
              );

              const colorClasses = [
                "bg-teal-100 text-teal-700",
                "bg-blue-100 text-blue-700",
                "bg-green-100 text-green-700",
                "bg-yellow-100 text-yellow-700",
                "bg-pink-100 text-pink-700",
                "bg-purple-100 text-purple-700",
                "bg-orange-100 text-orange-700",
              ];
              const colorIdx = hash % colorClasses.length;

              return (
                <AvatarFallback
                  className={`h-7 w-7 rounded-full text-xs ${colorClasses[colorIdx]}`}
                >
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              );
            })()}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 not-visited:rounded-lg" align="end">
        <DropdownMenuItem disabled>
          <UserCog />
          Role : Administateur
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={async () => {
            await logoutAction();
          }}
        >
          <LogOut />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

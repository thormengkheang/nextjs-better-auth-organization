"use client";

import React from "react";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { client, useListOrganizations } from "@/lib/auth-client";
import { Session, ActiveOrganization } from "@/lib/auth-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrgSwitcherProps {
  session: Session | null;
  activeOrg: ActiveOrganization | null;
}

export function OrgSwitcher(props: OrgSwitcherProps) {
  const { activeOrg } = props;
  const { data: orgs } = useListOrganizations();
  const { isMobile } = useSidebar();

  const [optimisticOrg, setOptimisticOrg] =
    React.useState<ActiveOrganization | null>(activeOrg);

  const handleOnOrgItemClick = async (orgId: string) => {
    await client.organization.setActive({
      organizationId: orgId,
    });
    setOptimisticOrg(
      orgs?.find((org) => org.id === orgId) as ActiveOrganization | null,
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <AvatarImage
                  className="object-cover size-4 rounded-none"
                  src={optimisticOrg?.logo || undefined}
                />
                <AvatarFallback className="rounded-none">
                  {optimisticOrg?.name?.charAt(0) || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {optimisticOrg?.name || "Personal"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {orgs?.map((org, index) => (
              <DropdownMenuItem
                key={org.slug}
                onClick={() => handleOnOrgItemClick(org.id)}
                className="gap-2 p-2"
              >
                <Avatar className="flex size-6 items-center justify-center rounded-sm border">
                  <AvatarImage
                    className="object-cover size-4 shrink-0"
                    src={org?.logo || undefined}
                  />
                  <AvatarFallback className="size-4 shrink-0">
                    {org?.name?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                {org.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

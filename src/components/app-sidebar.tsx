import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NavProjects } from "@/components/nav-projects";
import { OrgSwitcher } from "@/components/org-switcher";

export async function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [session, org] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    auth.api.getFullOrganization({
      headers: await headers(),
    }),
  ]);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrgSwitcher session={session} activeOrg={org} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

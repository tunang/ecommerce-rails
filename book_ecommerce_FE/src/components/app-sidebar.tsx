import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  Home,
  User2,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Crown,
  ShoppingCart,
  BookOpen,
  Tags,
  PanelLeftClose,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import type { RootState } from "@/store";
import { logoutRequest } from "@/store/slices/authSlice";
import { useSidebar } from "@/components/ui/sidebar";

// Simple Badge component
const Badge = ({ children, variant = "default", className = "" }: { 
  children: React.ReactNode; 
  variant?: string;
  className?: string;
}) => (
  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
    variant === "secondary" 
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  } ${className}`}>
    {children}
  </span>
);

// Menu items grouped by functionality
const dashboardItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/admin/analytics", 
    icon: BarChart3,
    badge: "New",
  },
];

const managementItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    badge: null,
  },
  {
    title: "Authors",
    url: "/admin/authors",
    icon: Crown,
    badge: null,
  },
  {
    title: "Books",
    url: "/admin/books",
    icon: BookOpen,
    badge: null,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: Tags,
    badge: null,
  },
];

const orderItems = [
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    badge: null,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    badge: null,
  },
];

export function AppSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { toggleSidebar, state } = useSidebar();

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  const renderMenuItems = (items: any[]) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link 
              to={item.url} 
              className={`flex items-center ${state === "collapsed" ? "justify-center" : "gap-3"}`}
              title={state === "collapsed" ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {state === "expanded" && (
                <>
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Header with Company Logo/Branding */}
      <SidebarHeader className="border-b">
        {state === "collapsed" ? (
          // Collapsed header - only show logo centered
          <div className="flex items-center justify-center py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
        ) : (
          // Expanded header - full layout
          <div className="flex items-center gap-2 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Book Store</span>
              <span className="truncate text-xs text-muted-foreground">Admin Panel</span>
            </div>
            {/* Toggle button inside sidebar */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={toggleSidebar}
            >
              <PanelLeftClose className="h-4 w-4" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className={state === "collapsed" ? "px-1" : "px-2"}>
        {/* Dashboard Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              Dashboard
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(dashboardItems)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Management Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(managementItems)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Sales Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              Sales
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(orderItems)}</SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
              System
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>{renderMenuItems(settingsItems)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Enhanced Footer with User Profile */}
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  className={`${state === "collapsed" ? "h-10 w-10 p-0 justify-center" : "h-12 px-3"} hover:bg-accent`}
                  title={state === "collapsed" ? user?.name || "Admin User" : undefined}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage 
                      src={user?.avatar} 
                      alt={user?.name || "Admin"} 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name || "Admin User"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user?.email || "admin@bookstore.com"}
                        </span>
                      </div>
                      <ChevronUp className="ml-auto h-4 w-4" />
                    </>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === "collapsed" ? "right" : "top"}
                className="w-56 p-1"
              >
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <User2 className="h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-3 py-2">
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 px-3 py-2 text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

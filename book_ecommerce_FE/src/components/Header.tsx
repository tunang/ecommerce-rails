import {
  Search,
  User,
  ShoppingCart,
  Menu,
  LogOut,
  Settings,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  ShieldUser,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "@/store/slices/authSlice";
import { Badge } from "@/components/ui/badge";
import { fetchNeatestCategoriesRequest } from "@/store/slices/categorySlice";
import { useEffect } from "react";

const Header = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector(
    (state: RootState) => state.category
  );

  useEffect(() => {
    dispatch(fetchNeatestCategoriesRequest());
  }, []);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-w-fit">
            <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
            <span className="text-lg lg:text-xl font-bold text-primary hidden sm:inline">BookStore</span>
          </Link>

          {/* Categories and Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-10 flex items-center gap-2 lg:gap-3">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 min-w-[40px] lg:min-w-[140px]">
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden lg:inline">Danh mục</span>
                  <ChevronDown className="h-4 w-4 hidden lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
                  Danh mục sản phẩm
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {categories.map((category) => (
                  <div key={category.id}>
                    {category.children && category.children.length > 0 ? (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{category.name}</span>
                            {category.children.length > 0 && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                {category.children.length}
                              </Badge>
                            )}
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-56">
                          <DropdownMenuLabel className="text-xs text-muted-foreground">
                            {category.description}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {category.children.map((subCategory) => (
                            <div key={subCategory.id}>
                              {subCategory.children && subCategory.children.length > 0 ? (
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span>{subCategory.name}</span>
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {subCategory.children.length}
                                      </Badge>
                                    </div>
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="w-48">
                                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                                      {subCategory.description}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {subCategory.children.map((subSubCategory) => (
                                      <DropdownMenuItem key={subSubCategory.id} asChild>
                                        <Link 
                                          to={`/category/${subSubCategory.id}`}
                                          className="flex items-center gap-2 w-full"
                                        >
                                          <ChevronRight className="h-3 w-3" />
                                          <div>
                                            <div className="font-medium">{subSubCategory.name}</div>
                                            <div className="text-xs text-muted-foreground">{subSubCategory.description}</div>
                                          </div>
                                        </Link>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              ) : (
                                <DropdownMenuItem asChild>
                                  <Link 
                                    to={`/category/${subCategory.id}`}
                                    className="flex items-center gap-2 w-full"
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                    <div>
                                      <div className="font-medium">{subCategory.name}</div>
                                      <div className="text-xs text-muted-foreground">{subCategory.description}</div>
                                    </div>
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </div>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link 
                          to={`/category/${category.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <ChevronRight className="h-3 w-3" />
                          <div>
                            <div className="font-medium">{category.name}</div>
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/categories" className="w-full font-medium text-primary">
                    Xem tất cả danh mục
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Bar */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm sách..."
                className="pl-10 pr-4 w-full placeholder:text-sm lg:placeholder:text-base"
              />
            </div>
          </div>

          {/* Right side - Navigation items */}
          <div className="flex items-center space-x-2 lg:space-x-4 min-w-fit">
            {isAuthenticated ? (
              <>
                {/* Shopping Cart */}
                <Button onClick={() => navigate("/cart")} variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 rounded-full bg-primary text-[8px] lg:text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    3
                  </span>
                </Button>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-full"
                    >
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4 lg:h-5 lg:w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Người dùng
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          user@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Đơn hàng</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                    </DropdownMenuItem>

                    {user?.role === "admin" && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <ShieldUser className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => dispatch(logoutRequest())}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </>
            ) : (
              // Auth Buttons
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    <span className="hidden sm:inline">Đăng nhập</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" className="text-sm">
                    <span className="hidden sm:inline">Đăng ký</span>
                    <span className="sm:hidden">Sign up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

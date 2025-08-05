import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { loginRequest } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(1, {
    message: "Mật khẩu không được để trống",
  }),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, error } = useSelector(
    (state: RootState) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { email, password } = data;

      dispatch(loginRequest({ email, password }));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Đăng nhập thành công!");
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <BookOpen className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-primary">BookStore</span>
          </Link>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-center">
              Nhập email và mật khẩu để truy cập tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <Link
                  to="/signup"
                  className="w-full block text-center text-blue-600 hover:underline"
                >
                  Chưa có tài khoản? Đăng ký
                </Link>
              </form>
            </Form>
            {/* Footer */}
            <div className="mt-6 text-center space-y-2">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Quên mật khẩu?
              </Link>
              <div className="text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center mb-2">
            <strong>Thông tin đăng nhập demo:</strong>
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>📧 Email: admin@admin.com</p>
            <p>🔑 Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { resetPasswordSchema } from "@/schemas/reset-password.schema";
import { resetPassword } from "@/services/api.service";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get('reset_password_token');
    if (!token) {
      toast.error("Token reset password không hợp lệ");
      navigate("/forgot-password");
    } else {
      setResetToken(token);
    }
  }, [searchParams, navigate]);

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    try {
      setIsLoading(true);
      const { password, password_confirmation } = data;
      
      await resetPassword(resetToken, password, password_confirmation);
      
      toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.");
      navigate("/login");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi đặt lại mật khẩu");
    } finally {
      setIsLoading(false);
    }
  }

  if (!resetToken) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Xác nhận mật khẩu mới
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswordConfirmation ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu mới"
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswordConfirmation ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Bạn nhớ mật khẩu?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
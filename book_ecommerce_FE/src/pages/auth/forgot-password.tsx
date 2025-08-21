import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
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
import { forgotPasswordSchema } from "@/schemas/reset-password.schema";
import { forgotPassword } from "@/services/api.service";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    mode: "onTouched",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    try {
      setIsLoading(true);
      const { email } = data;
      
      await forgotPassword(email);
      
      toast.success("Đã gửi email reset password! Vui lòng kiểm tra hộp thư của bạn.");
      navigate("/login");
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(error?.message || "Có lỗi xảy ra khi gửi email reset password");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-gray-600">
            Nhập email của bạn để nhận link reset mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                      />
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
                {isLoading ? "Đang gửi..." : "Gửi email reset mật khẩu"}
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

export default ForgotPassword;
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Auto redirect sau 5 giây
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/orders"); // Redirect đến trang orders
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoToOrders = () => {
    navigate("/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Thanh toán thành công!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Đơn hàng của bạn đã được xử lý thành công. Cảm ơn bạn đã mua hàng!
          </p>
          
          {sessionId && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Mã phiên thanh toán:</p>
              <p className="text-xs font-mono break-all">{sessionId}</p>
            </div>
          )}
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-4">
              Tự động chuyển hướng trong {countdown} giây...
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={handleGoToOrders}
                className="w-full"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Xem đơn hàng ngay
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, Home } from "lucide-react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto redirect về checkout sau 10 giây
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/checkout"); // Redirect về trang checkout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleBackToCheckout = () => {
    navigate("/checkout");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Thanh toán bị hủy
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Quá trình thanh toán đã bị hủy bỏ. Đơn hàng của bạn chưa được xử lý.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Lưu ý:</strong> Giỏ hàng của bạn vẫn được giữ nguyên. 
              Bạn có thể quay lại và thực hiện thanh toán bất kỳ lúc nào.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-4">
              Tự động quay lại trang thanh toán trong {countdown} giây...
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={handleBackToCheckout}
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại thanh toán
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleGoHome}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Về trang chủ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
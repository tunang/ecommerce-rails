import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '@/services/api.service';

const ConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Token xác thực không hợp lệ');
        return;
      }

      try {
        const response = await api.post(`/users/confirm?token=${token}`);
        
        if (response.status === 200) {
          setStatus('success');
          setMessage('Xác thực tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.');
        } else {
          setStatus('error');
          setMessage('Xác thực thất bại. Vui lòng thử lại.');
        }
      } catch (error: any) {
        setStatus('error');
        if (error.response?.status === 400) {
          setMessage('Token đã hết hạn hoặc không hợp lệ');
        } else if (error.response?.status === 404) {
          setMessage('Người dùng không tồn tại');
        } else {
          setMessage('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.');
        }
        console.error('Verification error:', error);
      }
    };

    verifyUser();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  // Auto redirect after 3 seconds if success
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl font-bold ${getStatusColor()}`}>
            {status === 'loading' && 'Đang xác thực...'}
            {status === 'success' && 'Xác thực thành công!'}
            {status === 'error' && 'Xác thực thất bại'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>
          
          {status === 'success' && (
            <p className="text-sm text-gray-500">
              Tự động chuyển hướng đến trang đăng nhập sau 3 giây...
            </p>
          )}
          
          <Button 
            onClick={handleGoToLogin}
            className="w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Đang xử lý...' : 'Đến trang đăng nhập'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmPage;
import { useFetch } from "@/hooks/useFetch";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Package, 
  ChevronRight,
  ZoomIn,
  Calendar,
  User,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import type { Book } from "@/types/book.type";
import { formatPrice, calculateDiscountedPrice, formatDate } from "@/utils/utils";

interface BookDetailResponse {
  status: {
    code: number;
    message: string;
  };
  book: Book;
}

const BookDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const { data, loading, error } = useFetch<BookDetailResponse>(`/books/${id}`);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>
          
          {/* Content Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link to="/category">Quay lại danh mục</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-muted-foreground mb-4">
              Sản phẩm này có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Button asChild>
              <Link to="/category">Tìm sản phẩm khác</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { book } = data;
  const discountedPrice = book.discount_percentage !== "0.0" 
    ? calculateDiscountedPrice(book.price, book.discount_percentage)
    : null;

  const allImages = [book.cover_image_url, ...book.sample_page_urls];
  const currentImage = selectedImage || book.cover_image_url;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <ChevronRight className="h-4 w-4" />
        {book.categories[0] && (
          <>
            <Link 
              to={`/category/${book.categories[0].id}`} 
              className="hover:text-foreground"
            >
              {book.categories[0].name}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="text-foreground font-medium truncate">{book.title}</span>
      </nav>

      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/category">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Link>
      </Button>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative  aspect-[1/1] bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={`http://localhost:3001${currentImage}`}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-book.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              {book.discount_percentage !== "0.0" && (
                <Badge variant="destructive" className="font-semibold">
                  -{book.discount_percentage}%
                </Badge>
              )}
              {book.featured && (
                <Badge variant="secondary" className="bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((imageUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imageUrl)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    (selectedImage || book.cover_image_url) === imageUrl
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={`http://localhost:3001${imageUrl}`}
                    alt={`${book.title} - hình ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {book.categories.map((category) => (
              <Badge key={category.id} variant="outline" asChild>
                <Link to={`/category/${category.id}`}>
                  {category.name}
                </Link>
              </Badge>
            ))}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{book.title}</h1>
            {/* Authors */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Tác giả: {book.authors.map(author => author.name).join(", ")}</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {discountedPrice ? (
                <>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(book.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(book.price)}
                </span>
              )}
            </div>
            {discountedPrice && (
              <p className="text-sm text-green-600">
                Tiết kiệm {formatPrice(parseFloat(book.price) - discountedPrice)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className={`font-medium ${
              book.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {book.stock_quantity > 0 
                ? `Còn ${book.stock_quantity} cuốn trong kho` 
                : 'Hết hàng'
              }
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
            <p className="text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <Separator />

          {/* Quantity & Actions */}
          <div className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <label className="font-medium">Số lượng:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(book.stock_quantity, quantity + 1))}
                  disabled={quantity >= book.stock_quantity}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                disabled={book.stock_quantity === 0}
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {book.stock_quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold">Thông tin chi tiết</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ngày xuất bản: {formatDate(book.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Trạng thái: {book.active ? 'Đang bán' : 'Ngừng bán'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
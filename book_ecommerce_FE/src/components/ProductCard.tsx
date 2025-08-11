import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import type { Book } from "@/types/book.type";
import { formatPrice, calculateDiscountedPrice } from "@/utils/utils";

interface ProductCardProps {
  book: Book;
  className?: string;
}

const ProductCard = ({ book, className = "" }: ProductCardProps) => {
  const discountedPrice = book.discount_percentage !== "0.0" 
    ? calculateDiscountedPrice(book.price, book.discount_percentage)
    : null;

    console.log(book)
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      <CardHeader className="p-0 relative">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={"http://localhost:3001"+ book.cover_image_url }
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-book.jpg";
            }}
          />
          
          {/* Discount Badge */}
          {book.discount_percentage !== "0.0" && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 font-semibold"
            >
              -{book.discount_percentage}%
            </Badge>
          )}

          {/* Featured Badge */}
          {book.featured && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 bg-yellow-500 text-white"
            >
              <Star className="w-3 h-3 mr-1" />
              Nổi bật
            </Badge>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" className="rounded-full" asChild>
              <Link to={`/books/${book.id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="rounded-full">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-2">
          {book.categories.slice(0, 2).map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              {category.name}
            </Badge>
          ))}
          {book.categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{book.categories.length - 2}
            </Badge>
          )}
        </div>

        {/* Title */}
        <Link to={`/books/${book.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>

        {/* Authors */}
        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
          {book.authors.map(author => author.name).join(", ")}
        </p>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {book.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {discountedPrice ? (
            <>
              <span className="font-bold text-primary text-lg">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(book.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-primary text-lg">
              {formatPrice(book.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between">
          <span className={`text-xs ${book.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.stock_quantity > 0 ? `Còn ${book.stock_quantity} cuốn` : 'Hết hàng'}
          </span>
        </div>
      </CardContent>

      {/* <CardFooter className="p-4 pt-0">
       
      </CardFooter> */}
    </Card>
  );
};

export default ProductCard;
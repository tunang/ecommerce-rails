import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Address } from "@/types/address.type";
import { Pencil, Trash2, MapPin, Phone, User } from "lucide-react";

interface AddressBoxProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

export function AddressBox({ address, onEdit, onDelete }: AddressBoxProps) {
  return (
    <Card className="w-full relative">
      {address.is_default && (
        <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">
          Mặc định
        </Badge>
      )}
      
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Tên người nhận */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">
              {address.first_name} {address.last_name}
            </span>
          </div>

          {/* Địa chỉ */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <div>{address.address_line_1}</div>
              {address.address_line_2 && <div>{address.address_line_2}</div>}
              <div>
                {address.city}, {address.state} {address.postal_code}
              </div>
              <div>{address.country}</div>
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{address.phone}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className="flex-1"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(address)}
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
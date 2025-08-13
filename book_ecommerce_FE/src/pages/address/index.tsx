import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import type { RootState } from "@/store";
import type { Address } from "@/types/address.type";
import {
  fetchAddressesRequest,
  deleteAddressRequest,
  clearError,
} from "@/store/slices/addressSlice";
import { AddressModal } from "./AddressModal";
import { AddressBox } from "./AddressBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function AddressPage() {
  const dispatch = useDispatch();
  const { addresses, isLoading, error } = useSelector((state: RootState) => state.address);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  // Fetch addresses khi component mount
  useEffect(() => {
    dispatch(fetchAddressesRequest());
  }, [dispatch]);

  // Clear error sau 5 giây
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateAddress = () => {
    setModalMode("create");
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setModalMode("edit");
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (address: Address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      dispatch(deleteAddressRequest({ addressId: addressToDelete.id }));
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
    // Refresh addresses after modal close
    setTimeout(() => {
      dispatch(fetchAddressesRequest());
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Địa chỉ của tôi</CardTitle>
          <Button onClick={handleCreateAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {isLoading && addresses.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <AddressBox
                  key={address.id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
              <Button onClick={handleCreateAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={selectedAddress}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
          {addressToDelete && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="font-medium">
                {addressToDelete.first_name} {addressToDelete.last_name}
              </p>
              <p className="text-sm text-gray-600">{addressToDelete.address_line_1}</p>
              <p className="text-sm text-gray-600">
                {addressToDelete.city}, {addressToDelete.state}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddressPage;
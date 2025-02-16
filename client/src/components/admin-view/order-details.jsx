import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus
} from "@/store/admin/order-slice";
import { useToast } from "@/hooks/use-toast";

const initialFormData = {
  status: ""
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateOrderStatus(e) {
    e.preventDefault();
    console.log("formData : ", formData);
    const { status } = formData;

    if (!status) return;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      console.log("Datata :: ", data);
      if (data?.payload?.success) {
        // we will update that orderDetails
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        // we wil get all the orders
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message
        });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[600px] sm:max-h-[600px] overflow-y-scroll my-5">
      <div className="grid gap-6 my-5">
        <div className="grid gap-2">
          <div className="flex items-center justify-between mt-6">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails.cartItems.map((item) => (
                    <li
                      className="flex items-center justify-between"
                      key={item?._id}
                    >
                      <span>Title : {item?.title}</span>
                      <span>Quantity : {item?.quantity}</span>
                      <span>Price: ${item?.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>Username : {orderDetails?.buyer}</span>
              <span>Address : {orderDetails?.addressInfo?.address}</span>
              <span>City : {orderDetails?.addressInfo?.city}</span>
              <span>Pincode : {orderDetails?.addressInfo?.pincode}</span>
              <span>Phone : {orderDetails?.addressInfo?.phone}</span>
              <span>Notes : {orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div className="mb-5">
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                type: "select",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", value: "pending", label: "Pending" },
                  { id: "inProcess", value: "inProcess", label: "In Process" },
                  {
                    id: "inShipping",
                    value: "inShipping",
                    label: "In Shipping"
                  },
                  { id: "delivered", value: "delivered", label: "Delivered" },
                  { id: "rejected", value: "rejected", label: "Rejected" }
                ]
              }
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateOrderStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

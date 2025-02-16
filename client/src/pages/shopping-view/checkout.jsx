import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import img from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCarts);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();
  console.log("CARTITEMS ", cartItems);
  console.log("currentSelectedAddress : ", currentSelectedAddress);

  const totalCartAmount =
    cartItems && cartItems?.items && cartItems?.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            Number(
              currentItem?.salePrice > 0
                ? currentItem?.salePrice
                : currentItem?.price
            ) *
              Number(currentItem?.quantity),
          0
        )
      : 0;

  function handleInitiatePaypalPayment() {
    // throw error when cart is empty
    if (cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive"
      });
      return;
    }

    // throw error when address is not selected
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: ""
    };

    console.log("orderData : ", orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("ORDER CREATED SUCCESSFULLY : ", data);
      if (data?.payload?.success) {
        console.log("YESS");
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  // if approval URL is available, we will navigate to that url
  if (approvalURL && isPaymentStart) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          className="h-full w-full object-cover object-center"
          alt="checkoutHeader"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          selectedId={currentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} key={item?.productId} />
              ))
            : null}

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePaypalPayment}
              disable={isPaymentStart}
              className="w-full"
            >
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;

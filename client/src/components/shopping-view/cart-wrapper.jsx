import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  //   console.log("CARTITEM : ", cartItems);
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems?.length > 0
      ? cartItems.reduce(
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

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent cartItem={item} key={item?.productId} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/checkout");
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;

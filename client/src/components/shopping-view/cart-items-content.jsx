import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCarts);
  const {productList} = useSelector(state => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully"
        });
      }
    });
  }

  function handleUpdateQuantity(getCartItem, typeOfAction) {

    if (typeOfAction === "plus"){
      let getCartItems = cartItems.items || [];
      if (getCartItems.length){
        const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCartItems?.productId);

        // get the total stock for this particular product from the product list
        const getCurrentProductIndex = productList.findIndex(product => product?._id === getCartItem?.productId);

        const getTotalStock = productList[getCurrentProductIndex].totalStock;
        if (indexOfCurrentItem > -1){
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;

          if (getQuantity + 1 > getTotalStock){
            toast({
              title: `Only ${getTotalStock} quantity can be added for this item`,
              variant: "destructive"
            })

            return;
          }
        }

        
      }
    }


    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully"
        });
      }
    });
  }

  
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        className="w-20 h-20 rounded object-cover"
        alt={cartItem?._id}
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            className="h-8 w-8 rounded-full"
            disabled={cartItem?.quantity === 1}
            variant="outline"
            size="icon"
          >
            <Minus className="w-4 h-4 text-gray-700" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            className="h-8 w-8 rounded-full"
            variant="outline"
            size="icon"
          >
            <Plus className="w-4 h-4 text-gray-700" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent;

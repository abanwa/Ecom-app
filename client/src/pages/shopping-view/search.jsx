import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults } from "@/store/shop/search-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { resetSearchResults } from "../../store/shop/search-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { cartItems } = useSelector((state) => state.shopCarts);
  const { user } = useSelector((state) => state?.auth);
  const { productDetails } = useSelector((state) => state?.shopProducts);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();

  const { toast } = useToast();

  // This will add the product to cart when we click add to cart\
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    // console.log("product id to add to cart is : ", getCurrentProductId);

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity can be added for this item`,
            variant: "destructive"
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // we will fetch the list of items in the user's cart
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart"
        });
      }
    });
  }

  // Get a single Product Details base on the product id
  function handleGetProductDetails(getCurrentProductId) {
    // console.log("getCurrentProductId : ", getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 3) {
      // after 1s === 1000ms, the URL will set the keyword to the keyword we search for
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [dispatch, keyword, setSearchParams]);

  // when we fetch the single product detail base on the id, we will open the modal. or when we load the page and the single product detail is already fetch, the detail dailog modal will be open
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  console.log("searchResults : ", searchResults);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products..."
          />
        </div>
      </div>
      {
        // This is a conditional rendering, if the searchResults is not empty, we will display the searchResults
        !searchResults.length ? (
          <h1 className="text-5xl font-extrabold">No result found</h1>
        ) : null
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((item, index) => (
            <ShoppingProductTile
              product={item}
              handleAddToCart={handleAddToCart}
              handleGetProductDetails={handleGetProductDetails}
              key={index}
            />
          ))}
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;

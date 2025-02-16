import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "../../store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const { user } = useSelector((state) => state?.auth);
  const { cartItems } = useSelector((state) => state.shopCarts);
  const { reviews } = useSelector((state) => state.shopReview);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { toast } = useToast();
  // This will add the product to cart when we click add to cart\
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    console.log(
      "product id to add to cart in product-details.jsx is : ",
      getCurrentProductId
    );

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

  // this will close the single Product detail modal and also it will set that product detail back to null
  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  // this will set the star-rating number
  function handleRatingChange(getRating) {
    if (getRating !== rating) {
      setRating(getRating);
    }
  }

  // This will add the review
  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating
      })
    ).then((data) => {
      // console.log("success data for adding review : ", data);
      if (data?.payload?.success) {
        // we will get all the reviews for that product
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully"
        });
        setReviewMsg("");
        setRating(0);
      } else {
        // console.log("failed addreview data : ", data);
        setReviewMsg("");
        setRating(0);
        toast({
          title: data?.payload?.message,
          variant: "destructive"
        });
      }
    });
  }

  // get the first two letters
  function getUserNameLetters(name) {
    if (name.trim().length > 0) {
      return name.slice(0, 2).toUpperCase();
    }
    return null;
  }

  // when we open the modal, we will check whether the product detail is available or not
  useEffect(() => {
    if (productDetails !== null) {
      // if the product details is available, we will get all the reviews for that product
      dispatch(getReviews(productDetails?._id));
    }
  }, [dispatch, productDetails]);

  // we will calculate the average review for the product
  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // console.log("productDetails : ", productDetails);
  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
            alt={productDetails?.title}
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-2xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-1xl mb-3 mt-2">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`${
                productDetails?.salePrice > 0 ? "line-through" : ""
              } text-2xl font-bold text-primary`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p
                className={`${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                } text-1xl font-bold text-muted-foreground`}
              >
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
              {/* <StarIcon className="w-4 h-4 fill-primary" /> */}
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>
          <div className="mt-2 mb-2">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Review</h2>
            <div className="grid gap-5">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-3" key={reviewItem?._id}>
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {getUserNameLetters(reviewItem?.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem?.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No reviews</h1>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;

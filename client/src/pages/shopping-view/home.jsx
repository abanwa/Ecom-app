import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon
} from "lucide-react";
// import bannerOne from "../../assets/banner-1.webp";
// import bannerTwo from "../../assets/banner-2.webp";
// import bannerThree from "../../assets/banner-3.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate } from "react-router-dom";
import { getFeatureImages } from "../../store/common-slice";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon }
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater }
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // const slides = [bannerOne, bannerTwo, bannerThree];

  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem?.id]
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }

  // Get a single Product Details base on the product id
  function handleGetProductDetails(getCurrentProductId) {
    // console.log("getCurrentProductId : ", getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // This will add the product to cart when we click add to cart\
  function handleAddToCart(getCurrentProductId) {
    console.log("product id to add to cart is : ", getCurrentProductId);
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

  // 30000ms = 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 30000);

    // this will clear the interval
    return () => clearInterval(timer);
  }, [featureImageList.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh"
      })
    );
  }, [dispatch]);

  // when we fetch the single product detail base on the id, we will open the modal. or when we load the page and the single product detail is already fetch, the detail dailog modal will be open
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  console.log("productList : ", productList);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                key={slide?._id}
              />
            ))
          : null}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={categoryItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 text-primary" />
                  <span className="font-bold">{categoryItem?.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                key={brandItem.id}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 text-primary" />
                  <span className="font-bold">{brandItem?.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    product={productItem}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                    key={productItem?._id}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;

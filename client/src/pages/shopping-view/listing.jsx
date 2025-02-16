import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { setNewFilter, setNewSort } from "@/store/shop/app-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      // this will convert the array value ['a', 'b', 'c'] to a string "a,b,c"
      // category=men,women
      const paramValue = value.join(",");

      // the encodeURI will convert the string to a format that can be used in the URL // category=menC%women
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  // afterwards, we will separate the category and brand with an AND "&"
  return queryParams.join("&");
}

function ShoppingListing() {
  const { sort, filters } = useSelector((state) => state.shopApp);
  const { cartItems } = useSelector((state) => state.shopCarts);

  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state?.shopProducts
  );
  const { user } = useSelector((state) => state?.auth);
  // const [filters, setFilters] = useState({});
  // const [sort, setSort] = useState(null);
  //const [filters, setFilters] = useState(
  //JSON.parse(sessionStorage.getItem("filters")) || {}
  //);
  //const [sort, setSort] = useState("price-lowtohigh");
  const [, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  //const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    if (sort !== value) {
      console.log("Current Sort Value : ", value);
      //setSort(value);
      dispatch(setNewSort(value));
    }
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log(
      `getSectionId and  getCurrentOption  are : 
      ${getSectionId} and 
      ${getCurrentOption}`
    );

    // let copyFilters = { ...filters };
    // Create a deep copy of the filters object
    let copyFilters = JSON.parse(JSON.stringify(filters));
    // let copyFilters = structuredClone(filters);
    // check if the index of the section (that is either category or brand) is present or not
    const indexOfCurrentSection =
      Object.keys(copyFilters).indexOf(getSectionId);
    // if the index is -1, it means no filter is added. it does not exist
    // here, we will check if the brand or category key exist
    if (indexOfCurrentSection === -1) {
      copyFilters = { ...copyFilters, [getSectionId]: [getCurrentOption] };
    } else {
      // check if the index of the item in the brand or category array exist
      const indexOfCurrentOption =
        copyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        copyFilters[getSectionId].push(getCurrentOption);
      } else {
        copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    //setFilters(copyFilters);
    //sessionStorage.setItem("filters", JSON.stringify(copyFilters));
    dispatch(setNewFilter(copyFilters));
  }

  // Get a single Product Details base on the product id
  function handleGetProductDetails(getCurrentProductId) {
    // console.log("getCurrentProductId : ", getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

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

  // we will get the already set filters when the page loads and we will also set the sort default option to be price-low to high
  /*
  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);
  */

  // we will set our search parameters base on the filter when this page loads
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  //fetch list of products
  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  // when we fetch the single product detail base on the id, we will open the modal. or when we load the page and the single product detail is already fetch, the detail dailog modal will be open
  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  // console.log("sort ", sort);
  // console.log("filters ", filters);
  // console.log("searchParams ", searchParams);
  //console.log("categorySearchParam : ", categorySearchParam);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold mr-2">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-gray-800"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem?.id}
                      key={sortItem?.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddToCart={handleAddToCart}
                  key={productItem?._id}
                />
              ))
            : null}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;

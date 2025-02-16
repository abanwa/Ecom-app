import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  // this will get the search parameters in the URL
  const params = new URLSearchParams(location.search);
  // const paymentId = params.get("paymentId");
  const token = params.get("token");
  const payerId = params.get("PayerID");

  useEffect(() => {
    // if (paymentId && payerId) {
    if (token && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      dispatch(
        capturePayment({
          //paymentId,
          token,
          payerId,
          orderId
        })
      ).then((data) => {
        if (data?.payload?.success) {
          // we will remove the currentOrderId we set in our sessionStorage in the orser slice/index
          sessionStorage.removeItem("currentOrderId");
          // we will redirect the user to the order page
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [dispatch, payerId, token]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;

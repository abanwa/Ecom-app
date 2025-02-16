import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment is Successful!</CardTitle>
      </CardHeader>
      <Button onClick={() => navigate("/shop/account")} className="mt-5">
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;

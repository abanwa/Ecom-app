import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: ""
};
function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    console.log("Login Submit button clicked");
    dispatch(loginUser(formData)).then((data) => {
      console.log("DATA : ", data);
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message
        });
        navigate("/shop/home");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive"
        });
      }
    });
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Do not have an account ?{" "}
          <Link
            to="/auth/register"
            className="font-medium ml-2 text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;

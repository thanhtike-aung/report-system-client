import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { MESSAGE } from "@/constants/messages";
import { useLoginMutation } from "@/redux/apiServices/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/auth";
import useToast from "@/hooks/useToast";

const schema = z.object({
  email: z.string().email(MESSAGE.ERROR.INVALID_EMAIL_FORMAT),
  password: z.string().min(6, MESSAGE.ERROR.SHORT_PASSWORD),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [token, setToken] = useState<null | string>(null);
  const [loginMutation, { isSuccess, isLoading }] = useLoginMutation();
  const { showError } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!data) return;
    try {
      const response = await loginMutation(data).unwrap();
      setToken(response as string);
    } catch (error: any) {
      if (error.status === "FETCH_ERROR") {
        showError(MESSAGE.ERROR.SERVER_ERROR, { position: "top-center" });
        return;
      }
      showError(error.data.message);
    }
  };

  useEffect(() => {
    if (!isSuccess || !token) return;
    dispatch(login(token));
    navigate("/report/self");
  }, [isSuccess, token, navigate]);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-background mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Morning 🌅</CardTitle>
            <CardDescription>
              Enter your email and password to sign in to your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-4.5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm text-left">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {isLoading ? (
                <Button className="w-full mt-5 custom-primary" disabled>
                  <Loader2 className="animate-spin" />
                  Signing in
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full mt-5 custom-primary custom-animate-button"
                >
                  Sign in
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}

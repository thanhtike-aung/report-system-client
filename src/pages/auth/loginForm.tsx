import { useEffect, useState } from "react";
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
import { Eye, EyeOff, Fingerprint, KeyRound, Loader2 } from "lucide-react";
import { MESSAGE } from "@/constants/messages";
import { useLoginMutation } from "@/redux/apiServices/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/auth";
import useToast from "@/hooks/useToast";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [token, setToken] = useState<null | string>(null);
  const [loginMutation, { isSuccess, isLoading }] = useLoginMutation();
  const { showError } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = MESSAGE.ERROR.INVALID_EMAIL_FORMAT;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = MESSAGE.ERROR.INVALID_EMAIL_FORMAT;
      isValid = false;
    }

    if (!password) {
      newErrors.password = MESSAGE.ERROR.SHORT_PASSWORD;
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = MESSAGE.ERROR.SHORT_PASSWORD;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await loginMutation({ email, password }).unwrap();
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
    navigate("/attendances/self");
  }, [isSuccess, token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            Login
            <KeyRound className="h-6 w-6" />
          </CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm text-left">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full no-override"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                  {errors.password}
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
  );
}

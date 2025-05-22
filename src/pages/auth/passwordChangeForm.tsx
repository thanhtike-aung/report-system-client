import React, { useState, useEffect } from "react";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useToast from "@/hooks/useToast";
import { useChangePasswordMutation } from "@/redux/apiServices/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { decodeJWT } from "@/utils/jwt";
import { MESSAGE, STATUS_CODES } from "@/constants/messages";

const PasswordChangeForm: React.FC = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const authToken = useSelector((state: RootState) => state.auth.authToken);
  const currentUser = decodeJWT(authToken);
  const [
    changePasswordMutation,
    { isLoading: isChangePasswordLoading, isSuccess: isChangePasswordSuccess },
  ] = useChangePasswordMutation();
  const { showSuccess, showError } = useToast();

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!formData.newPassword || formData.newPassword.length < 7) {
      newErrors.newPassword = "Password must be at least 7 characters";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await changePasswordMutation({
        userId: currentUser.id,
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();
    } catch (error: any) {
      if (error.status === STATUS_CODES.UNAUTHORIZED) {
        showError(error.data.message);
        return;
      }
      console.error(error);
      showError(MESSAGE.ERROR.UNKNOWN_ERROR);
    }
  };

  useEffect(() => {
    if (isChangePasswordSuccess) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSuccess(`Password ${MESSAGE.SUCCESS.UPDATED}`);
    }
  }, [isChangePasswordSuccess]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                className={
                  errors.currentPassword ? "border-red-500 pr-10" : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full no-override"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showCurrentPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                className={
                  errors.newPassword ? "border-red-500 pr-10" : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full no-override"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showNewPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={
                  errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="custom-outline absolute right-0 top-0 px-3 py-2 !hover:bg-transparent !bg-transparent !rounded-full no-override"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full mt-5 custom-primary custom-animate-button"
            disabled={isChangePasswordLoading}
          >
            {isChangePasswordLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordChangeForm;

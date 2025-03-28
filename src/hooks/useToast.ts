import { ReactElement } from "react";
import { toast, ToastOptions, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UseToast {
  showSuccess: (message: string | ReactElement, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showToast: (message: string, options?: ToastOptions) => void;
}

const useToast = (): UseToast => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "dark",
    transition: Zoom,
  };

  const showSuccess = (
    message: string | ReactElement,
    options: ToastOptions = {}
  ) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message: string, options: ToastOptions = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  const showInfo = (message: string, options: ToastOptions = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  };

  const showWarning = (message: string, options: ToastOptions = {}) => {
    toast.warn(message, { ...defaultOptions, ...options });
  };

  const showToast = (message: string, options: ToastOptions = {}) => {
    toast(message, { ...defaultOptions, ...options });
  };

  return { showSuccess, showError, showInfo, showWarning, showToast };
};

export default useToast;

import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error500: React.FC<{ errorCode?: number; message?: string }> = ({
  errorCode = 500,
  message = "Something went wrong at server side. Please try again. \nIf issue is still persisting, report to developer.",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <div className="text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">{errorCode}</h1>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{message}</p>
        </div>
        <Button className="mt-6" onClick={() => navigate(0)}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default Error500;

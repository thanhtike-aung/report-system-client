import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface WorkflowsStep {
  id: number;
  title: string;
  description: string;
  content: {
    type: string;
    source: string;
  };
}

const workflowsSteps: WorkflowsStep[] = [
  {
    id: 1,
    title: "Login Teams",
    description: "Login your Microsoft Teams account.",
    content: {
      type: "text",
      source: "",
    },
  },
  {
    id: 2,
    title: "Workflows",
    description:
      "Right click on channel which will be used for reporting and click 'Workflows'.",
    content: {
      type: "img",
      source: "/workflows/step2.png",
    },
  },
  {
    id: 3,
    title: "Select workflow",
    description:
      "Find and select 'Post to a channel when a webhook request is received'.",
    content: {
      type: "img",
      source: "/workflows/step3.png",
    },
  },
  {
    id: 4,
    title: "Waiting",
    description:
      "Wait for microsoft to sign in with your account. If this step take too long, you may need to use VPN.",
    content: {
      type: "img",
      source: "/workflows/step4.png",
    },
  },
  {
    id: 5,
    title: "Check and continue",
    description: "Check your account and click 'Next'.",
    content: {
      type: "img",
      source: "/workflows/step5.png",
    },
  },
  {
    id: 6,
    title: "Select team and channel",
    description:
      "Select your desired team and channel that will be used for reporting.",
    content: {
      type: "img",
      source: "/workflows/step6.png",
    },
  },
  {
    id: 7,
    title: "Added successfully",
    description:
      "Finally workflow will be added successfully. Copy the generated URL and paste it in user creation.",
    content: {
      type: "img",
      source: "/workflows/step7.png",
    },
  },
];

const WorkflowsDialog = ({ open, setOpen }: Props) => {
  const [currentStep, setCurrentStep] = useState(1);

  const currentStepData =
    workflowsSteps.find((step) => step.id === currentStep) || workflowsSteps[0];

  const handleNext = () => {
    if (currentStep < workflowsSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Microsoft Workflows Creation
          </DialogTitle>
          <DialogDescription>
            Follow these steps to create workflows that will be used for evening
            report.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 flex flex-col overflow-hidden">
          <div className="relative mb-8 px-4">
            {/* Horizontal line that connects all steps */}
            <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-300" />

            {/* Progress line that shows completed steps */}
            <div
              className="absolute top-4 left-0 h-[2px] bg-green-500 transition-all duration-300"
              style={{
                width: `${((currentStep - 1) / (workflowsSteps.length - 1)) * 100}%`,
              }}
            />

            {/* Step indicators */}
            <div className="flex justify-between relative">
              {workflowsSteps.map((step) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white",
                      currentStep === step.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : currentStep > step.id
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 text-gray-500"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-1 text-center max-w-[80px]",
                      currentStep === step.id
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg mb-6 overflow-y-auto flex-1">
            <div className="h-[500px]">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Step {currentStepData.id}: {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {currentStepData.description}
              </p>
              {currentStepData.content.type === "text" ? (
                <div className="text-gray-700">
                  {currentStepData.content.source}
                </div>
              ) : (
                <img src={currentStepData.content.source} />
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500 mt-2.5">
            Step {currentStep} of {workflowsSteps.length}
          </div>
          <Button
            onClick={handleNext}
            disabled={currentStep === workflowsSteps.length}
            className="custom-primary"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowsDialog;

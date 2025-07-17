import { useState } from "react";
import { Bot, Check } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

type AIModel = {
  id: string;
  name: string;
  available: boolean;
  description: string;
  icon?: string;
};

const models: AIModel[] = [
  {
    id: "gemini",
    name: "Gemini",
    available: false,
    description:
      "Google's multimodal AI model with strong reasoning capabilities",
    icon: "/ai_models/gemini.svg",
  },
  {
    id: "mistral",
    name: "Mistral",
    available: false,
    description: "Efficient open-source language model with strong performance",
    icon: "/ai_models/mistral.svg",
  },
  {
    id: "openai",
    name: "OpenAI",
    available: false,
    description: "GPT models with advanced language understanding",
    icon: "/ai_models/openai.svg",
  },
];

interface AIModelSelectorProps {
  onSelectModel: (modelId: string) => void;
  buttonText?: string;
}

export function AIModelSelector({
  onSelectModel,
  buttonText = "Summarize Reports",
}: AIModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleAction = () => {
    if (selectedModel) {
      onSelectModel(selectedModel);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Bot className="h-4 w-4" />
          AI assistant
          <Badge variant="secondary">Beta</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Select an AI Model<Badge className="ml-1.5">Beta</Badge>
          </DialogTitle>
          <DialogDescription>
            Choose an AI model to process your content
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.id}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border p-4 transition-all",
                model.available
                  ? "cursor-pointer hover:border-primary hover:shadow-sm"
                  : "cursor-not-allowed opacity-60",
                selectedModel === model.id && model.available
                  ? "border-2 border-primary bg-primary/5"
                  : "border-border"
              )}
              onClick={() => model.available && setSelectedModel(model.id)}
            >
              {!model.available && (
                <div className="absolute -right-2 -top-2 rotate-12 z-10">
                  <Badge variant="destructive" className="text-xs font-medium">
                    Not Available
                  </Badge>
                </div>
              )}

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                {model.icon?.endsWith(".svg") ? (
                  <img
                    src={model.icon}
                    alt={`${model.name} logo`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-semibold">{model.icon}</span>
                )}
              </div>

              <h3 className="text-sm font-medium">{model.name}</h3>

              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 text-center">
                {model.description}
              </p>

              {selectedModel === model.id && model.available && (
                <div className="absolute right-2 top-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleAction}
            disabled={
              !selectedModel ||
              !models.find((m) => m.id === selectedModel)?.available
            }
            className="w-full"
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

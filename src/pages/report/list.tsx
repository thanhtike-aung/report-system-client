import AdaptiveCardRenderer from "@/components/report/adaptiveCardRenderer";
import { AIModelSelector } from "@/components/report/aiModelSelectorDialog";
import { Button } from "@/components/ui/button";
import { useGetCardMessagesQuery } from "@/redux/apiServices/adaptiveCardMessage";
import React from "react";

const ReportList: React.FC = () => {
  const { data: cardMessages, isLoading } = useGetCardMessagesQuery();
  const handleSelectAiModel = () => {};
  if (isLoading) return "loading...";
  return (
    <div className="w-full max-w-6xl mx-auto my-12">
      <div className="flex justify-end">
        {/* <Button>AI assistant</Button> */}
        <AIModelSelector
          onSelectModel={handleSelectAiModel}
          buttonText="Summarize reports with AI"
        />
      </div>
      {cardMessages.map((message: any) => {
        return <AdaptiveCardRenderer cardPayload={message.card_message} />;
      })}
    </div>
  );
};

export default ReportList;

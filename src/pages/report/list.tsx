import LayoutView from "@/components/report/layoutView";
import { AIModelSelector } from "@/components/report/aiModelSelectorDialog";
import MicrosoftTeamsView from "@/components/report/microsoftTeamsView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateFilter from "@/components/widgets/date-filter";
import React, { useEffect, useState } from "react";
import { useGetReportsByIdAndWeekAgoQuery } from "@/redux/apiServices/report";
import { decodeJWT } from "@/utils/jwt";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { chatCompletion } from "@/utils/mistral_ai/chatCompletion";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ReportSummary from "@/components/report/reportSummary";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/utils/clipboard";

interface FormattedReport {
  name: string;
  reports: {
    project: string;
    task_title: string;
    task_description: string;
  }[];
}

const ReportList: React.FC = () => {
  const currentUser = decodeJWT(
    useSelector((state: RootState) => state.auth.authToken)
  );

  const [formattedReports, setFormattedReports] =
    useState<FormattedReport | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [setTest] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);

  const { data, isSuccess } = useGetReportsByIdAndWeekAgoQuery(currentUser.id);

  const handleSelectAiModel = async (selectedModel: string) => {
    if (selectedModel === "mistral" && formattedReports) {
      setDrawerOpen(true);
      setAiResponse({ loading: true });
      try {
        const prompt = `Please provide a structured summary of the weekly reports in a clean JSON format. The response should follow this exact structure:
{
  "reports": [
    {
      "project": "Project Name",
      "tasks": [
        {
          "title": "Task Title",
          "description": "Task Description"
        }
      ]
    }
  ]
}

Here are the reports to summarize: ${JSON.stringify(formattedReports)}`;

        const { data: aiData, success: isAiResponseSuccess } =
          await chatCompletion(prompt);

        if (isAiResponseSuccess && aiData?.choices?.[0]?.message?.content) {
          setAiResponse({ content: aiData.choices[0].message.content });
        } else {
          setAiResponse({ error: "Failed to get summary from AI." });
        }
      } catch (err) {
        setAiResponse({ error: "Failed to get summary from AI." });
      }
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCopy = async () => {
    if (aiResponse?.content && !isCopied) {
      const success = await copyToClipboard(aiResponse.content);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000); // Reset after 3 seconds
      }
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      setFormattedReports({
        name: currentUser.name,
        reports: data.map((item: any) => ({
          project: item.project,
          task_title: item.task_title,
          task_description: item.task_description,
        })),
      });
    }
  }, [isSuccess, data, currentUser.name]);

  useEffect(() => {
    if (!aiResponse || !aiResponse.content) return;
    const match = aiResponse.content.match(/```json\s*([\s\S]*?)```/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1].trim());
        // console.log(parsed);
        setTest(parsed);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    } else {
      console.error("JSON block not found in the response");
    }
  }, [aiResponse]);

  return (
    <div className="w-full max-w-5xl mx-auto my-7">
      <h2 className="text-xl font-semibold mb-6">Report List</h2>
      <div className="flex justify-between mb-5">
        <DateFilter onDateChange={handleDateChange} />
        <AIModelSelector
          onSelectModel={handleSelectAiModel}
          buttonText="Summarize reports with AI"
        />
      </div>
      <Tabs defaultValue="layoutView" className="w-full h-screen">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layoutView">Layout View</TabsTrigger>
          <TabsTrigger value="msTeamsView">Microsoft Teams View</TabsTrigger>
        </TabsList>
        <TabsContent value="layoutView" className="mt-3">
          <LayoutView date={selectedDate} />
        </TabsContent>
        <TabsContent value="msTeamsView">
          <MicrosoftTeamsView date={selectedDate} />
        </TabsContent>
      </Tabs>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="w-full mx-auto">
          <DrawerHeader className="relative">
            <div className="flex items-center justify-between">
              <DrawerTitle>Weekly Report Summary</DrawerTitle>
              {aiResponse?.content && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                  disabled={isCopied}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {aiResponse?.loading && (
              <div className="text-center py-4">Loading summary...</div>
            )}
            {aiResponse?.error && (
              <div className="text-red-500 py-4">{aiResponse.error}</div>
            )}
            {aiResponse?.content && (
              <ReportSummary content={aiResponse.content} />
            )}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ReportList;

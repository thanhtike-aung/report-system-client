import { useGetCardMessageByTypeQuery } from "@/redux/apiServices/adaptiveCardMessage";
import { User } from "@/types/user";
import { format, isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import AdaptiveCardRenderer from "../report/adaptiveCardRenderer";
import Error500 from "../error/500";
import { Attendance } from "@/types/attendance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useToast from "@/hooks/useToast";
import { copyAttendanceWithFormat } from "@/utils/attendance/copyAttendnaceWithFormat";
import AdaptiveCardViewSkeleton from "./adaptiveCardViewSkeleton";

interface CardMessage {
  id: number;
  card_message: string;
  created_at: string;
  user_id: number;
  user: User;
}

const AdaptiveCardView: React.FC<{ date: Date; attendances: Attendance[] }> = ({
  date,
  attendances,
}) => {
  const [cardMessageForDate, setCardMessageForDate] = useState<CardMessage[]>(
    []
  );
  const { data: cardMessages, isLoading } =
    useGetCardMessageByTypeQuery("attendance");
  const toast = useToast();

  useEffect(() => {
    if (!date || !cardMessages) return;
    const filtered = cardMessages
      .filter((c: any) => isSameDay(parseISO(c.created_at), date))
      .map((c: any) => ({
        ...c,
        created_at: format(parseISO(c.created_at), "yyyy/MM/dd HH:mm"),
      }));
    setCardMessageForDate(filtered);
  }, [date, cardMessages]);

  const handleCopy = async () => {
    const result = await copyAttendanceWithFormat(attendances);
    if (result) {
      toast.showSuccess("Copied to clipboard");
    } else {
      toast.showError("Failed to copy attendance");
    }
  };

  if (isLoading) return <AdaptiveCardViewSkeleton />;
  if (!cardMessageForDate) return <Error500 />;

  return (
    <div className="flex flex-col gap-6">
      {cardMessageForDate.map((message) => (
        <Card
          key={message.id}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-muted">
                <AvatarFallback className="text-muted-foreground font-medium">
                  {"Dev-02 Report System".slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-lg">Dev-02 Report System</CardTitle>
                <CardDescription>{message.created_at}</CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy()}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy attendance</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy attendance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <AdaptiveCardRenderer cardPayload={message.card_message} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdaptiveCardView;

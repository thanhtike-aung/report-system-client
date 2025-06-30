import {
  useGetCardMessagesQuery,
} from "@/redux/apiServices/adaptiveCardMessage";
import { format, isSameDay, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import AdaptiveCardRenderer from "./adaptiveCardRenderer";
import Error500 from "../error/500";
import { User } from "@/types/user";

interface props {
  date: Date;
}

interface CardMessage {
  id: number;
  card_message: string;
  created_at: string;
  user_id: number;
  user: User;
}

const MicrosoftTeamsView: React.FC<props> = ({ date }) => {
  const [cardMessageForDate, setCardMessageForDate] = useState<CardMessage[]>(
    []
  );
  const { data: cardMessages, isLoading } = useGetCardMessagesQuery();

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

  if (isLoading) return "loading...";
  if (!cardMessageForDate) return <Error500 />;
  return (
    <>
      {cardMessageForDate.map((message) => (
        <AdaptiveCardRenderer
          cardPayload={message.card_message}
          key={message.id}
        />
      ))}
    </>
  );
};

export default MicrosoftTeamsView;

import React, { useEffect, useRef } from "react";
import * as AdaptiveCards from "adaptivecards";

interface AdaptiveCardRendererProps {
  cardPayload: any;
}

const AdaptiveCardRenderer: React.FC<AdaptiveCardRendererProps> = ({
  cardPayload,
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardPayload) {
      return;
    }
    console.log(
      "cardPayload: ",
      JSON.parse(cardPayload).attachments[0].content
    );
    if (cardPayload && cardContainerRef.current) {
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();

      adaptiveCard.parse(JSON.parse(cardPayload).attachments[0].content);

      const renderedCard = adaptiveCard.render();

      if (!renderedCard) {
        console.error("Failed to render adaptive card.");
        return;
      }
      cardContainerRef.current.innerHTML = "";
      cardContainerRef.current.appendChild(renderedCard);
    }
  }, [cardPayload]);

  return <div ref={cardContainerRef}></div>;
};

export default AdaptiveCardRenderer;

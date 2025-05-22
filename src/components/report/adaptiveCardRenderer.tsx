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
    const parsedContent = JSON.parse(cardPayload).attachments[0].content;
    if (!parsedContent) {
      return;
    }
    if (parsedContent && cardContainerRef.current) {
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      if (Array.isArray(parsedContent.body)) {
        parsedContent.body.shift();
      }
      adaptiveCard.parse(parsedContent);

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

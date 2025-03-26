import React from "react";
import styled from "styled-components";

interface ButtonProps {
  contentText: string;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
}

const AnimateButton: React.FC<ButtonProps> = ({
  contentText,
  type = "button",
  disabled = false,
}) => {
  return (
    <StyledWrapper>
      <button type={type} disabled={disabled}>
        {" "}
        {contentText}
        <span />
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    border: none;
    display: block;
    position: relative;
    font-size: 14px;
    background: transparent;
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    color: #5b87ff;
    z-index: 1;
    font-family: inherit;
    font-weight: 500;
  }

  button span {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: -1;
    border: 2px solid #5b87ff;
  }

  button span::before {
    content: "";
    display: block;
    position: absolute;
    width: 8%;
    height: 500%;
    background: var(--lightgray);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-60deg);
    transition: all 0.7s;
  }

  button:hover span::before {
    transform: translate(-50%, -50%) rotate(-90deg);
    width: 100%;
    background: #5b87ff;
  }

  button:hover {
    color: white;
  }

  button:active span::before {
    background: #2751cd;
  }

  button:disabled {
    background-color: gray;
    color: white;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default AnimateButton;

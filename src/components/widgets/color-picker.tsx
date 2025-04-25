import React, { useState, useRef, useEffect } from "react";
import { SketchPicker, ColorResult, TwitterPicker } from "react-color";

type ColorPickerProps = {
  color?: string;
  onChange?: (color: string) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  color = "#5b87ff",
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [currentColor, setCurrentColor] = useState<string>(color);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (colorResult: ColorResult) => {
    const hex = colorResult.hex;
    setCurrentColor(hex);
    onChange?.(hex);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <div
        className="w-12 h-8 border cursor-pointer"
        style={{ backgroundColor: currentColor }}
        onClick={() => setShowPicker((prev) => !prev)}
      ></div>

      {showPicker && (
        <div className="absolute z-10 mt-2">
          <TwitterPicker
            color={currentColor}
            onChangeComplete={handleColorChange}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;

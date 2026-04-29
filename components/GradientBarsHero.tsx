"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Settings, X } from "lucide-react";
import { Component as GradientBarsBackground } from "@/components/ui/gradient-bars-background";

const presetColors = [
  "#ff3c00",
  "#ff006e",
  "#8338ec",
  "#3a86ff",
  "#06ffa5",
  "#ffbe0b"
];

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : "rgb(255, 60, 0)";
};

export function GradientBarsHero() {
  const [numBars, setNumBars] = useState(7);
  const [gradientColor, setGradientColor] = useState("#ff3c00");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <style>{`
        .font-modern {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .control-panel {
          backdrop-filter: blur(12px);
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .control-panel.hidden {
          transform: translateX(320px);
          opacity: 0;
          pointer-events: none;
        }
        .toggle-btn {
          backdrop-filter: blur(12px);
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s;
        }
        .toggle-btn:hover {
          background: rgba(0, 0, 0, 0.95);
          border-color: rgba(255, 255, 255, 0.4);
        }
        .control-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          transition: transform 0.2s;
        }
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
        .color-picker-wrapper {
          position: relative;
          width: 100%;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .color-picker-wrapper:hover {
          border-color: rgba(255, 255, 255, 0.5);
        }
        .color-picker {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          cursor: pointer;
          opacity: 0;
        }
        .color-display {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          font-size: 0.75rem;
        }
        .preset-btn {
          height: 36px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s;
          cursor: pointer;
        }
        .preset-btn:hover {
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.05);
        }
      `}</style>

      <GradientBarsBackground
        numBars={numBars}
        gradientFrom={hexToRgb(gradientColor)}
        gradientTo="transparent"
        animationDuration={2}
        backgroundColor="rgb(10, 10, 10)"
      >
        <button
          className="fixed left-2 top-1/2 z-40 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/75 p-3 text-white transition hover:bg-black/90 sm:left-3"
          aria-label="Previous"
          type="button"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          className="fixed right-2 top-1/2 z-40 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/75 p-3 text-white transition hover:bg-black/90 sm:right-3"
          aria-label="Next"
          type="button"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="toggle-btn fixed right-4 top-4 z-50 rounded-lg p-3 shadow-2xl"
          aria-label={isPanelOpen ? "Close controls" : "Open controls"}
        >
          {isPanelOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Settings className="h-5 w-5 text-white" />
          )}
        </button>

        <div
          className={`control-panel fixed right-4 top-16 z-40 w-[260px] rounded-xl p-4 shadow-2xl ${
            !isPanelOpen ? "hidden" : ""
          }`}
        >
          <h3 className="mb-4 text-base font-bold text-white">Customize</h3>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="control-label">Bars</label>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
                {numBars}
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              step="1"
              value={numBars}
              onChange={(event) => setNumBars(Number(event.target.value))}
              className="slider"
            />
          </div>

          <div className="mb-4">
            <label className="control-label">Color</label>
            <div className="color-picker-wrapper" style={{ background: gradientColor }}>
              <input
                type="color"
                value={gradientColor}
                onChange={(event) => setGradientColor(event.target.value)}
                className="color-picker"
              />
              <div className="color-display">{gradientColor.toUpperCase()}</div>
            </div>
          </div>

          <div>
            <label className="control-label mb-2">Presets</label>
            <div className="grid grid-cols-3 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setGradientColor(color)}
                  className="preset-btn"
                  style={{ background: color }}
                  aria-label={`Set color to ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="font-modern text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Gradient Bars
          </h1>
          <p className="text-lg font-medium text-gray-400 md:text-xl">
            {isPanelOpen
              ? "Customize using the panel"
              : "Click the settings icon to customize"}
          </p>
        </div>
      </GradientBarsBackground>
    </>
  );
}

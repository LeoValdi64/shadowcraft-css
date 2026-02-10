"use client";

import { useState, useCallback, useId } from "react";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  Layers,
  Settings,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Square,
  Circle,
  RectangleHorizontal,
  GripVertical,
  RotateCcw,
  Palette,
  Box,
} from "lucide-react";

// Types
interface ShadowLayer {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

interface PreviewSettings {
  shape: "square" | "rounded" | "circle";
  size: number;
  bgColor: string;
}

interface Preset {
  name: string;
  description: string;
  layers: Omit<ShadowLayer, "id">[];
}

// Presets
const PRESETS: Preset[] = [
  {
    name: "Subtle",
    description: "Light, barely-there shadow",
    layers: [
      { offsetX: 0, offsetY: 1, blur: 3, spread: 0, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Soft",
    description: "Gentle elevation effect",
    layers: [
      { offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: "#000000", opacity: 0.1, inset: false },
      { offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Medium",
    description: "Balanced depth shadow",
    layers: [
      { offsetX: 0, offsetY: 10, blur: 15, spread: -3, color: "#000000", opacity: 0.1, inset: false },
      { offsetX: 0, offsetY: 4, blur: 6, spread: -4, color: "#000000", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Dramatic",
    description: "Bold, high-contrast shadow",
    layers: [
      { offsetX: 0, offsetY: 25, blur: 50, spread: -12, color: "#000000", opacity: 0.25, inset: false },
      { offsetX: 0, offsetY: 8, blur: 16, spread: -8, color: "#000000", opacity: 0.15, inset: false },
    ],
  },
  {
    name: "Neon Purple",
    description: "Vibrant purple glow",
    layers: [
      { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: "#a855f7", opacity: 0.6, inset: false },
      { offsetX: 0, offsetY: 0, blur: 40, spread: 0, color: "#a855f7", opacity: 0.4, inset: false },
      { offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: "#a855f7", opacity: 0.2, inset: false },
    ],
  },
  {
    name: "Neon Cyan",
    description: "Electric cyan glow",
    layers: [
      { offsetX: 0, offsetY: 0, blur: 20, spread: 0, color: "#22d3d1", opacity: 0.6, inset: false },
      { offsetX: 0, offsetY: 0, blur: 40, spread: 0, color: "#22d3d1", opacity: 0.4, inset: false },
      { offsetX: 0, offsetY: 0, blur: 60, spread: 0, color: "#22d3d1", opacity: 0.2, inset: false },
    ],
  },
  {
    name: "Layered",
    description: "Multi-layer depth effect",
    layers: [
      { offsetX: 0, offsetY: 1, blur: 1, spread: 0, color: "#000000", opacity: 0.06, inset: false },
      { offsetX: 0, offsetY: 2, blur: 2, spread: 0, color: "#000000", opacity: 0.06, inset: false },
      { offsetX: 0, offsetY: 4, blur: 4, spread: 0, color: "#000000", opacity: 0.06, inset: false },
      { offsetX: 0, offsetY: 8, blur: 8, spread: 0, color: "#000000", opacity: 0.06, inset: false },
      { offsetX: 0, offsetY: 16, blur: 16, spread: 0, color: "#000000", opacity: 0.06, inset: false },
    ],
  },
  {
    name: "Inset",
    description: "Inner shadow effect",
    layers: [
      { offsetX: 0, offsetY: 2, blur: 4, spread: 0, color: "#000000", opacity: 0.15, inset: true },
      { offsetX: 0, offsetY: 1, blur: 2, spread: 0, color: "#000000", opacity: 0.1, inset: true },
    ],
  },
  {
    name: "Floating",
    description: "High elevation card effect",
    layers: [
      { offsetX: 0, offsetY: 20, blur: 25, spread: -5, color: "#000000", opacity: 0.15, inset: false },
      { offsetX: 0, offsetY: 10, blur: 10, spread: -5, color: "#000000", opacity: 0.08, inset: false },
      { offsetX: 0, offsetY: 0, blur: 0, spread: 1, color: "#3f3f46", opacity: 0.1, inset: false },
    ],
  },
  {
    name: "Hard Edge",
    description: "Sharp brutalist shadow",
    layers: [
      { offsetX: 8, offsetY: 8, blur: 0, spread: 0, color: "#a855f7", opacity: 1, inset: false },
    ],
  },
];

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function generateShadowCSS(layers: ShadowLayer[]): string {
  if (layers.length === 0) return "none";

  return layers
    .map((layer) => {
      const rgba = hexToRgba(layer.color, layer.opacity);
      const inset = layer.inset ? "inset " : "";
      return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${rgba}`;
    })
    .join(",\n    ");
}

// Components
function Slider({
  label,
  value,
  min,
  max,
  onChange,
  unit = "px",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-zinc-400">
          {label}
        </label>
        <span className="font-mono text-sm text-zinc-300">
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ColorPicker({
  label,
  color,
  opacity,
  onColorChange,
  onOpacityChange,
}: {
  label: string;
  color: string;
  opacity: number;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
}) {
  const colorId = useId();
  const opacityId = useId();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-zinc-400">{label}</label>
        <div className="flex items-center gap-2">
          <input
            id={colorId}
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="h-8 w-12 cursor-pointer overflow-hidden rounded-md border border-zinc-700"
          />
          <span className="font-mono text-xs text-zinc-500">{color.toUpperCase()}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={opacityId} className="text-sm text-zinc-400">Opacity</label>
          <span className="font-mono text-sm text-zinc-300">{Math.round(opacity * 100)}%</span>
        </div>
        <input
          id={opacityId}
          type="range"
          min={0}
          max={100}
          value={opacity * 100}
          onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
          className="w-full"
        />
      </div>
    </div>
  );
}

function ShadowLayerEditor({
  layer,
  index,
  total,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  layer: ShadowLayer;
  index: number;
  total: number;
  onUpdate: (updates: Partial<ShadowLayer>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const checkboxId = useId();

  return (
    <div className="animate-fade-in rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-all hover:border-zinc-700">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-zinc-600" />
          <span className="text-sm font-medium text-zinc-300">
            Layer {index + 1}
          </span>
          {layer.inset && (
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
              Inset
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move layer up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Move layer down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remove layer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Slider
            label="Offset X"
            value={layer.offsetX}
            min={-100}
            max={100}
            onChange={(value) => onUpdate({ offsetX: value })}
          />
          <Slider
            label="Offset Y"
            value={layer.offsetY}
            min={-100}
            max={100}
            onChange={(value) => onUpdate({ offsetY: value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Slider
            label="Blur"
            value={layer.blur}
            min={0}
            max={100}
            onChange={(value) => onUpdate({ blur: value })}
          />
          <Slider
            label="Spread"
            value={layer.spread}
            min={-50}
            max={50}
            onChange={(value) => onUpdate({ spread: value })}
          />
        </div>

        <ColorPicker
          label="Shadow Color"
          color={layer.color}
          opacity={layer.opacity}
          onColorChange={(color) => onUpdate({ color })}
          onOpacityChange={(opacity) => onUpdate({ opacity })}
        />

        <div className="flex items-center gap-3 pt-1">
          <input
            id={checkboxId}
            type="checkbox"
            checked={layer.inset}
            onChange={(e) => onUpdate({ inset: e.target.checked })}
          />
          <label htmlFor={checkboxId} className="text-sm text-zinc-400 cursor-pointer">
            Inset shadow
          </label>
        </div>
      </div>
    </div>
  );
}

function PresetCard({
  preset,
  onClick,
}: {
  preset: Preset;
  onClick: () => void;
}) {
  const shadowCSS = generateShadowCSS(
    preset.layers.map((l) => ({ ...l, id: "" }))
  );

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition-all hover:border-purple-500/50 hover:bg-zinc-900/60"
    >
      <div
        className="h-12 w-12 rounded-lg bg-zinc-700 transition-transform group-hover:scale-105"
        style={{ boxShadow: shadowCSS }}
      />
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-200">{preset.name}</p>
        <p className="text-xs text-zinc-500">{preset.description}</p>
      </div>
    </button>
  );
}

export default function Home() {
  // State
  const [layers, setLayers] = useState<ShadowLayer[]>([
    {
      id: generateId(),
      offsetX: 0,
      offsetY: 4,
      blur: 6,
      spread: -1,
      color: "#000000",
      opacity: 0.1,
      inset: false,
    },
    {
      id: generateId(),
      offsetX: 0,
      offsetY: 10,
      blur: 15,
      spread: -3,
      color: "#000000",
      opacity: 0.1,
      inset: false,
    },
  ]);

  const [previewSettings, setPreviewSettings] = useState<PreviewSettings>({
    shape: "rounded",
    size: 160,
    bgColor: "#3f3f46",
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"layers" | "presets" | "settings">("layers");

  // Derived state
  const shadowCSS = generateShadowCSS(layers);
  const fullCSS = `box-shadow: ${shadowCSS};`;

  // Handlers
  const addLayer = useCallback(() => {
    setLayers((prev) => [
      ...prev,
      {
        id: generateId(),
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: "#000000",
        opacity: 0.15,
        inset: false,
      },
    ]);
  }, []);

  const updateLayer = useCallback((id: string, updates: Partial<ShadowLayer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer))
    );
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  const moveLayer = useCallback((index: number, direction: "up" | "down") => {
    setLayers((prev) => {
      const newLayers = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
      return newLayers;
    });
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setLayers(preset.layers.map((l) => ({ ...l, id: generateId() })));
    setActiveTab("layers");
  }, []);

  const resetLayers = useCallback(() => {
    setLayers([
      {
        id: generateId(),
        offsetX: 0,
        offsetY: 4,
        blur: 6,
        spread: -1,
        color: "#000000",
        opacity: 0.1,
        inset: false,
      },
    ]);
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  }, [fullCSS]);

  // Shape classes for preview element
  const shapeClasses = {
    square: "rounded-none",
    rounded: "rounded-2xl",
    circle: "rounded-full",
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-2.5">
              <Box className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Shadow<span className="gradient-text">Craft</span>
            </h1>
          </div>
          <p className="text-zinc-400">
            Create beautiful CSS box shadows with ease
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,440px]">
          {/* Preview Section */}
          <div className="flex flex-col gap-6">
            {/* Live Preview */}
            <div className="flex min-h-[320px] flex-1 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 sm:min-h-[400px]">
              <div
                className={`transition-all duration-300 ${shapeClasses[previewSettings.shape]}`}
                style={{
                  width: previewSettings.size,
                  height: previewSettings.size,
                  backgroundColor: previewSettings.bgColor,
                  boxShadow: shadowCSS,
                }}
              />
            </div>

            {/* CSS Output */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">CSS Output</span>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy CSS
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-300">
                <code>{fullCSS}</code>
              </pre>
            </div>
          </div>

          {/* Controls Section */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30">
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === "layers"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Layers</span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">
                  {layers.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("presets")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === "presets"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Presets</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Preview</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-[600px] overflow-y-auto p-4">
              {activeTab === "layers" && (
                <div className="space-y-4">
                  {/* Layer Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={addLayer}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
                    >
                      <Plus className="h-4 w-4" />
                      Add Layer
                    </button>
                    <button
                      onClick={resetLayers}
                      className="flex items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
                      aria-label="Reset layers"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Layer Editors */}
                  {layers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Layers className="mb-3 h-10 w-10 text-zinc-600" />
                      <p className="text-sm text-zinc-500">No shadow layers</p>
                      <p className="text-xs text-zinc-600">Click Add Layer to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {layers.map((layer, index) => (
                        <ShadowLayerEditor
                          key={layer.id}
                          layer={layer}
                          index={index}
                          total={layers.length}
                          onUpdate={(updates) => updateLayer(layer.id, updates)}
                          onRemove={() => removeLayer(layer.id)}
                          onMoveUp={() => moveLayer(index, "up")}
                          onMoveDown={() => moveLayer(index, "down")}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "presets" && (
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((preset) => (
                    <PresetCard
                      key={preset.name}
                      preset={preset}
                      onClick={() => applyPreset(preset)}
                    />
                  ))}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Shape Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-zinc-400">Shape</label>
                    <div className="flex gap-2">
                      {[
                        { value: "square" as const, icon: Square, label: "Square" },
                        { value: "rounded" as const, icon: RectangleHorizontal, label: "Rounded" },
                        { value: "circle" as const, icon: Circle, label: "Circle" },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setPreviewSettings((prev) => ({ ...prev, shape: value }))}
                          className={`flex flex-1 flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                            previewSettings.shape === value
                              ? "border-purple-500 bg-purple-500/10 text-purple-400"
                              : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-400"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Slider */}
                  <Slider
                    label="Element Size"
                    value={previewSettings.size}
                    min={80}
                    max={280}
                    onChange={(size) => setPreviewSettings((prev) => ({ ...prev, size }))}
                  />

                  {/* Background Color */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-400">
                        <span className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Background Color
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={previewSettings.bgColor}
                          onChange={(e) =>
                            setPreviewSettings((prev) => ({ ...prev, bgColor: e.target.value }))
                          }
                          className="h-8 w-12 cursor-pointer overflow-hidden rounded-md border border-zinc-700"
                        />
                        <span className="font-mono text-xs text-zinc-500">
                          {previewSettings.bgColor.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Quick color presets */}
                    <div className="flex gap-2">
                      {["#3f3f46", "#ffffff", "#18181b", "#a855f7", "#3b82f6", "#22c55e"].map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() =>
                              setPreviewSettings((prev) => ({ ...prev, bgColor: color }))
                            }
                            className={`h-8 w-8 rounded-lg border-2 transition-all ${
                              previewSettings.bgColor === color
                                ? "border-purple-500 scale-110"
                                : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Set background to ${color}`}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-zinc-600">
            Built with precision. Designed for developers.
          </p>
        </footer>
      </div>
    </div>
  );
}

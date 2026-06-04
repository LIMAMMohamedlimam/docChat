import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LLMProvider } from "../types";

const PROVIDERS: { value: LLMProvider; label: string; description: string }[] = [
  { value: "claude", label: "Claude", description: "Anthropic" },
  { value: "openai", label: "GPT-4o mini", description: "OpenAI" },
  { value: "mistral", label: "Mistral Small", description: "Mistral AI" },
  { value: "ollama", label: "Ollama", description: "Local" },
];

export default function LLMSelector() {
  const { user, updatePreferredLLM } = useAuth();
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const current = PROVIDERS.find((p) => p.value === user.preferredLLM) ?? PROVIDERS[0];

  const handleChange = async (value: LLMProvider) => {
    if (value === user.preferredLLM || saving) return;
    setSaving(true);
    try {
      await updatePreferredLLM(value);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 hidden sm:block">Model</span>
      <div className="relative">
        <select
          value={current.value}
          onChange={(e) => handleChange(e.target.value as LLMProvider)}
          disabled={saving}
          className={`text-sm border rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            ${saving
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} ({p.description})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
          {saving ? (
            <svg className="animate-spin h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

type SuggestionChipsProps = {
  suggestions: string[];
  disabled?: boolean;
  onSelect: (suggestion: string) => void;
};

export function SuggestionChips({ suggestions, disabled = false, onSelect }: SuggestionChipsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

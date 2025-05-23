import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const insights = [
  {
    title: "📈 Record Revenue Growth",
    text: "Revenue rose by 30% driven by international expansion."
  },
  {
    title: "🚀 Customer Retention Improvement",
    text: "Churn dropped 12% after launch of loyalty program."
  },
  {
    title: "📊 Operational Efficiency",
    text: "Average cost per sale decreased by 18% due to automation."
  }
];

export default function NarratoFlow() {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const getThemeClasses = (baseClasses) => {
    return `${baseClasses} ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
    }`;
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-white to-blue-50'
    } p-4 flex flex-col items-center`}>
      <h1 className="text-3xl font-bold mb-6">NarratoFlow - AI Story Dashboard</h1>

      {step === 0 && (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className={getThemeClasses("border p-2 rounded")}
          />
          <select className={getThemeClasses("p-2 border rounded")}>
            <option>Professional Theme</option>
            <option>Playful Theme</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
            onClick={() => setStep(1)}
          >
            Generate Story
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="w-full max-w-xl space-y-4">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={getThemeClasses("p-4 rounded shadow hover:scale-[1.01] transition cursor-pointer")}
              onClick={() => setStep(2)}
            >
              <h2 className="text-xl font-semibold">{insight.title}</h2>
              <p>{insight.text}</p>
            </div>
          ))}
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            onClick={() => setStep(3)}
          >
            Finish & Export
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={getThemeClasses("w-full max-w-xl rounded shadow p-4")}>
          <h2 className="text-2xl font-bold mb-2">🎯 Loyalty Program Impact</h2>
          <p>
            After launching the loyalty program, customer churn decreased by 12%.
            This was especially effective in Tier 1 cities. Avg. transaction volume
            per loyal customer increased by ₹450/month.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setStep(1)}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-xl font-semibold">✅ Story Generated!</h2>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Download Summary PDF
          </button>
          <button
            className={getThemeClasses("px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700")}
            onClick={() => setStep(0)}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

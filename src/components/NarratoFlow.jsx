import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../src/contexts/ThemeContext";
import Papa from "papaparse";
import jsPDF from "jspdf";
import OpenAI from "openai";
import { apiMonitoring } from "../utils/apiMonitoring";
import config from "../config";

// Initialize OpenAI with validation
const OPENAI_API_KEY = config.OPENAI_API_KEY;

let openai;
try {
  // Add more detailed validation
  if (!OPENAI_API_KEY) {
    console.error('API Key validation failed:', {
      configHasKey: !!config.OPENAI_API_KEY,
      envHasKey: !!process.env.REACT_APP_OPENAI_API_KEY
    });
    throw new Error("OpenAI API key is missing or invalid. Please check your .env file.");
  }

  openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    maxRetries: 3,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
  console.log("Successfully initialized OpenAI API");
} catch (error) {
  console.error("Failed to initialize OpenAI:", error);
}

export default function NarratoFlow() {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [themeSelected, setThemeSelected] = useState("Professional Theme");
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");
  const [error, setError] = useState("");
  const [monitoringStats, setMonitoringStats] = useState(null);
  const fileRef = useRef(null);

  // Check API key on component mount
  useEffect(() => {
    if (!OPENAI_API_KEY) {
      setError("API key is missing. Please check your environment setup.");
    }
  }, []);

  // Theme-specific prompt templates with Palm-2 specific formatting
  const themePrompts = {
    "Professional Theme": `You are a professional business analyst. Analyze this CSV data and create a detailed analytical story. Focus on key trends, insights, and business implications.

Structure your response as follows:
1. Executive Summary (2-3 sentences)
2. Key Findings (3-4 bullet points)
3. Data Analysis (2-3 paragraphs)
4. Business Recommendations (3-4 actionable items)

CSV Data to analyze:`,
    "Playful Theme": `You are a creative storyteller. Transform this CSV data into an engaging and fun story. Use a lighthearted tone and creative metaphors while keeping it informative.

Structure your response as follows:
1. A catchy introduction (2-3 sentences)
2. Fun facts from the data (3-4 interesting discoveries)
3. The story (2-3 paragraphs with creative interpretations)
4. A memorable conclusion (2-3 sentences)

CSV Data to transform:`,
  };

  const getThemeClasses = (baseClasses) => {
    return baseClasses + (theme === "dark" ? " bg-gray-800 text-white" : " bg-white");
  };

  const validateCSV = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("CSV file is empty or invalid");
    }

    // Check if we have headers/columns
    const firstRow = data[0];
    if (!firstRow || Object.keys(firstRow).length === 0) {
      throw new Error("CSV file must have headers/columns");
    }

    return true;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        setError("Please upload a valid CSV file");
        if (fileRef.current) {
          fileRef.current.value = '';
        }
        return;
      }

      setFileName(file.name);
      setCsvFile(file); // Store the file object
      setError("");
      setLoading(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results) {
          try {
            // Validate the CSV data
            validateCSV(results.data);

            // Store parsed data
            setCsvData(results.data);

            // Don't automatically generate on upload
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setCsvData(null);
            setCsvFile(null);
            setLoading(false);
            if (fileRef.current) {
              fileRef.current.value = '';
            }
          }
        },
        error: function (error) {
          setError("Failed to parse CSV file: " + error.message);
          setCsvData(null);
          setCsvFile(null);
          setLoading(false);
          if (fileRef.current) {
            fileRef.current.value = '';
          }
        },
      });
    }
  };

  const generateAndSetStory = async (data) => {
    if (!data || !validateCSV(data)) {
      setError("Please upload a valid CSV file first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const story = await generateStory(data, themeSelected);

      if (!story || story.trim() === "") {
        throw new Error("Generated story is empty");
      }

      // Store the results
      setGeneratedStory(story);
      setStep(1);
    } catch (error) {
      console.error("Error in story generation:", error);
      setError(error.message || "Failed to generate story. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async (data, selectedTheme) => {
    try {
      if (!openai) {
        console.error("OpenAI not initialized. API Key:", !!OPENAI_API_KEY);
        throw new Error("AI model is not properly initialized. Please check your API key.");
      }

      console.log("Preparing data for generation...");
      // Prepare the prompt with better data formatting
      const dataPreview = JSON.stringify(data.slice(0, 3), null, 2); // Show first 3 rows
      const prompt = `${themePrompts[selectedTheme]}

Data Structure:
- Total Records: ${data.length}
- Headers: ${Object.keys(data[0]).join(', ')}

Sample Data (first 3 records):
${dataPreview}

Generate a comprehensive response following the structure specified above.`;

      console.log("Generating content...");
      // Check rate limits before making the request
      const rateLimitCheck = apiMonitoring.checkRateLimit();
      if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.message);
      }

      // Generate content with proper error handling and monitoring
      try {
        const completion = await apiMonitoring.retryWithBackoff(async () => {
          return await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an expert data analyst and storyteller who creates engaging narratives from CSV data."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1,
          });
        });
        const generatedText = completion.choices[0]?.message?.content;

        if (!generatedText || generatedText.trim() === "") {
          throw new Error("AI returned empty response");
        }

        console.log("Successfully generated story");
        return generatedText;
      } catch (genError) {
        console.error("Generation error:", genError);
        if (genError.message.includes("Rate limit")) {
          throw new Error("API rate limit reached. Please try again in a few seconds.");
        } else if (genError.message.includes("insufficient_quota")) {
          throw new Error("API quota exceeded. Please check your subscription.");
        } else {
          throw new Error(`Story generation failed: ${genError.message}`);
        }
      }
    } catch (error) {
      console.error("Detailed error in story generation:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        apiKeyPresent: !!OPENAI_API_KEY
      });

      throw new Error(`Failed to generate story: ${error.message}`);
    }
  };

  const downloadPDF = () => {
    if (!generatedStory || generatedStory.trim() === "") {
      setError("No story available to download. Please generate a story first.");
      return;
    }

    try {
      const doc = new jsPDF();

      // Add title with current date
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text("AI Generated Story", 105, 20, { align: "center" });

      // Add theme and date
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Theme: ${themeSelected}`, 20, 30);
      doc.text(`Generated on: ${currentDate}`, 20, 38);

      // Add main content
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(generatedStory, 170);
      doc.text(splitText, 20, 50);

      doc.save("ai_generated_story.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  // Add monitoring stats fetch effect
  useEffect(() => {
    const updateStats = () => {
      const stats = apiMonitoring.getUsageStats();
      setMonitoringStats(stats);
    };

    updateStats();
    // Update stats every minute
    const interval = setInterval(updateStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateStoryWithMonitoring = async (csvData, theme) => {
    setLoading(true);
    setError("");

    try {
      // Check rate limits before proceeding
      const rateLimitCheck = apiMonitoring.checkRateLimit();
      if (!rateLimitCheck.allowed) {
        throw new Error(rateLimitCheck.message);
      }

      const prompt = themePrompts[theme] + "\n" + JSON.stringify(csvData);

      const response = await apiMonitoring.retryWithBackoff(async () => {
        const completion = await openai.chat.completions.create({
          model: config.model.name,
          messages: [
            {
              role: "system",
              content: "You are a data storyteller that transforms CSV data into engaging narratives."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: config.model.temperature,
          max_tokens: config.model.maxTokens,
          presence_penalty: config.model.presencePenalty,
          frequency_penalty: config.model.frequencyPenalty
        });

        // Track successful request
        apiMonitoring.trackRequestOutcome(true);

        return completion;
      });

      if (response.choices && response.choices[0]) {
        setGeneratedStory(response.choices[0].message.content);

        // Track token usage
        const usageStatus = apiMonitoring.trackTokenUsage(response.usage.total_tokens);
        if (usageStatus.warning) {
          setError(`Warning: API usage is at ${usageStatus.usagePercentage.toFixed(1)}% of monthly quota`);
        }
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      setError(err.message);
      apiMonitoring.trackRequestOutcome(false, err);
      apiMonitoring.logError(err, { theme, dataSize: csvData.length });
    } finally {
      setLoading(false);
    }
  };

  // Update the story generation handler to use the monitored version
  const handleGenerateStory = async () => {
    if (!csvData) {
      setError("Please upload a CSV file first");
      return;
    }

    await generateStoryWithMonitoring(csvData, themeSelected);
  };

  // Add monitoring info to the UI
  const renderMonitoringStats = () => {
    if (!monitoringStats) return null;

    return (
      <div className={getThemeClasses("text-sm mt-4 p-4 rounded-lg border")}>
        <h3 className="font-semibold mb-2">API Usage Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>Requests: {monitoringStats.requestCount}</div>
          <div>Success Rate: {monitoringStats.successRate.toFixed(1)}%</div>
          <div>Token Usage: {monitoringStats.tokenUsage}</div>
          <div>Quota Used: {monitoringStats.usagePercentage.toFixed(1)}%</div>
        </div>
        {monitoringStats.rateLimitStatus.isLimited && (
          <div className="text-yellow-500 mt-2">
            Rate limit reached. Reset in {Math.ceil(monitoringStats.rateLimitStatus.timeToReset / 1000)}s
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={
        "min-h-screen " +
        (theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-white to-blue-50") +
        " p-4 flex flex-col items-center"
      }
    >
      <h1 className="text-3xl font-bold mb-6">NarratoFlow - AI Story Dashboard</h1>

      {/* Monitoring Stats */}
      {config.monitoring.enabled && renderMonitoringStats()}

      {step === 0 && (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className={getThemeClasses("border p-2 rounded")}
            ref={fileRef}
          />
          <select
            className={getThemeClasses("p-2 border rounded")}
            value={themeSelected}
            onChange={(e) => setThemeSelected(e.target.value)}
          >
            <option>Professional Theme</option>
            <option>Playful Theme</option>
          </select>
          {loading ? (
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow cursor-not-allowed"
              disabled
            >
              Generating Story...
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              onClick={handleGenerateStory}
            >
              Generate Story
            </button>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="w-full max-w-xl space-y-4">
          <div
            className={getThemeClasses(
              "p-4 rounded shadow hover:scale-[1.01] transition cursor-pointer"
            )}
            onClick={() => setStep(2)}
          >
            <h2 className="text-xl font-semibold">AI Generated Story</h2>
            <p>{generatedStory}</p>
          </div>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            onClick={() => setStep(3)}
          >
            Finish & Export
          </button>
          <button
            className={getThemeClasses(
              "px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            onClick={() => setStep(0)}
          >
            Upload Another CSV
          </button>
        </div>
      )}

      {step === 2 && (
        <div className={getThemeClasses("w-full max-w-xl rounded shadow p-4")}>
          <h2 className="text-2xl font-bold mb-2">AI Generated Story Details</h2>
          <p>{generatedStory}</p>
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
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={downloadPDF}
          >
            Download Summary PDF
          </button>
          <button
            className={getThemeClasses(
              "px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            onClick={() => setStep(0)}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
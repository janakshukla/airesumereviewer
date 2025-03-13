"use client";
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Lightbulb, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import extractText from '@/lib/pdfTotext';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ReviewData {
  resumeSummary: string;
  strengths: string[];
  weaknesses: string[];
  suggestionsForImprovement: string[];
  atsscore: number;
  links: string[];
  otherFeedback: string;
  resumeScore: number;
}

function App() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resumeScoreData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [reviewData?.resumeScore || 0, 100 - (reviewData?.resumeScore || 0)],
        backgroundColor: ['#10B981', '#E5E7EB'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const atsScoreData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [reviewData?.atsscore || 0, 100 - (reviewData?.atsscore || 0)],
        backgroundColor: ['#6366F1', '#E5E7EB'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true)
    const text = await extractText(event);

    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    const cleanedData = data.response
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "")
      .trim();
    setReviewData(JSON.parse(cleanedData.replace(/\s*```$/, "")));
    toast("Your resume review is done🙌");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            The Mythical Resume Reviewer
          </h1>
          <p className="text-lg text-gray-300">
            Get instant feedback on your resume with AI-powered analysis
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white/5 rounded-lg border-2 border-dashed border-gray-400 cursor-pointer hover:bg-white/10 transition-all">
                <Upload className="w-12 h-12 text-gray-300 mb-2" />
                <span className="text-lg text-gray-300">Upload your resume (PDF)</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300">Analyzing your resume...</p>
          </div>
        )}

        {reviewData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <FileText className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Resume Summary</h2>
                  <p className="text-gray-300 leading-relaxed">{reviewData.resumeSummary}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">Resume Score</h3>
                  <div className="w-32 h-32 mx-auto">
                    <Pie data={resumeScoreData} options={{ plugins: { legend: { display: false } } }} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">{reviewData.resumeScore}%</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-4">ATS Score</h3>
                  <div className="w-32 h-32 mx-auto">
                    <Pie data={atsScoreData} options={{ plugins: { legend: { display: false } } }} />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-indigo-400">{reviewData.atsscore}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-semibold">Strengths</h2>
                </div>
                <ul className="space-y-2">
                  {reviewData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-emerald-400 font-medium">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-rose-400" />
                  <h2 className="text-xl font-semibold">Areas for Improvement</h2>
                </div>
                <ul className="space-y-2">
                  {reviewData.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-rose-400 font-medium">•</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-400" />
                  <h2 className="text-xl font-semibold">Recommendations</h2>
                </div>
                <ul className="space-y-2">
                  {reviewData.suggestionsForImprovement.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-amber-400 font-medium">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
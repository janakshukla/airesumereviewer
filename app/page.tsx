"use client";
import { useState } from "react";
import extractText from "../lib/pdfTotext";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Page() {
  // const [reviewData, setReviewData] = useState(null);
  const reviewData = {
    resumeSummary:
      "Janak Shukla's resume showcases a computer science and engineering student currently pursuing a B.Tech degree.  He highlights several personal projects demonstrating proficiency in web development using .",
    strengths: [
      "Strong project portfolio showcasing a variety of skills and technologies.",
      "Inclusion of live demos for most projects (great for demonstrating abilities).",
      "Good academic record with high percentages and CGPA.",
      "Clear presentation of skills and projects.",
      "Use of Github for project hosting.",
    ],
    weaknesses: [
      "Resume lacks a compelling summary or objective statement.",
      "Expected graduation date is far in the future (2026), limiting immediate impact.",
      "Projects lack detailed descriptions of the technologies used (beyond basic mentions).",
      "Inconsistent project date formatting.",
      "The 'Data Structures 1' under concepts is vague and needs expansion.",
      "Skills section is somewhat disorganized and lacks quantification where possible.",
      "Contact information is presented in an unconventional order.",
    ],
    suggestionsForImprovement: [
      "Add a compelling summary or objective statement at the beginning highlighting key skills and career goals.",
      "Expand project descriptions, detailing the challenges faced, solutions implemented, and technologies used more comprehensively.  Use action verbs.",
      'Quantify achievements whenever possible (e.g., "Increased app efficiency by 20%").',
      "Standardize project date formatting (e.g., MM/YYYY or YYYY-MM).",
      'Elaborate on "Data Structures 1" and include other relevant concepts (algorithms, databases, etc.).',
      "Organize the skills section logically (e.g., group by category).  Consider using a skills matrix or bar chart.",
      "Rearrange contact information for better readability (e.g., Name, Email, Phone, Location, Links).",
      "Add a section on relevant coursework (if applicable) to further showcase skills.",
      "Add a section on awards, honors, or relevant extracurricular activities.",
      "Proofread carefully for any grammatical errors or typos.",
      "Consider using a professional resume template for improved visual appeal.",
    ],
    atsscore: 65,
    links: [
      "janakshukla509@gmail.com",
      "github.com/janakshukla",
      "portfolio.janak2004.tech",
    ],
    otherFeedback:
      "While Janak has impressive projects, the resume needs improvements to effectively communicate his value to potential employers.  The lack of a strong summary and detailed project descriptions are major weaknesses.  Focusing on the impact of his projects, rather than just listing features, will significantly improve the resume.",
    resumeScore: 72,
  };
  const resumeScoreData = {
    datasets: [
      {
        data: [
          reviewData?.resumeScore || 0,
          100 - (reviewData?.resumeScore || 0),
        ],
        backgroundColor: ["#4caf50", "#e0e0e0"],
        hoverBackgroundColor: ["#66bb6a", "#f5f5f5"],
      },
    ],
  };

  const atsScoreData = {
    datasets: [
      {
        data: [reviewData?.atsscore || 0, 100 - (reviewData?.atsscore || 0)],
        backgroundColor: ["#ff9800", "#e0e0e0"],
        hoverBackgroundColor: ["#ffb74d", "#f5f5f5"],
      },
    ],
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = await extractText(event);

    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    let cleanedData = data.response
      .replace(/^```json\s*/, "")
      .replace(/\s*```$/, "")
      .trim();
    setReviewData(JSON.parse(cleanedData.replace(/\s*```$/, "")));
    toast("Your resume review is done🙌");
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#051937] to-[#082b60] text-white">
        <h1 className="scroll-m-20 text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#a70e79] to-[#d65db1]  font-extrabold tracking-tight lg:text-5xl">
          The Myth: A Resume reviewerrrrr...
        </h1>
        <Card className="w-full max-w-md p-6 mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <div className="grid gap-4">
            <Label
              htmlFor="Resume"
              className="text-white text-lg font-semibold"
            >
              Upload Your Resume
            </Label>
            <Input
              id="Resume"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="text-white file:bg-blue-500 file:text-white file:border-0 file:rounded-md file:px-2 file:cursor-pointer"
            />
          </div>
        </Card>
        {reviewData && (
          <div className="md:grid md:grid-cols-6 md:grid-rows-5 pt-4 h-2/4 w-screen gap-4">
            <div className="md:col-span-4 text-xl font-serif row-span-2">
              {reviewData.resumeSummary}
            </div>
            <div className="md:col-span-2 flex justify-between items-center row-span-2 col-start-5">
              <Label
                htmlFor="ress"
                className="text-white text-lg font-semibold"
              >
                Resume score:
              </Label>
              <Pie id="ress" data={resumeScoreData} />
              <Label htmlFor="ats" className="text-white text-lg font-semibold">
                ATS score:
              </Label>
              <Pie id="ats" data={atsScoreData} />
            </div>
            <div className="md:col-span-2  row-span-3 row-start-3">
              <span className="font-extrabold font-sans text-lg">
                Strenths:
              </span>
              <ul>
                {reviewData.strengths.map((strength, index) => (
                  <li key={index}>
                    {index + 1}-&gt;{strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 bg-pink-500 row-span-3 col-start-3 row-start-3">
              <span className="font-extrabold font-sans text-lg">
                Strenths:
              </span>
              <ul>
                {reviewData.strengths.map((strength, index) => (
                  <li key={index}>
                    {index + 1}-&gt;{strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2 bg-yellow-500 row-span-3 col-start-5 row-start-3">
              5
            </div>
          </div>
        )}
      </div>
    </>
  );
}

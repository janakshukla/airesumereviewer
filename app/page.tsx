"use client";
import { useState } from "react";
import extractText from "./lib/pdfTotext";

export default function Page() {
  const [reviewData, setReviewData] = useState(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = await extractText(event);
   

    const response = await fetch("/api/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    console.log(data);
    let cleanedData =   data.response.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim(); 
       setReviewData(JSON.parse(cleanedData.replace(/\s*```$/, "")));
  };
 if(reviewData){
  console.log(reviewData)
  }

  return (
    <div>
      <h1>Here put your resume</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div>
        <h2>Review Data:</h2>
        <pre>{reviewData ? JSON.stringify(reviewData, null, 2) : "No data yet"}</pre>
      </div>
    </div>
  );
}
import pdfToText from "react-pdftotext";

export default function extractText(event: React.ChangeEvent<HTMLInputElement>): Promise<string> {
  if (!event.target.files) {
    return Promise.reject(new Error("No files selected"));
  }
  const file = event.target.files[0];
  const output = pdfToText(file)
    .then((text) => {
      return text;
    })
    .catch((error) => {
      return error;
    });
  return output;
}
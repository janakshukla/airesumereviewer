import pdfToText from "react-pdftotext";

export default function extractText(event: any): Promise<string> {
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
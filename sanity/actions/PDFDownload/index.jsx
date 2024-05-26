import { DownloadIcon } from "@sanity/icons";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { useDocumentOperation } from "sanity";
import { pdf } from "@react-pdf/renderer";
import { PDFDocument } from "./PDFDocument";

const downloadPDF = async ({ departureDate, destination }, onComplete) => {
  try {
    const asPdf = pdf([]); // {} is important, throws without an argument
    asPdf.updateContainer(
      <PDFDocument departureDate={departureDate} destination={destination} />
    );
    const pdfBlob = await asPdf.toBlob();
    saveAs(pdfBlob, `Cotización ${departureDate}-${destination}.pdf`);
  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  }
};

export default function DownloadPDFAction({
  draft,
  id,
  type,
  published,
  onComplete,
}) {
  const { patch, publish } = useDocumentOperation(id, type);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // if the isDownloading state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isDownloading && published) {
      downloadPDF(published, onComplete);
    }
  }, [draft, isDownloading, published]);

  return {
    label: isDownloading
      ? "Descargando y guardando..."
      : "Descargar cotización",
    icon: DownloadIcon,
    onHandle: () => {
      // This will update the button text
      setIsDownloading(true);
      // Perform the publish
      if (!published) publish.execute();

      if (published) downloadPDF(published, onComplete);

      // Signal that the action is completed
      if (!published) onComplete();
    },
  };
}

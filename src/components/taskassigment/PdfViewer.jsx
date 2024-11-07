import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/web/pdf_viewer.css"; // Bạn có thể tùy chỉnh thêm CSS nếu cần

const PdfViewer = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadPdf = async () => {
      // Đặt workerSrc cho PDF.js
      pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

      const loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise
        .then(async (pdf) => {
          const page = await pdf.getPage(1); // Lấy trang đầu tiên
          const viewport = page.getViewport({ scale: 1 }); // Điều chỉnh tỉ lệ
          
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        })
        .catch((error) => {
          console.error("Error loading PDF: ", error);
        });
    };

    loadPdf();
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default PdfViewer;

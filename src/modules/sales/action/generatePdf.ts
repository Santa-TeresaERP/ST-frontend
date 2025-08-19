// actions/generatePdf.ts
import api from "@/core/config/client";

/**
 * Payload específico para el servicio "sale".
 * Si luego tienes otros servicios (p.ej. "returns", "inventory"),
 * puedes crear más interfaces o usar el genérico de abajo.
 */
export interface GenerateSalePdfPayload {
  storeId: string;
  from: string; // 'YYYY-MM-DD'
  to: string; // 'YYYY-MM-DD'
  filenameBase: string;
  storeName: string;
  dateLabel: string;
  boxed?: boolean; // opcional, por si lo expones desde el frontend
}

/**
 * Respuesta estándar del action cuando pedimos un PDF.
 */
export type PdfResponse = {
  blob: Blob;
  filename: string; // nombre sugerido para descargar
  url: string; // Object URL (recuerda revocarlo cuando ya no lo uses)
};

/**
 * Extrae el filename desde el header Content-Disposition si está presente.
 */
function getFilenameFromDisposition(
  disposition?: string | null
): string | null {
  if (!disposition) return null;
  // Content-Disposition: attachment; filename="reporte.pdf"
  const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(disposition);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1].replace(/"/g, ""));
  } catch {
    return match[1].replace(/"/g, "");
  }
}

/**
 * Llamado genérico al generador de PDF del backend.
 * - serviceKey: "sale", "inventory", etc. (ruta /generarPDF/:serviceKey)
 * - payload: body JSON que espera tu backend para ese servicio
 * - fallbackFilename: nombre por defecto si el backend no manda Content-Disposition
 */
export const generatePdf = async (
  serviceKey: string,
  payload: unknown,
  fallbackFilename = "reporte.pdf"
): Promise<PdfResponse> => {
  try {
    const response = await api.post(`/generarPDF/${serviceKey}`, payload, {
      responseType: "blob", // <- clave para recibir PDF
      // Si usas auth por header, ya debe estar configurado en el axios `api`.
    });

    // Detectar si el backend devolvió un JSON de error en lugar del PDF
    const contentType = response.headers["content-type"] ?? "";
    if (contentType.includes("application/json")) {
      // Leer el JSON y lanzar un error "bonito"
      const text = await response.data.text?.(); // blob -> text (si es polyfilled por axios)
      try {
        const json = JSON.parse(text);
        throw new Error(
          json?.message || json?.error || "No se pudo generar el PDF"
        );
      } catch {
        throw new Error("No se pudo generar el PDF");
      }
    }

    const disposition = response.headers["content-disposition"] as
      | string
      | undefined;
    const suggested =
      getFilenameFromDisposition(disposition) || fallbackFilename;

    const blob: Blob = response.data as Blob;
    const url = URL.createObjectURL(blob);

    return { blob, filename: suggested, url };
  } catch (err: any) {
    // Si el servidor respondió con error y axios lo trae en response.data como blob/json
    const maybeBlob = err?.response?.data;
    const ct = err?.response?.headers?.["content-type"] ?? "";
    if (
      maybeBlob &&
      typeof maybeBlob === "object" &&
      ct.includes("application/json")
    ) {
      try {
        const text = await (maybeBlob as Blob).text();
        const json = JSON.parse(text);
        throw new Error(
          json?.message || json?.error || "Error al generar el PDF"
        );
      } catch {
        // cae al throw genérico abajo
      }
    }
    throw new Error(err?.message || "Error al generar el PDF");
  }
};

/**
 * Conveniencia: acción específica para "sale".
 * Usa filenameBase del payload como nombre por defecto si el servidor no envía uno.
 */
export const generateSalePdf = async (
  payload: GenerateSalePdfPayload
): Promise<PdfResponse> => {
  const fallback = `${payload.filenameBase}.pdf`;
  return generatePdf("sale", payload, fallback);
};

/**
 * Utilidad para disparar descarga inmediata en el navegador.
 * (Opcional: úsalo en tus componentes si quieres descargar sin guardar en estado)
 */
export const downloadPdf = (pdf: PdfResponse) => {
  const a = document.createElement("a");
  a.href = pdf.url;
  a.download = pdf.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Si no necesitas reusar el blob/url después, libera memoria:
  setTimeout(() => URL.revokeObjectURL(pdf.url), 0);
};

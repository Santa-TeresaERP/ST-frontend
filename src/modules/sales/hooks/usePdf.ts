// hooks/usePdf.ts
import { useMutation } from "@tanstack/react-query";
import {
  generatePdf,
  generateSalePdf,
  downloadPdf,
  type PdfResponse,
  type GenerateSalePdfPayload,
} from "../action/generatePdf";

/**
 * Hook genérico para /generarPDF/:serviceKey
 * - Llama al action generatePdf
 * - Opcionalmente descarga automáticamente el archivo al terminar
 */
export const useGeneratePdf = (opts?: {
  autoDownload?: boolean;
  onSuccess?: (pdf: PdfResponse) => void;
  onError?: (err: Error) => void;
}) => {
  return useMutation<
    PdfResponse,
    Error,
    { serviceKey: string; payload: unknown; fallbackFilename?: string }
  >({
    mutationFn: ({ serviceKey, payload, fallbackFilename }) =>
      generatePdf(serviceKey, payload, fallbackFilename),

    onSuccess: (pdf) => {
      if (opts?.autoDownload) downloadPdf(pdf);
      opts?.onSuccess?.(pdf);
    },

    onError: (err) => {
      opts?.onError?.(err);
    },
  });
};

/**
 * Hook específico para generar PDF de ventas (serviceKey = "sale")
 * - Recibe el payload tipado para ventas
 * - Opcionalmente descarga automáticamente el archivo al terminar
 */
export const useGenerateSalePdf = (opts?: {
  autoDownload?: boolean;
  onSuccess?: (pdf: PdfResponse) => void;
  onError?: (err: Error) => void;
}) => {
  return useMutation<PdfResponse, Error, GenerateSalePdfPayload>({
    mutationFn: (payload) => generateSalePdf(payload),

    onSuccess: (pdf) => {
      if (opts?.autoDownload) downloadPdf(pdf);
      opts?.onSuccess?.(pdf);
    },

    onError: (err) => {
      opts?.onError?.(err);
    },
  });
};

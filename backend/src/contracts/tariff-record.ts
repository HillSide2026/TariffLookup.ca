import { z } from "zod";

export const tariffRecordSchema = z.object({
  hsCode: z.string().min(4),
  destinationCountry: z.string().min(2),
  mfnRate: z.string().min(1),
  preferentialRate: z.string().min(1),
  agreement: z.string().min(1),
  eligibilityNotes: z.array(z.string()).min(1),
  source: z.string().min(1),
  effectiveDate: z.string().min(1),
});

export const tariffRecordDatasetSchema = z.array(tariffRecordSchema);

export type TariffRecord = z.infer<typeof tariffRecordSchema>;

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Constants & Limits
// ---------------------------------------------------------------------------

export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_AUDIO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const ALLOWED_PHOTO_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
export const ALLOWED_AUDIO_MIMES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm'];
export const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const MediaKindSchema = z.enum(['photo', 'document', 'audio', 'video']);
export type MediaKind = z.infer<typeof MediaKindSchema>;

export const ProofArtifactUploadSlotInputSchema = z.object({
  moduleId: z.string().uuid().optional(),
  moduleNumber: z.number().int().positive().optional(),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  fileName: z.string().min(1).max(500),
  fileSizeBytes: z.number().int().positive(),
  mimeType: z.string().min(1).max(255),
  mediaKind: MediaKindSchema,
  resubmitArtifactId: z.string().uuid().optional(),
}).refine(data => data.moduleId || data.moduleNumber, {
  message: "Either moduleId or moduleNumber must be provided",
  path: ["moduleId"],
}).refine(data => {
  const size = data.fileSizeBytes;
  const mime = data.mimeType;
  switch (data.mediaKind) {
    case 'photo': return size <= MAX_PHOTO_SIZE_BYTES && ALLOWED_PHOTO_MIMES.includes(mime);
    case 'document': return size <= MAX_DOCUMENT_SIZE_BYTES && ALLOWED_DOCUMENT_MIMES.includes(mime);
    case 'audio': return size <= MAX_AUDIO_SIZE_BYTES && ALLOWED_AUDIO_MIMES.includes(mime);
    case 'video': return size <= MAX_VIDEO_SIZE_BYTES && ALLOWED_VIDEO_MIMES.includes(mime);
    default: return false;
  }
}, {
  message: "Invalid file size or MIME type for the selected media kind",
  path: ["fileSizeBytes"],
});

export type ProofArtifactUploadSlotInput = z.infer<typeof ProofArtifactUploadSlotInputSchema>;

export const ProofArtifactReviewInputSchema = z.object({
  status: z.enum(['under_review', 'approved', 'rejected', 'revise']),
  reviewNotes: z.string().max(5000).optional(),
}).superRefine((data, ctx) => {
  if (data.status === 'revise' || data.status === 'rejected') {
    if (!data.reviewNotes || data.reviewNotes.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Review notes are required when requesting revision or rejecting.",
        path: ["reviewNotes"]
      });
    }
  }
});

export type ProofArtifactReviewInput = z.infer<typeof ProofArtifactReviewInputSchema>;

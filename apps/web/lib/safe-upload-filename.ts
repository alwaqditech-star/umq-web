/** Avoid Arabic/special chars breaking multer filenames on the server. */
export function safeUploadFilename(originalName: string): string {
  const match = originalName.match(/\.([a-zA-Z0-9]{2,5})$/);
  const ext = match?.[1] ? `.${match[1].toLowerCase()}` : ".jpg";
  const stamp = Date.now().toString(36);
  return `image-${stamp}${ext}`;
}

export function fileWithSafeName(file: File): File {
  const safe = safeUploadFilename(file.name);
  if (file.name === safe) return file;
  return new File([file], safe, { type: file.type, lastModified: file.lastModified });
}

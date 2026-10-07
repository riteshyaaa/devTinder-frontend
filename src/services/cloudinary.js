/**
 * Cloudinary image upload service.
 *
 * Uses unsigned upload preset (no server-side signature needed).
 * Configure via environment variables:
 *   VITE_CLOUDINARY_CLOUD_NAME - Your Cloudinary cloud name
 *   VITE_CLOUDINARY_UPLOAD_PRESET - Unsigned upload preset name
 *
 * Features:
 * - Direct browser-to-Cloudinary upload (no backend needed)
 * - Returns secure HTTPS URL for immediate use
 * - Supports image transformation on the fly
 * - Progress tracking via onProgress callback
 * - Max file size validation (5MB)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const isCloudinaryConfigured = () => {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET && CLOUD_NAME !== "demo");
};

/**
 * Upload an image file to Cloudinary.
 *
 * @param {File} file - The image file to upload
 * @param {Object} options - { folder, onProgress }
 * @returns {Promise<{ url: string, publicId: string, width: number, height: number }>}
 */
export const uploadImage = async (file, options = {}) => {
  const { folder = "devtinder/profiles", onProgress } = options;

  // Validate file
  if (!file) throw new Error("No file provided");
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");
  if (file.size > MAX_FILE_SIZE) throw new Error("Image must be smaller than 5MB");

  const cloudName = CLOUD_NAME || "demo";
  const uploadPreset = UPLOAD_PRESET || "ml_default";
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  // Use XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", uploadUrl);

    // Progress handler
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          format: data.format,
          bytes: data.bytes,
        });
      } else {
        let errorMsg = "Image upload failed";
        try {
          const error = JSON.parse(xhr.responseText);
          errorMsg = error.error?.message || errorMsg;
        } catch {
          // ignore json parse error
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during image upload. Check internet connection."));
    xhr.send(formData);
  });
};

/**
 * Generate a Cloudinary transformation URL.
 * Useful for thumbnails, avatars, etc.
 *
 * @param {string} url - Original Cloudinary URL
 * @param {Object} transforms - { width, height, crop, quality }
 * @returns {string} Transformed URL
 */
export const getTransformedUrl = (url, transforms = {}) => {
  if (!url || !url.includes("cloudinary.com")) return url;

  const { width = 200, height = 200, crop = "fill", quality = "auto" } = transforms;
  const transformStr = `w_${width},h_${height},c_${crop},q_${quality},f_auto`;

  // Insert transformation before /upload/ or /v1/
  return url.replace("/upload/", `/upload/${transformStr}/`);
};

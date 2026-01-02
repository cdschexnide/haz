import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Region } from "../../types/sddg-template";

/**
 * Get dimensions of an image
 */
export async function getImageDimensions(
  imageUri: string
): Promise<{ width: number; height: number }> {
  try {
    // For React Native, we can use Image.getSize
    // But since we're using expo-image-manipulator, we can use that
    const result = await ImageManipulator.manipulateAsync(imageUri, [], {
      format: ImageManipulator.SaveFormat.JPEG,
    });

    return {
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Error getting image dimensions:", error);
    throw new Error(`Failed to get image dimensions: ${error}`);
  }
}

/**
 * Crop a region from an image
 * @param imageUri - URI of the source image
 * @param region - Region to crop {x, y, w, h}
 * @returns URI of the cropped image
 */
export async function cropRegion(
  imageUri: string,
  region: Region
): Promise<string> {
  try {
    // Ensure coordinates are positive and within bounds
    const x = Math.max(0, Math.round(region.x));
    const y = Math.max(0, Math.round(region.y));
    const w = Math.max(1, Math.round(region.w));
    const h = Math.max(1, Math.round(region.h));

    // Use expo-image-manipulator to crop
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          crop: {
            originX: x,
            originY: y,
            width: w,
            height: h,
          },
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error(
      `Error cropping region (${region.x}, ${region.y}, ${region.w}, ${region.h}):`,
      error
    );
    throw new Error(`Failed to crop region: ${error}`);
  }
}

/**
 * Scale region coordinates from template size to actual image size
 * @param region - Region with coordinates in template space
 * @param actualWidth - Actual image width
 * @param actualHeight - Actual image height
 * @param templateWidth - Template width (default: 2550 for 300 DPI)
 * @param templateHeight - Template height (default: 3300 for 300 DPI)
 */
export function scaleRegion(
  region: Region,
  actualWidth: number,
  actualHeight: number,
  templateWidth: number = 2550,
  templateHeight: number = 3300
): Region {
  const scaleX = actualWidth / templateWidth;
  const scaleY = actualHeight / templateHeight;

  return {
    x: region.x * scaleX,
    y: region.y * scaleY,
    w: region.w * scaleX,
    h: region.h * scaleY,
  };
}

/**
 * Resize an image to specific dimensions
 * @param imageUri - URI of the source image
 * @param width - Target width
 * @param height - Target height
 */
export async function resizeImage(
  imageUri: string,
  width: number,
  height: number
): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width,
            height,
          },
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result.uri;
  } catch (error) {
    console.error("Error resizing image:", error);
    throw new Error(`Failed to resize image: ${error}`);
  }
}

/**
 * Rotate an image by specified degrees
 * @param imageUri - URI of the source image
 * @param degrees - Rotation angle (0, 90, 180, 270)
 */
export async function rotateImage(
  imageUri: string,
  degrees: 0 | 90 | 180 | 270
): Promise<string> {
  try {
    if (degrees === 0) {
      return imageUri; // No rotation needed
    }

    console.log(`Rotating image by ${degrees} degrees...`);
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          rotate: degrees,
        },
      ],
      {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    console.log(`✅ Image rotated successfully`);
    return result.uri;
  } catch (error) {
    console.error("Error rotating image:", error);
    throw new Error(`Failed to rotate image: ${error}`);
  }
}

/**
 * Check if image orientation matches template orientation and rotate if needed
 * @param imageUri - URI of the source image
 * @param templateWidth - Expected template width
 * @param templateHeight - Expected template height
 * @returns Object with corrected imageUri and dimensions
 */
export async function correctImageOrientation(
  imageUri: string,
  templateWidth: number,
  templateHeight: number
): Promise<{
  imageUri: string;
  width: number;
  height: number;
  rotated: boolean;
  rotationDegrees: number;
}> {
  try {
    // Get current image dimensions
    const dims = await getImageDimensions(imageUri);

    // Determine orientations
    const imageIsPortrait = dims.height > dims.width;
    const templateIsPortrait = templateHeight > templateWidth;

    console.log(
      `Image: ${dims.width}x${dims.height} (${
        imageIsPortrait ? "portrait" : "landscape"
      })`
    );
    console.log(
      `Template: ${templateWidth}x${templateHeight} (${
        templateIsPortrait ? "portrait" : "landscape"
      })`
    );

    // Check if orientations match
    if (imageIsPortrait === templateIsPortrait) {
      console.log("✓ Image orientation matches template - no rotation needed");
      return {
        imageUri,
        width: dims.width,
        height: dims.height,
        rotated: false,
        rotationDegrees: 0,
      };
    }

    // Orientations don't match - rotate 90 degrees
    console.warn("⚠ Image orientation does NOT match template - rotating 90°");
    const rotatedUri = await rotateImage(imageUri, 90);

    // Get new dimensions after rotation
    const newDims = await getImageDimensions(rotatedUri);

    return {
      imageUri: rotatedUri,
      width: newDims.width,
      height: newDims.height,
      rotated: true,
      rotationDegrees: 90,
    };
  } catch (error) {
    console.error("Error correcting image orientation:", error);
    throw new Error(`Failed to correct image orientation: ${error}`);
  }
}

/**
 * Convert image to base64
 */
export async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
}

/**
 * Save base64 string as image file
 */
export async function base64ToImage(
  base64: string,
  filename: string
): Promise<string> {
  try {
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
  } catch (error) {
    console.error("Error saving base64 as image:", error);
    throw new Error(`Failed to save base64 as image: ${error}`);
  }
}

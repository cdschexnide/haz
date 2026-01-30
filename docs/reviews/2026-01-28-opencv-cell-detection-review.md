# Code Review: OpenCV Cell Detection Design + Implementation Plan

Reviewed files:
- docs/plans/2026-01-28-opencv-cell-detection-design.md
- docs/plans/2026-01-28-opencv-cell-detection-implementation.md

Scope: design and implementation plan review only. No code changes requested.

## Findings (ordered by severity)

### High

1) Rotation/skew not handled, but line classification assumes near-perfect axis alignment
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:72-81, 204-220
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:174-183, 412-423
- Why it matters: The design/plan rely on HoughLinesP and a 5-degree tolerance for horizontal/vertical. Real scans are often skewed (scanner feed, camera perspective). If skew exceeds ~5 degrees, line classification fails, intersections disappear, and auto-alignment silently falls back to the default template. This undermines the >80% success criterion.
- Recommendation: Add a deskew/perspective normalization step (detect dominant line angle, rotate, optionally warp perspective) before line classification. Alternatively, raise tolerance or extend lines and cluster by angle, but that weakens precision.

2) Transform model is translation+scale only; no rotation or shear
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:120-126, 204-215
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:206-229, 1586-1660
- Why it matters: If the form is rotated or captured with perspective distortion, translation+scale will not align cell boundaries to template regions. Even small rotations can shift text outside regions, regressing OCR accuracy.
- Recommendation: Support rotation (at minimum) and consider a similarity or affine transform derived from anchors. If rotation is out of scope, the design should explicitly state that skewed scans are unsupported and prompt the user to re-capture.

3) Intersection building relies on finite line segments, not infinite lines
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:72-81
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:520-612, 652-727
- Why it matters: HoughLinesP returns short segments that often do not intersect because table borders are broken by text, folds, or low contrast. Using segment-only intersections can yield too few grid points and cause false failures.
- Recommendation: Extend line segments to the image bounds (or merge colinear segments into longer lines) before intersection, and/or use morphological line extraction (erode/dilate with horizontal/vertical kernels) instead of HoughLinesP alone.

4) Auto-alignment uses anchor labels only; position-based fallback from design is missing
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:106-118
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1366-1767
- Why it matters: The design calls for a hybrid anchor+position strategy to recover when anchors are missing. The implementation plan only matches anchor labels; it bails out at <3 matches. This reduces success rate and contradicts the design’s stated robustness.
- Recommendation: Add the position-based fallback in the plan (normalize template centers and find nearest detected cell within a threshold), or update the design to match the plan and adjust success criteria.

5) Scale calculation bug in computeTransform (denominator incorrect)
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1448-1485
- Why it matters: scaleCount is incremented for both x and y comparisons, but the denominator uses (scaleCount / 2) for both scaleX and scaleY regardless of whether a given axis had valid samples. This can inflate or deflate scale estimates unpredictably and could generate bad transforms even with good matches.
- Recommendation: Track scaleXCount and scaleYCount separately and divide each sum by its respective count.

### Medium

6) Line detection may overfit to text and page edges; no explicit line enhancement or text suppression
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:72-81
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1049-1136
- Why it matters: Adaptive threshold + HoughLinesP frequently detects text baselines and page edges, producing spurious lines and false cells. This can misalign regions or inflate the cell count to “success” even when the grid is wrong.
- Recommendation: Add morphological line extraction (separate horizontal/vertical kernels), or remove small connected components before Hough, or add line length and parallelism constraints relative to image size.

7) Static size thresholds are not scale-aware
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:81
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:185-190, 1148-1164
- Why it matters: minCellWidth/minCellHeight are hardcoded pixels (50x30). If image sizes vary (different DPI or camera), these thresholds are either too strict or too permissive.
- Recommendation: Define thresholds as a percentage of image dimensions or derive from median line spacing.

8) Clustering/intersection grid uses a fixed 10px threshold and rounded coordinates
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:548-610
- Why it matters: Rounding and fixed thresholds can collapse distinct lines on high-res scans or fail to merge in low-res scans. This impacts grid topology and cell sizes.
- Recommendation: Make clustering thresholds proportional to image size or line spacing, and preserve subpixel precision where possible.

9) “Success” definition for detection is shallow (cells >= 10)
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:189-194
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1155-1165
- Why it matters: A cell count threshold alone doesn’t validate that the grid matches the SDDG form. Mis-detected grids can still exceed 10 cells, leading to confident but wrong alignment.
- Recommendation: Add structural validation (expected row/column counts, known anchor layout, or overlap ratio with template) before declaring success.

10) Confidence model ignores anchor quality and spatial error
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:120-125
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1671-1767
- Why it matters: Confidence is computed from match ratio + scale deviation only; it does not consider anchor OCR confidence, spatial residuals, or cell variance. This can mark bad transforms as high confidence.
- Recommendation: Include residual error per match (distance between transformed template centers and detected centers) and incorporate OCR confidence from text blocks.

11) UI integration mentions a `SDDGResultsScreen` that may not exist
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:180-184, 235-241
- Why it matters: The app flow described in the inspector workflow doc uses SDDGProcessing -> InteractiveSDDGCompliance/SDDGInspectionComplete, not an SDDGResultsScreen. If this screen doesn’t exist, the warning banner work is misplaced.
- Recommendation: Confirm the actual screen for post-processing results and update the design/plan to target the correct UI surface (likely `SDDGProcessingScreen` or `InteractiveSDDGComplianceScreen`).

12) Potentially high performance cost on-device without a budgeted path
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:72-81, 220
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1038-1165, 1868-1895
- Why it matters: HoughLinesP on full-resolution images plus ML Kit OCR for anchors can exceed the 5s timeout on older devices. The design doesn’t specify downscaling or ROI-based processing.
- Recommendation: Add a fast path that downscales for line detection while preserving a mapping to the original resolution, or use a multi-scale approach and cap OCR to a few anchor regions.

### Low

13) Plan’s test strategy focuses on unit tests but lacks golden-image integration tests
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:36-106, 244-375, 864-1016, 1769-1905
- Why it matters: The core algorithm is image processing; unit tests won’t validate real-world robustness. Missing golden-image tests risks regressions with no signal.
- Recommendation: Add a small corpus of anonymized SDDG scans and expected cell counts/anchor matches for integration tests.

14) Library version pinned in design but not in plan
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:48
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:19-26
- Why it matters: If a specific OpenCV RN binding version is required, the plan should pin it to avoid API differences and native build issues.
- Recommendation: Add the explicit version to the install step or note compatibility constraints.

15) Error handling logs but does not surface actionable recovery paths
- Location: docs/plans/2026-01-28-opencv-cell-detection-design.md:185-220
- Location: docs/plans/2026-01-28-opencv-cell-detection-implementation.md:1206-1325, 1868-1895
- Why it matters: “Proceed with default template” may not inform the user that auto-alignment failed; this could lead to silent bad extractions.
- Recommendation: Include UX copy guidance for explicit user feedback when auto-alignment fails, not just low confidence.

## Open Questions / Assumptions

- Do we have a known-good dataset of scanned SDDG forms across scanners/cameras for validation? The success criteria depend on this.
- Are there multiple SDDG template variants in production? If yes, how will the auto-alignment choose the template before alignment?
- What is the expected image resolution range (scanner DPI vs. camera photos)? Several thresholds assume ~2550x3300.
- Is there an existing results/summary screen to host the warning banner, or should it be integrated into `SDDGProcessingScreen` or `InteractiveSDDGComplianceScreen`?

## Change Summary (design/plan only)

- No changes were made. This review documents risks and gaps in the design and implementation plan.

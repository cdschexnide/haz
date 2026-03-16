# SDDG Region Alignment Redesign (No-Code Design)

**Date:** 2026-01-27
**Owner:** TBD
**Status:** Draft (design only, no implementation)

## Problem Summary
The current region-adjustment UX requires inspectors to manually drag/resize ~23 fields to align the AMC IMT 1033 template to each photo. Because camera angle, distance, and rotation vary per capture, static template coordinates drift wildly between images. The workflow is accurate but extremely slow and frustrating.

## Goals
- Align region coordinates to each captured SDDG image automatically.
- Reduce user interaction to 0-30 seconds per form (ideally 0).
- Preserve region-based OCR (still needed for consistent parsing).
- Provide a graceful fallback when auto-alignment confidence is low.

## Non-Goals
- Replacing region-based OCR with full-page parsing.
- Changing the data extraction model or post-processing rules.
- Implementing new ML models that require training a custom dataset.

## Proposed Solution (High Level)
Replace manual per-field adjustment with **automatic form normalization + template registration**:

1. **Document detection and perspective correction**
   - Detect the page boundary (4 corners) and warp the image to a canonical, letter-sized rectangle.
   - This normalizes scale, rotation, and keystone distortion.

2. **Template registration using OCR anchors**
   - Run lightweight OCR to detect a small set of anchor labels (e.g., form title, AIR WAYBILL NO, SHIPPER, CONSIGNEE).
   - Compute a best-fit transform that aligns expected anchor positions (from the template) to detected positions in the normalized image.

3. **Apply transform to all regions**
   - The entire template moves as a unit, keeping the relative layout intact.
   - Optional: small per-region refinement using nearby OCR results.

4. **Confidence scoring and fallback**
   - If anchor matches are sparse or residual error is high, prompt the user to either:
     - Retake the photo, or
     - Adjust **only 3-4 alignment handles** (not 23 fields).

## Detailed Design

### 1) Normalize the Image to a Canonical Form
**Objective:** Make every captured image look like the original 300 DPI template by removing camera distortion.

**Steps:**
- Detect page edges (document scanner or OpenCV-like rectangle detection).
- Compute homography and warp the image into a fixed-resolution canvas.
- Use the template’s canonical size (e.g., 2550x3300 px at 300 DPI).

**Why this matters:** If the image is normalized to the canonical layout, the template’s region coordinates become stable again.

### 2) Anchor-Based Template Registration
**Objective:** Correct residual misalignment caused by imperfect edge detection or partial page capture.

**Anchor candidates (examples):**
- “SHIPPER’S DECLARATION FOR DANGEROUS GOODS” (title line)
- “AIR WAYBILL NO.”
- “SHIPPER”
- “CONSIGNEE”
- “SHIPPER’S REFERENCE NUMBER”
- “TRANSPORTATION DETAILS”

**Mechanism:**
- Run fast OCR on the normalized image to detect text bounding boxes.
- Fuzzy-match detected text to known anchors.
- For each matched anchor, record the detected box center.
- Compute a best-fit affine transform between template anchor points and detected anchor points.
- Use RANSAC or a robust least-squares fit to ignore outliers.

**Output:** A refined transform that aligns the template to the real photo.

### 3) Region Refinement (Optional but Valuable)
**Objective:** Improve box fit for fields that contain dense text.

**Option A:** Expand each region by a small margin (e.g., 5-8%) and snap to nearby OCR bounding boxes.

**Option B:** Detect horizontal/vertical ruling lines (Hough transform) and align region edges to the nearest lines.

This step is optional and can be gated by confidence or performance budget.

### 4) Confidence Scoring and Fallback UX
**Confidence metrics:**
- Number of anchors matched.
- Mean residual error (px) between expected and detected anchors.
- % of anchors with high OCR confidence.

**Threshold behavior:**
- **High confidence:** Proceed silently; no user intervention.
- **Medium confidence:** Show a quick “alignment preview” with a single confirm button.
- **Low confidence:** Offer a simplified manual alignment:
  - Four-corner drag (page corners) **or**
  - Two anchor boxes (title + air waybill) to align the template.

### 5) Session-Level Reuse
If the user captures multiple pages from the same session (or same camera setup), reuse the last successful transform as the initial guess for the next image. This increases speed and consistency.

## UX Flow Proposal
1. **Capture/Select SDDG** (unchanged)
2. **Auto-align (new step, background)**
   - Show a short “Aligning form…” state (1-2 seconds)
   - If confidence is high, continue directly to OCR
3. **Alignment Preview (only if needed)**
   - Overlay template on image
   - Provide “Looks Good” and “Fix Alignment”
4. **Fix Alignment (simplified)**
   - Drag 4 corners or 2 anchor boxes
   - Template snaps into place
5. **Proceed to OCR**

## Data/Model Changes (Design Only)
- Add a normalized coordinate mode to the template: store canonical dimensions once and compute scaled coordinates dynamically.
- Store per-image transform metadata alongside OCR results for traceability.

## Risks and Mitigations
- **Risk:** Page boundary detection fails on poor lighting or cropped images.
  - **Mitigation:** Provide capture guidance overlay + retake prompt.

- **Risk:** OCR anchors are not detected reliably.
  - **Mitigation:** Use multiple redundant anchors and fuzzy matching.

- **Risk:** Different template revisions.
  - **Mitigation:** Use identifier text + anchor patterns to detect form version; fall back to manual alignment when mismatch is detected.

## Success Metrics
- Median time spent on region alignment.
- % of SDDG scans requiring manual correction.
- OCR field accuracy vs. current workflow.
- Inspector-reported frustration reduction (qualitative).

## Double-Check Summary
- The solution preserves region-based OCR.
- It removes per-field manual edits and replaces them with a single global alignment.
- It addresses photo variance (scale, rotation, perspective) through normalization.
- It provides a realistic fallback when automation is uncertain.


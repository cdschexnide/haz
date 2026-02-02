# Code Review: Cell-Based Extraction Design + Plan (2026-01-30)

Scope: Review of `docs/plans/2026-01-30-cell-based-extraction-design.md` and `docs/plans/2026-01-30-cell-based-extraction-plan.md`. No code changes requested or performed.

## Executive Summary
The design correctly targets the two anchor-based failure modes by shifting extraction boundaries from proximity-based anchors to explicit cell geometry. The hybrid fallback strategy is sensible and minimizes regression risk. However, several critical integration details are unspecified or potentially brittle: coordinate alignment between OpenCV cells and ML Kit OCR blocks, label-to-cell mapping assumptions, and fixed pixel thresholds that are likely to behave differently across image scales. The implementation plan is mostly complete but should address confidence/telemetry, mapping edge cases, and testing beyond a single device scan.

## High-Risk Findings

1) Coordinate-space alignment not specified
- Risk: `DetectedCell` bounds from OpenCV may be in a different coordinate space than ML Kit `TextBlock` bounds (e.g., rotated image, scaling, downsampled preview vs original). If not aligned, `isBlockCenterInCell()` will systematically fail or mis-assign blocks.
- Impact: Cell extraction silently produces empty or incorrect values; fallback to anchors may mask the issue in testing, creating a false sense of success.
- Where: Design “Pipeline” + Plan Task 1 `isBlockCenterInCell()`.
- Recommendation: Explicitly document and verify coordinate space alignment (same image, same orientation, same scale). If any scaling occurs, add a conversion step using known image dimensions from OpenCV and ML Kit output.

2) Label-in-cell assumption may fail for real forms
- Risk: The mapping requires a field label to be inside the same cell as the value. Some forms place labels in left/header cells and values in adjacent right cells (common in shipping forms). OCR may split/merge labels into neighboring cells unpredictably.
- Impact: Fields can remain unmapped even when cells are detected correctly, leading to anchor fallback and inconsistent behavior.
- Where: Design “Cell-to-Field Mapping” and Plan `mapCellsToFields()`.
- Recommendation: Consider secondary heuristics (e.g., adjacent-cell linkage by shared row/column, or label cell adjacency rules) or a fallback that selects the nearest value-only cell when a label-only cell is found.

3) Fixed pixel thresholds for reading order
- Risk: `LINE_THRESHOLD = 15` uses absolute pixels and does not scale across varying resolutions or device cameras.
- Impact: Text concatenation order becomes inconsistent; lines might collapse into a single line or split incorrectly, which can degrade post-processing and downstream parsing.
- Where: Plan `extractTextFromCell()`.
- Recommendation: Make the threshold proportional to average text height or cell height; document the rationale and expected scale range.

4) Confidence reporting is hard-coded
- Risk: Cell-based extraction results are assigned `confidence: 0.95` regardless of OCR quality, detection certainty, or label match strength.
- Impact: Downstream consumers may over-trust incorrect data. This can also complicate QA if confidence is used for highlighting or human review.
- Where: Plan Task 2 early-out in `extractWithAnchors()`.
- Recommendation: Tie confidence to inputs (e.g., OCR block confidences if available, label match score, or detection success), or assign a conservative default.

## Medium-Risk Findings

5) `SKIP_CELL_EXTRACTION` includes `phone_number` with no replacement field mapping
- Risk: The plan explicitly skips `phone_number`, yet the original bug is missing shipper phone/DSN. The design suggests the phone number becomes part of the shipper cell’s value, but this changes field semantics.
- Impact: Downstream systems expecting `phone_number` may remain empty. The fix may appear to work visually but still break field-level exports.
- Where: Plan Task 1 `SKIP_CELL_EXTRACTION` and design “Problem.”
- Recommendation: Clarify whether `phone_number` should be populated separately or intentionally folded into `shipper`. If separate, add parsing or remove `phone_number` from the skip list and map it via a regex post-step.

6) Cell assignment can be order-sensitive and opaque
- Risk: `assignedCells` prevents a cell from mapping to multiple fields. If OCR merges labels (e.g., “SHIPPER / CONSIGNEE”), priority ordering decides the final mapping.
- Impact: Wrong field assignment without clear recovery path; mapping quality depends on OCR idiosyncrasies.
- Where: Plan `mapCellsToFields()`.
- Recommendation: Log the cell text when conflicts occur; consider allowing multiple labels per cell with explicit tie-break rules or a “needs-review” flag.

7) Fallback criteria based on “< 10 cells” may be overly coarse
- Risk: Some scans may detect fewer cells but still include critical fields. Hard failing to anchors wastes potentially valid cell extraction.
- Impact: Reduced coverage for partial or low-quality scans; a missed opportunity to improve accuracy.
- Where: Design “Fallback Strategy.”
- Recommendation: Use a more nuanced condition (e.g., percentage of expected cells, or at least N key fields detected).

8) Logging volume and emoji in production logs
- Risk: The plan uses multiple `console.log()` calls with emoji. In React Native, this can add overhead and noisy logs.
- Impact: Debugging signal-to-noise ratio decreases; performance overhead in production builds if not stripped.
- Where: Plan Task 1 and Task 2.
- Recommendation: Gate logs behind a debug flag or use a centralized logger with log levels.

## Low-Risk Findings / Nits

9) Label matching uses `includes()` on concatenated text
- Risk: False positives when labels appear as substrings within values (e.g., “CONSIGNMENT” containing “CONSIGN”).
- Impact: Rare mis-mapping, especially if OCR returns partials.
- Recommendation: Use word boundaries or token-based matching, or a conservative regex list.

10) Exclude labels are only applied to the current field
- Risk: A cell containing multiple labels might match the wrong field if excludes are incomplete.
- Impact: Mapping instability for merged OCR.
- Recommendation: Add additional excludes or a conflict resolution stage.

## Design Review Notes

- The hybrid architecture is sound and aligns with the prior “manual-region” success. The fallback to anchors reduces regression risk but may mask cell-related failures, so observability is important.
- The design explicitly retains adaptive table logic and checkbox extraction; this is good separation of concerns and minimizes impact on fragile subsystems.
- Missing from the design: explicit coordinate normalization, expected cell counts per form, and how to handle rotated or skewed images.

## Implementation Plan Review Notes

- The proposed module structure and exports are reasonable and align with existing code structure (`anchorConfig`, `valueExtraction`).
- The plan introduces new behavior inside `extractWithAnchors()` but doesn’t describe how this affects `onProgress` semantics or UI status messaging. If progress is surfaced to users, the new step should be accounted for.
- The plan assumes `convertToMLKitFormat()` returns text blocks in the same coordinate system as `detectCells()`; this must be verified.
- The plan adds a new file but doesn’t mention unit tests or fixtures for mapping, reading order, or post-processing behavior.
- “For Claude: REQUIRED SUB-SKILL” is a workflow instruction for a different agent; it should be ignored or removed when implementing to avoid process confusion.

## Testing Gaps

- No unit tests for `mapCellsToFields()` label mapping with ambiguous or merged text.
- No tests for `extractTextFromCell()` reading-order assembly across different resolutions.
- No tests validating coordinate alignment (e.g., synthetic image with known bounds).
- Only manual device testing described; no regression tests against known OCR samples or fixtures.

## Open Questions

- What coordinate space does ML Kit’s `TextBlock.boundingBox` use relative to the image passed to OpenCV? Are both derived from the same image asset with no scaling/rotation?
- Should `phone_number` remain a dedicated field, or is it intentionally folded into `shipper`? If it must remain separate, how will it be extracted post-cell?
- Do any SDDG variants place labels outside the value cell (adjacent header/left column)? If yes, how will mapping handle those forms?
- Is there a preferred confidence model or metric in the existing pipeline that should be used instead of a hard-coded value?

## Suggested Follow-ups (Non-blocking)

- Add a small fixture-based test suite for cell mapping and reading order.
- Capture metrics (e.g., % of fields extracted by cell vs anchor) to quantify improvement.
- Add a debug overlay that visualizes cell boundaries and matched fields for faster QA.

---

Review prepared without modifying the design or plan documents.

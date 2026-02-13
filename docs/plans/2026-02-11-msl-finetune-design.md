# MSL (Military Shipping Label) Fine-Tuning Design

## Goal
Add military shipping label detection (class 98) to the existing 97-class YOLOX-Tiny model without degrading detection/classification of existing classes.

## Current State
- **Production model**: `yolox_confidence_boost_epoch60.pte` (97 classes, YOLOX-Tiny)
- **Training history**: 100 base epochs + 60 confidence boost epochs
- **Confidence boost checkpoint**: `/My Drive/HazProML/models/confidence_boost_97class/confidence_boost_epoch_60.pth`
- **Original dataset**: `/My Drive/HazProML/data/combined_dataset/` (2262 images, 97 classes)

## MSL Data Available
- `assets/MSLImages/` (48 images) + `assets/MSLImages_annotations/` (48 annotation files, **51 MSL bboxes**, 181 total bboxes)
- `assets/real_hazmat_images_WITH_MSL/` (45 images) + `assets/real_hazmat_images_WITH_MSL_annotations/` (45 annotation files, **22 MSL bboxes**, 194 total bboxes)
- Both use identical 98-class `obj.names` — classes 0-96 match existing model, class 97 = `militaryShippingLabel`
- Annotations are CVAT YOLO 1.1 format
- The two image sets partially overlap; `MSLImages_annotations` is the primary set (more MSL bboxes)

## Approach: Fine-Tune from Confidence Boost Checkpoint

### 1. Dataset Preparation

1. **Original combined dataset** (from Google Drive): 2262 images, 97 classes — copied as-is for forgetting protection
2. **MSL images**: Use `MSLImages/` (48 images) with `MSLImages_annotations/` as primary set. Add unique images from `real_hazmat_images_WITH_MSL/` not already present.
3. **MSL oversampling**: Duplicate MSL images **5x** in the training set (~10% effective representation)
4. **Class mapping**: Extend 97-class `class_mapping.json` to 98 classes — add `{"id": 97, "name": "militaryShippingLabel", "category": "military"}`
5. **Train/val split**: ~80% MSL images for training, ~20% (~10 images) held back for validation
6. **YOLO→COCO conversion**: Same `yolo_to_coco()` function as existing notebooks, with `NUM_CLASSES=98`

### 2. Model Architecture Modification

1. **Load** `confidence_boost_epoch_60.pth`
2. **Expand `cls_preds` layers** (3 layers, one per stride 8/16/32):
   - Create new `Conv2d` with `out_channels=98`
   - Copy existing 97 channels of weights/biases exactly
   - Initialize channel 98 (MSL) with Xavier init + small negative bias
3. **All other layers** (backbone, objectness, regression) keep trained weights
4. **Reset epoch counter** to 0 in checkpoint

### 3. Training Strategy

**Phase 1: Head warmup (epochs 1-15)**
- Freeze backbone (YOLOPAFPN) — only detection head trains
- Learning rate: `0.001 / 64` (2x higher than confidence boost, new neuron needs to learn)
- Warmup: 3 epochs
- Augmentation ON (mosaic + mixup for maximum diversity)
- `OBJ_LOSS_WEIGHT = 2.0`

**Phase 2: Full fine-tune (epochs 16-40)**
- Unfreeze backbone — all layers trainable
- Learning rate continues cosine decay
- No-aug phase: last 15 epochs (epochs 26-40)
- Low effective LR protects existing classes

**Settings:**
- `MAX_EPOCHS = 40`
- `BATCH_SIZE = 16`
- `INPUT_SIZE = (640, 640)`
- `OBJ_LOSS_WEIGHT = 2.0`
- `SAVE_INTERVAL = 5`
- `save_history_ckpt = True`

### 4. Validation & Export

**MSL-specific validation:**
- Run inference on held-back MSL images
- Report: detection rate, confidence scores (target >70%), false positive rate

**Regression check:**
- Inference on original validation images (no MSL)
- Verify existing classes still detected at similar confidence
- Check for spurious MSL detections

**Checkpoint comparison:**
- Visual side-by-side of epochs 20, 30, 35, 40

**ExecuTorch export:**
- Same pipeline as `04_export_confidence_boost.ipynb`
- `YOLOXExportWrapper` → `torch.export` → `to_edge_transform_and_lower(XnnpackPartitioner)`
- Output: `yolox_msl_finetune_epoch{N}.pte` (~19.4 MB)
- Metadata JSON with `num_classes: 98`

### 5. App Integration (post-export)
- Copy `.pte` to `assets/models/`
- Update `class_mapping.json` with MSL entry
- Update `NUM_CLASSES` references in RN app

## Pre-Flight Checklist (before running notebook)

1. Upload `assets/MSLImages/` to `/My Drive/HazProML/data/MSLImages/`
2. Upload `assets/MSLImages_annotations/` to `/My Drive/HazProML/data/MSLImages_annotations/`
3. Upload `assets/real_hazmat_images_WITH_MSL/` to `/My Drive/HazProML/data/real_hazmat_images_WITH_MSL/`
4. Upload `assets/real_hazmat_images_WITH_MSL_annotations/` to `/My Drive/HazProML/data/real_hazmat_images_WITH_MSL_annotations/`
5. Verify `/My Drive/HazProML/data/combined_dataset/` exists (original 2262 images)
6. Verify `/My Drive/HazProML/models/confidence_boost_97class/confidence_boost_epoch_60.pth` exists
7. Set Colab runtime to GPU T4 or better

## Notebook Structure

| Cell | Purpose |
|------|---------|
| 1 | Mount Drive, verify GPU |
| 2 | Configuration (paths, hyperparameters) |
| 3 | Install YOLOX |
| 4 | Prepare merged dataset (copy + deduplicate + oversample MSL) |
| 5 | Convert YOLO→COCO format (98 classes) |
| 6 | Create YOLOX experiment config (98 classes, two-phase schedule) |
| 7 | Patch yolo_head.py for OBJ_LOSS_WEIGHT |
| 8 | Expand model head (97→98 classes) + save modified checkpoint |
| 9 | Train (40 epochs, two-phase) |
| 10 | Save checkpoints to Drive |
| 11 | MSL validation + regression check |
| 12 | Visual comparison across checkpoints |
| 13 | Summary + next steps |

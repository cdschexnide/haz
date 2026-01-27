# Technical Report

**Overview:** This report documents the completion of the digital mobile application workflows associated with the inspection of hazardous materials prepared for military air shipment, in accordance with the requirements outlined in AFMAN 24-604, Preparing Hazardous Materials for Military Air Shipments. This effort was executed as part of a Phase II prototype focused on digitizing and operationalizing hazardous materials workflows to support DoD logistics, deployment, and transportation operations.

The mobile application enables Hazardous Materials Inspectors to perform their certification duties efficiently and compliantly through guided digital workflows, integrated machine learning detection capabilities, and automated compliance documentation generation.

**Project Scope:** To develop HazPro mobile software Minimum Viable Product (MVP) to modernize the process for preparing and inspecting HAZMAT shipments for SDDGs based upon DoD regulations.

**Assumptions:** Customers want a scalable solution that supports Preparer and Inspector functions and allows quicker and effective Hazardous Materials shipment capabilities.

| CLIN | Deliverable Description |
|------|------------------------|
| 0006 | **Develop & Demonstrate Inspector Software Features** |

**Deliverable Focus:** The scope for this CLIN deliverable included the design and development of the mobile application workflows that guide Hazardous Materials Inspectors through the end-to-end process of certifying hazardous materials shipments for air transport. These workflows encompass SDDG (Shipper's Declaration for Dangerous Goods) verification, physical package inspection, marking and labeling compliance validation, and the generation of official inspection documentation (AMC Form 1015), all aligned with AFMAN 24-604.

In addition to standard inspection workflows, the following capabilities were implemented:

- **Machine Learning Detection System**, enabling automated identification of hazmat labels and extraction of package markings through camera-based image capture.
- **Frustration Tracking and Reinspection System**, allowing inspectors to document non-compliance issues and conduct targeted reinspections with full audit trail.
- **Material-Specific Inspection Modules**, providing specialized verification workflows for materials with unique regulatory requirements (lithium batteries, magnetized materials, dry ice, infectious substances, etc.).

---

## Accomplishments/Results

### Inspector Workflow Architecture

The Inspector module implements a three-phase chevron-based workflow that mirrors the regulatory inspection process defined in AFMAN 24-604:

**Phase 1: SDDG Verification**
- Capture or manual entry of the Shipper's Declaration for Dangerous Goods
- Field-by-field compliance validation against regulatory requirements
- Extraction of key shipment data (UN number, Proper Shipping Name, hazard class, packing group, quantities)
- Frustration documentation for non-compliant SDDG fields

**Phase 2: Package Inspection**
- Packaging type verification and validation against SDDG declarations
- Attachment 28 (packaging criteria) compliance checking
- Special provisions applicability review
- ML-powered detection of hazmat labels and package markings
- UN specification package marking (POP) validation
- Material-specific inspection procedures
- Inner packaging verification (opening/closing procedures)

**Phase 3: Completion and Documentation**
- Frustration summary review with reinspection options
- AMC Form 1015 generation with automatic frustration-to-checklist mapping
- PDF export and digital sharing capabilities
- Inspection record persistence for historical tracking

### Machine Learning Detection System

A core technical innovation of this deliverable is the dual-pipeline machine learning system that combines object detection and optical character recognition to automate package inspection tasks:

**YOLOX-Tiny Object Detection**
- Custom-trained model for hazardous materials label identification
- 97 label classes covering all UN hazard classes, handling labels, and military-specific markings
- Real-time inference on mobile devices using ExecuTorch runtime
- Confidence scoring with configurable thresholds for field reliability

**Google ML Kit Text Recognition**
- SDDG form field extraction via template-based region cropping
- Extraction of UN identification numbers from package markings
- Proper Shipping Name detection and validation
- UN specification package marking (POP) field extraction (A through H fields)
- EX number identification for military explosive items
- Weight and quantity extraction from package labels

**Multi-Image Aggregation**
- Support for up to six package images per inspection
- Cross-image confidence scoring and result deduplication
- Manual correction interface for ML errors with audit trail
- Preservation of user corrections through workflow navigation

The ML system reduces inspection time by automating the identification of required labels and markings, while maintaining inspector oversight through manual verification and correction capabilities.

### UN Specification Package Marking (POP) System

A comprehensive parser and validation system was developed for UN specification package markings per AFMAN 24-604 Attachment 14:

- Recognition of military and civilian POP marking formats
- Field extraction for all marking positions (A: UN symbol, B: Packaging code, C: Packing group rating, D: Gross weight/relative density, E: Solids indicator or test pressure, F: Manufacture year, G: Country code, H: Manufacturer symbol)
- Validation of packaging codes against material-specific requirements
- Packing group compatibility verification (X/Y/Z ratings vs. material PG requirements)
- Integration with packaging database for authorized container validation

### Marking and Labeling Validation

The Inspector module implements comprehensive marking and labeling requirements evaluation per AFMAN 24-604 Attachments 14, 15, and 17:

**Marking Requirements (Attachment 14)**
- PSN and UN Number verification
- Military Shipping Label (MSL) or DD Form 1387 presence
- Inhalation hazard markings
- Orientation arrows (This End Up / This Way Up)
- DOT special permit markings
- Material-specific markings (oxygen generators, biological substances, chemical kits)

**Labeling Requirements (Attachment 15)**
- Primary hazard class labels (all UN divisions)
- Subsidiary risk labels
- Cargo Aircraft Only labels
- Handling labels (Keep Away From Heat, Package Orientation)
- Material-specific labels (infectious substance, toxic inhalation hazard)

The validation system automatically matches ML detections against regulatory requirements and generates frustrations for missing or non-compliant items.

### Material-Specific Inspection Modules

Dedicated inspection workflows were implemented for materials with unique regulatory requirements:

**Lithium Batteries (UN3090, UN3480, UN3091, UN3481)**
- Three pathway variants: standalone batteries, contained in equipment, packed with equipment
- Watt-hour rating verification
- Inner packaging requirements (non-metallic, separation from conductive materials)
- Outer packaging performance level validation
- State of charge considerations

**Magnetized Materials (UN2807)**
- Field strength measurement verification (≤5.25 milligauss at 4.6 meters)
- Compass deviation testing (≤2° at 4.6 meters)
- Sensitive equipment separation requirements
- Shielding adequacy assessment

**Dry Ice (UN1845)**
- Quantity limit enforcement by aircraft type
- Ventilation and venting requirements
- Hermetic seal prohibition verification
- Authorized packaging validation

**Biological and Infectious Substances (UN2814, UN2900, UN3373)**
- Primary container integrity verification
- Absorbent material requirements
- Secondary packaging validation
- Temperature maintenance considerations

**Additional Material-Specific Modules**
- Asbestos (NA2212, UN2212, UN2590)
- Capacitors (UN3508)
- Consumer Commodities (ID8000)
- Dangerous Goods in Apparatus (UN3363)
- Engines, Internal Combustion (UN3528, UN3529)
- First Aid and Chemical Kits (UN3316)
- Fuel-Powered Vehicles (UN3166)
- Battery-Powered Vehicles (UN3171)
- Life-Saving Appliances (UN3072, UN2990)
- Safety Devices (UN3268)
- Miscellaneous Dangerous Goods Articles (UN3548)
- Genetically Modified Organisms

### Frustration System and Reinspection Workflow

A comprehensive frustration tracking system was implemented to document non-compliance issues discovered during inspection:

**Frustration Categories**
- SDDG frustrations (declaration field errors)
- Marking frustrations (missing or incorrect package markings)
- Label frustrations (missing or incorrect hazmat labels)
- POP marking frustrations (UN specification marking issues)
- Material-specific frustrations (lithium battery, dry ice, magnetized material violations)

**Reinspection Workflow**
- Targeted reinspection of specific frustrated items
- Session-based tracking with item-by-item progression
- Resolution documentation with inspector sign-off
- Refrustation capability for persistent issues
- Complete audit trail of inspection attempts and resolutions

**Form 1015 Integration**
- Automatic mapping of frustrations to AMC Form 1015 checklist items
- Field-specific annotations in Comments/Reasons for Frustration section
- Chronological timeline of frustration events
- Resolution history documentation for reinspected items

### AMC Form 1015 Generation

The Inspector module generates compliant AMC Form 1015 (Hazardous Material Inspection Checklist) documentation:

- Dynamic checklist rendering based on inspection findings
- Pass/fail status for all applicable checklist items
- Frustrated items highlighted with regulatory references
- Resolved items shown with reinspection history
- PDF generation for print or digital distribution
- Digital sharing capabilities for record transmission

### Excepted and Limited Quantity Support

Workflow routing and validation logic was implemented for Attachment 19 quantity types:

**Excepted Quantities (A19.2)**
- Eligibility determination based on hazard class, packing group, and material type
- Modified marking requirements (E marking only, A14/A15 exempt)
- Quantity limit enforcement per Table A19.1

**Limited Quantities (A19.3)**
- Eligibility determination with permitted/prohibited material lists
- Standard marking and labeling requirements (A14/A15 apply)
- POP marking exemption
- Combination packaging and gross weight limit enforcement

### State Management and Persistence

A robust state management architecture was implemented to support complex inspection workflows:

- React Context-based inspection state with 50+ action methods
- Workflow state tracking (current chevron, completed substeps, reinspection mode)
- Partial inspection save and resume capability
- Database persistence using expo-sqlite
- Inspection history and record retrieval

### Excluded Hazard Classes / Materials

The following were excluded from the scope of this deliverable due to complexity and alignment with external regulatory frameworks:

- **Class 7 – Radioactive Materials**
- **Class 5 – Organic Peroxides only** (Note: Oxidizers were completed)

These materials involve specialized packaging, temperature controls, or references to external federal agencies such as the NRC or IAEA, which were not within the scope of this phase.

---

## Key Outcomes for Hazardous Materials Inspectors

The mobile application delivers the following critical capabilities at the end of each inspection workflow:

1. **Automated Label and Marking Detection** – ML-powered identification of hazmat labels and package markings, reducing manual verification burden while maintaining inspector oversight.

2. **Comprehensive Compliance Validation** – Systematic verification of SDDG accuracy, packaging requirements, marking presence, and labeling compliance against AFMAN 24-604 standards.

3. **Frustration Documentation and Tracking** – Complete audit trail of non-compliance issues with reinspection workflow support and resolution documentation.

4. **AMC Form 1015 Generation** – Automated production of the official inspection checklist with frustration-to-field mapping, ready for print or secure digital transmission.

These capabilities reduce administrative overhead, ensure standardization of inspection processes, and provide defensible documentation of compliance verification activities.

---

## Additional Complexity Areas

The following workflow challenges were successfully addressed during this period:

- **Multi-Image ML Aggregation** – Developed algorithms to combine detection results across multiple package photographs with confidence-weighted deduplication and user correction preservation.

- **POP Marking Format Variations** – Implemented flexible parsing to handle military and civilian UN specification marking formats, including variations in field separators and optional components.

- **Dynamic Workflow Routing** – Created intelligent routing logic that directs inspectors to material-specific screens based on UN number, hazard class, and special provisions, ensuring all applicable requirements are addressed.

- **Frustration-to-Form Mapping** – Established comprehensive mapping between application frustration categories and AMC Form 1015 checklist fields, including handling of items that map to "Other" categories.

- **Reinspection State Management** – Implemented session-based reinspection tracking that maintains workflow context while allowing targeted review of specific frustrated items.

---

## Outcomes and Benefits

- Digitally guided inspection workflows covering all major hazard classes and material-specific cases.
- ML-powered automation of label and marking identification, reducing inspection time while maintaining accuracy.
- Standardization of inspection processes across units and personnel roles.
- Complete audit trail of inspection activities, frustrations, and resolutions.
- Rapid generation of AMC Form 1015 documentation, improving timeliness and compliance.
- Reduced errors in compliance verification through systematic checklist enforcement.
- Increased confidence for field inspectors through intuitive UI and embedded regulatory logic.

---

## Demonstration

Demonstration of the completed Inspector features was conducted for end users and key stakeholders. This demonstration showcased the digital workflows developed under this CLIN, including SDDG verification, ML-powered package inspection, material-specific inspection modules, frustration tracking, and the generation of AMC Form 1015 documentation.

Stakeholders were provided a walkthrough of the application from the perspective of a Hazardous Materials Inspector and observed how the workflows promote compliance with AFMAN 24-604 while streamlining operational tasks. The ML detection capabilities were demonstrated using representative package photographs, showing real-time label identification and marking extraction. Feedback gathered during the session was positive and will inform future phases of development.

---

## Future Considerations

For full operationalization across all mission profiles, future development CLINs and/or phases may include:

- Inspection workflow support for Organic Peroxides and Class 7 Radioactive Materials.
- Enhanced ML model training with expanded label classes and improved accuracy for worn or damaged markings.
- Offline inspection capability with synchronization upon connectivity restoration.
- Integration with shipment tracking systems and cargo manifest databases.
- Interoperability with multimodal regulatory frameworks (e.g., IATA, IMDG, 49 CFR).
- Digital signature integration for inspector certification.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Inspector Screens | 53 |
| ML Detection Classes | 97 |
| Material-Specific Modules | 15+ |
| Utility Modules | 40+ |
| Form Templates | 2 (AMC IMT 1033, AMC Form 1015) |
| Frustration Categories | 6 |
| State Management Actions | 50+ |

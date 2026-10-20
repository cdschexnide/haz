# Smoke Test Personas

## Overview

HazPro has two workflow-based personas:

| Persona | Description |
|---|---|
| **Preparer** | Creates and certifies hazmat shipments with SDDG generation |
| **Inspector** | Inspects packages, validates markings/labels, verifies SDDG compliance |

## Configuring Test Credentials

Set the following environment variables before running smoke tests:

```bash
# Preparer persona
export SMOKE_TEST_PREPARER_EMAIL="preparer@test.example.com"
export SMOKE_TEST_PREPARER_PASSWORD="test-password"

# Inspector persona
export SMOKE_TEST_INSPECTOR_EMAIL="inspector@test.example.com"
export SMOKE_TEST_INSPECTOR_PASSWORD="test-password"
```

## Notes

- These personas are workflow-based, not traditional RBAC roles
- The app uses tab navigation to switch between Preparer and Inspector flows
- SDDG (Shipper's Declaration of Dangerous Goods) screens are part of the Inspector workflow
- Both personas share some components (e.g., camera scanner, Unity 3D preview)

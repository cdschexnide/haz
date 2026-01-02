##### LIST OF MARKINGS #####

1. Proper Shipping Name and UN Number
  - ID: proper-shipping-name-unid
    Example: 
    ```typescript
      {
        "id": "proper-shipping-name-unid",
        "label": "Proper Shipping Name and UN Number",
        "value": "CALCIUM CARBIDE UN1402"
      },
    ```

2. Reportable Quantity (RQ)
  - ID: reportable-quantity
    Example: 
    ```typescript
      {
        "id": "reportable-quantity",
        "label": "Reportable Quantity",
        "value": "RQ appended to Proper Shipping Name"
      },
    ```

3. Technical Name
  - ID: technical-name
    Example: 
    ```typescript
      {
        "id": "technical-name",
        "label": "Technical Name",
        "value": "<whatever the technical name is, it is input by the user>"
      },
    ```

4. Lithium Battery Marking
  - ID: lithium-battery-marking
    Example: 
    ```typescript
      {
        "id": "lithium-battery-marking",
        "label": "Lithium Battery Marking",
        "value": "<special graphic marking for lithium batteries>"
      },
    ```

5. Watt Hour Storage Capacity
  - ID: watt-hour-storage-capacity
    Example: 
    ```typescript
      {
        "id": "watt-hour-storage-capacity",
        "label": "Watt Hour Storage Capacity",
        "value": "Mark capacitors with the energy capacity in Wh"
      },
    ```

6. Kit Marking (CHEMICAL KIT or FIRST AID KIT)
  - ID: kit-marking
    Example: 
    ```typescript
      {
        "id": "kit-marking",
        "label": "CHEMICAL KIT", // (or FIRST AID KIT)
      },
    ```

7. Lithium Battery Excepted Quantity Marking
  - ID: lithium-battery-excepted-quantity
    Example: 
    ```typescript
      {
        "id": "lithium-battery-excepted-quantity",
        "label": "Lithium Battery Excepted Quantity Marking",
      },
    ```

8. Net Mass of Dry Ice
  - ID: net-mass-dry-ice
    Example: 
    ```typescript
      {
        "id": "net-mass-dry-ice",
        "label": "Net Mass of Dry Ice",
        "value": "<dry ice quantity in kg> KG (<dry ice quantity in lbs> LBS)"
      },
    ```

9. POP Marking (Performance Oriented Packaging)
  - ID: pop-marking
    Example: 
    ```typescript
      {
        "id": "pop-marking",
        "label": "POP Marking, stenciled and/or printed",
        "renderType": "pop",
        "metadata": {
          "B": "1A1",
          "C": "X",
          "D": "25",
          "E": "S",
          "F": "23",
          "G": "USA",
          "H": "DOD"
        }
      },
    ```

10. Flash Point
  - ID: flash-point
    Example: 
    ```typescript
      {
        "id": "flash-point",
        "label": "Flash Point",
        "value": "<flash point in celsius> °C (<flash point in fahrenheit> °F)"
      },
    ```

11. Cylinder Marking
  - ID: cylinder-marking
    Example: 
    ```typescript
      {
        "id": "cylinder-marking",
        "label": "Cylinder Marking",
        "value": "<user input cylinder marking>"
      },
    ```

12. Limited Quantity
  - ID: limited-quantity
    Example: 
    ```typescript
      {
        "id": "limited-quantity",
        "label": "Limited Quantity",
      },
    ```

13. OVERPACK
  - ID: overpack
    Example: 
    ```typescript
      {
        "id": "overpack",
        "label": "OVERPACK",
      },
    ```
/* 

function generateShippersDeclarationOfDangerousGoodsForm(context: CertificationContext, materialsMap: HazardousMaterialMap): SDDGResult:
    errors = validateCertificationContext(context)
    if errors is not empty:
        return { success: false, errors }

    sddgData = ""

    // Generate each section of the SDDG
    sddgData += `Key 1: ${context.shipper}\n`
    sddgData += `Key 2: ${context.consignee}\n`
    sddgData += `Key 5: ${context.tcn}\n`
    sddgData += `Key 10: ${context.shipmentType}\n`

    for material in context.hazardousMaterials:
        materialData = materialsMap.get(material.unNumber)
        if !materialData:
            errors.push(`Material with UN ${material.unNumber} not found in reference.`)
            continue

        // Generate material-specific details
        sddgData += `Key 11: ${material.unNumber}\n`
        sddgData += `Key 12: ${material.properShippingName}\n`
        sddgData += `Key 13: ${material.hazardClass}\n`
        if material.subsidiaryHazards:
            sddgData += `Key 14: (${material.subsidiaryHazards.join(",")})\n`
        if material.packingGroup:
            sddgData += `Key 15: ${material.packingGroup}\n`
        sddgData += `Key 16: ${material.quantity.count} ${material.quantity.type} x ${material.quantity.netWeightKg} kg\n`
        sddgData += `Key 17: ${material.packagingInstructions}\n`

    if errors is not empty:
        return { success: false, errors }

    return { success: true, sddgData }


*/

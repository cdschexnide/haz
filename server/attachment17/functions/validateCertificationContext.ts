/* 

function validateCertificationContext(context: CertificationContext): string[]:
    errors = []

    if !context.shipper:
        errors.push("Shipper is required.")
    if !context.consignee:
        errors.push("Consignee is required.")
    if !context.tcn:
        errors.push("Transportation Control Number is required.")
    if context.hazardousMaterials is empty:
        errors.push("At least one hazardous material must be provided.")

    for material in context.hazardousMaterials:
        if !material.unNumber:
            errors.push(`UN number is required for material ${material.properShippingName}.`)
        if !material.hazardClass:
            errors.push(`Hazard class is required for material ${material.unNumber}.`)

    return errors


*/

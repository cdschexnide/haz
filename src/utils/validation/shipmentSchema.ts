import * as yup from 'yup';

/**
 * Validation schema for address fields.
 * State is conditionally required for USA addresses.
 */
export const addressValidationSchema = yup.object().shape({
  country: yup.string().required('Country is required'),
  location: yup.string().required('Location is required'),
  streetAddress: yup.string().required('Street address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().when('country', {
    is: 'USA',
    then: (schema) => schema.required('State is required for USA addresses'),
    otherwise: (schema) => schema.optional(),
  }),
  zipCode: yup.string().required('ZIP code is required'),
});

/**
 * Validation schema for shipment creation form.
 */
export const shipmentValidationSchema = yup.object().shape({
  tcn: yup.string().required('TCN is required'),
  poeOption: yup.string().required('Port of Embarkation is required'),
  podOption: yup.string().required('Port of Debarkation is required'),
});

/**
 * Validation schema for preparer information.
 */
export const preparerValidationSchema = yup.object().shape({
  name: yup.string().required('Preparer name is required'),
  title: yup.string().required('Title is required'),
  certificationPlace: yup.string().required('Certification place is required'),
});

/**
 * Full validation schema for ShipmentCreationScreen form.
 * Includes conditional validations based on POE/POD options.
 */
export const shipmentCreationSchema = yup.object().shape({
  tcn: yup
    .string()
    .length(17, 'TCN must be exactly 17 characters')
    .required('TCN is required'),
  poeOption: yup.string().required('POE option must be selected'),
  podOption: yup.string().required('POD option must be selected'),
  isChapter3: yup.string().required('Chapter 3 option must be selected'),
  poe: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('POE is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  pod: yup.string().when('podOption', {
    is: 'Channel',
    then: () => yup.string().required('POD is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperLocation: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Location Name is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperStreet: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Street is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCity: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper City is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperZipcode: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Zip Code is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCountry: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Country is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeDodaac: yup.string().when('podOption', {
    is: 'Channel',
    then: () =>
      yup
        .string()
        .length(6, 'DODAAC must be 6 digits')
        .required('Consignee DODAAC is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeCountry: yup.string().when('podOption', {
    is: 'Channel',
    then: () => yup.string().required('Consignee Country is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  preparerName: yup.string().required('Preparer Name is required'),
  preparerRank: yup.string().notRequired(),
  preparerTitle: yup.string().required('Preparer Title is required'),
  certificationPlace: yup.string().required('Certification Place is required'),
  certificationDate: yup.string().required('Certification Date is required'),
});

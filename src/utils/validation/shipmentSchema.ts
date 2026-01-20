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

/* Table A3.6. Dry Ice Limitations When Aircraft is on Minimum Air Changes */
const dryIceLimitationsKC135: {
  aircraft: string;
  maxAmount: {
    pounds: number;
    kilograms: number;
  };
  condition: string;
} = {
  aircraft: "KC-135",
  maxAmount: {
    pounds: 200,
    kilograms: 91,
  },
  condition: "Minimum air changes",
};

export type WalkthroughImageData = {
  label: string;
  src: any;
};

export const walkthroughImages: WalkthroughImageData[] = [
  {
    label:
      "Are tires free of of debris, rocks, pebbles, sand embedded within the treads",
    src: require("../assets/walkthrough/jijoe__rocks_in_tires.png"),
  },
  {
    label:
      "Is the vehicle clean and free of excess dirt, mud, pests, oil, debris, etc",
    src: require("../assets/walkthrough/jijoe__dirty_vehicle.png"),
  },
  {
    label:
      "Are there cooling system leaks that exceed 5 or more drops per minute",
    src: require("../assets/walkthrough/jijoe__coolant_leak.png"),
  },
  {
    label: "Are there crank case leaks that exceed 5 or more drops per minute",
    src: require("../assets/walkthrough/jijoe__crankcase_leak.png"),
  },
  {
    label: "Are there any fuel leaks ",
    src: require("../assets/walkthrough/jijoe__fuel_leak.png"),
  },
  {
    label: "Are there any leaks within the brake system",
    src: require("../assets/walkthrough/jijoe__break_leak.png"),
  },
  {
    label: "Dimensions are accurate and item fits the aircraft profile/contour",
    src: require("../assets/walkthrough/jijoe__aircraft_contour_fit.png"),
  },
  {
    label: "Is the center of balance clearly and properly marked and accurate",
    src: require("../assets/walkthrough/jijoe__centerofbalance.png"),
  },
  {
    label:
      "Are the keys and/or combinations available for the inspector and loadmaster",
    src: require("../assets/walkthrough/jijoe__lockkeys_combinations.png"),
  },
  {
    label:
      "Is the jerrican a Dot 5L (metal) in approved racks and secured to the vehicle and completely drained",
    src: require("../assets/walkthrough/jijoe__metal_jerrycan_rack.png"),
  },
  {
    label:
      "United Nations (UN) approved jerricans are authorized to transport fuel but must be in approved racks designed to secure jerricans and have a servicable gasket on the crew cap closure", // SubWalkthroughQuestion
    src: require("../assets/walkthrough/jijoe__UN_jerry_can.png"),
  },
  {
    label:
      "Tie-down points including clevises both interior and exterior restraint tie-downs are serviceable",
    src: require("../assets/walkthrough/jijoe__tiedown_clevis.png"),
  },
  {
    label:
      "PINTLE HOOK(S): If a Pintle Hook is to be utilized for loading/unloading, ensure all devices are serviceable.", // Prompt
    src: require("../assets/walkthrough/jijoe__pintle_hook.png"),
  },
  {
    label:
      "VEHICLE EQUIPMENT SECURED (i.e., Tools , Tires). Ensure all vehicle accessory items are secure. This includes fire extinguishers, seats\brackets and any other loose equipment that could become a projectile during flight.",
    src: require("../assets/walkthrough/jijoe_vehicle_equip_secure.png"),
  },
  {
    label:
      "TIRE PRESSURE. Check to ensure tire pressure is within the manufacturer's specifications on the sidewall of the tire. Tires must be sufficiently inflated to prevent wheel rim contact with the floor",
    src: require("../assets/walkthrough/jijoe__tire_pressure.png"),
  },
  {
    label:
      "Shelters and Generators mounted on vehicles trailers must have all bolts/nuts installed as applicable.",
    src: require("../assets/walkthrough/jijoe_vehicle_generator_load.png"),
  },
  {
    label:
      "Is the tie-down equipment used to restrain cargo to the pallets free of damage. Do not use damaged tie-down equipment.",
    src: require("../assets/walkthrough/jijoe__approved_tiedowns.png"),
  },
  {
    label:
      "Is the cargo within ISUs and other freight containers secured/restrained to prevent movement and damage during flight",
    src: require("../assets/walkthrough/jijoe__isu_90.png"),
  },
  {
    label:
      "Is all HAZMAT accessible and secured/restrained to prevent movement and damage during flight",
    src: require("../assets/walkthrough/jijoe__hazmat_access.png"),
  },
  {
    label: "test",
    src: [
      require("../assets/walkthrough/jijoe__rocks_in_tires.png"),
      require("../assets/walkthrough/jijoe__dirty_vehicle.png"),
    ],
  },
  {
    label:
      "Is shoring required and is it serviceable and immediately available",
    src: [
      require("../assets/walkthrough/jijoe__shoring1.png"),
      require("../assets/walkthrough/jijoe__shoring2.png"),
      require("../assets/walkthrough/jijoe__shoring3.png"),
      require("../assets/walkthrough/jijoe__shoring4.png"),
      require("../assets/walkthrough/jijoe__shoring5.png"),
      require("../assets/walkthrough/jijoe__shoring6.png"),
      require("../assets/walkthrough/jijoe__shoring7.png"),
    ],
  },
  {
    label:
      "Is the item SERVICEABLE (Pallet, Tie-down Rings, Nets). Are Pallets thoroughly cleaned and inspected (top & bottom) for missing and/or cracked D rings, warping, exposed core and/or delamination.",
    src: [
      require("../assets/walkthrough/jijoe__broken_d_rings.png"),
      require("../assets/walkthrough/jijoe__delamination.png"),
      require("../assets/walkthrough/jijoe__gouges_holes.png"),
    ],
  },
  {
    label:
      "Are nets free of damage (e.g., cuts, frays, missing components, etc.). Do not use damaged nets.",
    src: [
      require("../assets/walkthrough/jijoe__top_net.png"),
      require("../assets/walkthrough/jijoe__side_net.png"),
    ],
  },
  {
    label: "Are cargo nets are properly installed",
    src: [
      require("../assets/walkthrough/jijoe__full_set_net.png"),
      require("../assets/walkthrough/jijoe__low_profile_pallet.png"),
    ],
  },
];

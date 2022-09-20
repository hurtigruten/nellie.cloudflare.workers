import { variantMapper } from "./variantMapper";

const destinationsExperiment: ABExperiment = {
  name: "DestinationsExperiment-1",
  id: "WmRy32N6RLGN9RXCJx2akg",
  matcher: /^(\/[a-z]{2}-[a-z]{2})?\/expeditions\/destinations\/$/gi,
  urlMapper: variantMapper,
  probabilities: [0.5, 0.5],
};

export default destinationsExperiment;

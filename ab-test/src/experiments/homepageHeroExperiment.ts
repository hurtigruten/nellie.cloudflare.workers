import { variantMapper } from "./variantMapper";

const homepageHeroExperiment: ABExperiment = {
  name: "HomePageHeroExperiment-1",
  id: "fBSjgWJCSM-GbS_B-AVyYg",
  matcher: /^(\/en-gb)?\/expeditions\/$/gi,
  urlMapper: variantMapper,
  probabilities: [0.5, 0.5],
};

export default homepageHeroExperiment;

import homepageHeroExperiment from "./homepageHeroExperiment";

const experiments: ABExperiment[] = [homepageHeroExperiment];

export const findActiveExperiment = (url_: string) => {
  // Get rid of query params
  const url = url_.split("?")[0];

  for (let i = 0; i < experiments.length; i += 1) {
    if (experiments[i].matcher.test(url)) {
      return experiments[i];
    }
  }

  return null;
};

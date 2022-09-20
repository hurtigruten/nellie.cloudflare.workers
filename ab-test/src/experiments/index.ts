import bookingFlowStep1Experiment from "./bookingFlowStep1Experiment";
import destinationsExperiment from "./destinationsExperiment";

const experiments: ABExperiment[] = [
  bookingFlowStep1Experiment,
  destinationsExperiment,
];

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

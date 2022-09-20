/* eslint-disable max-len */
import { variantMapper } from "./variantMapper";

const bookingFlowStep1Experiment: ABExperiment = {
  name: "BookingFlowStep1Experiment-1",
  id: "wlGMWgJdR7uJLKeV57fxGA",
  matcher:
    /^(\/[a-z]{2}-[a-z]{2})?\/expeditions\/cruises\/.+\/booking\/cabin\/[0-9]\//i,
  urlMapper: variantMapper,
  probabilities: [0.5, 0.5],
};

export default bookingFlowStep1Experiment;

interface ABExperiment {
  name: string;
  id: string; // Find this in Google Optimize
  matcher: RegExp;
  urlMapper: (url: string, variant: number | string) => string;
  probabilities: number[];
}

interface ActiveABExperiment {
  id: string;
  variant: string;
}

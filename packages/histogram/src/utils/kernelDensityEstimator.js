import { mean } from 'd3-array';

/*
 * Kernel density estimator factory which takes a kernel function and input bins
 * as input config and returns a function that takes values of a random variable
 * as input and estimates its probability density function
 * code from https://gist.github.com/mbostock/4341954
 */
export default function kernelDensityEstimator(kernel, bins) {
  return values =>
    bins.map(bin => ({
      bin,
      value: mean(values, v => kernel(bin - v)),
    }));
}

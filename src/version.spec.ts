import { expect } from "chai";
import * as info from "./version";
import * as features from "./features";

export default describe("script version", () => {
  it("should be same as major.minor.build-feature1.feature2 format", () => {
    features.defineExperiment("experiment1", 100);
    features.defineExperiment("experiment2", 100);
    expect(info.version()).to.equal(
      `${[info.major, info.minor, info.build].join(
        "."
      )}-experiment1.experiment2`
    );
  });
  it("should be same as major.minor.build", () => {
    features.clearExperiments();
    expect(info.version()).to.equal(
      [info.major, info.minor, info.build].join(".")
    );
  });
});
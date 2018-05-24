import * as features from "./features";
import { expect } from "chai";

export default describe("feature flippers", () => {
  it("should allow to define a feature with a boolean flag", () => {
    features.defineExperiment("always", true);
    expect(features.isExperiment("always")).to.be.true;
    features.defineExperiment("never", false);
    expect(features.isExperiment("never")).to.be.false;
  });
});

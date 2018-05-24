import "./polyfills";
import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install({
  environment: "browser"
});
import "./";
import "./setup.spec";
import "./session.spec";
import "./campaign.spec";
import "./features.spec";
import "./microdata.spec";
import "./inbox.spec";
import "./postbox_sdk.spec";
import "./version.spec";

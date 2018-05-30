import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install({
  environment: "browser"
});
import "./";
import "./setup.spec";
import "./session.spec";
import "./campaign.spec";
import "./microdata.spec";
import "./dispatcher.spec";
import "./postbox_sdk.spec";

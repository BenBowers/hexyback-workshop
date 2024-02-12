import { SSTConfig } from "sst";
import { ConfigStack } from "./infra/ConfigStack";

export default {
  config(_input) {
    return {
      name: "hexyback-workshop",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(ConfigStack);
  }
} satisfies SSTConfig;

const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "rrv7",
    projectName: "serviceA",
    webpackConfigEnv,
    argv,
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    devServer: {
      port: 8081,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  });
};

### Install Dependencies with pnpm

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Installs all project dependencies across the pnpm workspaces. This is the first step after cloning the repository.

```sh
pnpm install
```

--------------------------------

### Run create-single-spa CLI Locally

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Executes the create-single-spa command-line interface directly from the local package directory. This example shows how to specify an output directory.

```sh
node packages/create-single-spa/bin/create-single-spa.js ../some-test-dir
```

--------------------------------

### Upgrade Project Dependencies

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Runs a script to upgrade dependencies across the project and then reinstalls them using pnpm to ensure the lockfile is updated.

```sh
./scripts/upgrade-dependencies.sh
pnpm install
```

--------------------------------

### Run Package-Specific Tests

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Executes tests located within each individual package directory recursively using pnpm.

```sh
pnpm test --recursive
```

--------------------------------

### Install ts-config-single-spa v3 (Shell)

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/generator-single-spa/CHANGELOG.md

Install the latest 3.x release of the 'ts-config-single-spa' package as a development dependency. This version includes necessary configuration updates for emitting TypeScript types.

```sh
npm install --save-dev ts-config-single-spa@^3.0.0

pnpm install --save-dev ts-config-single-spa@^3.0.0

yarn add --dev ts-config-single-spa@^3.0.0
```

--------------------------------

### Creating single-spa Application using Yarn

Source: https://github.com/single-spa/create-single-spa/blob/main/README.md

Use this command to initialize a new single-spa project interactively. It guides you through selecting project type, framework, and other configurations.

```Shell
yarn create single-spa
```

--------------------------------

### Add Changeset for Versioning

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Runs the changeset CLI to interactively record changes made in a pull request, which is used for versioning and generating release notes.

```sh
pnpm exec changeset
```

--------------------------------

### Run Specific End-to-End Test

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Executes only a single end-to-end test fixture specified by its name.

```sh
pnpm run test:e2e react-app-js-webpack
```

--------------------------------

### Install ts-config-single-spa v3.0.0

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/ts-config-single-spa/CHANGELOG.md

Commands to upgrade the 'ts-config-single-spa' package to the latest 3.x release using different package managers.

```shell
npm install --save-dev ts-config-single-spa@^3.0.0
```

```shell
pnpm install --save-dev ts-config-single-spa@^3.0.0
```

```shell
yarn add --dev ts-config-single-spa@^3.0.0
```

--------------------------------

### Publish Packages to npm

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

A sequence of commands to version, tag, and publish packages to npm using changesets and pnpm. Requires a GITHUB_TOKEN and temporarily removes/reinstates test fixtures.

```sh
# Create commit and tags for new versions
GITHUB_TOKEN=... pnpm exec changeset version
git add .
git commit -m "NPM Publish"

# Remove test packages from workspace to avoid attempts to publish them
rm -rf tests/fixtures

pnpm exec changeset tag
pnpm publish -r
git push

# Reinstate test packages to workspace so pnpm lock is correct
pnpm run test:e2e
```

--------------------------------

### Navigate to Test Fixture Directory

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Changes the current directory into a specific end-to-end test fixture directory to manually inspect or debug the generated project.

```sh
cd tests/fixtures/<fixture-name>
```

--------------------------------

### Run End-to-End Tests

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Executes the project's end-to-end tests. These tests create fixture directories, which can take time but are reused on subsequent runs.

```sh
pnpm run test:e2e
```

--------------------------------

### Clean End-to-End Test Fixtures

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Removes all generated fixture directories used by the end-to-end tests, forcing them to be recreated during the next test run.

```sh
pnpm run clean-tests
```

--------------------------------

### Build Test Fixture Manually

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Runs the build command within a specific test fixture directory, useful for debugging build issues encountered during end-to-end tests.

```sh
pnpm run build
```

--------------------------------

### Run End-to-End Tests with Watcher

Source: https://github.com/single-spa/create-single-spa/blob/main/CONTRIBUTING.md

Executes end-to-end tests and keeps the test runner active to watch for file changes, automatically rerunning tests when code is modified.

```sh
pnpm run test:e2e --watch
```

--------------------------------

### Add 'types' Property to package.json

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/ts-config-single-spa/CHANGELOG.md

Adds the 'types' property to package.json, which points to the main TypeScript declaration file generated in the 'dist' directory.

```diff
```diff
{
+  "types": "dist/<%= mainFile %>.d.ts"
}
```
```

--------------------------------

### Install webpack-dev-server - pnpm - Shell

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa/CHANGELOG.md

This command upgrades the webpack-dev-server package to version 4.0.0-rc.0 or higher as a development dependency using pnpm. This is required to address breaking changes introduced in that version.

```Shell
pnpm install --save-dev webpack-dev-server@^4.0.0-rc.0
```

--------------------------------

### Install webpack-dev-server - yarn - Shell

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa/CHANGELOG.md

This command upgrades the webpack-dev-server package to version 4.0.0-rc.0 or higher as a development dependency using yarn. This is required to address breaking changes introduced in that version.

```Shell
yarn add --dev webpack-dev-server@^4.0.0-rc.0
```

--------------------------------

### Install webpack-dev-server - npm - Shell

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa/CHANGELOG.md

This command upgrades the webpack-dev-server package to version 4.0.0-rc.0 or higher as a development dependency using npm. This is required to address breaking changes introduced in that version.

```Shell
npm install --save-dev webpack-dev-server@^4.0.0-rc.0
```

--------------------------------

### Update tsconfig.json for Type Emission (diff)

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/generator-single-spa/CHANGELOG.md

Adjust the tsconfig.json compiler options to specify 'declarationDir' for outputting type declaration files. Update the 'files' array to explicitly include the main project file and modify 'include' to exclude 'node_modules/@types'.

```json
{
  "compilerOptions": {
+     "declarationDir": "dist"
  },
+   "files": ["src/<%= mainFile %>"]
-   "include": ["src/**/*", "node_modules/@types"],
+   "include": ["src/**/*"]
}
```

--------------------------------

### Update package.json Scripts for Type Emission (diff)

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/generator-single-spa/CHANGELOG.md

Modify the 'scripts' section in package.json to include 'build:webpack' and 'build:types' commands, using 'concurrently' to run them together in the main 'build' script. This change enables automatic TypeScript type emission during the build process.

```json
{
  "scripts": {
-     "build": "webpack --mode=production",
+     "build": "concurrently <%= packageManager %>:build:*",
+     "build:webpack": "webpack --mode=production",
+     "build:types": "tsc"
  }
}
```

--------------------------------

### Update package.json Scripts for Type Emission

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/ts-config-single-spa/CHANGELOG.md

Modifies the 'build' script in package.json to use 'concurrently' to run both the webpack build and the TypeScript type emission process. Adds new 'build:webpack' and 'build:types' scripts.

```diff
```diff
{
  "scripts": {
-     "build": "webpack --mode=production",
+     "build": "concurrently <%= packageManager %>:build:*",
+     "build:webpack": "webpack --mode=production",
+     "build:types": "tsc"
  }
}
```
```

--------------------------------

### Update tsconfig.json for Type Declaration Output

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/ts-config-single-spa/CHANGELOG.md

Updates tsconfig.json to specify the output directory ('dist') for generated type declaration files using 'declarationDir'. Adjusts 'files' and 'include' properties to correctly reference the main project file and source files.

```diff
```diff
{
  "compilerOptions": {
+     "declarationDir": "dist"
  },
+   "files": ["src/<%= mainFile %>"]
-   "include": ["src/**/*", "node_modules/@types"],
+   "include": ["src/**/*"]
}
```
```

--------------------------------

### Add 'types' Property to package.json (diff)

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/generator-single-spa/CHANGELOG.md

Add the 'types' property to the root of package.json, pointing to the generated TypeScript declaration file in the 'dist' directory. This property is used by tools and other projects to locate the type definitions for the package.

```json
{
+  "types": "dist/<%= mainFile %>.d.ts"
}
```

--------------------------------

### Configuring webpack-config-single-spa-ts with outputSystemJS in JavaScript

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa-ts/CHANGELOG.md

This snippet demonstrates how to configure a webpack.config.js file using webpack-config-single-spa-ts and webpack-merge. It shows how to include the new outputSystemJS option to maintain backward compatibility with SystemJS output when upgrading to version 5.0.0 or later.

```JavaScript
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "org",
    projectName: "project",
    webpackConfigEnv,
    argv,

    // This is the new option that preserves backwards compatibility
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};
```

--------------------------------

### Configuring webpack-config-single-spa with outputSystemJS

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa/CHANGELOG.md

This snippet shows how to configure webpack using `webpack-config-single-spa` version 6.0.0 or later while explicitly retaining the SystemJS output format for backwards compatibility. It requires `webpack-merge` to combine the default configuration with custom modifications.

```javascript
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "org",
    projectName: "project",
    webpackConfigEnv,
    argv,

    // This is the new option that preserves backwards compatibility
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};
```

--------------------------------

### Configure webpack-config-single-spa-react for SystemJS Output

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa-react/CHANGELOG.md

This snippet demonstrates how to modify your webpack configuration to continue using SystemJS output after the default output changes to native ES modules in version 5.0.0. It shows how to require the necessary modules and add the 'outputSystemJS: true' option to the singleSpaDefaults configuration.

```javascript
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "org",
    projectName: "project",
    webpackConfigEnv,
    argv,

    // This is the new option that preserves backwards compatibility
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};
```

--------------------------------

### Configuring webpack-config-single-spa-react-ts for SystemJS Output - JavaScript

Source: https://github.com/single-spa/create-single-spa/blob/main/packages/webpack-config-single-spa-react-ts/CHANGELOG.md

This snippet demonstrates how to configure the webpack.config.js file to use the webpack-config-single-spa-react-ts package while explicitly enabling SystemJS output, preserving backwards compatibility with versions prior to 5.0.0.

```JavaScript
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "org",
    projectName: "project",
    webpackConfigEnv,
    argv,

    // This is the new option that preserves backwards compatibility
    outputSystemJS: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
  });
};
```

### Parcel Folder package.json Stub

Source: https://github.com/single-spa/single-spa-react/blob/main/parcel/README.md

A stub package.json file used in the Parcel Folder to redirect module resolutions for Node 10 compatibility. It specifies 'main' and 'types' fields to point to the correct implementation and type definition files, facilitating access for older Node versions.

```json
{
  "main": "./lib/cjs/parcel.cjs",
  "types": "./types/parcel/index.d.cts"
}
```

=== COMPLETE CONTENT === This response contains all available snippets from this library. No additional content exists. Do not make further requests.
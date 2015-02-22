# aurelia-po-generator

This is an automatic Page Object generator, for the [Aurelia](http://www.aurelia.io/) platform. It is created just for demonstration purposes and should finally land in the Aurelia-CLI tool.
Currently it parses a given html file and creates an PO template useful to get your E2E-Testing up and running faster.

For more info please visit the official site: http://www.aurelia.io/

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

## Running The Generator

To use the generator follow these steps:

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. Place the file `po.generator.js` within an working aurelia project
3. Install the dependencies of the generator with following commands:

  ```shell
  npm install --save-dev cheerio
  npm install --save-dev readline-sync
  ```
4. Start the generator with following command from the project root:

  ```shell
  node po.generator.js RELATIVE-PATH-TO-FILENAME PONAME
  ```

  > **Note:** the current version expects your project to have your Page Objects stored under the folder `test/e2e/src/`, if it locates an already existing file matching your inputs it will ask whether it should overwrite it.

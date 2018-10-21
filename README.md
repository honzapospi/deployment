# Deployment

Deployment is a tool for automated deployment to anywhere. Depends only on supported drivers. It is written in Node JS and TypeScript.

## Prerequisites

You nedd to have Node JS > 8 installed.

### Installing

Yo can use NPM or YARN to install this tool.

```
npm install jp-deployment --save-dev
```

or

```
yarn add jp-deployment --dev
```

Then create a file in your project root directory depands on drive. Here are a few examples:<br />
(_To see more examples look at directory /src/config_example_)

## Driver local

```javascript
const deployment = require("jp-deployment");

const config = {
  driver: "local",
  localRoot: "/a",
  remoteRoot: "b",
  ignore: [
    ".git",
    "/temp/*",
    "/log/*",
    "/node_modules",
    "/tests",
    "/.gitignore"
  ],
  purge: ["/temp", "/log"],
  deploymentFile: "/.deployment.js"
};

deployment(config, __dirname);
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/honzapospi/deployment/tags).

## Author

- **Jan Pospíšil** - _Programmer_ - [www.jan-pospisil.cz](https://www.jan-pospisil.cz),

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

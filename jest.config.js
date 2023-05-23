/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules", "src"
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "json",
    "node"
  ],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': 'identity-obj-proxy',
  },

  setupFiles: ["<rootDir>/__mocks__/dom.js"],

  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "^.+\\.hbs$": "<rootDir>/node_modules/handlebars-jest"
  },
  // transformIgnorePatterns: [
  //   "node_modules/(?!uuid)/" //see: https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  // ]
};

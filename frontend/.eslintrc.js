module.exports = {
  extends: ["react-app", "react-app/jest"],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    API: "writable", // ← tell ESLint “API” is okay here
  },
};

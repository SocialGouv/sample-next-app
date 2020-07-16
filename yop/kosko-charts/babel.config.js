module.exports = {
  env: {
    test: {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: "commonjs",
            targets: { node: "current" },
          },
        ],
      ],
    },
  },
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        extensions: [".ts"],
        root: [require("./tsconfig.json").compilerOptions.baseUrl],
      },
    ],
  ],
  presets: [
    ["@babel/preset-env", { modules: false, targets: { node: "current" } }],
    [
      "@babel/preset-typescript",
      {
        onlyRemoveTypeImports: true,
      },
    ],
  ],
};

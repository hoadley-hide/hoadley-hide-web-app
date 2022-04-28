import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

function buildConfig(sourceFile) {
  return {
    input: `./src/${sourceFile}.ts`,
    output: {
      file: `./dist/${sourceFile}.js`,
    },
    plugins: [
      typescript(), //
      resolve({
        preferBuiltins: true,
      }),
    ],
  };
}

export default [buildConfig("progress-tracker-data")];

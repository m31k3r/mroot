import fs from "fs";
import path from "path";

import browserify from "browserify";
import mkdirp from "mkdirp";
import UglifyJS from "uglify-js";

import urlDev from "./urlDev.js";

export default (filepath) => {
  if (fs.existsSync(filepath) && fs.readFileSync(filepath, "utf8").length) {
    mkdirp.sync(path.join(__dirname, "../../../dist/js"));

    browserify(filepath)
      .transform("babelify", {presets: ["latest"]})
      .bundle((err, buf) => {
        let js = buf.toString();

        if (process.argv.includes("--dev")) js = urlDev(js);

        fs.writeFileSync(path.join(__dirname, "../../../dist/js/client.js"), UglifyJS.minify(js).code)
      });
  }
}

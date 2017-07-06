import fs from "fs";
import path from "path";

import autoprefixer from "autoprefixer";
import browserify from "browserify";
import cssnano from "cssnano";
import htmlMinifier from "html-minifier";
import mkdirp from "mkdirp";
import postcss from "postcss";
import UglifyJS from "uglify-js"

import readdirSyncR from "./parts/readdirSyncR.js";
import urlDev from "./parts/urlDev.js";

// [page].html
readdirSyncR(path.join(__dirname, "../views")).map(filename => {
  let page = fs.readFileSync(filename, "utf8");

  if(page && process.argv.includes("--dev")) page = urlDev(page);

  page = htmlMinifier.minify(page, {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true
  });

  fs.writeFileSync(path.join(__dirname, "../../dist", path.basename(filename)), page);
});

// style.css
const style = [];
fs.readdirSync(path.join(__dirname, "../styles")).map(filename =>
  style.push(fs.readFileSync(path.join(__dirname, "../styles/", filename), "utf8")));
postcss([autoprefixer, cssnano({discardComments: {removeAll: true}})]).process(style.join("")).then(style => {
  mkdirp.sync(path.join(__dirname, "../../dist/css"));
  fs.writeFileSync(path.join(__dirname, "../../dist/css/style.css"), style);
});

// client.js
if (fs.existsSync(path.join(__dirname, "../scripts/client.js"))) {
  mkdirp.sync(path.join(__dirname, "../../dist/js"));
  browserify(path.join(__dirname, "../scripts/client.js"))
    .transform("babelify", {presets: ["latest"]})
    .bundle((err, js) => fs.writeFileSync(path.join(__dirname, "../../dist/js/client.js"), UglifyJS.minify(js.toString()).code));
}

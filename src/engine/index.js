import fs from "fs";
import path from "path";

import htmlMinifier from "html-minifier";
import mkdirp from "mkdirp";

import readdirSyncR from "./parts/readdirSyncR.js";
import urlDev from "./parts/urlDev.js";

import style from "./parts/style.js"
import client from "./parts/client.js"

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

style(path.join(__dirname, "../styles"));
client(path.join(__dirname, "../scripts/client.js"));

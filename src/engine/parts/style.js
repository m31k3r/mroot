import fs from "fs";
import path from "path";

import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import mkdirp from "mkdirp";
import postcss from "postcss";

export default (dir) => {
  const style = [];

  fs.readdirSync(dir).map(filename =>
    style.push(fs.readFileSync(path.join(dir, filename), "utf8")));

  if (!style.length) return;

  postcss([autoprefixer, cssnano({discardComments: {removeAll: true}})]).process(style.join("")).then(style => {
    mkdirp.sync(path.join(__dirname, "../../../dist/css"));
    fs.writeFileSync(path.join(__dirname, "../../../dist/css/style.css"), style);
  });
}

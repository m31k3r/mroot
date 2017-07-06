// inspiration: https://gist.github.com/kethinov/6658166
// note: Directorys starting with _ gets ignored.

import fs from "fs";
import path from "path";

const readdirSyncR = (dir, filenames = []) => {
  fs.readdirSync(dir).filter(f => f.charAt(0) != "_").map(f => {

    filenames = fs.statSync(path.join(dir, f)).isDirectory()
      ? readdirSyncR(path.join(dir, f), filenames)
      : filenames.concat(path.normalize(path.join(dir, f)));

  });

  return filenames;
}

export default readdirSyncR;

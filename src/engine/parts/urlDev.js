import path from "path";

export default (page) => {
  // Make relative links absolute.
  page = page.replace(/="\/(?!\/)/g, '="' + path.join(__dirname, '../../../dist/'));

  // Add .html to inbound hrefs wihout extensions.
  let urls = page.match(/href="\/([^"]*)"/g);
  if (urls) {
    urls.filter(url => path.extname(url).length < 2 && url.slice(-2, -1) != "/")
      .map(url => url.includes("#") || url.includes("?")
        ? url.includes("#")
          ? page = page.replace(url, url.replace(/#/, ".html#"))
          : page = page.replace(url, url.replace(/\?/, ".html?"))
        : page = page.replace(url, url.slice(0, -1) + '.html"'));
  }

  return page;
}

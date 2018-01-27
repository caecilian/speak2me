// Load dependencies
const fs = require("fs");
const Handlebars = require("handlebars");
const markdown = require('marked');
const glob = require("glob");

// Load JSON config file
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));

/**
/* Initialise Markdown text templates from anything stored as markdown files in the text folder
/* All placed into a "text" variable object which is passed to every handlebars template.
/* Keyed by the filename (without .md extension) e.g. {{text.side}}
*/
var markdownText = glob.sync("./text/*.md").reduce((curr, template) => {

  let templateName = template.replace("./text/","").replace(".md","");

  curr[templateName] = markdown(fs.readFileSync(template, "utf8"));

  return curr;

}, {});

/**
/* Handlebars template loading function
/* @param String Handlebars template name (without .handlebars extension) (stored in templates folder)
/* @param String CSS selector the template will be rendered into.
/* @param Object variables to pass to the Handlebars template
**/
const loadHandlebarsTemplate = (template, selector, variables = {}) => {

  variables.text = markdownText;

  document.querySelector(selector).innerHTML = Handlebars.compile(fs.readFileSync("./templates/" + template + ".handlebars", "utf8"))(variables);

};

// Routing file where all flow logic is stored
require("./routing.js");

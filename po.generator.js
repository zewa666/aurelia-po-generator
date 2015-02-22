if(process.argv.length !== 4) {
  console.log('Not enough arguments provided!\nRun the generator like this: node po.generator.js RELATIVE-PATH-TO-FILENAME PONAME');
  return;
}

function ucFirst(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}

// get required stuff
var cheerio = require('cheerio'),
    fs = require('fs'),
    readlineSync = require('readline-sync');

// read the given html file
var fileName = process.argv[2],
    poName = process.argv[3],
    fileContent = undefined,
    outputContent = 'export class PageObject_' + ucFirst(poName) + ' {\n\n\tconstructor() {\n\n\t}',
    outputFolder = 'test/e2e/src/',
    outputFileName = poName.toLowerCase() + '.po.js';

// check if output file exists
if (fs.existsSync(outputFolder + outputFileName)) {
  var answer = readlineSync.question('Output file already exists. Overwrite it? [Type: YES to continue, anything else stops execution]')
  if(answer.toUpperCase() !== 'YES') {
    console.log("Execution stopped!");
    return;
  }
}

try {
  fileContent = fs.readFileSync(fileName, 'utf8');
} catch(e) {
  console.log('Could not read given filename. Aborting');
  return;
}

if(poName === '') {
  console.log('Please specify a valid POName');
  return;
}

// load the page
var $ = cheerio.load(fileContent);

// parse all buttons
var buttons = $('input[type="button"], button:not([type="submit"])');
for(var i = 0; i < buttons.length; i++) {
  var btn = buttons[i],
      actionName = '',
      attrIdentifier = $(btn).attr('click.trigger') || $(btn).attr('click.delegate') || $(btn).attr('click.call');

  if(attrIdentifier !== undefined) {
    actionName = attrIdentifier.replace("()", '');
    actionName = ucFirst(actionName);
  } else {
    continue;
  }

  outputContent += '\n\n\t// START Section: Button ' + actionName + '\n';

  // add button getter
  outputContent += "\tgetButton" + actionName + "() {\n\t\treturn element(by.YOURSELECTOR);\n\t}";

  // add button click handler
  outputContent += "\n\n\tclickButton" + actionName + "() {\n\t\treturn this.getButton" + actionName + "().click();\n\t}";

  outputContent += '\n\t// END Section: Button ' + actionName + '\n';
}

// parse all textboxes
var txts = $('input[type="text"]');
for(var i = 0; i < txts.length; i++) {
  var txt = txts[i],
    actionName = '',
    attrIdentifier = $(txt).attr('value.bind') || $(txt).attr('value.call') || $(txt).attr('click.trigger') || $(txt).attr('click.delegate');

  if(attrIdentifier !== undefined) {
    actionName = attrIdentifier.replace("()", '');
    actionName = ucFirst(actionName);
  } else {
    continue;
  }

  outputContent += '\n\n\t// START Section: TextBox ' + actionName + '\n';

  // add textbox getter
  outputContent += "\tgetTextBox" + actionName + "() {\n\t\treturn element(by.YOURSELECTOR);\n\t}";

  // add textbox value getter
  outputContent += "\n\n\tgetTextBoxValue" + actionName + "() {\n\t\treturn this.getTextBox" + actionName + "().getText();\n\t}";

  // add textbox value setter
  outputContent += "\n\n\tsetTextBoxValue" + actionName + "(value) {\n\t\treturn this.getTextBox" + actionName + "().clear().sendKeys(value);\n\t}";
  outputContent += '\n\t// END Section: TextBox ' + actionName + '\n';
}


outputContent += "}";
//console.log(outputContent);

try {
  fs.writeFile(outputFolder + outputFileName, outputContent);
} catch(e) {
  console.log('There was a problem writing the output file:\n' + e.message);
  return;
}

console.log('\nAll done, your Page Object is created.\nNow just modify the selectors (YOURSELECTOR) and you\'re good to go.\nBye');

#!/usr/bin/env node
/* globals cat, cd, echo, grep, sed, ShellString */
var shell = require('shelljs');
var yaml = require('js-yaml');
var fs = require('fs');
var aglio = require('aglio');
var lodash = require('lodash');

shell.echo('=== Documentation generation === \n');

var docpath = __dirname + '/..';

// get argument
var configYmlFile = docpath + '/' + process.argv[2];
shell.echo('Load config from ' + configYmlFile);

// load YML from file
try {
    var config = yaml.safeLoad(fs.readFileSync(configYmlFile, 'utf8'));
} catch (e) {
    console.log(e);
    process.exit(1);
}

//shell.echo(docpath);
//shell.echo(config);

// Change template modification date to force the use of the non-cached version
// of it by the documentation generator
shell.touch(docpath + '/' + config['env']['template']);

// Remove existing documentation to prevent outdated files to remain in the
// documentation folder
shell.rm("-R", docpath + '/' + config['env']['destination-folder']);

/// configuration Aglio
var aglioOptions = {
    themeVariables: config['env']['theme'],
    themeTemplate: docpath + '/' + config['env']['template']
};

// loop on pages
lodash.forEach(config['pages'], function (element, index) {
    // load bluePrint String
    var blueprint = fs.readFileSync( docpath + '/' + element['path'], 'utf8');

    // render with aglio
    aglio.render(blueprint, aglioOptions, function (err, html, warnings) {
        // if (err) return console.log(err);
        // if (warnings) console.log(warnings);

        fileDestination = docpath + '/' + config['env']['destination-folder']+ '/' + element['folder'];
        shell.mkdir('-p', fileDestination);

        var htmlFile = fileDestination + '/index.html';

        // write html file
        fs.writeFile(htmlFile, html, function(err) {
            if (err) console.log(err);
            console.log(htmlFile + ' generated');
        });
    });
});
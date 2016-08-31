#!/usr/bin/env node
var shell = require('shelljs');
var yaml = require('js-yaml');
var fs = require('fs');
var aglio = require('aglio');
var lodash = require('lodash');


// Generation starts
shell.echo('=== Documentation generation === \n');
shell.echo('=== Configuration === \n');
// rootDocPath
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

shell.echo('=== Generate Menu === \n');
// Change template modification date to force the use of the non-cached version
// of it by the documentation generator
shell.touch(docpath + '/' + config['env']['template']);

// Remove existing documentation to prevent outdated files to remain in the
// documentation folder
shell.rm("-R", docpath + '/' + config['env']['destination-folder']);

// Build absolute pages
// // loop on menu element
lodash.forEach(config['pages'], function (page) {
    // get page
    var absoluteFile = docpath + '/' + config['env']['destination-folder'] + '/' + page['output'];
    // create folder if not exist
    shell.mkdir('-p', require('path').dirname(absoluteFile));
    page['absolute-file'] = absoluteFile;
});

// // loop on menu element
lodash.map(config['menu'], function (menuEntry, index) {
    if(menuEntry.hasOwnProperty("children")) {
        lodash.map(menuEntry['children'], function(child, index) {
            if(!config['pages'].hasOwnProperty(child['page-key'])) {
                console.log(child['page-key'] +' page-key does not exist in "pages" entry');
            }

            // get page
            child['page_path'] = config['pages'][child['page-key']]['absolute-file'];
        });
    }
});

/// Aglio Configuration
var aglioOptions = {
    themeVariables: config['env']['theme'],
    themeTemplate: docpath + '/' + config['env']['template'],
    locals: {
        menu: config['menu']
    }
};

shell.echo('=== Generate Pages === \n');
// loop on pages
lodash.forEach(config['pages'], function (element, index) {
    // load bluePrint String
    fs.readFile( docpath + '/' + element['input'], 'utf8', function (err, blueprint) {
        // render with aglio
        aglio.render(blueprint, aglioOptions, function (err, html) {
            if (err) return console.log(err);

            // create folder if not exist
            shell.mkdir('-p', require('path').dirname(element['absolute-file']));

            // write html file
            fs.writeFile(element['absolute-file'], html, function(err) {
                if (err) console.log(err);
                console.log(element['absolute-file'] + ' generated');
            });
        });
    });
});

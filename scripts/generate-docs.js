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

/// Aglio Configuration
var aglioOptions = {
    themeVariables: config['env']['theme'],
    themeTemplate: docpath + '/' + config['env']['template'],
    locals: {
        menu: {'test' : "test"}
    }
};

shell.echo('=== Generate Menu === \n');
// Change template modification date to force the use of the non-cached version
// of it by the documentation generator
shell.touch(docpath + '/' + config['env']['template']);

// Remove existing documentation to prevent outdated files to remain in the
// documentation folder
shell.rm("-R", docpath + '/' + config['env']['destination-folder']);

// // loop on menu element
// lodash.forEach(config['menu'], function (element, index) {
//     // doc-functional:
//     // title: Docs Techniques
//     // children:
//     //     page1:
//     //         title: "Comment écrire dans l'API"
//     // page_key: how-to-write-API-doc
//
//     if(config['pages'].hasOwnProperty(element['page_key']) == false) {
//         console.log(element['page_key'] +' page_key does not exist in "pages" entry');
//     }
//
//     var page = config['pages'][element['page_key']];
//     var fileDestination = docpath + '/' + config['env']['destination-folder']+ '/' + page['output_folder'];
//     // create folder if not exist
//     shell.mkdir('-p', fileDestination);
//     var htmlFile = fileDestination + '/index.html';
//     element['page_path'] = htmlFile;
// });

shell.echo('=== Generate Pages === \n');
// loop on pages
lodash.forEach(config['pages'], function (element, index) {
    // load bluePrint String
    fs.readFile( docpath + '/' + element['input'], 'utf8', function (err, blueprint) {
        // render with aglio
        aglio.render(blueprint, aglioOptions, function (err, html) {
            if (err) return console.log(err);

            var fileDestination = docpath + '/' + config['env']['destination-folder']+ '/' + element['output_folder'];
            // create folder if not exist
            shell.mkdir('-p', fileDestination);

            var htmlFile = fileDestination + '/index.html';

            // write html file
            fs.writeFile(htmlFile, html, function(err) {
                if (err) console.log(err);
                console.log(htmlFile + ' generated');
            });
        });
    });
});

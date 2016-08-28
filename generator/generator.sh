#!/usr/bin/env bash

if ! type aglio > /dev/null; then
    echo "=== Documentation cannot be generated ==="
    exit
fi

echo "=== Documentation generation ==="

DOCPATH=`dirname $0`
CONF=$DOCPATH/generator.conf
THEME=flatly
TEMPLATE=$DOCPATH/../template/index.jade
DESTINATION_FOLDER=$DOCPATH/../generated_doc

# Change template modification date to force the use of the non-cached version
# of it by the documentation generator
touch $TEMPLATE

# Remove existing documentation to prevent outdated files to remain in the
# documentation folder
rm -Rf -- DESTINATION_FOLDER

grep -v -e '^#' -e '^[[:space:]]*$' $CONF | while read -r LINE || [ -n "$LINE" ]; do
    INPUT=${LINE%|*}
    DOCOUTPUT=${LINE#*|}

    FILENAME=$(basename $LINE)
    FILENAME=${FILENAME%.*}
    OUTPUT=$DESTINATION_FOLDER/$DOCOUTPUT

    # Create the output directory structure
    mkdir -p $OUTPUT

    # Generate a documentation page using the builder
    aglio --theme $THEME --theme-template $TEMPLATE --theme-full-width true -i $INPUT -o $OUTPUT/$FILENAME.html
done

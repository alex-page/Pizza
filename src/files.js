/*
 *
 * files.js - Interact with the file system
 *
 * CreateDir  - Create a path if it doesn’t exist
 * RemoveDir  - Removing folders and all it’s sub folders
 * CopyFiles  - Copy a folder
 *
 */


'use strict';


//----------------------------------------------------------------------------------------------------------------------
// Dependencies
//----------------------------------------------------------------------------------------------------------------------
const Fs = require( 'fs' );
const Path = require( 'path' );
const Del = require( 'del' );
const Log = require( 'indent-log' );


/**
 * Create a path if it doesn’t exist
 *
 * @param  {string} dir - The path to be checked and created if not found
 *
 * @return {string}     - The path that was just worked at
 */
const CreateDir = ( dir ) => {
	Log.verbose( `💪  Stretching the dough   - Check exists:   "${ dir }"` );

	const splitPath = dir.split( '/' );

	splitPath.reduce( ( path, subPath ) => {
		let currentPath;
		let formattedPath = path;

		if( /^win/.test( process.platform ) && formattedPath === '' ) {
			// when using windows (post truth) at beginning of the path
			// we add the prefix to make sure it works on windows (yuck)
			formattedPath = './';
		}

		if( subPath !== '.' ) {
			currentPath = Path.normalize( `${ formattedPath }/${ subPath }` );

			Log.verbose( `✨  Flour the table        - Check if ${ currentPath } exists` );
			if( !Fs.existsSync( currentPath ) ) {
				try {
					Fs.mkdirSync( currentPath );

					Log.verbose( `⚪️  Dough is ready         - Created:        "${ currentPath }"` );
				}
				catch( error ) {
					Log.error( `Error when creating the folder ${ currentPath } for path ${ dir }` );
					Log.error( error );

					process.exit( 1 );
				}
			}
		}
		else {
			currentPath = subPath;
		}

		return currentPath;
	}, '' );

	return splitPath.join( '/' );
};


/**
 * Removing folders and all it’s sub folders
 *
 * @param  {array} dir      - An array of all folders to be removed
 * @return {void}
 */
const RemoveDir = ( dir ) => {
	try {
		Del.sync( dir );
		Log.verbose( `🗑  Tossed scraps away     - Removed folder: ${ JSON.stringify( dir ) } ` );
	}
	catch( error ) {
		Log.error( error );
	}
};


/**
 * ReadFile - Promisified readFile function from Fs
 *
 * @param  {string} path - The path to the file to get data from
 * @return {string}      - The data inside the file
 */
const ReadFile = path => new Promise( ( resolve, reject ) =>
	Fs.readFile( path, ( error, data ) => {
		if( error ) {
			reject( new Error( error ) );
		}
		resolve( data );
	}) );


/**
 * WriteFile - Promisified readFile function from Fs
 *
 * @param   {string} path - Where to save the file
 * @param   {string} data - The data inside the file
 * @return  {object}      - The WriteFile promise
 */
const WriteFile = ( path, data ) => new Promise( ( resolve, reject ) =>
	Fs.writeFile( path, data, ( error ) => {
		if( error ) {
			reject( new Error( error ) );
		}
		resolve();
	}) );


/**
 * Create a file name from a url, width and browser
 * @param  {*}      url     - The url
 * @param  {*}      width   - The browser width
 * @param  {*}      browser - The browser height
 * @return {string}         - The filename
 */
const FileName = ( url, width, browser ) => {
	const filename = url.replace( /(^\w+:|^)\/\//, '' ).replace( /\//g, '_' );
	return `${ browser }__${ width }__${ filename }.png`;
};


module.exports = {
	RemoveDir,
	CreateDir,
	FileName,
	ReadFile,
	WriteFile,
};

const exec = require('child_process').exec;
const glob = require('glob');
const fs = require('fs');

console.log('running build-lib.js...');

exec('tsc -p tsconfig-lib.json', (err, stdout, stderr) => {
	if (err == null) {
		console.log('success!');
		console.log(stdout);
		copyCSSFiles();
	} else {
		console.error(err);
		console.error(stdout);
		console.error(stderr);
	}
});

function copyCSSFiles() {
	const config = require('./tsconfig-lib.json');
	const outDir = config['compilerOptions']['outDir'];

	console.assert(outDir);

	const tsxGlob = config['include'][0];
	const cssGlob = tsxGlob.replace('.tsx', '.css');

	console.log('copying css files to lib...');

	glob(cssGlob, {}, (er, files) => {
		if (!er) {
			console.assert(files.length > 0);
			files.forEach(file => {
				const dest = file.replace('./src', outDir);
				copyFile(file, dest, (err) => {
					if (err) {
						console.warn(`problem copying ${file} to ${dest}`);
						console.error(err);
					} else {
						console.log(`copied ${file} to ${dest}`);
					}
				});
			});
		} else {
			console.error(er);
		}
	});

}

function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", function (err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function (err) {
		done(err);
	});
	wr.on("close", function (ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}
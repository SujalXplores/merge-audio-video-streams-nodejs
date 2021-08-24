const fs = require('fs');
const express = require('express');
const router  = express.Router();
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// console.log(ffmpegInstaller.path, ffmpegInstaller.version);

router.get('/', function(req, res) {
  let range = req.headers.range;
  console.log(range)
  res.set('Content-Type', 'video/mp4');
	const file = './public/4d';
	// const ffmpeg = require('fluent-ffmpeg');
	const proc = ffmpeg()
	// input video only stream
	.addInput(fs.createReadStream(`${file}-video-streamable.mp4`))
	// input audio only file
	.addInput(`${file}-audio.aac`)
	.format('mp4')
	// required bcz mp4 needs to write header in the front after completing whole encoding
	.outputOptions('-movflags frag_keyframe+empty_moov')
	// display progress
	.on('progress', function(progress) {
		console.log(progress);
	})
	.on('error', function(err) {
		console.log('An error occurred: ' + err.message);
	})
	// after whole merging operation is finished
	.on('end', function() {
		console.log('Processing finished !');
	})

	// pipe the resulting merged stream to output
	const ffStream = proc.pipe();
	ffStream.on('data', function(chunk) {
		console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
	});
	ffStream.pipe(res);
})

module.exports = router;
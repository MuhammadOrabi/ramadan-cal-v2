var express = require('express');
var router = express.Router();
var City = require('../models/city');
var _ = require('underscore');
var Verify = require('../libs/verify.js');
var scrapper = require('../libs/scrapper.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	City.find({}, function (err, all) {
		if (err) { return res.status(500).json({ err: err }); }
		if (!all) { return res.status(404).json('Not Found'); }
		res.json(all);
	});
});

router.get('/city', function(req, res, next) {
	let locations = scrapper.locations;
	let year = process.env.YEAR || 1439;
	let month = process.env.MONTH || 12;
	for (var i = 0; i < locations.length; i++) {
		let location = locations[i];
		scrapper.getPrayers(location.m, location.l, year, month)
		.then(d => {
			City.findOneAndUpdate({ name: location.title }, { cal: d }, function (err, city) {
				if (err) { return res.status(500).json({ err: err }); }
				if (!city) {
					City.create({ name: location.title, cal: d }, function (err, city) {
						if (err) return res.status(500).json({ err: err });
					});
				}
			});
		}).catch(err => {
			console.log(err);
		});
	}
	City.find({}, function (err, all) {
		if (err) { return res.status(500).json({ err: err }); }
		if (!all) { return res.status(404).json('Not Found'); }
		res.json(all);
	});
});

module.exports = router;

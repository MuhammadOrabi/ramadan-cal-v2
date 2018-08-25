const express = require('express');
const router = express.Router();
const City = require('../models/city');
const _ = require('underscore');


Date.prototype.addHours = function (h) {
	this.setHours(this.getHours() + h);
	return this;
}



let emptCal = {
	"city": '',
	"date": '',
	"Fajr": '',
	"Sunrise": '',
	"Dhuhr": '',
	"Asr": '',
	"Sunset": '',
	"Maghrib": '',
	"Isha": '',
	"Imsak": '',
	"Midnight": '',
	"date-tomorrow": '',
	"Fajr-tomorrow": '',
	"Sunrise-tomorrow": '',
	"Dhuhr-tomorrow": '',
	"Asr-tomorrow": '',
	"Sunset-tomorrow": '',
	"Maghrib-tomorrow": '',
	"Isha-tomorrow": '',
	"Imsak-tomorrow": '',
	"Midnight-tomorrow": ''
};


function getCityName(hashtags) {
	let name;
	for (let i = 0; i < hashtags.length; i++) {
		name = hashtags[i].hashtag;
		if (name == 'مكة' || name == 'مكه' || name == 'مكة_المكرمة' || name == 'مكه_المكرمه') {
			return name = 'مكة المكرمة';
		} else if (name == 'جده') {
			return name = 'جدة';
		} else if (name == 'جيزان') {
			return name = 'جازان';
		} else if (name == 'ابها') {
			return name = 'أبها';
		} else if (name == 'الباحه') {
			return name = 'الباحة';
		} else if (name == 'المدينة' || name == 'المدينه' || name == 'المدينة_المنورة' || name == 'المدينه_المنوره') {
			return name = 'المدينة المنورة';
		}
	}
	return name;
}

// Get the Data for Flowics API
router.post('/city/data', async (req, res) => {
	let hashtags = req.body.mention.hashtags;
	let name = await getCityName(hashtags);
	let calendar = emptCal;
	City.findOne({ 'name': name }, (err, city) => {
		if (err) { return res.status(500).json({ err: err }); }
		if (city) {
			let n = new Date().addHours(3).getDate();
			n = process.env.ALTER_DAY === undefined ? n : (n + parseInt(process.env.ALTER_DAY));
			let tod_data = _.findWhere(city.cal, {day: n.toString()});
			let tom_data = _.findWhere(city.cal, {day: (n + 1).toString()});
			calendar = {
				"city": city.name,
				"date": tod_data.day,
				"Fajr": tod_data.fajr,
				"Sunrise": tod_data.sunrise,
				"Dhuhr": tod_data.dhuhr,
				"Asr": tod_data.asr,
				"Sunset": tod_data.sunset,
				"Maghrib": tod_data.maghrib,
				"Isha": tod_data.isha,
				"Imsak": tod_data.imsak,
				"Midnight": tod_data.midnight,
				"date-tomorrow": tom_data.day,
				"Fajr-tomorrow": tom_data.fajr,
				"Sunrise-tomorrow": tom_data.sunrise,
				"Dhuhr-tomorrow": tom_data.dhuhr,
				"Asr-tomorrow": tom_data.asr,
				"Sunset-tomorrow": tom_data.sunset,
				"Maghrib-tomorrow": tom_data.maghrib,
				"Isha-tomorrow": tom_data.isha,
				"Imsak-tomorrow": tom_data.imsak,
				"Midnight-tomorrow": tom_data.Midnight
			};
		}
		res.json(calendar);
	});
});

router.get('/schema/city', function (req, res, next) {
	var schema = {
		"type": "object",
		"properties": {
			"city": {
				"type": "string",
				"description": "name of the city",
				"maxLength": 15,
				"sample": "San Francisco"
			},
			"date": {
				"type": "string",
				"description": "Date",
				"maxLength": 15,
				"sample": "17 Mar 2016"
			},
			"Fajr": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Sunrise": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Dhuhr": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Asr": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Sunset": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Maghrib": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Isha": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Imsak": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Midnight": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"date-tomorrow": {
				"type": "string",
				"description": "Date",
				"maxLength": 15,
				"sample": "18 Mar 2016"
			},
			"Fajr-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Sunrise-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Dhuhr-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Asr-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Sunset-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Maghrib-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Isha-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Imsak-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			},
			"Midnight-tomorrow": {
				"type": "string",
				"maxLength": 9,
				"sample": "06:26 AM"
			}
		},
		"required": [
			"city", "date", "Fajr", "Sunrise", "Dhuhr", "Asr", "Sunset", "Maghrib", "Isha", "Imsak", "Midnight",
			"date-tomorrow", "Fajr-tomorrow", "Sunrise-tomorrow", "Dhuhr-tomorrow", "Asr-tomorrow", "Sunset-tomorrow",
			"Maghrib-tomorrow", "Isha-tomorrow", "Imsak-tomorrow", "Midnight-tomorrow"
		]
	};
	res.json(schema);
});

module.exports = router;

/*!
 * geotext v1.0
 *
 * https://github.com/Frizzled/geotext
 *
 * Copyright (c) 2014 Vladimir Loscutoff
 * Released under the MIT license
 */
var GeoText = (function ($, undefined) {
	function GeoText(vars) {
		this.vars = { // Settings
			'name' : 'default',
			'delimiter' : ', '
		};
		this.data = { // Settings
			'success' : false
		};

		// Merge settings
		if (typeof vars !== 'undefined') this.vars = $.extend(this.vars, vars);

		this.init();
	}

	GeoText.prototype.init = function() {
		var that = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (location) {
					var point = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
					new google.maps.Geocoder().geocode({'latLng': point}, function (res, status) {
						if(status == google.maps.GeocoderStatus.OK && typeof res[0] !== 'undefined') {
							that.setLocation(res[0]);
						}
					});
				}
			);
		}
	}

	GeoText.prototype.setLocation = function(location) {
		var that = this;
		that.data.success = true;
		jQuery.each(location.address_components, function(k,v1) {
			jQuery.each(v1.types, function(k2, v2) { 
				that.data[v2]=v1.short_name;
				that.data[v2+'_long']=v1.long_name;
			});
		});
		that.applyText();
	}

	GeoText.prototype.applyText = function() {
		var that = this;
		var geoFields = $('[class*=geotext]');
		$.each(geoFields, function(key, field) {
			var $field = $(field);
			var delimiter = ($field.data('geotext-delimiter'))?$field.data('geotext-delimiter'):that.vars.delimiter;
			var geoText = that.parseField($field, delimiter);
			if (geoText) {
				// Check for leading or following text
				if ($field.data('geotext-text-before')) geoText = $field.data('geotext-text-before') + geoText;
				if ($field.data('geotext-text-after')) geoText = geoText + $field.data('geotext-text-after');

				if ($field.is('input')) {
					$field.val(geoText);
				} else {
					$field.html(geoText);
				}
			}
		});	
		
	}

	GeoText.prototype.parseField = function(field, delimiter) {
		var that = this;

		// Get rules
		var getRules = /geotext\[(.*)\]/.exec(field.attr('class'));
		if (!getRules) return false;
		var str = getRules[1];
		var rules = str.split(/\[|,|\]/);
		$.each (rules, function(key, rule) {
			rules[key] = rule.replace(" ", "");
			if (rules[key] === '') delete rules[key];
		});

		// Generate text
		var geoText = '';
		$.each (rules, function(key, rule) {
			try {
				switch (rule) {
					case "address": geoText += that.data.street_number +' '+ that.data.route; break;
					case "street": geoText += that.data.route; break;
					case "street-long": geoText += that.data.route-long; break;
					case "city": geoText += that.data.locality; break;
					case "city-state": geoText += that.data.locality +delimiter+ that.data.administrative_area_level_1; break;
					case "city-state-zip": geoText += that.data.locality +delimiter+ that.data.administrative_area_level_1 + ' ' + that.data.postal_code; break;
					case "state": geoText += that.data.administrative_area_level_1; break;
					case "state-long": geoText += that.data.administrative_area_level_1_long; break;
					case "zip": geoText += that.data.postal_code; break;
					case "county": geoText += that.data.administrative_area_level_2; break;
					case "country": geoText += that.data.country; break;
					case "country-long": geoText += that.data.country_long; break;
				}
				if (typeof rules[(key+1)] !== 'undefined') geoText += delimiter;
			} catch (err) {}
		});

		return geoText;
	}

	return GeoText;
})(jQuery);


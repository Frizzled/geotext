geotext
=======

## How it works
Add the geotext class to any HTML entity (div, span, input, etc.) and it will be populated with the requested geodata (city, state, zip code, country, etc.).  The geotext class accepts an array of inputs allowing cutomization of how location data is displayed.

## Requirements
- Requires **Google Maps API**
- Requires **jQuery**

## Adding geotext to a webpage
```
<script>
jQuery(function() { 
	new GeoText();	
});
</script>
```

## Examples
```
Your city, state and zip code: <span class="geotext[city,state,zip]"></span>
<input name="country" class="geotext[country]" />
```

## Usage
Add the geotext[] class to an element with desired data inside brackets.  The inner text or value will be replaced with requested location data (if the user approves the geolocation request). Possible displayable data:

- address
- street
- street-long
- city
- city-state
- city-state-zip
- state
- zip
- county
- country
- country-long

## Additional options
If geodata is loaded, leading or following text can be added with **data-geotext-text-before** & **data-geotext-text-after** (leading/trailing spaces should be with `&nbsp;`).  Values are separated with ", " unless a delimiter is set via **data-geotext-delimiter**.

Example:
```
<span data-geotext-text-before="Is your hometown&nbsp;" data-geotext-text-after="&nbsp;?" data-geotext-delimiter="&nbsp;" class="geotext[city,state-long]"></span>
```


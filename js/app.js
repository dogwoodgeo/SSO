/**
 * * Created by Braldey Jones on 12/3/2019.
 */

 let view;

require([
  'esri/Map',
  'esri/views/MapView',
  'esri/Basemap',
  'esri/layers/FeatureLayer',
  'esri/widgets/Home'
],

  function(
      Map,
      MapView,
      Basemap,
      FeatureLayer,
      Home
)
{

  /** 
   * * LRWRA Basemap IDs
   * * ----------------------------
   * * Default Streets:  f5c8cb30e5b14e19b434d396dbe9df39
   * * Gray Scale:       0b7accba45784b53b3a6e98b7fb19368
   * * Aerials:          14e9273d2324ba88f2a3f727b6c2c54
   * * Terrain:          5c7d41fe1413433c8bdadfcb1d9ac3ea
   */

	//* Using the LRWRA default streets vector tile basemap
	const grayBasemap = new Basemap({
		portalItem: {
			id: '0b7accba45784b53b3a6e98b7fb19368',
			portal: 'https://gis.lrwu.com/portal'
		}
  });

  //* Create labels for FL
  const labels = {
    // autocasts as new LabelClass()
    symbol: {
      type: 'text',  // autocasts as new TextSymbol()
      color: '#2A8075',
      haloColor: 'white',
      haloSize: 1.5,
      font: {  // autocast as new Font()
        family: 'Ariel',
        size: 12,
        weight: "bold"
      }
    },
    labelPlacement: "above-center",
    minScale: 20000,
    labelExpressionInfo: {
      expression: "$feature.MH_NO"
    }
  };

  //* Creat the popup for the ssoFL
  const puTemplate = {
    title: 'SSO:  {MH_NO}',
    content: [
			{
				type: 'fields',
				fieldInfos: [
          {
            fieldName: 'OCCRDTTM',
            label: 'Date',
            format: {
							dateFormat: 'day-short-month-year'
						}
          },
          {
						fieldName: 'SERVSTAT',
						label: 'Service Status'
					},
					{
						fieldName: 'UNITTYPE',
						label: 'Unit Type'
					},
					{
						fieldName: 'PROB',
						label: 'Problem',
					},
					{
						fieldName: 'PROBCAUS',
						label: 'Probable Cause'
					}
				]
			}
		]
  };

  //* Create the symbol for the ssoFL renderer
  const ssoSymbol = {
    type: "simple-marker",
    outline: { color: 'white' },
    size: 15,
    color: '#43CCBB'
  };

  //* Create the renderer for the ssoFL
  const ssoRenderer = {
    type: 'simple',
    symbol: ssoSymbol,
  }

    //* Create the symbol for the basinFL renderer
    const basinSymbol = {
      type: "simple-line",
      size: 2,
      color: '#43CCBB'
    };
  
    //* Create the renderer for the basinFL
    const basinRenderer = {
      type: 'simple',
      symbol: basinSymbol,
    }

  //* Create the feature layer
  const ssoLayer = new FeatureLayer ({
    url: 'https://gis.lrwu.com/server/rest/services/Overflows/FeatureServer',
    renderer: ssoRenderer,
    popupTemplate: puTemplate,
    labelingInfo:[labels],
    outFields: ['*'],
  });

  const basinsLayer = new FeatureLayer({
    url: 'https://gis.lrwu.com/server/rest/services/Layers/Rain_Event_Basins/FeatureServer',
    renderer: basinRenderer
  });
    
  //* Map object
  const map = new Map({
    basemap: grayBasemap,
    layers: [basinsLayer]
  });

  //* MapView Object
  const view = new MapView({
    container: 'viewDiv',
    map: map,
    zoom: 11,
    center: [-92.356121,34.737015],  
  });
  
  //* Create Home button object
  const home = new Home({
    view: view
  });

  //* Add the home button
  view.ui.add(home, "top-left");
  view.ui.add('queryDiv', 'top-right');

  const ssoDate = document.getElementById('ssoDate');

  
  //* Add event listener
  document.getElementById("queryBtn").addEventListener("click", runQuery);

  //* Run runQuery function for button click
  //* ---------------------------------------
  function runQuery() {
    //* Get the date from user input
    let value = ssoDate.value;
    //* build the query string
    let qryString = `OCCRDTTM LIKE '${value}%'`
    //* Apply the definition expression
    ssoLayer.definitionExpression = qryString;
    //* Add to the map
    map.add(ssoLayer);

    //* Get feature count and add to DOM
    ssoLayer.queryFeatureCount()
      .then(function(count) {
        if (count === 0) {
          document.getElementById('printResults').innerHTML =
          `There are no SSOs for the selected date.`;
        } else {
          document.getElementById('printDate').innerHTML =
          `${value}`;
          document.getElementById('printResults').innerHTML =
          `SSO count = ${count}`;
          ssoDate.value = '';
        }
    });
  }  
});
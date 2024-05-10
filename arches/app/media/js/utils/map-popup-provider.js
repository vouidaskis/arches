define(['arches',
    'knockout',
    'templates/views/components/map-popup.htm'
], function(arches, ko, popupTemplate) {

    var provider = {

        /**
         * Callback to determine if the feature is clickable
         * @param feature Map feature to check
         * @returns <code>true</code> if the feature can be clicked, otherwise <code>false</code>
         */
        isFeatureClickable: function(feature, map)
        {
            const selectedFeatureIds = ko.unwrap(map.selectedFeatureIds);
            const selectedTool = ko.unwrap(map.selectedTool);
            if ((typeof selectedTool !== 'undefined' && selectedTool !== null) || selectedFeatureIds && selectedFeatureIds.length)
                return false;
            return feature.properties.resourceinstanceid;
        },

        /**
         * Return the template that should be used for the
         * @param features - Unused in this provider, but may be used in custom provider to determine which template
         * to use
         * @returns {*} HTML template for the Map Popup
         */
        getPopupTemplate: function(features)
        {
            return popupTemplate;
        },

        /**
         * Each feature in the list must have a <code>displayname</code> and <code>map_popup</code> value. This is
         * handled for arches resources by the framework, but can be injected here if any of the features.popupFeatures
         * do not have one.
         */
        processData: function(features)
        {
            return features;
        },

        /**
         * This method enables custom logic for how the feature in the popup should be handled and/or mutated en route to the mapFilter.
         * @param popupFeatureObject - the javascript object of the feature and its associated contexts (e.g. mapCard).
         * @required @method mapCard.filterByFeatureGeom()
         * @required send argument: @param feature - a geojson feature object
         * @optional send argument: @param resourceid
         */
        sendFeatureToMapFilter: function(popupFeatureObject)
        {
            const feature = popupFeatureObject.geometries()[0].geom.features[0];
            popupFeatureObject.mapCard.filterByFeatureGeom(feature, popupFeatureObject.resourceinstanceid);
        },

        showFilterByFeature: function(popupFeatureObject) {
            return (ko.unwrap(popupFeatureObject.geometries) || []).length > 0;
        },

    };
    return provider;
});

/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import Rx from 'rxjs';
import { includes, castArray, some } from 'lodash';
import { LOCATION_CHANGE } from 'connected-react-router';

import axios from '@mapstore/libs/ajax';
import { updateLayerDimension, changeLayerProperties, CHANGE_LAYER_PROPERTIES } from '@mapstore/actions/layers';
import { error } from '@mapstore/actions/notifications';
import { closeIdentify, hideMapinfoMarker } from '@mapstore/actions/mapInfo';
import { isMapInfoOpen } from '@mapstore/selectors/mapInfo';
import { layersSelector, getLayersWithDimension, allBackgroundLayerSelector } from '@mapstore/selectors/layers';

import { setEffectiveDates, SET_DATE, toggleLayerVisibility, TOGGLE_LAYER_VISIBILITY } from '@js/actions/dateFilter';
import { getEffectiveDatesURL, getDimensionName } from '@js/selectors/dateFilter';


const toTimeInterval = date => date ? `${date.split("T")[0]}T00:00:00.000Z/${date.split("T")[0]}T23:59:59.999Z` : date;
// const toTimeInterval = date => `${date.split("T")[0]}T00:00:00.000Z`;
import { MAP_CONFIG_LOADED } from '@mapstore/actions/config';
export const loadDateFilterEffectiveDates = (action$, { getState = () => { } } = {}) => action$.ofType(MAP_CONFIG_LOADED)
    .switchMap( () =>
        Rx.Observable.fromPromise(axios.get(getEffectiveDatesURL(getState()))))
    .pluck('data').pluck('effectiveDates')
    .map(dates => setEffectiveDates(dates))
    .catch( () => Rx.Observable.of(error({
        title: "Error loading calendar dates",
        message: `Couldn't retrieve dates at ${getEffectiveDatesURL(getState())}`
    })));
export const dateFilterSelectionUpdateLayers = (action$) =>
    action$
        .ofType(SET_DATE)
        .switchMap(({ date }) =>
            Rx.Observable.of(updateLayerDimension('time', toTimeInterval(date)))
        );
export const resetGetFeatureInfoOnDateChange = (action$, {getState = () => {}} = {}) =>
    action$
        .ofType(SET_DATE)
        .filter(() => isMapInfoOpen(getState()))
        .switchMap(() => Rx.Observable.of(closeIdentify(), hideMapinfoMarker()));
export const dateFilterToggleHideLayerVisibility = (action$, { getState = () => { } } = {}) =>
    action$.ofType(TOGGLE_LAYER_VISIBILITY)
        .filter(({ hide }) => hide)
        .switchMap(() => {
            const layersToExclude = [...getLayersWithDimension(getState(), getDimensionName(getState())), ...allBackgroundLayerSelector(getState())];
            const layersToHide = layersSelector(getState())
                .filter(l => !includes(layersToExclude, l))
                .filter(l => l.visibility)
                .map(({ id } = {}) => id);
            return Rx.Observable.race(
                /**
                 * If the tool is still valid and the visibility has been triggered again,
                 * the layers have to re-set to original visibility
                 */
                action$.ofType(TOGGLE_LAYER_VISIBILITY)
                    .filter(({ hide }) => !hide).switchMap( () =>
                        Rx.Observable.of(changeLayerProperties(layersToHide, { visibility: true }))
                    ),
                /* In some case the toggle layer is can not be reverted anymore (i.e. some changes to the layers or location change)
                    * In both case the tool need to be reset, then everything go back to initial state
                    */
                action$.ofType(CHANGE_LAYER_PROPERTIES).filter(
                    ({ layer, newProperties: props }) => props && props.visibility && some(castArray(layer), l => includes(layersToHide, l))
                ).map( () => toggleLayerVisibility(false)),
                action$.ofType(LOCATION_CHANGE).map(() => toggleLayerVisibility(false))

            ).startWith(changeLayerProperties(layersToHide, { visibility: false}));
        });


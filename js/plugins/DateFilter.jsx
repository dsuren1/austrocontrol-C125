/*
 * Copyright 2018, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import assign from 'object-assign';
import { connect} from 'react-redux';
import { compose, branch, renderNothing } from 'recompose';
import { createSelector } from 'reselect';

import { mapLayoutValuesSelector } from '@mapstore/selectors/maplayout';

import { setDate, toggleLayerVisibility } from '@js/actions/dateFilter';
import { getEffectiveDates, getDate, showDateFilter, getHideLayers } from '@js/selectors/dateFilter';
import * as epics from '@js/epics/dateFilter';
import dateFilter from '@js/reducers/dateFilter';
import enhanceDateFilter from '@js/components/timeFilter/enhancers/dateFilter';
import DateFilter from '@js/components/timeFilter/DateFilter';

/**
 * Floating widget that allows to filter layers selecting a date. Many of the settings can be set
 * in the initial state of the component.
 * @name DateFilter
 * @memberof plugins
 * @prop cfg.showLayerVisibilityToggle hides / shows layer visibility toggle button.
 */
const DateFilterComp = compose(
    connect(
        createSelector(
            (state) => mapLayoutValuesSelector(state, { left: true }),
            getEffectiveDates,
            getDate,
            showDateFilter,
            getHideLayers,
            ({ left = 0 }, effectiveDates, date, show, hideLayers) => ({
                effectiveDates,
                date,
                show,
                hideLayers,
                style: {
                    transition: "margin 0.3s ease-out",
                    marginLeft: (left || 50) + 5
                }
            })
        ),
        {
            onSetDate: setDate,
            onToggleFilter: toggleLayerVisibility
        }
    ),
    branch(
        ({ show }) => !show,
        renderNothing
    ),
    enhanceDateFilter
)(DateFilter);

export default {
    DateFilterPlugin: assign(DateFilterComp, {
        disablePluginIf: "{state('featuregridmode') === 'EDIT'}",
        FloatingCard: {
            priority: 2,
            name: 'dateFilter'
        }
    }),
    epics,
    reducers: { dateFilter }
};

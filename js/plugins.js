/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import productPlugins from '@mapstore/product/plugins';
import { toModulePlugin } from "@mapstore/utils/ModulePluginsUtils";

export default {
    requires: {
        ...productPlugins.requires
    },
    plugins: {
        ...productPlugins.plugins,
        // project plugins
        DateFilter: toModulePlugin('DateFilter', () => import(/* webpackChunkName: 'plugins/dateFilter' */ '@js/plugins/DateFilter')),
        IdentifySettingsPlugin: toModulePlugin('IdentifySettings', () => import(/* webpackChunkName: 'plugins/identifySettings' */ '@js/plugins/IdentifySettings'))
    }
};

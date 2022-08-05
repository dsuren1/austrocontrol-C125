/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import productPlugins from '@mapstore/product/plugins'
import DateFilter from './plugins/DateFilter'
import IdentifySettingsPlugin from './plugins/IdentifySettings'

export default {
    ...productPlugins,
    plugins: {
        ...productPlugins.plugins,
        // project plugins
        DateFilter,
        IdentifySettingsPlugin
    }
};

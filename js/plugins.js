/**
 * Copyright 2016, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import productPlugins from '@mapstore/product/plugins'

import DateFilter from '@js/plugins/DateFilter'
import IdentifySettingsPlugin from '@js/plugins/IdentifySettings'

export default {
    requires: {
        ...productPlugins.requires
    },
    plugins: {
        ...productPlugins.plugins,
        // project plugins
        DateFilter,
        IdentifySettingsPlugin
    }
};

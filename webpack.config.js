const path = require('path');
const themeEntries = require('./MapStore2/build/themes.js').themeEntries;
const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;
const moduleFederationPlugin = require('./MapStore2/build/moduleFederation.js').plugin;

module.exports = require('./MapStore2/build/buildConfig')(
    {
        'austrocontrol-ms2': path.join(__dirname, "js", "app"),
        'embedded': path.join(__dirname, "js", "embedded"),
        'geostory-embedded': path.join(__dirname, "js", "geostoryEmbedded"),
        "dashboard-embedded": path.join(__dirname, "js", "dashboardEmbedded")
    },
    themeEntries,
    {
        base: __dirname,
        dist: path.join(__dirname, "dist"),
        framework: path.join(__dirname, "MapStore2", "web", "client"),
        code: [path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client")]
    },
    [extractThemesPlugin, moduleFederationPlugin],
    false,
    "dist/",
    '.austrocontrol-ms2',
    [],
    {
        "@mapstore/patcher": path.resolve(__dirname, "node_modules", "@mapstore", "patcher"),
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        '@js': path.resolve(__dirname, 'js')
    },
    {
        '/rest/geostore': {
            target: "http://localhost:8080/mapstore",
            secure: false
        },
        '/rest/config': {
            target: "http://localhost:8080/mapstore",
            secure: false
        },
        '/pdf': {
            target: "http://localhost:8080/mapstore",
            secure: false
        },
        '/mapstore/pdf': {
            target: "http://localhost:8080",
            secure: false
        },
        '/proxy': {
            target: "http://localhost:8080/mapstore",
            secure: false
        },
        '/extensions': {
            target: "http://localhost:8080/mapstore"
        },
        '/dist/extensions': {
            target: "http://localhost:8080/mapstore"
        },
    }
);

const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'public/icon'),
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'Trading Journal',
        authors: 'Trading Journal',
        exe: 'Trading Journal.exe',
        icon: path.join(__dirname, 'public/icon.ico'),
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './public/index.html',
              js: './electron/renderer.ts',
              name: 'main_window',
              preload: {
                js: './electron/preload.ts',
              },
            },
          ],
        },
      },
    },
  ],
};

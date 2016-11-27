var config = {
    type: 'local',
    localRoot: '/project',
    remoteRoot: '/var/www/myproject',
    ignore: [
        '/.git',
        '/.idea',
        '/temp',
        '/log'
    ],
    purge: [
        '/temp/cache'
    ],
    deploymentFile: '/.deployment.js'
}

require('jp-deployment')(config);

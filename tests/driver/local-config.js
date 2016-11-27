module.exports = {
    type: 'local',
    localRoot: '/project',
    remoteRoot: '/var/www/myproject',
    ignore: [
        '/temp',
        '/log'
    ],
    purge: [
        '/temp/cache'
    ],
    deploymentFile: '/.deployment.js'
}

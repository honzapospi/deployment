var config = {
    type: 'ssh2',
    connect: {
        host: '111.222.333.444',
        port: '22',
        username: 'john',
        password: 'secured_password'
    },
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

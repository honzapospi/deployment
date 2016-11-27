module.exports = (remoteList, deploymentFile, deployment) => {
    return deployment.createFile(deploymentFile, JSON.stringify(remoteList))
}
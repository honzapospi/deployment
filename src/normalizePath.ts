export default (path: string): string => {
    return path.replace(/\\/g, '/');
}
// __dirname contains the path of directory from which the script is invoked
// if we invoke from scripts/setupDev.mjs, the path would look like /path/to/proj/scripts
// and not /path/to/proj/scripts/helpers
const projectRoot = path.resolve(__dirname, '..');
const getProjectRoot = () => projectRoot;

export default getProjectRoot;

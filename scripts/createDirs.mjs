import getProjectRoot from './helpers/getProjectRoot.mjs';

const dirsToCreate = [
  'HotelPmsAdapter/logs/app',
  'HotelPmsAdapter/logs/db',
  'HotelPmsAdapter/logs/users',
  'HotelPmsAdapter/logs/wip',
  'HotelTelebot/logs/app',
  'HotelTelebot/logs/users',
  'HotelTelebot/logs/background',
  'HotelTelebot/logs/tests'
];

const root = getProjectRoot();

dirsToCreate.forEach((dir) => {
  const fullPath = path.join(root, dir);
  fs.mkdirsSync(fullPath);
  console.log('Ensured path created:', fullPath);
})

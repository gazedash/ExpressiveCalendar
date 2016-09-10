import path from 'path';

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function throwError(data) {
  console.log(data);
  throw data;
}

export function getAssetsDir() {
  return path.resolve(__dirname, '../../assets/');
}

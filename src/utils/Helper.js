import path from 'path';

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function getAssetsDir() {
  return path.resolve(__dirname, '../../assets/');
}
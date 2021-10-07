const fs = window.require('fs');

export default function createFolder(path: string) {
  if (!fs.existsSync(path)){
    return fs.mkdirSync(path, { recursive: true });
  }
}
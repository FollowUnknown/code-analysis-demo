const fs = require('fs')                            // 文件操作
const path = require('path')                        // 路径操作
const glob = require('glob')                        // 扫描文件

// 扫描VUE文件
exports.scanFileVue = function (scanPath) {
  const entryFiles = glob.sync(path.join(process.cwd(), `${scanPath}/**/*.vue`))
  return entryFiles
}

// 获取代码文件内容
exports.getCode = function (fileName) {
  try {
    const code = fs.readFileSync(fileName, 'utf-8');
    return code;
  } catch (e) {
    throw e;
  }
}

// 输出内容到JSON文件
exports.writeJsonFile = function (content, fileName) {
  try {
    fs.writeFileSync(path.join(process.cwd(), `${fileName}.json`), JSON.stringify(content), 'utf8');
  } catch (e) {
    throw e;
  }
}

// 输出内容到JS文件
exports.writeJsFile = function (prc, content, fileName) {
  try {
    fs.writeFileSync(path.join(process.cwd(), `${fileName}.js`), prc + JSON.stringify(content), 'utf8');
  } catch (e) {
    throw e;
  }
}

// 输出TS片段到TS文件
exports.writeTsFile = function (content, fileName) {
  try {
    // TODO 有bug，检查目录是否存在,否则会报错
    fs.writeFileSync(path.join(process.cwd(), `${fileName}.ts`), content, 'utf8');
  } catch (e) {
    throw e;
  }
}
const fs = require('fs')
const path = require('path')
const { writeJsFile, writeJsonFile } = require(path.join(__dirname, './file'))

// 输出分析报告
exports.writeReport = function (dir, content) {
  try {
    // 创建目录
    fs.mkdirSync(path.join(process.cwd(), `/${dir}`), 0777)
    // 复制报告模版
    fs.writeFileSync
      (
        path.join(process.cwd(),
        `/${dir}/index.html`),
        fs.readFileSync(path.join(__dirname, `../template/index.html`))
      )
    // 分析结果写入文件
    writeJsFile('var report=', content, `${dir}/index`)
    writeJsonFile(content, `${dir}/index`)
  } catch (e) {
    throw e;
  }
}
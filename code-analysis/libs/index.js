const ora = require('ora')
const chalk = require('chalk')
const moment = require('moment')
const CodeAnalysis = require('./analysis')
const { REPORTTITLE, TIMEFORMAT } = require('./constant')

// 作为外部依赖包启动分析对应工程

// 初始化分析工具类
const codeAnalysis = async (config) => {
  return await new Promise(async (resolve, reject) => {
    let spinner = ora(chalk.green('analysis start')).start()
    try {
      // 新建分析实例
      const codeTask = new CodeAnalysis(config)
      // 执行代码分析
      await codeTask.analysis()
      // 生成报告内容
      const pluginQueue = codeTask.pluginsQueue.map(item => item.mapName)
      const report = {
        reportTitle: config.reportTitle || REPORTTITLE,
        analysisTime: moment(Date.now()).format(TIMEFORMAT),
        pluginQueue
      }
      if (pluginQueue.length > 0) {
        pluginQueue.forEach(item => {
          report[item] = codeTask[item]
        })
      }
      resolve({
        report
      })
      spinner.succeed(chalk.green('analysis success'));
    } catch (error) {
      reject(error)
      spinner.fail(chalk.red('analysis fail'))
    }
  })
}

module.exports = codeAnalysis
const path = require('path')
const tsCompiler = require('typescript')
const chalk = require('chalk')
const request = require('request')
const processLog = require('single-line-log')
const { CODEFILETYPE } = require(path.join(__dirname, './constant'))
// 读写模块
const { scanFileVue } = require(path.join(__dirname, './file'))
// 解析模块
const { parseVue } = require(path.join(__dirname, './parse'))

const { getMergeRequestFiles } = require(path.join(__dirname, './gitlab'))

class CodeAnalysis {
  constructor(options) {
    // 私有属性
    this._scanSource = options.scanSource
    this._analysisPlugins = options.analysisPlugins || []

    // 公共属性
    this.parseErrorInfos = []
    this.pluginsQueue = []
  }

  async analysis() {
    // 注册插件
    this._installPlugins(this._analysisPlugins);
    // 扫描分析Vue
    await this._scanCode(this._scanSource, CODEFILETYPE.VUE);
  }

  _installPlugins(plugins) {
    if (plugins.length > 0) {
      plugins.forEach((item) => {
        this.pluginsQueue.push(item(this));
      })
    }
  }

  // 扫描文件，分析代码
  async _scanCode(scanSource, type) {
    let entrys = await this._scanFiles(scanSource, type)
    entrys.forEach((item) => {
      const parseFiles = item.parseEntry
      if (parseFiles.length > 0) {
        parseFiles.forEach((element, eIndex) => {
          try {
            if (type === CODEFILETYPE.VUE) {
              const { ast, typeChecker, templateAST } = parseVue(element)
              this._dealAST({
                ast,
                typeChecker,
                filePath: item.relativeFilePath[eIndex]
              })
            }
          } catch (error) {
            console.log('error', error)
          }
          processLog.stdout(chalk.green(`\n${item.name} ${type}分析进度: ${eIndex + 1}/${parseFiles.length}`))
        })
      }
    })
  }

  // 扫描文件
  async _scanFiles(scanSource, type) {
    let entrys = []
    for (let i = 0; i < scanSource.length; i++) {
      const item = scanSource[i]
      const entryObj = {
        name: item.name,
        httpRepo: item.httpRepo
      }
      // 解析文件的实体类
      let parseEntry = []
      // 解析文件的相对路径
      let relativeFilePath = []
      if (item.type === 'gitlab-merge') {
        const extra = scanSource[i].extra
        if (extra?.projectId && extra?.mergeRequestId) {
          const result = await getMergeRequestFiles(extra.projectId, extra.mergeRequestId)
          result.forEach((resultItem) => {
            parseEntry.push(path.join(process.cwd(), `./${item.name}/` + resultItem))
            relativeFilePath.push(resultItem)
          })
          entryObj.parseEntry = parseEntry
          entryObj.relativeFilePath = relativeFilePath
          // 这里应该要做文件过滤
          entrys.push(entryObj)
        }
      } else {
        entryObj.path = item.path
        const scanPath = item.path;
        scanPath.forEach((sitem) => {
          let tempEntry = [];
          if (type === CODEFILETYPE.VUE) {
            tempEntry = scanFileVue(sitem)
          }
          let tempPath = tempEntry.map((titem) => {
            return titem.substring(titem.indexOf(sitem))
          })
          // TODO 待补充JS
          // 收集需要转化的文件路径
          parseEntry = parseEntry.concat(tempEntry)
          relativeFilePath = relativeFilePath.concat(tempPath)
        })
        entryObj.parseEntry = parseEntry
        entryObj.relativeFilePath = relativeFilePath
        entrys.push(entryObj)
      }
    }
    return entrys
  }

  // AST分析
  _dealAST({ ast, typeChecker, filePath }) {
    if (ast) {
      // const walk = (node) => {
      //   const nodeParams = {
      //     node,
      //     tsCompiler,
      //     typeChecker,
      //     filePath
      //   }
      //   this._runAnalysisPlugins(nodeParams)
      //   // 深层次遍历AST节点
      //   tsCompiler.forEachChild(node, walk)
      // }
      // walk(ast)
      const nodeParams = {
        node: ast,
        tsCompiler,
        typeChecker,
        filePath
      }
      this._runAnalysisPlugins(nodeParams)
    }
  }

  // 执行Target分析插件队列中的checkFun函数
  _runAnalysisPlugins(nodeConfig) {
    if (this.pluginsQueue.length > 0) {
      for (let i = 0; i < this.pluginsQueue.length; i++) {
        const checkFun = this.pluginsQueue[i].checkFun;
        if (checkFun(nodeConfig)) {
          break
        }
      }
    }
  }

  // 链式调用检查，找出链路顶点node
  _checkPropertyAccess(node, index = 0, apiName = '') {
    if (index > 0) {
      apiName = apiName + '.' + node.name.escapedText;
    } else {
      apiName = apiName + node.escapedText;
    }
    if (tsCompiler.isPropertyAccessExpression(node.parent)) {
      index++;
      return this._checkPropertyAccess(node.parent, index, apiName);
    } else {
      return {
        baseNode: node,
        depth: index,
        apiName: apiName
      }
    }
  }
}

module.exports = CodeAnalysis
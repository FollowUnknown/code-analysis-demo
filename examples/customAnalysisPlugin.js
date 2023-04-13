/**
 * TODO
 * - 允许设置注释无需检查下一行
 * @param {*} analysisContext
 * @returns
 */
exports.customAnalysisPlugin = function (analysisContext) {
  const mapName = 'qiqiaoCodeScan'
  // 在分析实例上下文挂载副作用
  analysisContext[mapName] = {}
  analysisContext[mapName].callFiles = {}
  const scanLogs = analysisContext[mapName].callFiles
  function checkFun ({ node, tsCompiler, typeChecker, filePath = '未知文件' }) {
    const rootNode = node
    try {






      // let definedDataProperties = []
      // const dataNode = node?.body[0]?.returnStatement
      // if (dataNode?.type === 'ObjectExpression') {
      //   definedDataProperties = dataNode.properties.map(prop => prop.key.name)
      // }
      // console.log('definedDataProperties===', definedDataProperties)
      const dataProperties = []
      const walk = (node) => {
        if (!scanLogs[filePath]) {
          scanLogs[filePath] = {
            filePath,
            logs: []
          }
        }

        // 获取data中定义的变量
        // if (
        //   tsCompiler.isMethodDeclaration(node) &&
        //   tsCompiler.isIdentifier(node) &&
        //   node.name.text === 'data' &&
        //   tsCompiler.isObjectLiteralExpression(node.initializer)
        // ) {
        //   node.initializer.properties.forEach((property) => {
        //     if (tsCompiler.isIdentifier(property.name)) {
        //       dataProperties.push(property.name.text);
        //     }
        //   })
        // }

        // 公共检查
        // GPT 如何typescript的类型检查器TypeChecker来判断代码中是否存在没有声明的变量 要注意字符串常量 并附带错误代码
        // 待优化
        // typescript AST 如何检测vue文件中data定义的变量没有在template和script上使用
        // if (tsCompiler.isIdentifier(node)) {
        //   const symbol = typeChecker.getSymbolAtLocation(node)
        //   if (!symbol) {
        //     const name = node.text
        //     console.log()
        //     scanLogs[filePath].logs.push({
        //       // TODO 转化为常量
        //       level: 0,
        //       message: `Error: '${name}' is not declared.`
        //     })
        //     return true
        //   }
        // }

        // 业务检查
        // GPT 如何typescript createProgram ast的形式来判断 localStorage.setItem入参数必须是调用getStorageKey() 转换成出来的 注意ast遍历方式使用forEachChild
        // 判断是否为函数调用表达式
        if (tsCompiler.isCallExpression(node)) {
          const callee = node.expression
          if (tsCompiler.isPropertyAccessExpression(callee) && callee.name.text === 'setItem' &&
            tsCompiler.isIdentifier(callee.expression) && callee.expression.text === 'localStorage') {
            const arg0 = node.arguments[0]
            if (!tsCompiler.isCallExpression(arg0) || arg0.expression.getText() !== 'getStorageKey') {
              scanLogs[filePath].logs.push({
                // TODO 转化为常量
                level: 0,
                message: 'Error: localStorage.setItem() first argument must be a call to getStorageKey()'
              })
              return true
            }
          }
        }

        // // 冲突检查

        // // 递归复杂度检查

        // // this变量调用层级检查
        // if (tsCompiler.isPropertyAccessExpression(node)) {
        //   let count = 1
        //   let expression = node.getText()
        //   while (tsCompiler.isPropertyAccessExpression(node.expression)) {
        //     node = node.expression
        //     count++
        //   }
        //   if (count > 5) {
        //     scanLogs[filePath].logs.push({
        //       // TODO 转化为常量
        //       level: 0,
        //       message:
        //         'Error: this.variable has more than 5 levels of function call' +
        //         '  【Code】：' + expression + ''
        //     })
        //   }
        //   return count > 3 // 判断层级是否超过 3 级
        // }

        // // 变量命名检查
        // // GPT 如何typescript createProgram ast的形式来判断 变量命名规范检查 注意ast遍历方式使用forEachChild
        // // if (tsCompiler.isVariableDeclaration(node)) {
        // //   const variableName = node.name.getText()
        // //   const nameRegex = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/
        // //   if (!nameRegex.test(variableName)) {
        // //     scanLogs[filePath].logs.push({
        // //       // TODO 转化为常量
        // //       level: 0,
        // //       message: `Variable "${variableName}" does not follow naming convention.`
        // //     })
        // //     return true
        // //   }
        // // }

        // // Vue文件要补充对应name字段【1】

        // // 引用资源路径是否跨模块调用

        // // 变量length的判断，如果定义是数组类型，前面需要追加Array.isArray()

        // 对应业务工程检查-console
        // if (tsCompiler.isTemplateHead(node)) {
        //   const text = node.getText()
        //   if (text.indexOf('当前应用表单数量已达到上限') !== -1) {
        //     scanLogs[filePath].logs.push({
        //       // TODO 转化为常量
        //       level: 'low',
        //       message:
        //         'Error: 业务中多次调用，请将此逻辑抽离成公共方法' +
        //         '  【Code】：' + text + ''
        //     })
        //   }
        // }

        // 对应业务工程检查-runtime

        // 对应业务工程检查-mruntime

        // TODO 在data / props 中定义，但是在代码+模版上均无使用的检测
        // 深层次遍历AST节点
        tsCompiler.forEachChild(node, walk)
      }
      walk(rootNode)
      console.log('dataProperties', dataProperties)
      return false
    } catch (error) {
      console.log('customAnalysisPlugin', error)
    }
  }

  // 返回分析Node节点的函数
  return {
    mapName: mapName,
    checkFun,
    afterHook: null
  }
}

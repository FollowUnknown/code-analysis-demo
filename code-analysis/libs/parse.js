
const { compileTemplate, CompilerError, CompilerOptions } =  require('@vue/compiler-dom')
const path = require('path')
const { getCode, writeTsFile } = require(path.join(__dirname, './file'))
const { VUETEMPTSDIR } = require(path.join(__dirname, './constant'))
const md5 = require('js-md5')
const vueCompiler = require('@vue/compiler-dom')
const tsCompiler = require('typescript')
const vm = require('vm')
const { parseComponent }  = require('vue-template-compiler')
// 解析vue文件中的ts script片段，解析获取ast，checker
exports.parseVue = function (fileName) {
  // 获取vue代码
  const vueCode = getCode(fileName)

  // 解析vue代码
  const result = vueCompiler.parse(vueCode)
  const children = result.children
  // 获取script片段
  let scriptCode = ''
  let scriptAST = ''
  let scriptTypeChecker
  // 获取模版片段
  let templateCode = ''
  let templateAST = ''
  const scriptVariables = {}
  children.forEach(element => {
    if (element.tag == 'template') {
      // ? templateContent += node.children.map(n => n.content).join('');
      templateCode = element.loc.source
    } else if (element.tag == 'script') {
      scriptCode = element.children[0].content
    }
  })
  // ======开始解析script AST======
  if (scriptCode) {
    // 将js/ts代码抽离写入到临时目录的文件中，统一先转ts
    const ts_hash_name = md5(fileName)
    // 将ts片段写入临时目录下的ts文件中【vue3.0 +ts版本需要用到】
    writeTsFile(scriptCode, `${VUETEMPTSDIR}/${ts_hash_name}`)
    const vue_temp_ts_name = path.join(process.cwd(), `${VUETEMPTSDIR}/${ts_hash_name}.ts`);
    // 将ts代码转化为AST
    const program = tsCompiler.createProgram([vue_temp_ts_name], {})
    scriptAST = program.getSourceFile(vue_temp_ts_name);
    scriptTypeChecker = program.getTypeChecker()
  }
  // ======结束解析script AST======

  // ======开始解析templateCode AST======
  if (templateCode) {
    templateAST = vueCompiler.parse(templateCode)
  }
  // ======结束解析templateCode AST======
  return {
    scriptCode,
    scriptAST,
    scriptTypeChecker,
    templateCode,
    templateAST
  }
}
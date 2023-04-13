const analysis = require('../code-analysis/libs')
const { customAnalysisPlugin } = require('./customAnalysisPlugin')
// 报告模块
const { writeReport } = require('../code-analysis/libs/report')

// 默认分支常量
// const DefaultBranch = 'master'
// 获取当前分支
// function getGitBranch () {
//   try {
//     const branchName = execSync('git symbolic-ref --short -q HEAD', {
//       encoding: 'utf8'
//     }).trim()
//     return branchName
//   } catch (e) {
//     return DefaultBranch
//   }
// }

async function scan () {
  try {
    const config = {
      // 必须，待扫描源码的配置信息
      scanSource: [
        // {
        //   // 必填，项目名称
        //   name: 'console',
        //   // 默认读取工程Path
        //   // gitlab- merge 直接返回对应的文件列表, 在本地处理
        //   type: 'gitlab-merge',
        //   // 可选，package.json 文件路径配置，用于收集依赖的版本信息
        //   packageFile: 'package.json',
        //   extra: {
        //     // 对应类型必填
        //     projectId: '858',
        //     mergeRequestId: '8076'
        //   }
        //   // 可选，项目gitlab/github url的访问前缀，用于点击行信息跳转，不填则不跳转
        //   // httpRepo: `hhttps://github.com/FollowUnknown/code-analysis-demo/blob/${getGitBranch()}/`
        // },
        {
          // 默认读取工程Path
          // 必填，项目名称
          name: 'runtime-web',
          // 必填，需要扫描的文件路径（基准路径为配置文件所在路径）
          path: ['runtime/src'],
          // 可选，package.json 文件路径配置，用于收集依赖的版本信息
          packageFile: 'package.json',
          extra: {
          }
          // 可选，项目gitlab/github url的访问前缀，用于点击行信息跳转，不填则不跳转
          // httpRepo: `hhttps://github.com/FollowUnknown/code-analysis-demo/blob/${getGitBranch()}/`
        }
      ],
      analysisPlugins: [customAnalysisPlugin]
    }
    const { report } = await analysis(config)
    // 输出分析报告
    // writeReport('analysisReport', report)
    // TODO 输出诊断报告
  } catch (error) {
    console.log(error)
  }
}

scan()

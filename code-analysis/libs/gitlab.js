const axios = require('axios');
const path = require('path')
// GitLab相关信息
const gitlabUrl = 'https://git.qiweioa.cn/api/v4';

// GitLab API访问令牌
const apiToken = 'WFZ-EE3mQxPJ5gAyjD3w';

exports.getMergeRequestFiles = async function (projectId, mergeRequestId) {
  const url = `${gitlabUrl}/projects/${projectId}/merge_requests/${mergeRequestId}/changes`;
  const headers = { 'PRIVATE-TOKEN': apiToken };
  try {
    const response = await axios.get(url, { headers: headers })
    const result = response.data.changes.map((change) => {
      return change.new_path
    })
    return result
  } catch (error) {
    console.error(error)
    return []
  }
}
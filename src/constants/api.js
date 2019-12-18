/**
 * NOTE: HOST,HOST_M 是在 config 中通过 defineConstants 配置的.
 * 只所以不在代码中直接引用,是因为 eslint 会报 no-undef 的错误,因此用如下方式处理.
 */
/* eslint-disable */
export const host = HOST
export const hostM = HOST_M
/* eslint-enable */

// document
export const documentsAPI = `${host}/api/documents`;
export const documentAPI = `${host}/api/documents/`;

// project
export const projectsAPI = `${host}/api/projects`;

// segmentation
export const segmentationsAPI = `${host}/api/segmentations`;

// tool
export const toolsAPI = `${host}/api/tools/`;
export const projectsToolsAPI = `${host}/api/projects`;

// user info
export const code2sessionAPI = `${host}/api/code2session`;
export const userInfoAPI = `${host}/api/userInfo`;

// update user info
export const updateUserInfoAPI = `${host}/api/updateUserInfo`;

// task
export const tasksAPI = `${host}/api/tasks`;

// admin
export const adminURL = `${host}/admin/`;

// timesheet
export const timesheetAPI = `${host}/api/timesheets`;

// team
export const teamsAPI = `${host}/api/teams`;

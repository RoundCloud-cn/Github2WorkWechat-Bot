'use strict';

const HEADER_KEY = "x-github-event";

const actionWords = {
    "opened": "发起",
    "closed": "关闭",
    "reopened": "重新发起",
    "edited": "更新",
    "merge": "合并",
    "created": "创建",
    "requested": "请求",
    "completed": "完成",
    "synchronize": "同步更新",
    "created": "创建",
    "deleted": "删除",
    "renamed": "重命名",
    "added": "加入",
    "removed": "退出",
    "edited": "修改",
    "reopened": "重开",
    "published": "发布",
    "unpublished": "删除",
    "prereleased": "预发布",
};

const querystring = require('querystring');
const ChatRobot = require('./chat');
/**
 * 处理ping事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handlePing(body, robotid) {
    const robot = new ChatRobot(
        robotid
        );
        
    const { repository } = body;
    const msg = "成功收到了来自Github的Ping请求，项目名称：" + repository.name;
    await robot.sendTextMsg(msg);
    return msg;
}

/**
 * 处理push事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handlePush(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    let msg;
    const { pusher, repository, commits, ref} = body;
    const user_name = pusher.name;
    const lastCommit = commits[0];
    msg = `项目 ${repository.name} 收到了一次push，提交者：${user_name}，最新提交信息：${lastCommit.message}`;
    const mdMsg = `项目 [${repository.name}](${repository.url}) 收到一次push提交
        提交者:  \<font color= \"commit\"\>${user_name}\</font\>
        分支:  \<font color= \"commit\"\>${ref}\</font\>
        最新提交信息: ${lastCommit.message}`;
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 处理merge request事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handlePR(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    const {action, sender, pull_request, repository} = body;
    const mdMsg = `${sender.login}在 [${repository.full_name}](${repository.html_url}) ${actionWords[action]}了PR
        标题：${pull_request.title}
        源分支：${pull_request.head.ref}
        目标分支：${pull_request.base.ref}
        [查看PR详情](${pull_request.html_url})`;
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 处理issue 事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleIssue(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    const { action, issue, repository } = body;
    if (action !== "opened") {
        return `除非有人开启新的issue，否则无需通知机器人`;
    }
    const mdMsg = `有人在 [${repository.name}](${repository.html_url}) ${actionWords[action]}了一个issue
        标题：${issue.title}
        发起人：[${issue.user.login}](${issue.user.html_url})
        [查看详情](${issue.html_url})`;
    await robot.sendMdMsg(mdMsg);
    return;
}

/**
 * 处理Release 事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleRelease(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    const { action, release, repository, sender } = body;
    if(action === "published" || action === "unpublished" || action === "created" || action === "deleted" || action === "created")
    const mdMsg = `${sender.login} 在 [${repository.name}](${repository.html_url}) ${actionWords[action]}了一个Release
        标题：${release.name}
        版本：${release.tag_name}
        发布者：${sender.login}
        [查看详情](${release.html_url})`;
    await robot.sendMdMsg(mdMsg);
    return;
}

/**
 * 处理仓库事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleRepository(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    let msg;
    const { action, repository, sender } = body;
    if (action !== "created" || action !== "deleted" || action !== "renamed") {
        return `除非有人开启、删除、重命名仓库，否则无需通知机器人`;
    }
    const mdMsg = `${sender.login} ${actionWords[action]} 了一个仓库
        仓库名：${repository.name}
        发起人：[${sender.login}](${sender.html_url})
        [查看详情](${repository.html_url})`;
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 处理人员事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleMember(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    let msg;
    const { action, member } = body;
    const mdMsg = `${member.login} ${actionWords[action]} 了圆云科技Github组织
        ![avatar](${member.avatar_url})
        事件成员：[${member.login}](${member.html_url})`
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 处理团队事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleTeam(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    let msg;
    const { action, team, sender } = body;
    const mdMsg = `${sender.login} ${actionWords[action]} 了一个团队
        团队：[${team.name}](${team.html_url})
        描述：${team.description}
        操作员：[${sender.login}](${sender.html_url})`
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 处理项目版事件
 * @param ctx koa context
 * @param robotid 机器人id
 */
async function handleBoard(body, robotid) {
    const robot = new ChatRobot(
        robotid
    );
    let msg;
    const { action, project, sender } = body;
    const mdMsg = `${ sender.login } ${ actionWords[action] } 了项目版${ project.name }
        看板：[${ project.name }](${ project.html_url })
        描述：${ project.body }
        操作员：[${ sender.login }](${ sender.html_url })
        [查看详情](${ project.html_url })`
    await robot.sendMdMsg(mdMsg);
    return mdMsg;
}

/**
 * 对于未处理的事件，统一走这里
 * @param ctx koa context
 * @param event 事件名
 */
function handleDefault(body, event) {
    return `Sorry，暂时还没有处理${event}事件`;
}

exports.main_handler = async (event, context, callback) => {
    console.log('event: ', event);
    if (!(event.headers && event.headers[HEADER_KEY])) {
        return 'Not a github webhook deliver'
    }
    const gitEvent = event.headers[HEADER_KEY]
    const robotid = event.queryString.id
    const query = querystring.parse(event.body);
    // console.log('query: ', query);
    const payload = JSON.parse(query.payload);
    console.log('payload: ', payload);    
    console.log('robotid: ', robotid);
    switch (gitEvent) {
        case "repository":
            return await handleRepository(payload, robotid);
        case "push":
            return await handlePush(payload, robotid);
        case "pull_request":
            return await handlePR(payload, robotid);
        case "ping":
            return await handlePing(payload, robotid);
        case "issues":
            return await handleIssue(payload, robotid);
        case "member":
            return await handleMember(payload, robotid);
        case "team":
            return await handleTeam(payload, robotid);
        case "release":
            return await handleRelease(payload, robotid);
        case "project":
            return await handleBoard(payload, robotid);
        default:
            return handleDefault(payload, gitEvent);
    }
};
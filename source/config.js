import {lib,game,ui,get,ai,_status} from '../../../noname.js'
export const config = {
	"gezidedongfanglili": {
		"name": "启用灵力值",
		"init": true,
		"intro": "开启后，炉石模式外，游戏开始时获得3点灵力，每个回合开始阶段获得1点灵力，同时启用卡牌强化。",
		"unfrequent": true
	},
	"gezidedongfangliliguozhan": {
		"name": "国战灵力",
		"init": true,
		"intro": "关闭后，国战模式将不适用灵力且没有灵力卡牌。",
		"unfrequent": true,
	},
	"gezidedongfangkapai": {
		"name": "灵力卡牌",
		"init": true,
		"intro": "开启后，一回合一次，消耗一点灵力（灵力未定义则不消耗）随机获得一张本拓展卡牌（不触发技能）（不包括异变牌，技能牌，专属牌和部分卡牌）",
		"unfrequent": true
	},
	"gezidedongfangkapaionly": {
		"name": "专属灵力卡牌",
		"init": false,
		"intro": "开启后，仅东方project扩展内角色能使用灵力卡牌（需先开启灵力卡牌）。",
		"unfrequent": true,
	},
	"gezimusicchange": {
		"name": "异变牌发动时更换BGM",
		"init": "off",
		"item": {
			"heimu": "仅限主公",
			"luren": "主公或内奸",
			"off": "不更换"
		},
		"unfrequent": true
	},
	"gezibackgroundchange": {
		"name": "异变牌发动时更换背景",
		"init": "off",
		"item": {
			"heimu": "仅限主公",
			"luren": "主公或内奸",
			"off": "不更换"
		},
		"unfrequent": true
	},
	"mingzhiBool": {
		"name": "卡牌明置",
		"init": false,
		"intro": "开启后可以选用骚灵三姐妹的明置形态（ai默认选明置）以及初音。相关函数出现错误后关闭此选项然后重启即可。为了实现卡牌明置效果，修改了以下函数：<br>choosePlayerCard,<br>discardPlayerCard，<br>gainPlayerCard，<br>lose。",
		"unfrequent": true
	},
	"yibianmoshi": {
		"name": "异变模式",
		"init": true,
		"intro": "为身份模式添加额外的设定。<br>1.异变牌提供了额外的胜利条件。<br>2.游戏开始时，若主公身份已知，其获得一张异变牌。所有身份未知的角色出牌阶段可以明置身份。<br>明置身份效果：<br><span>主:明置一张异变牌；<br>内:暗置一张异变牌；<br>反:令一名角色选择，被你弃一张或明置身份（可以发动异变效果）；<br>忠:令一名角色摸一张牌。</span><br>",
		"unfrequent": true
	},
	"incidentoverbool": {
		"name": "开启异变牌胜利条件",
		"init": true,
		"intro": "关闭后，异变牌胜利条件将会无效。",
		"unfrequent": true
	},
	"nei_end": {
		"name": "内异变胜利游戏不结束",
		"init": false,
		"intro": "开启后，异变模式下，内奸因异变胜利后，游戏不结束"
	},
	"incidentbool": {
		"name": "开启异变牌异变效果",
		"init": true,
		"intro": "关闭后，禁用异变牌的异变效果"
	},
	"dongfangtexiao": {
		"name": "开启特效",
		"init": false,
		"intro": "在非流畅模式与启用游戏特效时可以开启动画效果。包括：冈格尼尔，楼观剑，月时针，神佑，圣盾，潜行，制衡，魔导书，阴阳玉，【荧光】，异变模式展示身份。"
	},
	"damagelili": {
		"name": "灵力虚弱期",
		"intro": "没有灵力时（不包括未定义灵力）无法造成伤害",
		"init": false
	},
	"stonetrans": {
		"name": "魔改炉石图片改文字",
		"intro": "魔改炉石模式，图片显示改为文字显示。",
		"init": false
	}
}

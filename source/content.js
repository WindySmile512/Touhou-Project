import {lib,game,ui,get,ai,_status} from '../../../noname.js'

export async function content(config,pack){
	/*-----------------------------------------明置-----------------------------------------*/
	//明置标签，所有明置行为都应该使用addShownCards(cards,visible_mingzhi);
	lib.translate.visible_mingzhi="明置";
	//卡牌明置
	lib.translate.visible_dahezou_skill1 = '明置';
	lib.translate.visible_gezi_reshenxuan = '神弦明置';
	lib.translate.visible_gezi_rezhenhun = '镇魂明置';
	lib.translate.visible_gezi_remingguan = '冥管明置';
	lib.translate.visible_gezi_remingjian = '冥键明置';
	lib.translate.visible_gezi_stage = '歌姬明置';
	lib.translate.visible_gezi_geying = '歌莺明置';
	lib.translate.visible_diva = '美九明置';
	lib.translate.visible_gezi_qingqu = '轻曲明置';


	/*-----------------------------------------符卡-----------------------------------------*/
	//	回合开始显示
	lib.skill._liliphasebegin = {
		trigger: { player: 'phaseBegin' },
		forced: true,
		// 一定要在符卡启动前使用
		priority: 200,
		popup: false,
		content: function () {
			// 回合开始时如果有不是极意的符卡就翻回去。
			if (player.node.fuka) {
				if (player.storage.spell) {
					var info = lib.skill[player.storage.spell];
					if (info.spell) {
						if (!info.infinite) player.Fuka();
					}
				}
			}
			player.stat.push({ card: {}, skill: {} });
		},
	}
	//	回合结束显示
	lib.skill._liliphaseend = {
		trigger: { player: 'phaseAfter' },
		forced: true,
		priority: -20,
		popup: false,
		content: function () {
			// 结束阶段，如果有角色是符卡状态的，取消。
			var players = game.filterPlayer();
			for (var j = 0; j < players.length; j++) {
				if (players[j].node.fuka && players[j].storage.spell) {
					var skillname = players[j].storage.spell;
					var info = lib.skill[skillname];
					if (info.spell) {
						if (!info.roundi && !info.infinite) {
							players[j].Fuka();
						}
					}
				}
			}
		},
	}
	//	灵力值变为0时，符卡结束
	lib.skill._0lili = {
		trigger: { player: 'changelili' },
		forced: true,
		priority: 20,
		popup: false,
		filter: function (event, player) {
			return player.node.fuka && player.lili < 1;
		},
		content: function () {
			if (player.storage.spell) {
				game.log(get.translation(player) + '的灵力值变为0，符卡结束。');
				player.Fuka();
			}
		},
	}
	//	符卡结束翻面回来，取除所有符卡技能。
	lib.skill._spellend = {
		trigger: { player: 'FukaEnd' },
		forced: true,
		popup: false,
		filter: function (event, player) {
			return true;
		},
		content: function () {
			if (player.node.fuka) {
				var skillname = null;
				var r = trigger.getParent();
				while (r) {
					if (!r.skill || !lib.skill[r.skill].spell) {
					} else {
						skillname = r.skill;
						break;
					}
					if (r.parent) r = r.getParent();
					else break;
				}
				if (!skillname) {
					event.finish();
					trigger.cancel();
				} else {
					var info = lib.skill[skillname];
					if (info.spell) {
						for (var i = 0; i < info.spell.length; i++) {
							player.addSkill(info.spell[i]);
							player.$skill(get.translation(info.spell[i]), null, null, true);
						}
						player.removeSkillTrigger(skillname);
					}
					player.storage.spell = skillname;
				}
			} else {
				if (player.storage.spell) {
					var info = lib.skill[player.storage.spell];
					if (info.spell) {
						game.log(player, '的【' + get.translation(player.storage.spell) + '】符卡结束。');
						for (var i = 0; i < info.spell.length; i++) {
							player.removeSkill(info.spell[i]);
						}
						player.addSkillTrigger(player.storage.spell);
						if (info.infinite) {
							player.die();
						}
					}

					delete player.storage.spell;
				}
			}
		},
	}
	//	符卡
	lib.element.content.Fuka = function () {
		event.trigger('Fuka');
		if (!player.node.fuka) {
			player.node.fuka = ui.create.div('.fuka', '<div>符<br>卡<div>', player);
			if (lib.config.background_audio) {
				game.playlili('spell');
			}
			player.node.fuka.setBackgroundImage('extension/东方project/spell.gif');
			game.log(player, '启动符卡！');
			player.node.fuka.style.backgroundSize = '123px 123px';
			player.node.fuka.style.opacity = 0.2;
			player.node.fuka.style.backgroundRepeat = 'no-repeat';
			player.node.fuka.style.transform = 'scale(1.5)';
			player.node.fuka.style.backgroundPosition = "center"
			ui.refresh(player);
		} else {
			player.node.fuka.setBackgroundImage('');
			player.node.fuka.style.opacity = 0;
			game.log(player, '关闭符卡！');
			delete player.node.fuka;
		}
	}
	lib.element.player.Fuka = function () {
		var next = game.createEvent('Fuka');
		next.player = this;
		next.setContent('Fuka');
		return next;
	}
	//检测有没有人封禁了符卡
	lib.element.player.canUseFuka = function (bool) {
		return !game.players.some(i => i.hasSkillTag("noFuka"));
	}


	/*-----------------------------------------灵力-----------------------------------------*/
	//更新灵力
	lib.element.player.updatelili = function () {
		if (!this.node.lili) return;
		if (this.node.lili.hide()) {
			this.node.lili.show();
		}
		if (_status.video && arguments.length == 0) return;
		if (this.lili >= this.maxlili) this.lili = this.maxlili;
		var lili = this.node.lili;
		lili.style.transition = 'none';
		if (this.maxlili == Infinity) {
			lili.innerHTML = '<div></div>' + '<span style="display:inline-block; transform: rotate(90deg);">' + this.lili + '/</span>' + '<span style="display:inline-block; transform: rotate(90deg);">∞</span>';
			lili.classList.add('textstyle');
			//lili.innerHTML = this.lili + '/' +'∞';
			//lili.classList.add('text');
		}
		else if ((game.layout == 'default' && this.maxlili > 14) || get.mode() == 'stone') {
			lili.innerHTML = '<li>灵：' + this.lili + '/' + this.maxlili + '</li>';
			lili.classList.add('text');
		}
		else if (get.is.newLayout() &&
			(
				this.maxlili > 9 ||
				(this.maxlili > 5 && this.classList.contains('minskin')) ||
				((game.layout == 'mobile' || game.layout == 'long') && this.dataset.position == 0 && this.maxlili > 7)
			)) {
			lili.innerHTML = this.lili + '<br>/<br>' + this.maxlili + '<div></div>';
			if (this.lili == 0) {
				lili.lastChild.classList.add('lost');
			}
			lili.classList.add('textstyle');
		}
		else {
			lili.innerHTML = '';
			lili.classList.remove('text');
			lili.classList.remove('textstyle');
			while (this.maxlili > lili.childNodes.length) {
				ui.create.div(lili);
			}
			while (this.maxlili < lili.childNodes.length) {
				lili.removeChild(lili.lastChild);
			}
			for (var i = 0; i < this.maxlili; i++) {
				var index = i;
				if (get.is.newLayout()) {
					index = this.maxlili - i - 1;
				}
				if (i < this.lili) {
					lili.childNodes[index].classList.remove('lost');
				}
				else {
					lili.childNodes[index].classList.add('lost');
				}
			}
		}
		setTimeout(function () {
			lili.style.transition = '';
		});
		return this;
	}
	//获得灵力
	lib.element.content.gainlili = function () {
		if (!player.node.lili) return;
		if (player.maxlili == player.lili) return;
		if (player.node.fuka) {
			game.log(player, '处于符卡状态下无法获得灵力！');
			return;
		}
		//if (lib.config.background_audio) {
		//    game.playlili('gainlili');
		//}
		if (num > player.maxlili - player.lili) num = player.maxlili - player.lili;
		if (num > 0) {
			player.$effectn('gainlili', 4);
			player.changelili(num, false);
			player.$damagepop(num, 'pink');
			game.log(player, '获得了' + get.cnNumber(num) + '点灵力');
		}
	}
	lib.element.player.gainlili = function () {
		var next = game.createEvent('gainlili');
		next.player = this;
		var nocard, nosource;
		var event = _status.event;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == 'cards') {
				next.cards = arguments[i];
			}
			else if (get.itemtype(arguments[i]) == 'card') {
				next.card = arguments[i];
			}
			else if (get.itemtype(arguments[i]) == 'player') {
				next.source = arguments[i];
			}
			else if (typeof arguments[i] == 'object' && arguments[i].name) {
				next.card = arguments[i];
			}
			else if (typeof arguments[i] == 'number') {
				next.num = arguments[i];
			}
			else if (arguments[i] == 'nocard') {
				nocard = true;
			}
			else if (arguments[i] == 'nosource') {
				nosource = true;
			}
		}
		if (next.card == undefined && !nocard) next.card = event.card;
		if (next.cards == undefined && !nocard) next.cards = event.cards;
		if (next.source == undefined && !nosource) next.source = event.player;
		if (next.num == undefined) next.num = 1;
		if (next.num <= 0) _status.event.next.remove(next);
		next.setContent('gainlili');
		return next;
	}
	//失去灵力
	lib.element.content.loselili = function () {
		if (!player.node.lili) return;
		if (player.lili <= 0) return;
		if (num > player.lili) num = player.lili;
		//if (lib.config.background_audio) {
		//    game.playlili('loselili');
		//}
		if (event.source && event.source != player) {
			game.log(event.source, '令' + get.translation(player) + '流失了' + get.cnNumber(num) + '点灵力')
		} else {
			game.log(player, '消耗了' + get.cnNumber(num) + '点灵力')
		}
		player.changelili(-num);
	}
	lib.element.player.loselili = function () {
		var next = game.createEvent('loselili');
		next.player = this;
		var nocard, nosource;
		var event = _status.event;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == 'cards') {
				next.cards = arguments[i];
			}
			else if (get.itemtype(arguments[i]) == 'card') {
				next.card = arguments[i];
			}
			else if (get.itemtype(arguments[i]) == 'player') {
				next.source = arguments[i];
			}
			else if (typeof arguments[i] == 'object' && arguments[i].name) {
				next.card = arguments[i];
			}
			else if (typeof arguments[i] == 'number') {
				next.num = arguments[i];
			}
			else if (arguments[i] == 'nocard') {
				nocard = true;
			}
			else if (arguments[i] == 'nosource') {
				nosource = true;
			}
		}
		if (next.card == undefined && !nocard) next.card = event.card;
		if (next.cards == undefined && !nocard) next.cards = event.cards;
		if (next.source == undefined && !nosource) next.source = event.player;
		if (next.num == undefined) next.num = 1;
		if (next.num <= 0) _status.event.next.remove(next);
		next.setContent('loselili');
		return next;
	}
	//获取当前灵力值（主要是凛）
	lib.element.player.getLili = function () {
		const player = this;
		let num = 0;
		num = game.checkMod(player, num, 'liliExtend', player);
		return (this.lili + num);
	}
	//增加灵力上限
	lib.element.content.gainMaxlili = function () {
		if (!player.node.lili) return;
		if (num > 0) {
			game.log(player, '增加了' + get.cnNumber(num) + '点灵力上限');
		}
		if (num < 0) {
			game.log(player, '减少了' + get.cnNumber(num) + '点灵力上限');
		}
		player.maxlili += num;
		player.updatelili();
	}
	lib.element.player.gainMaxlili = function () {
		var next = game.createEvent('gainMaxlili');
		next.player = this;
		next.num = 1;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === 'number') {
				next.num = arguments[i];
			}
			else if (typeof arguments[i] === 'boolean') {
				next.forced = arguments[i];
			}
		}
		next.setContent('gainMaxlili');
		return next;
	}
	//改变灵力
	lib.element.content.changelili = function () {
		event.trigger('changelili');    // 触发事件的地方
		if (!player.node.lili) return;
		player.lili += num;
		if (player.lili > player.maxlili) player.lili = player.maxlili;
		if (player.lili < 0) player.lili = 0;
		player.updatelili();
		if (event.popup !== false) {
			player.$damagepop(num, 'water'); // 这里改变的是颜色
		}
	}
	lib.element.player.changelili = function (num, popup) {
		var next = game.createEvent('changelili', false);
		next.num = num;
		if (popup != undefined) next.popup = popup;
		next.player = this;
		next.setContent('changelili');
		return next;
	}
	//场上灵力最大
	lib.element.player.isMaxlili=function(equal){
		return game.players.every(current => {
			if(!current.node.lili||current.isOut()||current==this) return true;
			if(equal) return current.lili>=this.lili;
			else return current.lili>this.lili;
		});
	}
	//场上灵力最小
	lib.element.player.isMinlili=function(equal){
		return game.players.every(current => {
			if(!current.node.lili||current.isOut()||current==this) return true;
			if(equal) return current.lili<=this.lili;
			else return current.lili<this.lili;
		});
	}
	if (config.damagelili) {
		//没有灵力时无法造成伤害
		lib.skill._damagelili = {
			trigger: {
				source: "damageBegin2",
			},
			forced: true,
			silent: true,
			logTarget: "player",
			filter: function (event, player) {
				if (!player.node.lili) return false;
				if (player.lili) return false;
				return event.num > 0;
			},
			content: function () {
				player.popup('灵力虚弱');
				trigger.cancel();
			},
			ai: {
				effect: {
					player: function (card, player, target) {
						if (!player.node.lili) return;
						if (player.lili) return;
						if (get.tag(card, 'damage')) return -1;
					},
				},
			},
		}
	}
	get.lingxuCheck = function (player, num) {
		if (config.damagelili) num = (num + 1);
		if (player.lili < num) return false;
		return true;
	}
	//检测是否能使用灵力
	lib.element.player.canUseLili = function (bool) {
		var skills = this.getSkills();
		if (lib.skill.global && lib.skill.global.length) {
			skills.addArray(lib.skill.global);
		}
		game.expandSkills(skills);
		var tag = "lili";
		for (var i = 0; i < skills.length; i++) {
			var info = lib.skill[skills[i]];
			if (info && info.ai) {
				if (info.ai.skillTagFilter && info.ai[tag] && info.ai.skillTagFilter(this, tag) === false) continue;
				if (typeof info.ai[tag] === 'function' && info.ai[tag](this, this.lili) === false) return false;
				if (typeof info.ai[tag] === 'boolean' && info.ai[tag] === false) return false;
			}
			if (info && info.ai && info.cost && !bool) {
				if (info.ai.skillTagFilter
					&& info.ai[tag]
					&& info.ai.skillTagFilter(this, tag) === false) continue;
				if (!info.ai[tag]) {
					var cost = info.cost;
					if (typeof cost === "number" && this.lili <= cost) return false;
				}
			}
		}//循环
		return true;
	}
	if (lib.config.extension_东方project_gezidedongfanglili && lib.config.extensions.includes("十周年UI") && lib.config['extension_' + "十周年UI" + '_enable']) {
        //全局技能不能通过 mark:true, 显示技能
        //全局技能不能使用init标签
        lib.skill._gezi_showlili = {
            marktext: '灵',
            intro:{
                content:"mark",
            },
            /*
            intro: {
                content: function(storage, player, skill) {
                    return `东方project
			灵力：${player.lili}/${player.maxlili}`;
                },
            },
            */
            trigger: {
                global: "gameStart",
            },
            priority: -2023,
            forced: true,
            content: function() {
                player.setMark("_gezi_showlili",player.lili,false);
                player.markSkill("_gezi_showlili");
                //游戏开始时让标签显示
            },
        }
        lib.translate._gezi_showlili = "灵力";

    }
	if ((config.gezidedongfanglili && get.mode() != 'library' && get.mode() != 'guozhan') || (get.mode() == 'guozhan' && config.gezidedongfangliliguozhan)) {
		lib.skill._gezi_lili = {
			trigger: {
				global: 'gameDrawAfter',
				player: "enterGame",
			},
			silent: true,
			forced: true,
			popup: false,
			content: function () {
				if (!player.node.jinengpai) {
					player.node.jinengpai = ui.create.div('.jinengpai', player);
					player.node.jinengpai.style.zIndex = 90;
				}
				if (get.mode() != 'stone') {
					if (!player.node.lili) {
						player.node.lili = ui.create.div('.dfpjpower', player);
					}
				} else {
					if (!player.node.lili) {
						player.node.lili = ui.create.div('.handcards', player);
					}
				}
				if (player.hiddenSkills.length == 0 && lib.character[player.name][4]) {
					for (var str of lib.character[player.name][4]) {
						if (str.indexOf('dflili') != -1) {
							player.lili = parseInt(str.slice(7));
							break;
						}
					}
				}
				player.node.lili.style.zIndex = 90;
				if (typeof player.lili !== 'number') {
					player.lili = 3;
				}
				if (typeof player.maxlili !== 'number') {
					player.maxlili = 5;
				}
				player.updatelili();
			}
		}
		lib.skill._gezi_lili2 = {
			trigger: {
				player: "phaseBegin",
			},
			silent: true,
			popup: false,
			forced: true,
			priority: 44,
			filter: function (event, player) {
				return player.node.lili;
			},
			content: function () {
				player.gainlili();
			},
		}
		lib.skill._gezi_lili3 = {
			trigger: {
				source: 'fellow',
			},
			silent: true,
			forced: true,
			popup: false,
			filter: function () {
				return get.mode() == 'stone';
			},
			content: function () {
				if (!trigger.source.node.lili) {
					trigger.source.node.lili = ui.create.div('.handcards', player);
				}
				if (typeof trigger.source.lili !== 'number') {
					trigger.source.lili = 3;
				}
				if (typeof trigger.source.maxlili !== 'number') {
					trigger.source.maxlili = 5;
				}
				trigger.source.updatelili();
			}
		}
		lib.translate._gezi_lili = "灵力";
	}
	if ((config.gezidedongfangkapai && get.mode() != 'library' && get.mode() != 'guozhan') || (get.mode() == 'guozhan' && config.gezidedongfangliliguozhan)) {
		lib.skill._gezi_lilikapai = {
			enable: "phaseUse",
			usable: 1,
			cost: 1,
			filter: function (event, player) {
				if (player.hasSkill('gezi_zhicai')) return false;
				if (_status.brawl && _status.brawl.scene) return false;
				if (lib.config.extension_东方project_gezidedongfangkapaionly) {
					var list = [];
					list.addArray(Object.keys(lib.characterPack['TouhouProject']));
					list.addArray(Object.keys(lib.characterPack['library_luanru']));
					list.addArray(Object.keys(lib.characterPack['library']));
					list.addArray(Object.keys(lib.characterPack['mingzhi']));
					return list.includes(player.name) && (player.lili || !player.node.lili);
				}
				return player.lili || !player.node.lili;
			},
			prompt: '一发出货',
			content: function () {
				"step 0"
				if (player.lili) {
					player.loselili();
				}
				"step 1"
				var list = ["gezi_danmakucraze", "gezi_caifang", "gezi_pantsu", "gezi_louguan", "gezi_ibuki", "gezi_deathfan", "gezi_windfan", "gezi_saiqianxiang", "gezi_reidaisai", "gezi_yinyangyu", "gezi_zhiyuu", "gezi_mirror", "gezi_bailou", "gezi_houraiyuzhi", "gezi_hourai", "gezi_frog", "gezi_lunadial", "gezi_hakkero", "gezi_lantern", "gezi_stone", "gezi_simen", "gezi_huanxiang", "gezi_tianguo", "gezi_lingbi", "gezi_zuiye", "gezi_huazhi", "gezi_bingyu", "gezi_jingxia", "gezi_missile", "gezi_bagua", "gezi_book", "stg_bawu"];//删除了魔剑莱瓦丁
				if (player.name1 == 'gezi_flandre' || player.name2 == 'gezi_flandre') list.push('gezi_laevatein');//加上芙兰能抽魔剑阿波菲斯
				if (list.length) {
					player.gain(game.createCard(list.randomGet()), 'gain2')._triggered = null;
				}
			},
			ai: {
				order: 11.2,
				result: {
					player: function (player) {
						if (player.lili <= 1) return -1;
						return 1;
					}
				},
			},
		}
		lib.translate._gezi_lilikapai = "灵力卡牌";
	}
	if ((config.gezidedongfanglili || get.mode() == 'stg') && get.mode() != 'library') {
		ui.css.fuka_style = lib.init.css(lib.assetURL + 'extension/东方project', 'fuka');
		lib.init.css(lib.assetURL + 'extension/东方project', 'official');
		//lib.init.css(lib.assetURL + 'extension/东方project', 'lili');
	}


	/*-----------------------------------------技能牌-----------------------------------------*/
	//拥有技能牌
	lib.element.player.hasJinengpai=function(){
		return this.countJinengpai();
	}
	//获取技能牌（名）数量 入参必须是字符串（就是写检测的卡名，意外的好像没啥大问题）
	lib.element.player.countJinengpai=function(arg1){
		return this.getJinengpai(arg1).length;
	}
	//获取技能牌的信息
	lib.element.player.getJinengpai=function(arg1){
		let cards=Array.from(this.node.jinengpai?.childNodes||[]);
		if(arg1) cards=cards.filter(i => get.name(i)==arg1);
		return cards;
	}
	//添加技能牌
	lib.element.player.addJudgen=function(card){
		var next=game.createEvent('addJudgen');
		next.card=card;
		next.player=this;
		next.setContent('addJudgen');
		return next;
	}
	lib.element.content.addJudgen=function(){
		"step 0"
		if(!player.node.jinengpai) player.node.jinengpai=ui.create.div('.jinengpai',player);
		player.node.jinengpai.insertBefore(card,player.node.jinengpai.firstChild);
		card.classList.add('jinengpai');
		let info=get.info(card);
		player.addnSkill(info.skills||[]);
		player.update();
		game.log(player,"贴上了",card);
		game.addVideo('addJudge',player,[get.cardInfo(card),card.viewAs]);
		"step 1"
		//贞德不要神佑
		if(player.hasSkill('gezi_huiqiong')&&card.name=='gezi_shenyou') player.removeJudgen(card);
		//多了就扔掉
		let num=player.storage.gezi_zhonger||3;
		if(player.countJinengpai()>num) player.chosenPlayerCard('j',"技能牌数量达到上限，请移除一张技能牌",player,true);
		else event.finish();
		"step 2"
		player.removeJudgen(result.links);
	}
	//移除技能牌
	lib.element.player.removeJudgen=function(card){
		var next = game.createEvent('removeJudgen');
		next.card = card;
		next.player = this;
		next.setContent('removeJudgen');
		return next;
	}
	lib.element.content.removeJudgen = function () {
		'step 0'
		var j = player.getJinengpai();
		if (j.includes(card)) {
			player.node.jinengpai.removeChild(card);
			player.$throw(card);
			game.log(player, '移除了', card.name);
			player.update();
			ui.updatej(player);
		}
		'step 1'
		if (!player.countJinengpai(card.name)) {
			var info = get.info(card);
			if (info.skills) {
				for (var i = 0; i < info.skills.length; i++) {
					player.removeSkill(info.skills[i]);
				}
			}
		}
		'step 2'
		if (player.hasSkill('gezi_zhonger')) {
			var name = card.name;
			var next = game.createEvent(name);
			next.setContent(lib.card[name].effect);
			next._result = result;
			next.card = event.card;
			next.player = player;
		}
	}
	//增加技能牌技能
	lib.element.player.addJinengpaiTrigger = function (card) {
		if (card) {
			var info = get.info(card);
			if (info.skills) {
				for (var j = 0; j < info.skills.length; j++) {
					this.addSkillTrigger(info.skills[j]);
				}
			}
		}
		else {
			var n = this.getJinengpai();
			for (var i = 0; i < n.length; i++) {
				this.addJinengpaiTrigger(n[i]);
			}
		}
		return this;
	}
	//移除技能牌技能
	lib.element.player.removeJinengpaiTrigger = function (card) {
		if (card) {
			var info = get.info(card);
			if (info.skills) {
				for (var j = 0; j < info.skills.length; j++) {
					this.removeSkillTrigger(info.skills[j]);
				}
			}
			if (info.clearLose && typeof info.onLose == 'function') {//创建失去牌的事件
				var next = game.createEvent('lose_' + card.name);
				next.setContent(info.onLose);
				next.player = this;
				next.card = card;
			}
		}
		else {
			var n = this.getJinengpai();
			for (var i = 0; i < n.length; i++) {
				this.removeJinengpaiTrigger(n[i]);
			}
		}
		return this;
	}
	game.addJudgen = function (player, content) {
		if (player && content) {
			if (!player.node.jinengpai) {
				player.node.jinengpai = ui.create.div('.jinengpai', player);
			}
			var card = get.infoCard(content[0]);
			card.viewAs = content[1];
			if (card.viewAs && card.viewAs != card.name && (card.classList.contains('fullskin') || card.classList.contains('fullborder'))) {
				card.classList.add('fakejudge');
			}
			card.classList.add('fakejudge');
			player.node.jinengpai.insertBefore(card, player.node.jinengpai.firstChild);
			ui.updatej(player);
		}
		else {
			//console.log(player);
		}
	}


	/*-----------------------------------------异变-----------------------------------------*/
	game.incidentover = function (player, incident) {
		"step 0"
		//异变牌胜利条件失效
		var players = game.filterPlayer();
		for (var i = 0; i < players.length; i++) {
			if (players[i].hasSkill('gezi_mengjing2')) {
				return;
			}
		}
		"step 1"
		//皆杀血流成河模式
		if (game.hasPlayer(target => target.isJiesha())) {
			if (game.players.length != 1) return;
			else if (game.me.isAlive()) {
				game.over(true);
			} else {
				game.over(false);
			}
		}
		// 玩家胜利
		player.$skill(get.translation(incident) + '胜利', null, null, true);
		game.log(get.translation(player) + '【' + get.translation(incident) + '】异变胜利！');
		game.saveConfig('gameRecord', lib.config.gameRecord);
		"step 2"
		//内异变胜利游戏不结束
		if (get.mode() == 'old_identity' && player.identity == 'nei' && get.config('nei_end')) return;
		"step 3"
		var mode = get.mode();
		if (mode == 'identity' && player.identity == 'nei') {
			if (player == game.me) game.over(true);
			else {
				game.over();
				return;
			}
		}
		"step 4"
		// 如果胜利玩家的队友包括玩家，判定胜利，否则判定失败。
		var bool = false;
		if (player == game.me || player.isFriendOf(game.me)) bool = true;
		else switch (get.mode()) {
			case 'identity': {
				game.showIdentity();
				var id1 = player.identity;
				var id2 = game.me.identity;
				if (id1 == 'zhu') {
					if (['zhong', 'mingzhong'].includes(id2)) bool = true;
					break;
				}
				break;
			}
		}
		game.over(bool);
		"step 5"
		var data = lib.config.gameRecord.incident.data;
		if (!data[incident]) {
			data[incident] = [0, 0];
		}
		data[incident][1]++;
		if (!data['akyuu']) {
			data['akyuu'] = 0;
		}
		data['akyuu']++;

		if (!data['cong']) {
			data['cong'] = 0;
		}
		if (player.name == 'gezi_marisa') {
			data['cong']++;
		}
		game.saveConfig('gameRecord', lib.config.gameRecord);
	}
	//判断是否持有皆杀效果
	lib.element.player.isJiesha = function () {
		if (this.storage._tanpai && this.storage._tanpai[0].name == 'gezi_death') return true;
		if (this.hasSkill('gezi_xuwu')) return true;
		return false;
	}
	//强行塞入一个装异变的玩意。
	lib.element.player.addIncident = function (card) {
		this.$gain2(card);
		if (!this.storage._tanpai) this.storage._tanpai = [];
		this.storage._tanpai.add(card);
		if (!lib.skill['_tanpai']) {
			lib.skill._tanpai = {
				intro: {
					content: 'cards'
				}
			};
		}
		this.markSkill('_tanpai');
		this.syncStorage('_tanpai');
		// 使用异变牌时，切换背景/BGM
		if (lib.config.background_audio && lib.config.background_music != 'music_off' && get.subtype(card) == 'yibianpai') {
			if ((this.identity == 'zhu' && get.config('gezimusicchange') != 'off') || (this.identity == 'nei' && get.config('gezimusicchange') == 'luren')) {
				ui.backgroundMusic.src = '';
				game.playnBackgroundMusic(card.name, false, true);
			}
			if ((this.identity == 'zhu' && get.config('gezibackgroundchange') != 'off') || (this.identity == 'nei' && get.config('gezibackgroundchange') == 'luren')) {
				var str = 'extension/东方project/' + card.name + '.jpg';
				ui.background.setBackgroundImage(str);
			}
		}
		// 并且，使用异变牌时，强行假装没有用牌，跳过效果
		//一键禁用异变胜利条件
		if (get.config('incidentoverbool')||config.incidentoverbool) {
			for (var i = 0; i < get.info(card).incidentskills.length; i++) {
				this.addnSkill(get.info(card).incidentskills[i]);
			}
			// 将异变牌加入记录（阿求不加）
			if (this.name == 'akyuu') return;
			if (!lib.config.gameRecord.incident) lib.config.gameRecord.incident = { data: {} };
			var data = lib.config.gameRecord.incident.data;
			var incident = card.name;
			if (!data[incident]) {
				data[incident] = [0, 0];
			}
			if (!data['cong']) {
				data['cong'] = 0;
			}
			data[incident][0]++;
			var str = '';
			for (var i = 0; i < data.length; i++) {
				if (data[i]) {
					str += lib.translate[data[i]] + '：' + data[i][0] + '出场' + ' ' + data[i][1] + '胜<br>';
				}
			}
			game.saveConfig('gameRecord', lib.config.gameRecord);
		}
		//禁用异变效果
		if (get.config('incidentbool')||config.incidentbool) {
			for (var j = 0; j < get.info(card).skills.length; j++) {
				this.addnSkill(get.info(card).skills[j]);
			}
		}
		game.log(this, '明置了异变牌', card);
	}
	if (lib.config.mode == 'identity'&&config.yibianmoshi) {
		// 出牌阶段的摊牌技能。
		lib.skill._tanpai={
			init:player => player.storage._tanpai=[],
			enable:'phaseUse',
			usable:1,
			filter:function(event,player){
				return player.identityShown!=true;
			},
			line:true,
			intro:{
				content:'cards',
			},
			content:function(){
				// 使用异变牌
				// 异变牌任选
				'step 0'
				let libincident=Object.keys(lib.card).filter(card => lib.card[card].subtype==='yibianpai');
				game.broadcastAll(function (player, identity) {
					player.identityShown = true;
					player.setIdentity(identity);
					player.node.identity.classList.remove('guessing');
				}, player, player.identity);
				game.log(player, '的身份是', '#g' + get.translation(player.identity + '2'));
				player.$effectn('jinu_skill', 11);
				player.disableSkill('_tanpai');
				player.removeSkill('_tanpai');
				// 主公和内拿异变牌
				if (player.identity == "zhu" || player.identity == "nei") {
					var num;
					if(player!=game.me) libincident.remove('gezi_death');
					if (player.identity == 'zhu') num = Math.floor(Math.random() * (libincident.length - 1));
					else num = Math.floor(Math.random() * (libincident.length));
					player.chooseButton(['选择你本局要发动的异变', [libincident, 'vcard']], true).set('filterButton', function (button) {
						return true;
					}).set('ai', function (button) {
						if (_status.event.player.identity == "zhu" && button.link[2] == 'gezi_death') return -2;    //黑幕就不要拿皆杀了，态度的ai写不来
						return button.link[2] == libincident[_status.event.num];
					}).set('num', num);
					// 忠：令一名角色抽牌	
				} else if (player.identity == "zhong") {
					player.chooseTarget('【忠】身份明置效果：令一名角色摸一张牌', function (card, player, target) {
						return true;
					}).set('ai', function (target) {
						if (target.identity == 'zhu') return true;
						return get.attitude(_status.event.player, target) > 0;
					});
					// 反：伪采访一个
				} else if (player.identity == "fan") {
					player.chooseTarget('【反】明置效果：令一名角色选择：弃一张牌或明置身份', function (card, player, target) {
						return player != target && (target.countCards('h') || target.identityShown != true);
					}).set('ai', function (target) {
						var player = _status.event.player;
						if (target.identityShown != true) return target;
						if (target.identity == "fan") return 0;
						return get.attitude(_status.event.player, target) < 0;
					});
				}
				'step 1'
				if (result.bool) {
					if (result.targets != '') {
						if (player.identity == 'fan') {
							player.line(result.targets[0], 'green');
							var list = ['discard'];
							event.target = result.targets[0];
							if (result.targets[0].identityShown != true) list.push('_tanpai');
							result.targets[0].chooseControl(list, function (event, player) {
								if (list.includes('_tanpai')) return '_tanpai';
								return 'discard';
							});
						} else if (player.identity == 'zhong') {
							player.line(result.targets[0], 'green');
							result.targets[0].draw();
						}
					} else {
						var card = game.createCard(result.links[0][2], 'yibianpai', '');
						if (player.identity == "zhu") {
							player.addIncident(card);
						} else if (player.identity == "nei") {
							if (!player.storage._tanyibian) player.storage._tanyibian = [];
							player.storage._tanyibian.add(card);
							player.markSkill('_tanyibian');
							player.syncStorage('_tanyibian');
						}
					}
				}
				'step 2'
				if (result.control) {
					if (result.control == 'discard') {
						player.discardPlayerCard('he', event.target, true);
					} else {
						event.target.useSkill('_tanpai');
					}
				}
			},
			ai: {
				order: function (name, player) {
					var cards = player.getCards('h');
					if (player.countCards('h', 'sha') == 0) {
						return 1;
					}
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].name != 'sha' && cards[i].number > 11 && get.value(cards[i]) < 7) {
							return 9;
						}
					}
					return get.order({ name: 'sha' }) - 1;
				},
				result: {
					player: function (player) {
						if (player.identity == 'fan') return 0.5;
						if (player.identity == 'zhu') {
							var num = game.countPlayer(function (current) {
								if (player != current && current.identityShown == true) return 1;
							});
							if (num > 2) return 0.5;
							return 0;
						}
						if (player.identity == 'zhong') {
							if (game.zhu.identityShown == true) return 1;
							else return 0;
						}
						if (player.identity == 'nei') {
							if (game.roundNumber > 1) return 1;
							else return 0;
						}
					}
				}
			}
		}
		lib.skill._tanyibian={
			init:player => player.storage._tanyibian = [],
			enable:'phaseUse',
			filter:function(event,player){
				return player.storage._tanyibian;
			},
			mark:true,
			intro:{
				mark:function(dialog,content,player){
					if(content&&content.length){
						if(player==game.me||player.isUnderControl()) dialog.addAuto(content);
						else return `是什么呢，这${get.cnNumber(content.length)}异变？`;
					}
				},
				content:function(content,player){
					if(content&&content.length){
						if(player==game.me||player.isUnderControl()) return get.translation(content);
						else return `是什么呢，这${get.cnNumber(content.length)}异变？`;
					}
				}
			},
			async content(event,trigger,player){
				let card=player.storage._tanyibian[0];
				await player.addIncident(card);
				delete player.storage._tanyibian;
				player.unmarkSkill('_tanyibian');
			},
			ai:{
				order:10,
				result:{
					player:function(player,target){
						if(game.roundNumber>1) return 3;
						return -1;
					}
				},
			},
		}
		lib.skill._enhance_yibianzhu={
			trigger:{
				global:"gameStart",
			},
			priority:66,
			filter:function(event,player){
				return player.identity=="zhu"&&player.identityShown==true;
			},
			forced:true,
			async content(event,trigger,player){
				let libincident=Object.keys(lib.card).filter(card => lib.card[card].subtype==='yibianpai');
				let num=Math.floor(Math.random()*(libincident.length-1));
				const {result:{links}}=await player.chooseButton(['选择你本局要发动的异变', [libincident, 'vcard']],true).set('filterButton',function (button){
					return true;
				}).set('ai',function(button){
					if (_status.event.player.identity=="zhu"&&button.link[2]=='gezi_death') return -2;    //黑幕就不要拿皆杀了，态度的ai写不来
					return button.link[2] == libincident[_status.event.num];
				}).set('num',num);
				let card=game.createCard(links[0][2],'yibianpai','');
				await player.addIncident(card);
				event.trigger("yibianpaiSelected");
			},
		}
		lib.translate._tanpai = "异变";
		lib.translate._tanyibian = '明置异变牌'
		lib.translate._enhance_yibianzhu = '异变模式'
	}


	/*-----------------------------------------强化-----------------------------------------*/
	// 强化牌的地方
	lib.skill._enhance = {
		popup: false,
		trigger: { player: 'useCardToTargeted' },
		filter: function (event, player) {
			var info = get.info(event.card);
			return info && info.enhance && event.player.lili > info.enhance;
		},
		content: function () {
			'step 0'
			// 目前只有bmg有更改强化的支付方，适配方面暂时摆了
			if (player.hasSkillTag("Enchange")) {
				if (game.hasPlayer(current => current.lili > player.lili)) {
					var next = game.createEvent('enhance_change');
					next.card = trigger.card;
					next.player = player;
					next.setContent(lib.skill.gezi_chuancheng.content);
				}
			} else if (game.hasPlayer(current => current.hasSkillTag("Enchange") && current.lili > player.lili)) {
				var next = game.createEvent('enhance_change');
				next.card = trigger.card;
				next.targets = game.filterPlayer(current => current.hasSkillTag("Enchange"));
				next.player = player;
				next.setContent(lib.skill.gezi_chuancheng.contentx);
			}
			'step 1'
			if (!trigger.card.storage || !trigger.card.storage.enhance) {
				player.loselili(get.info(trigger.card).enhance);
				game.log(get.translation(player) + '强化了' + get.translation(trigger.card.name) + '。');
				if (!player.storage._enhance) {
					player.storage._enhance = 1;
				} else {
					player.storage._enhance += 1;
				}
			}
		},
		check: function (event, player) {
			if (player.lili < 2) return false;
			var card = event.card;
			if (card.name == 'gezi_danmakucraze') {
				return (player.countCards('h') < player.hp) || player.countCards('h', { name: 'sha' }) || player.hp >= 2;
			} else if (card.name == 'gezi_caifang') {
				return player.lili > 2;
			} else if (card.name == 'gezi_xuyuanshu') {
				return player.lili > 1;
			}
		},
		prompt: function (trigger, player) {
			return "是否消耗" + lib.card[trigger.card.name].enhance + '点灵力强化【' + lib.translate[trigger.card.name] + '】？';
		},
		prompt2: function (trigger, player) {
			var str = lib.translate[trigger.card.name + '_info'];
			var num = str.indexOf('强化');
			str = str.slice(num, str.length);
			if (player.storage._enhance) {
				str += '<br>此卡已强化' + player.storage._enhance + '次';
			}
			return str;
		},
		ai: {
			effect: {
				target: function (card, player, target, current) {
					if (player.lili == 0 && get.tag(card, 'damage')) {
						return 'zeroplayertarget';
					}
				},
				player: function (card, player, target, current) {
					if (card.source == 0 && get.tag(card, 'damage')) {
						return 'zeroplayertarget';
					}
				},
			}
		},
	}
	// 强化的牌用完后清理标记
	lib.skill._enhanceend = {
		trigger: { player: 'useCardAfter' },
		forced: true,
		popup: false,
		filter: function (event, player) {
			return player.storage._enhance;
		},
		content: function () {
			if (player.storage._enhance && lib.card[trigger.card.name].enhance) {
				player.storage._enhance = 0;
			}
		},
	}


	/*-----------------------------------------特效-----------------------------------------*/
	lib.animate.card.sha = function (card, name, nature) {
		//this.chat('');
		if (this.name == 'gezi_sakuya' && nature == 'metal') this.popup('吃我一刀');
		if (this.name == 'gezi_sakuya' && nature == 'wood') this.popup('好险');
	}
	//name为技能名称 popname为原先发动技能时弹出的文字（绝大多数情况下与name相同）checkShow为双将模式下技能的来源（vice为主将 其他情况下为副将）
	lib.animate.skill.lunadial_skill = function (name, popname, checkShow) {
		if (this.name == 'gezi_sakuya' && name == 'lunadial_skill') this.popup('The World！');
	}
	lib.animate.skill.stg_watch_skill = function (name, popname, checkShow) {
		if (this.name == 'gezi_sakuya' && name == 'stg_watch_skill') this.popup('砸瓦鲁多！！');
	}
	//图片特效
	lib.element.player.$effectn = function (name, frame, left, top) {
		if (config.dongfangtexiao) {
			//if(lib.config.animation&&!lib.config.low_performance&&config.dongfangtexiao){
			var Animation = ui.create.div();
			Animation.style["z-index"] = 81;

			Animation.style.width = (140 / 715) * document.body.clientHeight + "px";
			Animation.style.height = (140 / 715) * document.body.clientHeight + "px";

			if (left || top) {
				if (left) Animation.style.left = left;
				if (top) Animation.style.top = top;
				ui.window.appendChild(Animation);
			} else if (this == game.me) {
				//Animation.style.left= (document.body.clientWidth-120)/2+"px";
				Animation.style.left = "8%";
				Animation.style.top = "20%";
				this.appendChild(Animation);
				//ui.window.appendChild(Animation);
			}
			else {
				Animation.style.left = "8%";
				Animation.style.top = "20%";
				this.appendChild(Animation);
			}
			Animation.style.backgroundSize = "cover";
			var zhen = 0;
			/* var ID = setInterval(function(){
				var img = new Image();
				img.onload=function(){
					//delete img;
				};
				img.onerror=function(){
					zhen = frame + 1;
				};
				img.src = lib.assetURL + "image/effect/" + name +"/"+ zhen + ".png";
				var SRC = lib.assetURL + "image/effect/" + name +"/"+ zhen + ".png";
				if(zhen>frame){
					clearInterval(ID);
					Animation.delete(); 
					return ;
				}
				Animation.setBackgroundImage(SRC);
				zhen ++;
			},200);*/
			var ID = setInterval(function () {
				if (zhen > frame) {
					clearInterval(ID);
					Animation.delete();
					return;
				}

				var SRC = lib.assetURL + "extension/东方project/effect/xuliezhen/" + name + "/" + zhen + ".png";

				Animation.innerHTML = "<img width=100% height=100% ondragstart='return fasle;' src='" + SRC + "' />";

				zhen++;
			}, 100);
		}
	}
	//gif新特效(然而没gif)
	lib.element.player.$effectnn = function (name, frame, left, top) {
		if (lib.config.animation && !lib.config.low_performance && config.dongfangtexiao) {
			var Animation = ui.create.div();
			Animation.style["z-index"] = 20;

			Animation.style.width = (140 / 715) * document.body.clientHeight + "px";
			Animation.style.height = (140 / 715) * document.body.clientHeight + "px";

			if (left || top) {
				if (left) Animation.style.left = left;
				if (top) Animation.style.top = top;
				ui.window.appendChild(Animation);
			} else if (this == game.me) {
				Animation.style.left = (document.body.clientWidth - 120) / 2 + "px";
				Animation.style.top = "60%";
				ui.window.appendChild(Animation);
			}
			else {
				Animation.style.left = "5%";
				Animation.style.top = "50%";
				this.appendChild(Animation);
			}
			Animation.style.backgroundSize = "cover";
			var SRC = lib.assetURL + "extension/东方project/effect/gif/" + name + ".gif";
			Animation.setBackgroundImage(SRC);
			setTimeout(function () {
				Animation.delete();
			}, 2000);
		}
	}
	game.notify = function (str) {
		var dialog = ui.create.dialog(str);
		dialog.videoId = lib.status.videoId++;

		game.broadcast(function (str, id) {
			var dialog = ui.create.dialog(str);
			dialog.videoId = id;
		}, str, dialog.videoId);
		setTimeout(function () {
			game.broadcast('closeDialog', dialog.videoId);
			dialog.close();
		}, get.delayx(1000, 2000));
	}
	//小剧场函数
	game.playConvo = function (lines) {
		var num = 0;
		var step1 = function () {
			var dialog = ui.create.dialog();
			var player = ui.create.div('.avatar', dialog).setBackground(lines[num][0], 'character');
			dialog.style.minHeight = '120px';
			dialog.add('<div><div style="width:260px;margin-left:120px;font-size:18px;">' + lines[num][1] + '</div></div>');
			player.style.float = 'left';
			ui.auto.hide();
			dialog.open();
			ui.create.control('继续', function () {
				ui.dialog.close();
				while (ui.controls.length) ui.controls[0].close();
				num++;
				if (num >= lines.length) {
					game.resume();
				} else {
					step1();
				}
			});
			ui.create.control('跳过', function () {
				ui.dialog.close();
				while (ui.controls.length) ui.controls[0].close();
				game.resume();
			});
		};
		game.pause();
		step1();
	}
	game.switchModen = function (name, configx) {
		if (!lib.layoutfixed.includes(name)) {
			if (lib.config.layout != game.layout) {
				lib.init.layout(lib.config.layout);
			}
			else if (lib.config.mode == 'brawl') {
				if (lib.config.player_border == 'normal' && (game.layout == 'long' || game.layout == 'long2')) {
					ui.arena.classList.add('lslim_player');
				}
			}
		}
		window.game = game;
		var script = lib.init.js(lib.assetURL + 'extension/东方project', name, function () {
			if (!lib.config.dev) delete window.game;
			script.remove();
			var mode = lib.imported.mode;
			_status.sourcemode = lib.config.mode;
			lib.config.mode = name;

			var i, j, k;
			for (i in mode[lib.config.mode].element) {
				if (!lib.element[i]) lib.element[i] = [];
				for (j in mode[lib.config.mode].element[i]) {
					if (j == 'init') {
						if (!lib.element[i].inits) lib.element[i].inits = [];
						lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
					}
					else {
						lib.element[i][j] = mode[lib.config.mode].element[i][j];
					}
				}
			}
			for (i in mode[lib.config.mode].ai) {
				if (typeof mode[lib.config.mode].ai[i] == 'object') {
					if (ai[i] == undefined) ai[i] = {};
					for (j in mode[lib.config.mode].ai[i]) {
						ai[i][j] = mode[lib.config.mode].ai[i][j];
					}
				}
				else {
					ai[i] = mode[lib.config.mode].ai[i];
				}
			}
			for (i in mode[lib.config.mode].ui) {
				if (typeof mode[lib.config.mode].ui[i] == 'object') {
					if (ui[i] == undefined) ui[i] = {};
					for (j in mode[lib.config.mode].ui[i]) {
						ui[i][j] = mode[lib.config.mode].ui[i][j];
					}
				}
				else {
					ui[i] = mode[lib.config.mode].ui[i];
				}
			}
			for (i in mode[lib.config.mode].game) {
				game[i] = mode[lib.config.mode].game[i];
			}
			for (i in mode[lib.config.mode].get) {
				get[i] = mode[lib.config.mode].get[i];
			}
			if (game.onwash) {
				lib.onwash.push(game.onwash);
				delete game.onwash;
			}
			if (game.onover) {
				lib.onover.push(game.onover);
				delete game.onover;
			}
			lib.config.banned = lib.config[lib.config.mode + '_banned'] || [];
			lib.config.bannedcards = lib.config[lib.config.mode + '_bannedcards'] || [];

			for (i in mode[lib.config.mode]) {
				if (i == 'element') continue;
				if (i == 'game') continue;
				if (i == 'ai') continue;
				if (i == 'ui') continue;
				if (i == 'get') continue;
				if (i == 'config') continue;
				if (i == 'start') continue;
				if (i == 'startBefore') continue;
				if (lib[i] == undefined) lib[i] = (Array.isArray(mode[lib.config.mode][i])) ? [] : {};
				for (j in mode[lib.config.mode][i]) {
					lib[i][j] = mode[lib.config.mode][i][j];
				}
			}

			// var pilecfg=lib.config.customcardpile[get.config('cardpilename')];
			// if(pilecfg){
			//     lib.config.bannedpile=pilecfg[0]||{};
			//     lib.config.addedpile=pilecfg[1]||{};
			// }

			_status.event = lib.element.GameEvent.initialGameEvent();
			_status.paused = false;

			if (_status.connectMode && lib.mode[name].connect) {
				game.saveConfig('connect_mode', name);
				game.clearConnect();
				lib.configOL.mode = name;
				if (configx) {
					for (var i in configx) {
						lib.configOL[i] = configx[i];
					}
				}
				else {
					for (var i in lib.mode[name].connect) {
						if (i == 'update') continue;
						lib.configOL[i.slice(8)] = get.config(i);
					}
					lib.configOL.zhinang_tricks = lib.config.connect_zhinang_tricks;
					lib.configOL.characterPack = lib.connectCharacterPack.slice(0);
					lib.configOL.cardPack = lib.connectCardPack.slice(0);
					for (var i = 0; i < lib.config.connect_characters.length; i++) {
						lib.configOL.characterPack.remove(lib.config.connect_characters[i]);
					}
					for (var i = 0; i < lib.config.connect_cards.length; i++) {
						lib.configOL.cardPack.remove(lib.config.connect_cards[i]);
					}
					lib.configOL.banned = lib.config['connect_' + name + '_banned'];
					lib.configOL.bannedcards = lib.config['connect_' + name + '_bannedcards'];
				}
				lib.configOL.version = lib.versionOL;
				for (var i in lib.cardPackList) {
					if (lib.configOL.cardPack.includes(i)) {
						lib.card.list = lib.card.list.concat(lib.cardPackList[i]);
					}
				}
				for (i = 0; i < lib.card.list.length; i++) {
					if (lib.card.list[i][2] == 'huosha') {
						lib.card.list[i] = lib.card.list[i].slice(0);
						lib.card.list[i][2] = 'sha';
						lib.card.list[i][3] = 'fire';
					}
					else if (lib.card.list[i][2] == 'leisha') {
						lib.card.list[i] = lib.card.list[i].slice(0);
						lib.card.list[i][2] = 'sha';
						lib.card.list[i][3] = 'thunder';
					}
					if (!lib.card[lib.card.list[i][2]]) {
						lib.card.list.splice(i, 1); i--;
					}
					else if (lib.card[lib.card.list[i][2]].mode &&
						lib.card[lib.card.list[i][2]].mode.includes(lib.config.mode) == false) {
						lib.card.list.splice(i, 1); i--;
					}
				}
			}

			if (!lib.config.show_playerids || !game.showIdentity) {
				ui.playerids.style.display = 'none';
			}
			else {
				ui.playerids.style.display = '';
			}

			if (mode[lib.config.mode].startBefore) mode[lib.config.mode].startBefore();
			game.createEvent('game', false).setContent(mode[lib.config.mode].start);
			if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode].fromextension) {
				var startstr = mode[lib.config.mode].start.toString();
				if (startstr.indexOf('onfree') == -1) {
					setTimeout(lib.init.onfree, 500);
				}
			}
			delete lib.imported.mode[name];

			if (!lib.db) {
				try {
					lib.storage = JSON.parse(localStorage.getItem(lib.configprefix + lib.config.mode));
					if (typeof lib.storage != 'object') throw ('err');
					if (lib.storage == null) throw ('err');
				}
				catch (err) {
					lib.storage = {};
					localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
				}
				game.loop();
			}
			else {
				game.getDB('data', lib.config.mode, function (obj) {
					lib.storage = obj || {};
					game.loop();
				});
			}
		});
	}
	//音乐来
	game.playlili = function (fn, dir, sex) {
		if (lib.config.background_speak) {
			if (dir && sex)
				game.playAudio(dir, sex, fn);
			else if (dir)
				game.playAudio(dir, fn);
			else
				game.playAudio('..', 'extension', '东方project', fn);
		}
	}
	//这是角色变装/背景图的全局技能…
	lib.skill._annoyingmousChangeBackground = {
		trigger: {
			player: "enterGame",
			global: "gameStart",
		},
		popup: false,
		forced: true,
		unique: true,
		locked: true,
		priority: -Infinity,
		audio: "ext:东方project:2",
		content: function () {
			if (game.countPlayer(function (current) { return current.name == "aventurinepurple" }) > 0) {
				game.broadcastAll() + ui.background.setBackgroundImage("extension/东方project/backgroundpurple" + [1, 2].randomGet() + ".jpg");
				game.log('八云紫将场地切换为东方幻想乡');
				//ui.backgroundMusic.src=lib.assetURL+'extension/东方project/aventurinepurple.mp3'; 
				// player.node.name.innerHTML='神<br>蓝<br>银<br>霜';
				//  player.update();
			}
			//八云紫
		},
	}
	game.playnBackgroundMusic = function (music, temp, marisa) {
		if (!marisa && config.backgroundmusicshow == 'marisa') return;
		if (!lib.config.background_music) lib.config.background_music = 'music_default';
		if (lib.config.background_music == 'music_off') {
			ui.backgroundMusic.src = '';
		}
		else {
			var url = lib.assetURL;
			if (!music) music = lib.config.background_music;
			else lib.config.background_music = music;

			if (music == 'music_random') {
				music = lib.config.all.background_music.randomGet(_status.currentMusic);
			}

			_status.currentMusic = music;
			if (music == 'music_custom') {
				if (lib.config.background_music_src) {
					ui.backgroundMusic.src = lib.config.background_music_src;
				}
			} else if (music == 'music_default') {
				ui.backgroundMusic.src = url + 'audio/background/' + music + '.mp3';
				ui.backgroundMusic.currentTime = [137, 693, 1338, 1970, 2715, 3463, 3982].randomGet();
			}
			else {
				ui.backgroundMusic.src = url + 'extension/东方project/' + music + '.mp3';
				ui.backgroundMusic.loop = true;
			}
		}
	}


	/*-----------------------------------------失明-----------------------------------------*/
	lib.element.player.chosenToCompare = function (target, check) {
		var next = game.createEvent('chosenToCompare');
		next.player = this;
		if (Array.isArray(target)) {
			next.targets = target;
			if (check) next.ai = check;
			else next.ai = function (card) {
				var addi = (get.value(card) >= 8 && get.type(card) != 'equip') ? -10 : 0;
				var source = _status.event.source;
				var player = _status.event.player;
				if (source && source != player && get.attitude(player, source) > 1) {
					return -get.number(card) - get.value(card) / 2 + addi;
				}
				return get.number(card) - get.value(card) / 2 + addi;
			}
			next.setContent('chosenToCompare');
		}
		else {
			next.target = target;
			if (check) next.ai = check;
			else next.ai = function (card) {
				if (typeof card == 'string' && lib.skill[card]) {
					var ais = lib.skill[card].check || function () { return 0 };
					return ais();
				}
				var player = get.owner(card);
				var event = _status.event.getParent();
				var to = (player == event.player ? event.target : event.player);
				var addi = (get.value(card) >= 8 && get.type(card) != 'equip') ? -10 : 0;
				if (card.name == 'du') addi += 5;
				if (player == event.player) {
					if (get.attitude(player, to) > 0 && event.small) {
						return -get.number(card) - get.value(card) / 2 + addi;
					}
					return get.number(card) - get.value(card) / 2 + addi;
				}
				else {
					if (get.attitude(player, to) > 0 && !event.small) {
						return -get.number(card) - get.value(card) / 2 + addi;
					}
					return get.number(card) - get.value(card) / 2 + addi;
				}
			}
			next.setContent('chosenToCompare');
		}
		next._args = Array.from(arguments);
		return next;
	}
	lib.element.content.chosenToCompare = function () {
		"step 0"
		if (player.countCards('h') == 0 || target.countCards('h') == 0 || player == target) {
			event.result = { cancelled: true, bool: false }
			event.finish();
			return;
		}
		game.log(player, '对', target, '发起拼点');
		"step 1"
		var sendback = function () {
			if (_status.event != event) {
				return function () {
					event.resultOL = _status.event.resultOL;
				};
			}
		};
		var str = '请选择拼点牌<br><br><div><div style="width:100%;text-align:center;font-size:14px">点数更大方为赢，点数相等为双方都没赢';
		if (lib.config.compare_discard) str += '<br>拼点完双方各摸一张牌</div>';
		if (player.isOnline()) {
			player.wait(sendback);
			event.ol = true;
			player.send(function (str, ai) {
				game.me.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = ai;
				game.resume();
			}, str, event.ai);
		}
		else {
			event.localPlayer = true;
			player.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = event.ai;
		}
		if (target.isOnline()) {
			target.wait(sendback);
			event.ol = true;
			target.send(function (str, ai) {
				game.me.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = ai;
				game.resume();
			}, str, event.ai);
		}
		else {
			event.localTarget = true;
		}
		"step 2"
		var str = '请选择拼点牌<br><br><div><div style="width:100%;text-align:center;font-size:14px">点数更大方为赢，点数相等为双方都没赢<br>拼点完双方各摸一张牌</div>';
		if (event.localPlayer) {
			event.card1 = result.cards[0];
		}
		if (event.localTarget) {
			target.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = event.ai;
		}
		"step 3"
		if (event.localTarget) {
			event.card2 = result.cards[0];
		}
		if (!event.resultOL && event.ol) {
			game.pause();
		}
		"step 4"
		try {
			if (!event.card1) event.card1 = event.resultOL[player.playerid].cards[0];
			if (!event.card2) event.card2 = event.resultOL[target.playerid].cards[0];
			if (!event.card1 || !event.card2) {
				throw ('err');
			}
		}
		catch (e) {
			console.log(e);
			event.finish();
			return;
		}
		if (event.card2.number >= 10 || event.card2.number <= 4) {
			if (target.countCards('h') > 2) {
				event.addToAI = true;
			}
		}
		// 失去拼点牌原位置

		"step 5"
		game.broadcast(function () {
			ui.arena.classList.add('thrownhighlight');
		});
		ui.arena.classList.add('thrownhighlight');
		game.addVideo('thrownhighlight1');
		player.$compare(event.card1, target, event.card2);
		game.log(player, '的拼点牌为', event.card1);
		game.log(target, '的拼点牌为', event.card2);
		event.num1 = get.number(event.card1);
		event.num2 = get.number(event.card2);
		event.trigger('compare');
		game.delay(0, 1500);
		"step 6"
		event.result = {
			player: event.card1,
			target: event.card2,
			num1: event.num1,
			num2: event.num2
		}
		var str;
		if (event.num1 > event.num2) {
			event.result.bool = true;
			event.result.winner = player;
			str = get.translation(player.name) + '拼点成功';
			player.popup('胜');
			target.popup('负');
		}
		else {
			event.result.bool = false;
			str = get.translation(player.name) + '拼点失败';
			if (event.num1 == event.num2) {
				event.result.tie = true;
				player.popup('平');
				target.popup('平');
			}
			else {
				event.result.winner = target;
				player.popup('负');
				target.popup('胜');
			}
		}
		game.broadcastAll(function (str) {
			var dialog = ui.create.dialog(str);
			dialog.classList.add('center');
			setTimeout(function () {
				dialog.close();
			}, 1000);
		}, str);
		game.delay(2);
		// 这里是拼点完摸牌。

		player.lose(event.card1);
		target.lose(event.card2);


		player.draw();
		target.draw();

		"step 7"
		if (typeof event.target.ai.shown == 'number' && event.target.ai.shown <= 0.85 && event.addToAI) {
			event.target.ai.shown += 0.1;
		}
		game.broadcastAll(function () {
			ui.arena.classList.remove('thrownhighlight');
		});
		game.addVideo('thrownhighlight2');
		if (event.clear !== false) {
			game.broadcastAll(ui.clear);
		}
		if (typeof event.preserve == 'function') {
			event.preserve = event.preserve(event.result);
		}
		else if (event.preserve == 'win') {
			event.preserve = event.result.bool;
		}
		else if (event.preserve == 'lose') {
			event.preserve = !event.result.bool;
		}
	}
	//选择卡牌，加入米斯蒂亚的专用变量，同时混入了技能牌
	lib.element.content.chosenPlayerCard = function () {
		"step 0"
		if (!event.dialog) event.dialog = ui.create.dialog('hidden');
		else if (!event.isMine) {
			event.dialog.style.display = 'none';
		}
		if (event.prompt) {
			event.dialog.add(event.prompt);
		}
		else {
			event.dialog.add('选择' + get.translation(target) + '的一张牌');
		}
		var directh = true;
		if (!lib.config.auto_discard) directh = false;
		for (var i = 0; i < event.position.length; i++) {
			if (event.position[i] == 'h' && target.countCards('h')) {
				event.dialog.addText('手牌区');
				var hs = target.getCards('h');
				hs.randomSort();
				// invisible是米斯蒂亚的专用变量：无视持有者是谁都会屏蔽掉手牌
				if ((event.visible || target.isUnderControl(true)) && !event.invisible) {
					event.dialog.add(hs);
					directh = false;
				} else {
					if (target.getShownCards().length) {
						for (var j = 0; j < hs.length; j++) {
							if (target.getShownCards().includes(hs[j])) {
								event.dialog.add([hs[j]]);
							} else {
								event.dialog.add([[hs[j]], 'blank']);
							}
						}
						directh = false;
					} else {
						if (event.invisible) directh = false;
						event.dialog.add([hs, 'blank']);
					}
				}
			}
			else if (event.position[i] == 'e' && target.countCards('e')) {
				event.dialog.addText('装备区');
				event.dialog.add(target.getCards('e'));
				directh = false;
			}
			else if (event.position[i] == 'j' && target.countJinengpai() > 0) {
				event.dialog.addText('技能区');
				event.dialog.add(target.getJinengpai());
				directh = false;
			}
		}
		if (event.dialog.buttons.length == 0) {
			event.finish();
			return;
		}
		var cs = target.getCards('he');
		cs.addArray(target.getJinengpai());
		var select = get.select(event.selectButton);
		if (event.forced && select[0] >= cs.length) {
			event.result = {
				bool: true,
				buttons: event.dialog.buttons,
				links: cs
			}
		}
		else if (event.forced && directh && select[0] == select[1]) {
			event.result = {
				bool: true,
				buttons: event.dialog.buttons.randomGets(select[0]),
				links: []
			}
			for (var i = 0; i < event.result.buttons.length; i++) {
				event.result.links[i] = event.result.buttons[i].link;
			}
		}
		else {
			if (event.isMine()) {
				event.dialog.open();
				game.check();
				game.pause();
			}
			else if (event.isOnline()) {
				event.send();
			}
			else {
				event.result = 'ai';
			}
		}
		"step 1"
		if (event.result == 'ai') {
			game.check();
			if (ai.basic.chooseButton(event.ai) || forced) ui.click.ok();
			else ui.click.cancel();
		}
		event.dialog.close();
		if (event.result.links) {
			event.result.cards = event.result.links.slice(0);
		}
		event.resume();
	}
	lib.element.player.chosenPlayerCard = function () {
		var next = game.createEvent('chosenPlayerCard');
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == 'player') {
				next.target = arguments[i];
			}
			else if (typeof arguments[i] == 'number') {
				next.selectButton = [arguments[i], arguments[i]];
			}
			else if (get.itemtype(arguments[i]) == 'select') {
				next.selectButton = arguments[i];
			}
			else if (typeof arguments[i] == 'boolean') {
				next.forced = arguments[i];
			}
			else if (get.itemtype(arguments[i]) == 'position') {
				next.position = arguments[i];
			}
			else if (arguments[i] == 'visible') {
				next.visible = true;
			}
			else if (arguments[i] == 'invisible') {
				next.invisible = true;
			}
			else if (typeof arguments[i] == 'function') {
				if (next.ai) next.filterButton = arguments[i];
				else next.ai = arguments[i];
			}
			else if (typeof arguments[i] == 'object' && arguments[i]) {
				next.filterButton = get.filter(arguments[i]);
			}
			else if (typeof arguments[i] == 'string') {
				next.prompt = arguments[i];
			}
		}
		if (next.filterButton == undefined) next.filterButton = lib.filter.all;
		if (next.position == undefined) next.position = 'he';
		if (next.selectButton == undefined) next.selectButton = [1, 1];
		if (next.ai == undefined) next.ai = function (button) {
			var val = get.buttonValue(button);
			//if(get.attitude(_status.event.player,get.owner(button.link))>0) return -val;
			return 1 / val;
		};
		next.setContent('chosenPlayerCard');
		next._args = Array.from(arguments);
		return next;
	}


	/*-----------------------------------------角色设置之类的-----------------------------------------*/
	lib.characterFilter.gezi_huolingmeng = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.gezi_dio = function (mode) {
		return mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.gezi_fapaiji = function (mode) {
		return mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.boss_mokou = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.boss_mokou2 = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.boss_cirno = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.boss_cirno2 = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	lib.characterFilter.boss_nianshou = function (mode) {
		return mode == 'mtg' || mode == 'brawl' || mode == 'boss';
	}
	if (lib.config.mode == "brawl") {
		if (!lib.storage.stage) lib.storage.stage = {};
		lib.character['kosuzu'] = ['female', 'shu', 3, [], ['ext:东方project/kosuzu.jpg']];
		lib.translate['kosuzu'] = '小铃';
		lib.characterIntro['kosuzu'] = '全名本居小铃，古书店“铃奈庵”的店员。爱好自然是读书，还有收集各种各样稀奇古怪的妖怪书。但愿她不要把自己又搞进什么危险的情况……<br><b>画师：藤原</b><br>目前收到了阿求的邀请，正在做残局模式的管理员和导师。';
		lib.skill._brawljinengpaie = {
			trigger: {
				player: "enterGame",
				global: "gameStart",
			},
			popup: false,
			forced: true,
			unique: true,
			locked: true,
			priority: -Infinity,
			filter: function (event, player) {
				return player == game.players[1] && _status.brawl.scene && _status.brawl.scene.skillPileBottom != undefined && _status.brawl.scene.skillPileBottom.length;
			},
			content: function () {
				if (_status.brawl.scene.skillPileTop && _status.brawl.scene.skillPileTop.length) {
					for (var i of _status.brawl.scene.skillPileTop) player.addJudgen(game.createCard(i[0]));
				}
				if (_status.brawl.scene.players[1].lili != undefined) player.lili = _status.brawl.scene.players[1].lili;
			}
		}
		lib.skill._brawljinengpaip = {
			trigger: {
				player: "enterGame",
				global: "gameStart",
			},
			popup: false,
			forced: true,
			unique: true,
			locked: true,
			priority: -Infinity,
			filter: function (event, player) {
				return player == game.players[0] && _status.brawl.scene && _status.brawl.scene.skillPileBottom != undefined && _status.brawl.scene.skillPileBottom.length;
			},
			content: function () {
				if (_status.brawl.scene.skillPileBottom && _status.brawl.scene.skillPileBottom.length) {
					for (var i of _status.brawl.scene.skillPileBottom) player.addJudgen(game.createCard(i[0]));
				}
				if (_status.brawl.scene.players[0].lili != undefined) player.lili = _status.brawl.scene.players[0].lili;
			}
		}
		lib.storage.stage["新手"] = {
			name: "新手",
			intro: "无论是谁都有新手上路的时候！<br>解开这些残局，来证明你已经精通了游戏的操作吧！（备注：新关卡开局卡住可以点重来多刷几遍）",
			stage: true,
			scenes: [
				{
					name: '1',
					intro: "新手入门的第一关，不用紧张！<br>我们来复习一下残局模式的规则吧：<br>在一回合内要拿下游戏胜利。<br>牌堆，手牌，技能牌，装备，都是固定的。<br>牌堆里的牌，和其他人手牌，都可以在右上角查看。<br>那么，去拿下你的首胜吧！",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 2, maxlili: null,
							playercontrol: false,
							handcards: [["sha", "diamond", 10],], equips: [], judges: []
						},
					],
					cardPileTop: [["juedou", "spade", 8], ["shunshou", "diamond", 4]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '2',
					intro: "该强化的时候就要强化，灵力毕竟不能留着过年啊！",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: null, maxlili: null,
							playercontrol: false,
							handcards: [["tao", "heart", 3]], equips: [["gezi_hourai", "spade", 8]], judges: []
						},
					],
					cardPileTop: [["gezi_caifang", "spade", 8], ["juedou", "spade", 2], ["guohe", "heart", 6]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '3',
					intro: "禁忌牌的力量，虽然说从我这里说出来不太合适，但是请一定小心……",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [["gezi_lingbi", "spade", 4]], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: null, maxlili: null,
							playercontrol: false,
							handcards: [["tao", "diamond", 12]], equips: [], judges: []
						},
					],
					cardPileTop: [["juedou", "spade", 2], ["sha", "spade", 5], ["shan", "spade", 5], ["tao", "heart", 8]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '4',
					intro: "这里可是幻想乡，不要忘记了你那独一无二的武器……！",
					players: [
						{
							name: "gezi_reimu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [["sha", "spade", 2]], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: null, maxlili: null,
							playercontrol: false,
							handcards: [], equips: [["gezi_mirror", "club", 8]], judges: []
						},
					],
					cardPileTop: [["sha", "club", 3], ["sha", "club", 4], ["sha", "spade", 5]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '5',
					intro: "除了别忘记你那独一无二的武器以外，也别忘记你对手那独一无二的武器！",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 2, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [["tao", "heart", 8]], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 3, maxlili: null,
							playercontrol: false,
							handcards: [["wuzhong", "heart", 8]], equips: [], judges: []
						},
					],
					cardPileTop: [["sha", "club", 3], ["gezi_zhiyuu", "club", 13]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '6',
					intro: "技能牌可比想象的容易使用多啦。",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 1, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 2, maxHp: null, lili: 0, maxlili: null,
							playercontrol: false,
							handcards: [], equips: [], judges: []
						},
					],
					cardPileTop: [["sha", "spade", 5], ["sha", "spade", 2]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [["gezi_lianji", null, null]], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '7',
					intro: "禁忌牌的两种效果，对手的技能牌效果，该做出什么选择呢？",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [["gezi_zuiye", "club", 3]], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 2, maxHp: null, lili: 0, maxlili: null,
							playercontrol: false,
							handcards: [['tao', 'heart', 13]], equips: [], judges: [["gezi_shengdun", null, null]]
						},
					],
					cardPileTop: [["sha", "spade", 5], ["sha", "spade", 2]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [["gezi_lianji", null, null]], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '8',
					intro: "没有灵力了就没法造成伤害了啊，该怎么办啊！",
					players: [
						{
							name: "kosuzu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 1, maxHp: null, lili: 0, maxlili: null,
							playercontrol: true,
							handcards: [["gezi_caifang", "spade", 8]], equips: [], judges: []
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 0, maxlili: null,
							playercontrol: false,
							handcards: [["tao", "spade", 8]], equips: [], judges: []
						},
					],
					cardPileTop: [["sha", "heart", 5, 1], ["sha", "spade", 2]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [["gezi_lianji", null, null]], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '9',
					intro: "游戏相关的规则差不多就到这里了。<br>那么，该是时候来进行你的毕业测验啦！<br>加油！",
					players: [
						{
							name: "gezi_reimu",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [['guohe', 'spade', '3']], equips: [['gezi_stone', 'spade', '7']], judges: [['gezi_lingyong', null, null]]
						},
						{
							name: "gezi_lunasa",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 3, maxlili: null,
							playercontrol: false,
							handcards: [["shan", "heart", 5], ["shan", "diamond", 7], ["wuxie", "spade", 12]], equips: [["gezi_mirror", "club", 8]], judges: [],
						},
					],
					cardPileTop: [["shunshou", "diamond", 3], ["sha", "spade", 2], ['sha', 'spade', 9]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [['gezi_shengdun', null, null]], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
			],
			level: 0,
			mode: 'normal',
		}
		lib.storage.stage["简单"] = {
			name: '简单',
			intro: "简单易懂，相对轻松的残局们。<br>用你的智慧来扫荡这些敌人吧！（备注：新关卡开局卡住可以点重来多刷几遍）",
			stage: true,
			scenes: [
				{
					name: '1',
					intro: "禁忌牌的使用还记得吗？记不得的话，再来一次吧？",
					players: [
						{
							name: "gezi_keine",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "kosuzu",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 2, maxHp: null, lili: 2, maxlili: null,
							playercontrol: false,
							handcards: [["shan", "diamond", 10],], equips: [], judges: []
						},
					],
					cardPileTop: [["sha", "spade", 8], ["gezi_zuiye", "club", 3]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '2',
					intro: "即使是神的保佑，也不是万能的。",
					players: [
						{
							name: "gezi_wriggle",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 1, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "kosuzu",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 2, maxHp: null, lili: 2, maxlili: null,
							playercontrol: false,
							handcards: [], equips: [['gezi_mirror', 'club', 8]], judges: []
						},
					],
					cardPileTop: [["sha", "spade", 8], ["gezi_zuiye", "club", 3], ['sha', 'club', '7']], cardPileBottom: [], discardPile: [],
					skillPileTop: [['gezi_shenyou', null, null]], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '3',
					intro: "就是自损一千，也要伤敌八百！",
					players: [
						{
							name: "gezi_flandre",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 4, maxlili: null,
							playercontrol: true,
							handcards: [["sha", 'spade', 10]], equips: [], judges: []
						},
						{
							name: "gezi_lyrica",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 0, maxlili: null,
							playercontrol: false,
							handcards: [["tao", "heart", 6], ["tao", "heart", 7], ["tao", "heart", 8], ["tao", "heart", 12]], equips: [], judges: []
						},
					],
					cardPileTop: [["sha", "spade", 8], ["gezi_danmakucraze", "spade", 12], ['sha', 'club', 7]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '4',
					intro: "一个夜雀的基本本领，要从完全驾驭夜盲症开始。",
					players: [
						{
							name: "gezi_mystia",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: null, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [["shan", 'diamond', 10], ["shan", 'diamond', 11], ["shan", 'heart', 2]], equips: [], judges: []
						},
						{
							name: "gezi_koakuma",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 1, maxlili: null,
							playercontrol: false,
							handcards: [["shan", "diamond", 4], ["shan", "diamond", 7], ["shan", "heart", 13]], equips: [], judges: [['gezi_shenyou', null, null]]
						},
					],
					cardPileTop: [["juedou", "heart", 11], ['guohe', 'club', 4]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '5',
					intro: "不仅牌堆里完全没有伤害牌，甚至还有三张桃？这得什么疯子才能赢？",
					players: [
						{
							name: "gezi_merlin",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 1, maxHp: null, lili: 2, maxlili: null,
							playercontrol: true,
							handcards: [['gezi_houraiyuzhi', 'heart', 12]], equips: [], judges: []
						},
						{
							name: "kosuzu",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 1, maxlili: null,
							playercontrol: false,
							handcards: [["shan", "heart", 13]], equips: [], judges: []
						},
					],
					cardPileTop: [["tao", "heart", 6], ["tao", 'heart', 4], ["tao", "heart", "9"], ['shan', 'diamond', 3]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '6',
					intro: "下雪天那么冷，就是能复活也不会愿意复活在雪大的天气吧……特别是暴风雪的话……",
					players: [
						{
							name: "gezi_letty",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 3, maxHp: null, lili: 3, maxlili: null,
							playercontrol: true,
							handcards: [['gezi_lingbi', 'spade', 4], ["wuxie", "diamond", 12], ['sha', 'spade', 9]], equips: [], judges: []
						},
						{
							name: "gezi_kaguya",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 5, maxlili: null,
							playercontrol: false,
							handcards: [["wuxie", "club", 12], ['shan', 'diamond', 5], ['tao', 'heart', 7]], equips: [], judges: []
						},
					],
					cardPileTop: [["gezi_tianguo", "heart", 8], ['juedou', 'club', 1], ['shan', 'heart', 7], ['shan', 'diamond', 9], ["wuxie", "club", 12], ['shan', 'diamond', 5], ['tao', 'heart', 7]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
			],
			level: 0,
			mode: 'normal',
		}
		lib.storage.stage["普通"] = {
			intro: "普普通通，不难不弱的难度<br>好好享受脑海闪电的感觉吧。（备注：新关卡开局卡住可以点重来多刷几遍）",
			stage: true,
			scenes: [
				{
					name: '1',
					intro: "操作命运是很强的能力，但是命运数量不够，种类不够……该怎么办呢？[牌堆：冈格尼尔，死境之门，博丽社例大祭]",
					players: [
						{
							name: "gezi_remilia",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 3, maxHp: null, lili: null, maxlili: null,
							playercontrol: true,
							handcards: [], equips: [], judges: []
						},
						{
							name: "gezi_merlin",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 5, maxlili: null,
							playercontrol: false,
							handcards: [], equips: [["gezi_yinyangyu", "heart", 5, -1], ["gezi_bailou", "club", 6, -1]], judges: []
						},
					],
					cardPileTop: [["juedou", "heart", 11], ["tao", "diamond", 12], ["guohe", "club", 4], ["gezi_gungnir", "heart", 13], ["gezi_simen", "spade", 2], ["gezi_reidaisai", "heart", 6]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				{
					name: '2',
					intro: "只有做好裁决自己的觉悟的人，才能够裁决别人。",
					players: [
						{
							name: "gezi_eiki",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 3, maxHp: null, lili: 5, maxlili: null,
							playercontrol: true,
							handcards: [["sha", "diamond", 7, 1], ["gezi_deathfan", "heart", 1], ["tao", "heart", 8]], equips: [], judges: []
						},
						{
							name: "gezi_flandre",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 3, maxHp: null, lili: 1, maxlili: null,
							playercontrol: false,
							handcards: [["shan", "diamond", 10], ["tao", "heart", 12]], equips: [], judges: []
						},
					],
					cardPileTop: [["shan", "diamond", 4], ["tao", "heart", 3]], cardPileBottom: [], discardPile: [],
					skillPileTop: [], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
				/*
				{name:'3',
					intro:"",
					players:[
						{name:"yuuka",
						name2:"none",
						identity:"zhu",
						position:0,
						hp:1,maxHp:null,lili:5,maxlili:null,
						playercontrol:true,
						handcards:[],equips:[],judges:[]
						},
						{name:"lyrica",
						name2:"none",
						identity:"fan",
						position:1,
						hp:1, maxHp:null, lili:5, maxlili:null,
						playercontrol:false,
						handcards:[["tao","heart",6],["tao", "heart", 7], ["tao", "heart", 8]],equips:[],judges:[]
						},
					],
					cardPileTop:[["sha","spade",8], ["danmakucraze","spade",12], ['sha', 'club', '7']],cardPileBottom:[],discardPile:[],
					skillPileTop:[],skillPileBottom:[],gameDraw:false,replacepile:true,turns:[1,"lose"],
				},
				*/
				{
					name: '3',
					intro: "对于怨念如此深的人，别以为打趴一次就足够了！",
					players: [
						{
							name: "gezi_kaguya",
							name2: "none",
							identity: "zhu",
							position: 0,
							hp: 1, maxHp: null, lili: 1, maxlili: null,
							playercontrol: true,
							handcards: [["juedou", "diamond", 1], ["gezi_zuiye", "club", 3]], equips: [["gezi_laevatein", "heart", 13]], judges: [["gezi_shenyou", null, 0]],
						},
						{
							name: "gezi_mokou",
							name2: "none",
							identity: "fan",
							position: 1,
							hp: 1, maxHp: null, lili: 5, maxlili: null,
							playercontrol: false,
							handcards: [], equips: [], judges: []
						},
					],
					cardPileTop: [["huazhi", "diamond", 9], ["sha", "club", 4], ['simen', 'spade', 2], ["sha", "club", 7], ['shan', 'diamond', 3], ['juedou', 'spade', 1]], cardPileBottom: [], discardPile: [],
					skillPileTop: [['gezi_lingyong', null, 0]], skillPileBottom: [], gameDraw: false, replacepile: true, turns: [1, "lose"],
				},
			],
			level: 0,
			mode: 'normal',
		}
		if (!_status.extensionmade) _status.extensionmade = [];
		_status.extensionmade.push("新手");
		_status.extensionmade.push("简单");
		_status.extensionmade.push("普通");
	}
	if (get.mode() == 'boss') {
		lib.boss.boss_cirno = {
			loopType: 2,
			gameDraw: function (player) {
				return player == game.boss ? 9 : 4;
			}
		}
		lib.boss.boss_cirno2 = {
			loopType: 1,
		}
		lib.boss.boss_mokou = {
			loopType: 1,
			gameDraw: function (player) {
				return player == game.boss ? 6 : 4;
			},
		}
		lib.boss.boss_mokou2 = {
			loopType: 2,
		}
		lib.boss.boss_fapaiji = {
			loopType: 2,
			chongzheng: false,
			init: function () {
				if (ui.cardPileNumber.style.display == 'none') {
					ui.cardPileNumber.style.display = 'initial';
				}
				ui.cardPileNumber.style.color = 'red';
				lib.setPopped(ui.rules, function () {
					var uiintro = ui.create.dialog('hidden');
					uiintro.add('<div class="text left">[选项→魔王]里可以打开单人控制<br>不要放弃治疗啊！<br>这个魔王不可以重整</div>');
					uiintro.add(ui.create.div('.placeholder.slim'))
					return uiintro;
				}, 400);
			},
			/*
			gameDraw:function(player){
				return player==game.boss?4:4;
			},
			*/
		}
		lib.boss.boss_nianshou = {
			loopType: 1,
			chongzheng: 1,
			loopFirst: function () {
				return game.boss.nextSeat;
			},
			init: function () {
				game.boss.node.action.classList.add('freecolor');
				game.boss.node.action.style.opacity = 1;
				game.boss.node.action.style.letterSpacing = '4px';
				game.boss.node.action.style.marginRight = 0;
				game.boss.node.action.style.fontFamily = 'huangcao';
				game.boss.node.action.innerHTML = '';
				_status.additionalReward = function () {
					return Math.round(Math.pow(_status.damageCount, 2.4)) * 2;
				}
				var time = 360;
				var interval = setInterval(function () {
					if (_status.over) {
						clearInterval(interval);
						return;
					}
					var sec = time % 60;
					if (sec < 10) {
						sec = '0' + sec;
					}
					game.boss.node.action.innerHTML = Math.floor(time / 60) + ':' + sec;
					if (time <= 0) {
						delete _status.additionalReward;
						if (typeof _status.coin == 'number') {
							if (game.me == game.boss) {
								_status.coin += Math.round(Math.pow(_status.damageCount, 2.4));
							}
							else {
								_status.coin += Math.round(Math.pow(_status.damageCount, 1.8));
							}
						}
						game.forceOver(true);
						clearInterval(interval);
					}
					time--;
				}, 1000);
				_status.damageCount = 0;
				ui.damageCount = ui.create.system('伤害: 0', null, true);
				/*
				lib.setPopped(ui.rules,function(){
					var uiintro=ui.create.dialog('hidden');
						uiintro.add('<div class="text left">[选项→游戏]里可以提高游戏速度<br>关掉[回合顺序自选]和[单人控制]也可以显著提升游戏速度<br>不要想了，快点打上去！<br>勇者坠机后进入重整状态<br>重整需要0个回合</div>');
						uiintro.add(ui.create.div('.placeholder.slim'))
					return uiintro;
				},400);
				*/
				game.boss.say('嗷呜~~~~');
			}
		}
	}
	//炉石卡牌
	if (get.mode() == 'stone') {
		lib.characterPack.mode_extension_stone_df = {
			rumia: ["female", "wei", 4, ["gezi_heiguan", "gezi_yuezhi"], ['minskin', 'stone'], [3, 4]],
			meiling: ["female", "wei", 4, ["gezi_xingmai", "gezi_dizhuan", "gezi_jicai"], ['minskin', 'stone'], [3, 4]],
			koakuma: ["female", "wei", 3, ["gezi_qishu", "gezi_anye"], ['minskin', 'stone'], [3, 4]],
			patchouli: ["female", "wei", 3, ["gezi_qiyao", "gezi_riyin2", "gezi_xianzhe"], ['minskin', 'stone'], [3, 4]],
			sakuya: ["female", "wei", 3, ["gezi_huanzang", "gezi_shijing", "gezi_world"], ['minskin', 'stone'], [3, 4]],
			remilia: ['female', 'wei', 4, ["gezi_miingyunleimi", "gezi_feise"], ['minskin', 'stone'], [3, 4]],
			flandre: ['female', 'wei', 4, ["gezi_kuangyan", "gezi_jiesha"], ['minskin', 'stone'], [3, 4]],
			cirno: ["female", "qun", 3, ["gezi_jidong", "gezi_bingbi", "gezi_dongjie"], ['minskin', 'stone'], [3, 4]],
			daiyousei: ["female", "qun", 3, ["gezi_zhufu", "gezi_zhiyue"], ['minskin', 'stone'], [3, 4]],
			suika: ["female", "qun", 4, ["gezi_cuiji", "gezi_baigui"], ['minskin', 'stone'], [3, 4]],
			mystia: ["female", "shu", 3, ["gezi_shiming", "gezi_wuye"], ['minskin', 'stone'], [3, 4]],
			keine: ["female", "shu", 4, ["gezi_jiehuo", "gezi_richuguo"], ['minskin', 'stone'], [3, 4]],
			reimu: ["female", "shu", 3, ["gezi_yinyang", "gezi_mengdie", "gezi_mengxiang"], ['minskin', 'stone'], [3, 4]],
			marisa: ["female", "shu", 3, ["gezi_liuxing", "gezi_xingchen", "gezi_stardust"], ['minskin', 'stone'], [3, 4]],
			tewi: ["female", "shu", 3, ["gezi_kaiyun", "gezi_mitu", "gezi_yuangu"], ['minskin', 'stone'], [3, 4]],
			reisen: ["female", "shu", 4, ["gezi_huanshi", "gezi_zhenshi"], ['minskin', 'stone'], [3, 4]],
			eirin: ["female", "shu", 3, ["gezi_zhaixing", "gezi_lanyue", "gezi_tianwen"], ['minskin', 'stone'], [3, 4]],
			kaguya: ["female", "shu", 3, ["gezi_nanti", "gezi_poxiao", "gezi_yongye_die"], ['minskin', 'stone'], [3, 4]],
			mokou: ["female", "shu", 4, ["gezi_yuhuo", "gezi_businiao_die"], ['minskin', 'stone'], [3, 4]],
			letty: ["female", "wu", 4, ["gezi_shuangjiang", "gezi_baofengxue"], ['minskin', 'stone'], [3, 4]],
			chen: ["female", "wu", 3, ["gezi_mingdong", "gezi_shihuo", "gezi_shuanggui"], ['minskin', 'stone'], [3, 4]],
			lilywhite: ["female", "wu", 3, ["gezi_chunxiao", "gezi_mengya"], ['minskin', 'stone'], [3, 4]],
			alice: ["female", "wu", 3, ["gezi_huanfa", "gezi_mocai", "gezi_hanghourai"], ['minskin', 'stone'], [3, 4]],
			youmu: ["female", "wu", 4, ["gezi_yishan", "gezi_yinhuashan"], ['minskin', 'stone'], [3, 4]],
			yuyuko: ["female", "wu", 3, ["gezi_youdie", "gezi_moyin", "gezi_fanhundie_die"], ['minskin', 'stone'], [3, 4]],
			ran: ["female", "wu", 3, ["gezi_jiubian", "gezi_shiqu", "gezi_tianhugongzhu"], ['minskin', 'stone'], [3, 4]],
			yukari: ["female", "wu", 3, ["gezi_huanjing", "gezi_mengjie", "gezi_mengjing"], ['minskin', 'stone'], [3, 4]],
			lilyblack: ["female", "qun", 3, ["gezi_chunmian", "gezi_bamiao"], ['minskin', 'stone'], [3, 4]],
			medicine: ["female", "qun", 3, ["gezi_zaidu", "gezi_zhanfang", "gezi_huayuan"], ['minskin', 'stone'], [3, 4]],
			yuuka: ["female", "qun", 4, ["gezi_zanghua", "gezi_xiaofeng"], ['minskin', 'stone'], [3, 4]],
			komachi: ["female", "qun", 4, ["gezi_guihang", "gezi_wujian"], ['minskin', 'stone'], [3, 4]],
			eiki: ["female", "qun", 4, ["gezi_huiwu", "gezi_caijue", "gezi_shenpan"], ['minskin', 'stone'], [3, 4]],
			aya: ["female", "qun", 4, ["gezi_kuanglan", "gezi_fengmi"], ['minskin', 'stone'], [3, 4]],
			hetate: ["female", "qun", 3, ["gezi_nianxie", "gezi_jilan", "gezi_lianxu"], ['minskin', 'stone'], [3, 4]],
			renko: ["female", "qun", 3, ["gezi_xingdu", "gezi_sihuan"], ['minskin', 'stone'], [3, 4]],
			meribel: ["female", "qun", 3, ["gezi_xijian", "gezi_rumeng"], ['minskin', 'stone'], [3, 4]],
		}
		var list = {
			rumia: "露米娅",
			meiling: "美铃",
			koakuma: "小恶魔",
			patchouli: "帕秋莉",
			sakuya: "咲夜",
			remilia: "蕾米莉亚",
			flandre: "芙兰朵露",
			cirno: "琪露诺",
			daiyousei: "大妖精",
			suika: "萃香",
			mystia: "米斯蒂娅",
			keine: "慧音",
			reimu: "灵梦",
			marisa: "魔理沙",
			tewi: "帝",
			reisen: "铃仙",
			eirin: "永琳",
			kaguya: "辉夜",
			mokou: "妹红",
			letty: "蕾蒂",
			chen: "橙",
			alice: "爱丽丝",
			lilywhite: "莉莉白",
			yuyuko: "幽幽子",
			alice: "爱丽丝",
			youmu: "妖梦",
			ran: "蓝",
			yukari: "紫",
			lilyblack: "莉莉黑",
			medicine: "梅蒂欣",
			yuuka: "幽香",
			komachi: "小町",
			eiki: "映姬",
			aya: "文",
			hetate: "果",
			renko: "莲子",
			meribel: "梅莉",
			mode_extension_stone_df_character_config: '车万',
		};
		for (var k in list) {
			lib.translate[k] = lib.translate[k] || list[k];
		}
		// lib.careerList.push('chewan');
		var i, j, name;
		for (var i in lib.characterPack.mode_extension_stone_df) {
			lib.character[i] = lib.characterPack.mode_extension_stone_df[i];
			lib.characterPack.mode_extension_stone_df[i][4].push('ext:东方project/gezi_' + i + '.jpg');
			if (lib.characterPack.mode_extension_stone_df[i][4].includes('stonespecial')) continue;
			lib.character[i][3].add('stonesha');
			lib.character[i][3].add('stoneshan');
			lib.character[i][3].add('stonedraw');
			name = i + '_stonecharacter';
			lib.card[name] = {
				image: 'ext:/东方project/gezi_' + i + '.jpg',
				stoneact: lib.character[i][5][0],
				career: lib.character[i][5][2] || null
			};
			for (j in lib.element.stonecharacter) {
				lib.card[name][j] = lib.element.stonecharacter[j];
			}
			lib.translate[name] = get.translation(i);
			lib.translate[name + '_info'] = get.skillintro(i);
			if (lib.character[i][4].includes('stonehidden')) {
				lib.card[name].stonehidden = true;
				continue;
			}
		}
	}
	//闯关角色
	if (get.mode() == 'stg') {
		lib.characterPack.mode_extension_stg = {
			stg_scarlet: ['male', 'wei', 0, ['dongfang_hongwu'], ['boss', 'chuangguan']],
			stg_scarlet_ex: ['female', 'wei', 0, ['dongfang_hongwu_ex'], ['boss', 'chuangguan']],
			stg_cherry: ['male', 'wei', 0, ['boss_cherry'], ['boss', 'chuangguan']],
			stg_maoyu: ['male', 'wei', 2, [], ['hiddenboss', 'bossallowed']],
			stg_yousei: ['female', 'wei', 1, [], ['hiddenboss', 'bossallowed']],
			stg_maid: ['female', 'wei', 1, ['saochu'], ['hiddenboss', 'bossallowed']],
			stg_bat: ['female', 'wei', 1, ['xixue'], ['hiddenboss', 'bossallowed']],
			stg_ghost: ['female', 'shu', 1, ['stg_ghost_skill'], ['hiddenboss', 'bossallowed']],
			stg_puppet: ['female', 'wei', 1, ['stg_shanghai_skill'], ['hiddenboss', 'bossallowed']],
			stg_shanghai: ['female', 'shu', 1, ['stg_shanghai_shanghai_skill'], ['hiddenboss', 'bossallowed']],
			//stg_bunny:['female','2',2,[],['hiddenboss','bossallowed']],
			stg_youmu: ['female', 'wu', 4, ["gezi_yishan", "gezi_yinhuashan"], ["des:全名魂魄妖梦。冥界白玉楼的庭师（同时也是女仆，厨师，剑术指导）。是半人半幽灵的混血，因此持有更长的寿命和更强的身体能力。使用楼观剑和白楼剑的二刀流剑豪。", 'hiddenboss', 'bossallowed']],
		}
		for (var i in lib.characterPack.mode_extension_stg) {
			lib.character[i] = lib.characterPack.mode_extension_stg[i];
			lib.characterPack.mode_extension_stg[i][4].push('ext:东方project/' + i + '.jpg');
			lib.characterPack.mode_extension_stg[i][4].push('die:ext:东方project/' + i + '.mp3');
			if (lib.config.forbidai_user.includes(i)) {
				lib.config.forbidai.push(i);
			}
		}
	}
	if (get.mode() == 'chess') {
		lib.characterPack.mode_extension_chess_df = {
			treasure_paimaiyunshi: ['male', 'qun', 3, ['paimaiyunshi'], ['des:虽然陨石很值钱，但也不要冒着生命危险去捡啊……']],
			treasure_jiqitou: ['male', 'qun', 3, ['jiqitou'], ['des:“这个石头有神奇的，治愈人心的力量！”<br>“这就是你用300块钱换了块石头的理由吗……”']],
			treasure_shenmiR18: ['female', 'qun', 3, ['shenmiR18'], ['des:规则34：凡是存在的东西，都有R18表现<br>画师：メンヤンん']],
			treasure_shrine1: ['female', 'qun', 3, ['shrine1'], ['des:“只要信仰了，每个月都有会员活动，年度烟火表演，还可以买到巫女的泳装照片集……怎么，太过分了？”<br>画师：朱シオ']],
			treasure_shrine2: ['female', 'qun', 3, ['shrine3'], ['des:“所以你的神社到底是供奉谁的？”<br>“我也想知道啊？！”<br>画师：kirero']],
		}
	}
	if (get.mode() == 'chess') {
		for (var i in lib.characterPack.mode_extension_chess_df) {
			lib.character[i] = lib.characterPack.mode_extension_chess_df[i];
			lib.characterPack.mode_extension_chess_df[i][4].push('ext:东方project/' + i + '.jpg');
			lib.characterPack.mode_extension_chess_df[i][4].push('die:ext:东方project/' + i + '.mp3');
			if (lib.config.forbidai_user.includes(i)) {
				lib.config.forbidai.push(i);
			}
		}
	}
	var list = {
		gezi_nurseryrhyme: '童谣',
		gezi_daria: '多萝西',
		gezi_rylai: '莉莱',
		gezi_jack: '开膛手杰克',
		gezi_yuuko: '有子',
		gezi_haruhi: '春日',
		gezi_monika: '莫妮卡',
		gezi_diva: '美九',
		gezi_aqua: '阿库娅',
		gezi_tohka: '十香',
		gezi_kanade: '奏',
		gezi_nero: '尼禄',
		gezi_nerowedding: '花嫁尼禄',
		gezi_nerowedding_ab: '尼禄',
		gezi_illyasviel: '伊莉雅',
		gezi_bb: 'BB',
		gezi_kurumi: '狂三',
		gezi_sinon: '诗乃',
		gezi_scathach: '斯卡哈',
		gezi_miku: '初音',
		gezi_kuro: '克洛伊',
		gezi_twob: '2B',
		gezi_homura: '焰',
		gezi_shigure: '时雨',
		gezi_yudachi: '夕立',
		gezi_m4a1: 'M4A1',
		gezi_megumin: '惠惠',
		gezi_liuhua: '六花',
		gezi_satone: '七宫',
		gezi_yuri: "由理",
		gezi_priestress: "女神官",
		gezi_tamamo: "玉藻前",
		gezi_aliceWLD: "爱丽丝",
		gezi_arisa: "亚里沙",
		gezi_tsubaki: "椿",
		gezi_hechenghequ: '河城荷取',
		aventurinepurple: "八云紫",
		gezi_lingliaolukong: "灵乌路空",
		gezi_dio: "迪奥",
		stg_bookshelf: "魔导书塔",
		treasure_paimaiyunshi: '流星雨',
		treasure_jiqitou: '集气石',
		treasure_shenmiR18: '黑洞',
		treasure_shrine1: '守矢神社',
		treasure_shrine2: '博丽神社',
		re_lunasa: "露娜萨",
		re_merlin: "梅露兰",
		re_lyrica: "莉莉卡",
		gezi_fapaiji: '发牌姬',
		boss_cirno: '琪露诺',
		boss_cirno2: '琪露诺',
		boss_mokou: '妹红',
		boss_mokou2: '妹红',
		gezi_rimuru: '利姆露',
		niuzhanshi: '？',
		mordred: '莫德雷德',
		blackmagicgirl: '黑魔术少女',
		gezi_rin: '凛',
		gezi_FSakura: '樱',
		gezi_saber: '阿尔托莉雅',
		gezi_saberlily: '阿尔托莉雅Lily',
		gezi_saberlily_ab: '阿尔托莉雅',
		boss_nianshou: '年兽',
		gezi_JoanofArc: '贞德',
		gezi_xiandai: '先代',
		mode_extension_chess_df_character_config: '东方战旗',
		mode_extension_library_luanru_character_config: '乱入角色',
		mode_extension_library_character_config: '采花集',
		mode_extension_mingzhi_character_config: '明置角色',
	}
	for (var j in list) {
		lib.translate[j] = lib.translate[j] || list[j];
	}
	for (var i in lib.characterPack.mode_extension_library_luanru) {
		lib.character[i] = lib.characterPack.mode_extension_library_luanru[i];
		lib.characterPack.mode_extension_library_luanru[i][4].push('ext:东方project/' + i + '.jpg');
		lib.characterPack.mode_extension_library_luanru[i][4].push('die:ext:东方project/' + i + '.mp3');
		if (lib.config.forbidai_user.includes(i)) {
			lib.config.forbidai.push(i);
		}
	}
	for (var i in lib.characterPack.mode_extension_library) {
		lib.character[i] = lib.characterPack.mode_extension_library[i];
		lib.characterPack.mode_extension_library[i][4].push('ext:东方project/' + i + '.jpg');
		lib.characterPack.mode_extension_library[i][4].push('die:ext:东方project/' + i + '.mp3');
		if (lib.config.forbidai_user.includes(i)) {
			lib.config.forbidai.push(i);
		}
	}


	/*-----------------------------------------杂七杂八的函数什么的-----------------------------------------*/
	//牌堆替换
	game.removenCard = function (name, replace) {
		for (var i = 0; i < lib.card.list.length; i++) {
			if (lib.card.list[i][2] == name) {
				if (replace) {
					var c = lib.card.list[i];
					c[2] = replace;
					lib.card.list.push(c);
				}
				lib.card.list.splice(i--, 1);
			}
		}
		var list = [];
		for (var i = 0; i < ui.cardPile.childElementCount; i++) {
			if (ui.cardPile.childNodes[i].name == name) {
				if (replace) {
					ui.cardPile.replaceChild(game.createCard(replace, ui.cardPile.childNodes[i].suit, ui.cardPile.childNodes[i].number), ui.cardPile.childNodes[i]);
				} else {
					list.push(ui.cardPile.childNodes[i]);
				}
			}
		}
		for (var i = 0; i < list.length; i++) {
			list[i].remove();
		}
	}
	lib.skill._gezizhengwangxiangguan = {
		trigger: {
			player: 'dieBegin',
		},
		priority: 2,
		forced: true,
		unique: true,
		frequent: true,
		content: function () {
			//game.playAudio('..', 'extension', '东方project', trigger.player.name);
			if (player.node.lili) {
				player.node.lili.hide();
			}
			if (player.node.fuka) {
				player.node.fuka.hide();
			}
			if (player.hasJinengpai()) {
				var cards = player.getJinengpai();
				for (var i = 0; i <= cards.length; i++) {
					if (cards[i]) {
						player.removeJudgen(cards[i]);
					}
				}
			}
		},
	}
	lib.skill.teshuchuwai = {
		init: function (player) {
			player.classList.add('out');
			player.hide();
		},
		onremove: function (player) {
			player.classList.remove('out');
			player.show();
		},
		mod: {
			cardEnabled: function () {
				return false;
			},
			cardSavable: function () {
				return false;
			},
			targetEnabled: function () {
				return false;
			}
		},
		mark: true,
		intro: {
			content: '视为不在游戏内'
			// 那么应该使用game.player.isOut()之类的么？
		},
		group: ['undist', 'mianyi', 'qianxing'],
		trigger: { player: 'phaseBefore' },
		priority: 130,
		content: function () {
			trigger.cancel();
			player.phaseSkipped = true;
		},
	}
	lib.translate.teshuchuwai = '特殊除外';
	lib.element.player.addnSkill = function (skill, checkConflict, nobroadcast) {
		if (Array.isArray(skill)) {
			for (var i = 0; i < skill.length; i++) {
				this.addnSkill(skill[i]);
			}
		}
		else {
			if (this.skills.includes(skill)) return;
			var info = lib.skill[skill];
			if (!info) return;
			if (!nobroadcast) {
				game.broadcast(function (player, skill) {
					player.skills.add(skill);
				}, this, skill);
			}
			this.skills.add(skill);
			this.addSkillTrigger(skill);
			if (this.awakenedSkills.includes(skill)) {
				this.awakenSkill(skill);
				return;
			}
			if (info.init2 && !_status.video) {
				info.init2(this, skill);
			}
			if (info.mark) {
				if (info.mark == 'card' &&
					get.itemtype(this.storage[skill]) == 'card') {
					this.markSkill(skill, null, this.storage[skill]);
				}
				else if (info.mark == 'card' &&
					get.itemtype(this.storage[skill]) == 'cards') {
					this.markSkill(skill, null, this.storage[skill][0]);
				}
				else if (info.mark == 'image') {
					this.markSkill(skill, null, ui.create.card(null, 'noclick').init([null, null, skill]));
				}
				else if (info.mark == 'character') {
					var intro = info.intro.content;
					if (typeof intro == 'function') {
						intro = intro(this.storage[skill], this);
					}
					else if (typeof intro == 'string') {
						intro = intro.replace(/#/g, this.storage[skill]);
						intro = intro.replace(/&/g, get.cnNumber(this.storage[skill]));
						intro = intro.replace(/\$/g, get.translation(this.storage[skill]));
					}
					var caption;
					if (typeof info.intro.name == 'function') {
						caption = info.intro.name(this.storage[skill], this);
					}
					else if (typeof info.intro.name == 'string') {
						caption = info.name;
					}
					else {
						caption = get.translation(skill);
					}
					this.markSkillCharacter(skill, this.storage[skill], caption, intro);
				}
				else {
					this.markSkill(skill);
				}
			}
		}
		if (checkConflict) this.checkConflict();
		return skill;
	}
	lib.game.addnSkill = function (name, info, translate, description) {
		if (lib.skill[name]) {
			return false;
		}
		if (typeof info.audio == 'number' || typeof info.audio == 'boolean') {
			info.audio = 'ext:' + _status.extension + ':' + info.audio;
		}
		lib.skill[name] = info;
		lib.translate[name] = translate;
		lib.translate[name + '_info'] = description;
		return true;
	}


	/*-----------------------------------------部分翻译和按钮设置-----------------------------------------*/
	//按钮控制
	_status.gezidedongfanglili = config.gezidedongfanglili;
	_status.gezidedongfangliliguozhan = config.gezidedongfangliliguozhan;
	_status.gezidelilistyle = config.gezidelilistyle;
	_status.mingzhiBool = config.mingzhiBool;
	_status.yibianmoshi = config.yibianmoshi;
	_status.stonetrans = config.stonetrans;
	lib.translate.jinjipai = "禁忌";
	lib.translate.throw_gungir = "丢弃武器";
	lib.translate.lose_lili = "失去灵力";
	lib.translate.end_phase = "结束阶段";
	lib.translate.phaseJudge = "判定阶段";
	lib.translate.phaseDraw = "摸牌阶段";
	lib.translate.phaseUse = "出牌阶段";
	lib.translate.phaseDiscard = "弃牌阶段";
	lib.translate.phaseDraw_gezi_qiyao = "跳过摸牌阶段，视为使用一张非延时锦囊牌";
	lib.translate.phaseUse_gezi_qiyao = "跳过出牌阶段，将一张牌当作一张非延时锦囊牌使用";
	lib.translate.phaseDiscard_gezi_qiyao = "跳过弃牌阶段并消耗1点灵力，获得一张【贤者之石】";
	lib.translate.cuiji_lili = "消耗2点灵力，回复1点体力";
	lib.translate.cuiji_hp = "失去1点体力，获得2点灵力";
	lib.translate.yibianpai = "异变";
	lib.translate.draw_spin = "摸牌并置于一张牌";
	lib.translate.jinengpai = "技能";
	lib.translate.extra_target = "额外目标";
	lib.translate.ADA2_backup = "扫荡的黄金剧场";
	lib.translate.gezi_time4_backup = "保存（取）";
	lib.translate.tutorial = "教程";


	/*-----------------------------------------不知道是干什么的-----------------------------------------*/
	//配合河城河曲
	game.removeGlobalSkill('qianghua_wuzhong');
	game.removeGlobalSkill('qianghua_shunshou');
	game.removeGlobalSkill('qianghua_guohe');
	game.removeGlobalSkill('qianghua_jinnang');
	lib.rank.rarity.junk.addArray(["gezi_flandre", "gezi_remilia", "gezi_wriggle", "gezi_tewi", "gezi_letty", "gezi_lilywhite", "gezi_lilyblack", "gezi_yuuka", "gezi_komachi", "gezi_illyasviel", "gezi_scathach", "gezi_miku", "gezi_twob", "gezi_liuhua", "gezi_yuri", "gezi_arisa", "gezi_hechenghequ", "gezi_Nyaruko"]);//A
	lib.rank.rarity.rare.addArray(["gezi_mystia", "gezi_keine", "gezi_reimu", "gezi_marisa", "gezi_eirin", "gezi_eiki", "gezi_lyrica", "gezi_hetate", "gezi_kanade", "gezi_sinon", "gezi_megumin", "aventurinepurple"]);//S
	lib.rank.rarity.epic.addArray(["gezi_lunasa", "gezi_koakuma", "gezi_sakuya", "gezi_remilia", "gezi_aya", "gezi_tsubaki", "stg_bookshelf", "gezi_kezi"]);//SS
	lib.rank.rarity.legend.addArray(['gezi_yuyuko', "gezi_kuro", "gezi_lingliaolukong", "gezi_dio"]);//SSS
}
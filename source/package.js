import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export const ext_package = {
    character: {
		character: {
		},
	},
	card: {
		card: {
			/*-------------------锦囊牌-------------------*/
			//突击采访
			"gezi_caifang": {
				audio: "gezi_caifang",
				fullskin: true,
				type: "trick",
				enhance: 1,
				enable: true,
				filterTarget: function (card, player, target) {
					return player != target;
				},
				content: function () {
					"step 0"
					if (player.name == 'gezi_aya' && target.sex == 'female') player.say('啊呀呀，今天你的胖次是什么颜色的呢？');
					else if (target.sex == 'female') player.say('打扰了，请问你的胖次是什么颜色的呢？(￣y▽￣)~*捂嘴偷笑');
					var controls = [];
					if (target.identityShown != true) {
						if (player.storage._enhance) {
							controls.push('展示手牌并明置身份');
						} else {
							if (target.identityShown != true) controls.push('明置身份');
							controls.push('展示手牌');
						}
					} else {
						if (player.storage._enhance) {
							controls.push('展示手牌并揭露弱点');
						} else {
							controls.push('揭露弱点');
							controls.push('展示手牌');
						}
					}
					target.chooseControl(controls, function (event, player) {
						if (controls.contains('展示手牌并明置身份')) return '展示手牌并明置身份';
						if (controls.contains('展示手牌并揭露弱点')) return '展示手牌并揭露弱点';
						return '展示手牌';
					});
					"step 1"
					if (result.control == '揭露弱点') {
						target.addSkill('gezi_ruodianjielu');
						if (!target.storage.gezi_ruodianjielu) {
							target.storage.gezi_ruodianjielu = 0;
						}
						target.storage.gezi_ruodianjielu++;
						target.markSkill('gezi_ruodianjielu');
					}
					if (result.control == '展示手牌并揭露弱点') {
						target.showCards(target.get('h'));
						player.draw();
						target.addSkill('gezi_ruodianjielu');
						if (!target.storage.gezi_ruodianjielu) {
							target.storage.gezi_ruodianjielu = 0;
						}
						target.storage.gezi_ruodianjielu++;
						if (player.storage._enhance && player.storage._enhance > 1) {
							for (var i = 1; i < player.storage._enhance; i++) {
								target.storage.gezi_ruodianjielu++;
							}
						}
						target.markSkill('gezi_ruodianjielu');
					}
					if (result.control == '展示手牌并明置身份') {
						target.showCards(target.get('h'));
						player.draw();
						if ((_status.yibianmoshi == true && get.mode() == 'identity') || get.mode() == 'stg') {
							target.useSkill('_tanpai');
						} else {
							try {
								target.showIdentity();
							} catch (e) {
								target.addSkill('gezi_ruodianjielu');
								if (!target.storage.gezi_ruodianjielu) {
									target.storage.gezi_ruodianjielu = 0;
								}
								target.storage.gezi_ruodianjielu++;
								target.markSkill('gezi_ruodianjielu');
							}
						}
						if (player.storage._enhance && player.storage._enhance > 1) {
							target.addSkill('gezi_ruodianjielu');
							if (!target.storage.gezi_ruodianjielu) {
								target.storage.gezi_ruodianjielu = 0;
							}
							for (var i = 1; i < player.storage._enhance; i++) {
								target.storage.gezi_ruodianjielu++;
							}
							target.markSkill('gezi_ruodianjielu');
						}
					}
					if (result.control) {
						if (result.control == '展示手牌') {
							target.showCards(target.get('h'));
							player.draw();
						}
						if (result.control == '明置身份') {
							if ((_status.yibianmoshi == true && get.mode() == 'identity') || get.mode() == 'stg') {
								target.useSkill('_tanpai');
							} else {
								try {
									target.showIdentity();
								} catch (e) {
									target.addSkill('gezi_ruodianjielu');
									if (!target.storage.gezi_ruodianjielu) {
										target.storage.gezi_ruodianjielu = 0;
									}
									target.storage.gezi_ruodianjielu++;
									target.markSkill('gezi_ruodianjielu');
								}
							}
						}
					}
				},
				ai: {
					order: 7.5,
					useful: 5,
					value: 5,
					wuxie: function (target, card, player, viewer) {
						return 0;
					},
					result: {
						target: function (player, target) {
							if (ai.get.attitude(player, target) <= 0) return (target.countCards('h')) ? -1.5 : 0;
							return -get.attitude(player, target);
						},
					},
					tag: {
						draw: 1,
					},
				},
			},
			//弹幕狂欢
			"gezi_danmakucraze": {
				audio: "gezi_danmakucraze",
				fullskin: true,
				type: "trick",
				enable: true,
				enhance: 1,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					if (target.name == 'gezi_flandre') {
						target.say('哈哈哈哈哈哈，来玩个够吧！');
					}
					if (player.storage._enhance) {
						for (var i = 0; i < player.storage._enhance; i++) {
							target.draw(1);
						}
					}
					target.addTempSkill('danmaku_skill');
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (ai.get.attitude(viewer, target) < 0 && target.countCards('h', {
							name: 'sha'
						}) > 1) return 10;
						return 0;
					},
					basic: {
						order: 7.2,
						useful: 4,
						value: 5,
					},
					result: {
						target: function (player, target) {
							if (player.countCards('h', {
								name: 'sha'
							}) < 1) return 0;
							return 1;
						},
					},
					tag: {
						draw: 0.5,
					},
				},
			},
			//博丽例大祭
			"gezi_reidaisai": {
				audio: "gezi_reidaisai",
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				contentBefore: function () {
					if (player.name == 'gezi_reimu') {
						player.say('博丽神社例大祭开始啦！欢迎光临欢迎光临！赛钱箱在这边！');
					}
				},
				content: function () {
					'step 0'
					target.draw();
					target.chooseCardTarget({
						selectCard: 1,
						position: 'he',
						filterTarget: function (card, player, target) {
							return player != target;
						},
						ai1: function (card) {
							return get.unuseful(card) + 9;
						},
						ai2: function (target) {
							return ai.get.attitude(_status.event.player, target);
						},
						prompt: '你送给别人一张牌!'
					});
					'step 1'
					if (result.targets && result.targets[0]) {
						result.targets[0].gain(result.cards);
						target.$give(result.cards.length, result.targets[0]);
						target.addExpose();
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (game.countPlayer(function (current) {
							return ai.get.attitude(viewer, current) <= 0;
						}) == 1) {
							return 0;
						};
						if (ai.get.attitude(viewer, target) <= 0 && target.countCards('e', function (card) {
							return get.value(card) > 0;
						})) {
							if (Math.random() < 0.5) return 0;
							return 1;
						}
						return 0;
					},
					basic: {
						order: 5,
						useful: 1,
						value: 1,
					},
					result: {
						target: function (player, target) {
							return 1;
						},
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			//守矢例大祭
			"gezi_reidaisai2": {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: [1, Infinity],
				filterTarget: function (card, player, target) {
					return target.identity != player.identity;
				},
				contentBefore: function () {
					if (player.name == 'gezi_sanae') {
						player.say('守矢神社例大祭开始啦！我们可比那个穷酸的神社好玩多了！');
					}
				},
				content: function () {
					target.draw();
				},
				contentAfter: function () {
					'step 0'
					player.draw(targets.length + 1);
					'step 1'
					event.cards = result;
					'step 2'
					player.chooseCardTarget({
						filterCard: function (card) {
							return _status.event.getParent().cards.contains(card);
						},
						selectCard: [1, event.cards.length],
						filterTarget: function (card, player, target) {
							return player != target;
						},
						ai1: function (card) {
							if (ui.selected.cards.length > 0) return -1;
							if (card.name == 'du') return 20;
							return (_status.event.player.countCards('h') - _status.event.player.hp);
						},
						ai2: function (target) {
							var att = get.attitude(_status.event.player, target);
							if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
								return 1 - att;
							}
							if (_status.currentPhase == player) att += 6;
							return att - 4;
						},
						prompt: '请选择要送人的卡牌（点取消停止送牌）。'
					});
					'step 3'
					if (result.targets && result.targets[0]) {
						player.line(result.targets, 'green');
						result.targets[0].gain(result.cards, player);
						player.$give(result.cards.length, result.targets[0]);
						for (var i = 0; i < result.cards.length; i++) {
							event.cards.remove(result.cards[i]);
						}
						if (event.cards.length) event.goto(2);
					}
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (game.countPlayer(function (current) {
							return ai.get.attitude(viewer, current) <= 0;
						}) == 1) {
							return 0;
						};
						if (ai.get.attitude(viewer, target) <= 0) {
							if (Math.random() < 0.5) return 0;
							return 1;
						}
						return 0;
					},
					basic: {
						order: 5,
						useful: 1,
						value: 1,
					},
					result: {
						target: function (player, target) {
							return 1;
						},
						player: function (player, target) {
							return 2;
						},
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			//坦诚相待
			"gezi_tancheng": {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards('h');
				},
				content: function () {
					'step 0'
					target.showCards(target.get('h'));
					'step 1'
					player.chooseCard('你可以用一张牌交换' + get.translation(target) + '一张不同类型的牌', 1, function (card) {
						return target.countCards('h') > target.countCards('h', {
							type: get.type(card)
						})
					}).ai = function (card) {
						var val = get.value(card);
						if (val < 0) return 10;
						return 6 - val;
					};
					"step 2"
					if (result.bool) {
						event.card = result.cards[0];
						target.gain(result.cards);
					} else {
						event.finish();
					}
					"step 3"
					player.chooseCardButton(target.get('h'), '获得一张牌', 1, true).set('filterButton', function (button) {
						return get.type(button.link) != get.type(event.card);
					}).ai = function (button) {
						var val = get.value(button.link);
						if (val < 0) return -10;
						return val;
					}
					if (player == game.me && !event.isMine()) {
						game.delay(0.5);
					}
					"step 4"
					player.gain(result.links);
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (game.countPlayer(function (current) {
							return ai.get.attitude(viewer, current) <= 0;
						}) == 1) {
							return 0;
						};
						if (ai.get.attitude(viewer, target) <= 0 && target.countCards('e', function (card) {
							return get.value(card) > 0;
						})) {
							if (Math.random() < 0.5) return 0;
							return 1;
						}
						return 0;
					},
					basic: {
						order: 5,
						useful: 5,
						value: 6,
					},
					result: {
						target: function (player, target) {
							return -0.5;
						},
						player: function (player, target) {
							return 1;
						},
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			//许愿术
			"gezi_xuyuanshu": {
				fullskin: true,
				type: "trick",
				enable: true,
				enhance: 1,
				toself: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					'step 0'
					target.$skill('许愿术', null, null, true);
					var num = 1;
					if (player.storage._enhance) {
						for (var i = 0; i < player.storage._enhance; i++) {
							num--;
						}
					}
					event.num = num;
					'step 1'
					if (event.num > 2) {
						event.finish();
					}
					'step 2'
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;

						if (lib.card[i].type == 'trick') {
							list.add(i);
						}
						list.remove('gezi_xuyuanshu');
						list.remove('chuansongmen');
					}
					if (list.length) {
						var gained = game.createCard(list.randomGet());
						gained._destroy = true;
						target.gain(gained, 'gain2')._triggered = null;
					}
					if (lib.filter.filterCard(gained, target, event.getParent(2))) {
						var next = target.chooseToUse();
						next.filterCard = function (card) {
							return card == gained;
						};
						next.prompt = '是否使用' + get.translation(gained) + '？';
					} else {
						if (num != 2) {
							player.draw(2 - num);
						}
						event.finish();
					}
					'step 3'
					if (result.bool) {
						event.num++;
						event.goto(1);
					} else {
						if (num != 2) {
							player.draw(2 - num);
						}
						event.finish();
					}
				},
				ai: {
					order: 8.2,
					value: [6, 2],
					useful: 5,
					result: {
						target: 3,
					},
				},
			},
			//拨雾开天
			"stg_bawu": {
				audio: true,
				fullskin: true,
				type: "trick",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				contentBefore: function () {
					player.$skill('拔雾开天');
				},
				content: function () {
					'step 0'
					if (target.name == 'gezi_remilia') {
						target.say('等下，我为什么要解我自己的雾？');
					}
					target.chooseControl('回复1点体力，获得圣盾', '摸1张牌，获得连击', true).set('ai', function () {
						if (target.countCards('h', {
							name: 'sha'
						}) > 1) return '摸1张牌，获得连击';
						if (target.isHealthy()) return '摸1张牌，获得连击';
						return '回复1点体力，获得圣盾';
					}).set('prompt', '拔雾开天：选择一项：');
					'step 1'
					if (result.control == '回复1点体力，获得圣盾') {
						target.recover();
						target.addJudgen(game.createCard('gezi_shengdun', '', ''));
					} else if (result.control == '摸1张牌，获得连击') {
						target.draw();
						target.addJudgen(game.createCard('gezi_lianji', '', ''));
					}
				},
				ai: {
					basic: {
						order: 7.4,
						useful: 4,
						value: 6.8,
					},
					result: {
						target: 2,
					},
					tag: {
						recover: 1,
					},
				},
			},
			/*-------------------武器牌-------------------*/
			//八卦炉MK
			"gezi_bagua": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["gezi_bagua_skill"],
			},
			//白楼剑
			"gezi_bailou": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						order: 4,
						equipValue: 3,
					},
				},
				skills: ["bailou_skill"],
			},
			//凤蝶纹扇
			"gezi_deathfan": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 5,
					},
				},
				skills: ["deathfan_skill"],
			},
			//神枪冈格尼尔
			"gezi_gungnir": {
				audio: true,
				fullskin: true,
				destroy: "gezi_gungirs",
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -3,
				},
				ai: {
					basic: {
						equipValue: 1,
					},
				},
				skills: ["gungnir_skill"],
			},
			//八卦炉
			"gezi_hakkero": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -2,
				},
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["hakkero_skill", "hakkero_skill2"],
			},
			//魔剑莱瓦汀
			"gezi_laevatein": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 3,
					},
				},
				skills: ["laevatein_skill"],
			},
			//楼观剑
			"gezi_louguan": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["louguan_skill"],
			},
			//魔法飞弹
			"gezi_missile": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["gezi_missile_skill"],
			},
			//封魔针
			"gezi_needle": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["gezi_needle_skill"],
			},
			//风神团扇
			"gezi_windfan": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["windfan_skill"],
			},
			//无情驱魔棒
			"gezi_wuqingqumobang": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -2,
				},
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				skills: ["gezi_wuqingqumobang"],
			},
			//阴阳飞鸟井
			"gezi_yinyangfeiniao": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				skills: ["gezi_yinyangfeiniao"],
			},
			//鬼神阴阳玉
			"gezi_yinyangyuguishen": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["gezi_yinyangyuguishen_skill", "gezi_yinyangyuguishen_skill2"],
			},
			//净颇梨之镜
			"gezi_zhiyuu": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["zhiyuu_skill"],
			},
			//金魔导书
			"stg_goldbook": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_goldbook_skill"],
			},
			//阴阳飞鸟井
			"gezi_yinyangfeiniao": {
				fullskin: true,
				type: "equip",
				subtype: "equip1",
				distance: {
					attackFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				skills: ["gezi_yinyangfeiniao"],
			},
			/*-------------------防具牌-------------------*/
			//替身人形
			"gezi_hourai": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				ai: {
					basic: {
						equipValue: 7,
					},
				},
				skills: ["hourai_skill"],
			},
			//人魂灯
			"gezi_lantern": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				skills: ["lantern_skill"],
			},
			//八咫镜
			"gezi_mirror": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				ai: {
					basic: {
						equipValue: 7.5,
					},
				},
				skills: ["mirror_skill"],
			},
			//阴阳玉
			"gezi_yinyangyu": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["yinyangyu_skill_1", "yinyangyu_skill_2"],
			},
			//水魔导书
			"stg_waterbook": {
				fullskin: true,
				type: "equip",
				subtype: "equip2",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_waterbook_skill"],
			},
			/*-------------------防御马-------------------*/
			//冰镇青蛙
			"gezi_frog": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip3",
				distance: {
					globalTo: 1,
				},
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					if (target.countCards('e') > 0) {
						player.discardPlayerCard(target, 'e');
					}
					target.equip(event.card);
					ui.update();
					player.update();
				},
				skills: ["frog_skill"],
				ai: {
					basic: {
						order: 5,
						useful: [3, 1],
						value: 0,
						equipValue: 1,
					},
					result: {
						target: function (player, target) {
							if (target.countCards('e')) return -3;
						},
					},
					tag: {
						thunderdamage: 1,
					},
				},
			},
			//土魔导书
			"stg_dirtbook": {
				fullskin: true,
				type: "equip",
				subtype: "equip3",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_dirtbook_skill"],
			},
			/*-------------------进攻马-------------------*/
			//月时计
			"gezi_lunadial": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip4",
				distance: {
					globalFrom: -1,
				},
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["lunadial_skill"],
			},
			//木魔导书
			"stg_woodbook": {
				fullskin: true,
				type: "equip",
				subtype: "equip4",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_woodbook_skill"],
			},
			/*-------------------宝物牌-------------------*/
			//魔导书
			"gezi_book": {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 5.2,
					},
				},
				skills: ["book_skill"],
			},
			//蓬莱玉枝
			"gezi_houraiyuzhi": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["houraiyuzhi_skill"],
			},
			//伊吹瓢
			"gezi_ibuki": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["ibuki_skill"],
			},
			//蓝白胖次
			"gezi_pantsu": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				onLose: function () {
					if (player.sex == 'female') player.say('我的胖次！变态！');
				},
				ai: {
					basic: {
						equipValue: 2,
					},
				},
				skills: ["pantsu_skill", "pantsu_skill2"],
			},
			//塞钱箱
			"gezi_saiqianxiang": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 4,
					},
				},
				skills: ["saiqian_skill", "saiqian_skill3"],
			},
			//贤者之石
			"gezi_stone": {
				audio: true,
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 5,
					},
				},
				skills: ["stone_skill"],
			},
			//魔术卡片
			"stg_deck": {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_deck_skill"],
			},
			//火魔导书
			"stg_firebook": {
				fullskin: true,
				type: "equip",
				subtype: "equip5",
				ai: {
					basic: {
						equipValue: 6,
					},
				},
				skills: ["stg_firebook_skill"],
			},
			/*-------------------禁忌牌-------------------*/
			//冰域之宴
			"gezi_bingyu": {
				audio: "gezi_bingyu",
				fullskin: true,
				type: "jinjipai",
				chongzhu: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				contentBefore: function () {
					player.$skill('冰域之宴', null, null, true);
				},
				content: function () {
					if (target == player) target.addnSkill('bingyu2');
				},
				contentAfter: function () {
					player.markSkill('bingyu1');
				},
				ai: {
					basic: {
						order: 1,
						useful: [3, 1],
						value: [3, 1],
					},
					result: {
						target: function (player, target) {
							return (target.hp < 2) ? 2 : 0;
						},
					},
					tag: {
						recover: 0.5,
						multitarget: 1,
					},
				},
			},
			//废线电车
			"gezi_dianche": {
				audio: true,
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return player != target;
				},
				contentBefore: function () {
					player.$skill('废线电车', null, null, true);
				},
				content: function () {
					'step 0'
					target.chooseControl(['弃置三张牌', get.translation(player) + '以外角色各弃置两张牌'], function (event, player) {
						var good = target.getFriends().length;
						var bad = target.getEnemies().length - 1;
						if (bad > good) return get.translation(player) + '以外角色各弃置两张牌';
						if (target.identity == 'zhu' && get.mode() == 'identity') return get.translation(player) + '以外角色各弃置两张牌';
						else {
							if (target.countCards('he') < 3) return '弃置三张牌';
							else return get.translation(player) + '以外角色各弃置两张牌';
						}
						return '弃置三张牌';
					});
					'step 1'
					if (result.control) {
						if (result.control == '弃置三张牌') {
							target.chooseToDiscard(3, 'he', true);
						} else {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i] == player) continue;
								players[i].chooseToDiscard(2, 'he', true);
							}
						}
					}
				},
				ai: {
					value: 6,
					useful: [7, 1],
					result: {
						player: 0.5,
						target: function (player, target) {
							if (target.hasSkillTag('noh')) return 0.1;
							switch (target.countCards('h')) {
								case 0:
									return 0;
								case 1:
									return 0;
								case 2:
									return -2;
								default:
									return -3;
							}
						},
					},
					order: 9,
					tag: {
						loseCard: 2.5,
						discard: 1,
					},
				},
			},
			//幻想之扉
			"gezi_huanxiang": {
				audio: "gezi_huanxiang",
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				contentBefore: function () {
					player.$skill('幻想之扉', null, null, true);
				},
				content: function () {
					target.draw();
					target.useSkill('gezi_jinengpai_use');
				},
				ai: {
					basic: {
						order: 4,
						useful: 1,
					},
					result: {
						target: function (player, target) {
							if (get.is.versus()) {
								if (target == player) return 1.5;
								return 1;
							}
							if (player.hasUnknown(2)) {
								return 0;
							}
							return 2;
						},
					},
					tag: {
						draw: 1,
						multitarget: 1,
					},
				},
			},
			//花之祝福
			"gezi_huazhi": {
				audio: "gezi_huazhi",
				fullskin: true,
				type: "jinjipai",
				enhance: 1,
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					player.$skill('花之祝福', null, null, true);
					player.addTempSkill('huazhi_skill');
					if (player.storage._enhance) {
						for (var i = 0; i < player.storage._enhance; i++) {
							player.gain(game.createCard("gezi_jingxia"), 'gain2');
						}
					}
				},
				ai: {
					basic: {
						order: 1,
						useful: [6, 2],
						value: [8, 4],
					},
					result: {
						target: function (player, target) {
							if (!target.getStat('damage') && get.attitude(player, target) > 0) return 1;
							return target.getStat('damage');
						},
					},
					tag: {
						draw: 2,
					},
				},
			},
			//惊吓派对
			"gezi_jingxia": {
				audio: "gezi_jingxia",
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target != player && player.canCompare(target);
				},
				content: function () {
					"step 0"
					player.draw();
					"step 1"
					player.line(target, 'blue');
					player.chooseToCompare(target).set('small', true);
					"step 2"
					if (result.bool == true) target.damage('thunder');
				},
				ai: {
					basic: {
						order: 3,
						useful: 1,
					},
					result: {
						player: 1,
						target: -1,
					},
					tag: {
						draw: 1,
						multitarget: 1,
						thunderDamage: 1,
					},
				},
			},
			//令避之间
			"gezi_lingbi": {
				audio: "gezi_lingbi",
				fullskin: true,
				type: "jinjipai",
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {

				},
				ai: {
					basic: {
						order: 1,
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						target: function (player, target) {
							return (target.hp < 2) ? 2 : 0;
						},
					},
					tag: {
						recover: 0.5,
						multitarget: 1,
					},
				},
			},
			//神灵复苏
			"gezi_shenlin": {
				audio: true,
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: -1,
				toself: true,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				content: function () {
					"step 0"
					var list = [];
					for (var i = 0; i < game.dead.length; i++) {
						list.push(game.dead[i].name);
					}
					target.chooseButton(ui.create.dialog('选择1名角色复活', [list, 'character']), function (button) {
						for (var i = 0; i < game.dead.length && game.dead[i].name != button.link; i++);
						return ai.get.attitude(target, game.dead[i]);
					});
					"step 1"
					if (result.bool) {
						for (var i = 0; i < game.dead.length && game.dead[i].name != result.buttons[0].link; i++);
						var dead = game.dead[i];
						target.line(dead, 'green');
						dead.revive();
						dead.draw()._triggered = null;
					}
				},
				ai: {
					basic: {
						order: 5,
						useful: 5,
						value: 5,
					},
					result: {
						target: function (player, target) {
							if (game.countPlayer(function (current) {
								if (game.dead.contains(current) && get.attitude(target, current) > 0 && target != current) return 1;
								return 0;
							})) return -3;
							return 2;
						},
					},
					tag: {
						loseCard: 1.5,
					},
				},
			},
			//死境之门
			"gezi_simen": {
				audio: "gezi_simen",
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				reverseOrder: true,
				contentBefore: function () {
					player.$skill('死境之门', null, null, true);
				},
				async content(event,trigger,player){
					const {result:{links}}=await event.target.chosenPlayerCard('hej',event.target,true);
					await event.target[(get.type(links[0])=='jinengpai') ? 'removeJudgen' : 'discard'](links[0]);
				},
				contentAfter: function () {
					var cards = [];
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						var currentcard = ui.discardPile.childNodes[i];
						if (get.info(currentcard).vanish || currentcard.storage.vanish) {
							currentcard.remove();
							continue;
						}
						if (currentcard.name != 'gezi_simen') cards.push(currentcard);
					}
					cards.randomSort();
					var deckcards = [];
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						deckcards.push(ui.cardPile.childNodes[i]);
					}
					for (var i = 0; i < deckcards.length; i++) {
						ui.discardPile.appendChild(deckcards[i]);
					}
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.appendChild(cards[i]);
					}
					game.log("死境之门：交换弃牌堆和牌堆");
					if (ui.cardPileNumber) ui.cardPileNumber.innerHTML = game.roundNumber + '轮 剩余牌: ' + ui.cardPile.childNodes.length;
				},
				ai: {
					basic: {
						order: 1,
						useful: [3, 1],
						value: [3, 1],
					},
					result: {
						player: function (player, target) {
							var num = game.countPlayer(function (current) {
								if (ai.get.attitude(player, current) < 0 && current.countCards('he')) return 2;
								if (ai.get.attitude(player, current) > 0 && current.countCards('he')) return -2;
							});
							if (num > 0) return -100;
							if (num < 0) return 100;
							if (num == 0) return 0;
						},
						target: function (player, target) {
							var nh = target.countCards('he');
							if (nh == 0) return 0;
							if (nh == 1) return -1.7
							return -1.5;
						},
					},
					tag: {
						multitarget: 1,
						multineg: 1,
						losecard: 1,
					},
				},
			},
			//天国之阶
			"gezi_tianguo": {
				audio: "gezi_tianguo",
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				contentBefore: function () {
					player.$skill('天国之阶', null, null, true);
				},
				content: function () {
					target.draw();
				},
				ai: {
					basic: {
						order: 5,
						useful: 1,
					},
					result: {
						target: function (player, target) {
							if (get.is.versus()) {
								if (target == player) return 1.5;
								return 1;
							}
							if (player.hasUnknown(2)) {
								return 0;
							}
							return 2;
						},
					},
					tag: {
						draw: 1,
						multitarget: 1,
					},
				},
			},
			//罪业边狱
			"gezi_zuiye": {
				audio: "gezi_zuiye",
				fullskin: true,
				type: "jinjipai",
				enable: true,
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards('hej') && target.isDamaged();
				},
				content: function () {
					var num = target.maxHp - target.hp;
					player.discardPlayerCard(target, 'hej', num, true);
				},
				ai: {
					basic: {
						order: 2,
						useful: 5,
						value: 6,
					},
					result: {
						target: function (player, target) {
							if (target.maxHp == target.hp) return 0;
							var es = target.get('e');
							var nh = target.countCards('h');
							/*
							var noe=(es.length==0||target.hasSkillTag('noe'));
							var noh=(nh==0||target.hasSkillTag('noh'));
							if(noh&&noe) return 0;
							*/
							if (ai.get.attitude(player, target) <= 0) return (target.countCards('hej')) ? -1.5 : 1.5;
							return -1.5;
						},
					},
					tag: {
						loseCard: 1.5,
					},
				},
			},
			/*-------------------异变牌-------------------*/
			//笨蛋
			"gezi_baka": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["baka_win"],
				skills: ["baka_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_baka', 'yibianpai', ''));
				},
			},
			//皆杀
			"gezi_death": {
				type: 'zhenfa',
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: [],
				skills: ["death_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_death', 'yibianpai', ''));
					game.players.forEach(current => {
						if(current==player) current.removeSkill('death_win');
						else if(!current.hasSkill('death_normal')) current.addSkill('death_win');
					});
				}
			},
			//萃梦
			"gezi_immaterial": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["immaterial_win"],
				skills: ["immaterial_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_immaterial', 'yibianpai', ''));
				},
			},
			//永夜
			"gezi_imperishable": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["imperishable_win"],
				skills: ["imperishable_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_imperishable', 'yibianpai', ''));
				},
			},
			//花映
			"gezi_phantasmagoria": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["phantasmagoria_win"],
				skills: ["phantasmagoria_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_phantasmagoria', 'yibianpai', ''));
				},
			},
			//散樱
			"gezi_sakura": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["sakura_win"],
				skills: ["sakura_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_sakura', 'yibianpai', ''));
				},
			},
			//文花
			"gezi_sb": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["sb_win"],
				skills: ["sb_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_sb', 'yibianpai', ''));
				},
			},
			//红雾
			"gezi_scarlet": {
				type: "zhenfa",
				subtype: "yibianpai",
				audio: true,
				fullskin: true,
				enable: true,
				vanish: true,
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				modTarget: true,
				incidentskills: ["scarlet_win"],
				skills: ["scarlet_normal"],
				content: function () {
					target.addIncident(game.createCard('gezi_scarlet', 'yibianpai', ''));
				},
			},
			/*-------------------技能牌-------------------*/
			//激怒
			"gezi_jinu": {
				fullskin: true,
				audio: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					var list = get.inpile('trick');
					list = list.randomGets(3);
					for (var i = 0; i < list.length; i++) {
						list[i] = ['锦囊', '', list[i]];
					}
					var dialog = ui.create.dialog('选择一张锦囊牌加入你的手牌', [list, 'vcard'], 'hidden');
					player.chooseButton(dialog, true).set('ai', function (button) {
						var card = { name: button.link[2] };
						var value = get.value(card);
						return value;
					});
					'step 1'
					if (result.bool) {
						player.$effectn('shengdun_skill', 17);
						player.gain(game.createCard(result.buttons[0].link[2]), 'draw');
					}
				},
				ai: {
					maixie_defend: true,
					basic: {
						useful: 4,
						value: 4,
					},
					result: { target: 1 },
				},
				skills: ['jinu_skill']
			},
			//连击
			"gezi_lianji": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					player.chooseUseTarget('###是否发动【连击】？###视为使用一张没有距离限制的【杀】', {
						name: 'sha'
					}, false, 'nodistance');
				},
				ai: {
					basic: {
						order: 6.2,
						useful: 6,
						value: 6,
					},
					result: {
						player: 1.4,
						target: 1,
					},
				},
				skills: ["gezi_lianji_skill"],
			},
			//灵涌
			"gezi_lingyong": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					event.cards = get.cards(1);
					player.showCards(event.cards);
					player.chooseTarget('【灵涌】：选择一名其他角色，该角色使用此牌（无距离限制）或者将此牌当【杀】使用', function (card, player, target) {
						return target != player;
					}).set('ai', function (target) {
						return get.attitude(player, target);
					});
					'step 1'
					if (result.bool) {
						event.target = result.targets[0];
						player.line(result.targets[0], 'green');
					} else {
						event.finish();
					};
					'step 2'
					var card = cards[0];
					var bool1 = game.hasPlayer(function (current) {
						return target.canUse(card, current, false);
					});
					var bool2 = game.hasPlayer(function (current) {
						return target.canUse({
							name: 'sha'
						}, current);
					});
					if (bool1 && bool2) {
						target.chooseControl(function () {
							return 0;
						}).set('choiceList', [
							'使用' + get.translation(cards) + '。（没有距离限制）',
							'将' + get.translation(cards) + '当做【杀】使用。',
						]).set('ai', function () {
							var list = [0, 1];
							return list.randomGet();
						});
					} else if (bool1) {
						event.directindex = 0;
					} else if (bool2) {
						event.directindex = 1;
					} else {
						ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
						event.finish();
					}
					'step 3'
					var card = cards[0];
					if (result && typeof event.directindex != 'number') {
						event.directindex = result.index;
					}
					if (event.directindex == 1) {
						target.chooseUseTarget({
							name: 'sha'
						}, cards, true)
					} else {
						target.chooseUseTarget(card, true);
					}
				},
				ai: {
					basic: {
						order: 7.2,
						useful: 3,
						value: 5,
					},
					result: {
						player: 1.3,
						target: 1,
					},
				},
				skills: ["gezi_lingyong_skill"],
			},
			//潜行
			"gezi_qianxing": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.chooseTarget('【潜藏】：选择获得【潜行】的目标', function (card, player, target) {
						return !target.hasSkill('qianxing');
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (get.distance(player, target, 'absolute') <= 1) return 0;
						if (target.hp == 1) return 2 * att;
						if (target.hp == 2 && target.countCards('h') <= 2) return 1.2 * att;
						return att;
					}
					'step 1'
					if (result.bool) {
						player.$effectn('gezi_qianxing_skill', 6);
						player.line(result.targets, 'green');
						result.targets[0].tempHide();
					}
				},
				ai: {
					basic: {
						order: 4.2,
						useful: 7,
						value: function (card, player) {
							// 不知道怎么检测是下一名回合角色，选择死亡。
							if (player.hasSkill('gezi_qianxing_skill2')) return 100;
							else return 5;
						},
					},
					result: {
						player: 1.2,
						target: 1,
					},
				},
				skills: ["gezi_qianxing_skill"],
			},
			//圣盾
			"gezi_shengdun": {
				fullskin: true,
				audio: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					var list = get.inpile('trick');
					list = list.randomGets(3);
					for (var i = 0; i < list.length; i++) {
						list[i] = ['锦囊', '', list[i]];
					}
					var dialog = ui.create.dialog('选择一张锦囊牌加入你的手牌', [list, 'vcard'], 'hidden');
					player.chooseButton(dialog, true).set('ai', function (button) {
						var card = {
							name: button.link[2]
						};
						var value = get.value(card);
						return value;
					});
					'step 1'
					if (result.bool) {
						player.$effectn('shengdun_skill', 17);
						player.gain(game.createCard(result.buttons[0].link[2]), 'draw');
					}
				},
				ai: {
					basic: {
						order: 4.9,
						useful: 8,
						value: 8,
					},
					result: {
						player: 1.1,
						target: 1.2,
					},
				},
				skills: ["shengdun_skill"],
			},
			//神佑
			"gezi_shenyou": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					player.recover();
					player.$effectn('shenyou_skill_1', 11);
					if (player.isMinHandcard()) {
						player.draw(2);
					}
				},
				ai: {
					basic: {
						order: 5.2,
						useful: 8,
						value: 8,
					},
					result: {
						player: 1.2,
						target: 1.2,
					},
				},
				skills: ["shenyou_skill_1", "shenyou_skill_2"],
			},
			//制衡
			"gezi_ziheng": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					"step 0"
					player.draw();
					player.choosePlayerCard(player, 'hej', [1, Infinity], '【制衡】：将区域内任意张牌重铸').set('ai', function (button) {
						return 5 - get.value(button.link);
					});
					"step 1"
					if (result.bool) {
						player.$effectn('ziheng_skill', 11);
						player.recast(result.cards);
					}

				},
				ai: {
					basic: {
						order: 9.2,
						useful: 5,
						value: 5,
					},
					result: {
						player: 1,
						target: 1,
					},
				},
				skills: ["ziheng_skill"],
			},
			//土魔导书
			"gezi_dirtbook": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.chooseTarget(function (card, player, target) {
						return player.canUse({
							name: 'wangmeizhike'
						}, target);
					}, false, '【土魔导书】：选择【望梅止渴】的目标').set('ai', function (target) {
						return get.effect(target, {
							name: 'wangmeizhike'
						}, player, player);
					});
					'step 1'
					if (result.bool) {
						player.line(result.targets, 'blue');
						player.useCard({
							name: 'wangmeizhike'
						}, result.targets[0]);
					}
				},
				ai: {
					basic: {
						order: 9.7,
						useful: 5,
						value: 5,
					},
					result: {
						player: 1.4,
						target: 1,
					},
				},
				skills: ["gezi_dirtbook_skill"],
			},
			//火魔导书
			"gezi_firebook": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.draw();
					player.chooseTarget(function (card, player, target) {
						return player.canUse({
							name: 'huogong'
						}, target);
					}, false, '【火魔导书】：选择【火攻】的目标').set('ai', function (target) {
						return get.effect(target, {
							name: 'huogong'
						}, player, player);
					});
					'step 1'
					if (result.bool) {
						player.line(result.targets, 'red');
						player.useCard({
							name: 'huogong'
						}, result.targets[0]);
					}
				},
				ai: {
					basic: {
						order: 9.5,
						useful: 6,
						value: 6,
					},
					result: {
						player: 1.2,
						target: 1,
					},
				},
				skills: ["gezi_firebook_skill"],
			},
			//金魔导书
			"gezi_goldbook": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.chooseTarget(function (card, player, target) {
						return player.canUse({
							name: 'zhufangshenshi'
						}, target);
					}, false, '【金魔导书】：选择【祠符】的目标').set('ai', function (target) {
						return get.effect(target, {
							name: 'zhufangshenshi'
						}, player, player);
					});
					'step 1'
					if (result.bool) {
						player.line(result.targets, 'blue');
						player.useCard({
							name: 'zhufangshenshi'
						}, result.targets[0]);
					}
				},
				ai: {
					basic: {
						order: 9.8,
						useful: 5,
						value: 5,
					},
					result: {
						player: 1.2,
						target: 1,
					},
				},
				skills: ["gezi_goldbook_skill"],
			},
			//水魔导书
			"gezi_waterbook": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.chooseTarget(function (card, player, target) {
						return player.canUse({
							name: 'shuiyanqijunx'
						}, target);
					}, false, '【水魔导书】：选择【水淹七军】的目标').set('ai', function (target) {
						return get.effect(target, {
							name: 'shuiyanqijunx'
						}, player, player);
					});
					'step 1'
					if (result.bool) {
						player.line(result.targets, 'blue');
						player.useCard({
							name: 'shuiyanqijunx'
						}, result.targets[0]);
					}
				},
				ai: {
					basic: {
						order: 9.6,
						useful: 6,
						value: 6,
					},
					result: {
						player: 1.5,
						target: 1,
					},
				},
				skills: ["gezi_waterbook_skill"],
			},
			//木魔导书
			"gezi_woodbook": {
				audio: true,
				fullskin: true,
				type: "jinengpai",
				filterTarget: function (card, player, target) {
					return true;
				},
				content: function () {
					target.addJudgen(card);
				},
				effect: function () {
					'step 0'
					player.chooseTarget(function (card, player, target) {
						return player.canUse({
							name: 'zhiliaobo'
						}, target);
					}, false, '【木魔导书】：选择【治疗波】的目标').set('ai', function (target) {
						return get.effect(target, {
							name: 'zhiliaobo'
						}, player, player);
					});
					'step 1'
					if (result.bool) {
						player.line(result.targets, 'blue');
						player.useCard({
							name: 'zhiliaobo'
						}, result.targets[0]);
					}
				},
				ai: {
					basic: {
						order: 8.9,
						useful: 5,
						value: 5,
					},
					result: {
						player: 1.3,
						target: 1,
					},
				},
				skills: ["gezi_woodbook_skill"],
			},
		},
		translate: {
			/*-------------------锦囊牌-------------------*/
			"gezi_caifang": "突击采访",
			"gezi_caifang_info": "出牌阶段，对一名其他角色使用。目标角色选择一项：<br>明置身份牌(可以发动异变效果)，若已明置则获得一层弱点揭露；<br>展示所有手牌，然后你摸一张牌。<br><b>弱点揭露：<br>一层：受到伤害时弃置一张牌；<br>两层：受到的伤害加一；<br>三层及以上：受到伤害时流失X点体力（X为弱点揭露层数-2）。<br>受到伤害后清除层数。<b></br><u>强化（-1）：改为选择两项。</u>",
			"gezi_danmakucraze": "弹幕狂欢",
			"gezi_danmakucraze_info": "出牌阶段，对自己使用。目标本回合可使用【杀】的次数加二。</br><u>强化（-1）：摸一张牌。</u>",
			"gezi_reidaisai": "博丽例大祭",
			"gezi_reidaisai_info": "出牌阶段，对所有角色使用。目标角色摸一张牌，然后可以将一张牌交给其他角色。",
			"gezi_reidaisai2": "守矢例大祭",
			"gezi_reidaisai2_info": "出牌阶段，对任意名与你身份不同的角色使用。目标角色摸一张牌，你摸X张牌（X为目标角色数+1），然后你可以任意分配以此法获得的牌。",
			"gezi_tancheng": "坦诚相待",
			"gezi_tancheng_info": "出牌阶段，对所有其他角色使用。目标角色展示所有手牌，然后你可以用一张手牌交换其中一张不同类型的牌。",
			"gezi_xuyuanshu": "许愿术",
			"gezi_xuyuanshu_info": "出牌阶段，对自己使用。目标角色随机获得一张普通锦囊牌(失去时销毁)，然后可以使用之，若如此做，重复此流程直到获得第二张牌。若没有使用或无法使用，则结束流程，摸2-X张牌（X为以此牌获得的牌数）。</br> <u>强化（-1）：此法获得的牌+1。</u>",
			"stg_bawu": "拨雾开天",
			"stg_bawu_info": "出牌阶段，对自己使用。目标角色选择一项：回复一点体力并贴上一张【圣盾】；摸一张牌并贴上一张【连击】。",
			/*-------------------武器牌-------------------*/
			"gezi_bagua": "八卦炉MK",
			"gezi_bagua_info": "锁定技，每回合限三次，你造成伤害后，获得一点灵力（不能获得灵力改为摸一张牌）。",
			"gezi_bailou": "白楼剑",
			"gezi_bailou_info": "锁定技，你使用【杀】造成非雷属性伤害后，对受伤角色造成一点雷属性伤害。",
			"gezi_deathfan": "凤蝶纹扇",
			"gezi_deathfan_info": "出牌阶段限一次，你可以将一张延时锦囊牌置于弃牌堆，然后对至多两名角色各造成一点雷电伤害。",
			"gezi_gungnir": "冈格尼尔",
			"gezi_gungnir_info": "你使用【杀】指定目标后，可以弃置此牌或消耗两点灵力，令此【杀】无法被响应。",
			"gezi_hakkero": "八卦炉",
			"gezi_hakkero_info": "出牌阶段限一次，你可以消耗一点灵力（灵力未定义则改为将一张手牌中的基本牌置于弃牌堆），视为使用一张【杀】。",
			"gezi_laevatein": "魔剑莱瓦汀",
			"gezi_laevatein_info": "锁定技，你对一名角色使用【杀】时，若你本回合未对其使用过【杀】，此【杀】不计入次数。",
			"gezi_louguan": "楼观剑",
			"gezi_louguan_info": "锁定技，当你使用【杀】指定一名目标角色后，你令其装备技能无效直到此【杀】结算完毕。",
			"gezi_missile": "魔法飞弹",
			"gezi_missile_info": "回合结束时，若你本回合使用过【杀】，你可以视为使用一张【杀】。",
			"gezi_needle": "封魔针",
			"gezi_needle_info": "锁定技，你的手牌上限加一；若你已受伤，你的摸牌阶段摸牌数加一；你使用【杀】指定目标后，目标的非锁定技失效直到当前回合结束。",
			"gezi_windfan": "风神团扇",
			"gezi_windfan_info": "出牌阶段一次，你可以将一张红色牌当做【过河拆桥】使用。",
			"gezi_wuqingqumobang": "无情驱魔棒",
			"gezi_wuqingqumobang_info": "锁定技，其他角色回合开始时，你视为对其使用一张【杀】。",
			"gezi_yinyangfeiniao": "阴阳飞鸟井",
			"gezi_yinyangfeiniao_info": "你可以把红色牌当【桃】，黑色牌当【杀】",
			"gezi_yinyangyuguishen": "鬼神阴阳玉",
			"gezi_yinyangyuguishen_info": "出牌阶段，你可以将一张非基本牌（包括此牌）当做一种基本牌使用；你可将一张非基本牌（包括此牌）当做【闪】使用或打出。你以此法使用的【杀】伤害+1。",
			"gezi_zhiyuu": "净颇梨之镜",
			"gezi_zhiyuu_info": "出牌阶段限一次，你可以令一名角色展示一张手牌，然后你可以弃置一张与之花色相同的手牌，对其造成一点雷属性伤害。",
			"stg_goldbook": "金魔导书",
			"stg_goldbook_info": "锁定技，与你阵营相同的角色摸牌阶段额外摸一张牌。",
			/*-------------------防具牌-------------------*/
			"gezi_hourai": "替身人形",
			"gezi_hourai_info": "你成为带有伤害标签的牌的目标后，可以收回装备区中的此牌，令该牌对你无效。",
			"gezi_lantern": "人魂灯",
			"gezi_lantern_info": "你成为【杀】的目标后，若来源在你攻击范围内，你可以与其特殊拼点（拼点后双方摸一张牌）；若你赢，该【杀】对你无效。",
			"gezi_mirror": "八咫镜",
			"gezi_mirror_info": "你成为【杀】的目标后，可以进行判定，若判定牌的颜色与该【杀】相同，该【杀】对你无效。",
			"gezi_yinyangyu": "阴阳玉",
			"gezi_yinyangyu_info": "你可以将一张黑色牌当做【杀】使用/打出; 你可以将一张红色牌当做【闪】使用/打出。",
			"stg_waterbook": "水魔导书",
			"stg_waterbook_info": "与你阵营相同的角色可以将一张黑色手牌当做【闪】使用/打出。",
			/*-------------------防御马-------------------*/
			"gezi_frog": "冰镇青蛙",
			"gezi_frog_info": "此牌可对其他角色使用，你对其他角色使用此牌时，你可以弃置其装备区内一张牌。锁定技，其他角色计算与你的距离+1。你可以将装备区内的此牌当【杀】使用。",
			"stg_dirtbook": "土魔导书",
			"stg_dirtbook_info": "锁定技，与你身份不同的角色死亡后，你获得其区域内的一张牌。",
			/*-------------------进攻马-------------------*/
			"gezi_lunadial": "月时计",
			"gezi_lunadial_info": "锁定技，你计算与其他角色的距离-1。出牌阶段限一次，你可以消耗一点灵力，令一名其他角色不能使用或打出手牌直到当前回合结束。",
			"stg_woodbook": "木魔导书",
			"stg_woodbook_info": "锁定技，与你阵营相同的角色的手牌上限+2。",
			/*-------------------宝物牌-------------------*/
			"gezi_book": "魔导书",
			"gezi_book_info": "锁定技，结束阶段，若你没有贴上技能牌，你随机贴上一张魔导书技能牌。",
			"gezi_houraiyuzhi": "蓬莱玉枝",
			"gezi_houraiyuzhi_info": "出牌阶段限一次，你可以展示一张牌，并声明一种花色或点数，该牌该项视为与声明相同直到当前回合结束。",
			"gezi_ibuki": "伊吹瓢",
			"gezi_ibuki_info": "出牌阶段限一次，你可以将一张基本牌置于弃牌堆，然后你获得一点灵力。若你灵力不大于三或者无法获得灵力，你摸一张牌。",
			"gezi_pantsu": "蓝白胖次",
			"gezi_pantsu_info": "锁定技，其他角色获得/弃置你的牌时，改为获得/弃置此牌。",
			"gezi_saiqianxiang": "赛钱箱",
			"gezi_saiqianxiang_info": "其他角色的出牌阶段限一次，其可以交给你一张牌；出牌阶段限一次，你可以将一张手牌当做【博丽例大祭】使用。",
			"gezi_stone": "贤者之石",
			"gezi_stone_info": "出牌阶段，你可以将两张牌（需包含此牌）当做任意非延时锦囊牌使用。",
			"stg_deck": "魔术卡片",
			"stg_deck_info": "每回合限一次，其他角色于出牌阶段内获得牌后，你可以弃置其区域内的一张牌。",
			"stg_firebook": "火魔导书",
			"stg_firebook_info": "锁定技，与你阵营相同的角色使用【杀】的次数上限+1。",
			/*-------------------禁忌牌-------------------*/
			"gezi_bingyu": "冰域之宴",
			"gezi_bingyu_info": "此牌可被重铸。准备阶段开始时，对所有角色使用。直到你的下个回合开始或你死亡，防止目标角色造成的伤害。</br> <u>追加效果(-3)：弃牌阶段开始时，你可以弃置此牌，永久跳过你的弃牌阶段。</u>",
			"gezi_dianche": "废线电车",
			"gezi_dianche_info": "出牌阶段，对一名其他角色使用。目标角色选择一项：弃置三张牌，或你以外的所有角色各弃置两张牌。<br><u>追加效果：出牌阶段，你可以将此牌和另一张牌交给一名其他角色。</u>",
			"gezi_huanxiang": "幻想之扉",
			"gezi_huanxiang_info": "出牌阶段，对所有角色使用。目标角色摸一张牌，然后随机贴上一张技能牌。</br> <u>追加效果：游戏开始时，或你进入游戏时，你可以展示此牌，令所有角色摸一张牌。</u>",
			"gezi_huazhi": "花之祝福",
			"gezi_huazhi_info": "出牌阶段，对自己使用。此回合结束时，目标角色摸X张牌（X为其本回合造成的伤害点数且至少为一）。</br> <u>强化(-1)：获得一张【惊吓派对】。</u>",
			"gezi_jingxia": "惊吓派对",
			"gezi_jingxia_info": "出牌阶段，对所有能够拼点的其他角色使用。你摸一张牌并与目标角色拼点，若你赢，你对其造成一点雷电伤害。</br> <u>追加效果(-2)：出牌阶段，你可以弃置此牌，然后获得【潜行】直到你的下个回合开始。</u>",
			"gezi_lingbi": "令避之间",
			"gezi_lingbi_info": "准备阶段，对所有角色使用。你声明一种牌名，目标角色不能使用此牌名的牌，直到你的回合开始或你死亡。</br> <u>追加效果：此牌可以当作【无懈可击】使用。</u>",
			"gezi_shenlin": "神灵复苏",
			"gezi_shenlin_info": "出牌阶段，对自己使用。目标角色选择一名已死亡的角色，该角色以一体力/一手牌重新加入游戏。<br><u>追加效果：你受到伤害时，可以弃置此牌，防止你受到的所有伤害直到当前回合结束。</u>",
			"gezi_simen": "死境之门",
			"gezi_simen_info": "出牌阶段，对所有其他角色使用。若目标角色有牌，其需选择弃置一张牌或移除一张技能牌。所有目标角色均执行完上述流程后，交换牌堆与弃牌堆。</br> <u>追加效果：此牌因弃置进入弃牌堆后，你需展示之，令所有角色失去一点体力。</u>",
			"gezi_tianguo": "天国之阶",
			"gezi_tianguo_info": "出牌阶段，对所有角色使用。将弃牌堆洗入牌堆，然后目标角色摸一张牌。</br> <u>追加效果：你获得此牌后，可以展示之，令所有角色回复一点体力。</u>",
			"gezi_zuiye": "罪业边狱",
			"gezi_zuiye_info": "出牌阶段，对一名其他角色使用；弃置其区域内X张牌(X为其已损失体力值)。</br> <u>追加效果：你造成伤害时，可以将手牌中的所有【罪业边狱】交给受伤角色，令此伤害+X（X为你以此法交出的牌数）。</u>",
			/*-------------------异变牌-------------------*/
			"gezi_baka": "笨蛋",
			"gezi_baka_info": "<u>胜利条件：</u>你杀死一名角色时，若你已经杀死过其他角色，你获得胜利。<br/><u>异变效果：</u>所有数字视为⑨进制。",
			"gezi_death":"皆杀",
			"gezi_death_info": '<u>胜利条件：</u>所有其他角色死亡。<br/><u>异变效果：</u>所有其他角色不能胜利；你不能以【皆杀】以外的方式胜利；你击杀角色后，摸三张牌。',
			"gezi_immaterial": "萃梦",
			"gezi_immaterial_info": "<u>胜利条件：</u>你的回合结束时，若弃牌堆内有至少八张【桃】，你获得胜利。<br/><u>异变效果：</u>出牌阶段限一次，你可以消耗一点灵力（灵力未定义则不消耗），视为使用一张【博丽例大祭】。",
			"gezi_imperishable": "永夜",
			"gezi_imperishable_info": "<u>胜利条件：</u>你的回合开始时，若本回合是你明置此牌后进行的第七个回合，你获得胜利。<br/><u>异变效果：</u>锁定技，一名角色失去手牌后，若其没有技能牌，其随机贴上一张技能牌。",
			"gezi_phantasmagoria": "花映",
			"gezi_phantasmagoria_info": "<u>胜利条件：</u>牌堆洗牌时，若所有角色均存活，你获得胜利。<br/><u>异变效果：</u>锁定技，一名角色的回合结束时，其获得一点灵力（无法获得灵力则改为摸一张牌）。",
			"gezi_sakura": "春雪",
			"gezi_sakura_info": "<u>胜利条件：</u>准备阶段，若你的体力值和手牌数均为场上唯一最低，你获得胜利。<br/><u>异变效果：</u>锁定技，一名角色进入濒死状态时，你获得一点灵力（无法获得灵力改为摸一张牌）。",
			"gezi_sb": "文花",
			"gezi_sb_info": "<u>胜利条件：</u>无<br/><u>异变效果：</u>出牌阶段限一次，你可以消耗一点灵力（灵力未定义则不消耗），视为使用一张【突击采访】。",
			"gezi_scarlet": "红雾",
			"gezi_scarlet_info": "<u>胜利条件：</u>准备阶段，若你的体力值和牌数均为场上唯一最高，你获得胜利。<br/><u>异变效果：</u>锁定技，你的攻击距离加一(与你同阵营的角色展示身份后也享受此效果)。",
			/*-------------------技能牌-------------------*/
			"gezi_jinu":"激怒",
			"gezi_jinu_info":"你受到伤害后，可以弃置伤害来源场上一张牌",
			"gezi_lianji": "连击",
			"gezi_lianji_info": "锁定技，你使用【杀】的次数上限加一；你受到【杀】的伤害后，移除一张【连击】，获得该牌对应的所有实体牌（没有则改为摸一张牌）。",
			"gezi_lingyong": "灵涌",
			"gezi_lingyong_info": "锁定技，你的攻击范围加一；你获得灵力时获得量加一（此效果每触发四次，移除一张【灵涌】）。",
			"gezi_qianxing": "潜行",
			"gezi_qianxing_info": "锁定技，你不能成为【杀】的目标；准备阶段，移除一张【潜行】。",
			"gezi_shengdun": "圣盾",
			"gezi_shengdun_info": "你成为其他角色的普通锦囊牌的目标后，可以与来源特殊拼点（拼点后双方各摸一张牌）；若你赢，移除一张【圣盾】，令该牌对你无效。",
			"gezi_shenyou": "神佑",
			"gezi_shenyou_info": "锁定技，你的判定牌生效前，你移除一张【神佑】，令判定牌的花色视为红桃；你受到伤害时，若伤害大于你的体力值，移除一张【神佑】，防止该伤害。",
			"gezi_ziheng": "制衡",
			"gezi_ziheng_info": "回合开始或出牌阶段结束时，你可以重铸区域内一张牌（此效果每触发四次，移除一张【制衡】）。",
			"gezi_dirtbook": "土魔导书",
			"gezi_dirtbook_info": "锁定技，一名角色死亡后，你回复一点体力并摸一张牌（此效果每触发四次，移除一张【土魔导书】）。",
			"gezi_firebook": "火魔导书",
			"gezi_firebook_info": "锁定技，你使用【杀】的次数上限加一；一名角色受到火焰伤害后，你摸一张牌（此效果每触发两次，移除一张【火魔导书】）。",
			"gezi_goldbook": "金魔导书",
			"gezi_goldbook_info": "锁定技，你的回合开始与结束时，你摸一张牌（此效果每触发三次，移除一张【金魔导书】）。",
			"gezi_waterbook": "水魔导书",
			"gezi_waterbook_info": "你可以将一张黑色手牌当做【闪】使用/打出（此效果每触发两次，移除一张【水魔导书】）。",
			"gezi_woodbook": "木魔导书",
			"gezi_woodbook_info": "锁定技，你的手牌上限加二；弃牌阶段结束时，若你已受伤，移除一张【木魔导书】，你回复一点体力。",
		},
		list: [],
	},
	skill: {
		skill: {
			/*-------------------锦囊牌-------------------*/
			"danmaku_skill": {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 2 * player.countUsed('gezi_danmakucraze');
					},
				},
			},
			"gezi_ruodianjielu": {
				trigger: {
					player: "damageBegin",
				},
				filter: function (event) {
					if (event.source == undefined || event.source == event.player) return false;
					return true;
				},
				mark: true,
				marktext: "弱",
				intro: {
					content: function (storage, player) {
						return '当前有' + player.storage.gezi_ruodianjielu + '层弱点揭露';
					},
				},
				priority: -10,
				forced: true,
				nobracket: true,
				unique: true,
				content: function () {
					'step 0'
					if (player.storage.gezi_ruodianjielu) {
						player.chooseToDiscard('he', true);
					}
					if (player.storage.gezi_ruodianjielu > 1) {
						trigger.num++;
					}
					if (player.storage.gezi_ruodianjielu > 2) {
						player.loseHp(gezi_ruodianjielu - 2);
					}
					'step 1'
					player.storage.gezi_ruodianjielu = 0;
					player.unmarkSkill('gezi_ruodianjielu');
					player.removeSkill('gezi_ruodianjielu');
				},
				ai: {
					threaten: 1.5,
				},
			},
			/*-------------------武器牌-------------------*/
			"gezi_bagua_skill": {
				trigger: {
					source: "damageEnd",
				},
				equipSkill: true,
				usable: 3,
				forced: true,
				content: function () {
					if (player.lili < player.maxlili && !player.node.fuka) {
						player.gainlili();
					} else {
						player.draw();
					}
				},
			},
			"bailou_skill": {
				trigger: {
					source: "damageEnd",
				},
				equipSkill: true,
				forced: true,
				filter: function (event) {
					return (event.card && event.card.name == 'sha' && event.nature != 'thunder');
				},
				content: function () {
					if (player.name == 'gezi_youmu') {
						player.say('灵魂也躲不了我的这把剑！');
					}
					trigger.player.damage('thunder');
				},
				check: function (event, player) {
					return get.damageEffect(event.player, player, player, 'thunder') > 0;
				},
				ai: {
					thunderDamage: 1,
				},
			},
			"deathfan_skill": {
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				filterTarget: true,
				selectTarget: [1, 2],
				filter: function (event, player) {
					return player.countCards('h', {
						type: 'delay'
					}) > 0;
				},
				filterCard: {
					type: "delay",
				},
				discard: false,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
				},
				prompt: "将手牌中的一张延时类锦囊牌置于弃牌堆，然后对至多2名角色各造成1点雷电伤害",
				check: function (card) {
					return 9 - ai.get.value(card);
				},
				position: "h",
				content: function () {
					target.damage('thunder');
					game.cardsDiscard(cards);
				},
				ai: {
					thunderDamage: 1,
					basic: {
						order: 10,
					},
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, player, 'thunder')
						},
					},
				},
			},
			"gungnir_skill": {
				trigger: {
					player: "shaBegin",
				},
				equipSkill: true,
				check: function (event, player) {
					if (get.attitude(player, event.target) >= 0) return false;
					return player.countCards('h', {
						name: 'gezi_zuiye'
					}) > 0 || event.target.hp <= 2 || player.hasSkill('gezi_gungirs');
				},
				filter: function (event, player) {
					return player.countCards('e', {
						name: 'gezi_gungnir'
					}) > 0 || player.lili > 1;
				},
				content: function () {
					"step 0"
					var controls = ['throw_gungir'];
					if (player.lili >= 2) {
						controls.push('lose_lili');
					}
					player.chooseControl(controls).ai = function () {
						if (player.lili > 3 && !player.hasSkill('gezi_gungirs')) {
							return 'lose_lili';
						} else {
							return 'throw_gungir';
						}
					}
					"step 1"
					event.control = result.control;
					if (player.name == 'gezi_remilia') player.say('你的心脏，我收下了！');
					if (event.control == 'lose_lili') {
						player.$effectn('gungnir_skill', 3);
						player.loselili(2);
					} else {
						player.$effectn('gungnir_skill', 3);
						var cards = player.getCards('e');
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_gungnir') {
								player.discard(cards[i]);
								break;
							}
						}
					}
					trigger.directHit = true;
				},
				"prompt2": "你可以消耗2点灵力，或弃置冈格尼尔，令【杀】强制命中",
			},
			"hakkero_skill": {
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				filter: function (event, player) {
					// 这段是检测次数限制的
					if (!lib.filter.filterCard({
						name: 'sha'
					}, player, event)) {
						return false;
					}
					return player.lili;
				},
				filterTarget: function (card, player, target) {
					return player.canUse('sha', target);
				},
				prompt: "消耗一点灵力，视为使用了一张【杀】",
				content: function () {
					player.loselili();
					player.useCard({
						name: 'sha'
					}, target);
					if (player.name == 'gezi_marisa') {
						player.say('极限火花！！！')
					}
				},
				ai: {
					basic: {
						order: 1.8,
						value: [4, 2],
						useful: 1,
					},
					result: {
						target: function (player, target) {
							return get.effect(target, {
								name: 'sha'
							}, player);
						},
					},
				},
			},
			"hakkero_skill2": {
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				filter: function (event, player) {
					if (!lib.filter.filterCard({
						name: 'sha'
					}, player, event)) {
						return false;
					}
					return player.countCards('h', {
						type: 'basic'
					}) && !player.node.lili;
				},
				filterTarget: function (card, player, target) {
					return player.canUse('sha', target);
				},
				filterCard: {
					type: "basic",
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
				},
				position: "h",
				prompt: "将一张基本牌置于弃牌堆，视为使用一张【杀】。",
				content: function () {
					player.useCard({
						name: 'sha'
					}, target);
					if (player.name == 'gezi_marisa') {
						player.say('极限火花！！！')
					}
					game.cardsDiscard(cards);
				},
				ai: {
					basic: {
						order: 1.8,
						value: [4, 2],
						useful: 1,
					},
					result: {
						target: function (player, target) {
							return get.effect(target, {
								name: 'sha'
							}, player);
						},
					},
				},
			},
			"laevatein_skill": {
				trigger: {
					player: "shaBefore",
				},
				equipSkill: true,
				forced: true,
				popup: false,
				filter: function (event, player) {
					return _status.currentPhase == player;
				},
				content: function () {
					var target = trigger.target;
					if (!target.hasSkill('laevatein3')) {
						player.getStat().card.sha--;
						target.addTempSkill('laevatein3');
					}
				},
			},
			"laevatein3": {
			},
			"louguan_skill": {
				trigger: {
					player: "shaBegin",
				},
				equipSkill: true,
				forced: true,
				content: function () {
					if (player.name == 'youmu') {
						player.say('任何防御都挡不住我！');
					}
					for (var i = 0; i < trigger.targets.length; i++) {
						trigger.targets[i].addTempSkill('unequip', 'useCardAfter');
						trigger.targets[i].$effectn('louguan_skill', 5);
					}
				},
				ai: {
					unequip: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg && arg.name == 'sha') return true;
						return false;
					},
				},
			},
			"gezi_missile_skill": {
				group: "gezi_missile_count",
				trigger: {
					player: "phaseJieshuEnd",
				},
				equipSkill: true,
				filter: function (event, player) {
					return player.hasSkill('gezi_missile_ready');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('魔法飞弹：视为使用一张【杀】', function (card, player, target) {
						return player.canUse({
							name: 'sha'
						}, target, false);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: 'sha'
						}, _status.event.player);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_missile_skill', result.targets);
						player.useCard({
							name: 'sha'
						}, result.targets[0], false);
					}
				},
			},
			"gezi_missile_count": {
				trigger: {
					player: "useCardAfter",
				},
				direct: true,
				priority: -10.3,
				silent: true,
				nopop: true,
				filter: function (event, player) {
					return event.card.name == 'sha';
				},
				content: function () {
					player.addTempSkill('gezi_missile_ready');
				},
				forced: true,
				popup: false,
			},
			"gezi_missile_ready": {
			},
			"gezi_needle_skill": {
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
				trigger: {
					player: "shaBegin",
				},
				equipSkill: true,
				group: "gezi_needle_2",
				forced: true,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					if (!trigger.target.hasSkill('fengyin')) {
						trigger.target.addTempSkill('fengyin');
					}
				},
			},
			"gezi_needle_2": {
				trigger: {
					player: "phaseDrawBegin",
				},
				forced: true,
				filter: function (event, player) {
					if (player.hp < player.maxHp) return true;
					return false;
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
			},
			"windfan_skill": {
				usable: 1,
				enable: "chooseToUse",
				equipSkill: true,
				filterCard: function (card) {
					return get.color(card) == 'red';
				},
				position: "he",
				viewAs: {
					name: "guohe",
				},
				viewAsFilter: function (player) {
					if (!player.num('he', {
						color: 'red'
					})) return false;
				},
				prompt: "将一张红色牌当【过河拆桥】使用或打出",
				check: function (card) {
					return 4 - ai.get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.num('he', {
							color: 'red'
						})) return false;
					},
					basic: {
						order: 9,
						useful: 1,
						value: 5,
					},
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							var nh = target.countCards('h');
							if (att > 0) {
								var js = target.getCards('j');
								if (js.length) {
									var jj = js[0].viewAs ? {
										name: js[0].viewAs
									} : js[0];
									if (jj.name == 'guohe' || js.length > 1 || get.effect(target, jj, target, player) < 0) {
										return 3;
									}
								}
								if (target.getEquip('baiyin') && target.isDamaged() &&
									get.recoverEffect(target, player, player) > 0) {
									if (target.hp == 1 && !target.hujia) return 1.6;
									if (target.hp == 2) return 0.01;
									return 0;
								}
							}
							var es = target.getCards('e');
							var noe = (es.length == 0 || target.hasSkillTag('noe'));
							var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
							var noh = (nh == 0 || target.hasSkillTag('noh'));
							if (noh && (noe || noe2)) return 0;
							if (att <= 0 && !target.countCards('he')) return 1.5;
							return -1.5;
						},
					},
					tag: {
						loseCard: 1,
						discard: 1,
					},
				},
			},
			"gezi_wuqingqumobang": {
				trigger: {
					global: "phaseBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.player != player && event.player.isAlive();
				},
				content: function () {
					player.useCard({ name: 'sha' }, trigger.player, false);
				}
			},
			"gezi_yinyangfeiniao": {
				enable: ["chooseToUse", "chooseToRespond"],
				prompt: "将黑牌当做杀，红牌当做桃使用或打出",
				viewAs: function (cards, player) {
					var name = false;
					switch (get.color(cards[0], player)) {
						case 'black': name = 'sha'; break;
						case 'red': name = 'tao'; break;
					}
					if (name) return { name: name };
					return null;
				},
				check: function (card) {
					var player = _status.event.player;
					if (_status.event.type == 'phase') {
						var max = 0;
						var name2;
						var list = ['sha', 'tao'];
						var map = { sha: 'black', tao: 'red' }
						for (var i = 0; i < list.length; i++) {
							var name = list[i];
							if (player.countCards('hes', function (card) {
								return (name != 'sha' || get.value(card) < 5) && get.color(card, player) == map[name];
							}) > 0 && player.getUseValue({ name: name }) > 0) {
								var temp = get.order({ name: name });
								if (temp > max) {
									max = temp;
									name2 = map[name];
								}
							}
						}
						if (name2 == get.color(card, player)) return (name2 == 'black' ? (5 - get.value(card)) : 20 - get.value(card));
						return 0;
					}
					return 1;
				},
				position: "hes",
				filterCard: function (card, player, event) {
					event = event || _status.event;
					var filter = event._backup.filterCard;
					var name = get.color(card, player);
					if (name == 'black' && filter({ name: 'sha', cards: [card] }, player, event)) return true;
					if (name == 'red' && filter({ name: 'tao', cards: [card] }, player, event)) return true;
					return false;
				},
				filter: function (event, player) {
					var filter = event.filterCard;
					if (filter({ name: 'sha' }, player, event) && player.countCards('hes', { color: 'black' })) return true;
					if (filter({ name: 'tao' }, player, event) && player.countCards('hes', { color: 'red' })) return true;
					return false;
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag) {
						var name;
						switch (tag) {
							case 'respondSha': name = 'black'; break;
							case 'save': name = 'red'; break;
						}
						if (!player.countCards('hes', { color: name })) return false;
					},
					order: function (item, player) {
						if (player && _status.event.type == 'phase') {
							var max = 0;
							var list = ['sha', 'tao'];
							var map = { sha: 'black', tao: 'red' }
							for (var i = 0; i < list.length; i++) {
								var name = list[i];
								if (player.countCards('hes', function (card) {
									return (name != 'sha' || get.value(card) < 5) && get.color(card, player) == map[name];
								}) > 0 && player.getUseValue({ name: name }) > 0) {
									var temp = get.order({ name: name });
									if (temp > max) max = temp;
								}
							}
							max /= 1.1;
							return max;
						}
						return 2;
					},
				},
				hiddenCard: function (player, name) {
					if (name == 'tao') return player.countCards('hes', { color: 'red' }) > 0;
				},
			},
			"gezi_yinyangyuguishen_skill2": {
				enable: ["chooseToUse", "chooseToRespond"],
				equipSkill: true,
				filter: function (event, player) {
					if (!event.parent || !event.parent.name || event.parent.name !== "sha") return false;
					return player.hasCard(function (card) {
						return get.type(card) != "basic";
					}, "he");
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (lib.card[name].mode && lib.card[name].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[name].forbid && lib.card[name].forbid.contains(lib.config.mode)) continue;
							if (lib.card[name].type == 'basic' && event.filterCard({
								name: name
							}, player, event)) {
								list.add(name);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					check: function (button) {
						return (button.link[2] == 'tao') ? 1 : -1;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return get.type(card) != 'basic';
							},
							position: 'he',
							selectCard: 1,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
							onuse: function (result, player) {
								player.addTempSkill('gezi_yinyangyuguishen_duang');
							},
						}
					},
					prompt: function (links, player) {
						return '将一张非基本牌当作' + get.translation(links[0][2]) + '使用/打出';
					},
				},
				ai: {
					save: true,
					skillTagFilter: function (player) {
						return player.countCards('he') > 0;
					},
				},
			},
			"gezi_yinyangyuguishen_skill": {
				enable: "phaseUse",
				equipSkill: true,
				hiddenCard: function (player, name) {
					return name == 'shan';
				},
				filter: function (event, player) {
					return player.hasCard(function (card) {
						return get.type(card) != "basic";
					}, "he");
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (!game.hasPlayer(function (current) {
								return player.canUse(name, current);
							}) && !player.canUse(name, player)) continue;
							if (lib.card[name].mode && lib.card[name].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[name].forbid && lib.card[name].forbid.contains(lib.config.mode)) continue;
							if (lib.card[name].type == 'basic' && event.filterCard({
								name: name
							}, player, event)) {
								list.add(name);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					check: function (button) {
						return (button.link[2] == 'tao') ? 1 : -1;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return get.type(card) != 'basic';
							},
							position: 'he',
							selectCard: 1,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
							onuse: function (result, player) {
								player.addTempSkill('gezi_yinyangyuguishen_duang');
							},
						}
					},
					prompt: function (links, player) {
						return '将一张非基本牌当作' + get.translation(links[0][2]) + '使用/打出';
					},
				},
				ai: {
					save: true,
					skillTagFilter: function (player) {
						return player.countCards('he') > 0;
					},
				},
			},
			"gezi_yinyangyuguishen_duang": {
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == 'sha';
				},
				content: function () {
					trigger.num++;
				},
			},
			"zhiyuu_skill": {
				audio: "ext:东方project:true",
				equipSkill: true,
				fullskin: true,
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					if (player != game.me && player.num('h') == 0) return false;
					return target.num('h') > 0;
				},
				content: function () {
					"step 0"
					if (player.name == 'gezi_eiki') {
						player.say('不要在阎魔面前隐藏任何东西。没用的。');
					}
					if (target.get('h').length == 0) {
						event.finish();
						return;
					}
					var rand = Math.random() < 0.5;
					target.chooseCard('净颇梨之镜：亮一张牌给' + get.translation(player) + '看', true).ai = function (card) {
						if (rand) return Math.random();
						return ai.get.value(card);
					};
					"step 1"
					event.dialog = ui.create.dialog(get.translation(target) + '展示的手牌', result.cards);
					event.videoId = lib.status.videoId++;

					game.broadcast('createDialog', event.videoId, get.translation(target) + '展示的手牌', result.cards);
					game.addVideo('cardDialog', null, [get.translation(target) + '展示的手牌', get.cardsInfo(result.cards), event.videoId]);
					event.card2 = result.cards[0];
					game.log(target, '展示了', event.card2);
					player.chooseToDiscard({
						suit: get.suit(event.card2)
					}, function (card) {
						var evt = _status.event.getParent();
						if (evt.target)
							if (ai.get.damageEffect(evt.target, evt.player, evt.player, 'thunder') > 0) {
								return ai.get.value(card, evt.player) < 6;
							}
						return -1;
					}).prompt = false;
					game.delay(2);
					"step 2"
					if (result.bool) {
						target.damage('thunder');
					}
					event.dialog.close();
					game.addVideo('cardDialog', null, event.videoId);
					game.broadcast('closeDialog', event.videoId);
				},
				ai: {
					basic: {
						order: 10,
						value: [3, 1],
						useful: 1,
					},
					result: {
						player: function (player) {
							return 3;
						},
						target: function (player, target) {
							if (target.countCards('h') == 0) return 0;
							if (player.countCards('h') <= 1) return 0;
							if (target == player) {
								return -1.5;
								if (_status.event.skill) {
									var viewAs = get.info(_status.event.skill).viewAs;
								}
								return 0;
							}
							return -1.5;
						},
					},
					tag: {
						thunderDamage: 1,
						order: 7,
					},
				},
			},
			"stg_goldbook_skill": {
				global: "goldbook1",
			},
			"goldbook1": {
				equipSkill: true,
				direct: true,
				trigger: {
					player: "phaseDrawBegin",
				},
				filter: function (event, player) {
					return game.countPlayer(function (current) {
						return current.hasSkill('stg_goldbook_skill') && current.isFriendsOf(player);
					}) > 0;
				},
				content: function () {
					trigger.num += game.countPlayer(function (current) {
						return current.hasSkill('stg_goldbook_skill') && current.isFriendsOf(player);
					});
				},
			},
			/*-------------------防具牌-------------------*/
			"hourai_skill": {
				audio: "ext:东方project:2",
				equipSkill: true,
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					if (player.hasSkillTag('unequip2')) return false;
					if (event.player.hasSkillTag('unequip', false, {
						name: event.card ? event.card.name : null,
						target: player,
						card: event.card
					})) return false;
					return get.tag(event.card, 'damage') && player.countCards('e', {
						name: 'gezi_hourai'
					});
				},
				check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				prompt: "收回【替身人形】，该伤害牌对你无效",
				content: function () {
					var cards = player.getCards('e');
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_hourai') {
							player.gain(cards[i], 'gain2');
							break;
						}
					}
					game.log('替身人形：', trigger.card, '对', player, '无效');
					if (player.name == 'gezi_alice') {
						player.say("上海，蓬莱，好好休息吧！");
					}
					trigger.untrigger();
					trigger.finish();

				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (target.hasSkillTag('unequip2')) return;
							if (player.hasSkillTag('unequip', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							}) || player.hasSkillTag('unequip_ai', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							})) return;
							if (get.tag(card, 'damage')) return 0.8;
						},
					},
				},
			},
			"lantern_skill": {
				audio: "ext:东方project:2",
				equipSkill: true,
				trigger: {
					target: "useCardToBegin",
				},
				check: function (event, player) {
					if (get.effect(player, event.card, event.player, player) >= 0) return false;
					return player.countCards('h') > 2 || player.countCards('h', {
						name: "du"
					});
				},
				filter: function (event, player) {
					if (player.hasSkillTag('unequip2')) return false;
					if (event.player.hasSkillTag('unequip', false, {
						name: event.card ? event.card.name : null,
						target: player,
						card: event.card
					})) return false;
					return event.card.name == 'sha' && get.distance(player, event.player, 'attack') <= 1 && player.canCompare(event.player);
				},
				content: function () {
					"step 0"
					var eff = ai.get.effect(player, trigger.card, trigger.player, trigger.player);
					player.chosenToCompare(trigger.player);
					"step 1"
					if (result.bool) {
						game.log('人魂灯：', trigger.card, '对', player, '无效');
						trigger.untrigger();
						trigger.finish();
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (target.hasSkillTag('unequip2')) return;
							if (player.hasSkillTag('unequip', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							}) || player.hasSkillTag('unequip_ai', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							})) return;
							if (card.name != 'sha') return;
							if (get.distance(player, target, 'attack') > 1) return;
							if (!player.canCompare(target)) return;
							return 0.8;
						},
					},
				},
			},
			"mirror_skill": {
				trigger: {
					target: "shaBegin",
				},
				equipSkill: true,
				filter: function (event, player) {
					if (player.hasSkillTag('unequip2')) return false;
					if (event.player.hasSkillTag('unequip', false, {
						name: event.card ? event.card.name : null,
						target: player,
						card: event.card
					})) return false;
					if (!event.card) return false;
					return true;
				},
				check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				content: function () {
					'step 0'
					player.judge(function (card) {
						if (get.color(card) == get.color(trigger.card)) return 1;
						return -1;
					});
					'step 1'
					if (result.color) {
						if (result.color == get.color(trigger.card)) {
							trigger.cancel();
							game.log('八咫镜：' + get.translation(trigger.card) + '对' + get.translation(player) + '无效。');
						}
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (target.hasSkillTag('unequip2')) return;
							if (player.hasSkillTag('unequip', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							}) || player.hasSkillTag('unequip_ai', false, {
								name: card ? card.name : null,
								target: player,
								card: card
							})) return;
							if (card.name == 'sha' && card.color) return 0.6;
						},
					},
				},
			},
			"yinyangyu_skill_1": {
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				equipSkill: true,
				filter: function (event, player) {
					if (event.responded) return false;
					if (event.bagua_skill) return false;
					if (!event.filterCard({
						name: 'shan'
					}, player, event)) return false;
					if (event.name == 'chooseToRespond' && !lib.filter.cardRespondable({
						name: 'shan'
					}, player, event)) return false;
					if (player.hasSkillTag('unequip2')) return false;
					var evt = event.getParent();
					if (evt.player && evt.player.hasSkillTag('unequip', false, {
						name: evt.card ? evt.card.name : null,
						target: player,
						card: evt.card
					})) return false;
					return player.countCards('he', {
						color: 'red'
					});
				},
				filterCard: function (card) {
					return get.color(card) == 'red';
				},
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					if (!player.num('he', {
						color: 'red'
					})) return false;
				},
				precontent: function () {
					player.$effectn('yinyangyu_skill', 7);
				},
				position: "he",
				prompt: "将一张红色牌当【闪】使用或打出",
				check: function (card) {
					return 6 - ai.get.value(card)
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards('he', {
							color: 'red'
						})) return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0) return 0.6
						},
					},
					order: 4,
					useful: -1,
					value: -1,
				},
			},
			"yinyangyu_skill_2": {
				audio: "ext:东方project:2",
				equipSkill: true,
				enable: ["chooseToRespond", "chooseToUse"],
				filter: function (event, player) {
					if (event.responded) return false;
					if (!event.filterCard({
						name: 'sha'
					}, player, event)) return false;
					if (event.name == 'chooseToRespond' && !lib.filter.cardRespondable({
						name: 'sha'
					}, player, event)) return false;
					if (player.hasSkillTag('unequip2')) return false;
					var evt = event.getParent();
					if (evt.player && evt.player.hasSkillTag('unequip', false, {
						name: evt.card ? evt.card.name : null,
						target: player,
						card: evt.card
					})) return false;
					return player.countCards('he', {
						color: 'black'
					});
				},
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				viewAsFilter: function (player) {
					if (!player.num('he', {
						color: 'black'
					})) return false;
				},
				precontent: function () {
					player.$effectn('yinyangyu_skill', 7);
				},
				prompt: "将一张黑色牌当【杀】使用或打出",
				check: function (card) {
					return 5 - ai.get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.countCards('he', {
							color: 'black'
						})) return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondSha') && current < 0) return 0.6
						},
					},
					respondSha: true,
					order: function () {
						return get.order({
							name: 'sha'
						}) - 0.1;
					},
					useful: -1,
					value: -1,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.hasSkillTag('filterDamage', null, {
								player: player,
								card: {
									name: 'sha'
								},
							})) {
								if (get.attitude(player, target) > 0) {
									return -7;
								} else {
									return -4;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"stg_waterbook_skill": {
				global: "waterbook1",
			},
			"waterbook1": {
				enable: ["chooseToUse", "chooseToRespond"],
				equipSkill: true,
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('h', {
						color: 'black'
					})) return false;
					return game.hasPlayer(function (current) {
						return current.isFriendsOf(player) && current.hasSkill('stg_waterbook_skill');
					});
				},
				prompt: "将一张黑色手牌当【闪】使用/打出",
				check: function () {
					return 1
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards('h', {
							color: 'black'
						})) return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0) return 0.6
						},
					},
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
					result: {
						player: 1,
					},
				},
			},
			/*-------------------防御马-------------------*/
			"frog_skill": {
				enable: ["chooseToUse"],
				equipSkill: true,
				filterCard: function (card, player) {
					return card.name == 'gezi_frog';
				},
				position: "e",
				viewAs: {
					name: "sha",
				},
				prompt: "将一张青蛙扔出去(当【杀】使用)！",
				check: function (card) {
					return 4 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						return true;
					},
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"stg_dirtbook_skill": {
				forced: true,
				trigger: {
					global: "die",
				},
				filter: function (event, player) {
					return event.player.identity != player.identity && event.player.countCards('hej');
				},
				content: function () {
					"step 0"
					player.choosePlayerCard('hej', trigger.player, true);
					"step 1"
					if (result.cards.length) {
						player.gain(result.cards[0], trigger.player, 'giveAuto');
					}
				},
			},
			/*-------------------进攻马-------------------*/
			"lunadial_skill": {
				audio: "ext:东方project:2",
				equipSkill: true,
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.lili;
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					"step 0"
					player.$effectn('lunadial_skill', 11),
						player.loselili();
					target.addnSkill('lunadial2');
					if (player.name == 'gezi_sakuya') {
						player.say("The World！！！！")
					}
				},
				ai: {
					basic: {
						order: 10,
						value: [6, 3],
						useful: 3,
					},
					result: {
						player: function (player) {
							return player.lili > 3;
						},
						target: function (player, target) {
							if (target.countCards('h') == 0) return 0;
							if (!player.countCards('h', function (card) {
								return get.tag(card, 'damage');
							})) return 0;
						},
					},
				},
			},
			"lunadial2": {
				trigger: {
					global: "phaseAfter",
				},
				forced: true,
				mark: true,
				audio: "ext:东方project:false",
				popup: false,
				init: function (player) {
					player.storage.lunadial = player.node.framebg.dataset.auto;
					player.node.framebg.dataset.auto = 'lock';
				},
				onremove: function (player) {
					player.node.framebg.dataset.auto = player.storage.lunadial;
					delete player.storage.lingbi;
				},
				content: function () {
					player.removeSkill('lunadial2');
				},
				mod: {
					cardEnabled: function () {
						return false;
					},
					cardUsable: function () {
						return false;
					},
					cardRespondable: function () {
						return false;
					},
					cardSavable: function () {
						return false;
					},
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, 'damage') && -get.attitude(player, target)) return 0.8;
						},
					},
				},
			},
			"stg_woodbook_skill": {
				global: "woodbook1",
			},
			"woodbook1": {
				equipSkill: true,
				mod: {
					maxHandcard: function (player, num) {
						return num + game.countPlayer(function (current) {
							return current.hasSkill('stg_woodbook_skill') && current.isFriendsOf(player);
						});
					},
				},
			},
			/*-------------------宝物牌-------------------*/
			"book_skill": {
				trigger: {
					player: "phaseEnd",
				},
				equipSkill: true,
				forced: true,
				priority: 8.6,
				filter: function (event, player) {
					return !player.hasJinengpai();
				},
				content: function () {
					player.$effectn('book_skill', 11);
					if (player.name == 'gezi_patchouli') player.say('书中自有黄金屋。');
					var list = ["gezi_firebook", "gezi_waterbook", "gezi_woodbook", "gezi_goldbook", "gezi_dirtbook"];
					player.addJudgen(game.createCard(list.randomGet(), '', ''));
				},
			},
			"houraiyuzhi_skill": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				discard: false,
				lose: false,
				filterCard: function (card) {
					return true;
				},
				prepare: function (cards, player, targets) {
					player.showCards(cards);
					player.storage.houraiyuzhi = cards[0];
				},
				content: function () {
					'step 0'
					if (player.name == 'gezi_kaguya') {
						player.say('看呐，我的宝物哟。');
					}
					player.chooseControl('花色', '点数').set('ai', function () {
						return '点数';
					}).set('prompt', '想要更改哪一样？');
					'step 1'
					if (result.control) {
						var list = [];
						event.control = result.control;
						if (result.control == '花色') {
							list = ['heart', 'spade', 'diamond', 'club'];
						} else if (result.control == '点数') {
							list = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];
						}
						player.chooseControl(list).set('prompt', '想要改成什么？');
					}
					'step 2'
					if (result.control) {
						if (event.control == '花色') {
							player.storage.houraiyuzhisuit = result.control;
						} else if (event.control == '点数') {
							var num = result.control;
							switch (num) {
								case 'A':
									num = 1;
									break;
								case 'J':
									num = 11;
									break;
								case 'Q':
									num = 12;
									break;
								case 'K':
									num = 13;
									break;
								default:
									num = num;
							}
							player.storage.houraiyuzhinumber = result.control;
						}
						player.addTempSkill('houraiyuzhi_skill2');
						game.log(get.translation(cards[0]) + '改为' + get.translation(result.control) || result.control);
					}
				},
			},
			"houraiyuzhi_skill2": {
				mod: {
					suit: function (card, suit) {
						if (!get.owner(card)) return suit;
						var player = get.owner(card);
						if (card == player.storage.houraiyuzhi && player.storage.houraiyuzhisuit) return player.storage.houraiyuzhisuit;
					},
					number: function (card, number) {
						if (!get.owner(card)) return number;
						var player = get.owner(card);
						if (card == player.storage.houraiyuzhi && player.storage.houraiyuzhinumber) return player.storage.houraiyuzhinumber;
					},
				},
			},
			"ibuki_skill": {
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				filter: function (event, player) {
					return player.num('h', {
						type: 'basic'
					}) > 0;
				},
				filterCard: {
					type: "basic",
				},
				check: function (card) {
					return 7 - ai.get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
				},
				position: "h",
				prompt: "将一张基本牌置于弃牌堆，获得一点灵力，然后若你灵力不大于3或不能获得灵力，摸一张牌",
				content: function () {
					"step 0"
					if (player.lili > 3 && !player.node.fuka && player.lili < player.maxlili) {
						player.gainlili();
					} else {
						player.gainlili();
						player.draw();
					}
					"step 1"
					if (player.name == 'gezi_suika') player.say('好酒，好酒~');
					"step 2"
					game.cardsDiscard(cards);
				},
				ai: {
					order: 1.9,
					result: {
						player: function (player) {
							if (player.lili > 3) return 0;
							return 1;
						},
					},
				},
			},
			"pantsu_skill": {
				equipSkill: true,
				forced: true,
				trigger: {
					target: "discardPlayerCardBegin",
				},
				filter: function (event, player) {
					return player.countCards('e', {
						name: 'gezi_pantsu'
					}) && event.player != event.target;
				},
				content: function () {
					var cards = player.getCards('e');
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_pantsu') {
							trigger.directresult = [cards[i]];
							break;
						}
					}
				},
			},
			"pantsu_skill2": {
				equipSkill: true,
				forced: true,
				trigger: {
					target: "gainPlayerCardBegin",
				},
				filter: function (event, player) {
					return player.countCards('e', {
						name: 'gezi_pantsu'
					}) && event.player != event.target;
				},
				content: function () {
					var cards = player.getCards('e');
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_pantsu') {
							trigger.directresult = [cards[i]];
							break;
						}
					}
				},
			},
			"saiqian_skill": {
				global: "saiqian_skill2",
			},
			"saiqian_skill2": {
				audio: "ext:东方project:true",
				enable: "phaseUse",
				equipSkill: true,
				usable: 1,
				discard: false,
				line: true,
				position: "he",
				prepare: function (cards, player, targets) {
					player.$give(cards.length, targets[0]);
				},
				filter: function (event, player) {
					if (player.num('he') == 0) return 0;
					return game.hasPlayer(function (target) {
						return target != player && target.hasSkill('saiqian_skill', player);
					});
				},
				filterCard: function (card) {
					return true;
				},
				filterTarget: function (card, player, target) {
					return target != player && target.hasSkill('saiqian_skill', player);
				},
				check: function (card) {
					return 7 - get.value(card)
				},
				forceaudio: true,
				prompt: "请选择要供奉的牌",
				content: function () {
					if (target.name == 'gezi_reimu') target.say('谢谢谢谢！太谢谢了太谢谢了！请你下次一定要再来！听见了没有，一定要再来啊！');
					else target.say('谢谢！');
					target.gain(cards);
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: function (player, target) {
							if (!target.needsToDiscard() && target.countCards('h') <= 3) return 0;
							if (target.needsToDiscard()) return 1;
							return 0.5;
						},
						player: function (player, target) {
							if (player.countCards('h') > player.getHandcardLimit()) return 0;
							else return -0.5;
						},
					},
				},
			},
			"saiqian_skill3": {
				enable: "chooseToUse",
				equipSkill: true,
				filterCard: function (card) {
					return true;
				},
				position: "he",
				viewAs: {
					name: "gezi_reidaisai",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('he')) return false;
				},
				usable: 1,
				prompt: "将一张牌当【例大祭】使用",
				check: function (card) {
					return 5 - get.value(card)
				},
				ai: {
					wuxie: function (target, card, player, viewer) {
						if (game.countPlayer(function (current) {
							return ai.get.attitude(viewer, current) <= 0;
						}) == 1) {
							return 0;
						};
						if (ai.get.attitude(viewer, target) <= 0 && target.countCards('e', function (card) {
							return get.value(card) > 0;
						})) {
							if (Math.random() < 0.5) return 0;
							return 1;
						}
						return 0;
					},
					basic: {
						order: 5,
						useful: 1,
						value: 1,
					},
					result: {
						target: function (player, target) {
							return 1;
						},
					},
					tag: {
						multitarget: 1,
					},
				},
			},
			"stone_skill": {
				enable: "chooseToUse",
				equipSkill: true,
				filter: function (event, player) {
					return (player.num('e', {
						name: 'gezi_stone'
					}) > 0);
				},
				usable: 1,
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'trick' && event.filterCard({
								name: i
							}, player, event)) {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = ['锦囊', '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					check: function (button) {
						return (button.link[2] == 'gezi_xuyuanshu') ? 1 : -1;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								if (ui.selected.cards.length) {
									if (ui.selected.cards[0].name == 'gezi_stone') return true;
									return (card.name == 'gezi_stone');
								} else {
									return true;
								}
								return false;
							},
							position: 'he',
							selectCard: 2,
							complexCard: true,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function (links, player) {
						return '将两张牌（包括贤者之石）当作' + get.translation(links[0][2]) + '使用';
					},
				},
				ai: {
					order: 6,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"stg_deck_skill": {
				trigger: {
					global: "gainAfter",
				},
				equipSkill: true,
				usable: 1,
				filter: function (event, player) {
					if (!event.player.countCards('hej')) return false;
					return (player != event.player && !(event.player == _status.currentPhase && _status.event.getParent('phaseDraw')));
				},
				prompt: "一回合一次，其他角色于出牌阶段内获得牌后，你可以弃置其区域内的一张牌。",
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function () {
					player.discardPlayerCard(trigger.player, 'hej', true);
				},
			},
			"stg_firebook_skill": {
				global: "firebook1",
			},
			"firebook1": {
				equipSkill: true,
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + game.countPlayer(function (current) {
							if (current.hasSkill('stg_firebook_skill') && current.isFriendsOf(player)) return true;
						});
					},
				},
			},
			/*-------------------禁忌牌-------------------*/
			"_bingyu": {
				direct: true,
				trigger: {
					player: "phaseDiscardBefore",
				},
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'gezi_bingyu'
					}) && player.lili > 2 && !player.skipList.contains('phaseDiscard') && !player.hasSkill("gezi_bingyu2");
				},
				priority: -22,
				content: function () {
					'step 0'
					player.chooseToDiscard(1, {
						name: 'gezi_bingyu'
					}, 'h', '你可以弃置【冰域之宴】，消耗3点灵力，永久跳过弃牌阶段');
					'step 1'
					if (result.bool) {
						player.loselili(3);
						//player.skip('phaseDiscard');
						player.addSkill("gezi_bingyu2");
						trigger.cancel();
					}
				},
			},
			"bingyu1": {
				trigger: {
					source: "damageBefore",
				},
				forced: true,
				priority: 15,
				intro: {
					content: "防止所有角色造成的所有伤害",
				},
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.hasSkill('bingyu2');
					});
				},
				content: function () {
					trigger.untrigger();
					trigger.finish();
				},
				ai: {
					skillTagFilter: function (player) {
						return game.hasPlayer(function (current) {
							return current.hasSkill('bingyu2');
						});
					},
					nofire: true,
					nothunder: true,
					nodamagesource: true,
					notrick: true,
					notricksource: true,
					effect: {
						target: function (card, player, target, current) {
							if (!game.hasPlayer(function (current) {
								return current.hasSkill('bingyu2');
							})) return;
							if (get.tag(card, 'damage')) {
								return 'zeroplayertarget';
							}
						},
						player: function (card, player, target, current) {
							if (!game.hasPlayer(function (current) {
								return current.hasSkill('bingyu2');
							})) return;
							if (get.tag(card, 'damage')) {
								return 'zeroplayertarget';
							}
						},
					},
				},
			},
			"bingyu2": {
				global: ["bingyu1"],
				trigger: {
					player: ["phaseBegin", "dieBegin"],
				},
				forced: true,
				init: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'extension/东方project/snow1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'extension/东方project/snow3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
				onremove: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					var bstyle = lib.config.border_style;
					if (bstyle.indexOf('dragon_') == 0) {
						bstyle = bstyle.slice(7);
					}
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						players[i].removeSkill('bingyu1');
						players[i].node.framebg.dataset.auto = players[i].storage.bingyu;
						delete players[i].storage.bingyu;
					}
					player.removeSkill('bingyu2');
				},
			},
			"gezi_bingyu2": {
				trigger: {
					player: "phaseDiscardBefore",
				},
				popup: false,
				superCharlotte: true,
				charlotte: true,
				direct: true,
				unique: true,
				forced: true,
				content: function () {
					trigger.cancel();
				},
			},
			"_gezi_dianche": {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'gezi_dianche'
					}) && player.countCards('he') > 1;
				},
				selectCard: 2,
				discard: false,
				line: true,
				position: "he",
				selectTarget: 1,
				prepare: function (cards, player, targets) {
					player.$give(cards.length, targets[0]);
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				filterCard: function (card, player) {
					if (ui.selected.cards.length) {
						if (ui.selected.cards[0].name == 'gezi_dianche') return true;
						return card.name == 'gezi_dianche';
					} else {
						return true;
					}
					return false;
				},
				content: function () {
					target.gain(cards);
				},
				complexCard: true,
				prompt: "你可以将废线电车和一张牌交给一名其他角色。",
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: function (player, target) {
							if (target.countCards('h') <= target.getHandcardLimit()) return 1;
							else return 0.5;
						},
						player: function (player, target) {
							if (player.countCards('h') > player.getHandcardLimit()) return 0;
							else return -0.5;
						},
					},
				},
			},
			"_huanxiang": {
				skillAnimation: true,
				trigger: {
					global: "gameDrawAfter",
					player: "enterGame",
				},
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'gezi_huanxiang'
					}) > 0;
				},
				content: function () {
					game.log('幻想之扉：游戏开始时，或你进入游戏时，令所有角色摸一张牌');
					player.showCards(player.getCards('h', {
						name: 'gezi_huanxiang'
					}));
					for (var i = 0; i < game.filterPlayer().length; i++) {
						game.filterPlayer()[i].draw();
					}
				},
				check: function (event, player) {
					return game.countPlayer(function (current) {
						if (get.attitude(player, current) > 0) return -2;
						else return 2;
					}) > 0;
				},
				prompt: "是否发动【幻想之扉】：游戏开始时，或你进入游戏时，可以令所有角色摸一张牌",
			},
			"huazhi_skill": {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				content: function () {
					var num = player.getStat('damage');
					player.draw(num);
				},
			},
			"_jingxia": {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards('h', 'gezi_jingxia') > 0 && player.lili > 1;
				},
				content: function () {
					'step 0'
					player.chooseCard('弃置一张【惊吓派对】，消耗两点灵力，获得【潜行】直到你的下个回合开始', 'h', function (card) {
						return card.name == 'gezi_jingxia';
					}).set('ai', function (card) {
						return 1;
					});
					'step 1'
					if (result.bool) {
						player.discard(result.cards[0]);
						player.loselili(2);
						player.tempHide();
						player.logSkill('_jingxia');
					}
				},
				ai: {
					result: {
						player: function (player, target) {
							return 0.7;
						},
					},
				},
			},
			"lingbi1": {
				mod: {
					cardEnabled: function (card, player) {
						var players = game.filterPlayer();
						var cards = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
						}
						if (cards.contains(card.name)) return false;
					},
					cardUsable: function (card, player) {
						var players = game.filterPlayer();
						var cards = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
						}
						if (cards.contains(card.name)) return false;
					},
					cardRespondable: function (card, player) {
						var players = game.filterPlayer();
						var cards = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
						}
						if (cards.contains(card.name)) return false;
					},
					cardSavable: function (card, player) {
						var players = game.filterPlayer();
						var cards = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].storage._lingbi2) cards = cards.concat(players[i].storage._lingbi2);
						}
						if (cards.contains(card.name)) return false;
					},
				},
			},
			"lingbi2": {
				global: "lingbi1",
				trigger: {
					player: ["phaseBegin", "dieBegin"],
				},
				intro: {
					content: "cards",
				},
				forced: true,
				init: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'extension/东方project/lock1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'extension/东方project/lock3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
				onremove: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					var bstyle = lib.config.border_style;
					if (bstyle.indexOf('dragon_') == 0) {
						bstyle = bstyle.slice(7);
					}
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
				filter: function (event, player) {
					if (!player.storage._lingbi2) return false;
					return player.storage._lingbi2.length > 0;
				},
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						players[i].removeSkill('lingbi1');
						players[i].node.framebg.dataset.auto = players[i].storage.lingbi;
						delete players[i].storage.lingbi;
					}
					player.removeSkill('lingbi2');
					player.storage.lingbi2 = [];
					player.storage._lingbi2 = [];
					player.unmarkSkill('lingbi2');
					player.unmarkSkill('_lingbi2');
				},
			},
			"_lingbi": {
				enable: "chooseToUse",
				filterCard: function (card) {
					return card.name == 'gezi_lingbi';
				},
				viewAsFilter: function (player) {
					return player.countCards('h', {
						name: 'gezi_lingbi'
					}) > 0;
				},
				viewAs: {
					name: "wuxie",
				},
				prompt: "将【令避之间】当【无懈可击】使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						player: 1,
					},
					expose: 0.2,
				},
			},
			"_lingbi2": {
				skillAnimation: true,
				trigger: {
					player: "useCard",
				},
				forced: true,
				init: function (player) {
					player.storage._lingbi2 = [];
					player.storage.lingbi2 = [];
				},
				filter: function (event, player) {
					return (event.card.name == 'gezi_lingbi');
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						list.push([get.type(lib.inpile[i]), '', lib.inpile[i]]);
					}
					player.chooseButton(['选择不让使用打出的牌', [list, 'vcard']], true).set('filterButton', function (button) {
						return true;
					}).set('ai', function (button) {
						var rand = _status.event.rand * 2;
						switch (button.link[2]) {
							case 'sha':
								return 5 + rand[1];
							case 'tao':
								return 4 + rand[2];
							case 'shan':
								return 4.5 + rand[3];
							case 'juedou':
								return 4 + rand[4];
							case 'shunshou':
								return 3 + rand[5];
							default:
								return rand[6];
						}
					}).set('rand', [Math.random(), Math.random(), Math.random(), Math.random(),
					Math.random()
					], Math.random());
					'step 1'
					if (result.bool) {
						player.addnSkill('lingbi2');
						game.log(get.translation(player) + '声明了' + get.translation(result.links[0][2]) + '不可以使用。');
						if (!player.storage._lingbi2) player.storage._lingbi2 = [];
						if (!player.storage.lingbi2) player.storage.lingbi2 = [];
						player.showCards(result.links);
						player.storage._lingbi2.add(result.links[0][2]);
						player.storage.lingbi2.add(game.createCard(result.links[0][2], '', ''));
						player.markSkill('lingbi2');
						player.syncStorage('_lingbi2');
						player.syncStorage('lingbi2');
					}
				},
			},
			"_gezi_shenlin": {
				trigger: {
					player: "damageBefore",
				},
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'gezi_shenlin'
					});
				},
				content: function () {
					var cards = player.getCards('h');
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_shenlin') {
							player.discard(cards[i]);
							break;
						}
					}
					player.addTempSkill('mianyi');
				},
			},
			"_simen": {
				trigger: {
					player: "discardAfter",
				},
				forced: true,
				skillAnimation: true,
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].name == 'gezi_simen') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].name == 'gezi_simen') {
							game.log('死境之门启动：所有角色失去1点体力。');
							var players = game.filterPlayer();
							player.line(players, 'black');
							for (var j = 0; j < players.length; j++) {
								players[j].loseHp();
							}
						}
					}
				},
			},
			"_tianguo": {
				trigger: {
					player: "useCard",
				},
				forced: true,
				filter: function (event, player) {
					return (event.card.name == 'gezi_tianguo');
				},
				content: function () {
					var cards = [];
					for (i = 0; i < ui.discardPile.childNodes.length; i++) {
						var currentcard = ui.discardPile.childNodes[i];
						currentcard.vanishtag.length = 0;
						if (get.info(currentcard).vanish || currentcard.storage.vanish) {
							currentcard.remove();
							continue;
						}
						cards.push(currentcard);
					}
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.appendChild(cards[i]);
					}
					for (var i = ui.cardPile.length; i >= 0; i--) {
						ui.cardPile.appendChild(ui.cardPile.childNodes[Math.random() * i | 0]);
					}
					game.log("天国之阶：弃牌堆加入牌堆");
					if (ui.cardPileNumber) ui.cardPileNumber.innerHTML = game.roundNumber + '轮 剩余牌: ' + ui.cardPile.childNodes.length;
				},
			},
			"_tianguo2": {
				skillAnimation: true,
				trigger: {
					player: "drawAfter",
				},
				filter: function (event, player) {
					if (event.result.length) {
						for (var i = 0; i < event.result.length; i++) {
							if (event.result[i].name == 'gezi_tianguo') {
								return true;
							}
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.result.length; i++) {
						if (trigger.result[i].name == 'gezi_tianguo') {
							game.log('天国之阶启动：所有角色回复1点体力。');
							var players = game.filterPlayer();
							for (var j = 0; j < players.length; j++) {
								players[j].recover();
							}
						}
					}
				},
				ai: {
					result: {
						player: function (player, target) {
							var players = game.filterPlayer();
							var num = 0;
							for (var i = 0; i < players.length; i++) {
								num += get.recoverEffect(players[i], player, player);
							}
							return num > 1;
						},
					},
					tag: {
						recover: 0.5,
						multitarget: 1,
					},
				},
				prompt: "是否发动【天国之阶】：摸到后，可以令所有角色回复1点体力？",
			},
			"_zuiye": {
				skillAnimation: true,
				trigger: {
					source: "damageBefore",
				},
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'gezi_zuiye'
					}) > 0;
				},
				content: function () {
					var hand = player.getCards('h');
					for (var i = 0; i < hand.length; i++) {
						if (hand[i].name == 'gezi_zuiye') {
							trigger.player.gain(hand[i]);
							player.$give(hand[i], trigger.player);
							trigger.num++;
						}
					}
				},
				prompt: "是否发动【罪业边狱】：将罪业边狱交给对方，令伤害+1",
				check: function (event, player) {
					if (get.attitude(player, event.player) >= 0) return false;
					else return true;
				},
			},
			"_gezi_zhunbei": {
				popup: false,
				direct: true,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					if (get.mode() == 'boss') return false;
					if (player.hasSkill('gezi_kedan')) return true;
					return player.countCards('h', {
						name: 'gezi_bingyu'
					}) > 0 || player.countCards('h', {
						name: 'gezi_lingbi'
					}) > 0;
				},
				content: function () {
					player.chooseToUse(function (card) {
						return card.name == 'gezi_lingbi' || card.name == 'gezi_bingyu';
					}, '你有可以在准备阶段使用的牌，是否使用？');
				},
			},
			/*-------------------异变牌-------------------*/
			"baka_normal": {
			},
			"baka_win": {
				trigger: {
					source: "dieAfter",
				},
				forced: true,
				silent: true,
				priority: 99,
				filter: function (event, player) {
					var num = 0;
					for (var j = 0; j < player.stat.length; j++) {
						if (player.stat[j].kill != undefined) num += player.stat[j].kill;
					}
					return num > 1;
				},
				content: function () {
					game.incidentover(player, 'gezi_baka');
				},
				ai: {
					threaten: function (player, target) {
						var num = 0;
						for (var j = 0; j < player.stat.length; j++) {
							if (player.stat[j].kill != undefined) num += player.stat[j].kill;
						}
						if (num > 0) return 3;
						return 1;
					},
				},
				popup: false,
			},
			"death_normal":{
				init:player => {
					player.storage.death_normal=true;
					lib.onover.push(function(){
						if(player.storage.death_normal){
							_status.over=false;
							ui.dialog.close();
							ui.controls.forEach(function(control){
								control.close();
							});
						}
					});
					game.players.forEach(current => {
						if(current==player) current.removeSkill('death_win');
						else if(!current.hasSkill('death_normal')) current.addSkill('death_win');
						current.ai.modAttitudeFrom=(from,to,att) => (from.hasSkill('death_normal')||to.hasSkill('death_normal')) ? -8 : 6;
						current.ai.modAttitudeTo=(from,to,att) => (from.hasSkill('death_normal')||to.hasSkill('death_normal')) ? -8 : 6;
					});
					//player.$skill('皆杀','legend','fire');
				},
				trigger:{
					global:"dieAfter",
				},
				filter:function(event,player){
					if(event.player==player) return true;
					if(event.source==player) return true;
					return game.players.length==1;
				},
				forced:true,
				charlotte:true,
				async content(event,trigger,player){
					if(trigger.player==player){
						player.storage.death_normal=false;
						game.over(player!=game.me);
						await game.incidentover(player,'gezi_death');
					}
					else if(game.players.length==1){
						player.storage.death_normal=false;
						player.$skill('之后就一个人都<br>没有了吗？','legend','fire');
						await game.asyncDelay(3);
						await game.incidentover(player,'gezi_death');
					}
					else if(trigger.source==player) await player.draw(3);
				},
				group:["death_normal_cancel"],
				subSkill:{
					"cancel":{
						trigger:{
							player:["drawBefore","discardBefore"],
						},
						forced:true,
						nopop:true,
						filter:function(event, player){
							let evt=event.getParent();
							return evt&&evt.name=="die"&&evt.source==player;
						},
						async content(event,trigger,player){
							trigger.cancel();
						},
						sub:true,
					},
				},
				ai:{
					threaten:10,
				},
			},
			"death_win":{
				trigger:{
					global:"die",
				},
				forced:true,
				silent:true,
				nopop:true,
				filter:function(event,player){
					return event.player.hasSkill('death_normal');
				},
				async content(event,trigger,player){
					trigger.player.storage.death_normal=false;
					if(game.me.isAlive()&&game.me.hasSkill('death_normal')&&game.players.length==1) game.over(true);
					if(game.me.isDead()&&game.me.hasSkill('death_win')&&game.players.every(current => !current.hasSkill('death_normal'))) game.over(true);
					if(game.me.isDead()&&game.me.hasSkill('death_normal')&&game.players.every(current => !current.hasSkill('death_normal'))) game.over(false);
				},
				popup:false,
			},
			"immaterial_normal": {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.lili || !player.node.lili;
				},
				content: function () {
					player.useCard({
						name: 'gezi_reidaisai'
					}, game.filterPlayer());
					player.loselili();
				},
				ai: {
					order: 5,
					player: function (player) {
						if (player.lili > 1 || !player.node.lili) return 0.5;
						return -1;
					},
					result: {
						player: function (player) {
							return game.countPlayer(function (current) {
								if (get.attitude(player, current) < 0) return -1;
								if (get.attitude(player, current) >= 0) return 1;
							});
						},
					},
				},
			},
			"immaterial_win": {
				trigger: {
					player: "phaseEnd",
				},
				forced: true,
				silent: true,
				priority: 99,
				filter: function (event, player) {
					return true;
				},
				mark: true,
				intro: {
					content: function (content, player) {
						var num = 0;
						for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
							if (ui.discardPile.childNodes[i].name == 'tao') num++;
						}
						return '弃牌堆里有' + num + '张【桃】';
					},
				},
				content: function () {
					var num = 0;
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						if (ui.discardPile.childNodes[i].name == 'tao') num++;
					}
					if (num >= 8) {
						game.incidentover(player, 'gezi_immaterial');
					}
				},
				ai: {
					threaten: function (player, target) {
						if (ui.discardPile.childNodes.length > 70) return 2;
						return 1;
					},
				},
				popup: false,
			},
			"imperishable_normal": {
				trigger: {
					global: "loseEnd",
				},
				forced: true,
				filter: function (event, player) {
					if (!event.player.isAlive()) return false;
					if (event.player.hasJinengpai()) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == 'h') return true;
					}
					return false;
				},
				content: function () {
					player.line(trigger.player, 'black');
					trigger.player.useSkill('gezi_jinengpai_use');
				},
			},
			"imperishable_win": {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				mark: true,
				silent: true,
				priority: 99,
				init: function (player) {
					player.storage.imperishable_win = 0;
				},
				intro: {
					marktext: "永",
					content: "mark",
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.storage.imperishable_win += 1;
					player.syncStorage('imperishable_win');
					player.markSkill('imperishable_win');
					if (player.storage.imperishable_win >= 7) {
						game.incidentover(player, 'gezi_imperishable');
					};
				},
				ai: {
					threaten: function (player, target) {
						if (!target.storage.imperishable_win) return 1;
						return Math.max(1, target.storage.imperishable_win - 3);
					},
				},
				popup: false,
			},
			"phantasmagoria_normal": {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.isAlive();
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (trigger.player.lili < trigger.player.maxlili && !trigger.player.node.fuka) {
						trigger.player.gainlili();
					} else {
						trigger.player.draw();
					}
				},
			},
			"phantasmagoria_win": {
				trigger: {
					global: "onWash",
				},
				forced: true,
				silent: true,
				priority: 99,
				skillAnimation: true,
				filter: function (event, player) {
					return !game.dead || game.dead.length == 0;
				},
				content: function () {
					game.incidentover(player, 'gezi_phantasmagoria');
				},
				ai: {
					threaten: function (player, target) {
						if (!game.dead) return 2;
						return 1;
					},
				},
				popup: false,
			},
			"sakura_normal": {
				trigger: {
					global: "dying",
				},
				forced: true,
				filter: function (event, player) {
					return event.player.isAlive();
				},
				content: function () {
					player.line(trigger.player, 'red');
					if (player.lili < player.maxlili && !player.node.fuka) {
						player.gainlili();
					} else {
						player.draw();
					}
				},
			},
			"sakura_win": {
				forced: true,
				silent: true,
				trigger: {
					player: "phaseBegin",
				},
				priority: 99,
				filter: function (event, player) {
					return player.isMinHandcard(true) && player.isMinHp(true);
				},
				content: function () {
					game.incidentover(player, 'gezi_sakura');
				},
				ai: {
					threaten: function (player, target) {
						if (target.isMinHandcard(true) && target.isMinHp(true)) return 2;
						return 1;
					},
				},
				popup: false,
			},
			"sb_normal": {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.lili || !player.node.lili;
				},
				filterTarget: function (card, player, target) {
					return player.canUse({
						name: 'gezi_caifang'
					}, target);
				},
				content: function () {
					player.loselili();
					player.useCard({
						name: 'gezi_caifang'
					}, target);
				},
				ai: {
					order: 5,
					result: {
						target: -0.5,
						player: function (player) {
							if (player.lili < 2) return -1;
							return 1;
						},
					},
				},
			},
			"sb_win": {
			},
			"scarlet_normal": {
				global: "scarlet_normal2",
			},
			"scarlet_normal2": {
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - game.countPlayer(function (current) {
							if (from.identityShown != true) return false;
							return current.hasSkill('scarlet_normal') && current.isFriendsOf(from);
						});
					},
				},
			},
			"scarlet_win": {
				forced: true,
				trigger: {
					player: "phaseBegin",
				},
				priority: 99,
				silent: true,
				filter: function (event, player) {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].isOut() || game.players[i] == player) continue;
					}
					return player.isMaxHp(true) && player.isMaxCard(true);
				},
				content: function () {
					game.incidentover(player, 'gezi_scarlet');
				},
				ai: {
					threaten: function (player) {
						if (player.isMaxHp(true) && player.isMaxCard(true)) return 2;
						return 1;
					},
				},
				popup: false,
			},
			/*-------------------技能牌-------------------*/
			"jinu_skill":{
				audio:2,
				cardAnimation:11,
				trigger:{
					player:"damageEnd",
				},
				logTarget:"source",
				filter:function(event,player){
					return event.source&&event.source.countCards('ej');
				},
				content:function(){
					player.discardPlayerCard('ej',trigger.source, true);
				},
				check: function (event, player) {
					if (get.attitude(player, event.source) < 0) return true;
					return false;
				},
			},
			"gezi_lianji_skill": {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
				},
				trigger: {
					player: "damageAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.getParent().name == 'sha';
				},
				content: function () {
					'step 0'
					var cards = player.getJinengpai();
					for (var i = 0; i < cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_lianji') {
							player.removeJudgen(cards[i]);
							break;
						}
					}
					'step 1'
					var cards = trigger.cards.filterInD();
					if (cards.length) {
						player.$gain(cards);
						player.gain(cards, 'gain2');
					} else {
						player.draw();
					}
				},
			},
			"gezi_lingyong_skill": {
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - 1;
					},
				},
				trigger: {
					player: "gainliliBegin",
				},
				priority: 20,
				popup: false,
				filter: function (event, player) {
					return event.num > 0;
				},
				init: function (player) {
					player.storage.gezi_lingyong_skill = 0;
				},
				onremove: function (player) {
					player.storage.gezi_lingyong_skill = 0;
				},
				forced: true,
				content: function () {
					'step 0'
					trigger.num++;
					player.storage.gezi_lingyong_skill++;
					'step 1'
					if (player.storage.gezi_lingyong_skill >= 4) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_lingyong') {
								player.removeJudgen(cards[i]);
								player.storage.gezi_lingyong_skill = 0;
								break;
							}
						}
					}
				},
			},
			"gezi_qianxing_skill": {
				trigger: {
					global: "phaseEnd",
				},
				group: "gezi_qianxing_skill2",
				forced: true,
				filter: function (event, player) {
					if (player.hasSkill('gezi_qianxing_skill3')) return false;
					return true;
				},
				content: function () {
					player.$effectn('gezi_qianxing_skill', 6);
					player.addTempSkill('gezi_qianxing_skill3', {
						player: "phaseBegin"
					});
				},
			},
			"gezi_qianxing_skill2": {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					'step 0'
					var cards = player.getJinengpai();
					for (var i = 0; i < cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_qianxing') {
							player.removeJudgen(cards[i]);
							break;
						}
					}
				},
			},
			"gezi_qianxing_skill3": {
				mark: true,
				intro: {
					content: "不能成为【杀】的目标",
				},
				mod: {
					targetEnabled: function (card, player, target, now) {
						if (target.countJinengpai('j', {
							name: 'gezi_qianxing'
						})) {
							if (get.name(card) == 'sha') return false;
						}
					},
				},
			},
			"shengdun_skill": {
				filter: function (event, player) {
					if (event.player == player) return false;
					if (!event.card) return false;
					if (!event.player.countCards('h')) return false;
					if (!player.countCards('h')) return false;
					if (get.type(event.card) != 'trick') return false;
					return player.canCompare(event.player);
				},
				logTarget: "player",
				check: function (event, player) {
					if (get.effect(player, event.card, event.player, player) >= 0) {
						return false;
					}
					if (get.tag(event.card, 'respondSha')) {
						if (player.countCards('h', {
							name: 'sha'
						}) == 0) {
							return true;
						}
					} else if (get.tag(event.card, 'respondShan')) {
						if (player.countCards('h', {
							name: 'shan'
						}) == 0) {
							return true;
						}
					} else if (get.tag(event.card, 'damage')) {
						if (player.countCards('h') < 2) return true;
					} else if (event.card.name == 'shunshou' && player.hp > 2) {
						return true;
					}
					return false;
				},
				trigger: {
					target: "useCardToBefore",
				},
				content: function () {
					"step 0"
					player.$effectn('shengdun_skill', 17);
					player.chosenToCompare(trigger.player);
					"step 1"
					if (result.bool) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_shengdun') {
								player.removeJudgen(cards[i]);
								break;
							}
						}
						trigger.cancel();
						trigger.finish();
					}
				},
				ai: {
					expose: 0.3,
				},
			},
			"shenyou_skill_1": {
				audio: "ext:东方project:2",
				trigger: {
					player: "damageBefore",
				},
				forced: true,
				filter: function (event, player) {
					if (!event.num) return false;
					return event.num >= player.hp;
				},
				content: function () {
					"step 0"
					var cards = player.getJinengpai();
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_shenyou') {
							player.removeJudgen(cards[i]);
							break;
						}
					}
					player.$effectn('shenyou_skill_1', 11);
					trigger.cancel();
				},
			},
			"shenyou_skill_2": {
				audio: "ext:东方project:2",
				forced: true,
				trigger: {
					player: "judge",
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					"step 0"
					trigger.player.judging[0].suit = "heart";
					"step 1"
					var cards = player.getJinengpai();
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_shenyou') {
							player.removeJudgen(cards[i]);
							break;
						}
					}
					player.$effectn('shenyou_skill_1', 11);
					game.log('神佑：', trigger.player, '的判定牌的花色改为' + get.translation("heart"));
				},
			},
			"ziheng_skill": {
				trigger: {
					player: ["phaseUseEnd"],
				},
				group: ["ziheng_skill_1"],
				filter: function (event, player) {
					return player.countCards('h');
				},
				direct: true,
				init: function (player) {
					player.storage.ziheng_skill = 0;
				},
				onremove: function (player) {
					player.storage.ziheng_skill = 0;
				},
				content: function () {
					"step 0"
					player.chooseCard('h');
					"step 1"
					if (result.bool) {
						player.$effectn('ziheng_skill', 11);
						player.recast(result.cards);
						player.storage.ziheng_skill++;
					}
					"step 2"
					if (player.storage.ziheng_skill >= 4) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_ziheng') {
								player.removeJudgen(cards[i]);
								player.storage.ziheng_skill = 0;
								break;
							}
						}
					}
				},
			},
			"ziheng_skill_1": {
				trigger: {
					player: ["phaseZhunbeiEnd"],
				},
				filter: function (event, player) {
					return player.countCards('h');
				},
				direct: true,
				content: function () {
					"step 0"
					player.choosePlayerCard('hej', player);
					"step 1"
					if (result.bool) {
						player.$effectn('ziheng_skill', 11);
						player.recast(result.cards);
						player.storage.ziheng_skill++;
					}
					"step 2"
					if (player.storage.ziheng_skill >= 4) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_ziheng') {
								player.removeJudgen(cards[i]);
								player.storage.ziheng_skill = 0;
								break;
							}
						}
					}
				},
			},
			"gezi_firebook_skill": {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
				},
				trigger: {
					global: "damageEnd",
				},
				init: function (player) {
					player.storage.gezi_firebook_skill = 0;
				},
				onremove: function (player) {
					player.storage.gezi_firebook_skill = 0;
				},
				forced: true,
				filter: function (event) {
					return event.nature == 'fire';
				},
				content: function () {
					'step 0'
					player.draw();
					player.storage.gezi_firebook_skill++;
					'step 1'
					if (player.storage.gezi_firebook_skill >= 2) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_firebook') {
								player.removeJudgen(cards[i]);
								player.storage.gezi_firebook_skill = 0;
								break;
							}
						}
					}
				},
			},
			"gezi_waterbook_skill": {
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: function (card) {
					return get.color(card) == 'black';
				},
				init: function (player) {
					player.storage.gezi_waterbook_skill = 0;
				},
				onremove: function (player) {
					player.storage.gezi_waterbook_skill = 0;
				},
				filter: function (event, player) {
					return player.countJinengpai('j', {
						name: 'gezi_waterbook'
					});
				},
				precontent: function () {
					'step 0'
					player.storage.gezi_waterbook_skill++;
					'step 1'
					if (player.storage.gezi_waterbook_skill >= 2) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_waterbook') {
								player.removeJudgen(cards[i]);
								player.storage.gezi_waterbook_skill = 0;
								break;
							}
						}
					}
				},
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('h', {
						color: 'black'
					})) return false;
					return player.countJinengpai('j', {
						name: 'gezi_waterbook'
					});
				},
				prompt: "将一张黑色手牌当【闪】使用/打出",
				check: function () {
					return 1
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards('h', {
							color: 'black'
						})) return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (!player.countCards('h', {
								color: 'black'
							})) return;
							if (get.tag(card, 'respondShan') && current < 0) return 0.6
						},
					},
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
					result: {
						player: 1,
					},
				},
			},
			"gezi_woodbook_skill": {
				mod: {
					maxHandcard: function (player, num) {
						return num + 2;
					},
				},
				trigger: {
					player: "phaseDiscardEnd",
				},
				direct: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					player.recover();
					var cards = player.getJinengpai();
					for (var i = 0; i <= cards.length; i++) {
						if (cards[i] && cards[i].name == 'gezi_woodbook') {
							player.removeJudgen(cards[i]);
							break;
						}
					}
				},
			},
			"gezi_dirtbook_skill": {
				forced: true,
				trigger: {
					global: "dieEnd",
				},
				filter: function (event, player) {
					return player.countJinengpai('j', {
						name: 'gezi_dirtbook'
					});
				},
				init: function (player) {
					player.storage.gezi_dirtbook_skill = 0;
				},
				onremove: function (player) {
					player.storage.gezi_dirtbook_skill = 0;
				},
				content: function () {
					'step 0'
					player.recover();
					player.draw();
					player.storage.gezi_dirtbook_skill++;
					'step 1'
					if (player.storage.gezi_dirtbook_skill >= 2) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_dirtbook') {
								player.removeJudgen(cards[i]);
								player.storage.gezi_dirtbook_skill = 0;
								break;
							}
						}
					}
				},
			},
			"gezi_goldbook_skill": {
				forced: true,
				trigger: {
					player: ["phaseBegin", "phaseAfter"],
				},
				init: function (player) {
					player.storage.gezi_goldbook_skill = 0;
				},
				onremove: function (player) {
					player.storage.gezi_goldbook_skill = 0;
				},
				filter: function (event, player) {
					return player.countJinengpai('j', {
						name: 'gezi_goldbook'
					});
				},
				content: function () {
					'step 0'
					player.draw();
					player.storage.gezi_goldbook_skill++;
					'step 1'
					if (player.storage.gezi_goldbook_skill >= 3) {
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == 'gezi_goldbook') {
								player.removeJudgen(cards[i]);
								player.storage.gezi_goldbook_skill = 0;
								break;
							}
						}
					}
				},
			},
			"gezi_jinengpai_use": {
				direct: true,
				content: function () {
					var list = ["gezi_shenyou", "gezi_shengdun", "gezi_lianji", "gezi_qianxing", "gezi_lingyong", "gezi_ziheng", "gezi_firebook", "gezi_waterbook", "gezi_woodbook", "gezi_goldbook", "gezi_dirtbook"];
					player.addJudgen(game.createCard(list.randomGet(), '', ''));
				},
			},
			"gezi_jinengpai_show": {
				direct: true,
				content: function () {
					"step 0"
					var list = ["gezi_shenyou", "gezi_shengdun", "gezi_lianji", "gezi_qianxing", "gezi_lingyong", "gezi_ziheng", "gezi_firebook", "gezi_waterbook", "gezi_woodbook", "gezi_goldbook", "gezi_dirtbook"];
					var card = game.createCard(list.randomGet(), '', '');
					event.card = card;
					game.broadcast(function (card) {
						ui.arena.classList.add('thrownhighlight');
						card.copy('thrown', 'center', 'thrownhighlight', ui.arena).animate('start');
					}, event.card);
					event.node = event.card.copy('thrown', 'center', 'thrownhighlight', ui.arena).animate('start');
					ui.arena.classList.add('thrownhighlight');
					game.addVideo('thrownhighlight1');
					game.addVideo('centernode', null, get.cardInfo(event.card));
					player.chooseTarget('选择此牌贴上的目标', true).set('ai', function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (att <= 0) return -10;
						if (_status.currentPhase == target) att += 4;
						if (target.countJinengpai() >= 3) att -= 4;
						return att;
					});
					game.delay(2);
					"step 1"
					if (result.targets) {
						player.line(result.targets[0], 'green');
						result.targets[0].$effectn('jinengpai_show', 4);
						result.targets[0].addJudgen(event.card);
						event.node.moveDelete(result.targets[0]);
						game.addVideo('gain2', result.targets[0], [get.cardInfo(event.node)]);
						game.broadcast(function (card, target) {
							ui.arena.classList.remove('thrownhighlight');
							if (card.clone) {
								card.clone.moveDelete(target);
							}
						}, event.card, result.targets[0]);
					}
					game.addVideo('thrownhighlight2');
					ui.arena.classList.remove('thrownhighlight');
				},
			},
			"gezi_jinengpai_zhanshi": {
				direct: true,
				content: function () {
					'step 0'
					var list = ["gezi_shenyou", "gezi_shengdun", "gezi_lianji", "gezi_qianxing", "gezi_lingyong", "gezi_ziheng", "gezi_firebook", "gezi_waterbook", "gezi_woodbook", "gezi_goldbook", "gezi_dirtbook"];
					var cards = [];
					for (var i = 0; i < 3; i++) {
						cards.push(game.createCard(list.randomGet(), '', ''));
					}
					event.cards = cards;
					'step 1'
					player.chooseCardButton(cards, '可以选择一张牌给一名角色贴上', 1).set('ai', function (button) {
						return get.value(button);
					});
					'step 2'
					if (result.links && result.links.length) {
						event.card = result.links[0];
						player.chooseTarget('将' + get.translation(result.links) + '给一名角色贴上').set('ai', function (target) {
							return get.attitude(_status.event.player, target);
						});
					}
					'step 3'
					if (result.targets && result.targets.length) {
						player.line(result.targets[0], 'blue');
						result.targets[0].addJudgen(event.card);
					}
				},
			},
			/*-------------------主角-------------------*/
			//灵梦
			"gezi_yinyang": {
				group: ["gezi_yinyang2", "gezi_bianshenlingmeng"],
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseEnd",
				},
				filter: function (event, player) {
					return player.storage.gezi_yinyang;
				},
				direct: true,
				content: function () {
					'step 0'
					player.storage.gezi_yinyang = false;
					var list = ['摸一张牌'];
					if (trigger.player.countCards('he')) {
						list.push('展示当前回合角色一张牌并置于牌堆顶');
					}
					if ((player.countCards('e', {
						name: 'gezi_yinyangyu'
					}) || player.lili == player.maxlili) && trigger.player.countCards('he')) {
						list.push('选择两项');
					}
					event.list = list;
					player.chooseControlList(list).set('ai', function (event, player) {
						var att = get.attitude(player, trigger.player);
						if (att >= 0) return event.list.indexOf('摸一张牌');
						else if (list.contains('选择两项') && att < 0) return event.list.indexOf('选择两项');
						else if (list.contains('展示当前回合角色一张牌并置于牌堆顶') && att < 0) return event.list.indexOf('展示当前回合角色一张牌并置于牌堆顶');
						else return event.list.indexOf('摸一张牌');
					}).set('prompt', get.prompt('gezi_yinyang'));
					"step 1"
					if (event.list[result.index] == '摸一张牌') {
						player.gainlili();
						player.draw();
						player.logSkill('gezi_yinyang');
					}
					if (event.list[result.index] == '展示当前回合角色一张牌并置于牌堆顶') {
						player.gainlili();
						player.logSkill('gezi_yinyang');
						player.choosePlayerCard(trigger.player, 'he', 1);
					}
					if (event.list[result.index] == '选择两项') {
						player.gainlili();
						player.logSkill('gezi_yinyang');
						player.draw();
						player.choosePlayerCard(trigger.player, 'he', 1);
					}
					'step 2'
					if (result.bool && result.links) {
						game.log(player, '将', trigger.player, '的', result.links[0], '置入牌堆顶');
						trigger.player.showCards(result.links[0]);
						trigger.player.lose(result.links[0]);
						trigger.player.update();
						ui.cardPile.appendChild(result.links[0]);
					}
				},
				ai: {
					threaten: 0.7,
					"maixie_defend": true,
				},
			},
			"gezi_yinyang2": {
				trigger: {
					player: ["damageEnd", "useCard"],
				},
				direct: true,
				popup: false,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.storage.gezi_yinyang = true;
				},
			},
			"gezi_mengdie": {
				skillAnimation: true,
				animationColor: "wood",
				audio: "ext:东方project:1",
				unique: true,
				juexingji: true,
				derivation: "gezi_huanjinglili",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.gezi_mengdie) return false;
					return player.countCards('h') <= (player.maxHp - player.hp);
				},
				content: function () {
					"step 0"
					player.awakenSkill('gezi_mengdie');
					if (player.lili < player.maxlili) {
						player.gainlili(player.maxlili - player.lili);
					}
					"step 1"
					player.storage.gzi_mengdie = true;
					player.update();
					player.addSkill('gezi_huanjinglili');
				},
			},
			"gezi_huanjinglili": {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return player.countCards('he') && !game.dead.contains(event.player);
				},
				check: function (event, player) {
					if (player.countCards('he') < 3) return false;
					var card = ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1];
					if (!card) return false;
					var info = get.info(card);
					if (info.multitarget) return false;
					if (info.notarget) return false;
					if (player.canUse(card, event.player)) return get.effect(event.player, {
						name: card.name
					}, player, player) > 0;
					return false;
				},
				content: function () {
					'step 0'
					player.chooseToDiscard(true, 'he', get.prompt('gezi_huanjinglili')).ai = function () {
						return true;
					}
					'step 1'
					if (result.bool) {
						var current = _status.currentPhase;
						if (current.name == 'gezi_yuyuko' && player.name == 'gezi_yukari') current.say('紫，这次又想搞什么事了？');
						if (current.name == 'gezi_renko' && player.name == 'gezi_yukari') player.say('你这次可是跑到了个不该来的地方呢。');
						if (current.name == 'gezi_meribel' && player.name == 'gezi_yukari') current.say('紫你很烦啊，怎么又来了？');
						if (current.name == 'gezi_reimu' && player.name == 'gezi_yukari') player.say('啊，是你——');
						event.cards = [];
						event.cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1]);
						player.showCards(event.cards[0]);
						var info = get.info(event.cards[0]);
						if (info.multitarget) {
							event.finish();
						}
						if (info.notarget) {
							event.finish();
						}
						if (get.type(event.cards[0]) != 'equip') {
							//if (!player.canUse(event.cards[0],current,false)) return false;
							if (!lib.filter.targetEnabled2(event.cards[0], player, current)) {
								player.discard(event.cards[0]);
							} else {
								player.useCard(event.cards[0], current, false);
							}
						} else if (get.type(event.cards[0]) == 'equip') {
							current.equip(event.cards[0]);
						}
					}
				},
			},
			"gezi_mengxiang": {
				audio: "ext:东方project:3",
				trigger: {
					player: ["phaseBegin"],
				},
				roundi: true,
				cost: 3,
				spell: ["gezi_mengxiang1"],
				priority: 22,
				check: function (event, player) {
					if (player.countCards('h') > 2 || player.lili > 4) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_mengxiang.cost;
				},
				content: function () {
					player.loselili(lib.skill.gezi_mengxiang.cost);
					player.Fuka();
					player.say("<符卡>梦想封印！");
				},
			},
			"gezi_mengxiang1": {
				trigger: {
					player: "useCardToBegin",
				},
				filter: function (event, player) {
					return event.target && event.target != player;
				},
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					if (player.storage._tanpai) {
						list.push('对其造成1点雷电伤害，并令其自弃一张牌');
					} else {
						if (trigger.target.countCards('he')) {
							list.push('并令其自弃一张牌');
						}
						list.push('对其造成1点雷电伤害');
					}
					event.list = list;
					player.chooseControlList(list).set('prompt', get.translation(player) + '对' + get.translation(trigger.target) + '发动了【梦想封印】!').set('ai', function (event, player) {
						var eff = get.damageEffect(trigger.target, player, player, 'thunder');
						var att = get.attitude(player, trigger.target);
						if (eff <= 0 && att >= 0) return list.indexOf('cancel2');
						else if (list.contains('对其造成1点雷电伤害，并令其自弃一张牌') && eff >= 0) return list.indexOf('对其造成1点雷电伤害，并令其自弃一张牌');
						else if (list.contains('对其造成1点雷电伤害') && eff > 0) return list.indexOf('对其造成1点雷电伤害');
						else if (list.contains('并令其自弃一张牌') && att < 0) return list.indexOf('并令其自弃一张牌');
						else return list.indexOf('cancel2');
					});
					'step 1'
					if (event.list[result.index] == '并令其自弃一张牌') {
						player.logSkill('gezi_mengxiang', trigger.target);
						if (trigger.target.countCards('he')) {
							trigger.target.chooseToDiscard(true, 'he');
						}
					}
					if (event.list[result.index] == '对其造成1点雷电伤害') {
						player.logSkill('gezi_mengxiang', trigger.target);
						trigger.target.damage('thunder');
					}
					if (event.list[result.index] == '对其造成1点雷电伤害，并令其自弃一张牌') {
						player.logSkill('gezi_mengxiang', trigger.target);
						trigger.target.damage('thunder');
						if (trigger.target.countCards('he')) {
							trigger.target.chooseToDiscard(true, 'he');
						}
					}
				},
			},
			//魔理沙
			"gezi_liuxing": {
				audio: "ext:东方project:4",
				trigger: {
					player: "phaseDrawBegin",
				},
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i = 0; i < trigger.num; i++) {
						list.push(i + 1);
					}
					player.chooseControl(list, function () {
						if (!player.countCards('h') || !game.hasPlayer(function (current) {
							return get.attitude(player, current) <= 0 && current.countCards('he') && get.distance(player, current, 'attack') <= 2;
						})) {
							return false;
						} else return 0;
					}).set('prompt', '少摸任意张牌，增加等量攻击范围');
					'step 1'
					if (result.control) {
						trigger.num -= result.control;
						player.gainlili(result.control);
						player.storage.gezi_liuxing = result.control;
						player.addTempSkill('gezi_liuxing_shun');
					}
				},
				mod: {
					attackFrom: function (from, to, distance) {
						if (!from.storage.gezi_liuxing) return distance;
						return distance - from.storage.gezi_liuxing;
					},
				},
			},
			"gezi_liuxing_shun": {
				trigger: {
					player: "phaseEnd",
				},
				direct: true,
				content: function () {
					'step 0'
					var n;
					if (!player.storage.gezi_stardust) {
						n = 1;
					} else {
						n = 1 + player.storage.gezi_stardust;
					}
					player.chooseTarget('今天要去偷谁的东西呢？', [1, n], function (card, player, target) {
						return player.canUse('shunshou', target, false);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: 'shunshou'
						}, _status.event.player);
					});
					'step 1'
					if (result.bool && result.targets) {
						player.gainlili();
						player.logSkill("gezi_liuxing", result.targets);
						player.useCard({
							name: 'shunshou'
						}, result.targets, false);
					}
				},
			},
			"gezi_xingchen": {
				audio: "ext:东方project:2",
				group: "gezi_xingchen_2",
				enable: ["chooseToUse", "chooseToRespond"],
				filter: function (event, player) {
					return player.countCards('h') == player.hp;
				},
				position: "h",
				selectCard: 1,
				viewAs: {
					name: "sha",
				},
				filterCard: true,
				prompt: "将一张手牌当【杀】使用或打出",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						return player.countCards('h') == player.hp;
					},
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_xingchen_2": {
				trigger: {
					player: "shaBefore",
				},
				direct: true,
				filter: function (event, player) {
					return event.skill == 'gezi_xingchen';
				},
				content: function () {
					player.getStat().card.sha--;
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha' && player.countCards('h') == player.hp) return Infinity;
					},
				},
			},
			"gezi_stardust": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				spell: ["gezi_stardust1"],
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili;
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i = 1; i < player.lili; i++) {
						list.push(i);
					}
					player.chooseControl(list, function () {
						if (player.countCards('h') > 2 && player.lili - 2 > 2) return player.lili - 2;
						if (player.lili > 3) {
							return player.lili - 3;
						}
						return 0;
					}).set('prompt', '消耗任意点灵力');
					'step 1'
					if (result.control) {
						player.loselili(result.control);
						player.storage.gezi_stardust = result.control;
						player.Fuka();
					}
				},
				check: function (event, player) {
					return player.lili >= 3 && game.countPlayer(function (current) {
						return current != player && current.countCards('h') && get.attitude(player, current) <= 0;
					}) >= 2;
				},
			},
			"gezi_stardust1": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					player: "useCardAfter",
				},
				filter: function (event, player) {
					var info = get.info(event.card);
					if (info.type == 'equip' || info.type == 'delay') return false;
					if (info.multitarget) return false;
					return player.storage.gezi_stardust;
				},
				onremove: function (player) {
					delete player.storage.gezi_stardust;
				},
				content: function () {
					if (trigger.targets && trigger.targets.length > 1) {
						delete player.storage.gezi_stardust;
					}
				},
				mod: {
					targetInRange: function (card, player, target, now) {
						if (player.storage.gezi_stardust && card.type != 'equip' && !get.info(card).multitarget) return true;
					},
					selectTarget: function (card, player, range) {
						if (player.storage.gezi_stardust && card.type != 'equip' && range[1] != -1 && !get.info(card).multitarget) range[1] += player.storage.gezi_stardust;
					},
				},
			},
			/*-------------------红月-------------------*/
			//芙兰
			"gezi_kuangyan": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseUseBegin", "damageEnd"],
				},
				filter: function (event, player) {
					return true;
				},
				init: function (player) {
					player.storage.gezi_kuangyan = true;
				},
				direct: true,
				content: function () {
					"step 0"
					if (player.storage.gezi_kuangyan ||
						(get.mode() == 'guozhan' && player.hiddenSkills.contains('gezi_kuangyan')) || player.countCards('e', {
							name: 'gezi_laevatein'
						})) {
						if (!player.storage.gezi_kuangyan && !player.countCards('e', {
							name: 'gezi_laevatein'
						})) {
							event.skillHidden = true;
						}
						player.chooseBool(get.prompt2('gezi_kuangyan')).set('ai', function (event, player) {
							return game.countPlayer(function (current) {
								if (current != player && get.distance(player, current, 'attack') <= 1) {
									if (get.attitude(player, current) > 0) return -2;
									else return 2;
								}
								return 0;
							}) > 0;
						});
					} else {
						event.forced = true;
					}
					"step 1"
					if (event.forced || result.bool) {
						if (player.storage.gezi_kuangyan = true) {
							player.storage.gezi_kuangyan = false;
						}
						player.gainlili();
						event.goto(3);
					}
					"step 2"
					event.finish();
					"step 3"
					event.players = game.filterPlayer(function (current) {
						return current != player && get.distance(player, current, 'attack') <= 1;
					});
					event.num = 0;
					player.line(event.players, 'red');
					player.logSkill('gezi_kuangyan', event.players);
					"step 4"
					if (event.num < event.players.length) {
						var target = event.players[event.num];
						player.discardPlayerCard(target, 'hej', 1, true);
						if (target.name == 'gezi_remilia') {
							if (player.isTurnedOver()) player.say("姐姐大人不喜欢一起玩吗……？");
							else player.say("这么就碎掉的话，一点也不好玩呢……");
						}
						event.num++;
						event.redo();
					}
					"step 5"
					for (var i = 0; i < event.players.length; i++) {
						if (event.players[i].countCards('h') == 0) event.players[i].damage();
					}
				},
				ai: {
					threaten: 1.2,
					"maixie_defend": true,
					effect: {
						target: function (card, player, target) {
							if (!target.hasFriend()) return false;
							if (player.hasSkillTag('jueqing', false, target)) return;
							var num = game.countPlayer(function (current) {
								if (current != target && get.distance(target, current, 'attack') <= 1) {
									if (get.attitude(player, current) > 0) return -2;
									else return 2;
								}
								return 0;
							});
							if (get.tag(card, 'damage')) {
								if (num >= 2) return [1, -1, 1, 1];
								if (num > 0 && num < 2) return [1, -0.2, 1, 0.2];
								if (num <= 0 && num > -2) return [1, 0.2, 1, -0.2];
								if (num <= -2) return [1, 1, 1, -1];
							}
						},
					},
				},
				group: "gezi_kuangyan_die",
				subSkill: {
					die: {
						trigger: {
							global: "dieAfter",
						},
						forced: true,
						content: function () {
							if (!player.storage.gezi_kuangyan) {
								player.storage.gezi_kuangyan = true;
							}
						},
						sub: true,
					},
				},
			},
			"gezi_jiesha": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_jiesha2"],
				roundi: true,
				priority: 22,
				check: function (event, player) {
					if (player.lili >= player.hp + 1 && !player.hasSkill('gezi_jiesha_4')) return true;
					if (player.lili >= player.hp + 1 && player.countCards('h') > 2) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > player.hp;
				},
				content: function () {
					var n = player.hp;
					player.loselili(n);
					player.Fuka();
					player.addnSkill('gezi_jiesha4');
					player.say("【符卡】之后就一个人都没有了吗！");;
				},
			},
			"gezi_jiesha2": {
				group: ["gezi_jiesha3"],
				audio: "ext:东方project:2",
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.player && event.player.isAlive();
				},
				content: function () {
					'step 0'
					if (!trigger.player.hasSkill('fengyin')) {
						trigger.player.addTempSkill('fengyin');
						event.finish();
					}
					'step 1'
					var list = ['扣上限'];
					if (trigger.player.countCards('hej')) list.push('弃牌');
					if (trigger.player.node.lili) list.push('调整灵力');
					player.chooseControl(list, function () {
						var att = get.attitude(player, trigger.player);
						if (att > 0) {
							var js = trigger.player.getCards('j');
							if (js.length) {
								var jj = js[0].viewAs ? {
									name: js[0].viewAs
								} : js[0];
								if (get.effect(trigger.player, jj, trigger.player, player) < 0) {
									return '弃牌';
								}
							} else if (trigger.player.lili <= 1)
								return '调整灵力';
							else if (trigger.player.getCards('h') < 5 || trigger.player.getCards('e') < 3)
								return '弃牌';
							else return '扣上限';
						}
						if (att <= 0) {
							var nhe = trigger.player.countCards('he');
							if (nhe >= 3) return '弃牌';
							else if (trigger.player.lili > 2) return '调整灵力';
							else return '扣上限';
						}
					}).set('prompt', '想要和' + get.translation(trigger.player) + '怎么玩呢？');
					'step 2'
					if (result.control) {
						if (result.control == '弃牌') {
							event.goto(4);
						} else if (result.control == '调整灵力') {
							if (trigger.player.lili) {
								trigger.player.loselili(trigger.player.lili - 1);
							}
						} else if (result.control == '扣上限') {
							trigger.player.loseMaxHp();
							if (trigger.player.storage.gezi_jiesha2)
								trigger.player.storage.gezi_jiesha2 += 1;
							else
								trigger.player.storage.gezi_jiesha2 = 1;
						}
						trigger.player.update();
					}
					'step 3'
					event.finish();
					'step 4'
					var list = [];
					if (trigger.player.countCards('h')) list.push('手牌区');
					if (trigger.player.countCards('e')) list.push('装备区');
					if (trigger.player.countCards('j')) list.push('判定区');
					player.chooseControl(list, true, function () {
						var nj = trigger.player.countCards('j');
						var nh = trigger.player.countCards('h');
						var ne = trigger.player.countCards('e');
						if (get.attitude(player, trigger.player) > 0) {
							if (nj > 0) return '判定区';
							if (nh > ne + 1) return '装备区';
							return '手牌区';
						} else if (nh > ne + 1) return '手牌区';
						return '装备区';
					}).set('prompt', '想要撕掉' + get.translation(trigger.player) + '哪里的所有牌呢？');
					'step 5'
					if (result.control) {
						var cards;
						if (result.control == '手牌区') cards = trigger.player.getCards('h');
						if (result.control == '装备区') cards = trigger.player.getCards('e');
						if (result.control == '判定区') cards = trigger.player.getCards('j');
						trigger.player.discard(cards);
					}
				},
				ai: {
					expose: 0.3,
					jueqing: true,
					threaten: 1.5,
				},
			},
			"gezi_jiesha3": {
				direct: true,
				trigger: {
					player: "die",
				},
				forceDie: true,
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_jiesha2) players[i].gainMaxHp(players[i].storage.gezi_jiesha2);
					}
				},
			},
			"gezi_jiesha4": {
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - 2;
					},
				},
			},
			//小恶魔
			"gezi_qishu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				usable: 1,
				filter: function (event, player) {
					return true;
				},
				direct: true,
				content: function () {
					"step 0"
					var list = ['phaseDraw', 'phaseUse', 'phaseDiscard', 'cancel2'];
					for (var i in list) {
						if (player.skipList.contains(i)) list.remove(i);
					}
					player.chooseControl(list, function (event, player) {
						if (!player.hasFriend()) return 'phaseDiscard';
						if (player.countCards('h') > player.hp) return 'phaseDraw';
						if (!player.countCards('h', function (card) {
							return get.tag(card, 'damage');
						}) && player.countCards('h') + 2 <= player.hp) return 'phaseUse';
						return 'phaseDiscard';
					});
					"step 1"
					if (result.control) {
						if (result.control != 'cancel2') {
							player.storage.gezi_qishu = result.control;
							player.chooseTarget(1, "选择一名其他角色，令其获得1点灵力并执行一个额外的" + get.translation(result.control), function (card, player, target) {
								return target != player;
							}).set('ai', function (target) {
								if (player.storage.gezi_qishu == 'phaseDiscard') {
									var num = target.needsToDiscard();
									if (num == 0) {
										num = 0.5;
									}
									var att = get.attitude(player, target);
									if (att <= 0) return num;
									if (att > 0) return 0;
								} else {
									return get.attitude(player, target) > 0;
								}
							});
						}
					}
					"step 2"
					if (result.bool && result.targets) {
						player.logSkill('gezi_qishu', result.targets);
						player.line(result.targets, 'red');
						player.gainlili();
						result.targets[0].addnSkill('gezi_qishu2');
						result.targets[0].storage.gezi_qishu = player.storage.gezi_qishu;
						if (result.targets[0].name == 'gezi_patchouli')
							player.say("帕秋莉大人！您要的红茶！")
						player.skip(player.storage.gezi_qishu);
						delete player.storage.gezi_qishu;
					} else {
						event.finish();
					}
				},
			},
			"gezi_qishu2": {
				trigger: {
					global: "phaseAfter",
				},
				direct: true,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.gainlili();
					if (player.storage.gezi_qishu == "phaseDraw") {
						player.phaseDraw();
					} else if (player.storage.gezi_qishu == "phaseUse") {
						player.phaseUse();
					} else if (player.storage.gezi_qishu == "phaseDiscard") {
						player.phaseDiscard();
					}
					player.storage.gezi_qishu = null;
					player.removeSkill('gezi_qishu2');
				},
			},
			"gezi_anye": {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToBegin",
				},
				forced: true,
				priority: 15,
				filter: function (event, player) {
					if (!event.target) return false;
					if (event.card.name == 'wuxie') return false;
					if (event.player == player && event.target == player) return false;
					if (!player.storage._gezi_mubiao) return false;
					if (player == _status.currentPhase) return false;
					return (get.type(event.card) == 'trick');
				},
				content: function () {
					trigger.untrigger();
					trigger.finish();
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name == 'wuxie') return;
							if (target == player) return;
							if (get.type(card) == 'trick' && target.storage._gezi_mubiao) return 'zerotarget';
						},
					},
				},
			},
			//美铃
			"gezi_xingmai": {
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				hiddenCard: function (player, name) {
					return name == 'shan';
				},
				filter: function (event, player) {
					return (player.num('h', {
						name: 'sha'
					}) > 0);
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'basic') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player) && player.getCardUsable(button.link[2]);
					},
					check: function (button) {
						var player = _status.event.player;
						var card = {
							name: button.link[2]
						};
						if (game.hasPlayer(function (current) {
							return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
						})) {
							switch (button.link[2]) {
								case 'ziyangdan':
									return 5;
								case 'dinvxuanshuang':
									return 2.9;
							}
						}
						return 0;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return (card.name == 'sha');
							},
							position: 'he',
							selectCard: 1,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
							onuse: function (result, player) {
								player.logSkill('gezi_xingmai', player);
								player.removeSkill('gezi_xingmai');
								player.addnSkill('gezi_xingmai2');
							},
							onrespond: function (result, player) {
								player.logSkill('gezi_xingmai', player);
								player.removeSkill('gezi_xingmai');
								player.addnSkill('gezi_xingmai2');
							},
						}
					},
					prompt: function (links, player) {
						return '将一张【杀】当作' + get.translation(links[0][2]) + '使用/打出';
					},
				},
				ai: {
					order: 7.5,
					result: {
						target: 1.5,
						player: 2,
					},
					skillTagFilter: function (player) {
						return player.countCards('h', {
							name: 'sha'
						}) > 0;
					},
					save: true,
				},
			},
			"gezi_xingmai2": {
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: function (card, player) {
					return get.type(card) == 'basic';
				},
				selectCard: 1,
				position: "he",
				viewAs: {
					name: "sha",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('he', {
						type: 'basic'
					})) return false;
				},
				prompt: "将一张基本牌当【杀】使用或打出",
				check: function (card) {
					return 8 - get.value(card)
				},
				onuse: function (result, player) {
					player.removeSkill('gezi_xingmai2');
					player.addnSkill('gezi_xingmai');
				},
				onrespond: function (result, player) {
					player.removeSkill('gezi_xingmai');
					player.addnSkill('gezi_xingmai2');
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.countCards('he', {
							type: 'basic'
						})) return false;
					},
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						player: function (player) {
							return 1;
						},
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_dizhuan": {
				audio: "ext:东方project:2",
				trigger: {
					global: "shaBefore",
				},
				group: "gezi_dizhuan2",
				direct: true,
				filter: function (event, player) {
					if (player.countCards('hej') == 0) return false;
					if (player == event.target) return false;
					if (event.targets.contains(player)) return false;
					return get.distance(player, event.target, 'attack') <= 1 && lib.filter.targetEnabled(event.card, event.player, player);
				},
				content: function () {
					"step 0"
					var next = player.choosePlayerCard(player, 'hej', '你发动【地转】，把' + get.translation(trigger.card) + '的目标从' + get.translation(trigger.target) + '转移给你。');
					next.set('ai', function (button) {
						var save = false;
						var eff1 = get.effect(trigger.target, trigger.card, trigger.player, player);
						var eff2 = get.effect(player, trigger.card, trigger.player, player);
						if (eff1 > 0) {
							return -1;
						} else if (eff1 < eff2) {
							save = true;
						} else {
							return -1;
						}
						if (player.hujia + player.hp < trigger.target.hujia + trigger.target.hp)
							return -1;
						if (!player.hujia && player.countCards('h', {
							name: 'shan'
						}) && player.hp < 3)
							return -1;
						if (save = true) {
							if (player.hujia && player.hp > 1) {
								return 9 - get.value(button.link);
							} else if (player.countCards('h', {
								name: 'shan'
							}) && player.hp >= 3)
								return 8 - get.value(button.link);
							else if (player.countCards('h', {
								name: 'shan'
							}) && player.hp >= 1)
								return 7 - get.value(button.link);
							return 5 - get.value(button.link);
						}
						return 0;
					});
					next.logSkill = 'gezi_dizhuan';
					"step 1"
					if (result.cards) {
						player.logSkill("gezi_dizhuan", trigger.target);
						if (trigger.target.name == 'gezi_sakuya')
							player.say("别想动咲夜一下！");
						if (trigger.target.name == 'gezi_flandre')
							player.say("妹妹大人，请让一下！");
						trigger.target.gain(result.cards, player);
						player.$give(result.cards, trigger.target);
						trigger.targets.remove(trigger.target);
						trigger.target = player;
					} else {
						event.finish();
					}
					"step 2"
					game.log(trigger.card, '转移给了', player);
					trigger.untrigger();
					trigger.trigger('useCardToBefore');
					trigger.trigger('shaBefore');
					game.delay();
				},
			},
			"gezi_dizhuan2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "damageEnd",
				},
				forced: true,
				filter: function (event, player) {
					return player.node.lili && (event.card && event.card.name == 'sha');
				},
				content: function () {
					player.gainlili();
				},
				ai: {
					"maixie_defend": true,
				},
			},
			"gezi_jicai": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				spell: ["gezi_jicai2"],
				roundi: true,
				check: function (event, player) {
					if (player.countCards('h') > 3 && player.lili >= 3) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("<符卡>极彩风暴！");
				},
			},
			"gezi_jicai2": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["useCard", "respond"],
				},
				filter: function (event) {
					return game.countPlayer(function (current) {
						if (current.countCards('he')) return true;
					});
				},
				prompt: "你使用/打出牌时，可以弃置一名角色一张牌；若该牌颜色与使用/打出的牌颜色相同，其摸一张牌。",
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget(1, '弃置一名角色一张牌；若该牌颜色与使用/打出的牌颜色相同，其摸一张牌。', function (card, player, target) {
						return target.countCards('he');
					}).set('ai', function (target) {
						return -get.attitude(_status.event.player, target);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_jicai', result.targets);
						player.line(result.targets, 'green');
						event.targets = result.targets;
						player.discardPlayerCard(event.targets[0], 'he', 1).set('ai', function (button) {
							if (!_status.event.att) return 0;
							if (get.position(button.link) == 'e' && get.color(button) && get.color(trigger.card)) return get.color(button.link) == get.color(trigger.card);
							return get.value(button.link);
						}).set('att', get.attitude(player, event.targets[0]) <= 0);
					}
					"step 2"
					if (result.bool && result.links && result.links.length) {
						if (get.color(result.links[0]) && get.color(trigger.card)) {
							if (get.color(result.links[0]) == get.color(trigger.card)) event.targets[0].draw();
						}
					}
				},
			},
			//帕秋莉
			"gezi_qiyao": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				content: function () {
					'step 0'
					var list = ['phaseDraw', 'phaseUse', 'phaseDiscard'];
					if (!player.lili) list.remove('phaseDiscard');
					for (var i = 0; i < list.length; i++) {
						if (player.skipList.contains(list[i])) {
							list.remove(list[i]);
							i--;
						} else list[i] = get.translation(list[i] + '_gezi_qiyao');
					}
					if (!list.length) event.finish();
					event.list = list;
					player.chooseControlList(event.list, function (event, player) {
						if (event.list[0] == '跳过摸牌阶段，视为使用一张非延时锦囊牌') return 0;
						if (event.list[0] == '跳过出牌阶段，将一张牌当作一张非延时锦囊牌使用') {
							if (player.skipList.contains('phaseDiscard')) return 0;
							if (player.lili > 1 && player.countCards('h', {
								name: 'sha'
							}) < 2) return 1;
							else return 'cancel2';
						}
						return event.list.length - 1;

					});
					'step 1'
					if (result.control) {
						if (event.list[result.index] == '跳过摸牌阶段，视为使用一张非延时锦囊牌') {
							player.skip('phaseDraw');
							player.say("就稍微用点手段吧。");
							player.useSkill('gezi_qiyao2');
						} else if (event.list[result.index] == '跳过出牌阶段，将一张牌当作一张非延时锦囊牌使用') {
							player.skip('phaseUse');
							player.say("我记得明明有更多法术牌的啊……？");
							player.addTempSkill('gezi_qiyao3');
							player.chooseToUse(function (card) {
								if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
									return false;
								}
								var type = get.type(card, 'trick');
								return type == 'trick';
							}, '是否使用一张锦囊牌？').set('logSkill', 'gezi_qiyao');
						} else if (event.list[result.index] == '跳过弃牌阶段并消耗1点灵力，获得一张【贤者之石】') {
							player.skip('phaseDiscard');
							player.loselili();
							player.say("……（哈欠）");
							player.gain(game.createCard("gezi_stone"), 'gain2');
						} else {
							event.finish();
						}
					}
					'step 2'
					event.goto(0);
				},
			},
			"gezi_qiyao2": {
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
						if (lib.card[i].type == 'trick') {
							list.add(i);
						}
					}
					for (var i = 0; i < list.length; i++) {
						list[i] = ['法术', '', list[i]];
					}
					if (list.length) {
						player.chooseButton(['视为使用一张法术牌', [list, 'vcard']]).set('ai', function (button) {
							return (button.link[2] == 'gezi_xuyuanshu') ? 1 : -1;
						});
					}
					'step 1'
					if (result && result.bool && result.links[0]) {
						var card = {
							name: result.links[0][2]
						};
						event.fakecard = card;
						var select = get.info(card).selectTarget;
						if (select == undefined) {
							if (get.info(card).filterTarget == undefined) return [0, 0];
							range = [1, 1];
						} else if (typeof select == 'number') range = [select, select];
						else if (get.itemtype(select) == 'select') range = select;
						else if (typeof select == 'function') range = select(card, player);
						game.checkMod(card, player, range, 'selectTarget', player);
						if (get.info(card).multitarget && range == [-1, -1]) range = [game.filterPlayer().length, game.filterPlayer().length];
						if (range == [-1, -1]) range = [1, 1];
						player.chooseTarget(range, function (card, player, target) {
							return player.canUse(event.fakecard, target, true);
						}, true, '选择' + get.translation(card.name) + '的目标<br><br><div><div style="width:100%;text-align:center;font-size:14px">显示为-1的话，点一下框以外就会自动用了</div>').set('ai', function (target) {
							return get.effect(target, event.fakecard, _status.event.player);
						});
					} else {
						event.finish();
					}
					'step 2'
					if (result.bool && result.targets && result.targets.length) {
						player.useCard(event.fakecard, result.targets);
					}
				},
				ai: {
					order: 6,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"gezi_qiyao3": {
				enable: "chooseToUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				chooseButton: {
					dialog: function () {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'trick') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = ['法术', '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return lib.filter.filterCard({
							name: button.link[2]
						}, player, _status.event.getParent());
					},
					check: function (button) {
						return (button.link[2] == 'gezi_xuyuanshu') ? 1 : -1;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return true;
							},
							position: 'he',
							selectCard: 1,
							audio: 2,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function (links, player) {
						return '将一张牌当作' + get.translation(links[0][2]) + '使用';
					},
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							return 2;
						},
					},
					threaten: 1,
				},
			},
			"gezi_riyin": {
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				filter: function (event, player) {
					return true;
				},
				filterCard: function (card) {
					return true;
				},
				viewAsFilter: function (player) {
					return player.countCards('he') > 0;
				},
				position: "he",
				precontent: function () {
					player.gainlili();
				},
				viewAs: {
					name: "wuxie",
				},
				prompt: "将一张牌当【无懈可击】使用",
				selectCard: 1,
				check: function (card) {
					return 8 - get.value(card)
				},
				threaten: 1.2,
				ai: {
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						player: 1,
					},
					expose: 0.2,
				},
			},
			"gezi_riyin2": {
				trigger: {
					global: "useCardToBefore",
				},
				forced: true,
				popup: false,
				priority: 15,
				filter: function (event, player) {
					if (event.parent.name == 'gezi_riyin') return false;
					if (!event.targets) return false;
					if (get.type(event.card) != 'trick') return false;
					for (var i = 0; i < event.targets.length; i++) {
						if (!event.targets[i].storage._gezi_mubiao) return false;
					}
					return true;
				},
				content: function () {
					player.addTempSkill('gezi_riyin');
				},
			},
			"gezi_xianzhe": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_xianzhe2"],
				priority: 22,
				check: function (event, player) {
					if (player.countCards('h') >= 1 && player.lili >= 4) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("<符卡>贤者之石！");
				},
			},
			"gezi_xianzhe2": {
				trigger: {
					player: "useCardEnd",
				},
				forced: true,
				filter: function (event, player) {
					if (event.card.name == 'wuxie') return false;
					if (event.parent.name == 'gezi_xianzhe2') return false;
					if (!event.targets) return false;
					var type = get.type(event.card);
					if (type != 'trick') return false;
					var card = game.createCard(event.card.name, event.card.suit, event.card.number);
					for (var i = 0; i < event.targets.length; i++) {
						if (!event.targets[i].storage._gezi_mubiao) return false;
						if (!player.canUse({
							name: event.card.name
						}, event.targets[i], false, false)) {
							return false;
						}
					}
					return true;
				},
				content: function () {
					var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number);
					card.destroyed = true;
					player.useCard(card, trigger.targets);
				},
				ai: {
					threaten: 1.5,
				},
			},
			//蕾米
			"gezi_miingyunleimi": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseUseBegin", "damageEnd"],
				},
				filter: function (event, player) {
					return player.getAttackRange() > 0;
				},
				content: function () {
					"step 0"
					player.gainlili();
					var num = player.getAttackRange();
					if (num > 10) {
						num = 10;
					}
					player.draw(num);
					if (player.countCards('h', 'sha') >= 3)
						player.say('你的命运可是掌握在我的手心中哦。')
					if (num != 0) {
						player.chooseCard(num, 'he', true, '按顺序将卡牌置于牌堆顶（先选择的在上）').set('ai', function (card) {
							return 10 - get.value(card);
						});
					}
					'step 1'
					if (result.bool) {
						player.lose(result.cards);
						for (var i = 0; i < result.cards.length; i++) {
							if (result.cards[i].name == 'gezi_gungnir') {
								result.cards.remove(result.cards[i]);
							}
						}
						if (result.cards.length == 0) event.finish();
						event.cards = result.cards;
					}
					"step 2"
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].name == 'gezi_gungnir') player.lose(event.cards[i]);
							event.cards[i].fix();
						}
					}
					"step 3"
					if (event.cards) {
						var list = event.cards;
						game.log(player, '将' + list.length + '张牌置于牌堆顶');
						for (var i = list.length - 1; i >= 0; i--) {
							ui.cardPile.insertBefore(list[i], ui.cardPile.firstChild);
						}
						player.update();
					}
					"step 4"
					player.addTempSkill('gezi_mingyunleimi2');
				},
				check: function (event, player) {
					if (get.attitude(player, _status.currentPhase) > 0 && _status.currentPhase != player) return 0;
					if (_status.currentPhase == player && !player.hasSkill("gezi_gungirs")) return 0;
					return player.getAttackRange() > 0;
				},
				ai: {
					"maixie_defend": true,
					effect: {
						target: function (card, player, target) {
							if (!player.hasFriend() && (player.isHealthy() || !player.countCards('h', 'tao'))) return;
							if (!player.needsToDiscard()) return;
							var num = player.needsToDiscard();
							if (get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
								if (get.attitude(target, player) < 0) return [1, 0, 1, -num];
							}
						},
					},
				},
				"prompt2": "出牌阶段开始时，或你受到伤害后，你可以：获得一点灵力同时摸X张牌，并将等量牌置于牌堆顶（X为你的攻击范围），然后，直到结束阶段：一名角色使用非装备牌指定目标时，若该牌不是以此技能使用，其取消目标并判定：若判定牌可以对目标使用（无视距离），其将判定牌对目标使用。（若你装备冈格尼尔，则无视后续效果）",
			},
			"gezi_mingyunleimi2": {
				trigger: {
					global: "useCardToBegin",
				},
				direct: true,
				filter: function (event, player) {
					if (get.type(event.card) == 'equip') return false;
					return event.getParent(2).name != 'gezi_mingyunleimi2';
				},
				content: function () {
					"step 0"
					if (trigger.player == player && player.countCards('e', {
						name: 'gezi_gungnir'
					}) > 0) {
						event.finish();
					}
					"step 1"
					trigger.cancel();
					if (trigger.target) {
						game.log('【命运】：', trigger.player, '对', trigger.target, '使用的', trigger.card, '取消目标');
					} else {
						game.log('【命运】：', trigger.player, '使用的', trigger.card, '取消目标');
					}
					trigger.player.judge();
					"step 2"
					var info = get.info(result.card);
					if (info.multitarget || info.notarget) {
						event.finish();
					} else if (trigger.target && lib.filter.targetEnabled2(result.card, trigger.player, trigger.target)) {
						trigger.player.useCard(result.card, trigger.target);
					}
				},
				ai: {
					effect: {
						player: function (card, player, target, current) {
							if (player.countCards('e', {
								name: 'gezi_gungnir'
							}) > 0) return;
							var card1 = ui.cardPile.childNodes[0];
							if (get.type(card1) != 'equip') return [1, -2];
							if (player == _status.currentPhase) {
								if (!player.needsToDiscard() && get.type(card1) != 'equip')
									return [1, -5];
							}
						},
						target: function (card, player, target, current) {
							if (player.hasSkill('gezi_mingyunleimi2') && _status.currentPhase == player && player.countCards('e', {
								name: 'gezi_gungnir'
							}) > 0) return;
							var card1 = ui.cardPile.childNodes[0];
							if (get.type(card1) != 'equip') return [1, -2];
							if (player == _status.currentPhase) {
								if (!player.needsToDiscard() && get.type(card1) != 'equip')
									return [1, -5];
							}
						},
					},
				},
			},
			"gezi_hongmo": {
				skillAnimation: true,
				animationColor: "red",
				audio: "ext:东方project:2",
				unique: true,
				juexingji: true,
				derivation: "gezi_gungirs",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				filter: function (event, player) {
					if (player.storage.gezi_hongmo) return false;
					if (player.hp > 1) return false;
					return player.isEmpty(1);
				},
				content: function () {
					player.storage.gezi_hongmo = true;
					player.loseMaxHp();
					player.addSkill('gezi_gungirs');
					player.awakenSkill('gezi_hongmo');
				},
			},
			"gezi_gungirs": {
				init: function (player) {
					player.equip(game.createCard('gezi_gungnir')).type = 'gezi_gungnir';
				},
				trigger: {
					player: "loseAfter",
				},
				group: "gezi_gungirs2",
				direct: true,
				filter: function (event, player) {
					return !player.countCards('e', {
						name: 'gezi_gungnir'
					}) > 0 && event.name !== "equip";
				},
				content: function () {
					player.logSkill('gezi_gungirs', player);
					game.trySkillAudio('gezi_feise2', player, true);
					player.equip(game.createCard('gezi_gungnir')).type = 'gezi_gungnir';
				},
			},
			"gezi_gungirs2": {
				trigger: {
					player: "equipBefore",
				},
				intro: {
					content: "cards",
				},
				forced: true,
				filter: function (event, player) {
					if (get.subtype(event.card) != 'equip1') return false;
					return event.type != 'gezi_gungnir';
				},
				content: function () {
					'step 0'
					trigger.cancel();
					'step 1'
					var info = get.info(trigger.card);
					if (info.skills) {
						for (var i = 0; i < info.skills.length; i++) {
							player.addSkill(info.skills[i]);
						}
					}
					'step 2'
					if (!player.storage.gezi_gungirs2) player.storage.gezi_gungirs2 = [];
					player.storage.gezi_gungirs2 = player.storage.gezi_gungirs2.concat(game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number));
					player.markSkill('gezi_gungirs2');
				},
			},
			"gezi_feise": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_feise2"],
				roundi: true,
				priority: 22,
				check: function (event, player) {
					if (player.lili > 2) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("【符卡】绯色幻想乡！");
				},
			},
			"gezi_feise2": {
				audio: "ext:东方project:4",
				global: "gezi_feise3",
				globalSilent: true,
				trigger: {
					global: "phaseEnd",
				},
				direct: true,
				filter: function (event, player) {
					return event.player.isAlive() && event.player != player && event.player.hasSkill('gezi_feise4');
				},
				prompt: "其他角色的结束阶段，若其对其以外的角色使用过牌，你可以对其造成1点伤害。",
				content: function () {
					"step 0"
					var nono = (Math.abs(get.attitude(player, trigger.player)) < 3);
					if (get.damageEffect(trigger.player, player, player) <= 0) {
						nono = true;
					}
					player.chooseBool('是否对' + get.translation(trigger.player) + '造成一点伤害', get.prompt('gezi_feise2', trigger.player)).set('ai', function () {
						if (_status.event.nono) return 0;
						return 1;
					}).set('nono', nono);
					"step 1"
					if (result.bool) {
						player.logSkill("gezi_feise2", trigger.player);
						trigger.player.damage();
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.3,
				},
			},
			"gezi_feise3": {
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return _status.currentPhase == player && event.targets && (event.targets.length > 1 || event.targets[0] != player);
				},
				forced: true,
				popup: false,
				silent: true,
				content: function () {
					player.addTempSkill('gezi_feise4');
				},
			},
			"gezi_feise4": {
			},
			//露米娅
			"gezi_heiguan": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				content: function () {
					"step 0"
					player.chooseTarget('是谁看起来更好咬一些呢……（选择相邻的角色，和她们依次拼点：若你赢，视为你对其出一张【杀】；若你没赢，你须消耗1点灵力，或取消其他目标并结束出牌阶段。）', [1, Infinity], function (card, player, target) {
						var range = false;
						for (var i = 0; i < ui.selected.targets.length; i++) {
							if (get.distance(ui.selected.targets[i], target) <= 1) range = true;
						}
						if (ui.selected.targets.length == 0) range = true;
						return range && target.countCards('h') > 0 && player != target && player.canCompare(target);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: "sha"
						}, trigger.player, trigger.player)
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_heiguan', result.targets);
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2"
					if (event.targets.length) {
						var target = event.targets.shift();
						event.current = target;
						player.chooseToCompare(target).set('small', true);
					} else {
						event.finish();
					}
					"step 3"
					if (result.bool) {
						player.gainlili();
						if (player.canUse({
							name: 'sha'
						}, event.current, false, true)) {
							player.useCard({
								name: 'sha'
							}, event.current, false);
						}
						event.goto(2);
					} else {
						var choice = ['end_phase'];
						if (player.lili) {
							choice.push('lose_lili');
						}
						player.chooseControl(choice).set('ai', function () {
							if (player.lili && player.countCards('h') > player.hp) return 'lose_lili';
							if (player.lili && player.lili > 3) return 'lose_lili';
							return 'end_phase';
						});
					}
					"step 4"
					if (result.control == "lose_lili") {
						player.loselili();
						event.goto(2);
					} else {
						game.log(player, '跳过了出牌和弃牌阶段');
						trigger.finish();
						trigger.untrigger();
						player.draw(event.targets.length);
						player.skip('phaseDiscard');
						event.finish();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			"gezi_yuezhi": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				spell: ["gezi_yuezhi2"],
				roundi: true,
				check: function (event, player) {
					if (player.hasUnknown()) return 0;
					return player.lili >= 2 && game.countPlayer(function (current) {
						if (current != player && get.distance(player, current, 'attack') <= 1) {
							if (get.attitude(player, current) > 0) return -2;
							else return 2;
						}
						return 0;
					}) > 0;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("【符卡】月之阴暗面！");
				},
			},
			"gezi_yuezhi2": {
				global: "gezi_yuezhi3",
				unique: true,
			},
			"gezi_yuezhi3": {
				mod: {
					attackFrom: function (from, to, distance) {
						// 数场上符合条件的角色，不错
						return distance + 10 * game.countPlayer(function (current) {
							if (current == from) return false;
							if (!current.hasSkill('gezi_yuezhi2')) return false;
							if (get.distance(current, from, 'attack') <= 1) return true;
						});
					},
				},
			},
			//咲夜
			"gezi_huanzang": {
				audio: "ext:东方project:4",
				group: ["gezi_huanzang_1"],
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					if (!get.suit(event.card) && !get.number(event.card)) return false;
					if (event.targets && event.targets.length > 1) return false;
					if (event.player == player) return false;
					return player.countCards('he', function (card) {
						return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card);
					});
				},
				direct: true,
				content: function () {
					'step 0'
					var nono = false;
					var eff1 = get.effect(player, trigger.card, trigger.player, _status.event.player);
					var eff2 = get.effect(player, trigger.card, trigger.player, trigger.player);
					var att = get.attitude(player, trigger.player);
					if (eff1 < 0) {
						if (att > 0 && eff2 > 0) {
							nono = false;
						} else {
							nono = true;
						}
					}
					player.chooseCard('he', '你可以用一把与' + get.translation(trigger.card) + '相同花色/点数的飞刀把它砍断', function (card) {
						return (get.suit(card) == get.suit(trigger.card) || get.number(card) == get.number(trigger.card));
					}).set('ai', function (card) {
						if (_status.event.nono == true) {
							return 7 - get.value(card);
						}
						return 0;
					}).set('nono', nono);
					'step 1'
					if (result.cards) {
						player.lose(result.cards[0]);
						player.$throw(result.cards[0], 1000);
						player.logSkill('gezi_huanzang', trigger.player);
						player.say('呵，多谢款待了!');
						trigger.cancel();
						player.gainlili();
					}
				},
			},
			"gezi_huanzang_1": {
				trigger: {
					global: ["useCardToBefore"],
				},
				direct: true,
				filter: function (event, player) {
					if (!event.card) return false;
					if (_status.currentPhase != player) return false;
					if (event.card.name == 'shan') return false;
					if (event.player == player) return false;
					if (event.targets && event.targets.length > 1) return false;
					return player.countCards('he', function (card) {
						return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card);
					});
				},
				content: function () {
					'step 0'
					var nono = false;
					var eff1 = get.effect(player, trigger.card, trigger.player, _status.event.player);
					var eff2 = get.effect(player, trigger.card, trigger.player, trigger.player);
					var att = get.attitude(player, trigger.player);
					if (eff1 < 0) {
						if (att > 0 && eff2 > 0) {
							nono = false;
						} else {
							nono = true;
						}
					}
					player.chooseCard('he', '你可以用一把与' + get.translation(trigger.card) + '相同花色/点数的飞刀把它砍断', function (card) {
						return (get.suit(card) == get.suit(trigger.card) || get.number(card) == get.number(trigger.card));
					}, true).set('ai', function (card) {
						if (_status.event.nono == true) {
							return 7 - get.value(card);
						}
						return 0;
					}).set('nono', nono);
					'step 1'
					if (result.cards) {
						player.lose(result.cards[0]);
						player.$throw(result.cards[0], 1000);
						player.logSkill('gezi_huanzang', trigger.player);
						player.say('啊？这玩笑可不好笑啊。');
						trigger.cancel();
						player.gainlili();
					}
				},
			},
			"gezi_shijing": {
				audio: "ext:东方project:2",
				group: ["gezi_shijing_mark", "gezi_shijing_mark2", "gezi_shijing_mark3", "gezi_shijing_mark3", "gezi_shijing_mark4"],
				trigger: {
					player: "phaseEnd",
				},
				intro: {
					content: "cards",
				},
				prompt: "是否把今天用出去的飞刀捡起来？(获得本回合进入弃牌堆的牌)",
				filter: function (event, player) {
					if (!player.storage.gezi_shijing) return false;
					if (player.storage.gezi_shijing.length == 0) return false;
					var cards = [];
					for (var i = 0; i < player.storage.gezi_shijing.length; i++) {
						if (get.position(player.storage.gezi_shijing[i], true) == 'd') {
							cards.push(player.storage.gezi_shijing[i]);
						}
					}
					if (!cards.length) return false;
					if (player.countCards('e', {
						name: 'gezi_lunadial'
					})) return player.countCards('h') < 4;
					else return player.countCards('h') < 3;
				},
				frequent: true,
				content: function () {
					'step 0'
					event.num = 3 - player.countCards('h');
					if (player.countCards('e', {
						name: 'gezi_lunadial'
					})) event.num++;
					if (event.num < 0) event.finish();
					player.chooseCardButton(player.storage.gezi_shijing, '捡回' + event.num + '张牌', [1, event.num], true).ai = function (button) {
						return get.value(button.link);
					}
					'step 1'
					player.gain(result.links, 'gain2')._triggered = null;
					for (var i = 0; i < result.links.length; i++) {
						ui.discardPile.remove(result.links[i]);
					}
				},
			},
			"gezi_shijing_mark": {
				trigger: {
					global: "loseEnd",
				},
				direct: true,
				popup: false,
				priority: -10,
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					if (!event.cards) return false;
					if (get.itemtype(event.cards) != 'cards') return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != 'equip' && get.type(event.cards[i]) != 'delay' && get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (!player.storage.gezi_shijing) player.storage.gezi_shijing = [trigger.cards[i]];
						else player.storage.gezi_shijing.push(trigger.cards[i]);
					}
					player.markSkill('gezi_shijing');
					player.syncStorage('gezi_shijing');
				},
			},
			"gezi_shijing_mark2": {
				trigger: {
					player: "phaseAfter",
				},
				direct: true,
				popup: false,
				priority: -100,
				filter: function (event, player) {
					return _status.currentPhase == player && player.storage.gezi_shijing;
				},
				content: function () {
					player.storage.gezi_shijing = [];
					player.syncStorage('gezi_shijing');
					player.unmarkSkill('gezi_shijing');
				},
			},
			"gezi_shijing_mark3": {
				trigger: {
					global: ["loseEnd", "discardAfter"],
				},
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					if (!event.cards) return false;
					if (event.name == 'lose' && event.parent.name != 'equip') return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == 'equip' && get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
				},
				popup: false,
				direct: true,
				priority: -10,
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					"step 1"
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) == 'equip' && get.position(trigger.cards[i]) == 'd') {
							if (!player.storage.gezi_shijing) player.storage.gezi_shijing = [trigger.cards[i]];
							else player.storage.gezi_shijing.push(trigger.cards[i]);
						}
					}
					player.markSkill('gezi_shijing');
					player.syncStorage('gezi_shijing');
				},
			},
			"gezi_shijing_mark4": {
				trigger: {
					global: ["loseEnd", "discardAfter"],
				},
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					if (!event.cards) return false;
					if (event.name == 'lose' && event.parent.name != 'delay') return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == 'delay' && get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
				},
				popup: false,
				direct: true,
				priority: -10,
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					"step 1"
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) == 'delay' && get.position(trigger.cards[i]) == 'd') {
							if (!player.storage.gezi_shijing) player.storage.gezi_shijing = [trigger.cards[i]];
							else player.storage.gezi_shijing.push(trigger.cards[i]);
						}
					}
					player.markSkill('gezi_shijing');
					player.syncStorage('gezi_shijing');
				},
			},
			"gezi_world": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_world_skill"],
				roundi: true,
				priority: 22,
				check: function (event, player) {
					if (player.lili > 2) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("The World！");
				},
			},
			"gezi_world_skill": {
				trigger: {
					global: "useCardToBegin",
				},
				usable: 1,
				priority: 33,
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (event.player != _status.currentPhase) return false;
					return get.tag(event.card, 'damage') && (player.lili || player.countCards('e', {
						name: 'gezi_lunadial'
					}));
				},
				content: function () {
					'step 0'
					if (player.lili && !player.countCards('e', {
						name: 'gezi_lunadial'
					})) {
						player.loselili();
					}
					trigger.untrigger();
					trigger.finish();
					if (trigger.card.name == 'sha') player.say('停止吧，时间!');
					if (trigger.card.name == 'guohe')
						player.say('女仆助你下楼梯！');
					if (trigger.card.name == 'wanjian')
						player.say('the world!');
					'step 1'
					player.chooseTarget('获得一名角色区域内一张牌，然后你可以使用之', function (card, player, target) {
						return target.countCards('hej');
					}).set('ai', function (target) {
						return get.attitude(player, target) < 0;
					});
					'step 2'
					if (result.bool) {
						player.line(result.targets[0], 'red');
						player.gainPlayerCard(result.targets[0], 'hej', true);
					}
					'step 3'
					if (result.cards) {
						var card = result.cards[0];
						if (card && game.hasPlayer(function (current) {
							return player.canUse(card, current);
						}) && get.owner(card) == player) {
							player.chooseToUse({
								prompt: '是否使用' + get.translation(card) + '？',
								filterCard: function (cardx, player, target) {
									return cardx == card;
								},
							});
						}
					}
				},
				check: function (event, player) {
					if (get.effect(event.target, event.card, event.player, player) >= 0)
						return false;
					if (event.target.hp > 2) return false;
					return true;
				},
				prompt: "要不要使用The World的力量？",
			},
			/*-------------------散樱-------------------*/
			//爱丽丝
			"gezi_huanfa": {
				trigger: {
					player: "phaseDiscardBegin",
				},
				audio: "ext:东方project:2",
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				direct: true,
				intro: {
					content: "cards",
				},
				filter: function (event, player) {
					if (player.storage.gezi_huanfa.length > game.countPlayer()) return false;
					return player.countCards('h');
				},
				content: function () {
					'step 0'
					player.chooseCard('h', [1, 2], '将一至两张手牌置为“手办”').set('ai', function (card) {
						return 7 - get.value(card);
					});
					'step 1'
					if (result.cards && result.cards.length) {
						player.logSkill("gezi_huanfa", player);
						player.lose(result.cards, ui.special, 'toStorage')
						player.$give(result.cards, player);
						player.storage.gezi_huanfa = player.storage.gezi_huanfa.concat(result.cards);
						player.markSkill('gezi_huanfa');
						game.log(player, '将', result.cards.length, '张牌置为“手办”');
						player.draw(result.cards.length);
						player.gainlili(result.cards.length);
					}
				},
			},
			"gezi_mocai": {
				audio: "ext:东方project:2",
				priority: 5,
				trigger: {
					global: "useCardToBefore",
				},
				filter: function (event, player) {
					if (get.distance(player, event.target, 'attack') > 1) return false;
					if (!player.storage.gezi_huanfa) return false;
					if (player.storage.gezi_huanfa.length == 0) return false;
					return true;
				},
				direct: true,
				content: function () {
					'step 0'
					var nono = false;
					if (get.attitude(player, trigger.target) > 0) nono = true;
					player.chooseCardButton(player.storage.gezi_huanfa, '选择一张“手办”,给牌的目标增益效果').set('ai', function (button) {
						if (_status.event.nono == true) return 100 - get.value(button.link);
						return false;
					}).set("nono", nono);
					'step 1'
					if (result.links) {
						var list = ['将“手办”交给目标', '发现一张牌，交给目标'];
						event.list = list;
						event.card = result.links[0];
						player.chooseControlList(get.prompt('gezi_mocai'), event.list).set('ai', function (event, player) {
							if (get.value(result.links[0]) > 5) {
								return event.list.indexOf('将“手办”交给目标');

							} else {
								return event.list.indexOf('发现一张牌，交给目标');
							}
						});
					}
					'step 2'
					if (result.control) {
						event.index = result.index;
						if (event.list[event.index] == '将“手办”交给目标') {
							player.logSkill('gezi_mocai', trigger.target);
							player.storage.gezi_huanfa.remove(event.card);
							player.markSkill('gezi_huanfa');
							if (!player.storage.gezi_huanfa.length) player.unmarkSkill('gezi_huanfa');
							trigger.target.gain(event.card, 'log');
							player.$give(1, trigger.target);
							if (get.type(event.card) == 'equip') {
								player.chooseBool('是否将' + get.translation(event.card) + '置入' + get.translation(trigger.target) + '的装备区内？').set('choice', true);
							}
						}
						if (event.list[event.index] == '发现一张牌，交给目标') {
							player.logSkill('gezi_mocai', trigger.target);
							player.storage.gezi_huanfa.remove(event.card);
							player.$throw(event.card, 1000);
							player.syncStorage('gezi_huanfa');
							if (!player.storage.gezi_huanfa.length) player.unmarkSkill('gezi_huanfa');
							var cards = [];
							for (var i = 0; i < 3; i++) {
								cards.push(ui.cardPile.childNodes[i]);
							}
							player.chooseCardButton(cards, '选择一张牌交给' + get.translation(trigger.target), 1, true).set('ai', function (button) {
								return get.value(button.link);
							});
						}
					}
					'step 3'
					if (result.links) {
						if (event.list[event.index] == '将“手办”交给目标' && result.bool && event.card) {
							trigger.target.equip(event.card);
						}
						if (event.list[event.index] == '发现一张牌，交给目标' && result.links) {
							trigger.target.gain(result.links[0]);
							trigger.target.$gain(1);
						}
					}
				},
			},
			"gezi_hanghourai": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_hanghourai1"],
				roundi: true,
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1 && player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseCard('he', [1, player.countCards('he')], '将任意张牌置为“手办”').set('ai', function (card) {
						var player = _status.event.player;
						if (player.lili <= 1) return 0;
						return 7 - get.value(card);
					});
					'step 1'
					if (result.bool && result.cards.length) {
						player.logSkill("gezi_hanghourai", player);
						player.say("<符卡>上吊的蓬莱人形！");
						player.loselili();
						player.lose(result.cards, ui.special);
						player.storage.gezi_huanfa = player.storage.gezi_huanfa.concat(result.cards);
						player.markSkill('gezi_huanfa');
						game.log(player, '将', result.cards.length, '张牌置为“手办”');
						player.draw(result.cards.length);
						player.Fuka();
					}
				},
			},
			"gezi_hanghourai1": {
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseEnd",
				},
				filter: function (event, player) {
					return player.storage.gezi_huanfa.length > 0;
				},
				content: function () {
					'step 0'
					trigger.target = _status.currentPhase;
					player.chooseCardButton(player.storage.gezi_huanfa, '选择一张“手办”交给' + get.translation(trigger.target), 1, true).ai = function (button) {
						return get.value(button.link);
					};
					'step 1'
					if (result.bool && result.links.length) {
						event.card = result.links[0];
						trigger.target.gain(event.card);
						player.storage.gezi_huanfa.remove(event.card);
						player.$throw(event.card, 1000);
						player.syncStorage('gezi_huanfa');
						var players = game.filterPlayer();
						var f = [];
						for (var i = 0; i < players.length; i++) {
							if (trigger.target.canUse(event.card, players[i])) f.push(players[i]);
						}
						if (f.length == 0) event.finish();
						else {
							player.chooseTarget(('选择' + get.translation(trigger.target) + '使用' + get.translation(event.card) + '的目标'), function (card, player, target) {
								return f.contains(target);
							}).set('ai', function (target) {
								return get.effect(target, event.card, player, player);
							});
						}
					}
					'step 2'
					if (result.bool && result.targets.length) {
						trigger.target.useCard(event.card, result.targets);
					}
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
			},
			//橙
			"gezi_mingdong": {
				trigger: {
					target: "useCardToBegin",
				},
				usable: 1,
				frequent: true,
				audio: "ext:东方project:2",
				intro: {
					content: function (storage, player) {
						return '可以将普通锦囊牌当作' + lib.translate[player.storage.gezi_mingdong];
					},
				},
				hiddenCard: function (player, name) {
					return name == "shan" || name == 'tao';
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
						if (lib.card[i].type == 'basic') {
							list.add(i);
						}
					}
					for (var i = 0; i < list.length; i++) {
						list[i] = [get.type(list[i]), '', list[i]];
					}
					player.chooseButton(['选择【鸣动】这回合可以转化的牌', [list, 'vcard']]).set('ai', function (button) {
						if (_status.currentPhase == player) return button.link[2] == 'ziyangdan';
						if (get.tag(trigger.card, 'respondShan')) return button.link[2] == 'shan';
						if (get.tag(trigger.card, 'respondSha')) return button.link[2] == 'sha';
						return button.link[2] == 'tao';
					});
					'step 1'
					if (result.bool) {
						var name = result.links[0][2];
						player.storage.gezi_mingdong = name;
						player.addTempSkill('gezi_mingdong2');
						player.markSkill('gezi_mingdong');
						lib.skill.gezi_mingdong2.viewAs = {
							name: name
						};
						game.log(player, '选择了', lib.translate[name]);
					}
				},
			},
			"gezi_mingdong2": {
				audio: "ext:东方project:3",
				enable: ["chooseToRespond", "chooseToUse"],
				hiddenCard: function (player, name) {
					return name == "shan" || name == "tao";
				},
				filter: function (event, player) {
					return player.countCards('h', {
						type: 'trick'
					}) > 0;
				},
				filterCard: function (card, player) {
					return get.type(card) == 'trick';
				},
				position: "h",
				check: function (card) {
					return 7 - get.value(card)
				},
				onremove: function (player) {
					delete player.storage.gezi_mingdong;
					player.unmarkSkill('gezi_mingdong');
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					order: 5,
					useful: 6,
					value: 6,
				},
			},
			"gezi_shihuo": {
				trigger: {
					player: "gainAfter",
				},
				usable: 1,
				audio: "ext:东方project:2",
				direct: true,
				filter: function (event, player) {
					return event.getParent().name == 'draw';
				},
				content: function () {
					'step 0'
					player.chooseTarget('【式获】:令一名角色获得摸一张牌', function (card, player, target) {
						return true;
					}).set('ai', function (target) {
						var att = get.attitude(_status.event.player, target);
						if (target.node.lili) {
							if (target.maxlili - target.lili > 0) att += 2;
						}
						if (target.node.fuka) att -= 2;
						return att;
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_shihuo', result.targets[0]);
						result.targets[0].draw();
						result.targets[0].gainlili();
						if (result.targets[0].name == 'gezi_ran') {
							result.targets[0].say('橙也渐渐懂事起来了啊w');
						}
						if (result.targets[0].name == 'gezi_yukari') {
							result.targets[0].say('（揉揉橙）');
						}
					}
				},
			},
			"gezi_shuanggui": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				spell: ["gezi_shuanggui2"],
				roundi: true,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('令一名角色与你一同摸一张牌', function (card, player, target) {
						return target != player;
					}).set('ai', function (target) {
						var player = _status.event.player;
						if (player.lili <= 1) return false;
						return get.attitude(player, target);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_shuanggui', result.targets[0]);
						player.say("<鬼符>青鬼赤鬼！");
						player.loselili();
						player.Fuka();
						player.draw();
						result.targets[0].draw();
						result.targets[0].addTempSkill('gezi_shuanggui3', {
							player: "phaseEnd"
						});
					}
				},
			},
			"gezi_shuanggui2": {
			},
			"gezi_shuanggui3": {
				group: ["gezi_shuanggui4", "gezi_shuanggui5"],
				enable: "chooseToUse",
				chooseButton: {
					dialog: function (event, player) {
						var dialog = ui.create.dialog('hidden');
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (!players[i].hasSkill('gezi_shuanggui2')) continue;
							if (players[i].countCards('h')) {
								dialog.add(get.translation(players[i]) + '的' + '手牌');
								var hs = game.players[i].get('h');
								dialog.add(hs);
							}
						}
						return dialog;
					},
					filter: function (button, player) {
						var evt = _status.event.getParent();
						if (evt && evt.filterCard) {
							return get.type(button.link) == 'basic' && evt.filterCard(button.link, player, evt);
						}
						return game.hasPlayer(function (current) {
							return current != player && current.hasSkill('gezi_shuanggui2');
						})
					},
					check: function (button) {
						var player = _status.currentPhase;
						return game.hasPlayer(function (current) {
							return get.type(button.link) == 'basic' && player.canUse(button.link, current, false) && get.effect(current, button.link, player, player) > 0;
						}) ? get.order(button.link) : 0;
					},
					backup: function (links, player) {
						return {
							filterCard: function () {
								return false
							},
							selectCard: -1,
							viewAs: links[0],
							onuse: function (result, player) {
								var players = game.filterPlayer()
								for (var i = 0; i < players.length; i++) {
									players[i].lose(links[0]);
									players[i].update();
								}
								game.delay();
							}
						}
					},
					prompt: function (links, player) {
						return '选择' + get.translation(links) + '的目标';
					},
				},
			},
			"gezi_shuanggui4": {
				audio: "ext:东方project:2",
				trigger: {
					player: "chooseToRespondBegin",
				},
				frequent: true,
				filter: function (event, player) {
					if (event.responded) return false;
					return game.hasPlayer(function (current) {
						return current != player && current.hasSkill('gezi_shuanggui2') && current.countCards('h');
					})
				},
				content: function () {
					"step 0"
					var dialog = ui.create.dialog('hidden');
					var cards = [];
					var players = game.filterPlayer();
					event.players = players;
					for (var i = 0; i < players.length; i++) {
						if (!players[i].hasSkill('gezi_shuanggui2')) continue;
						dialog.add(get.translation(players[i]) + '的' + '手牌');
						if (players[i].countCards('h')) {
							var hs = players[i].get('h');
							for (var j = 0; j < hs.length; j++) {
								cards.push(hs[j]);
							}
						}
					}
					player.chooseCardButton('【双鬼】：选择一张卡牌打出', dialog, cards).set('filterButton', function (button) {
						return get.type(button.link) == 'basic' && _status.event.getTrigger().filterCard(button.link);
					});
					"step 1"
					if (result.bool) {
						for (var i = 0; i < event.players.length; i++) {
							event.players[i].lose(result.links[0]);
							event.players[i].update();
						}
						game.log(player, '【双鬼】发动成功');
						trigger.untrigger();
						trigger.responded = true;
						result.links[0].remove();
						trigger.result = {
							bool: true,
							card: result.links[0]
						}
					}
				},
				ai: {
					effect: {
						target: function (card, player, target, effect) {
							if (get.tag(card, 'respondShan')) return 0.8;
							if (get.tag(card, 'respondSha')) return 0.8;
						},
					},
				},
			},
			"gezi_shuanggui5": {
				filter: function (event, player) {
					return false;
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					basic: {
						useful: [6, 4],
						value: [6, 4],
					},
					result: {
						player: 0.5,
					},
				},
			},
			//蕾蒂
			"gezi_shuangjiang": {
				audio: "ext:东方project:2",
				group: ["gezi_shuangjiang2", "gezi_shuangjiang3"],
				trigger: {
					player: "phaseEnd",
				},
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && !current.storage.gezi_shuang && current.storage._gezi_mubiao;
					});
				},
				direct: true,
				content: function () {
					'step 0'
					var players = game.filterPlayer();
					var p = [];
					for (var i = 0; i < players.length; i++) {
						if (!players[i].storage.gezi_shuang && players[i].storage._gezi_mubiao && players[i] != player) p.push(players[i]);
					}
					event.p = p;
					if (!player.hasSkill('gezi_baofengxue2')) {
						event.goto(4);
					}
					'step 1'
					var num = 0;
					for (var i = 0; i < event.p.length; i++) {
						num += get.damageEffect(event.p[i], player, player, 'thunder');
					}
					player.chooseTarget(event.p.length, ('霜降：是否对所有亮的角色各造成1点雷电伤害'), function (card, player, target) {
						return event.p.contains(target);
					}).set('ai', function (target) {
						if (_status.event.num > 0) return true;
						return false;
					}).set('num', num);
					'step 2'
					if (result.bool) {
						player.logSkill('gezi_shuangjiang', result.targets);
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].damage('thunder');
						}
					}
					'step 3'
					event.finish();
					'step 4'
					player.chooseTarget(1, ('霜降：是否对一名亮的角色各造成1点雷电伤害'), function (card, player, target) {
						return event.p.contains(target);
					}).set('ai', function (target) {
						return get.damageEffect(target, player, player, 'thunder');
					});
					'step 5'
					if (result.bool) {
						player.logSkill('gezi_shuangjiang', result.targets[0]);
						result.targets[0].damage('thunder');
						player.gainlili();
					}
				},
			},
			"gezi_shuangjiang2": {
				trigger: {
					global: ["useCard", "respond"],
				},
				direct: true,
				popup: false,
				filter: function (event, player) {
					return _status.currentPhase.hasSkill('gezi_shuangjiang');
				},
				content: function () {
					if (trigger.player) {
						trigger.player.storage.gezi_shuang = 1;
					}
				},
			},
			"gezi_shuangjiang3": {
				trigger: {
					player: "phaseAfter",
				},
				direct: true,
				popup: false,
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						delete players[i].storage.gezi_shuang;
					}
				},
			},
			"gezi_baofengxue": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_baofengxue2"],
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("<符卡>暴风雪之眼！");
				},
				check: function (event, player) {
					if (player.lili > 2 && player.countCards('h') > 2) return true;
					return false;
				},
			},
			"gezi_baofengxue2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "useCard",
				},
				priority: 2.3,
				mark: true,
				global: "gezi_baofengxue3",
				direct: true,
				filter: function (event) {
					if (!event.card) return false;
					return true;
				},
				init: function (player) {
					player.storage.gezi_baofengxue = [];
				},
				intro: {
					content: function (storage, player) {
						var str = '';
						for (var i = 0; i < player.storage.gezi_baofengxue.length; i++) {
							str += get.translation(player.storage.gezi_baofengxue[i]) + ',';
						}
						return '其他角色无法使用或打出的花色：' + str;
					},
				},
				onremove: function (player) {
					player.storage.gezi_baofengxue = [];
					player.unmarkSkill('gezi_baofengxue');
				},
				content: function () {
					if (get.suit(trigger.card) && !player.storage.gezi_baofengxue.contains(get.suit(trigger.card))) {
						player.storage.gezi_baofengxue.push(get.suit(trigger.card));
						if (lib.config.background_audio) {
							game.playlili('baofengxue');
						}
					}
					player.markSkill('gezi_baofengxue');
				},
				ai: {
					threaten: 1.4,
					noautowuxie: true,
				},
			},
			"gezi_baofengxue3": {
				mod: {
					cardEnabled: function (card, player) {
						if (!player.hasSkill('gezi_baofengxue2') && game.hasPlayer(function (current) {
							return current.storage.gezi_baofengxue && current.storage.gezi_baofengxue.contains(get.suit(card));
						})) return false;
					},
					cardUsable: function (card, player) {
						if (!player.hasSkill('gezi_baofengxue2') && game.hasPlayer(function (current) {
							return current.storage.gezi_baofengxue && current.storage.gezi_baofengxue.contains(get.suit(card));
						})) return false;
					},
					cardRespondable: function (card, player) {
						if (!player.hasSkill('gezi_baofengxue2') && game.hasPlayer(function (current) {
							return current.storage.gezi_baofengxue && current.storage.gezi_baofengxue.contains(get.suit(card));
						})) return false;
					},
					cardSavable: function (card, player) {
						if (!player.hasSkill('gezi_baofengxue2') && game.hasPlayer(function (current) {
							return current.storage.gezi_baofengxue && current.storage.gezi_baofengxue.contains(get.suit(card));
						})) return false;
					},
				},
				intro: {
					content: function (suit) {
						return '不能使用或打出' + get.translation(suit) + '的牌';
					},
				},
			},
			//莉莉白
			"gezi_chunxiao": {
				audio: "ext:东方project:4",
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili >= player.hp || !player.node.lili;
				},
				check: function (event, player) {
					return game.countPlayer(function (current) {
						if (get.attitude(player, current) < 0) return -2;
						else return 2;
					}) > 0;
				},
				content: function () {
					"step 0"
					event.current = player;
					event.players = game.filterPlayer();
					event.num = 0;
					player.line(event.players, 'green');
					"step 1"
					if (event.num < event.players.length) {
						var target = event.players[event.num];
						target.draw();
						if (target.name == 'gezi_lilyblack') player.say('是你！春天对决，来吧！');
						event.num++;
						event.redo();
					}
					"step 2"
					event.current.chooseTarget([1, 1], true, '春晓：弃置与你最近的一名角色一张牌', function (card, player, target) {
						if (player == target) return false;
						if (get.distance(player, target) <= 1) return true;
						if (game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) < get.distance(player, target);
						})) {
							return false;
						}
						return target.countCards('he');
					}).set('ai', function (target) {
						return -get.attitude(_status.event.player, target);
					});
					"step 3"
					if (result.bool) {
						event.current.line(result.targets, 'green');
						event.targets = result.targets;
						event.current.discardPlayerCard(event.targets[0], 'he', [1, 1], true);
					}
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
				},
				prompt: "春天来了！春天来了！",
			},
			"gezi_mengya": {
				audio: "ext:东方project:4",
				enable: "phaseUse",
				usable: 2,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					'step 0'
					var choice = ['摸一张牌并获得1点灵力，弃一张牌'];
					if (player.lili) {
						choice.push('消耗1点灵力，摸两张牌');
					}
					player.chooseControl(choice).set('ai', function () {
						if (player.countCards('h') > player.hp && player.lili < 3) return '摸一张牌并获得1点灵力，弃一张牌';
						if (player.lili > 1) return '消耗1点灵力，摸两张牌';
						return '摸一张牌并获得1点灵力，弃一张牌';
					});
					'step 1'
					if (result.control == '摸一张牌并获得1点灵力，弃一张牌') {
						player.draw();
						player.gainlili();
						player.chooseToDiscard(1, true, 'he');
					} else if (result.control == '消耗1点灵力，摸两张牌') {
						player.loselili();
						player.draw(2);
					}
				},
				ai: {
					basic: {
						order: 8,
					},
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			//露娜萨
			"gezi_shenxuan": {
				audio: "ext:东方project:2",
				global: ["gezi_shenxuan_viewAs"],
				group: ["gezi_bianshenmingzhi2"],
				enable: "phaseUse",
				filterCard: function (card, player) {
					if (player.storage.gezi_shenxuan)
						return !player.storage.gezi_shenxuan.contains(card);
					else return true;
				},
				check: function (card) {
					return get.value(card);
				},
				mark: true,
				intro: {
					content: "cards",
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h');
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('xiaotiqin1');
					}
					player.showCards(cards[0]);
					player.storage.gezi_shenxuan = player.storage.gezi_shenxuan.concat(cards[0]);
					player.markSkill('gezi_shenxuan');
					player.gainlili();
				},
				ai: {
					order: 5,
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			"gezi_shenxuan_viewAs": {
				enable: "chooseToUse",
				usable: 1,
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (player.countCards('h', 'sha') == 0) return false;
					return game.hasPlayer(function (target) {
						return target.hasSkill('gezi_shenxuan') && target.storage.gezi_shenxuan && target.storage.gezi_shenxuan.length && get.distance(target, player, 'attack') <= 1;
					});
				},
				chooseButton: {
					dialog: function (event, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_shenxuan') && players[i].storage.gezi_shenxuan.length && get.distance(players[i], player, 'attack') <= 1) {
								for (var j = 0; j < players[i].storage.gezi_shenxuan.length; j++) {
									if (get.type(players[i].storage.gezi_shenxuan[j]) != 'equip') list.push(players[i].storage.gezi_shenxuan[j].name);
								}
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player);
					},
					check: function (button) {
						return get.value({
							name: button.link[2]
						});
					},
					backup: function (links, player) {
						return {
							filterCard: {
								name: 'sha'
							},
							selectCard: 1,
							audio: 2,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function (links, player) {
						return '将一张【杀】当作' + get.translation(links[0][2]) + '使用';
					},
					ai: {
						order: 6,
						result: {
							player: function (player) {
								return 0.5;
							},
						},
					},
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							var num = 0;
							var cards = player.getCards('h');
							if (cards.length >= 3 && player.hp >= 3) return 0;
							for (var i = 0; i < cards.length; i++) {
								num += Math.max(0, get.value(cards[i], player, 'raw'));
							}
							num /= cards.length;
							num *= Math.min(cards.length, player.hp);
							return 12 - num;
						},
					},
					threaten: 1.6,
				},
			},
			"gezi_zhenhun": {
				trigger: {
					global: "phaseEnd",
				},
				group: ["gezi_zhenhun_mark", "gezi_zhenhun_remove"],
				direct: true,
				audio: "ext:东方project:2",
				intro: {
					content: "cards",
				},
				filter: function (event, player) {
					if (player.storage.gezi_shenxuan && player.storage.gezi_shenxuan.length) return true;
					if (player.storage.gezi_zhenhun && player.storage.gezi_zhenhun.length) {
						for (var i = 0; i < player.storage.gezi_zhenhun.length; i++) {
							if (get.position(player.storage.gezi_zhenhun[i], true) == 'd') {
								return true;
							}
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var list = ['cancel2'];
					var cards = [];
					if (player.storage.gezi_shenxuan && player.storage.gezi_shenxuan.length && _status.currentPhase != player) list.push('将一张牌交给其');
					if (player.storage.gezi_zhenhun && player.storage.gezi_zhenhun.length) {
						for (var i = 0; i < player.storage.gezi_zhenhun.length; i++) {
							if (get.position(player.storage.gezi_zhenhun[i], true) == 'd') {
								cards.push(player.storage.gezi_zhenhun[i]);
							}
						}
					}
					if (cards.length) list.push('获得弃置的一张牌');
					event.list = list;
					event.cards = cards;
					'step 1'
					if (event.list.length == 1) event.finish();
					player.chooseControl(event.list, function (event, player) {
						if (event.list.contains('获得弃置的一张牌')) return '获得弃置的一张牌';
						if (player.storage.gezi_shenxuan.length > 1 && get.attitude(player, _status.currentPhase) > 0) return '将一张牌交给其';
						return 'cancel2';
					}).set('prompt', get.prompt('gezi_zhenhun'));
					"step 2"
					event.control = result.control;
					if (result.control == '获得弃置的一张牌') {
						player.chooseCardButton(event.cards, '获得本回合因弃置进入弃牌堆的一张牌', 1, true).ai = function (button) {
							var val = get.value(button.link);
							if (val < 0) return -10;
							return val;
						}
					} else if (result.control == '将一张牌交给其') {
						player.chooseCardTarget({
							filterCard: function (card, player) {
								return true;
							},
							filterTarget: function (card, player, target) {
								return player != target && target == _status.currentPhase;
							},
							forced: true,
							position: 'he',
							prompt: '将一张牌交给其',
							ai1: function (card) {
								return 7 - get.useful(card);
							},
						});
					} else if (result.control == 'cancel2') {
						event.finish();
					}
					"step 3"
					if (result.bool && event.control == '获得弃置的一张牌') {
						if (result.links.length) {
							player.logSkill('gezi_zhenhun');
							if (lib.config.background_audio) {
								game.playlili('xiaotiqin3');
							}
							player.$gain(result.links);
							player.gain(result.links[0], 'log');
							player.showCards(result.links[0]);
							player.storage.gezi_shenxuan = player.storage.gezi_shenxuan.concat(result.links[0]);
							player.markSkill('gezi_shenxuan');
						}
					}
					if (result.bool && event.control == '将一张牌交给其') {
						if (result.targets && result.targets[0]) {
							player.logSkill('gezi_zhenhun', result.targets[0]);
							if (lib.config.background_audio) {
								game.playlili('xiaotiqin4');
							}
							result.targets[0].gain(result.cards, player);
							player.$give(result.cards, result.targets[0]);
						}
					}
				},
			},
			"gezi_zhenhun_mark": {
				direct: true,
				popup: false,
				forced: true,
				trigger: {
					global: "discardAfter",
				},
				filter: function (event, player) {
					if (_status.currentPhase != event.player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					"step 1"
					if (!player.storage.gezi_zhenhun) player.storage.gezi_zhenhun = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == 'd') {
							player.storage.gezi_zhenhun.push(trigger.cards[i]);
						}
					}
					player.markSkill('gezi_zhenhun');
					player.syncStorage('gezi_zhenhun');
				},
			},
			"gezi_zhenhun_remove": {
				popup: false,
				forced: true,
				trigger: {
					global: "phaseAfter",
				},
				content: function () {
					player.storage.gezi_zhenhun = [];
					player.unmarkSkill('gezi_zhenhun');
				},
			},
			"gezi_bianshenmingzhi2": {
				unique: true,
				locked: true,
				silent: true,
				priority: 3.1,
				trigger: {
					global: "gameStart",
				},
				filter: function (event, player) {
					return _status.mingzhiBool == true && player.name == 'gezi_lunasa' && game.me == player;
				},
				content: function () {
					'step 0'
					var controls = ['gezi_lunasa', '露娜萨（明置）'];
					player.chooseControl(controls).set('ai', function () {
						return '露娜萨（明置）';
					}).set('prompt', "请选择目标人物");
					'step 1'
					if (result.control == '露娜萨（明置）') {
						if (lib.character.gezi_lunasa) {
							lib.character.gezi_lunasa[3] = ["gezi_reshenxuan", "gezi_rezhenhun", "gezi_hezou"];
						}
						player.removeSkill('gezi_shenxuan');
						player.removeSkill('gezi_zhenhun');
						player.removeSkill('gezi_hezou');
						player.addnSkill('gezi_reshenxuan');
						player.addnSkill('gezi_rezhenhun');
						player.addnSkill('gezi_hezou');
						player.update();
					}
				},
				forced: true,
				popup: false,
			},
			"gezi_reshenxuan": {
				global: ["gezi_reshenxuan_viewAs"],
				enable: "phaseUse",
				usable: 1,
				filterCard: function (card, player) {
					if (player.storage.mingzhi)
						return !player.storage.mingzhi.contains(card);
					else return true;
				},
				check: function (card) {
					return get.value(card);
				},
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return player.countCards('h');
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('xiaotiqin2');
					}
					player.addShownCards(cards[0], 'visible_mingzhi');
					player.gainlili();
				},
				ai: {
					order: 5,
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			"gezi_reshenxuan_viewAs": {
				enable: "chooseToUse",
				usable: 1,
				audio: "ext:东方project:1",
				filter: function (event, player) {
					if (player.countCards('h', 'sha') == 0) return false;
					return game.hasPlayer(function (target) {
						return target.hasSkill('gezi_reshenxuan') && target.storage.mingzhi && get.distance(target, player, 'attack') <= 1;
					});
				},
				chooseButton: {
					dialog: function (event, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_reshenxuan') && players[i].storage.mingzhi.length && get.distance(players[i], player, 'attack') <= 1) {
								for (var j = 0; j < players[i].storage.mingzhi.length; j++) {
									if (get.type(players[i].storage.mingzhi[j]) != 'equip') list.push(players[i].storage.mingzhi[j].name);
								}
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player);
					},
					check: function (button) {
						return get.value({
							name: button.link[2]
						});
					},
					backup: function (links, player) {
						return {
							filterCard: {
								name: 'sha'
							},
							selectCard: 1,
							audio: 2,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function (links, player) {
						return '将一张【杀】当作' + get.translation(links[0][2]) + '使用';
					},
					ai: {
						order: 6,
						result: {
							player: function (player) {
								return 0.5;
							},
						},
					},
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							var num = 0;
							var cards = player.getCards('h');
							if (cards.length >= 3 && player.hp >= 3) return 0;
							for (var i = 0; i < cards.length; i++) {
								num += Math.max(0, get.value(cards[i], player, 'raw'));
							}
							num /= cards.length;
							num *= Math.min(cards.length, player.hp);
							return 12 - num;
						},
					},
					threaten: 1.6,
				},
			},
			"gezi_rezhenhun": {
				trigger: {
					global: "phaseEnd",
				},
				group: ["gezi_rezhenhun_mark", "gezi_rezhenhun_remove"],
				direct: true,
				audio: "ext:东方project:2",
				intro: {
					content: "cards",
				},
				filter: function (event, player) {
					if (player.storage.mingzhi && player.storage.mingzhi.length) return true;
					if (player.storage.gezi_rezhenhun && player.storage.gezi_rezhenhun.length) {
						for (var i = 0; i < player.storage.gezi_rezhenhun.length; i++) {
							if (get.position(player.storage.gezi_rezhenhun[i], true) == 'd') {
								return true;
							}
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var list = ['cancel2'];
					var cards = [];
					if (player.storage.mingzhi && player.storage.mingzhi.length && _status.currentPhase != player) list.push('将明置牌交给当前回合角色');
					if (player.storage.gezi_rezhenhun && player.storage.gezi_rezhenhun.length) {
						for (var i = 0; i < player.storage.gezi_rezhenhun.length; i++) {
							if (get.position(player.storage.gezi_rezhenhun[i], true) == 'd') {
								cards.push(player.storage.gezi_rezhenhun[i]);
							}
						}
					}
					if (cards.length) list.push('获得弃置的一张牌');
					event.list = list;
					event.cards = cards;
					'step 1'
					if (event.list.length == 1) event.finish();
					player.chooseControl(event.list, function (event, player) {
						if (event.list.contains('获得弃置的一张牌')) return '获得弃置的一张牌';
						if (player.storage.mingzhi.length > 1 && get.attitude(player, _status.currentPhase) > 0) return '将明置牌交给当前回合角色';
						return 'cancel2';
					}).set('prompt', get.prompt('gezi_rezhenhun'));
					"step 2"
					event.control = result.control;
					if (result.control == '获得弃置的一张牌') {
						//player.chooseCardButton(player.storage.gezi_rezhenhun, '获得本回合因弃置进入弃牌堆的一张牌', 1, true).ai = function (button) {
						player.chooseCardButton(event.cards, '获得本回合因弃置进入弃牌堆的一张牌', 1, true).ai = function (button) {
							var val = get.value(button.link);
							if (val < 0) return -10;
							return val;
						}
					} else if (result.control == '将明置牌交给当前回合角色') {
						player.chooseCardTarget({
							filterCard: function (card, player) {
								return player.storage.mingzhi.contains(card);
							},
							filterTarget: function (card, player, target) {
								return player != target && target == _status.currentPhase;
							},
							forced: true,
							position: 'he',
							prompt: '将一张明置牌交给当前回合角色',
							ai1: function (card) {
								return 9 - get.useful(card);
							},
						});
					} else if (result.control == 'cancel2') {
						event.finish();
					}
					"step 3"
					player.logSkill('gezi_rezhenhun');
					if (result.bool && event.control == '获得弃置的一张牌') {
						if (result.links.length) {
							if (lib.config.background_audio) {
								game.playlili('xiaotiqin3');
							}
							player.$gain(result.links);
							player.gain(result.links[0], 'log');
							player.addShownCards(result.links[0], 'visible_mingzhi');
						}
					}
					if (result.bool && event.control == '将明置牌交给当前回合角色') {
						if (result.targets && result.targets[0]) {
							if (lib.config.background_audio) {
								game.playlili('xiaotiqin4');
							}
							result.targets[0].gain(result.cards, player);
							player.$give(result.cards, result.targets[0]);
						}
					}
				},
			},
			"gezi_rezhenhun_mark": {
				direct: true,
				popup: false,
				forced: true,
				trigger: {
					global: "discardAfter",
				},
				filter: function (event, player) {
					if (_status.currentPhase != event.player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					"step 1"
					if (!player.storage.gezi_rezhenhun) player.storage.gezi_rezhenhun = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == 'd') {
							player.storage.gezi_rezhenhun.push(trigger.cards[i]);
						}
					}
					player.markSkill('gezi_rezhenhun');
					player.syncStorage('gezi_rezhenhun');
				},
			},
			"gezi_rezhenhun_remove": {
				popup: false,
				forced: true,
				trigger: {
					global: "phaseAfter",
				},
				content: function () {
					player.storage.gezi_rezhenhun = [];
					player.unmarkSkill('gezi_rezhenhun');
				},
			},
			"gezi_hezou": {
				audio: "ext:东方project:1",
				trigger: {
					player: ["phaseBegin"],
				},
				group: ["gezi_hezou_2"],
				spell: ["gezi_hezou_skill"],
				priority: 22,
				check: function (event, player) {
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("<符卡>棱镜协奏曲！");
				},
			},
			"gezi_hezou_2": {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToBegin",
				},
				spell: ["gezi_hezou_skill"],
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (event.card.name != 'sha') return false;
					return player.lili > 1;
				},
				content: function () {
					'step 0'
					player.loselili();
					player.Fuka();
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++) {
						if (!trigger.player.canUse('sha', players[i])) players.remove(players[i]);
					}
					var list = ['该【杀】无效'];
					if (players.length != 0) list.push('追加目标');
					player.chooseControl(list, function (event, player) {
						return '该【杀】无效';
					}).set('prompt', '消耗一点灵力，该【杀】无效或者为该【杀】追加两个目标');
					'step 1'
					if (result.control) {
						if (result.control == '该【杀】无效') {
							game.log('【合奏】：【杀】对', player, '无效');
							if (lib.config.background_audio) {
								game.playlili('hezou');
							}
							trigger.untrigger();
							trigger.finish();
							event.finish();
						} else if (result.control == '追加目标') {
							player.chooseTarget('【合奏】：把【杀】反射给一到两名角色', [1, 2], function (card, player, target) {
								return trigger.player.canUse('sha', target);
							}).set('ai', function (target) {
								return get.effect(target, trigger.card, trigger.player, player);
							});
						}
					}
					'step 2'
					if (result.bool && result.targets) {
						player.logSkill('gezi_hezou', result.targets[j]);
						if (lib.config.background_audio) {
							game.playlili('hezou');
						}
						for (var j = 0; j < result.targets.length; j++) trigger.targets.push(result.targets[j]);
						trigger.player.line(trigger.targets, 'red');
					}
				},
				check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name != 'sha') return;
							if (!target.lili) return;
							if (!player.hasFriend()) return;
							if (card.name == 'sha') return 0.6;
						},
					},
				},
			},
			"gezi_hezou_skill": {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					return event.card.name == 'sha';
				},
				content: function () {
					'step 0'
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++) {
						if (!trigger.player.canUse('sha', players[i])) players.remove(players[i]);
					}
					var list = ['该【杀】无效'];
					if (players.length != 0) list.push('追加目标');
					player.chooseControl(list, function (event, player) {
						return '该【杀】无效';
					}).set('prompt', '消耗一点灵力，该【杀】无效或者为该【杀】追加两个目标');
					'step 1'
					if (result.control) {
						if (result.control == '该【杀】无效') {
							game.log('【合奏】：【杀】对', player, '无效');
							if (lib.config.background_audio) {
								game.playlili('hezou');
							}
							trigger.untrigger();
							trigger.finish();
							event.finish();
						} else if (result.control == '追加目标') {
							player.chooseTarget('【合奏】：把【杀】反射给一到两名角色', [1, 2], function (card, player, target) {
								return trigger.player.canUse('sha', target);
							}).set('ai', function (target) {
								return get.effect(target, trigger.card, trigger.player, player);
							});
						}
					}
					'step 2'
					if (result.bool && result.targets) {
						player.logSkill('gezi_hezou', result.targets[j]);
						if (lib.config.background_audio) {
							game.playlili('hezou');
						}
						for (var j = 0; j < result.targets.length; j++) trigger.targets.push(result.targets[j]);
						trigger.player.line(trigger.targets, 'red');
					}
				},
				check: function (event, player) {
					return true;
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name == 'sha' && player != target) return 'zeroplayertarget';
						},
					},
				},
			},
			//莉莉卡
			"gezi_mingjian": {
				audio: "ext:东方project:2",
				mark: true,
				intro: {
					content: "cards",
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				group: ["gezi_mingjian2", "gezi_mingjian3", "gezi_bianshenmingzhi1"],
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h');
				},
				filterCard: function (card, player) {
					if (player.storage.gezi_mingjian) return !player.storage.gezi_mingjian.contains(card);
					else return true;
				},
				check: function (card) {
					return get.useful(card);
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('gangqin1');
					}
					player.showCards(cards[0]);
					player.storage.gezi_mingjian = player.storage.gezi_mingjian.concat(cards[0]);
					player.markSkill('gezi_mingjian');
					player.gainlili();
				},
				ai: {
					order: 10,
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			"gezi_mingjian2": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				filterCard: true,
				selectCard: 1,
				usable: 1,
				discard: false,
				prepare: "give2",
				filterTarget: function (card, player, target) {
					return player != target && !target.storage.gezi_mingjian4;
				},
				check: function (card) {
					if (!ui.selected.cards.length && card.name == 'sha') return 10;
					if (!ui.selected.cards.length && card.name == 'shan') return 9;
					if (!ui.selected.cards.length && card.name == 'tao') return 8;
					return 4 - get.value(card);
				},
				content: function () {
					'step 0'
					if (lib.config.background_audio) {
						game.playlili('gangqin2');
					}
					target.addSkill('gezi_mingjian4');
					target.gain(cards, player);
					target.showCards(cards[0]);
					target.storage.gezi_mingjian4 = target.storage.gezi_mingjian4.concat(cards[0]);
					target.markSkill('gezi_mingjian4');
					target.gainlili();
					if (target.name == 'gezi_merlin') {
						player.say('二姐，那个人欺负我，可以揍她吗~');
					}
					if (target.name == 'gezi_lunasa') {
						player.say('大姐，我不会演奏这个曲子，帮下忙呗~');
					}
					/*'step 1'
					for(var i=1;i<=5;i++){
						if(target.getEquip(i)&&player.isEmpty(i)){
							game.log(get.name(target.getEquip(i)));
							var card2=get.cardPile(function(card){ 
								return card.name==get.name(target.getEquip(i)); 
							}); 
							if(card2) player.gain(card2,'gain2'); 
						}
					}*/
				},
				prompt: "把乐谱明置出来给别人去演奏吧？",
				ai: {
					order: function (skill, player) {
						return 1;
					},
					result: {
						target: function (player, target) {
							var ne = 0;
							if (target.getEquip(1)) ne++;
							if (target.getEquip(2)) ne++;
							if (target.getEquip(5)) ne++;
							if (target.node.lili) {
								if (target.maxlili - target.lili > 0) ne += 2;
							}
							if (target.node.fuka) ne -= 2;
							return 1 + ne;
						},
					},
					effect: {
						target: function (card, player, target) {
							if (player == target && get.type(card) == 'equip') {
								if (player.countCards('e', {
									subtype: get.subtype(card)
								})) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i] != player && get.attitude(player, players[i]) > 0) {
											return 0.1;
										}
									}
								}
							}
						},
					},
				},
			},
			"gezi_mingjian3": {
				direct: true,
				trigger: {
					global: ["equipAfter", "gainAfter", "loseEnd"],
				},
				filter: function (event, player) {
					if (event.card && event.card.name == 'muniu') return false;
					return event.player == player || (event.player.hasSkill('gezi_mingjian4') && event.player != player);
				},
				onremove: function (player) {
					var target = game.findPlayer(function (current) {
						return current.hasSkill('gezi_mingjian4') && current != player;
					});
				},
				content: function () {
					var target = game.findPlayer(function (current) {
						return current.hasSkill('gezi_mingjian4') && current != player;
					});
					if (target) {
						if (trigger.name == 'equip') {
							var info = get.info(trigger.card);
							if (trigger.player == target && player.storage.gezi_mingjian) {
								if (info.skills) {
									for (var j = 0; j < info.skills.length; j++) {
										player.addSkill(info.skills[j]);
									}
								}
							} else if (trigger.player == player && player.storage.gezi_mingjian) {
								if (info.skills) {
									for (var j = 0; j < info.skills.length; j++) {
										target.addSkill(info.skills[j]);
									}
								}
							}
						} else if (trigger.name == 'gain') {
							if (player.storage.gezi_mingjian && trigger.player == player && player != target) {
								var es = target.getCards('e');
								for (var j = 0; j < es.length; j++) {
									var info = get.info(es[j]);
									if (info.skills) {
										for (var h = 0; h < info.skills.length; h++) {
											player.addSkill(info.skills[h]);
										}
									}
								}
								var ef = player.getCards('e');
								for (var j = 0; j < ef.length; j++) {
									var info = get.info(ef[j]);
									if (info.skills) {
										for (var h = 0; h < info.skills.length; h++) {
											target.addSkill(info.skills[h]);
										}
									}
								}
							}
						} else if (trigger.name == 'lose') {
							for (var i = 0; i < trigger.cards.length; i++) {
								if (trigger.cards[i].original == 'h' && trigger.player == player && !player.storage.gezi_mingjian) {
									var es = target.getCards('e');
									for (var j = 0; j < es.length; j++) {
										var info = get.info(es[j]);
										if (info.skills) {
											for (var h = 0; h < info.skills.length; h++) {
												player.removeSkill(info.skills[h]);
											}
										}
									}
									var ef = player.getCards('e');
									for (var j = 0; j < ef.length; j++) {
										var info = get.info(ef[j]);
										if (info.skills) {
											for (var h = 0; h < info.skills.length; h++) {
												target.removeSkill(info.skills[h]);
											}
										}
									}
								}
								if (trigger.cards[i].original == 'e') {
									var info = get.info(trigger.cards[i]);
									if (trigger.player == player && player.storage.gezi_mingjian) {
										if (info.skills) {
											for (var j = 0; j < info.skills.length; j++) {
												target.removeSkill(info.skills[j]);
											}
										}
									} else if (trigger.player == target && player.storage.gezi_mingjian) {
										if (info.skills) {
											for (var j = 0; j < info.skills.length; j++) {
												player.removeSkill(info.skills[j]);
											}
										}
									}
								}
							}
						}
					}
				},
			},
			"gezi_mingjian4": {
				mark: true,
				intro: {
					content: "cards",
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
			},
			"gezi_huanzou": {
				audio: "ext:东方project:2",
				group: "gezi_huanzou2",
				trigger: {
					global: ["useCardAfter", "respondAfter"],
				},
				filter: function (event, player) {
					if (!event.player.storage.gezi_mingjian4) return false;
					var list = [];
					for (var i = 0; i < event.player.storage.gezi_mingjian4.length; i++) list.push(event.player.storage.gezi_mingjian4[i].name);
					return list.contains(event.card.name);
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (lib.config.background_audio) {
						game.playlili('gangqin3');
					}
					trigger.player.draw();
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				prompt: function (event) {
					return '幻奏：是否让' + get.translation(event.player) + '摸一张牌？';
				},
			},
			"gezi_huanzou2": {
				audio: "huanzou",
				trigger: {
					global: "discardAfter",
				},
				filter: function (event, player) {
					if (!event.player.storage.gezi_mingjian4) return false;
					if (_status.currentPhase != event.player) return false;
					var list = [];
					for (var i = 0; i < event.player.storage.gezi_mingjian4.length; i++) list.push(event.player.storage.gezi_mingjian4[i].name);
					for (var j = 0; j < event.cards.length; j++) {
						return list.contains(event.cards[j].name);
					}
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (lib.config.background_audio) {
						game.playlili('gangqin4');
					}
					trigger.player.draw();
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				prompt: function (event) {
					return '是否让' + get.translation(event.player) + '摸一张牌？';
				},
			},
			"gezi_bianshenmingzhi1": {
				unique: true,
				locked: true,
				silent: true,
				priority: 3,
				trigger: {
					global: "gameStart",
				},
				filter: function (event, player) {
					return _status.mingzhiBool == true && player.name == 'gezi_lyrica' && game.me == player;
				},
				content: function () {
					'step 0'
					var controls = ['gezi_lyrica', '莉莉卡（明置）'];
					player.chooseControl(controls).set('ai', function () {
						return '莉莉卡（明置）';
					}).set('prompt', "请选择目标人物");
					'step 1'
					if (result.control == '莉莉卡（明置）') {
						if (lib.character.gezi_lyrica) {
							lib.character.gezi_lyrica[3] = ["gezi_remingjian", "gezi_rehuanzou", "gezi_hezou"];
						}
						player.removeSkill('gezi_mingjian');
						player.removeSkill('gezi_huanzou');
						player.removeSkill('gezi_hezou');
						player.addnSkill('gezi_remingjian');
						player.addnSkill('gezi_rehuanzou');
						player.addnSkill('gezi_hezou');
						player.update();
					}
				},
				forced: true,
				popup: false,
			},
			"gezi_remingjian": {
				audio: "ext:东方project:2",
				global: ["gezi_remingjian3"],
				group: "gezi_remingjian2",
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.getCards('h');
				},
				filterCard: function (card, player) {
					if (player.storage.mingzhi) return !player.storage.mingzhi.contains(card);
					else return true;
				},
				check: function (card) {
					return get.value(card);
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('gangqin1');
					}
					player.addShownCards(cards[0], 'visible_mingzhi');
					player.gainlili();
				},
				ai: {
					order: 10,
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			"gezi_remingjian2": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				filterCard: true,
				selectCard: 1,
				usable: 1,
				discard: false,
				prepare: "give2",
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					if (lib.config.background_audio) {
						game.playlili('gangqin2');
					}
					target.gain(cards, player);
					player.addShownCards(cards[0], 'visible_mingzhi');
					target.gainlili();
					if (target.name == 'gezi_merlin') {
						player.say('二姐，那个人欺负我，可以揍她吗~');
					}
					if (target.name == 'gezi_lunasa') {
						player.say('大姐，我不会演奏这个曲子，帮下忙呗~');
					}
				},
				prompt: "把乐谱明置出来给别人去演奏吧？",
				ai: {
					order: function (skill, player) {
						return 1;
					},
					result: {
						target: function (player, target) {
							var nh = target.countCards('h');
							var np = player.countCards('h');
							if (player.hp == player.maxHp || player.countCards('h') <= 1) {
								if (nh >= np - 1 && np <= player.hp) return 0;
							}
							return Math.max(1, 5 - nh);
						},
					},
					effect: {
						target: function (card, player, target) {
							if (player == target && get.type(card) == 'equip') {
								if (player.countCards('e', {
									subtype: get.subtype(card)
								})) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i] != player && get.attitude(player, players[i]) > 0) {
											return 0.1;
										}
									}
								}
							}
						},
					},
				},
			},
			"gezi_remingjian3": {
				direct: true,
				trigger: {
					global: ["equipAfter", "gainAfter", "loseEnd"],
				},
				filter: function (event, player) {
					if (event.card && event.card.name == 'muniu') return false;
					return event.player == player || event.player.hasSkill('gezi_remingjian') && event.player != player;
				},
				onremove: function (player) {
					var target = game.findPlayer(function (current) {
						return current.hasSkill('gezi_remingjian') && current != player;
					});
				},
				content: function () {
					var target = game.findPlayer(function (current) {
						return current.hasSkill('gezi_remingjian') && current != player;
					});
					if (target) {
						if (trigger.name == 'equip') {
							var info = get.info(trigger.card);
							if (trigger.player == target && player.storage.mingzhi) {
								if (info.skills) {
									for (var j = 0; j < info.skills.length; j++) {
										player.addSkill(info.skills[j]);
									}
								}
							} else if (trigger.player == player && player.storage.mingzhi) {
								if (info.skills) {
									for (var j = 0; j < info.skills.length; j++) {
										target.addSkill(info.skills[j]);
									}
								}
							}
						} else if (trigger.name == 'gain') {
							if (player.storage.mingzhi && trigger.player == player && player != target) {
								var es = target.getCards('e');
								for (var j = 0; j < es.length; j++) {
									var info = get.info(es[j]);
									if (info.skills) {
										for (var h = 0; h < info.skills.length; h++) {
											player.addSkill(info.skills[h]);
										}
									}
								}
								var ef = player.getCards('e');
								for (var j = 0; j < ef.length; j++) {
									var info = get.info(ef[j]);
									if (info.skills) {
										for (var h = 0; h < info.skills.length; h++) {
											target.addSkill(info.skills[h]);
										}
									}
								}
							}
						} else if (trigger.name == 'lose') {
							for (var i = 0; i < trigger.cards.length; i++) {
								if (trigger.cards[i].original == 'h' && trigger.player == player && !player.storage.mingzhi) {
									var es = target.getCards('e');
									for (var j = 0; j < es.length; j++) {
										var info = get.info(es[j]);
										if (info.skills) {
											for (var h = 0; h < info.skills.length; h++) {
												player.removeSkill(info.skills[h]);
											}
										}
									}
									var ef = player.getCards('e');
									for (var j = 0; j < ef.length; j++) {
										var info = get.info(ef[j]);
										if (info.skills) {
											for (var h = 0; h < info.skills.length; h++) {
												target.removeSkill(info.skills[h]);
											}
										}
									}
								}
								if (trigger.cards[i].original == 'e') {
									var info = get.info(trigger.cards[i]);
									if (trigger.player == player && player.storage.mingzhi) {
										if (info.skills) {
											for (var j = 0; j < info.skills.length; j++) {
												target.removeSkill(info.skills[j]);
											}
										}
									} else if (trigger.player == target && player.storage.mingzhi) {
										if (info.skills) {
											for (var j = 0; j < info.skills.length; j++) {
												player.removeSkill(info.skills[j]);
											}
										}
									}
								}
							}
						}
					}
				},
			},
			"gezi_rehuanzou": {
				audio: "ext:东方project:2",
				group: "gezi_rehuanzou2",
				trigger: {
					global: ["useCardBefore", "respondBefore"],
				},
				filter: function (event, player) {
					if (!event.player.storage.mingzhi) return false;
					if (event.target == event.player && get.type(event.card) == 'equip') return false;
					return event.player.storage.mingzhi.contains(event.card);
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (lib.config.background_audio) {
						game.playlili('gangqin3');
					}
					trigger.player.draw();
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				prompt: function (event) {
					return '幻奏：是否让' + get.translation(event.player) + '摸一张牌？';
				},
			},
			"gezi_rehuanzou2": {
				audio: "ext:东方project:2",
				trigger: {
					global: "discardBefore",
				},
				filter: function (event, player) {
					if (_status.currentPhase == event.player) {
						for (var i = 0; i < event.cards.length; i++) {
							if (event.player.storage.mingzhi && event.player.storage.mingzhi.contains(event.cards[i])) return true;
						}
					}
					return false;
				},
				content: function () {
					player.line(trigger.player, 'green');
					if (lib.config.background_audio) {
						game.playlili('gangqin4');
					}
					trigger.player.draw();
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				prompt: function (event) {
					return '是否让' + get.translation(event.player) + '摸一张牌？';
				},
			},
			//梅露兰
			"gezi_mingguan": {
				global: ["gezi_mingguan_viewAs"],
				group: ["gezi_bianshenmingzhi3"],
				enable: "phaseUse",
				audio: "ext:东方project:2",
				mark: true,
				intro: {
					content: "cards",
				},
				init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
				usable: 1,
				filterCard: function (card, player) {
					if (player.storage.gezi_mingguan)
						return !player.storage.gezi_mingguan.contains(card);
					else return true;
				},
				check: function (card) {
					return get.value(card);
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('xiaohao1');
					}
					player.showCards(cards[0]);
					player.storage.gezi_mingguan = player.storage.gezi_mingguan.concat(cards[0]);
					player.markSkill('gezi_mingguan');
					player.gainlili();
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							return 0.5;
						},
					},
				},
			},
			"gezi_mingguan_viewAs": {
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				viewAs: {
					name: "sha",
				},
				filter: function (event, player) {
					return game.hasPlayer(function (target) {
						return target.hasSkill('gezi_mingguan') && target.storage.gezi_mingguan && target.storage.gezi_mingguan.length && get.distance(target, player, 'attack') <= 1;
					});
				},
				filterCard: function (card, player) {
					var players = game.filterPlayer();
					var list = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].hasSkill('gezi_mingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.gezi_mingguan.length) {
							for (var j = 0; j < players[i].storage.gezi_mingguan.length; j++) list.push(players[i].storage.gezi_mingguan[j].name);
						}
					}
					return list.contains(card.name);
				},
				prompt: "将一张牌当【杀】使用。",
				check: function (card) {
					return 5 - get.value(card);
				},
				ai: {
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_kuangxiang": {
				audio: "ext:东方project:2",
				trigger: {
					global: "shaBefore",
				},
				usable: 1,
				filter: function (event, player) {
					if (event.target == player) return player.countCards('hej') > 1;
					if (player.countCards('hej') < 1 || event.target.countCards('hej') < 1) return false;
					return player.hp >= event.target.hp;
				},
				content: function () {
					'step 0'
					player.choosePlayerCard(trigger.target, 'hej', true);
					'step 1'
					if (result.bool) {
						trigger.target.recast(result.cards[0]);
						player.line(trigger.target, 'green');
						player.choosePlayerCard(player, 'hej', true);
					}
					'step 2'
					if (result.bool) {
						player.recast(result.cards[0]);
						if (lib.config.background_audio) {
							game.playlili('xiaohao1');
						}
						player.logSkill('gezi_kuangxiang', result.targets);
						if (!trigger.targets.contains(player)) {
							trigger.targets.remove(trigger.target);
							trigger.target = player;
							trigger.targets.push(player);
							player.line(trigger.player, 'green');
						}
					}
				},
				check: function (event, player) {
					var eff1 = get.effect(event.target, event.card, event.player, player);
					var eff2 = get.effect(player, event.card, event.player, player);
					if (eff1 >= 0) return false;
					if (event.target == player) return true;
					return eff2 > eff1;
				},
			},
			"gezi_bianshenmingzhi3": {
				unique: true,
				locked: true,
				silent: true,
				priority: 3.1,
				trigger: {
					global: "gameStart",
				},
				filter: function (event, player) {
					return _status.mingzhiBool == true && player.name == 'gezi_merlin' && game.me == player;
				},
				content: function () {
					'step 0'
					var controls = ['gezi_merlin', '梅露兰（明置）'];
					player.chooseControl(controls).set('ai', function () {
						return '梅露兰（明置）';
					}).set('prompt', "请选择目标人物");
					'step 1'
					if (result.control == '梅露兰（明置）') {
						if (lib.character.gezi_merlin) {
							lib.character.gezi_merlin[3] = ["gezi_remingguan", "gezi_kuangxiang", "gezi_hezou"];
						}
						player.removeSkill('gezi_mingguan');
						player.removeSkill('gezi_kuangxiang');
						player.removeSkill('gezi_hezou');
						player.addnSkill('gezi_remingguan');
						player.addnSkill('gezi_kuangxiang');
						player.addnSkill('gezi_hezou');
						player.update();
					}
				},
				forced: true,
				popup: false,
			},
			"gezi_remingguan": {
				global: ["gezi_remingguan_viewAs"],
				enable: "phaseUse",
				audio: "ext:东方project:2",
				usable: 1,
				filter: function (event, player) {
					return player.countCards('h');
				},
				filterCard: function (card, player) {
					if (player.storage.mingzhi) return !player.storage.mingzhi.contains(card);
					else return true;
				},
				check: function (card) {
					return get.value(card);
				},
				discard: false,
				lose: false,
				content: function (event, player) {
					if (lib.config.background_audio) {
						game.playlili('xiaohao1');
					}
					player.addShownCards(cards[0], 'visible_mingzhi');
					player.gainlili();
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							return 0.5;
						},
					},
				},
			},
			"gezi_remingguan_viewAs": {
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				viewAs: {
					name: "sha",
				},
				filter: function (event, player) {
					return game.hasPlayer(function (target) {
						return target.hasSkill('gezi_remingguan') && target.storage.mingzhi && get.distance(target, player, 'attack') <= 1;
					});
				},
				filterCard: function (card, player) {
					var players = game.filterPlayer();
					var list = [];
					for (var i = 0; i < players.length; i++) {
						if (players[i].hasSkill('gezi_remingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.mingzhi) {
							for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
						}
					}
					return list.contains(card.name);
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				mod: {
					cardEnabled: function (card, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_remingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.mingzhi) {
								for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
							}
						}
						if (card.name != 'sha' && list.contains(card.name) && _status.event.skill != 'gezi_remingguan_viewAs') return false;
					},
					cardUsable: function (card, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_remingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.mingzhi) {
								for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
							}
						}
						if (card.name != 'sha' && list.contains(card.name) && _status.event.skill != 'gezi_remingguan_viewAs') return false;
					},
					cardRespondable: function (card, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_remingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.mingzhi) {
								for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
							}
						}
						if (card.name != 'sha' && list.contains(card.name) && _status.event.skill != 'gezi_remingguan_viewAs') return false;
					},
					cardSavable: function (card, player) {
						var players = game.filterPlayer();
						var list = [];
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill('gezi_remingguan') && get.distance(players[i], player, 'attack') <= 1 && players[i].storage.mingzhi) {
								for (var j = 0; j < players[i].storage.mingzhi.length; j++) list.push(players[i].storage.mingzhi[j].name);
							}
						}
						if (card.name != 'sha' && list.contains(card.name) && _status.event.skill != 'gezi_remingguan_viewAs') return false;
					},
				},
				ai: {
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			//蓝
			"gezi_jiubian": {
				group: ["gezi_jiubian2", "gezi_jiubian3"],
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				hiddenCard: function (player, name) {
					return name == 'wuxie';
				},
				filter: function (event, player) {
					return player.countCards('h', {
						name: 'tao'
					});
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'trick') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player);
					},
					check: function (button) {
						var player = _status.event.player;
						var recover = 0,
							lose = 1,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (!players[i].isOut()) {
								if (get.attitude(player, players[i]) >= 0) recover++;
								if (get.attitude(player, players[i]) < 0) {
									if (players[i].hp == 1 && get.effect(players[i], {
										name: 'juedou'
									}, player, player)) return (button.link[2] == 'juedou') ? 2 : -1;
									lose++;
								}
							}
						}
						if (recover - 2 >= lose) return (button.link[2] == 'wugu') ? 2 : -1;
						return (button.link[2] == 'zengbing') ? 1 : -1;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return (card.name == 'tao');
							},
							position: 'h',
							selectCard: 1,
							audio: 2,
							popname: true,
							viewAs: {
								name: links[0][2]
							},
						}
					},
					prompt: function (links, player) {
						return '将一张【桃】当作【' + get.translation(links[0][2]) + '】使用';
					},
				},
				ai: {
					order: 1,
					result: {
						player: 0.5,
					},
				},
			},
			"gezi_jiubian2": {
				enable: "chooseToUse",
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return true;
				},
				filterCard: function (card) {
					return get.type(card) == 'trick';
				},
				position: "h",
				viewAs: {
					name: "tao",
				},
				prompt: "将一张普通锦囊牌当【桃】使用",
				check: function (card) {
					return 7 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						return player.countCards('h', {
							type: 'trick'
						}) && _status.currentPhase != player;
					},
					threaten: 1.3,
					save: true,
					respondTao: true,
					basic: {
						order: function (card, player) {
							if (player.hasSkillTag('pretao')) return 5;
							return 2;
						},
						useful: [8, 6.5, 5, 4],
						value: [8, 6.5, 5, 4],
					},
					result: {
						target: function (player, target) {
							// if(player==target&&player.hp<=0) return 2;
							var nd = player.needsToDiscard();
							var keep = false;
							if (nd <= 0) {
								keep = true;
							} else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
								keep = true;
							}
							var mode = get.mode();
							if (target.hp >= 2 && keep && target.hasFriend()) {
								if (target.hp > 2 || nd == 0) return 0;
								if (target.hp == 2) {
									if (game.hasPlayer(function (current) {
										if (target != current && get.attitude(target, current) >= 3) {
											if (current.hp <= 1) return true;
											if ((mode == 'identity' || mode == 'boss' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
										}
									})) {
										return 0;
									}
								}
							}
							if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
							var att = get.attitude(player, target);
							if (att < 3 && att >= 0 && player != target) return 0;
							var tri = _status.event.getTrigger();
							if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
								if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
									var num = game.countPlayer(function (current) {
										if (current.identity == 'fan') {
											return current.countCards('h', 'tao');
										}
									});
									if (num > 1 && player == target) return 2;
									return 0;
								}
							}
							if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
								if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
									return 0;
								}
							}
							if (mode == 'stone' && target.isMin() &&
								player != target && tri && tri.name == 'dying' && player.side == target.side &&
								tri.source != target.getEnemy()) {
								return 0;
							}
							return 2;
						},
					},
					tag: {
						recover: 1,
						save: 1,
					},
				},
			},
			"gezi_jiubian3": {
				trigger: {
					player: "useCard",
				},
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (event.targets.length > 1) return false;
					return event.skill == 'gezi_jiubian_backup' || event.skill == 'gezi_jiubian2';
				},
				content: function () {
					'step 0'
					player.chooseTarget('是否改变' + get.translation(trigger.card) + '的来源或目标？', function (card, player, target) {
						return target.canUse(trigger.card, trigger.targets[0]) || player.canUse(trigger.card, target);
					}).set('ai', function (target) {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool && result.targets.length) {
						event.target = trigger.targets[0];
						var list = [];
						if (result.targets[0].canUse(trigger.card, trigger.targets[0])) {
							list.push('来源');
						}
						if (player.canUse(trigger.card, result.targets[0])) {
							list.push('目标');
						}
						player.chooseControl(list, function () {
							return '来源';
						}).set('prompt', '令' + get.translation(result.targets[0]) + '成为' + get.translation(trigger.card) + '的：');
					}
					'step 2'
					if (result.bool && result.control) {
						if (result.control == '来源') {
							game.delay();
							trigger.untrigger();
							trigger.player = event.target;
							trigger.trigger('useCard');
							game.log(event.target, '成为了', trigger.card, '的使用者');
						} else if (result.control == '目标') {
							delete trigger.targets;
							trigger.targets = [event.target];
						}
					}
				},
				check: function (event, player) {
					return false;
				},
			},
			"gezi_shiqu": {
				audio: "ext:东方project:2",
				usable: 1,
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				filterCard: function (card) {
					return true;
				},
				selectCard: 1,
				position: "he",
				check: function (card) {
					// if (get.value(card) > 0) return 10;
					return get.value(card);
				},
				content: function () {
					'step 0'
					player.recast(cards[0]);
					player.gainlili();
					if (get.value(cards[0]) > 0) {
						player.chooseTarget('令一名角色从牌堆获得一张价值大于' + get.value(cards[0]) + '点的牌', 1, function (card, player, target) {
							return true;
						}).set('ai', function (target) {
							return att = get.attitude(_status.event.player, target);
						});
					}
					'step 1'
					if (result.targets) {
						var tao = get.cardPile2(function (card) {
							return get.value(card) > get.value(cards[0]);
						});
						if (tao) {
							result.targets[0].gain(tao, 'gain2');
						} else {
							player.say('牌堆中没有价值更高的牌了！')
						}
						if (result.targets[0].name == 'gezi_yukari') result.targets[0].say('蓝可真是不错呢，谢谢!');
						if (result.targets[0].name == 'gezi_chen') result.targets[0].say('谢谢你蓝大人！');
						if (result.targets[0] != player) {
							result.targets[0].addTempSkill('gezi_shiqu2', {
								player: 'phaseEnd'
							});
							player.addTempSkill('gezi_shiqu2', {
								player: 'phaseBegin'
							});
						}
					}
				},
				discard: false,
				lose: false,
				ai: {
					basic: {
						order: 1,
					},
					result: {
						player: 0.5,
					},
				},
			},
			"gezi_shiqu2": {
				mark: true,
				intro: {
					content: "式取（py）",
				},
				trigger: {
					player: "loseHpBegin",
				},
				direct: true,
				filter: function (event, player) {
					if (event.getParent().name == 'gezi_shiqu2') return false;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].hasSkill('gezi_shiqu2') && players[i] != player) return true;
					}
					return false;
				},
				content: function () {
					'step 0'
					player.chooseTarget('让对方帮你支付体力？', 1, function (card, player, target) {
						return target != player && target.hasSkill('gezi_shiqu2');
					}).set('ai', function (target) {
						return get.attitude(_status.event.player, target) && target.hp > _status.event.player.hp;
					});
					'step 1'
					if (result.bool && result.targets.length) {
						result.targets[0].removeSkill('gezi_shiqu2');
						player.line(result.targets[0], 'blue');
						result.targets[0].loseHp(trigger.num);
						result.targets[0].addTempSkill('gezi_shiqu2', {
							player: 'phaseBegin'
						});
						trigger.cancel();
					}
				},
			},
			"gezi_tianhugongzhu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_tianhugongzhu_1"],
				roundi: true,
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('令一名已受伤的其它角色与你一同回复一点体力', function (card, player, target) {
						return target != player && target.isDamaged();
					}).set('ai', function (target) {
						if (player.lili <= 1) return 0;
						return get.recoverEffect(target, player, player);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_tianhugongzhu', result.targets[0]);
						player.say("<符卡>天狐公主 -illusion-！");
						player.loselili();;
						player.Fuka();
						result.targets[0].recover();
						player.recover();
						result.targets[0].addTempSkill('gezi_tianhugongzhu_2', {
							player: "phaseEnd"
						});
					}
				},
			},
			"gezi_tianhugongzhu_1": {
			},
			"gezi_tianhugongzhu_2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "loseliliBegin",
				},
				filter: function (event, player) {
					return player.countCards('h') >= event.num;
				},
				content: function () {
					player.chooseToDiscard(trigger.num, 'h', true);
					trigger.cancel();
				},
				check: function (event, player) {
					return player.lili < 3;
				},
				"prompt2": "你可以弃置等量手牌，代替失去灵力。",
			},
			//妖梦
			"gezi_yishan": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					player: "useCardAfter",
				},
				usable: 1,
				filter: function (event, player) {
					return (event.card.name == 'sha');
				},
				content: function () {
					"step 0"
					player.chooseTarget('要【一闪】斩断哪个倒霉人？', function (card, player, target) {
						if (player == target) return false;
						return player.canUse({
							name: 'sha'
						}, target, false);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: 'sha'
						}, player, player);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_yishan', result.targets[0]);
						result.targets[0].draw();
						if (lib.config.background_audio) {
							game.playlili('slash');
						}
						if (result.targets[0].name == 'yuyuko') {
							player.say('幽幽子大人！不是叫您不要吃那个了吗！');
						}
						player.useCard({
							name: 'sha'
						}, result.targets[0], false);
						if (player.lili < player.maxlili && !player.node.fuka) {
							player.gainlili();
						} else {
							player.draw();
						}
					}
				},
			},
			"gezi_yinhuashan": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_yinhuashan2"],
				cost: 1,
				priority: 22,
				check: function (event, player) {
					if (player.lili > 2 && player.countCards('h', {
						name: 'sha'
					})) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_yinhuashan.cost;
				},
				content: function () {
					player.loselili(lib.skill.gezi_yinhuashan.cost);
					player.Fuka();
					player.say("<符卡>六根清净斩！");
				},
			},
			"gezi_yinhuashan2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return event.card.name == 'sha' && player.lili;
				},
				direct: true,
				content: function () {
					"step 0"
					var choice = ["重置一闪", "cancel2"];
					if (game.hasPlayer(function (target) {
						return target != player && player.canUse(trigger.card, target) && trigger.targets.contains(target) == false;
					})) {
						choice.push('extra_target');
					}
					player.chooseControl(choice).set('ai', function (event, player) {
						if (!player.hasSkill('gezi_yinhuashan3')) return 'cancel2';
						return '重置一闪';
					});
					"step 1"
					if (result.control) {
						if (result.control == "重置一闪") {
							player.loselili();
							player.logSkill("gezi_yinhuashan2");
							if (player.storage.counttrigger) player.storage.counttrigger['gezi_yishan']--;
						}
						if (result.control == "extra_target") {
							player.loselili();
							player.chooseTarget('选择【杀】的一名额外目标', function (card, player, target) {
								if (player == target) return false;
								var trigger = _status.event.getTrigger();
								return player.canUse(trigger.card, target) && trigger.targets.contains(target) == false;
							}).set('ai', function (target) {
								var trigger = _status.event.getTrigger();
								var player = _status.event.player;
								return get.effect(target, trigger.card, player, player) + 1;
							});
						}
						if (result.control == "cancel2") {
							player.addTempSkill('gezi_yinhuashan3');
						}
					}
					"step 2"
					if (result.bool) {
						game.log(result.targets[0], '成为了', trigger.card, '的额外目标');
						player.logSkill("gezi_yinhuashan2", result.targets[0]);
						trigger.targets.push(result.targets[0]);
					} else {
						event.finish();
					}
				},
			},
			"gezi_yinhuashan3": {
			},
			//紫
			"gezi_huanjing": {
				trigger: {
					global: "phaseZhunbeiBegin",
				},
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return player.countCards('he') && !game.dead.contains(event.player);
				},
				check: function (event, player) {
					if (player.countCards('he') < 3) return false;
					var card = ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1];
					if (!card) return false;
					var info = get.info(card);
					if (info.multitarget) return false;
					if (info.notarget) return false;
					if (player.canUse(card, event.player)) return get.effect(event.player, {
						name: card.name
					}, player, player) > 0;
					return false;
				},
				content: function () {
					'step 0'
					player.chooseToDiscard(true, 'he', get.prompt('gezi_huanjing')).ai = function () {
						return true;
					}
					'step 1'
					if (result.bool) {
						var current = _status.currentPhase;
						if (current.name == 'gezi_yuyuko' && player.name == 'gezi_yukari') current.say('紫，这次又想搞什么事了？');
						if (current.name == 'gezi_renko' && player.name == 'gezi_yukari') player.say('你这次可是跑到了个不该来的地方呢。');
						if (current.name == 'gezi_meribel' && player.name == 'gezi_yukari') current.say('紫你很烦啊，怎么又来了？');
						if (current.name == 'gezi_reimu' && player.name == 'gezi_yukari') player.say('啊，是你——');
						event.cards = [];
						event.cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length - 1]);
						player.showCards(event.cards[0]);
						var info = get.info(event.cards[0]);
						if (info.multitarget) {
							event.finish();
						}
						if (info.notarget) {
							event.finish();
						}
						if (get.type(event.cards[0]) != 'equip') {
							//if (!player.canUse(event.cards[0],current,false)) return false;
							if (!lib.filter.targetEnabled2(event.cards[0], player, current)) {
								player.discard(event.cards[0]);
							} else {
								player.useCard(event.cards[0], current, false);
							}
						} else if (get.type(event.cards[0]) == 'equip') {
							current.equip(event.cards[0]);
						}
					}
				},
			},
			"gezi_mengjie": {
				trigger: {
					player: "phaseUseBegin",
					target: "useCardToBegin",
				},
				audio: "ext:东方project:2",
				frequent: true,
				filter: function (event, player) {
					if (event.card) return get.tag(event.card, 'damage');
					else return true;
				},
				content: function (event, player) {
					"step 0"
					if (player.isUnderControl()) {
						game.modeSwapPlayer(player);
					}
					var cards = [];
					for (var i = 3; i > 0; i--) {
						if (ui.cardPile.childNodes.length < i) {
							var card = get.cards(i);
							//ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
						}
						cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length - i]);
					}
					event.cards = cards;
					var switchToAuto = function () {
						_status.imchoosing = false;
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
						var top = [];
						var stopped = false;
						var bottom;
						if (!stopped) {
							cards.sort(function (a, b) {
								return get.value(b, player) - get.value(a, player);
							});
							while (cards.length) {
								if (get.value(cards[0], player) <= 5) break;
								top.unshift(cards.shift());
							}
						}
						bottom = cards;
						for (var i = 0; i < top.length; i++) {
							ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
						}
						for (var i = 0; i < bottom.length; i++) {
							ui.cardPile.appendChild(bottom[i]);
						}
						player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
						game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
						game.delay(2);
					};
					var chooseButton = function (online, player, cards) {
						var event = _status.event;
						player = player || event.player;
						cards = cards || event.cards;
						event.top = [];
						event.bottom = [];
						event.status = true;
						event.dialog = ui.create.dialog('牌堆底的牌（底部从右到左）<br>按顺序选择置于牌堆顶的牌（先选择的在上）', cards);
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add('pointerdiv');
						}
						event.switchToAuto = function () {
							event._result = 'ai';
							event.dialog.close();
							event.control.close();
							_status.imchoosing = false;
						},
							event.control = ui.create.control('ok', 'pileTop', 'pileBottom', function (link) {
								var event = _status.event;
								if (link == 'ok') {
									if (online) {
										event._result = {
											top: [],
											bottom: []
										}
										for (var i = 0; i < event.top.length; i++) {
											event._result.top.push(event.top[i].link);
										}
										for (var i = 0; i < event.bottom.length; i++) {
											event._result.bottom.push(event.bottom[i].link);
										}
									} else {
										var i;
										for (i = 0; i < event.top.length; i++) {
											ui.cardPile.insertBefore(event.top[i].link, ui.cardPile.firstChild);
										}
										for (i = 0; i < event.bottom.length; i++) {
											ui.cardPile.appendChild(event.bottom[i].link);
										}
										for (i = 0; i < event.dialog.buttons.length; i++) {
											if (event.dialog.buttons[i].classList.contains('glow') == false &&
												event.dialog.buttons[i].classList.contains('target') == false)
												ui.cardPile.appendChild(event.dialog.buttons[i].link);
										}
										player.popup(get.cnNumber(event.top.length) + '上' + get.cnNumber(event.cards.length - event.top.length) + '下');
										game.log(player, '将' + get.cnNumber(event.top.length) + '张牌置于牌堆顶');
									}
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing = false;
								} else if (link == 'pileTop') {
									event.status = true;
									event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆顶的牌';
								} else {
									event.status = false;
									event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆底的牌';
								}
							})
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add('selectable');
						}
						event.custom.replace.button = function (link) {
							var event = _status.event;
							if (link.classList.contains('target')) {
								link.classList.remove('target');
								event.top.remove(link);
							} else if (link.classList.contains('glow')) {
								link.classList.remove('glow');
								event.bottom.remove(link);
							} else if (event.status) {
								link.classList.add('target');
								event.top.unshift(link);
							} else {
								link.classList.add('glow');
								event.bottom.push(link);
							}
						}
						event.custom.replace.window = function () {
							for (var i = 0; i < _status.event.dialog.buttons.length; i++) {
								_status.event.dialog.buttons[i].classList.remove('target');
								_status.event.dialog.buttons[i].classList.remove('glow');
								_status.event.top.length = 0;
								_status.event.bottom.length = 0;
							}
						}
						game.pause();
						game.countChoose();
					};
					event.switchToAuto = switchToAuto;

					if (event.isMine()) {
						chooseButton();
						event.goto(2);
					} else if (event.isOnline()) {
						event.player.send(chooseButton, true, event.player, event.cards);
						event.player.wait();
						game.pause();
					} else {
						event.switchToAuto();
						event.goto(2);
					}
					"step 1"
					if (event.result == 'ai' || !event.result) {
						event.switchToAuto();
					} else {
						var top = event.result.top || [];
						var bottom = event.result.bottom || [];
						for (var i = 0; i < top.length; i++) {
							ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
						}
						for (i = 0; i < bottom.length; i++) {
							ui.cardPile.appendChild(bottom[i]);
						}
						for (i = 0; i < event.cards.length; i++) {
							if (!top.contains(event.cards[i]) && !bottom.contains(event.cards[i])) {
								ui.cardPile.appendChild(event.cards[i]);
							}
						}
						player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(event.cards.length - top.length) + '下');
						game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
						game.delay(2);
					}
					"step 2"
					player.gainlili();
					if (player != _status.currentPhase) {
						player.draw();
					}
				},
			},
			"gezi_mengjing": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				priority: 22,
				spell: ["gezi_mengjing2"],
				roundi: true,
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.useSkill('gezi_mengjing2');
				},
				check: function (event, player) {
					return player.lili > 2 && player.hp >= 2 && player.countCards('h') > 2;
				},
			},
			"gezi_mengjing2": {
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget([1, 1], '选择一名角色一同与你进入幻想与现实的隙间中——', function (card, player, target) {
						return target != player;
					}, true).set('ai', function (target) {
						return -get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_mengjing2', result.targets);
						result.targets[0].addSkill('fengyin');
						result.targets[0].markSkillCharacter('gezi_shengbi', player, '梦境诅咒', '陷入梦境的诅咒');
						player.storage.gezi_mengjing = result.targets[0];
						var players = game.filterPlayer();
						players.remove(result.targets[0]);
						players.remove(player);
						for (var i = 0; i < players.length; i++) {
							players[i].addnSkill('teshuchuwai');
						}
					}
				},
				onremove: function (player) {
					player.storage.gezi_mengjing.removeSkill('fengyin');
					player.storage.gezi_mengjing.unmarkSkill('gezi_shengbi');
					var players = game.players;
					for (var i = 0; i < players.length; i++) {
						players[i].removeSkill('teshuchuwai');
					}
				},
			},
			//幽幽子
			"gezi_youdie": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseJieshuBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('he');
				},
				content: function () {
					'step 0'
					var nmax = 100000;
					var players = game.filterPlayer();
					var num = 0;
					players.remove(player);
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp <= 0) continue;
						if (players[i].hp < nmax) {
							nmax = players[i].hp;
						}
					}
					for (var i = 0; i < players.length; i++) {
						if (nmax > 1 && players[i].hp == nmax && get.attitude(player, players[i]) > 0) num -= 2;
						if (nmax == 1 && players[i].hp == nmax && get.attitude(player, players[i]) > 0) num--;
						if (nmax > 1 && players[i].hp == nmax && get.attitude(player, players[i]) <= 0) num++;
						if (nmax == 1 && players[i].hp == nmax && get.attitude(player, players[i]) <= 0) num += 2;
					}
					player.chooseToDiscard(get.prompt('gezi_youdie'), get.translation('gezi_youdie_info'), 'he').set('ai', function (card) {
						if (num > 0) return 8 - get.value(card);
						return 0;
					}).set('num', num);
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_youdie');
						player.useSkill('gezi_youdie2');
					}
				},
				ai: {
					threaten: 1.2,
				},
			},
			"gezi_youdie2": {
				direct: true,
				content: function () {
					var nmax = 100000;
					var targets = [];
					var players = game.filterPlayer();
					players.remove(player);
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp <= 0) continue;
						var nh2 = players[i].hp;
						if (nh2 < nmax) {
							nmax = nh2;
							targets.length = 0;
							targets.push(players[i]);
						} else if (nh2 == nmax) {
							targets.push(players[i]);
						}
					}
					player.line(targets, 'pink');
					player.gainlili();
					for (var j = 0; j < targets.length; j++) {
						targets[j].loseHp();
					}
				},
			},
			"gezi_moyin": {
				trigger: {
					global: "dyingBegin",
				},
				priority: 15,
				audio: "ext:东方project:2",
				derivation: "gezi_youdie",
				filter: function (event, player) {
					return true;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget('让一些人摸一张牌，然后你可以发动一次【幽蝶】', [1, player.maxHp - player.hp + 1], function (card, player, target) {
						return true;
					}, function (target) {
						if (target == player) return 100;
						return get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_moyin', result.targets);
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2"
					for (var i = 0; i < event.targets.length; i++) {
						event.targets[i].draw();
					}
					if (player.hasSkill('gezi_moyin4')) {
						event.finish();
					}
					"step 3"
					var nmax = 100000;
					var players = game.filterPlayer();
					var num = 0;
					players.remove(player);
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp <= 0) continue;
						if (players[i].hp < nmax) {
							nmax = players[i].hp;
						}
					}
					for (var i = 0; i < players.length; i++) {
						if (nmax > 1 && players[i].hp == nmax && get.attitude(player, players[i]) > 0) num -= 2;
						if (nmax == 1 && players[i].hp == nmax && get.attitude(player, players[i]) > 0) num--;
						if (nmax > 1 && players[i].hp == nmax && get.attitude(player, players[i]) <= 0) num++;
						if (nmax == 1 && players[i].hp == nmax && get.attitude(player, players[i]) <= 0) num += 2;
					}
					player.chooseToDiscard(get.prompt('gezi_youdie'), get.translation('gezi_youdie_info'), 'he').set('ai', function (card) {
						if (num > 0) return 8 - get.value(card);
						return 0;
					}).set('num', num);
					"step 4"
					if (result.bool) {
						player.addTempSkill('gezi_moyin4');
						player.useSkill('gezi_youdie2');
					}
				},
				ai: {
					threaten: 1.2,
				},
			},
			"gezi_moyin2": {
				trigger: {
					global: "recoverBegin",
				},
				mark: true,
				forced: true,
				group: "gezi_moyin3",
				intro: {
					content: "防止所有回复",
				},
				filter: function (event, player) {
					return event.source == player;
				},
				content: function () {
					game.log('墨樱：', player, '的回复无效');
					trigger.num = 0;
					trigger.cancel();
					trigger.finish();
				},
				ai: {
					effect: function (card, player) {
						if (get.tag(card, 'recover')) {
							return 0;
						}
					},
				},
			},
			"gezi_moyin3": {
				trigger: {
					global: "dyingAfter",
				},
				forced: true,
				silent: true,
				content: function () {
					player.removeSkill('gezi_moyin2');
				},
				popup: false,
			},
			"gezi_moyin4": {
			},
			"gezi_fanhundie": {
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_fanhundie2"],
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
				},
				check: function (event, player) {
					if (player.lili <= 3) return false;
					return game.countPlayer(function (current) {
						return current.countCards('h') == 1 && get.attitude(player, current) <= 0;
					}) || player.maxHp - player.hp >= 2;
				},
			},
			"gezi_fanhundie_die": {
				audio: "ext:东方project:4",
				enable: "chooseToUse",
				group: "gezi_fanhundie",
				spell: ["gezi_fanhundie2"],
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (event.type != 'dying') return false;
					if (player != event.dying) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					if (!player.node.fuka) player.Fuka();
				},
				check: function () {
					return player.lili > 1;
				},
				ai: {
					order: 1,
					skillTagFilter: function (player) {
						if (player.hp > 0) return false;
						return true;
					},
					save: true,
					result: {
						player: function (player) {
							if (player.hp <= 0) return 10;
							return 0;
						},
					},
					threaten: function (player, target) {
						return 0.6;
					},
				},
			},
			"gezi_fanhundie2": {
				trigger: {
					global: "phaseEnd",
				},
				init: function (player) {
					player.nodying = true;
					player.update();
				},
				onremove: function (player) {
					delete player.nodying;
					if (player.hp <= 0) {
						player.dying({});
					}
					player.update();
				},
				filter: function (event, player) {
					return true;
				},
				direct: true,
				content: function () {
					"step 0"
					event.num = player.maxHp - player.hp;
					"step 1"
					player.chooseTarget('反魂：弃置一名角色一张牌', 1, function (card, player, target) {
						return target.countCards('he');
					}, function (target) {
						if (target.countCards('h') == 1 && get.attitude(player, target) < 0) return 10;
						return -get.attitude(player, target);
					});
					"step 2"
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill('gezi_fanhundie_die', result.targets[0]);
						player.choosePlayerCard(event.target, 'he', true).set('ai', function (card) {
							if (event.target.countCards('h') == 1) return get.position(card) == 'h';
							return;
						});
					}
					"step 3"
					if (result.links) {
						var num = event.target.countCards('h');
						event.target.discard(result.links);
						if (num == 1) event.target.loseHp();
					}
					"step 4"
					if (event.num > 1 && player.lili) {
						event.num--;
						player.loselili();
						event.goto(1);
					}
				},
				ai: {
					order: 4,
					result: {
						target: -1,
					},
				},
			},
			/*-------------------永夜-------------------*/
			//永琳
			"gezi_zhaixing": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				group: ["gezi_zhaixing_mark", "gezi_zhaixing_remove"],
				filter: function (event, player) {
					return player.storage.gezi_zhaixing.length;
				},
				intro: {
					content: function (storage, player) {
						var str = '';
						for (var i = 0; i < player.storage.gezi_zhaixing.length; i++) {
							str += get.translation(player.storage.gezi_zhaixing[i]) + ',';
						}
						return str;
					},
				},
				content: function () {
					'step 0'
					player.chooseControl(['观看牌堆顶', '观看技能牌'], true).set('ai', function (event, player) {
						if (player.storage.gezi_zhaixing.length > 2) return '观看牌堆顶';
						return '观看技能牌';
					});
					'step 1'
					if (result.control) {
						var cards = [];
						if (result.control == '观看牌堆顶') {
							cards = get.cards(player.storage.gezi_zhaixing.length);
							event.cards = cards;
							player.chooseCardButton(cards, '可以选择一张牌交给一名角色', 1).set('ai', function (button) {
								return get.value(button);
							});
						} else if (result.control == '观看技能牌') {
							player.useSkill('gezi_jinengpai_zhanshi')
							event.finish();
						}
					}
					'step 2'
					if (result.links && result.links.length) {
						event.card = result.links;
						player.chooseTarget('将' + get.translation(result.links) + '交给一名角色').set('ai', function (target) {
							return get.attitude(_status.event.player, target);
						});
					}
					'step 3'
					if (result.targets && result.targets.length) {
						if (result.targets[0].name == 'gezi_kaguya')
							result.targets[0].say('啊，还真摘了颗星星来啊，谢谢永琳！');
						player.line(result.targets[0], 'red');
						result.targets[0].gain(event.card);
						event.cards.remove(event.card);
					}
					'step 4'
					if (!event.cards.length) event.finish();
					if (event.cards.length) {
						if (player.isUnderControl()) {
							game.modeSwapPlayer(player);
						}
						var cards = event.cards;
						var switchToAuto = function () {
							_status.imchoosing = false;
							if (event.dialog) event.dialog.close();
							if (event.control) event.control.close();
							var top = [];
							var bottom;
							var stopped = false;
							if (!stopped) {
								cards.sort(function (a, b) {
									return get.value(b, player) - get.value(a, player);
								});
								while (cards.length) {
									if (get.value(cards[0], player) <= 5) break;
									top.unshift(cards.shift());
								}
							}
							bottom = cards;
							for (var i = 0; i < top.length; i++) {
								ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
							}
							for (i = 0; i < bottom.length; i++) {
								ui.cardPile.appendChild(bottom[i]);
							}
							player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
							game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
							game.delay(2);
						};
						var chooseButton = function (online, player, cards) {
							var event = _status.event;
							player = player || event.player;
							cards = cards || event.cards;
							event.top = [];
							event.bottom = [];
							event.status = true;
							event.dialog = ui.create.dialog('按顺序选择置于牌堆顶的牌（先选择的在上）', cards);
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add('pointerdiv');
							}
							event.switchToAuto = function () {
								event._result = 'ai';
								event.dialog.close();
								event.control.close();
								_status.imchoosing = false;
							},
								event.control = ui.create.control('ok', 'pileTop', 'pileBottom', function (link) {
									var event = _status.event;
									if (link == 'ok') {
										if (online) {
											event._result = {
												top: [],
												bottom: []
											}
											for (var i = 0; i < event.top.length; i++) {
												event._result.top.push(event.top[i].link);
											}
											for (var i = 0; i < event.bottom.length; i++) {
												event._result.bottom.push(event.bottom[i].link);
											}
										} else {
											var i;
											for (i = 0; i < event.top.length; i++) {
												ui.cardPile.insertBefore(event.top[i].link, ui.cardPile.firstChild);
											}
											for (i = 0; i < event.bottom.length; i++) {
												ui.cardPile.appendChild(event.bottom[i].link);
											}
											for (i = 0; i < event.dialog.buttons.length; i++) {
												if (event.dialog.buttons[i].classList.contains('glow') == false &&
													event.dialog.buttons[i].classList.contains('target') == false)
													ui.cardPile.appendChild(event.dialog.buttons[i].link);
											}
											player.popup(get.cnNumber(event.top.length) + '上' + get.cnNumber(event.cards.length - event.top.length) + '下');
											game.log(player, '将' + get.cnNumber(event.top.length) + '张牌置于牌堆顶');
										}
										event.dialog.close();
										event.control.close();
										game.resume();
										_status.imchoosing = false;
									} else if (link == 'pileTop') {
										event.status = true;
										event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆顶的牌';
									} else {
										event.status = false;
										event.dialog.content.childNodes[0].innerHTML = '按顺序选择置于牌堆底的牌';
									}
								})
							for (var i = 0; i < event.dialog.buttons.length; i++) {
								event.dialog.buttons[i].classList.add('selectable');
							}
							event.custom.replace.button = function (link) {
								var event = _status.event;
								if (link.classList.contains('target')) {
									link.classList.remove('target');
									event.top.remove(link);
								} else if (link.classList.contains('glow')) {
									link.classList.remove('glow');
									event.bottom.remove(link);
								} else if (event.status) {
									link.classList.add('target');
									event.top.unshift(link);
								} else {
									link.classList.add('glow');
									event.bottom.push(link);
								}
							}
							event.custom.replace.window = function () {
								for (var i = 0; i < _status.event.dialog.buttons.length; i++) {
									_status.event.dialog.buttons[i].classList.remove('target');
									_status.event.dialog.buttons[i].classList.remove('glow');
									_status.event.top.length = 0;
									_status.event.bottom.length = 0;
								}
							}
							game.pause();
							game.countChoose();
						};
						event.switchToAuto = switchToAuto;

						if (event.isMine()) {
							chooseButton();
							event.finish();
						} else if (event.isOnline()) {
							event.player.send(chooseButton, true, event.player, event.cards);
							event.player.wait();
							game.pause();
						} else {
							event.switchToAuto();
							event.finish();
						}
					}
					'step 5'
					if (!event.cards.length) event.finish();
					if (event.result == 'ai' || !event.result) {
						event.switchToAuto();
					} else {
						var top = event.result.top || [];
						var bottom = event.result.bottom || [];
						for (var i = 0; i < top.length; i++) {
							if (get.type(top[i]) == 'basic') {
								ui.discardPile.insertBefore(top[i], ui.discardPile.firstChild);
							} else {
								ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
							}
						}
						for (i = 0; i < bottom.length; i++) {
							if (get.type(bottom[i]) == 'basic') {
								ui.discardPile.appendChild(bottom[i]);
							} else {
								ui.cardPile.appendChild(bottom[i]);
							}
						}
						for (i = 0; i < event.cards.length; i++) {
							if (!top.contains(event.cards[i]) && !bottom.contains(event.cards[i])) {
								if (get.type(event.cards[i]) == 'basic') {
									ui.discardPile.appendChild(event.cards[i]);
								} else {
									ui.cardPile.appendChild(event.cards[i]);
								}
							}
						}
						player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(event.cards.length - top.length) + '下');
						game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
						game.delay(2);
					}
				},
			},
			"gezi_zhaixing_mark": {
				direct: true,
				popup: false,
				trigger: {
					player: "useCard",
				},
				init: function (player) {
					player.storage.gezi_zhaixing = [];
				},
				priority: 2,
				filter: function (event, player) {
					return _status.currentPhase == player;
				},
				content: function () {
					if (!player.storage.gezi_zhaixing.contains(get.suit(trigger.card))) {
						player.storage.gezi_zhaixing.push(get.suit(trigger.card));
						player.gainlili();
					}
					player.markSkill('gezi_zhaixing');
					player.syncStorage('gezi_zhaixing');
				},
			},
			"gezi_zhaixing_remove": {
				direct: true,
				popup: false,
				trigger: {
					player: "phaseAfter",
				},
				content: function () {
					player.storage.gezi_zhaixing = [];
					player.unmarkSkill('gezi_zhaixing');
				},
			},
			"gezi_lanyue": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					var players = game.filterPlayer();
					var length = 0;
					for (var i = 0; i < players.length; i++) {
						if (get.distance(player, players[i], 'attack') > 1) players.remove(players[i]);
						else if (get.distance(player, players[i]) > length) length = get.distance(player, players[i]);
					}
					return players.contains(target) && get.distance(player, target) == length;
				},
				content: function () {
					"step 0"
					if (target.name == 'gezi_kaguya')
						target.say('即使是我也逃不过永琳的手掌心w');
					var list = [];
					if (target.hp != player.hp) list.push('体力');
					if (target.countCards('he') != player.countCards('he')) list.push('牌数');
					if (list.length == 0) {
						event.finish();
					}
					// 选择枝AI
					var choice;
					if (player.countCards('he') == target.countCards('he')) choice = '体力';
					if (player.hp == target.hp) choice = '牌数';
					if (player.hp < target.hp) {
						if (player.countCards('he') > target.countCards('he')) choice = '牌数';
						if (player.countCards('he') < target.countCards('he')) {
							if ((target.countCards('he') - player.countCards('he')) / 2 > (target.hp - player.hp)) {
								choice = '体力';
							} else {
								choice = '牌数';
							}
						}
					}
					if (player.hp > target.hp) {
						if (player.countCards('he') < target.countCards('he')) choice = '体力';
						if (player.countCards('he') > target.countCards('he')) {
							if ((player.countCards('he') - target.countCards('he')) / 2 > (player.hp - target.hp)) {
								choice = '牌数';
							} else {
								choice = '体力';
							}
						}
					}
					target.chooseControl(list, function () {
						return _status.event.choice;
					}, true).set('choice', choice);

					"step 1"
					if (result.control) {
						if (result.control == '体力') {
							game.log(target, '的体力调整为' + player.hp);
							if (target.hp < player.hp) {
								target.recover(player.hp - target.hp);
							} else if (target.hp > player.hp) {
								target.loseHp(target.hp - player.hp);
							}
						} else if (result.control == '牌数') {
							game.log(target, '的牌数调整为' + player.countCards('he'));
							if (target.countCards('he') < player.countCards('he')) {
								target.draw(player.countCards('he') - target.countCards('he'));
							} else if (target.countCards('he') > player.countCards('he')) {
								target.chooseToDiscard(target.countCards('he') - player.countCards('he'), true);
							}
						}
					}
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							var num = 0;
							if (player.hp == target.hp && player.countCards('he') == target.countCards('he')) num += 2;
							if (player.hp < target.hp && player.countCards('he') == target.countCards('he')) num -= 2;
							if (player.hp == target.hp && player.countCards('he') < target.countCards('he')) num -= 2;
							if (player.hp < target.hp && player.countCards('he') < target.countCards('he')) num -= 2;
							if (num == 2) return 0;
							else if (num == -2) return -1;
							else return 2;
						},
					},
					threaten: 1.5,
				},
			},
			"gezi_tianwen": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseBegin"],
				},
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili;
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i = 1; i < player.lili; i++) {
						list.push(i);
					}
					//这里AI还没写
					var choice = 1;
					player.chooseControl(list, function () {
						return choice;
					}).set('prompt', '消耗任意点灵力').set('choice', choice);
					'step 1'
					if (result.control) {
						player.loselili(result.control);
						player.storage.gezi_tianwen = result.control;
						player.say('符卡【天文密葬法】！');
						player.useSkill('gezi_tianwen_skill');
					}
				},
				check: function (event, player) {
					return player.lili > 3;
				},
			},
			"gezi_tianwen_skill": {
				spell: ["gezi_tianwen_use"],
				direct: true,
				content: function () {
					'step 0'
					player.Fuka();
					var num = player.storage.gezi_tianwen * 2;
					player.chooseCardButton(num, true, get.cards(num), '按顺序将卡牌置于牌堆顶（先选择的在上）').set('ai', function (button) {
						return get.value(button.link);
					});
					'step 1'
					if (result.bool) {
						player.storage.gezi_tianwen = [];
						var list = result.links.slice(0);
						while (list.length) {
							ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
						}
					}
					'step 2'
					player.judge();
					'step 3'
					player.storage.gezi_tianwen.push(result.card);
					if (player.storage.gezi_tianwen.length == 1) event.goto(2);
					'step 4'
					player.chooseCardButton(player.storage.gezi_tianwen, '天文密葬法：获得一张判定牌，该牌效果视为另一张牌的效果，直到回合结束', true).set('ai', function (button) {
						return get.value(button.link);
					});
					'step 5'
					if (result.bool) {
						player.gain(result.links[0]);
						player.$gain2(result.links[0]);
						player.storage.gezi_tianwen.remove(result.links[0]);
						player.storage.gezi_tianwen_use = player.storage.gezi_tianwen[0];
						player.storage.gezi_tianwen = result.links[0];
					}
				},
			},
			"gezi_tianwen_use": {
				direct: true,
				trigger: {
					player: "useCard",
				},
				init: function (player) {
					player.storage.gezi_tianwen_use = [];
				},
				intro: {
					content: "cards",
				},
				mark: true,
				filter: function (event, player) {
					if (player.hasSkill('gezi_tianwen_nodo')) return false;
					if (event.parent.name == 'gezi_tianwen_use') return false;
					return event.card == player.storage.gezi_tianwen;
				},
				onremove: function (player) {
					delete player.storage.gezi_tianwen;
					delete player.storage.gezi_tianwen_use;
				},
				content: function () {
					'step 0'
					var card = game.createCard({
						name: player.storage.gezi_tianwen_use.name
					}, trigger.card.suit, trigger.card.number);
					card.destroyed = true;
					if (!trigger.targets) {
						event.finish();
					}
					if (card.name == 'jiedao' || card.name == 'shengdong' || card.name == 'geanguanhuo') {
						event.finish();
					}
					event.card = card;
					'step 1'
					var eff = 0;
					for (var i = 0; i < trigger.targets.length; i++) {
						if (!player.canUse(card, trigger.targets[i], false, false)) {
							event.finish();
						} else {
							eff += get.effect(trigger.targets[i], card, player, player);
						}
					}
					player.chooseBool('是否将' + get.translation(player.storage.gezi_tianwen.name) + '当作' + get.translation(card) + '使用').set('ai', function () {
						if (_status.event.eff > 0) return 1;
						return 0;
					}).set('eff', eff);
					'step 2'
					if (result.bool) {
						for (var i = 0; i < trigger.targets.length; i++) {
							if (player.canUse(card, trigger.targets[i], false, false)) {
								trigger.cancel();
								player.useCard(card, trigger.targets[i], false, false);
								if (!player.hasSkill('gezi_tianwen_nodo')) {
									player.addTempSkill('gezi_tianwen_nodo');
								}
							}
						}
					}
				},
			},
			"gezi_tianwen_nodo": {
			},
			//辉夜
			"gezi_nanti": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				selectTarget: 1,
				position: "he",
				filterCard: function () {
					return true;
				},
				selectCard: [1, Infinity],
				discard: false,
				lose: false,
				filterTarget: function (card, player, target) {
					return player != target;
				},
				content: function () {
					'step 0'
					player.showCards(cards);
					player.chooseControl('牌名长度', '花色', '点数', '种类', '颜色', function () {
						var list = ['牌名长度', '种类', '颜色'];
						list.randomSort();
						return list[0];
					}, true);
					'step 1'
					if (result.control) {
						game.log(player, '选择了' + result.control);
						var valid = [];
						for (var i in cards) {
							switch (result.control) {
								case '牌名长度':
									valid.push(get.translation(cards[i].name).length);
									break;
								case '花色':
									valid.push(get.suit(cards[i]));
									break;
								case '点数':
									valid.push(get.number(cards[i]));
									break;
								case '种类':
									valid.push(get.type(cards[i]));
									break;
								case '颜色':
									valid.push(get.color(cards[i]));
									break;
							}
						}
						if (targets[0].name == 'gezi_eirin')
							player.say('啊，这种东西对于永琳来说只是小儿科对吧~');
						targets[0].chooseCard('是否交给' + get.translation(player) + '一张与' + get.translation(result.cards) + '不同' + result.control + '的牌？', 'he', function (card) {
							switch (result.control) {
								case '牌名长度':
									return !valid.contains(get.translation(card.name).length);
									break;
								case '花色':
									return !valid.contains(get.suit(card));
									break;
								case '点数':
									return !valid.contains(get.number(card));
									break;
								case '种类':
									return !valid.contains(get.type(card));
									break;
								case '颜色':
									return !valid.contains(get.color(card));
									break;
							}
						}).set('ai', function (card) {
							return 5 - get.value(card);
						});
					} else {
						event.finish();
					}
					'step 2'
					if (result.bool) {
						targets[0].showCards(result.cards);
						game.log(targets[0], '成功回答了难题！');
						player.gain(result.cards);
						targets[0].$give(result.cards, player);
						player.lose(cards);
						player.$throw(cards, 1000);
					} else {
						game.log(targets[0], '没有回答出难题。');
						targets[0].damage('thunder');
						player.choosePlayerCard(targets[0], 'he', (Math.min(targets[0].countCards('he'), cards.length)), '重铸没有回答出难题的角色的牌', true);
					}
					'step 3'
					if (result.bool && result.links.length) {
						game.log(targets[0], '重铸了', result.links);
						targets[0].recast(result.links);
					}
				},
				check: function (card) {
					if (ui.selected.cards.length < 1) return 7 - get.value(card);
					return -0.1;
				},
				ai: {
					order: 4,
					expose: 0.2,
					result: {
						target: -1,
						player: function (player, target) {
							return 0;
						},
					},
				},
			},
			"gezi_poxiao": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				filter: function (event, player) {
					return player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					var suits = [];
					var cards = player.getCards('he');
					for (var i = 0; i < cards.length; i++) {
						if (get.suit(cards[i]) && !suits.contains(get.suit(cards[i]))) suits.push(get.suit(cards[i]))
					}
					player.chooseCard('he', [1, player.countCards('he')], '破晓：可以重铸任意张牌', true).set('ai', function (card) {
						if (suits.length == 4) {
							var suit = get.suit(card);
							for (var i = 0; i < ui.selected.cards.length; i++) {
								if (get.suit(ui.selected.cards[i]) == suit) return false;
							}
							return true;
						}
						return 7 - get.value(card);
					});
					'step 1'
					if (result.bool && result.cards.length) {
						var suits = [];
						for (var i = 0; i < result.cards.length; i++) {
							if (get.suit(result.cards[i]) && !suits.contains(get.suit(result.cards[i]))) suits.push(get.suit(result.cards[i]))
						}
						player.recast(result.cards);
						player.logSkill('gezi_poxiao', player);
						player.gainlili();
						if (suits.length == 4) {
							player.gainlili();
							player.insertPhase();
						}
					}
				},
			},
			"gezi_yongye": {
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_yongye1"],
				infinite: true,
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				check: function () {
					return false;
				},
				content: function () {
					player.loselili();
					player.say('【符卡】永夜归返！');
					player.Fuka();
				},
			},
			"gezi_yongye_die": {
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				group: "gezi_yongye",
				spell: ["gezi_yongye1"],
				infinite: true,
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (event.type != 'dying') return false;
					if (player != event.dying) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.say('【符卡】永夜归返！');
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > 1;
				},
				ai: {
					order: 1,
					skillTagFilter: function (player) {
						if (player.hp > 0) return false;
					},
					save: true,
					result: {
						player: function (player) {
							if (player.hp <= 0) return 10;
							return 0;
						},
					},
					threaten: function (player, target) {
						return 0.6;
					},
				},
			},
			"gezi_yongye1": {
				direct: true,
				trigger: {
					player: ["phaseEnd"],
				},
				group: ["gezi_yongye2", "gezi_yongye3", "gezi_yongye4", "gezi_yongye5"],
				init: function (player) {
					player.nodying = true;
					player.update();
				},
				priority: 2,
				onremove: function (player) {
					delete player.nodying;
				},
				content: function () {
					player.loselili();
				},
			},
			"gezi_yongye2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseUseBegin",
				},
				filter: function (event, player) {
					return player.lili <= 3 && player.countCards('he');
				},
				content: function () {
					var cards = player.getCards('he');
					player.recast(cards);
				},
				prompt: "是否重铸所有牌？",
				check: function (event, player) {
					return !player.countCards('e');
				},
			},
			"gezi_yongye3": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili <= 2;
				},
				content: function () {
					player.draw(2);
				},
			},
			"gezi_yongye4": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return player.lili <= 1;
				},
				content: function () {
					player.draw();
				},
			},
			"gezi_yongye5": {
				audio: "ext:东方project:2",
				trigger: {
					player: "changeHp",
				},
				filter: function (event, player) {
					return player.hp <= 0 && event.num < 0 && player.lili;
				},
				priority: -15,
				locked: true,
				forced: true,
				silent: true,
				nopop: true,
				content: function (player) {
					var nm = -trigger.num;
					if (player.lili > nm) {
						player.loselili(nm);
					} else {
						player.loselili(player.lili);
					}
				},
				ai: {
					mingzhi: true,
				},
				popup: false,
			},
			//慧音
			"gezi_jiehuo": {
				trigger: {
					player: ["useCardAfter", "respondAfter"],
				},
				usable: 1,
				audio: "ext:东方project:2",
				filter: function (event, player) {
					var i = event;
					var use = false;
					while (i.name != 'phaseLoop') {
						if (i.name == 'phaseUse') {
							use = true;
							break;
						} else {
							i = i.parent;
						}
					}
					if (!use) return false;
					var card = event.card;
					if (!get.position(card) && card.cards && card.cards.length >= 1) {
						card = card.cards[0];
					}
					return (get.position(card) == 'd' && get.itemtype(card) == 'card');
				},
				content: function () {
					'step 0'
					event.card = trigger.card;
					if (!get.position(event.card) && event.card.cards && event.card.cards.length >= 1) {
						event.card = trigger.card.cards;
					}
					player.chooseTarget('将' + get.translation(event.card) + '交给一名角色', true, function (card, player, target) {
						return true;
					}).set('ai', function (target) {
						if (get.value(event.card) < 0) return -get.attitude(player, target);
						return get.attitude(player, target);
					});
					'step 1'
					if (result.targets) {
						if (result.targets[0].name == 'gezi_mokou') {
							player.say('妹红辛苦了，不要忘记休息啊。');
						}
						player.gainlili();
						player.line(result.targets[0], 'blue');
						result.targets[0].gain(event.card);
						result.targets[0].$gain2(event.card);
					}
				},
				check: function (event, player) {
					return get.value(event.card);
				},
			},
			"gezi_richuguo": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				init: function (player) {
					if (!player.storage.gezi_richuguo) player.storage.gezi_richuguo = false;
				},
				roundi: true,
				spell: ["gezi_richuguo2"],
				mark: true,
				unique: true,
				intro: {
					content: "日出国的天子",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (player.storage.gezi_richuguo) return false;
					var types = [];
					var cards = player.getCards('he');
					for (var i = 0; i < cards.length; i++) {
						if (get.type(cards[i]) && !types.contains(get.type(cards[i]))) types.push(get.type(cards[i]))
					}
					return (player.lili > 3) || (types.length >= 3);
				},
				content: function () {
					'step 0'
					event.list = [];
					player.storage.gezi_qipai = [];
					'step 1'
					player.chooseCard('he', function (card) {
						return !player.storage.gezi_qipai.contains(get.type(card));
					}, '弃置3张不同种类的牌，或消耗3点灵力。');
					'step 2'
					if (result.bool) {
						event.list.push(result.cards[0]);
						player.storage.gezi_qipai.push(get.type(result.cards[0]));
						if (player.storage.gezi_qipai.length < 3) {
							event.goto(1);
						} else {
							player.discard(event.list);
							event.bool = true;
							delete player.storage.gezi_qipai;
						}
					} else {
						if (player.lili > 2) {
							player.loselili(3);
							event.bool = true;
						}
					}
					'step 3'
					if (event.bool) {
						player.awakenSkill('gezi_richuguo');
						player.chooseTarget([1, 1], '选择一名角色，重置其体力值，灵力值，将手牌补至四张', true, function (card, player, target) {
							return true;
						}).ai = function (target) {
							return get.recoverEffect(target, player, player);
						}
					}
					'step 4'
					if (result.targets) {
						player.line(result.targets[0], 'green');
						player.Fuka();
						player.say('「日出国之天子」！');
						result.targets[0].recover(result.targets[0].maxHp - result.targets[0].hp);
						if (player.node.lili) {
							player.lili = 3;
							player.updatelili();
							game.log(player, '灵力调整为3');
						}
						if (result.targets[0].countCards('h') < 4) {
							result.targets[0].draw(4 - result.targets[0].countCards('h'));
						}
					}
				},
				check: function (event, player) {
					var players = game.filterPlayer();
					var t = false;
					for (var i = 0; i < players.length; i++) {
						if (get.recoverEffect(players[i], player, player) > 0 && (players[i].hp < 2 || players[i].Maxhp - players[i].hp >= 2)) {
							t = true;
						}
					}
					return t;
				},
			},
			"gezi_richuguo2": {
				trigger: {
					player: "dying",
				},
				forced: true,
				filter: function (event, player) {
					return player.storage.gezi_richuguo == true;
				},
				content: function () {
					player.storage.gezi_richuguo = false;
					player.restoreSkill('gezi_richuguo');
				},
			},
			//妹红
			"gezi_yuhuo": {
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				subSkill: {
					clear: {
						trigger: {
							player: "phaseAfter",
						},
						silent: true,
						content: function () {
							delete player.storage.gezi_yuhuo;
						},
						sub: true,
						forced: true,
						popup: false,
					},
					count: {
						trigger: {
							player: "shaBegin",
						},
						silent: true,
						content: function () {
							if (!player.storage.gezi_yuhuo) player.storage.gezi_yuhuo = [get.suit(trigger.card)];
							else player.storage.gezi_yuhuo.push(get.suit(trigger.card));
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
				group: ["gezi_yuhuo_clear", "gezi_yuhuo_count", "gezi_yuhuo_2"],
				filter: function (event, player) {
					if (player.isHealthy()) return false;
					if (player.storage.counttrigger && player.storage.counttrigger['gezi_yuhuo'] && player.storage.counttrigger['gezi_yuhuo'] >= (player.maxHp - player.hp)) return false;
					return true;
				},
				filterCard: function (card, player) {
					if (!player.storage.gezi_yuhuo) return true;
					return (!player.storage.gezi_yuhuo.contains(get.suit(card)));
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				onuse: function (event, player) {
					if (!player.storage.counttrigger) {
						player.addSkill('counttrigger');
						player.storage.counttrigger = {};
					}
					if (!player.storage.counttrigger['gezi_yuhuo']) {
						player.storage.counttrigger['gezi_yuhuo'] = 1;
					} else {
						player.storage.counttrigger['gezi_yuhuo']++;
					}
				},
				onrespond: function (event, player) {
					if (!player.storage.counttrigger) {
						player.addSkill('counttrigger');
						player.storage.counttrigger = {};
					}
					if (!player.storage.counttrigger['gezi_yuhuo']) {
						player.storage.counttrigger['gezi_yuhuo'] = 1;
					} else {
						player.storage.counttrigger['gezi_yuhuo']++;
					}
				},
				prompt: "将一张牌当【杀】使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						if (player.isHealthy()) return false;
						if (player.storage.counttrigger && player.storage.counttrigger['gezi_yuhuo'] && player.storage.counttrigger['gezi_yuhuo'] >= (player.maxHp - player.hp)) return false;
						return player.countCards('he');
					},
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 5;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_yuhuo_2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "shaBefore",
				},
				direct: true,
				filter: function (event, player) {
					return event.skill == 'gezi_yuhuo';
				},
				content: function () {
					player.getStat().card.sha--;
					player.gainlili();
				},
			},
			"gezi_businiao": {
				audio: "ext:东方project:1",
				spell: ["gezi_businiao2"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.say('符卡【不死鸟之羽】！');
					player.Fuka();
				},
				check: function () {
					return false;
				},
			},
			"gezi_businiao_die": {
				audio: "ext:东方project:1",
				group: "gezi_businiao",
				spell: ["gezi_businiao2"],
				enable: "chooseToUse",
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (event.type != 'dying') return false;
					if (player != event.dying) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.say('符卡【不死鸟之羽】！');
					player.Fuka();
				},
				check: function () {
					return player.lili > 1;
				},
				ai: {
					order: 1,
					skillTagFilter: function (player) {
						if (player.hp > 0) return false;
					},
					save: true,
					result: {
						player: function (player) {
							if (player.hp <= 0) return 10;
							if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
							return 0;
						},
					},
					threaten: function (player, target) {
						return 0.6;
					},
				},
			},
			"gezi_businiao2": {
				init: function (player) {
					player.nodying = true;
					if (player.hp <= 0) player.hp = 0;
					player.update();
				},
				onremove: function (player) {
					delete player.nodying;
					if (player.hp <= 0) {
						player.hp = 0;
						player.dying({});
					}
					player.update();
				},
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseEnd",
				},
				group: "gezi_businiao3",
				forced: true,
				content: function () {
					'step 0'
					if (player.lili) {
						player.chooseToUse('【不死鸟之羽】：你使用一张【杀】并消耗1点灵力；可以重复此流程。', {
							name: 'sha'
						}, function (card, player, target) {
							return player.canUse('sha', target, true);
						});
					}
					'step 1'
					if (result.bool) {
						player.loselili();
						if (player.lili) event.goto(0);
					}
					'step 2'
					if (player.hp < 1) {
						player.recover(1 - player.hp);
						player.update();
					}
					if (player.countCards('h') < 3) player.draw(3 - player.countCards('h'));
					player.loselili(player.lili);
				},
			},
			"gezi_businiao3": {
				audio: "ext:东方project:2",
				trigger: {
					player: "changeHp",
				},
				filter: function (event, player) {
					return player.hp <= 0 && event.num < 0 && player.lili;
				},
				priority: -15,
				locked: true,
				forced: true,
				content: function (player) {
					var nm = -trigger.num;
					if (player.lili >= nm) {
						player.loselili(nm);
					} else {
						player.loselili(player.lili);
					}
				},
				ai: {
					mingzhi: true,
				},
			},
			//米斯蒂娅
			"gezi_shiming": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseBegin", "damageEnd"],
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('失明：洗混一名角色手牌').set('ai', function (target) {
						if (_status.currentPhase == target && get.attitude(player, _status.currentPhase) < 0) return 100;
						return -get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						player.gainlili();
						player.logSkill('gezi_shiming', result.targets[0]);
						result.targets[0].addTempSkill('gezi_shiming_2');
						result.targets[0].addTempSkill('gezi_shiming_3');
					}
				},
				ai: {
					"maixie_defend": true,
				},
			},
			"gezi_shiming_2": {
				mark: true,
				intro: {
					content: "【失明】：我是谁 我在哪",
				},
				silent: true,
				popup: false,
				enable: "chooseToUse",
				group: "gezi_shiming_4",
				filter: function (event, player) {
					return player.countCards('h') > 0 && !player.storage.gezi_shiming;
				},
				content: function () {
					"step 0"
					var next = player.chosenPlayerCard('h', '【失明】：试图使用一张牌？', player, 'invisible');
					next.set('ai', function (card) {
						return Math.random() - 0.5;
					});
					"step 1"
					if (result.bool) {
						player.showCards(result.links[0]);
						player.removeSkill('gezi_shiming_3');
						if (lib.filter.filterCard({
							name: result.links[0].name
						}, player, _status.event.getParent().getParent())) {
							if (!player.storage.gezi_shiming) player.storage.gezi_shiming = [];
							player.storage.gezi_shiming.push(result.links[0]);
						} else {
							player.discard(result.links[0]);
						}
						player.addTempSkill('gezi_shiming_3');
					}
				},
				check: function (event, player) {
					return player.countCards('h') > player.hp || ((player.countCards('h', {
						name: 'shan'
					}) || player.countCards('h', {
						name: 'tao'
					})) && player.hp == 1);
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							if (player.hp <= 1) return 1;
							if (player.countCards('h') > player.hp) {
								if (_status.currentPhase == player) return 0.1;
								else return 0;
							}
						},
					},
				},
				forced: true,
			},
			"gezi_shiming_3": {
				mod: {
					cardEnabled: function (card, player) {
						if (!player.storage.gezi_shiming || !player.storage.gezi_shiming.contains(card)) return false;
					},
					cardUsable: function (card, player) {
						if (!player.storage.gezi_shiming || !player.storage.gezi_shiming.contains(card)) return false;
					},
					cardRespondable: function (card, player) {
						if (!player.storage.gezi_shiming || !player.storage.gezi_shiming.contains(card)) return false;
					},
					cardSavable: function (card, player) {
						if (!player.storage.gezi_shiming || !player.storage.gezi_shiming.contains(card)) return false;
					},
				},
			},
			"gezi_shiming_4": {
				direct: true,
				popup: false,
				trigger: {
					player: "useCardAfter",
				},
				filter: function (event, player) {
					return player.storage.gezi_shiming;
				},
				content: function () {
					delete player.storage.gezi_shiming;
				},
			},
			"gezi_wuye": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_wuye2"],
				roundi: true,
				priority: 22,
				check: function (event, player) {
					if (player.lili >= 3) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("<符卡>午夜中的合唱指挥！");
				},
			},
			"gezi_wuye2": {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToBefore",
				},
				direct: true,
				priority: 5,
				filter: function (event, player) {
					if (!player.lili) return false;
					return get.distance(player, event.player, 'attack') <= 1 && get.tag(event.card, 'damage');
				},
				content: function () {
					"step 0"
					player.chooseTarget('【午夜中的合唱指挥】：你可以将' + get.translation(trigger.card) + '转移给一名其他角色', function (card, player, target) {
						return trigger.player.canUse(trigger.card, target);
					}).ai = function (target) {
						return get.effect(target, trigger.card, trigger.player, player);
					};
					"step 1"
					if (result.bool) {
						player.loselili();
						player.logSkill('gezi_wuye', result.targets);
						trigger.target = result.targets[0];
						trigger.targets.remove(player);
						trigger.targets.push(result.targets[0]);
					} else {
						event.finish();
					}
					"step 2"
					trigger.untrigger();
					trigger.trigger('useCardToBefore');
					trigger.trigger('shaBefore');
					game.delay();
				},
				check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card) != 'damage') return;
							if (!target.lili) return;
							if (get.distance(target, player, 'attack') > 1) return;
							var targets = game.filterPlayer();
							for (var i = 0; i < targets.length; i++) {
								if (player.canUse(card, targets[i])) {
									var eff = get.effect(targets[i], card, player, player);
									if (eff < 0) return [0, -1];
									break;
								}
							}
						},
					},
				},
			},
			//铃仙
			"gezi_huanshi": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				discard: false,
				filterCard: true,
				check: function (card) {
					return 8 - get.value(card);
				},
				group: "gezi_huanshi_4",
				filter: function (event, player) {
					return player.countCards('he') && !player.hasSkill('gezi_huanshi_5');
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;

						if (lib.card[i].type == 'trick') {
							list.add(i);
						}
						list.remove(['wuxie', 'jiedao', 'shengdong', 'geanguanhuo', 'chuansongmen']);

						for (i = 0; i < player.storage.gezi_huanshi_4.length; i++)
							list.remove(player.storage.gezi_huanshi_4[i]);
					}

					for (var i = 0; i < list.length; i++) {
						list[i] = [get.type(list[i]), '', list[i]];
					}
					if (list.length) {
						player.chooseButton(['视为使用一张牌', [list, 'vcard']], true).set('ai', function (button) {
							var player = _status.event.player;
							var card = {
								name: button.link[2]
							};
							return get.value(card);
						});
					}
					'step 1'
					if (result && result.bool && result.links[0]) {
						player.gainlili();
						var card = {
							name: result.links[0][2]
						};
						var name = card.name;
						player.storage.gezi_huanshi_4.add(name);
						event.fakecard = card;
						player.chooseTarget(function (card, player, target) {
							return player.canUse(event.fakecard, target, true) && !target.hasSkill('gezi_huanshi_3');
						}, false, '选择' + get.translation(card.name) + '的目标').set('ai', function (target) {
							return get.effect(target, event.fakecard, _status.event.player);
						});
					} else {
						var card1 = game.createCard(event.fakecard);
						card1._destroy = true;
						player.gain(card1, 'gain2');
						player.addTempSkill('gezi_huanshi_5');
						event.finish();
					}
					'step 2'
					if (result.bool && result.targets && result.targets.length) {
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].addTempSkill('gezi_huanshi_2');
							result.targets[i].addTempSkill('gezi_huanshi_3');
							if (result.targets[i].name == 'gezi_eirin')
								player.say('啊，师、师匠，我、我不是故意的！');
							if (result.targets[i].name == 'kaguya')
								player.say('公、公主大人……？！我、我只是开个玩笑而已啦……');
						}
						player.storage.gezi_huanshi = [cards[0]];
						player.useCard(event.fakecard, result.targets);
					} else {
						var card1 = game.createCard(event.fakecard);
						card1._destroy = true;
						player.gain(card1, 'gain2');
						player.addTempSkill('gezi_huanshi_5');
						event.finish();
					}
				},
				ai: {
					order: 6,
					result: {
						player: function (player, target) {
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (!players[i].hasSkill('gezi_huanshi_3')) return 1;
							}
						},
					},
					threaten: 1.5,
				},
			},
			"gezi_huanshi_2": {
				trigger: {
					target: "useCardToBegin",
				},
				direct: true,
				filter: function (event, player) {
					return event.getParent().getParent().name == 'gezi_huanshi';
				},
				prompt: "幻视：你可以用一张牌声明一种牌",
				check: function () {
					return true;
				},
				content: function () {
					'step 0'
					player.removeSkill('gezi_huanshi_2');
					var nono = false;
					var eff1 = get.effect(_status.event.player, {
						name: trigger.card.name
					}, trigger.player, _status.event.player);
					var eff2 = get.effect(_status.event.player, {
						name: trigger.card.name
					}, trigger.player, trigger.player);
					var att = get.attitude(player, trigger.player);
					if (eff1 < 0) {
						if (att > 0 && eff2 > 0) {
							nono = false;
						} else {
							nono = true;
						}
					}
					player.chooseCard('he', '幻视：用一张牌声明一种牌').set('ai', function (card) {
						if (_status.event.nono == false) return 0;
						return 7 - get.value(card);
					}).set('nono', nono);
					'step 1'
					if (!result.cards) {
						game.log('幻视：声明', trigger.card, '的牌是', trigger.player.storage.gezi_huanshi[0]);
						event.finish();
					} else {
						event.card = result.cards[0];
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'basic') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						if (list.length) {
							player.chooseButton(['将' + get.translation(event.card) + '当作一张牌使用', [list, 'vcard']]).set('ai', function (button) {
								var player = _status.event.player;
								var card = {
									name: button.link[2]
								};
								return get.value(card);
							});
						}
					}
					'step 2'
					if (result.bool && result.links) {
						player.$throw(event.card, 1000);
						player.lose(event.card);
						game.log(player, '将', event.card, '当作', result.links[0][2], '打出');
						game.log('幻视：当作', trigger.card, '的牌是', trigger.player.storage.gezi_huanshi[0]);
						trigger.cancel();
						if (trigger.player.storage.gezi_huanshi) {
							var rcard = trigger.player.storage.gezi_huanshi[0];
							if (get.suit(rcard) != get.suit(event.card)) {
								var info = get.info(rcard);
								if (!info.multitarget && trigger.player.canUse(rcard, player)) {
									trigger.player.useCard(rcard, player);
								}
							} else {
								var card2 = game.createCard(result.links[0][2]);
								card2._destroy = true;
								player.gain(card2, 'gain2');
							}
						} else {
							game.log('幻视：当作', trigger.card, '的牌是', trigger.player.storage.gezi_huanshi[0]);
							event.finish();
						}
					}
				},
			},
			"gezi_huanshi_3": {
			},
			"gezi_huanshi_4": {
				init: function (player) {
					if (!player.storage.gezi_huanshi_4) player.storage.gezi_huanshi_4 = [];
				},
				direct: true,
				trigger: {
					player: "phaseAfter",
				},
				filter: function (event, player) {
					return player.storage.gezi_huanshi_4 && player.storage.gezi_huanshi_4.length > 10;
				},
				content: function () {
					player.storage.gezi_huanshi_4 = [];
				},
				popup: false,
			},
			"gezi_huanshi_5": {
			},
			"gezi_zhenshi": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				roundi: true,
				spell: ["gezi_zhenshi_1"],
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1 && player.countCards('h');
				},
				check: function (event, player) {
					if (player.countCards('h') > 2 && player.lili >= 2) return true;
					return false;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("<符卡>真实之月！");
				},
			},
			"gezi_zhenshi_1": {
				trigger: {
					global: "useCardToBefore",
				},
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (!player.lili) return false;
					return get.tag(event.card, 'damage') && get.distance(player, event.target, 'attack') <= 1 && event.targets.length == 1;
				},
				check: function (event, player) {
					return get.effect(event.target, event.card, event.player, player) < 0;
				},
				content: function () {
					'step 0'
					player.loselili();
					var next = player.chooseCard('he', '为使用月亮的力量而将一张牌置于弃牌堆吧');
					next.ai = function (card) {
						return 7 - get.value(card);
					};
					'step 1'
					if (result.cards) {
						player.lose(result.cards[0]);
						player.$throw(result.cards[0], 1000);
						player.chooseTarget([1, 2], '选择要被月光晒瞎的倒霉人吧', true, function (card, player, target) {
							return target != trigger.targets[0];
						}).ai = function (target) {
							return -get.attitude(player, target);
						}
					}
					'step 2'
					if (result.targets) {
						// player.logSkill('gezi_zhenshi_1', result.targets);
						player.line(result.targets, 'red');
						event.targets = result.targets;
						event.targets.push(trigger.targets[0]);
						var rand = [game.createCard('pss_stone', '', '')];
						if (result.targets.length >= 1) {
							rand.push(game.createCard('pss_scissor', '', ''));
						}
						if (result.targets.length >= 2) {
							rand.push(game.createCard('pss_paper', '', ''));
						}
						trigger.player.chooseCardButton(1, true, rand, '选择' + get.translation(trigger.card) + '新的目标').set('ai', function (button) {
							return 1;
						});
					}
					'step 3'
					if (result.links) {
						event.targets.randomSort();
						trigger.targets.remove(trigger.targets[0]);
						trigger.target = event.targets[0];
						game.log(trigger.card, '转移给了', event.targets[0]);
						trigger.player.line(event.targets[0], 'red');
						trigger.untrigger();
						trigger.trigger('useCardToBefore');
						trigger.trigger(trigger.card.name + 'Before');
						game.delay();
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (!target.lili) return;
							if (get.tag(card) != 'damage') return;
							if (!player.hasFriend()) return;
							var num = game.countPlayer(function (current) {
								return get.effect(current, card, player, player) < 0;
							});
							if (num >= 2) return [0.5, -1];
							if (num == 1) return [0.5, -0.5];
							if (num == 0) return;
						},
					},
				},
			},
			//帝
			"gezi_kaiyun": {
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseUseEnd",
				},
				group: ["gezi_bianshentewi"],
				filter: function (event, player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] == player) continue;
						if (players[i] == event.player) continue;
						if (players[i].storage._gezi_mubiao) return false;
					}
					return player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					trigger.player.chooseCardTarget({
						prompt: '交出一张手牌，对方可以使用【迷途（挖坑）】，你贴上一张【神佑】',
						selectCard: 1,
						filterTarget: function (card, player, target) {
							return target.hasSkill('gezi_kaiyun');
						},
						position: 'h',
						ai1: function (card) {
							return 7 - get.value(card)
						},
						ai2: function (target) {
							return get.attitude(_status.event.player, target);
						}
					});
					'step 1'
					if (result.targets && result.targets[0]) {
						trigger.player.logSkill('gezi_kaiyun', result.targets[0]);
						result.targets[0].gain(result.cards, trigger.player);
						trigger.player.$give(result.cards.length, result.targets[0]);
						result.targets[0].say('只要998，保证你出SSR——');
						result.targets[0].useSkill('gezi_mitu_3');
						trigger.player.addJudgen(game.createCard('gezi_shenyou', '', ''));
					}
				},
			},
			"gezi_kaiyun1": {
				global: "gezi_kaiyun_1",
			},
			"gezi_kaiyun_1": {
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('he') && game.hasPlayer(function (current) {
						return current.hasSkill('gezi_kaiyun1');
					});
				},
				prompt: "交给帝一张牌，获得一张【神佑】，然后本回合不能对你和她以外的人用牌",
				content: function () {
					'step 0'
					player.chooseCardTarget({
						prompt: '交给帝一张牌，获得一张【神佑】，然后本回合不能对你和她以外的人用牌',
						selectCard: 1,
						filterTarget: function (card, player, target) {
							return target.hasSkill('gezi_kaiyun1');
						},
						position: 'he',
						ai1: function (card) {
							var player = _status.event.player;
							if (player.needsToDiscard() > 0) return 0;
							if (player.countCards('h', function (card) {
								return get.type(card) == 'trick';
							}) > 1) return 0;
							if (player.countCards('h', function (card) {
								return card.name == 'sha';
							}) > 0) return 0;
							return 8 - get.value(card);
						},
						ai2: function (target) {
							return get.attitude(_status.event.player, target);
						}
					});
					'step 1'
					if (result.targets && result.targets[0]) {
						player.logSkill('gezi_kaiyun', result.targets[0]);
						result.targets[0].gain(result.cards, player);
						player.$give(result.cards.length, result.targets[0]);
						result.targets[0].say('只要998，保证你出SSR——');
						player.addJudgen(game.createCard('gezi_shenyou', '', ''));
						player.addTempSkill('gezi_kaiyun_3');
						result.targets[0].addTempSkill('gezi_kaiyun_4');
					}
				},
			},
			"gezi_kaiyun_3": {
				mod: {
					playerEnabled: function (card, player, target) {
						if (target != player && !target.hasSkill('gezi_kaiyun_4')) return false;
					},
				},
			},
			"gezi_kaiyun_4": {
			},
			"gezi_mitu": {
				audio: "ext:东方project:5",
				group: ["gezi_mitu_storage"],
				trigger: {
					global: "useCardToBegin",
				},
				filter: function (event, player) {
					if (!player.storage.gezi_mitu) return false;
					if (get.distance(player, event.target, 'attack') > 1) return false;
					for (var i = 0; i < player.storage.gezi_mitu.length; i++) {
						if (get.name(event.card) == get.name(player.storage.gezi_mitu[i]) || get.suit(event.card) == get.suit(player.storage.gezi_mitu[i])) {
							return true;
						}
					}
				},
				direct: true,
				content: function () {
					'step 0'
					var choice = false;
					if (get.effect(trigger.target, trigger.card, trigger.player, player) < 0) {
						if (get.attitude(player, trigger.player) < 0) {
							if (trigger.player == player) {
								choice = true;
							} else {
								if (trigger.target.countCards('he')) {
									choice = true;
								}
							}
						}
					}
					player.chooseCardButton('【迷途】：选择一张同名或花色相同的牌', player.storage.gezi_mitu).set('filterButton', function (button) {
						return get.name(button) == trigger.card.name || get.suit(button) == get.suit(trigger.card);
					}).set('ai', function (button) {
						return choice;
					}).set('choice', choice);
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_mitu', trigger.player);
						player.show(result.links[0]);
						trigger.player.judge(function (card) {
							if (get.color(card) == 'black') return -2;
							return 0;
						});
						event.card = result.links[0];
					}
					'step 2'
					if (result.judge < 0) {
						player.discardPlayerCard(trigger.player, 'he', true);
						if (trigger.target == player) trigger.cancel();
						if (event.card) {
							player.storage.gezi_mitu.remove(card);
							game.cardsDiscard(card);
							player.$throw(card);
							game.log(player, '将', card, '置入弃牌堆');
							player.syncStorage('gezi_mitu');
							if (player.storage.gezi_mitu.length == 0) {
								player.unmarkSkill('gezi_mitu');
							}
							if (player.hasSkill('gezi_yuangu_1')) {
								player.useSkill('gezi_mitu_3');
							}
						}
					}
				},
				intro: {
					content: "cards",
					mark: function (dialog, content, player) {
						if (content) {
							if (player.isUnderControl(true)) {
								return get.translation(content);
							}
							return '这里有个坑哟';
						}
					},
				},
			},
			"gezi_mitu_storage": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseDiscardBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('he');
				},
				content: function () {
					player.useSkill('gezi_mitu_3');
				},
			},
			"gezi_mitu_2": {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return player.storage.gezi_mitu && player.storage.gezi_mitu.length > 0;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('【迷途】：令一名体力不大于你的角色摸等同于【坑】数量的牌。', true, function (card, player, target) {
						return player.hp >= target.hp;
					}).set('ai', function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (target == player) {
							att += 2;
						}
						if (target.hasJudge('lebu')) {
							att /= 2;
						}
						return att;
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_mitu', result.targets[0]);
						result.targets[0].draw(player.storage.gezi_mitu.length);
						game.cardsDiscard(player.storage.gezi_mitu);
						player.storage.gezi_mitu = [];
						player.syncStorage('gezi_mitu');
						player.unmarkSkill('gezi_mitu');
					}
				},
			},
			"gezi_mitu_3": {
				direct: true,
				filter: function (event, player) {
					return player.countCards('he');
				},
				content: function () {
					'step 0'
					player.draw();
					player.chooseCard('h', '【迷途（挖坑）】：将一张手牌作为“坑”放头上').set('ai', function (card) {
						var player = _status.event.player;
						if (card.name == 'sha') return 9;
						if (player.needsToDiscard()) return 10 - get.value(card);
						return 6 - get.value(card);
					});
					'step 1'
					if (result.cards && result.cards.length) {
						if (_status.currentPhase == player) {
							player.logSkill('gezi_mitu');
						}
						player.gainlili();
						player.lose(result.cards, ui.special, 'toStorage');
						if (!player.storage.gezi_mitu) player.storage.gezi_mitu = [];
						player.storage.gezi_mitu = player.storage.gezi_mitu.concat(result.cards[0]);
						player.markSkill('gezi_mitu');
					}
				},
			},
			"gezi_mitu2": {
				group: "gezi_mitu2_storage",
				trigger: {
					global: "useCardToBegin",
				},
				filter: function (event, player) {
					if (!player.storage.gezi_mitu2) return false;
					if (event.card.name != player.storage.gezi_mitu2.name) return false;
					return get.distance(player, event.target, 'attack') <= 1;
				},
				direct: true,
				content: function (event, player) {
					'step 0'
					player.chooseBool(get.prompt2('gezi_mitu2')).set('ai', function (event, player) {
						if (get.effect(trigger.target, trigger.card, trigger.player, player) >= 0)
							return false;
						if (trigger.target.hp > 2 && trigger.target != player) return false;
						return true;
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_mitu');
						player.showCards(player.storage.gezi_mitu2);
						trigger.player.judge(function (card) {
							if (get.color(card) == 'black') return -2;
							return 0;
						});
					}
					'step 2'
					if (result.judge < 0) {
						player.line(trigger.player, 'red');
						player.discardPlayerCard(trigger.player, 'he', true);
						if (trigger.target == player) trigger.cancel();
						if (!player.hasSkill('gezi_yuangu_1')) {
							player.storage.gezi_mitu2.discard();
							player.$throw(player.storage.gezi_mitu2);
							delete player.storage.gezi_mitu2;
							player.unmarkSkill('gezi_mitu2');
						}
					}
				},
				intro: {
					content: "cards",
					mark: function (dialog, content, player) {
						if (content) {
							if (player.isUnderControl(true)) {
								return get.translation(content);
							}
							return '这里有个坑哟';
						}
					},
				},
			},
			"gezi_mitu2_storage": {
				trigger: {
					player: "phaseDiscardBegin",
				},
				filter: function (event, player) {
					return player.countCards('he') && !player.storage.gezi_mitu2;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseCard('he', '将一张牌作为“坑”放头上').set('ai', function (card) {
						if (game.countPlayer(function (current) {
							return get.attitude(player, current) < 0 && get.distance(player, current, 'attack') <= 1 && current.hp == 1;
						}) && player.countCards('h', {
							name: 'tao'
						})) return card.name == 'tao';
						return card.name == 'sha';
					});
					'step 1'
					if (result.cards && result.cards.length) {
						player.logSkill('gezi_mitu');
						player.gainlili();
						player.lose(result.cards, ui.special);
						player.storage.gezi_mitu2 = result.cards[0];
						player.syncStorage('gezi_mitu2');
						player.markSkill('gezi_mitu2');
					}
				},
			},
			"gezi_yuangu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				roundi: true,
				spell: ["gezi_yuangu_1"],
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("<符卡>远古的骗术！");
				},
				check: function (event, player) {
					if (player.countCards('h') >= 2 && player.lili > 2) return true;
					return false;
				},
			},
			"gezi_yuangu_1": {
				trigger: {
					global: "judge",
				},
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
						get.translation(trigger.player.judging[0]) + '，是否发动【远古的骗术】用一张牌替换之', 'he',
						function (card) {
							return true;
						}).set('ai', function (card) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							var judging = _status.event.judging;
							var result = trigger.judge(card) - trigger.judge(judging);
							var attitude = get.attitude(player, trigger.player);
							if (attitude == 0 || result == 0) return 0;
							if (attitude > 0) {
								return result;
							} else {
								return -result;
							}
						}).set('judging', trigger.player.judging[0]);
					"step 1"
					if (result.bool) {
						player.respond(result.cards, 'highlight');
					} else {
						event.finish();
					}
					"step 2"
					if (result.bool) {
						player.logSkill('gezi_yuangu');
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						if (!get.owner(result.cards[0], 'judge')) {
							trigger.position.appendChild(result.cards[0]);
						}
						game.log(trigger.player, '的判定牌改为', result.cards[0]);
					}
					"step 3"
					game.delay(2);
				},
				ai: {
					tag: {
						rejudge: 1,
					},
				},
			},
			"gezi_bianshentewi": {
				unique: true,
				locked: true,
				silent: true,
				priority: 3.1,
				trigger: {
					global: "gameStart",
				},
				filter: function (event, player) {
					return game.me == player && player.name == 'gezi_tewi';
				},
				content: function () {
					'step 0'
					var controls = ['gezi_tewi', '帝（旧版）'];
					player.chooseControl(controls).set('ai', function () {
						return 'gezi_tewi';
					}).set('prompt', "请选择目标人物");
					'step 1'
					if (result.control == '帝（旧版）') {
						if (lib.character.gezi_tewi) {
							lib.character.gezi_tewi[3] = ["gezi_kaiyun1", "gezi_mitu2", "gezi_yuangu"];
						}
						player.removeSkill('gezi_kaiyun');
						player.removeSkill('gezi_mitu');
						player.removeSkill('gezi_yuangu');
						player.addnSkill('gezi_kaiyun1');
						player.addnSkill('gezi_mitu2');
						player.addnSkill('gezi_yuangu');
						player.update();
					}
				},
				forced: true,
				popup: false,
			},
			//莉格露
			"gezi_yingguang": {
				audio: "ext:东方project:4",
				trigger: {
					player: "useCard",
				},
				frequent: true,
				usable: 3,
				filter: function (event, player) {
					if (!player.hasSkill('gezi_yechong1') && player.storage.counttrigger && player.storage.counttrigger['gezi_yingguang'] && player.storage.counttrigger['gezi_yingguang'] >= 1) return false;
					return true;
				},
				content: function () {
					player.logSkill('gezi_yingguang');
					player.gainlili();
					player.useSkill('gezi_jinengpai_show');
				},
				ai: {
					threaten: 1.4,
				},
			},
			"gezi_yechong": {
				audio: "ext:东方project:4",
				trigger: {
					player: ["phaseBegin"],
				},
				priority: 22,
				spell: ["gezi_yechong1"],
				roundi: true,
				check: function (event, player) {
					if (player.lili > 2) return true;
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.say("<符卡>夜虫风暴！");
				},
			},
			"gezi_yechong1": {
				direct: true,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				content: function () {
					"step 0"
					var targets = game.filterPlayer();
					targets.remove(player);
					targets.sort(lib.sort.seat);
					event.targets = targets;
					"step 1"
					event.num = 0;
					player.logSkill("gezi_yechong", targets);
					"step 2"
					if (event.num < event.targets.length) {
						if (event.targets[event.num].countCards('hej')) {
							player.chosenPlayerCard('hej', event.targets[event.num], true).ai = function (button) {
								var val;
								if (button.name == 'du') {
									val = -get.buttonValue(button);
								} else {
									val = get.buttonValue(button);
								}
								var type = get.type(button.link);
								if (get.attitude(_status.event.player, get.owner(button.link)) > 0 && get.owner(button.link).countCards('he') >= player.countCards('he')) return type != 'jinengpai' && 15 - val;
								if (get.attitude(_status.event.player, get.owner(button.link)) > 0) return 15 - val;
								if (get.attitude(_status.event.player, get.owner(button.link)) < 0 && get.owner(button.link).countCards('he') >= player.countCards('he')) return type == 'jinengpai' && val;
								return val;
							};
						}
					}
					"step 3"
					if (result.bool && result.links && result.links.length) {
						if (get.type(result.links[0]) == 'jinengpai') {
							var cards = event.targets[event.num].getJinengpai('j');
							for (var i = 0; i <= cards.length; i++) {
								if (cards[i] && cards[i].name == result.links[0].name) {
									event.targets[event.num].removeJudgen(cards[i]);
									break;
								}
								game.delay(2);
							}
							if (event.targets[event.num].countCards('he') >= player.countCards('he')) {
								event.targets[event.num].damage('thunder');
							}
						} else {
							event.targets[event.num].discard(result.links[0]);
						}
					}
					"step 4"
					if (event.num < event.targets.length - 1) {
						event.num++;
						event.goto(2);
					}
				},
			},
			/*-------------------萃梦-------------------*/
			//萃香
			"gezi_cuiji": {
				group: ["gezi_cuiji_buff", "gezi_cuiji_2"],
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseZhunbeiBegin",
					source: "damageEnd",
				},
				filter: function (event, player, name) {
					return player.node.lili;
				},
				check: function (event, player) {
					if (player.node.fuka) return false;
					if (player.isHealthy() && player.maxlili - player.lili < 2) return false;
					if (player.hp < 4 && player.lili < 2) return false;
					return true;
				},
				content: function () {
					'step 0'
					game.broadcastAll(function (player) {
						if (!player.node.jjiu && lib.config.jiu_effect) {
							player.node.jjiu = ui.create.div('.playerjiu', player.node.avatar);
							player.node.jjiu2 = ui.create.div('.playerjiu', player.node.avatar2);
						}
					}, player);
					game.delay();
					'step 1'
					var list = [];
					if (player.lili > 1) {
						list.push('cuiji_lili');
					}
					if (player.hp > 0) {
						list.push('cuiji_hp');
					}
					player.chooseControl(list, function (event, player) {
						if ((player.lili > 3 || player.hp < 3) && list.contains('cuiji_lili') && !player.isHealthy()) return 'cuiji_lili';
						if (player.lili + 2 > player.hp) return 'cuiji_hp';
						return 'cuiji_hp';
					});
					'step 2'
					if (result.control == 'cuiji_hp') {
						player.loseHp();
						player.gainlili(2);
					} else if (result.control == 'cuiji_lili') {
						player.loselili(2);
						player.recover();
					}
					'step 3'
					if (player.node.jjiu) {
						player.node.jjiu.delete();
						player.node.jjiu2.delete();
						delete player.node.jjiu;
						delete player.node.jjiu2;
					}
				},
			},
			"gezi_cuiji_buff": {
				audio: "ext:东方project:2",
				usable: 1,
				enable: ["chooseToUse", "chooseToRespond"],
				filter: function (event, player) {
					if (player.lili <= player.hp) return false;
					return player.countCards('h', {
						color: "black"
					});
				},
				filterCard: {
					color: "black",
				},
				viewAs: {
					name: "sha",
				},
				check: function () {
					return 1
				},
				ai: {
					skillTagFilter: function (player, event) {
						if (player.lili <= player.hp) return false;
						if (!player.countCards('h', {
							color: "black"
						})) return false;
						if (player.getStat().skill.gezi_cuiji_buff > 0) return false;
						return true;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondSha') && current < 0) return 0.6
						},
					},
					respondSha: true,
					order: 7,
					useful: 1,
					value: 1,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						target: function (player, target) {

							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_cuiji_2": {
				trigger: {
					player: "shaBefore",
				},
				direct: true,
				filter: function (event, player) {
					return event.skill == 'gezi_cuiji_buff';
				},
				content: function () {
					player.getStat().card.sha--;
				},
			},
			"gezi_baigui": {
				audio: "ext:东方project:1",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_baigui1"],
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili;
				},
				check: function (event, player) {
					if (player.hp <= 2 && player.lili > 2) return false;
					return player.hp > 2 && player.countCards('h', 'sha') > 0;
				},
				content: function () {
					player.Fuka();
					player.say('鬼符：【百鬼夜行】！');
				},
			},
			"gezi_baigui1": {
				group: "gezi_baigui2",
				trigger: {
					player: "shaBegin",
				},
				forced: true,
				filter: function (event, player) {
					return !event.directHit;
				},
				priority: -1,
				content: function () {
					if (typeof trigger.shanRequired == 'number') {
						trigger.shanRequired += player.hp;
					} else {
						trigger.shanRequired = player.hp;
					}
				},
			},
			"gezi_baigui2": {
				audio: "ext:东方project:2",
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				priority: -1,
				filter: function (event, player) {
					return event.card && event.card.name == 'sha' && player.node.lili;
				},
				content: function () {
					'step 0'
					if (player.lili > 1) {
						var burn = player.lili - 1;
						player.loselili(burn);
						for (var i = 0; i < burn; i++) {
							if (trigger.player.countCards('he') > 0) {
								player.discardPlayerCard(trigger.player, 'he', true);
							} else {
								player.draw();
							}
						}
					}
					'step 1'
					if (player.lili < 1) {
						player.gainlili(1 - player.lili);
					}
				},
			},
			/*-------------------笨蛋-------------------*/
			//琪露诺
			"gezi_jidong": {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				audio: "ext:东方project:2",
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt('gezi_jidong'), true).ai = function (target) {
						if (!player.countCards('h', 'sha') && player.countCards('h') > 1) return target = player;
						else return get.attitude(player, target) < 0;
					};
					"step 1"
					if (result.bool) {
						event.target = result.targets[0];
						player.choosePlayerCard(event.target, 'he', true);
					}
					"step 2"
					if (result.bool && result.cards.length) {
						event.target.showCards(result.cards);

						var cards = game.createCard(result.cards[0].name, result.cards[0].suit, result.cards[0].number);
						event.target.addTempSkill('gezi_jidong_2');
						if (!event.target.storage.gezi_jidong_2) event.target.storage.gezi_jidong_2 = [];
						event.target.storage.gezi_jidong_2.push(result.cards[0]);
						event.target.markSkill('gezi_jidong_2');
						event.target.syncStorage('gezi_jidong_2');
						if (event.target.name == 'gezi_daiyousei') {
							player.say('大酱，你看！是青蛙！');
						}
						if (get.position(result.cards[0]) == 'e') {
							event.target.removeEquipTrigger(result.cards[0], false);
						}
					}
				},
			},
			"gezi_jidong_2": {
				popup: false,
				intro: {
					content: "cards",
				},
				mod: {
					cardEnabled: function (card, player) {
						if (card == player.storage.gezi_jidong_2[0] && _status.event.skill != 'gezi_jidong_2') return false;
					},
					cardUsable: function (card, player) {
						if (card == player.storage.gezi_jidong_2[0] && _status.event.skill != 'gezi_jidong_2') return false;
					},
					cardRespondable: function (card, player) {
						if (card == player.storage.gezi_jidong_2[0] && _status.event.skill != 'gezi_jidong_2') return false;
					},
					cardSavable: function (card, player) {
						if (card == player.storage.gezi_jidong_2[0] && _status.event.skill != 'gezi_jidong_2') return false;
					},
				},
				onremove: function (player) {
					var es = player.getCards('e');
					for (var j = 0; j < es.length; j++) {
						var info = get.info(es[j]);
						if (info.skills && es[j] == player.storage.gezi_jidong_2[0]) {
							for (var i = 0; i < info.skills.length; i++) {
								player.addSkillTrigger(info.skills[i]);
							}
						}
					}
					delete player.storage.gezi_jidong_2;
				},
				enable: "chooseToUse",
				filterCard: function (card, player) {
					return card == player.storage.gezi_jidong_2[0];
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				prompt: "将一张【急冻】牌当【杀】使用",
				check: function (card) {
					return 7 - get.value(card);
				},
				ai: {
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_bingbi": {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToBegin",
				},
				direct: true,
				filter: function (event, player) {
					if (!lib.filter.cardRespondable({
						name: 'sha'
					}, player)) return false;
					return event.card.name == 'sha';
				},
				content: function () {
					"step 0"
					var num = 1;
					if (player.storage._gezi_mubiao) num += player.storage._gezi_mubiao;
					player.chooseToRespond('打出一张【杀】，取消之，并摸' + num + '张牌', {
						name: 'sha'
					});
					"step 1"
					if (result.bool) {
						player.logSkill("gezi_bingbi", trigger.player);
						trigger.untrigger();
						trigger.finish();
						if (player.storage._gezi_mubiao) player.draw(player.storage._gezi_mubiao + 1);
						else player.draw();
						player.gainlili();
					}
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.hasSha()) return false;
					},
					effect: {
						target: function (card, player, target) {
							if (card.name == 'sha') {
								return 0.8;
							}
						},
					},
				},
			},
			"gezi_dongjie": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				spell: ["gezi_dongjie2"],
				roundi: true,
				check: function (event, player) {
					if (player.hasUnknown()) return 0;
					return player.lili > 3 && game.countPlayer(function (current) {
						if (get.attitude(player, current) > 0) return -2;
						else return 2;
					}) > 0;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 3;
				},
				content: function () {
					player.loselili(3);
					player.Fuka();
					player.say("凍符「完美冻结」！");
				},
			},
			"gezi_dongjie2": {
				global: "gezi_dongjie3",
				init: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'extension/东方project/snow1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'extension/东方project/snow3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
				onremove: function (player) {
					ui.css.border_stylesheet = lib.init.sheet();
					var bstyle = lib.config.border_style;
					if (bstyle.indexOf('dragon_') == 0) {
						bstyle = bstyle.slice(7);
					}
					ui.css.border_stylesheet.sheet.insertRule('#window .player>.framebg,#window #arena.long.mobile:not(.fewplayer) .player[data-position="0"]>.framebg{display:block;background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '1.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('#window #arena.long:not(.fewplayer) .player>.framebg, #arena.oldlayout .player>.framebg{background-image:url("' + lib.assetURL + 'theme/style/player/' + bstyle + '3.png")}', 0);
					ui.css.border_stylesheet.sheet.insertRule('.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}', 0);
				},
			},
			"gezi_dongjie3": {
				mod: {
					cardEnabled: function (card, player) {
						if (_status.event.skill != 'gezi_dongjie3' && card.name != 'sha' && game.hasPlayer(function (current) {
							return current.hasSkill('gezi_dongjie2');
						})) return false;
					},
					cardUsable: function (card, player) {
						if (_status.event.skill != 'gezi_dongjie3' && card.name != 'sha' && game.hasPlayer(function (current) {
							return current.hasSkill('gezi_dongjie2');
						})) return false;
					},
					cardRespondable: function (card, player) {
						if (_status.event.skill != 'gezi_dongjie3' && card.name != 'sha' && game.hasPlayer(function (current) {
							return current.hasSkill('gezi_dongjie2');
						})) return false;
					},
					cardSavable: function (card, player) {
						if (_status.event.skill != 'gezi_dongjie3' && card.name != 'sha' && game.hasPlayer(function (current) {
							return current.hasSkill('gezi_dongjie2');
						})) return false;
					},
				},
				audio: "ext:东方project:2",
				enable: ["chooseToUse", "chooseToRespond"],
				position: "h",
				filterCard: true,
				prompt: "你的所有手牌不能使用/打出，除非将一张手牌当【杀】使用或打出",
				filter: function (event, player) {
					return player.countCards('h') && game.hasPlayer(function (current) {
						return current.hasSkill('gezi_dongjie2');
					});
				},
				viewAs: {
					name: "sha",
				},
				check: function () {
					return 1
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondSha') && current < 0) return 0.6
						},
					},
					respondSha: true,
					order: 4,
					useful: -1,
					value: -1,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			//大妖精
			"gezi_zhufu": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return (player.lili || !player.node.lili);
				},
				filterTarget: function (card, player, target) {
					if (target.isHealthy()) return false;
					if (player.hp < target.hp) return false;
					return true;
				},
				selectTarget: 1,
				content: function () {
					player.loselili();
					target.recover();
					if (target.name == 'gezi_cirno') {
						player.say('琪露诺酱真是的，不是叫你小心一点了吗！');
					}
					if (player.lili == 0) {
						player.gainlili(player.hp);
					}
				},
				ai: {
					order: 7.6,
					result: {
						target: function (player, target) {
							if (target.hp == 1) return 5;
							if (player == target && player.countCards('h') > player.hp) return 5;
							return 2;
						},
					},
					threaten: 1.5,
				},
			},
			"gezi_zhufu2": {
				enable: "phaseUse",
				selectTarget: -1,
				filterTarget: function (card, player, target) {
					return true;
				},
				filter: function (event, player) {
					return player.lili == 1 && !player.hasSkill("gezi_zhufu3");
				},
				content: function () {
					target.recover();
					player.addTempSkill("gezi_zhufu3");
				},
				ai: {
					order: 10.1,
					result: {
						player: function (player, target) {
							if (player.lili == 1) {
								var players = game.filterPlayer();
								var num = 0;
								for (var i = 0; i < players.length; i++) {
									num += get.recoverEffect(players[i], player, player);
								}
								return num > 1;
							}
							return 0;
						},
					},
				},
			},
			"gezi_zhufu3": {
			},
			"gezi_zhiyue": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 1,
				position: "he",
				discard: false,
				prepare: "give2",
				check: function (card) {
					if (card.name == 'du') return 20;
					return 8 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				content: function () {
					"step 0"
					target.gain(cards, player);
					if (target.name == 'gezi_cirno') {
						player.say('琪露诺酱什么时候才能照顾好自己啊……');
					}
					if (player.lili) {
						var list = [];
						var players = game.filterPlayer();
						var num = 0;
						for (var i = 0; i < players.length; i++) {
							num += get.recoverEffect(players[i], player, player);
						}
						for (var j = 0; j <= player.lili; j++) {
							list.push(j);
						}
						player.chooseControl(list, function () {
							if (num > 1) return player.lili - 1;
							if (player.lili > 2) {
								return 1;
							}
							return 0;
						}).set('num', num).set('prompt', '消耗任意点灵力，多摸等量的牌');
					}
					'step 1'
					if (result.control) {
						player.loselili(result.control);
						player.draw(1 + result.control);
						if (result.control > 0 && player.lili == 1) {
							var targets = game.filterPlayer();
							for (var i = 0; i < targets.length; i++) {
								if (targets[i].isDamaged()) {
									targets[i].recover();
								}
							}
						}
					} else {
						player.draw();
					}
				},
				ai: {
					order: function (skill, player) {
						{
							return 6.2;
						}
						return 1;
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag('nogain')) return 0;
							if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
								if (target.hasSkillTag('nodu')) return 0;
								return -10;
							}
							var nh = target.countCards('h');
							var np = player.countCards('h');
							if (player.countCards('h') <= 1) {
								if (nh >= np - 1 && np <= player.hp) return 0;
							}
							return Math.max(1, 5 - nh);
						},
					},
					threaten: 0.8,
				},
			},
			/*-------------------花映-------------------*/
			//映姬
			"gezi_huiwu": {
				audio: "ext:东方project:3",
				trigger: {
					global: "phaseEnd",
				},
				filter: function (event, player) {
					return event.player.countCards('he') > 0;
				},
				forced: true,
				chat: ["果然你是完全没有听从我的教诲。（其实也有点习惯了。）你可知道这样随随便便的攻击是不会有任何好结果的。无意义的纷争和骚乱，破坏其他人的生活，难道，你真的认为破坏其他人，对你是不会有任何后果的吗？听着，以后一定要收拾你的情绪——我还会再回来检查你的表现的。", "都说了不要这么打架了，怎么就听不进去？你真的只会这么毫无华丽感的打架？我来教你：首先你需要发动你的符卡技，记得要大声喊名字，其次你需要有规律的发弹幕，记得数量要多，但是不要会压死人，完全不可能突破的弹幕就没有战斗的意义了。双方互相往对方身上用杀招是没有人想要见到的。最后，记住给你的弹幕加入只属于你的特色！", "虽然说进行弹幕对战是不可避免的，甚至是幻想乡中必要的一环，但是这并不代表斗争就是好的。斗争只会让你们越来越意气用事，越来越控制不住自己，这对任何人都是没有任何好处的。因此，你们要学会控制自己的情绪，不要让弹幕战变成你的重心。只有多多反思和思考，才能成为更好的人，更好的自己。", "嗯，无论是什么时候，即使是在激烈战斗的中心，也是值得花几分钟，集中精神，稳定情绪。事态已如此，慌只会让你的攻击变的无力和没用。要冷静的考虑，找出关键点，突破点，再向着那个方向进发吧。再说了，在你死亡后来到地狱了，有的是时间让你慢慢慌的。"],
				content: function () {
					'step 0'
					player.chat(lib.skill.gezi_huiwu.chat.randomGet());
					if (trigger.player.getStat('damage') > 0) {
						var neg = get.attitude(player, trigger.player);
						player.choosePlayerCard('he', trigger.player, true).set('ai', function (button) {
							if (_status.event.neg <= 0) {
								return get.buttonValue(button);
							} else {
								return -get.buttonValue(button);
							}
						}).set('neg', neg);
					} else {
						trigger.player.chooseCard('he', true, '悔悟：你须重铸一张牌').set('ai', function (card) {
							return -get.value(card);
						});
					}
					'step 1'
					if (result.bool && result.cards.length) {
						player.line(trigger.player, 'blue');
						trigger.player.recast(result.cards[0]);
						trigger.player.gainlili();
						if (trigger.player.name == 'gezi_komachi') trigger.player.say('（还好映姬大人没发现我戴了耳塞……）');
					}
				},
			},
			"gezi_caijue": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseZhunbeiEnd",
				},
				group: "gezi_caijue2",
				filter: function (event, player) {
					return !player.storage.gezi_caijue;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('选择一名裁决的罪人', function (card, player, target) {
						return target.countCards('h');
					}).set('ai', function (target) {
						if (get.damageEffect(target, player, player, 'thunder') > 0 && get.attitude(player, target) <= 0) return target.countCards('h');
						if (get.attitude(player, target) < 0) return target.countCards('h');
						return 0;
					});
					'step 1'
					if (result.bool && result.targets[0]) {
						player.logSkill('gezi_caijue', result.targets[0]);
						result.targets[0].showHandcards();
						var cards = result.targets[0].getCards('h');
						var list = [];
						for (var i = 0; i < cards.length; i++) {
							if (get.name(cards[i]) == 'sha') {
								list.push(cards[i]);
							}
						}
						var num = list.length;
						if (list.length > 0) {
							result.targets[0].discard(list);
							result.targets[0].damage('thunder');
						} else {
							player.storage.gezi_caijue = true;
						}
					}
				},
			},
			"gezi_caijue2": {
				direct: true,
				trigger: {
					player: "damageEnd",
				},
				content: function () {
					player.storage.gezi_caijue = false;
				},
			},
			"gezi_shenpan": {
				audio: "ext:东方project:1",
				spell: ["gezi_shenpan_1"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				init: function (player) {
					if (!player.storage.gezi_shenpan) player.storage.gezi_shenpan = false;
				},
				mark: true,
				intro: {
					content: "最终审判",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (player.storage.gezi_shenpan == true) return false;
					return player.lili > player.hp;
				},
				content: function () {
					"step 0"
					player.loselili(player.hp);
					player.storage.gezi_shenpan = true;
					player.syncStorage('gezi_shenpan');
					player.unmarkSkill('gezi_shenpan');
					player.say('审判「Last Judgement」——');
					"step 1"
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > player.hp && game.hasPlayer(function (current) {
						return current.isMaxHp(false) && get.damageEffect(current, player, player, 'thunder') > 0;
					})
				},
			},
			"gezi_shenpan_1": {
				audio: "ext:东方project:1",
				forced: true,
				trigger: {
					player: "phaseEnd",
				},
				async content(event, trigger, player) {
					let list = ["体力值", "卡牌数", "手牌数", "击杀数"];
					for (let i = 0; i < list.length; i++) {
						const { result: { bool, targets } } = await player.chooseTarget("选择一名" + list[i] + "最高的角色，对其造成一点雷电伤害", (card, player, target) => {
							switch (i) {
								case 0: return target.isMaxHp(false);
								case 1: return target.isMaxCard(false);
								case 2: return target.isMaxHandcard(false);
								case 3:
									let count = game.filterPlayer().map(current => current.stat.reduce((total, history) => total + (history.kill || 0), 0));
									return count.every(value => value <= count[game.filterPlayer().indexOf(target)]);
							}
						}).set('ai', target => get.damageEffect(target, player, player, 'thunder'));
						if (bool) {
							await player.line(targets[0], 'red');
							await targets[0].damage('thunder');
							game.delay();
						}
					}
				},
				group: ["gezi_shenpan1_zhunbei"],
				subSkill: {
					"zhunbei": {
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						forced: true,
						async content(event, trigger, player) {
							await player.useCard({ name: 'gezi_lingbi' }, game.filterPlayer());
						},
						sub: true,
					},
				},
			},
			//小町
			"gezi_guihang": {
				group: ["gezi_guihang_cost", "gezi_guihang_2"],
				audio: "ext:东方project:2",
				enable: ["chooseToUse", "chooseToRespond"],
				usable: 2,
				mod: {
					targetInRange: function (card) {
						if (_status.event.skill == 'gezi_guihang') return true;
					},
				},
				filter: function (event, player) {
					return !game.hasPlayer(function (current) {
						return current.hasSkill('gezi_guihang_flag');
					});
				},
				filterCard: function (card, player) {
					return 6 - get.value(card);
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('he')) return false;
					return true;
				},
				onuse: function (event, player) {
					player.gainlili();
				},
				onrespond: function (event, player) {
					player.gainlili();
				},
				prompt: "将一张牌当【杀】使用或打出",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					respondSha: true,
					skillTagFilter: function (player, event) {
						if (!player.countCards('he')) return false;
						if (player.getStat().skill.gezi_guihang > 1) return false;
						return true;
					},
					result: {
						player: function (player) {
							return 0.5;
						},
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 4;
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_guihang_cost": {
				trigger: {
					source: "damageAfter",
				},
				forced: true,
				filter: function (event, player) {
					return event.getParent().skill == 'gezi_guihang';
				},
				content: function () {
					player.discardPlayerCard('he', trigger.player, true);
					trigger.player.addTempSkill('gezi_guihang_flag');
				},
				mod: {
					globalFrom: function (from, to, distance) {
						if (to.hasSkill('gezi_guihang_flag')) {
							return distance - distance + 1;
						}
					},
				},
			},
			"gezi_guihang_2": {
				trigger: {
					player: "shaBefore",
				},
				direct: true,
				filter: function (event, player) {
					return event.skill == 'gezi_guihang';
				},
				content: function () {
					player.getStat().card.sha--;
				},
			},
			"gezi_guihang_flag": {
			},
			"gezi_wujian": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseBegin"],
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili;
				},
				spell: ["gezi_wujian_skill"],
				priority: 22,
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					for (var i = 0; i < player.lili; i++) {
						list.push(i);
					}
					// 这里AI还没写
					// 不知道AI要怎么写
					var choice = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] == player) continue;
						if (get.distance(player, players[i], 'attack') > 1) continue;
						if (get.attitude(player, players[i]) > 0) choice--;
						if (get.attitude(player, players[i]) <= 0) choice++;
					}
					player.chooseControl(list, function (event, player) {
						if (_status.event.choice > 0 && list.contains(player.lili - 2) && player.lili - 2 > 0) return player.lili - 2;
						return 0;
					}).set('prompt', '消耗任意点灵力').set('choice', choice);
					'step 1'
					if (result.control) {
						player.loselili(result.control);
						player.logSkill("gezi_wujian");
						player.storage.gezi_wujian = result.control;
						player.say('地狱「无间之狭间」！');
						player.Fuka();
					}
				},
			},
			"gezi_wujian_skill": {
				enable: "phaseUse",
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (player.hasSkill('gezi_wujian_skill2')) return false;
					if (!player.storage.gezi_wujian) return false;
					if (!player.getStat().skill.gezi_wujian_skill) return true;
					return player.getStat().skill.gezi_wujian_skill < player.storage.gezi_wujian;
				},
				content: function () {
					'step 0'
					event.choice = false;
					event.list = [];
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.distance(player, players[i], 'attack') <= 1 && players[i] != player) {
							event.list.push(players[i]);
						}
					}
					for (var j = 0; j < event.list.length; j++) {
						event.list[j].loselili();
						game.delay();
					}
					player.line(event.list, 'green');
					'step 1'
					for (var j = 0; j < event.list.length; j++) {
						if ((event.list[j].lili <= 1 || !event.list[j].node.lili) && event.list[j].countCards('he')) {
							player.gainPlayerCard(event.list[j], 'he', 1, true);
							event.choice = true;
						}
					}
					'step 2'
					if (event.choice == true) {
						player.addTempSkill('gezi_wujian_skill2');
						player.Fuka();
						var n = player.storage.gezi_wujian - player.getStat().skill.gezi_wujian_skill;
						if (n <= 0) return;
						player.gainlili(n);
					}
				},
				ai: {
					basic: {
						order: 10,
					},
					result: {
						player: 0.5,
					},
				},
			},
			"gezi_wujian_skill2": {
			},
			//莉莉黑
			"gezi_chunmian": {
				audio: "ext:东方project:4",
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili <= player.hp || player.lili == undefined;
				},
				check: function (event, player) {
					return game.countPlayer(function (current) {
						if (get.attitude(player, current) < 0) return -2;
						else return 2;
					}) > 0;
				},
				content: function () {
					"step 0"
					event.current = player;
					event.players = game.filterPlayer();
					player.line(event.players, 'black');
					"step 1"
					if (event.current.name == 'gezi_lilywhite') player.say('幻想乡需要迎接新的春天了！旧的春天需要革新了！');
					event.current.chooseTarget([1, 1], true, '弃置与你最近的一名其他角色一张牌', function (card, player, target) {
						// 不能选玩家
						if (player == target) return false;
						// 不能选“有比他离你更近”的玩家
						if (game.hasPlayer(function (current) {
							return current != player && get.distance(player, current) < get.distance(player, target);
						})) {
							return false;
						} else {
							if (target.countCards('he') || !game.hasPlayer(function (current) {
								return current != player && get.distance(player, current) == get.distance(player, target) && target.countCards('he')
							})) return true;
						}
						return false;
					}).set('ai', function (target) {
						if (-get.attitude(_status.event.player, target) && target.storage.gezi_chunmian) return 100;
						return -get.attitude(_status.event.player, target);
					});
					"step 2"
					if (result.bool) {
						event.current.line(result.targets, 'black');
						event.targets = result.targets;
						if (event.targets[0].countCards('he')) {
							event.current.discardPlayerCard(event.targets[0], 'he', [1, 1], true);
							event.targets[0].storage.gezi_chunmian = 1;
						}
					}
					if (event.current.next != player) {
						event.current = event.current.next;
						game.delay(0.5);
						event.goto(1);
					}
					"step 3"
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_chunmian) {
							players[i].draw();
							players[i].storage.gezi_chunmian = 0;
						}
					}
				},
			},
			"gezi_bamiao": {
				audio: "ext:东方project:4",
				enable: "phaseUse",
				usable: 2,
				filter: function (event, player) {
					return player.countCards('he') || player.lili;
				},
				content: function () {
					var choice = [];
					if (player.lili) {
						choice.push('消耗1点灵力，摸2张牌');
					}
					if (player.countCards('he')) {
						choice.push('获得1点灵力，重铸1张牌');
					}
					'step 0'
					player.chooseControl(choice).set('ai', function (event, player) {
						if (player.lili > 1 && player.lili >= player.hp - 1) {
							return '消耗1点灵力，摸2张牌';
						}
						return '获得1点灵力，重铸1张牌';
					});
					'step 1'
					if (result.control == '获得1点灵力，重铸1张牌') {
						player.gainlili();
						player.chooseCard('he', true);
					} else if (result.control == '消耗1点灵力，摸2张牌') {
						player.loselili();
						player.draw(2);
					}
					'step 2'
					if (result.bool && result.cards.length) {
						player.recast(result.cards[0]);
					}
				},
				ai: {
					order: 8,
					result: {
						player: function (player, target) {
							return 1;
						},
					},
				},
			},
			//梅蒂欣
			"gezi_zaidu": {
				group: ["gezi_zaidu2"],
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				direct: true,
				content: function () {
					'step 0'
					var prompt = '对一名体力不大于你的角色造成1点伤害';
					if (player.storage.gezi_zaidu == 'heal') prompt = '令一名体力不大于你的角色回复1点体力';
					if (player.storage.gezi_zaidu == 'damage') prompt = '对一名体力不大于你的角色造成1点雷电伤害';
					player.chooseTarget(prompt, function (card, player, target) {
						return target.hp <= player.hp;
					}).set('ai', function (target) {
						if (player.storage.gezi_zaidu == 'heal') return get.recoverEffect(target, player, player);
						if (player.storage.gezi_zaidu == 'damage') return get.damageEffect(target, player, player, 'thunder');
						return get.damageEffect(target, player, player);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_zaidu', result.targets[0]);
						if (!player.storage.gezi_zaidu) {
							result.targets[0].damage();
						} else if (player.storage.gezi_zaidu == 'heal') {
							result.targets[0].recover();
						} else if (player.storage.gezi_zaidu == 'damage') {
							result.targets[0].damage('thunder');
						}
					}
				},
				intro: {
					content: function (storage) {
						if (!storage) return null;
						if (storage == 'heal') return '【灾毒】：回复1点体力';
						if (storage == 'damage') return '【灾毒】：造成1点雷电伤害';
					},
				},
				ai: {
					threaten: 1.5,
				},
			},
			"gezi_zaidu2": {
				audio: "ext:东方project:2",
				forced: true,
				trigger: {
					player: "recoverAfter",
					source: "damageEnd",
				},
				filter: function (event, player) {
					return player.node.lili;
				},
				content: function () {
					player.gainlili();
				},
			},
			"gezi_zhanfang": {
				skillAnimation: true,
				audio: "ext:东方project:2",
				unique: true,
				priority: -10,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				filter: function (event, player) {
					return player.countCards('h') > player.hp;
				},
				content: function () {
					"step 0"
					player.awakenSkill('gezi_zhanfang');
					if (player.isDamaged()) {
						player.storage.gezi_zaidu = 'heal';
						lib.translate['gezi_zaidu_info'] = '结束阶段，你可以指定一名体力不大于你的角色，令其回复1点体力；你造成伤害后，或回复体力后，获得1点灵力。';
					} else {
						player.storage.gezi_zaidu = 'damage';
						lib.translate['gezi_zaidu_info'] = '结束阶段，你可以指定一名体力不大于你的角色，对其造成1点雷电伤害；你造成伤害后，或回复体力后，获得1点灵力。';
					}
					player.markSkill('gezi_zaidu');
					player.syncStorage('gezi_zaidu');
					player.gainMaxHp();
					player.removeSkill('gezi_zhanfang');
					player.update();
				},
			},
			"gezi_huayuan": {
				audio: "ext:东方project:4",
				trigger: {
					player: ["phaseBegin"],
				},
				cost: 1,
				group: ["gezi_huayuan_1", "gezi_huayuan_2"],
				priority: 22,
				spell: ["gezi_huayuan_3"],
				roundi: true,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_huayuan.cost;
				},
				content: function () {
					player.loselili(lib.skill.gezi_huayuan.cost);
					player.say('<符卡>毒气花园！');
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > 2;
				},
			},
			"gezi_huayuan_1": {
				audio: "ext:东方project:2",
				trigger: {
					global: "recoverBegin",
				},
				usable: 1,
				filter: function (event, player) {
					return player.isMaxHp() || (player.hasSkill("gezi_huayuan_3") && player.lili);
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseControl('令回复量-1', '令回复量+1', 'cancel2', function (event, player) {
						if (get.attitude(player, trigger.player) < 0) return '令回复量-1';
						if (get.attitude(player, trigger.player) > 0 && trigger.player.maxHp - trigger.player.hp > 1) return '令回复量+1';
						return 'cancel2';
					});
					'step 1'
					if (result.control == '令回复量-1') {
						if (!player.isMaxHp() && player.lili) {
							player.loselili();
						}
						player.logSkill("gezi_huayuan", trigger.player);
						game.log(player, '令', trigger.player, '回复体力量-1');
						trigger.num--;
					} else {
						if (!player.isMaxHp() && player.lili) {
							player.loselili();
						}
						player.logSkill("gezi_huayuan", trigger.player);
						game.log(player, '令', trigger.player, '回复体力量+1');
						trigger.num++;
					}
				},
			},
			"gezi_huayuan_2": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					global: ["recoverAfter", "damageEnd"],
				},
				filter: function (event, player) {
					if (!player.isMaxHp() && !player.hasSkill("gezi_huayuan_3")) return false;
					return event.player.hp == 0 || event.player.hp == event.player.maxHp;
				},
				content: function () {
					player.logSkill("gezi_huayuan", trigger.player);
					player.draw();
				},
			},
			"gezi_huayuan_3": {
			},
			//幽香
			"gezi_zanghua": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards('h') && !player.hasSkill('gezi_zanghua_boom');
				},
				filterTarget: function (card, player, target) {
					return player != target && target.countCards('h') > 0 && player.canCompare(target) && player.canUse({
						name: 'juedou'
					}, target);
				},
				content: function () {
					"step 0"
					player.chosenToCompare(target);
					if (target.name == 'gezi_marisa') target.say('幽香，这次我可不会输了！');
					if (target.name == 'gezi_alice') target.say('幽香……别低估我了。');
					"step 1"
					if (!result.tie) {
						if (result.bool) {
							if (player.canUse('juedou', target)) player.useCard({
								name: 'juedou'
							}, target);
						} else {
							if (target.canUse('juedou', player)) target.useCard({
								name: 'juedou'
							}, player);
						}
					} else {
						player.addTempSkill('gezi_zanghua_boom');
						player.gainlili(2);
					}
					"step 2"
					if (target.hp < player.hp) {
						player.addTempSkill('gezi_zanghua_boom');
						player.gainlili(2);
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							var hs = player.getCards('h');
							if (hs.length < 3) return 0;
							var bool = false;
							for (var i = 0; i < hs.length; i++) {
								if (get.number(hs[i]) >= 9 && get.value(hs[i]) < 7) {
									bool = true;
									break;
								}
							}
							if (!bool) return 0;
							if (target.countCards < hs.length) return -2;
							return -0.5;
						},
					},
					order: 7,
				},
			},
			"gezi_zanghua_boom": {
			},
			"gezi_xiaofeng": {
				audio: "ext:东方project:4",
				trigger: {
					player: ["phaseBegin"],
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (player.hp <= 2) return player.lili >= 2;
					else return player.lili > 4;
				},
				priority: 22,
				spell: ["gezi_xiaofeng1"],
				content: function () {
					if (player.hp <= 2) {
						player.loselili(2);
					} else {
						player.loselili(4);
					}
					player.say('幻想「花鸟风月，啸风弄月」。');
					player.useCard({
						name: 'gezi_huazhi'
					}, player);
					player.Fuka();
				},
				check: function (event, player) {
					return player.hp <= 2 && player.lili > 2;
				},
				ai: {
					damage: 1,
				},
			},
			"gezi_xiaofeng1": {
				trigger: {
					source: "damageBegin",
				},
				group: "gezi_xiaofeng2",
				direct: true,
				content: function () {
					player.logSkill("gezi_xiaofeng", trigger.source);
					trigger.num++;
				},
			},
			"gezi_xiaofeng2": {
				trigger: {
					player: "compare",
					target: "compare",
				},
				filter: function (event, player) {
					if (event.iwhile) return false;
					return true;
				},
				silent: true,
				forced: true,
				popup: false,
				content: function () {
					game.log(player, '拼点牌点数视为Q');
					if (player == trigger.player) {
						trigger.num1 = 12;
					} else {
						trigger.num2 = 12;
					}
				},
				mod: {
					attackFrom: function () {
						return -Infinity;
					},
				},
			},
			/*-------------------文花-------------------*/
			//文
			"gezi_kuanglan": {
				trigger: {
					global: "phaseEnd",
				},
				audio: "ext:东方project:4",
				group: ["gezi_kuanglan_1", "gezi_kuanglan_2", "gezi_kuanglan_3", "gezi_kuanglan_4", "gezi_kuanglan_5"],
				filter: function (event, player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_kuanglan && player != players[i]) return true;
					}
					return false;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('选择一名采访目标！', function (card, player, target) {
						return player != target && player.canUse('gezi_caifang', target) && target.storage.gezi_kuanglan;
					}).set('ai', function (target) {
						return -get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool && result.targets) {
						if (lib.config.background_audio) {
							game.playlili('shutter');
						}
						player.logSkill("gezi_kuanglan", result.targets[0]);
						player.useCard({
							name: 'gezi_caifang'
						}, result.targets[0], false);
						if (result.targets[0].name == 'gezi_hetate') player.say('幻想乡最速取材，射命丸文参上~');
					}
				},
			},
			"gezi_kuanglan_1": {
				trigger: {
					global: "useSkillAfter",
				},
				direct: true,
				filter: function (event, player) {
					if (!event.player) return false;
					// return ((event.skill == '_tanpai' && event.player.identity == 'zhu') ||event.skill == '_tanyibian');
					return event.skill == '_tanpai';
				},
				content: function () {
					trigger.player.storage.gezi_kuanglan = true;
				},
			},
			"gezi_kuanglan_2": {
				trigger: {
					global: "useCardAfter",
				},
				direct: true,
				filter: function (event, player) {
					return (event.card && get.type(event.card) == 'basic' && event.player);
				},
				content: function () {
					trigger.player.storage.gezi_kuanglan = true;
				},
			},
			"gezi_kuanglan_3": {
				trigger: {
					global: "dieAfter",
				},
				direct: true,
				filter: function (event, player) {
					return event.source && event.source.isIn();
				},
				content: function () {
					trigger.player.storage.gezi_kuanglan = true;
				},
			},
			"gezi_kuanglan_4": {
				trigger: {
					global: "phaseAfter",
				},
				direct: true,
				priority: -100,
				filter: function (event, player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_kuanglan) return true;
					}
					return false;
				},
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_kuanglan) delete players[i].storage.gezi_kuanglan;
					}
				},
			},
			"gezi_kuanglan_5": {
				direct: true,
				trigger: {
					global: "turnOverAfter",
				},
				filter: function (event, player) {
					return event.player.isTurnedOver();
				},
				content: function () {
					trigger.player.storage.gezi_kuanglan = true;
				},
			},
			"gezi_fengmi": {
				audio: "ext:东方project:4",
				spell: ["gezi_fengmi_1"],
				cost: 0,
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_fengmi.cost;
				},
				check: function (event, player) {
					return player.lili > 1;
				},
				content: function () {
					player.loselili(lib.skill.gezi_fengmi.cost);
					player.Fuka();
					player.say('「幻想风靡」！');
				},
			},
			"gezi_fengmi_1": {
				trigger: {
					player: ["phaseUseBefore", "phaseDrawBefore", "phaseDiscardBefore"],
				},
				filter: function (event, player) {
					return player.lili;
				},
				direct: true,
				content: function () {
					'step 0'
					event.str = '跳过' + get.translation(trigger.name);
					player.chooseControl('消耗1点灵力', event.str, 'cancel', function (event, player) {
						if (trigger.name == 'phaseDiscard') return event.str;
						if (player.lili > 1 && trigger.name == 'phaseDraw') return '消耗1点灵力';
						if (player.lili > 1 && trigger.name == 'phaseUse') return '消耗1点灵力';
						return 'cancel';
					}).set('prompt2', "消耗1点灵力，或跳过当前阶段，视为使用了一张【过河拆桥】。");
					'step 1'
					if (result.control) {
						if (result.control == '消耗1点灵力') {
							player.loselili();
						}
						if (result.control == event.str) trigger.cancel();
						player.chooseTarget('选择一名【过河拆桥】的角色', function (card, player, target) {
							return player.canUse({
								name: 'guohe'
							}, target);
						}).set('ai', function (target) {
							return get.effect(target, {
								name: 'guohe'
							}, _status.event.player);
						});
					}
					'step 2'
					if (result.bool && result.targets) {
						player.logSkill("gezi_fengmi", result.targets[0]);
						player.useCard({
							name: 'guohe'
						}, result.targets[0], false);
					}
				},
			},
			//果
			"gezi_nianxie": {
				group: ["gezi_nianxie_storage", "gezi_nianxie_remove"],
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				frequent: true,
				content: function () {
					'step 0'
					if (lib.config.background_audio) {
						game.playlili('shutter');
					}
					player.judge(function (card) {
						if (!player.storage.gezi_nianxie_storage.contains(get.suit(card))) return -1;
						return 1;
					});
					'step 1'
					event.card = result.card;
					if (player.storage.gezi_nianxie_storage.contains(get.suit(result.card))) {
						player.chooseTarget(true, '选择一名角色送出' + get.translation(result.card), function (card, player, target) {
							return true;
						}).set('ai', function (target) {
							var att = get.attitude(_status.event.player, target);
							return att;
						});
					} else {
						event.finish();
					}
					'step 2'
					if (result.targets.length) {
						player.line(result.targets, 'green');
						result.targets[0].gain(event.card, 'gain2');
						if (result.targets[0].name == 'gezi_aya') result.targets[0].say('嗯，摄影技术大大提高了呢，果。');
					}
				},
			},
			"gezi_nianxie_storage": {
				init: function (player) {
					player.storage.gezi_nianxie_storage = [];
				},
				popup: false,
				forced: true,
				mark: true,
				intro: {
					content: function (storage, player) {
						var str = '';
						for (var i = 0; i < player.storage.gezi_nianxie_storage.length; i++) {
							str += get.translation(player.storage.gezi_nianxie_storage[i]) + ',';
						}
						return str;
					},
				},
				trigger: {
					global: "loseEnd",
				},
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == 'd') {
							if (!player.storage.gezi_nianxie_storage) {
								player.storage.gezi_nianxie_storage = [get.suit(trigger.cards[i])];
							} else {
								if (!player.storage.gezi_nianxie_storage.contains(get.suit(trigger.cards[i]))) {
									player.storage.gezi_nianxie_storage.push(get.suit(trigger.cards[i]));
								}
							}
						}
					}
					if (_status.currentPhase == player) {
						player.markSkill('gezi_nianxie_storage');
						player.syncStorage('gezi_nianxie_storage');
					}
				},
			},
			"gezi_nianxie_remove": {
				popup: false,
				forced: true,
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					if (_status.currentPhase == player) {
						player.markSkill('gezi_nianxie_storage');
						player.syncStorage('gezi_nianxie_storage');
					} else {
						player.storage.gezi_nianxie_storage = [];
						player.unmarkSkill('gezi_nianxie_storage');
						player.syncStorage('gezi_nianxie_storage');
					}
				},
			},
			"gezi_jilan": {
				mod: {
					globalTo: function (from, to, distance) {
						if (to.lili > from.lili && to.hasSkill('gezi_jilan')) return distance + 10000;
						return distance;
					},
				},
			},
			"gezi_lianxu": {
				audio: "ext:东方project:4",
				trigger: {
					player: "phaseBegin",
				},
				spell: ["gezi_lianxu2"],
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 1;
				},
				check: function (event, player) {
					var att = 0;
					att += player.lili;
					att += (4 - player.hp);
					att += (player.hp - player.countCards('h'));
					return att > 3;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.say("连拍「连续摄像」！");
				},
			},
			"gezi_lianxu2": {
				enable: "phaseUse",
				group: ["gezi_lianxu3"],
				init: function (player) {
					player.storage.gezi_lianxu3 = [];
					player.storage.gezi_lianxu2 = 0;
				},
				onremove: function (player) {
					player.storage.gezi_lianxu3 = [];
					player.storage.gezi_lianxu2 = 0;
					player.syncStorage('gezi_lianxu3');
					player.unmarkSkill('gezi_lianxu3');
					delete player.storage.gezi_lianxu3;
				},
				direct: true,
				filter: function (event, player) {
					if (player.storage.gezi_lianxu2 >= 3) return false;
					var cards = player.getCards('h');
					for (var i in cards) {
						return true;
					}
					return false;
				},
				selectCard: 1,
				filterCard: function (card, player) {
					return player.storage.gezi_lianxu3.contains(get.number(card)) || player.storage.gezi_lianxu3.contains(get.suit(card));
				},
				content: function () {
					player.logSkill("gezi_lianxu", player);
					if (lib.config.background_audio) {
						game.playlili('shutter');
					}
					player.storage.gezi_lianxu2++;
					player.draw(2);
				},
				ai: {
					basic: {
						order: 5,
					},
					result: {
						player: 1,
					},
					tag: {
						draw: 2,
					},
				},
			},
			"gezi_lianxu3": {
				init: function (player) {
					player.storage.gezi_lianxu3 = [];
				},
				onremove: function (player) {
					player.storage.gezi_lianxu3 = [];
					player.syncStorage('gezi_lianxu3');
					player.unmarkSkill('gezi_lianxu3');
					delete player.storage.gezi_lianxu3;
				},
				popup: false,
				forced: true,
				mark: true,
				intro: {
					content: function (storage, player) {
						var str = '';
						for (var i = 0; i < player.storage.gezi_lianxu3.length; i++) {
							str += get.translation(player.storage.gezi_lianxu3[i]) + ',';
						}
						return str;
					},
				},
				trigger: {
					global: "loseEnd",
				},
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == 'd') {
							if (!player.storage.gezi_lianxu3) {
								player.storage.gezi_lianxu3 = [get.number(trigger.cards[i]), get.suit(trigger.cards[i])];
							} else {
								if (!player.storage.gezi_lianxu3.contains(get.number(trigger.cards[i]))) {
									player.storage.gezi_lianxu3.push(get.number(trigger.cards[i]));
								}
								if (!player.storage.gezi_lianxu3.contains(get.suit(trigger.cards[i]))) {
									player.storage.gezi_lianxu3.push(get.suit(trigger.cards[i]));
								}
							}
						}
					}
					player.markSkill('gezi_lianxu3');
					player.syncStorage('gezi_lianxu3');
				},
			},
			/*-------------------秘封-------------------*/
			//莲子
			"gezi_xingdu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				frequent: true,
				content: function () {
					'step 0'
					var cards = get.cards(2);
					player.viewCards('牌堆顶的两张牌', cards);
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
					}
					player.chooseBool('是否将本回合的摸牌改为从牌堆底摸？').set('ai', function () {
						return 7 - get.value(cards);
					});
					'step 1'
					if (result.bool) {
						game.log(player, '本回合摸牌改为从牌堆底摸');
						player.addTempSkill('gezi_xingdu_1');
					}
					player.draw();
				},
			},
			"gezi_xingdu_1": {
				audio: "ext:东方project:2",
				trigger: {
					player: "drawBegin",
				},
				forced: true,
				content: function () {
					trigger.bottom = true;
				},
			},
			"gezi_sihuan": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				group: "gezi_dshift",
				direct: true,
				filter: function (event, player) {
					if (player.hasSkill('gezi_sihuan_1') && player.hasSkill('gezi_sihuan_2') && player.hasSkill('gezi_sihuan_3') && player.hasSkill('gezi_sihuan_4')) return false;
					return player.countCards('he');
				},
				filterCard: function () {
					return true;
				},
				position: "he",
				prompt: "选择一张牌发动【似幻】？",
				discard: false,
				lose: false,
				content: function () {
					'step 0'
					var list = [];
					if (!player.hasSkill('gezi_sihuan_1')) list.push('增加2点灵力上限和灵力，直到回合结束，摸两张牌');
					if (!player.hasSkill('gezi_sihuan_2') && game.hasPlayer(function (current) {
						return current.storage._tanpai && current.countCards('he');
					})) list.push('获得有异变牌的一名角色一张牌');
					if (!player.hasSkill('gezi_sihuan_3')) list.push('贴上一张技能牌');
					if (!player.hasSkill('gezi_sihuan_4') && game.hasPlayer(function (current) {
						return current.isTurnedOver();
					})) list.push('将弃置牌交给一名翻面的角色');
					if (!list.length) event.finish();
					event.list = list;

					player.chooseControlList(event.list, function (event, player) {
						if (event.list.contains('增加2点灵力上限和灵力，直到回合结束，摸两张牌')) return event.list.indexOf('增加2点灵力上限和灵力，直到回合结束，摸两张牌');
						if (game.hasPlayer(function (current) {
							return current.isTurnedOver() && get.attitude(player, current) > 0;
						}) && event.list.contains('将弃置牌交给一名翻面的角色')) return event.list.indexOf('将弃置牌交给一名翻面的角色');
						if (game.hasPlayer(function (current) {
							return current.storage._tanpai && get.attitude(player, current) < 0 && current.countCards('he');
						}) && event.list.contains('获得有异变牌的一名角色一张牌')) return event.list.indexOf('获得有异变牌的一名角色一张牌');
						if (event.list.contains('贴上一张技能牌')) return event.list.indexOf('贴上一张技能牌');
						return 'cancel2';
					});
					'step 1'
					if (result.control) {
						if (result.control != 'cancel2') {
							player.logSkill("gezi_sihuan", player);
							player.discard(cards);
						} else {
							event.finish();
						}
						if (event.list[result.index] == '增加2点灵力上限和灵力，直到回合结束，摸两张牌') {
							player.addTempSkill('gezi_sihuan_1');
							player.draw(2);
							event.control = 'gezi_sihuan_1';
						} else if (event.list[result.index] == '获得有异变牌的一名角色一张牌') {
							player.addTempSkill('gezi_sihuan_2');
							event.control = 'gezi_sihuan_2';
							player.chooseTarget('获得有异变牌的一名角色一张牌', function (card, player, target) {
								return target.storage._tanpai;
							}).set('ai', function (target) {
								return -get.attitude(_status.event.player, target);
							});
						} else if (event.list[result.index] == '贴上一张技能牌') {
							player.addTempSkill('gezi_sihuan_3');
							event.control = 'gezi_sihuan_3';
							player.useSkill('gezi_jinengpai_use');
						} else if (event.list[result.index] == '将弃置牌交给一名翻面的角色') {
							player.addTempSkill('gezi_sihuan_4');
							event.control = 'gezi_sihuan_4';
							player.chooseTarget('将' + get.translation(cards[0]) + '交给一名翻面的角色，并令其翻回正面。', function (card, player, target) {
								return target.isTurnedOver();
							}).set('ai', function (target) {
								return get.attitude(_status.event.player, target);
							});
						}
					}
					'step 2'
					if (result.targets) {
						if (event.control == 'gezi_sihuan_2') {
							player.gainPlayerCard(result.targets[0], 'he', true);
						} else if (event.control == 'gezi_sihuan_4') {
							result.targets[0].gain(cards[0], player);
							player.$give(cards[0], result.targets[0]);
							result.targets[0].turnOver();
						}
					}
				},
				ai: {
					basic: {
						order: 10,
					},
					result: {
						player: function (player) {
							if (!player.hasSkill('gezi_sihuan_3')) return 1;
							return 0;
						},
					},
				},
			},
			"gezi_sihuan_1": {
				init: function (player) {
					player.gainMaxlili(2);
					player.gainlili(2);
				},
				onremove: function (player) {
					player.gainMaxlili(-2);
				},
			},
			"gezi_sihuan_2": {
			},
			"gezi_sihuan_3": {
			},
			"gezi_sihuan_4": {
			},
			//梅莉
			"gezi_xijian": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				frequent: true,
				content: function () {
					'step 0'
					if (ui.cardPile.childNodes.length == 0) {
						var cards = get.cards(1);
						ui.cardPile.insertBefore(cards, ui.cardPile.firstChild);
					}
					event.card = get.bottomCards()[0];
					var content = ['牌堆底的一张牌', [event.card]];
					game.log(player, '观看了牌堆底的一张牌');
					player.chooseControl('ok').set('dialog', content);
					var list = ['将这张牌交给一名角色'];
					if (game.hasPlayer(function (current) {
						if (lib.card[event.card.name].notarget == true) return false;
						return player.canUse(event.card, current);
					})) {
						list.push('使用这张牌');
					}
					player.chooseControl(list, function (event, player) {
						if (list.contains('使用这张牌') && game.hasPlayer(function (current) {
							return player.canUse(event.card, current) && get.effect(current, event.card, player, player) > 0;
						})) {
							return '使用这张牌';
						}
						return '将这张牌交给一名角色';
					});
					'step 1'
					if (result.control) {
						if (result.control == '使用这张牌') {
							player.$gain(event.card);
							player.gain(event.card);
							player.chooseToUse('隙见：使用' + get.translation(event.card), {
								name: event.card.name,
								suit: event.card.suit,
								number: event.card.number
							}, function (card, player, target) {
								return player.canUse(event.card, target);
							});
						} else if (result.control == '将这张牌交给一名角色') {
							player.chooseTarget('将' + get.translation(event.card) + '交给一名角色').set('ai', function (target) {
								return get.attitude(_status.event.player, target);
							});
							player.addTempSkill('gezi_sihuan_2');
						}
					}
					'step 2'
					if (result.targets && player.hasSkill('gezi_sihuan_2')) {
						result.targets[0].gain(event.card, player);
						player.$give(event.card, result.targets[0]);
						if (result.targets[0].name == 'gezi_renko') result.targets[0].say('啊，谢谢你梅莉！');
					}
				},
			},
			"gezi_rumeng": {
				audio: "ext:东方project:2",
				derivation: "gezi_mengjing",
				group: ["gezi_dshift", "gezi_rumeng_2"],
				trigger: {
					player: "phaseZhunbeiAfter",
				},
				content: function () {
					"step 0"
					player.loseMaxHp();
					player.addTempSkill('gezi_mengjing2', {
						player: "phaseBegin"
					});
					player.useSkill('gezi_mengjing2');
					game.log(player, '减少了一点体力上限');
					player.update();
					"step 1"
					if (player.maxHp <= 3) {
						player.removeSkill('gezi_rumeng');
					}
				},
				check: function (event, player) {
					return player.isDamaged() && player.maxHp > 4;
				},
			},
			"gezi_rumeng_2": {
				trigger: {
					player: "changeHp",
				},
				direct: true,
				priority: 30,
				filter: function (event, player) {
					if (event.num == 0) return false;
					return player.maxHp < 5;
				},
				content: function () {
					player.logSkill("gezi_rumeng", player);
					player.gainMaxHp();
				},
			},
			"gezi_dshift": {
				audio: "ext:东方project:1",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return !player.hasSkill('gezi_dshift2');
				},
				forced: true,
				content: function () {
					'step 0'
					player.chooseTarget('选择跨入幻想之扉的两名角色', [2, 2], true, function (card, player, target) {
						return player.canUse({
							name: 'gezi_huanxiang'
						}, target);
					}).set('ai', function (target) {
						var att = get.attitude(_status.event.player, target);
						return att / 3;
					});
					'step 1'
					if (result.bool) {
						player.useCard({
							name: 'gezi_huanxiang'
						}, result.targets);
					}
					player.addSkill('gezi_dshift2');
				},
			},
			"gezi_dshift2": {
			},
			/*-------------------图鉴-------------------*/
			//阿求
			"library_mengji": {
				audio: "ext:东方project:2",
				direct: true,
				trigger: {
					global: "gameStart",
					player: "enterGame",
				},
				group: "library_mengji2",
				content: function () {
					'step 0'
					if (lib.config.gameRecord.incident) {
						var data = lib.config.gameRecord.incident.data;
						var l = [];
						for (var i in data) {
							if (i == 'akyuu') continue;
							if (i == 'cong') continue;
							if (l.length == 0) {
								l.push(i);
								continue;
							}
							var h = 0;
							while (l.length >= h) {
								if (h == l.length) {
									l.push(i);
									break;
								} else if (i[0] < data[l[h]][0]) {
									l.splice(h, 0, i);
								}
								h++;
							}
						}
						player.storage.library_mengji = l;
					}
					'step 1'
					if ((player.storage.library_mengji && !player.storage.library_mengji.length) || !player.storage.library_mengji) {
						if (!player.storage.library_mengji) player.storage.library_mengji = [];

						lib.card['gezi_library'] = {
							type: "zhenfa",
							subtype: "yibianpai",
							audio: true,
							image: 'ext:/东方project/library_mengji.png',
							enable: true,
							vanish: true,
							selectTarget: -1,
							filterTarget: function (card, player, target) {
								return target == player;
							},
							modTarget: true,
							incidentskills: ["library_win"],
							skills: ["library_normal"],
							content: function () {
								target.addIncident(game.createCard('gezi_library', 'yibianpai', ''));
							},
						}
						lib.translate['gezi_library'] = '平和';
						lib.translate['gezi_library_info'] = '<u>胜利条件：</u>无。<br/><u>异变效果：</u>这是在没有异变牌记录时填充的牌，没有任何效果。';
						player.storage.library_mengji.push('gezi_library');
					}
				},
			},
			"library_mengji2": {
				forced: true,
				direct: true,
				trigger: {
					player: "phaseBegin",
				},
				content: function () {
					player.logSkill('library_mengji', player);
					game.pause();
					var name = false;
					if (player.storage._tanpai) {
						name = player.storage._tanpai[0];
						player.lose(name, ui.special);
						player.storage._tanpai = [];
						for (var i = 0; i < get.info(name).incidentskills.length; i++) {
							player.removeSkill(get.info(name).incidentskills[i]);
						}
						for (var i = 0; i < get.info(name).skills.length; i++) {
							player.removeSkill(get.info(name).skills[i]);
						}
						game.log(player, '弃置了异变牌', name);
					}
					name = name.name;
					if (player.storage.library_mengji) {
						var index = 0;
						// indexOf 如果没有找到的话就返回-1。
						if (name) index = player.storage.library_mengji.indexOf(name);
						if (index == player.storage.library_mengji.length - 1 || index < 0) {
							index = -1;
						}
						index++;
						player.addIncident(game.createCard(player.storage.library_mengji[index], 'yibianpai', ''));
						player.say('本轮的异变是' + get.translation(player.storage.library_mengji[index]) + '。');
						setTimeout(function () {
							game.resume();
						}, 2500);
					}
				},
			},
			"library_normal": {
			},
			"library_win": {
			},
			"library_yixiang": {
				audio: "ext:东方project:2",
				enable: 'phaseUse',
				filterCard: true,
				selectCard: [1, 3],
				discard: false,
				prepare: 'give2',
				usable: 1,
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					return 10 - get.value(card);
				},
				content: function () {
					target.gain(cards, player);
					player.draw(cards.length);
					target.markSkillCharacter('library_yixiang', player, '忆想（防止）', '因牌以外的方式受到伤害前，或被其他角色弃置/获得牌时，可以弃置一张牌，防止之。');
					target.storage.library_yixiang = player;
					target.addSkill('yixiang_defend');
				},
				ai: {
					order: 7,
					result: {
						target: function (card, player, target) {
							return 1;
						},
					}
				},
			},
			"yixiang_defend": {
				group: ['yixiang_expire', 'yixiang_defend_2'],
				trigger: {
					player: 'damageBefore',
				},
				filter: function (event, player) {
					if (event.getParent('useCard')) return false;
					return player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseToDiscard('he').set('ai', function (card) {
						return 10 - get.value(card);
					});
					'step 1'
					if (result.bool) {
						trigger.cancel();
					}
				},
			},
			"yixiang_defend_2": {
				trigger: {
					target: ['discardPlayerCardBegin', 'gainPlayerCardBegin'],
				},
				filter: function (event, player) {
					if (event.target && event.player == event.target) return false;
					return player.countCards('he');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseToDiscard('he').set('ai', function (card) {
						var player = _status.event.player;
						if (get.attitude(player, trigger.player) > 0) return 0;
						return 10 - get.value(card);
					});
					'step 1'
					if (result.bool) {
						trigger.cancel();
					}
				},
			},
			"yixiang_expire": {
				direct: true,
				trigger: {
					global: 'phaseBegin'
				},
				filter: function (event, player) {
					return player.storage.library_yixiang == event.player;
				},
				content: function () {
					player.unmarkSkill('library_yixiang');
					player.removeSkill('yixiang_defend');
				},
			},
			/*-------------------boss-------------------*/
			//祸灵梦
			"gezi_fenggui": {
				trigger: {
					global: "gameStart",
				},
				audio: "ext:东方project:2",
				forced: true,
				unique: true,
				content: function () {
					"step 0"
					var list = ['gezi_needle', 'gezi_yinyangyuguishen'];
					for (var i = 0; i < list.length; i++) {
						list[i] = ['', '', list[i]];
					}
					if (list.length) {
						player.chooseButton(['选择本次闯关使用的装备', [list, 'vcard']], true).set('ai', function () {
							return 'gezi_needle';
						});
					}
					"step 1"
					if (result.bool) {
						player.equip(game.createCard({
							name: result.links[0][2]
						}));
					}
				},
			},
			"gezi_lingji": {
				audio: "ext:东方project:2",
				trigger: {
					player: "damageAfter",
					source: "damageAfter",
				},
				group: ["saiqian_use", "saiqian_die"],
				forced: true,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					"step 0"
					player.judge(function (card) {
						return get.color(card) == 'red' ? 1 : -1;
					});
					"step 1"
					if (result.bool) {
						player.gain(result.card, 'draw2');
					} else {
						player.gainlili();
					}
				},
			},
			"saiqian_use": {
				direct: true,
				trigger: {
					global: "useCard",
				},
				filter: function (event, player) {
					return event.player != player && event.card.name == 'gezi_saiqianxiang' && get.mode() == 'boss';
				},
				content: function () {
					player.say('我的赛钱箱！你要是敢对它做什么奇怪的事情……');
				},
			},
			"saiqian_die": {
				direct: true,
				trigger: {
					global: "loseEnd",
				},
				filter: function (event, player) {
					if (event.player == player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].name == 'gezi_saiqianxiang' && get.position(event.cards[i]) == 'd') return true;
					}
					return false;
				},
				content: function () {
					game.pause();
					player.say('啊啊啊啊啊啊啊啊，你对我的赛钱箱做了什么！！！！！！');
					setTimeout(function () {
						player.say('你，我要把你变成十八层地狱底层的锅底废油！');
						setTimeout(function () {
							player.gainMaxlili();
							player.gainlili(player.maxlili - player.lili);
							player.updatelili();
							game.resume();
						}, 2500);
					}, 2500);
				},
			},
			"gezi_mengxiangtiansheng": {
				audio: "ext:东方project:2",
				trigger: {
					player: ["phaseZhunbeiBegin", "phaseJieshuEnd"],
				},
				forced: true,
				filter: function (event, player) {
					return player.lili || !player.node.lili;
				},
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (!player.canUse('sha', players[i], false)) players.remove(players[i]);
					}
					players.remove(player);
					player.loselili();
					player.useCard({
						name: 'sha'
					}, players, false);
				},
			},
			"gezi_bianshenlingmeng": {
				mode: ["stg"],
				unique: true,
				locked: true,
				silent: true,
				priority: 4,
				trigger: {
					global: "gameStart",
				},
				filter: function (event, player) {
					return player == game.me;
				},
				content: function () {
					'step 0'
					var controls = ['gezi_reimu', 'gezi_huolingmeng'];
					player.chooseControl(controls).set('ai', function () {
						return 'gezi_reimu';
					}).set('prompt', "请选择目标人物");
					'step 1'
					if (result.control == 'gezi_huolingmeng') {
						if (lib.character.gezi_reimu) {
							lib.character.gezi_reimu[3] = ['gezi_lingji', 'gezi_mengxiangtiansheng'];
						}
						player.removeSkill('gezi_yinyang');
						player.removeSkill('gezi_mengdie');
						player.removeSkill('gezi_mengxiang');
						player.removeSkill('gezi_cuimeng');
						player.addnSkill('gezi_lingji');
						player.addnSkill('gezi_mengxiangtiansheng');
						player.setAvatar('gezi_reimu', 'gezi_huolingmeng');
						player.update();
					}
				},
				forced: true,
				popup: false,
			},
			"gezi_mengxian": {
				trigger: { player: 'useCardToPlayered' },
				filter: function (event, player) {
					return get.color(event.card) == 'red' && event.target.countCards('h') > event.target.hp;
				},
				check: (event, player) => get.attitude(player, event.player) < 0,
				content: function () {
					'step 0'
					event.list = lib.suit.slice();
					event.suits = [];
					event.num = 0;
					var cards = trigger.target.getCards('h'), map = {}, max = -Infinity;
					for (var card of cards) {
						var suit = get.suit(card);
						if (!map[suit]) map[suit] = 0;
						map[suit]++;
						if (map[suit] > max) max = map[suit];
					}
					for (var i in map) {
						if (map[i] == max) event.suits.push(i);
					}
					'step 1'
					player.chooseControl(event.list).set('prompt', '梦限：猜测' + get.translation(trigger.target) + '手牌中最多的花色').set('ai', () => {
						var player = _status.event.getParent().player, controls = _status.event.controls;
						if (player.countCards('h') <= 3 && controls.includes('diamond') && Math.random() < 0.3) return 'diamond';
						return controls.randomGet();
					});
					'step 2'
					var control = result.control;
					player.chat('我猜是' + get.translation(control) + '！');
					game.log(player, '猜测为', '#y' + control);
					if (!event.isMine() && !event.isOnline()) game.delayx();
					'step 3'
					var control = result.control;
					if (event.suits.includes(control)) {
						trigger.target.chat('猜对了！');
						game.log(player, '猜测', '#y错误');
						trigger.directHit.add(trigger.target);
					}
				}
			},
			"gezi_yichong": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (!player.canUseFuka()) return false;
					return player.getLili() > 3;
				},
				priority: 22,
				spell: ["gezi_yichong1"],
				roundi: true,
				content: function () {
					player.loselili(4);
					player.Fuka();
				},
				check: function (event, player) {
					return player.getLili() > 2 && player.hp >= 2 && player.countCards('h') > 2;
				},
			},
			"gezi_yichong1": {
				forced: true,
				trigger: {
					source: "damageBegin1",
					player: "damageBegin3",
				},
				content: function () {
					trigger.num = (trigger.player == player ? player.hp : trigger.player.hp);
				},
				group: 'gezi_yichong1_draw',
				subSkill: {
					draw: {
						trigger: {
							player: "gainliliBegin",
						},
						content: function () {
							player.draw(trigger.num);
						},
					}
				}
			},
			"gezi_juewang": {
				group: ['gezi_juewang_1', 'gezi_juewang_2', 'gezi_juewang_3', 'gezi_juewang_4'],
			},
			"gezi_juewang_1": {
				global: 'gezi_juewang_12',
				trigger: { player: 'useCardAfter' },
				forced: true,
				popup: false,
				init: function (player) {
					player.storage.gezi_juewang_1 = [];
				},
				filter: function (event, player) {
					return get.tag(event.card, 'damage') == 0 && !player.storage.gezi_juewang_1.includes(get.suit(event.card, player)) && get.suit(event.card, player);
				},
				content: function () {
					player.storage.gezi_juewang_1.push(get.suit(event.card, player))
				},
				group: 'gezi_juewang_1_rem',
				subSkill: {
					rem: {
						trigger: {
							player: "phaseEnd",
						},
						silent: true,
						forced: true,
						content: function () {
							player.storage.gezi_juewang_1 = [];
						}
					}
				},
				suitbanned: function () {
					var suits = lib.suit.slice(0);
					for (var i of game.players) {
						if (!i.storage.gezi_juewang_1) continue;
						if (suits.includes(i.storage.gezi_juewang_1)) suits.remove(i.storage.gezi_juewang_1);
					}
					return suits;
				}
			},
			"gezi_juewang_12": {
				mod: {
					"cardEnabled2": function (card) {
						var suits = lib.skill.gezi_juewang_1.suitbanned();
						if (get.position(card) == 'h' && !suits.includes(get.suit(card))) return false;
					},
				},
			},
			"gezi_juewang_2": {
				trigger: {
					player: "phaseBegin",
				},
				frequent: true,
				content: function () {
					"step 0"
					event.players = game.filterPlayer(function (current) {
						return current.isEnemyOf(player) && current.maxHp <= 2;
					});
					"step 1"
					if (event.players.length) {
						var current = event.players.shift();
						player.line(current, 'thunder');
						current.damage('thunder');
						event.redo();
					}
				},
				ai: {
					threaten: 2,
				},
			},
			"gezi_juewang_3": {
				trigger: {
					source: "damageBegin",
				},
				forced: true,
				filter: function (event, player) {
					return event.nature == undefined;
				},
				content: function () {
					trigger.num++;
				},
			},
			"gezi_juewang_4": {
				trigger: {
					global: "recoverEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player != player;
				},
				content: function () {
					trigger.player.chooseToDiscard('he', trigger.num, true);
				},
				ai: {
					threaten: 1.2,
				},
			},
			"gezi_lianyu": {
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (!player.canUseFuka()) return false;
					return player.getLili() > 2;
				},
				priority: 22,
				spell: ["gezi_lianyu1"],
				roundi: true,
				content: function () {
					player.loselili(2);
					player.Fuka();
				},
			},
			"gezi_lianyu1": {
				trigger: {
					player: "phaseEnd",
				},
				unique: true,
				content: function () {
					"step 0"
					event.players = game.filterPlayer(function (current) {
						return current.isEnemyOf(player);
					});
					"step 1"
					if (event.players.length) {
						var current = event.players.shift();
						player.line(current, 'fire');
						current.damage('fire');
						event.redo();
					}
				},
				ai: {
					threaten: 2,
				},
				group: 'gezi_lianyu1_kill',
				subSkill: {
					kill: {
						trigger: {
							source: 'dying'
						},
						forced: true,
						filter: function (event, player) {
							if (event.player.hasSkill('revive_boss') && game.me.storage.reskill && game.me.storage.reskill.length > 0) return false;
							return true;
						},
						content: function () {
							"step 0"
							trigger.cancel()
							"step 1"
							var next = trigger.player.die()
							next.source = player;
						},
					}
				}
			},

			/*-------------------stg-------------------*/
			"gezi_hongyue": {
				audio: "ext:东方project:2",
				unique: true,
				zhuSkill: true,
				trigger: {
					global: "gameStart",
					player: "enterGame",
				},
				filter: function (event, player) {
					return player.hasZhuSkill('gezi_hongyue');
				},
				forced: true,
				content: function () {
					player.addIncident(game.createCard('gezi_scarlet', 'yibianpai', ''));
				},
			},
			"gezi_cuimeng": {
				audio: "ext:东方project:2",
				unique: true,
				zhuSkill: true,
				trigger: {
					global: "gameStart",
					player: "enterGame",
				},
				filter: function (event, player) {
					return player.hasZhuSkill('gezi_cuimeng');
				},
				forced: true,
				content: function () {
					player.addIncident(game.createCard('gezi_immaterial', 'yibianpai', ''));
				},
			},

			/*-------------------采花集-------------------*/
			//魔导书塔
			"gezi_juguang": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				init: function (player) {
					player.equip(game.createCard('stg_woodbook'));
					player.equip(game.createCard('stg_firebook'));
					player.equip(game.createCard('stg_goldbook'));
					player.equip(game.createCard('stg_waterbook'));
					player.equip(game.createCard('stg_dirtbook'));
				},
				content: function () {
					"step 0"
					player.skip('phaseUse');
					player.skip('phaseDraw');
					player.skip('phaseDiscard');
					player.chooseTarget(get.prompt('gezi_juguang'), true, function (card, player, target) {
						return player.canUse({
							name: 'sha'
						}, target, false);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: 'sha'
						}, _status.event.player);
					});
					"step 1"
					if (result.bool) {
						player.logSkill('gezi_juguang', result.targets);
						player.useCard({
							name: 'sha'
						}, result.targets[0], false);
					}
				},
				check: function (event, player) {
					return false;
				},
			},
			//琪露诺boss
			"bianshen_cirno": {
				audio: 1,
				trigger: { player: ['damageAfter', 'gainAfter', 'loseHpAfter'] },
				forced: true,
				skillAnimation: true,
				init: function (player) {
					player.lili = 0;
				},
				filter: function (event, player) {
					return player.hp <= 4 || player.countCards('h') > game.countPlayer(function (current) {
						if (current != player) return current.countCards('h');
					});
				},
				nobracket: true,
				content: function () {
					var lili = player.lili;
					player.init('boss_cirno2');
					player.$skill('最强的来了！', null, null, true);
					player.lili = lili;
					player.update();
					while (_status.event.name != 'phaseLoop') {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					setTimeout(function () {
						game.playBackgroundMusic('cirno');
					}, 500);
					_status.paused = false;
					_status.event.player = player;
					_status.event.step = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 1;
						_status.roundStart = game.boss;
					}
				}
			},
			"gezi_jiqiang": {
				global: 'gezi_jiqiang1',
				trigger: { global: 'phaseEnd' },
				forced: true,
				filter: function (event, player) {
					return event.player.countCards('h') < player.countCards('h');
				},
				nobracket: true,
				content: function () {
					trigger.player.damage('thunder');
					player.draw();
					player.chooseToUse(trigger.player, -1, '冰柱机枪：你可以对' + get.translation(trigger.player) + '使用一张牌');
				}
			},
			"gezi_jiqiang1": {
				mod: {
					maxHandcard: function (player, num) {
						return num - game.countPlayer(function (current) {
							if (current != player && current.hasSkill('gezi_jiqiang')) return 2;
						});
					}
				},
			},
			"gezi_zuanshi": {
				forced: true,
				trigger: { player: 'phaseUseBegin' },
				global: 'gezi_zuanshi2',
				init: function (player) {
					player.storage.gezi_zuanshi = [];
				},
				nobracket: true,
				intro: {
					content: function (storage) {
						var str = '视为【杀】的牌：';
						if (storage) {
							for (var i = 0; i < storage.length; i++) {
								if (!str.includes(get.translation(storage[i]))) str += get.translation(storage[i]) + ',';
							}
						}
						return str;
					},
				},
				content: function () {
					'step 0'
					player.storage.gezi_zuanshi = [];
					var num = player.countCards('h', { name: 'sha' });
					player.draw(num);
					'step 1'
					if (Array.isArray(result) && result.length) {
						var cards = result;
						player.showCards(cards);
						for (var i = 0; i < cards.length; i++) {
							player.storage.gezi_zuanshi.push(cards[i].name);
						}
						player.markSkill('gezi_zuanshi');
					}
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + player.storage.gezi_zuanshi.length;
					},
				},
			},
			"gezi_zuanshi1": {
				direct: true,
				trigger: { player: 'gainBegin' },
				filter: function (event, player) {
					var e = event.getParent('useSkill');
					if (!e || event.skill != 'gezi_zuanshi') return false;
					return true;
				},
				content: function () {
					player.showCards(trigger.cards);
					for (var i = 0; i < trigger.cards.length; i++) {
						player.storage.gezi_zuanshi.push(trigger.cards[i].name);
					}
					player.markSkill('gezi_zuanshi');
				},
			},
			"gezi_zuanshi2": {
				mod: {
					cardname: function (card, player, name) {
						var list = [];
						game.filterPlayer(function (current) {
							if (current.storage.gezi_zuanshi && current.storage.gezi_zuanshi.length) list.addArray(current.storage.gezi_zuanshi);
						});
						if (list.includes(card.name) && card.name != 'sha') return 'sha';
					},
					cardnature: function (card, player) {
						var list = [];
						game.filterPlayer(function (current) {
							if (current.storage.gezi_zuanshi && current.storage.gezi_zuanshi.length) list.addArray(current.storage.gezi_zuanshi);
						});
						if (list.includes(card.name) && card.name != 'sha') return false;
					},
					/*					cardEnabled:function(card,player){
											if(_status.event.skill==undefined&&game.hasPlayer(function(current){
												return current.hasSkill('gezi_zuanshi') && current.storage.gezi_zuanshi.includes(card.name) && card.name != 'sha';
											})) return false;
										},
										cardUsable:function(card,player){
											if(_status.event.skill==undefined&&game.hasPlayer(function(current){
												return current.hasSkill('gezi_zuanshi') && current.storage.gezi_zuanshi.includes(card.name) && card.name != 'sha';
											})) return false;
										},
										cardRespondable:function(card,player){
											if(_status.event.skill==undefined&&game.hasPlayer(function(current){
												return current.hasSkill('gezi_zuanshi') && current.storage.gezi_zuanshi.includes(card.name) && card.name != 'sha';
											})) return false;
										},
										cardSavable:function(card,player){
											if(_status.event.skill==undefined&&game.hasPlayer(function(current){
												return current.hasSkill('gezi_zuanshi') && current.storage.gezi_zuanshi.includes(card.name) && card.name != 'sha';
											})) return false;
										},
										*/
				},
				/*
				enable:["chooseToUse",'chooseToRespond'],
				filterCard:function(card){
					return game.hasPlayer(function(current){
						return current.hasSkill('gezi_zuanshi') && current.storage.gezi_zuanshi.includes(card.name);
					});
				},
				viewAs:{name:"sha"},
				prompt:"将【钻石风暴】指定的牌名当【杀】使用/打出",
				ai:{
					respondSha:true,
				},*/
			},
			"gezi_jubing": {
				trigger: { player: 'phaseBegin' },
				forced: true,
				limited: true,
				skillAnimation: true,
				mark: true,
				filter: function (event, player) {
					return player.hp == 1;
				},
				nobracket: true,
				content: function () {
					player.awakenSkill('gezi_jubing');
					var list = game.filterPlayer();
					list.remove(player);
					for (var i = 0; i < list.length; i++) {
						list[i].damage(9, 'thunder');
					};
				},
			},
			//dio
			"gezi_zhipei": {
				audio: "ext:东方project:4",
				trigger: {
					global: "useCardToBegin",
				},
				filter: function (event, player) {
					if (!get.suit(event.card) && !get.number(event.card)) return false;
					return player.countCards('he', function (card) {
						return get.suit(card) == get.suit(event.card) || get.number(card) == get.number(event.card);
					});
				},
				direct: true,
				content: function () {
					'step 0'
					var nono = false;
					var eff1 = get.effect(trigger.target, trigger.card, trigger.player, player);
					var eff2 = get.effect(trigger.target, trigger.card, trigger.player, trigger.player);
					var att = get.attitude(player, trigger.player);
					if (eff1 < 0) {
						if (att > 0 && eff2 > 0) {
							nono = false;
						} else {
							nono = true;
						}
					}
					player.chooseCard('he', '你可以用一把与' + get.translation(trigger.card) + '相同花色/点数的飞刀把它砍断', function (card) {
						return (get.suit(card) == get.suit(trigger.card) || get.number(card) == get.number(trigger.card));
					}).set('ai', function (card) {
						if (_status.event.nono == true) {
							return 7 - get.value(card);
						}
						return 0;
					}).set('nono', nono);
					'step 1'
					if (result.cards) {
						player.lose(result.cards[0]);
						player.$throw(result.cards[0], 1000);
						player.logSkill('gezi_zhipei', trigger.player);
						trigger.cancel();
						player.gainlili();
					}
				},
			},
			"gezi_shiting": {
				audio: "ext:东方project:4",
				group: ["gezi_shiting_mark", "gezi_shiting_mark2"],
				trigger: {
					global: "phaseEnd",
				},
				intro: {
					content: "cards",
				},
				prompt: "是否把今天用出去的飞刀捡起来？(获得本回合进入弃牌堆的牌)",
				filter: function (event, player) {
					if (!player.storage.gezi_shiting) return false;
					if (player.countCards('h') > player.maxHp) return false;
					if (_status.currentPhase == player) return false;
					return true;
				},
				frequent: true,
				content: function () {
					for (var i = 0; i < player.storage.gezi_shiting.length; i++) {
						if (player.storage.gezi_shiting[i]) {
							player.gain(player.storage.gezi_shiting[i], 'gain2')._triggered = null;
							ui.discardPile.remove(player.storage.gezi_shiting[i]);
						}
					}
				},
			},
			"gezi_shiting_mark": {
				trigger: {
					global: "loseEnd",
				},
				direct: true,
				priority: -10,
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					if (!event.cards) return false;
					if (get.itemtype(event.cards) != 'cards') return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (!player.storage.gezi_shiting) player.storage.gezi_shiting = [trigger.cards[i]];
						else player.storage.gezi_shiting.push(trigger.cards[i]);
					}
					player.markSkill('gezi_shiting');
					player.syncStorage('gezi_shiting');
				},
			},
			"gezi_shiting_mark2": {
				trigger: {
					global: "phaseAfter",
				},
				direct: true,
				priority: -100,
				filter: function (event, player) {
					return player.storage.gezi_shiting;
				},
				content: function () {
					player.storage.gezi_shiting = [];
					player.syncStorage('gezi_shiting');
					player.unmarkSkill('gezi_shiting');
				},
			},
			"gezi_the_world": {
				trigger: {
					global: "useCardToBefore",
				},
				usable: 1,
				priority: 33,
				audio: "ext:东方project:4",
				filter: function (event, player) {
					return get.tag(event.card, 'damage') && player.lili;
				},
				content: function () {
					'step 0'
					player.loselili();
					trigger.cancel();
					if (trigger.card.name == 'sha') player.say('Wwwwwwwwy!!!!');
					if (trigger.card.name == 'guohe')
						player.say('你永远也爬不上这楼梯！！！');
					if (trigger.card.name == 'wanjian')
						player.say('我在短暂的人生中发现人类是有极限的');
					'step 1'
					player.chooseTarget('获得一名角色区域内一张牌，然后你可以使用之', function (card, player, target) {
						return target.countCards('he');
					}).set('ai', function (target) {
						return get.attitude(player, target) < 0;
					});
					'step 2'
					if (result.bool) {
						player.line(result.targets[0], 'red');
						player.gainPlayerCard(result.targets[0], 'he', true);
					}
					'step 3'
					if (result.cards) {
						var card = result.cards[0];
						if (card && game.hasPlayer(function (current) {
							return player.canUse(card, current);
						}) && get.owner(card) == player) {
							player.chooseToUse({
								prompt: '是否使用' + get.translation(card) + '？',
								filterCard: function (cardx, player, target) {
									return cardx == card;
								},
							});
						}
					}
				},
				check: function (event, player) {
					if (player.lili <= 1) return false;
					if (get.effect(event.target, event.card, event.player, player) >= 0)
						return false;
					return true;
				},
				prompt: "要不要使用The World的力量？",
			},
			//妹红boss
			"gezi_huoniao1": {
				trigger: { player: 'phaseBegin' },
				audio: 2,
				nobracket: true,
				content: function () {
					player.loseHp();
					player.useCard({ name: 'gezi_danmakucraze' }, player);
				},
				check: function () {
					return true;
				},
			},
			"gezi_huoniao2": {
				trigger: { player: 'phaseBegin' },
				audio: 2,
				nobracket: true,
				forced: true,
				content: function () {
					player.storage._enhance = 1;
					player.useCard({ name: 'gezi_danmakucraze' }, player, 'nowuxie');
				},
			},
			"bianshen_mokou": {
				audio: 1,
				trigger: { player: 'dyingBegin' },
				forced: true,
				skillAnimation: true,
				nobracket: true,
				content: function () {
					player.init('boss_mokou2');
					player.hp = 1;
					player.update();
					while (_status.event.name != 'phaseLoop') {
						_status.event = _status.event.parent;
					}
					game.resetSkills();
					_status.paused = false;
					_status.event.player = player;
					_status.event.step = 0;
					if (game.bossinfo) {
						game.bossinfo.loopType = 2;
						_status.roundStart = game.boss;
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, 'recover')) return 'zeroplayertarget';
						},
					},
				},
			},
			"businiao_boss": {
				audio: 2,
				trigger: { player: 'phaseEnd' },
				forced: true,
				nobracket: true,
				content: function () {
					var num = player.getStat('damage');
					//if (num != 0) player.draw(num * player.countUsed('huazhi'));
					//player.removeSkill('huazhi_skill');
					if (num) {
						player.recover(num + 1);
						player.gainlili(num + 1);
					} else {
						player.recover();
						player.gainlili();
					}
				},
			},
			//年兽
			"boss_nianrui": {
				trigger: { player: 'phaseDrawBegin' },
				forced: true,
				content: function () {
					trigger.num += 2;
				},
				ai: {
					threaten: 1.6
				}
			},
			"boss_qixiang": {
				group: ['boss_qixiang1', 'boss_qixiang2'],
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name == 'lebu' && card.name == 'bingliang') return 0.8;
						}
					}
				}
			},
			"boss_qixiang1": {
				trigger: { player: 'judge' },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == 'lebu';
						}
						else {
							return event.card.name == 'lebu';
						}
					}
				},
				content: function () {
					player.addTempSkill('boss_qixiang3', 'judgeAfter');
				}
			},
			"boss_qixiang2": {
				trigger: { player: 'judge' },
				forced: true,
				filter: function (event, player) {
					if (event.card) {
						if (event.card.viewAs) {
							return event.card.viewAs == 'bingliang';
						}
						else {
							return event.card.name == 'bingliang';
						}
					}
				},
				content: function () {
					player.addTempSkill('boss_qixiang4', 'judgeAfter');
				}
			},
			"boss_qixiang3": {
				mod: {
					suit: function (card, suit) {
						if (suit == 'diamond') return 'heart';
					}
				}
			},
			"boss_qixiang4": {
				mod: {
					suit: function (card, suit) {
						if (suit == 'spade') return 'club';
					}
				}
			},
			"boss_damagecount": {
				mode: ['boss'],
				global: 'boss_damagecount2',
				direct: true,
				nobracket: true,
				trigger: { player: 'phaseBegin' },
				content: function () {
					player.skip('phaseUse');
				},
			},
			"boss_damagecount2": {
				trigger: { source: 'damageEnd' },
				silent: true,
				filter: function (event, player) {
					if (!ui.damageCount) return false;
					return event.num > 0 && player.isFriendOf(game.me) && event.player.isEnemyOf(game.me);
				},
				content: function () {
					_status.damageCount += trigger.num;
					ui.damageCount.innerHTML = '伤害: ' + _status.damageCount;
				}
			},
			//八云紫
			"gezi_genyuanzhini": {
				audio: "ext:东方project:2",
				trigger: {
					player: "drawBegin",
				},
				forced: true,
				nobracket: true,
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.5,
					lili: function (player, num) {
						if (num < player.maxlili) return false;
					},
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.node.lili) return num = player.lili;
						else return num;
					},
				},
			},
			"gezi_jingjie": {
				init: function (player) {
					for (var i = 0; i < game.players.length; i++) {
						if (!game.players[i].storage.gezi_jingjie) game.players[i].storage.gezi_jingjie = 0;
					}
				},
				intro: {
					content: function (storage) {
						return '当前有：' + storage + '个标记';
					},
				},
				marktext: "幻",
				audio: "ext:东方project:2",
				trigger: {
					global: "damageEnd",
				},
				filter: function (event, player) {
					return event.player.isDamaged() && event.source;
					//&&event.source!==player;
				},
				forced: true,
				content: function () {
					var num = trigger.num;
					trigger.source.storage.gezi_jingjie += num;
					trigger.source.syncStorage('gezi_jingjie');
					trigger.source.markSkill('gezi_jingjie');
					game.log(trigger.source, '获得了' + get.cnNumber(num) + '个“幻”标记');
				},
				group: "gezi_jingjie_sourceDamage",
				subSkill: {
					sourceDamage: {
						audio: "ext:东方project:2",
						trigger: {
							source: "damageSource",
						},
						filter: function (event, player) {
							//return event.num>0;
							return true;
						},
						forced: true,
						content: function () {
							//alert("damageSource");
							player.gainlili(trigger.num);
						},
						"_priority": 0,
						sub: true,
					},
				},
				"_priority": 0,
			},
			"gezi_yazhi": {
				audio: "ext:东方project:2",
				forced: true,
				init: function (player) {
					player.storage.gezi_jingjie = 0;
					if (get.mode() !== "guozhan") {
						player.countCards = function (arg1, arg2) {
							var lnum = this.storage.gezi_jingjie;
							if (!arg2) {
								if (arg1 == 'h') {
									return lnum;
								}
							}
							return this.getCards(arg1, arg2).length;
						};
						player.update();
					}
				},
				trigger: {
					player: "gezi_jingjieAfter",
				},
				content: function () {
					player.countCards = function (arg1, arg2) {
						var lnum = this.storage.gezi_jingjie;
						if (!arg2) {
							if (arg1 == 'h') {
								return lnum;
							}
						}
						return this.getCards(arg1, arg2).length;
					};
					player.update();
				},
				mod: {
					canBeGained: function (card, player, name) {
						if (player.getCards("h").length <= 0) return false;
					},
					cardDiscardable: function (card, player, name) {
						if (player.getCards("h").length <= 0) return false;
					},
					targetEnabled: function (card, player, target) {
						if (target.getCards("h").length <= 0 && (get.tag(card, 'discard') || get.tag(card, 'loseCard') || get.tag(card, 'gain'))) return false;
					},
				},
				group: ["gezi_yazhi_1", "gezi_yazhi_2", "gezi_yazhi_discardAfterAttack"],
				subSkill: {
					"1": {
						trigger: {
							global: "useCard",
						},
						popup: false,
						superCharlotte: true,
						charlotte: true,
						direct: true,
						unique: true,
						forced: true,
						filter: function (event, player) {
							return player.getCards("h").length <= 0 &&
								(get.tag(event.card, 'discard') || get.tag(event.card, 'loseCard') || get.tag(event.card, 'gain')) &&
								event.targets.contains(player);
						},
						content: function () {
							if (trigger.targets.length <= 1) trigger.cancel();
							else trigger.targets.remove(player);
						},
						sub: true,
						"_priority": 0,
					},
					"2": {
						trigger: {
							global: "phaseDiscardBegin",
						},
						audio: "gezi_yazhi",
						round: 1,
						check: function (event, player) {
							/*
							能额外弃牌时发动
							*/
							return (get.attitude(player, event.player) <= 0)
								&& (event.player.needsToDiscard(event.player.storage.gezi_jingjie) && (event.player.needsToDiscard(event.player.storage.gezi_jingjie) > event.player.needsToDiscard()));
						},
						filter: function (event, player) {
							return event.player != player && event.player.storage.gezi_jingjie;
						},
						content: function () {
							player.storage.gezi_yazhi_2To = trigger.player;
							trigger.player.addTempSkill('gezi_yazhimod', { player: 'phaseAfter' });
							//同将模式适配
							/*
							if(!trigger.player.storage.gezi_yazhimod_source) trigger.player.storage.gezi_yazhimod_source=[];
							trigger.player.storage.gezi_yazhimod_source.add(player);
							*/
						},
						sub: true,
						"_priority": 0,
					},
					"fengyinRelease": {
						onremove: function (player, skill) {
							//alert(1);
							console.error("player.storage.gezi_yazhi_fengyinRelease:", player.storage.gezi_yazhi_fengyinRelease);
							if (player.storage.gezi_yazhi_fengyinRelease) {
								for (const player_fengyined of player.storage.gezi_yazhi_fengyinRelease) {
									player_fengyined.removeSkill('fengyin');
								}
							}
							player.storage.gezi_yazhi_fengyinRelease = [];
						},
						sub: true,
					},
					"discardAfterAttack": {
						trigger: {
							global: "phaseDiscardAfter",
						},
						charlotte: true,
						direct: true,
						/*
						filter:function(event, player){
							return player.storage.gezi_yazhi_2To===event.player;
						},
						*/
						/*
						filter:function (event, player) {
							console.log(1,event.player.hasSkill('gezi_yazhimod'));
							console.log(2,player.storage.gezi_yazhi_2To===event.player);
							console.log(3,event.player.countCards('h')===0);
							return event.player.hasSkill('gezi_yazhimod')&&player.storage.gezi_yazhi_2To===event.player
							&&event.player.countCards('h')===0;
						},
						*/
						check: function (event, player) {
							return true;
						},
						//prompt:"是否失去三点灵力，封印其技能直到下一名角色的回合结束并对其造成一点伤害？",
						content: function () {
							'step 0'
							if (player.lili >= 3 && trigger.player.hasSkill('gezi_yazhimod') && player.storage.gezi_yazhi_2To === trigger.player
								&& trigger.player.countCards('h') === 0) {
							} else event.finish();

							'step 1'
							delete player.storage.gezi_yazhi_2To;

							var target = trigger.player;

							player.chooseBool("是否失去三点灵力，封印其技能直到下一名角色的回合结束并对其造成一点伤害？").ai = function () {
								return true;
							};
							'step 2'
							if (result.bool) {
								player.loselili(3);
								trigger.player.addSkill('fengyin');
								if (!trigger.player.next.storage.gezi_yazhi_fengyinRelease) trigger.player.next.storage.gezi_yazhi_fengyinRelease = [];
								trigger.player.next.storage.gezi_yazhi_fengyinRelease.add(trigger.player);
								trigger.player.next.addTempSkill('gezi_yazhi_fengyinRelease', { player: 'phaseAfter' });

								trigger.player.damage(1, player);
							}
						},
					},
				},
				"_priority": 0,
				sub: true,
			},
			"gezi_yazhimod": {
				mod: {
					maxHandcard: function (player, num) {
						var x = player.storage.gezi_jingjie;
						return num - x;
					},
				},
			},
			//灵乌路空
			"gezi_chizhimu": {
				trigger: {
					player: "damageBefore",
				},
				filter: function (event, player) {
					return event.nature == 'fire';
				},
				priority: 99,
				nobracket: true,
				forced: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'fireDamage')) return 0;
						},
					},
				},
			},
			"gezi_jibian": {
				audio: "ext:东方project:2",
				trigger: {
					player: "damage",
				},
				filter: function (event, player) {
					return event.num > 0 && event.source && event.source.isAlive() && event.source != player;
				},
				forced: true,
				content: function () {
					var chat = ['敢惹我？让你尝尝我的厉害', '我可不好惹！'].randomGet();
					player.say(chat);
					trigger.source.damage('fire');
				},
				ai: {
					"maixie_defend": true,
					effect: {
						target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
							return 0.8;
							// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5]; 
						},
					},
				},
			},
			"gezi_huozhong": {
				init: function (player) {
					for (var i = 0; i < game.players.length; i++) {
						if (!game.players[i].storage.gezi_huozhong) game.players[i].storage.gezi_huozhong = 0;
					}
				},
				intro: {
					content: "mark",
				},
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter: function (event, player) {
					return event.player != player && event.player.storage.gezi_huozhong;
				},
				content: function () {
					"step 0"
					// if(trigger.player.storage.gezi_huozhong){ 
					player.storage.gezi_nohuozhong = true;
					trigger.player.damage(trigger.player.storage.gezi_huozhong, 'fire');
					"step 1"
					player.storage.gezi_nohuozhong = false;

				},
				group: "gezi_huozhong_1",
				subSkill: {
					"1": {
						trigger: {
							source: "damageBefore",
						},
						forced: true,
						filter: function (event, player) {
							if (player.storage.gezi_nohuozhong) return false;
							// if(_status.event.skill=='gezi_huozhong') return false;
							if (event.player == player) return false;
							return true;
						},
						content: function () {
							// if(_status.event.skill.name=='gezi_huozhong') event.finish();
							trigger.cancel();
							var chat = ['燃起来吧'].randomGet();
							player.say(chat);
							trigger.player.storage.gezi_huozhong++;
							trigger.player.syncStorage('gezi_huozhong');
							trigger.player.markSkill('gezi_huozhong');
							game.log(trigger.player, '获得了1个“火”');
						},
						sub: true,
					},
				},
			},
			"gezi_bazhi": {
				audio: "ext:东方project:2",
				unique: true,
				enable: "chooseToUse",
				mark: true,
				skillAnimation: true,
				animationStr: "八咫",
				limited: true,
				animationColor: "orange",
				init: function (player) {
					player.storage.gezi_bazhi = false;
				},
				intro: {
					content: "limited",
				},
				filter: function (event, player) {
					if (player.storage.gezi_bazhi) return false;
					if (game.countPlayer(function (current) {
						return current.storage.gezi_huozhong
					}) <= 0) return false;
					if (event.type == 'dying') {
						if (player != event.dying) return false;
						return true;
					}
					return false;
				},
				content: function () {
					'step 0'
					player.awakenSkill('gezi_bazhi');
					player.storage.gezi_bazhi = true;
					'step 1'
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].storage.gezi_huozhong) {
							num += game.players[i].storage.gezi_huozhong;
							delete game.players[i].storage.gezi_huozhong;
						}
					}
					player.maxHp = num;
					if (player.hp < player.maxHp) {
						player.recover(player.maxHp - player.hp);
					}
					'step 2'
					player.removeSkill("gezi_huozhong");
				},
				ai: {
					order: 1,
					skillTagFilter: function (player) {
						if (player.storage.gezi_bazhi) return false;
						if (player.hp > 0) return false;
					},
					save: true,
					result: {
						player: function (player) {
							if (player.hp == 0) return 10;
							if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
							return 0;
						},
					},
					threaten: function (player, target) {
						if (!target.storage.gezi_bazhi) return 0.6;
					},
				},
			},
			//莫妮卡
			"gezi_miaohui": {
				enable: 'phaseUse',
				usable: 1,
				audio: 2,
				content: function () {
					game.pause();
					if (!lib.config.monika) lib.config.monika = {};
					var list = ['game.me.draw()<br>你抽一张牌', 'game.me.gainlili()<br>你获得1点灵力', 'game.players[1].damage()<br>对下家造成1点伤害'];
					if (player.hp < player.maxHp) list.push('game.me.recover()<br>你回复1点体力');
					if (get.mode() == 'identity' || get.mode() == 'old_identity') list.push('game.players[1].setIdentity(game.players[1].identity)<br>展示下家的身份');
					if (get.mode() != 'identity') list.push('game.me.addIncident(game.createCard(\'scarlet\'))<br>你获得【红月】异变牌');
					if (Object.keys(lib.config.monika).length >= 5) list.push("lib.skill['gezi_miaohui'].usable = Infinity<br>【描绘】改为'一回合无限次'");
					if (Object.keys(lib.config.monika).length >= 10) list.push("game.removeCard('sha')<br>移除牌堆里的所有【杀】");
					if (Object.keys(lib.config.monika).length >= 15) list.push('game.me.insertPhase()<br>你进行一个额外的回合');
					if (Object.keys(lib.config.monika).length >= 20) list.push('game.over(true)<br>你获得游戏胜利');
					var dialog = ui.create.dialog('请输入代码<br><br><br><div><div style="text-align:center;font-size:14px">' + list.randomRemove() + '<br><br>' + list.randomGet() + '</div>');
					var text2 = document.createElement('input');
					text2.style.width = '350px';
					text2.style.height = '20px';
					text2.style.padding = '0';
					text2.style.position = 'relative';
					text2.style.top = '50px';
					//text2.style.left='30px';
					text2.style.resize = 'none';
					text2.style.border = 'none';
					text2.style.borderRadius = '2px';
					text2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
					dialog.appendChild(text2);
					var runCommand = function (e) {
						try {
							var result = eval(text2.value);
							game.log(text2.value);
						}
						catch (e) {
							game.log(text2.value + ' —— ' + e);
						}
						text2.value = '';
					}
					text2.addEventListener('keydown', function (e) {
						if (e.keyCode == 13) {
							dialog.close();
							ui.dialog.close();
							runCommand();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						}
					});
					ui.create.control('确定', function () {
						dialog.close();
						ui.dialog.close();
						runCommand();
						while (ui.controls.length) ui.controls[0].close();
						game.resume();
					});
				},
			},
			/*
			喂！
			我不觉得你应该做这种事情！
			你知道我在说什么吧？
			查文件……随便的翻着我的东西……
			这可是很没有礼貌的啊！
			要是我把你的脑袋打开来，在里面随便的翻来翻去，找你对我的想法，你会怎么想？
			……这么一说的话，我还真的想有点这么做呢……
			……不对不对，这不是重点！
			虽然我也阻止不了你，也没法拿你怎么样……
			但是我知道你是个会关心人的好孩子，所以一定会照顾照顾我的感受吧？
			*/
			"gezi_kehua": {
				enable: 'phaseUse',
				audio: 2,
				content: function () {
					'step 0'
					/*
					lib.config.monika = {};
					game.saveConfig('monika', lib.config.monika);
					*/
					if (!lib.config.monika) lib.config.monika = {};
					event.num = Object.keys(lib.config.monika).length;
					var list = [];
					for (var i in lib.character) {
						if (i == 'gezi_marisa' || i == 'gezi_akyuu') continue;
						if (i == 'gezi_monika' && event.num < 3) continue;
						list.push(i);
					}
					player.chooseButton(['选择一名角色', [list, 'character']]);
					'step 1'
					if (!result.bool) {
						event.finish();
						return;
					}
					event.character = result.buttons[0].link;
					var list = ['增加技能', '删除技能', '更改体力上限', '更改起始灵力值', '更改灵力上限', '删除角色'];
					if (event.character == 'gezi_monika') list[5] = '所有改动还回原样';
					player.chooseControlList(list).set('prompt', '想要对' + get.translation(event.character) + '做些什么？');
					'step 2'
					event.index = result.index;
					if (result.index == 0) {
						var list = [];
						for (var i in lib.skill) {
							list.push([i, get.translation(i) || i]);
						}
						game.pause();
						var dialog = ui.create.dialog('请选择一项技能获得<br><br><br><br>');
						dialog.style.height = '275px';
						var textbox = ui.create.selectlist(list, 'global');
						textbox.style.width = '350px';
						textbox.style.height = '20px';
						textbox.style.position = 'relative';
						textbox.style.top = '60px';
						//text2.style.left='30px';
						textbox.style.resize = 'none';
						textbox.style.border = 'none';
						textbox.style.borderRadius = '2px';
						textbox.style.overflow = 'auto';
						var box = ui.create.div();
						box.style.width = '350px';
						box.style.height = '20px';
						box.style.position = 'relative';
						box.style.top = '90px';
						if (!lib.device) box.innerHTML = '打开上方列表后，可以通过在键盘上输入字母，搜索对应首字母的技能';
						textbox.onchange = function () {
							if (textbox.value) box.innerHTML = lib.translate[textbox.value + '_info'] || '没有技能描述';
						};
						dialog.appendChild(textbox);
						dialog.appendChild(box);
						ui.create.control('确定', function () {
							if (textbox.value) event.addskill = textbox.value;
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消', function () {
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						//player.chooseControl(list).set('prompt', '想要为'+get.translation(event.character)+'增加哪项技能？');
					} else if (result.index == 1) {
						var list = [];
						for (var i = 0; i < lib.character[event.character][3].length; i++) {
							list.push(get.translation(lib.character[event.character][3][i]));
						}
						player.chooseControl(list).set('prompt', '想要为' + get.translation(event.character) + '删除哪项技能？');
					} else if (result.index == 2) {
						game.pause();
						var dialog = ui.create.dialog('想要将' + get.translation(event.character) + '的体力上限改为多少？<br><br><br>');
						var text2 = document.createElement('input');
						text2.type = 'number';
						text2.style.width = '200px';
						text2.style.height = '20px';
						text2.style.padding = '0';
						text2.style.position = 'relative';
						text2.style.top = '80px';
						//text2.style.left='30px';
						text2.style.resize = 'none';
						text2.style.border = 'none';
						text2.style.borderRadius = '2px';
						text2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
						text2.value = lib.character[event.character][2];
						dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定', function () {
							if (text2.value) event.value = text2.value;
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消', function () {
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 3) {
						game.pause();
						var dialog = ui.create.dialog('想要将' + get.translation(event.character) + '的起始灵力值改为多少？<br><br><br>');
						var text2 = document.createElement('input');
						text2.type = 'number';
						text2.style.width = '200px';
						text2.style.height = '20px';
						text2.style.padding = '0';
						text2.style.position = 'relative';
						text2.style.top = '80px';
						//text2.style.left='30px';
						text2.style.resize = 'none';
						text2.style.border = 'none';
						text2.style.borderRadius = '2px';
						text2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
						text2.value = lib.character[event.character][1];
						dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定', function () {
							if (text2.value) event.value = text2.value;
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消', function () {
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 4) {
						game.pause();
						var dialog = ui.create.dialog('想要将' + get.translation(event.character) + '的灵力上限改为多少？<br><br><br>');
						var text2 = document.createElement('input');
						text2.type = 'number';
						text2.style.width = '200px';
						text2.style.height = '20px';
						text2.style.padding = '0';
						text2.style.position = 'relative';
						text2.style.top = '80px';
						//text2.style.left='30px';
						text2.style.resize = 'none';
						text2.style.border = 'none';
						text2.style.borderRadius = '2px';
						text2.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 0 0 1px';
						text2.value = lib.character[event.character][6] || '5';
						dialog.appendChild(text2);
						ui.auto.hide();
						ui.create.control('确定', function () {
							if (text2.value) event.value = text2.value;
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
						ui.create.control('取消', function () {
							dialog.close();
							ui.dialog.close();
							while (ui.controls.length) ui.controls[0].close();
							game.resume();
						});
					} else if (result.index == 5) {
						if (event.character == 'gezi_monika') {
							alert('虽然我不知道你为什么要这么做，但是你想要做什么，我都会接受你的。\n即使是把我……不不，我什么都没有说。');
							lib.config.monika = {};
							game.log('莫妮卡做过的一切重置完毕');
						} else {
							game.log(event.character, '被删除');
							lib.config.monika[event.character] = 'null';
							delete lib.character[event.character];
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == event.character) {
									game.removePlayer(game.players[i]);
								}
							}
						}
					}
					'step 3'
					var info = lib.character[event.character];
					if (event.index == 0) {
						if (event.addskill) {
							lib.character[event.character][3].push(event.addskill);
							game.log(event.character, '添加了技能', event.addskill);
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == event.character) {
									game.players[i].addSkill(event.addskill);
								}
							}
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log('没有为', event.character, '选择技能');
						}
					} else if (event.index == 1) {
						if (result.control) {
							var list = lib.character[event.character][3];
							for (var i = 0; i < list.length; i++) {
								if (get.translation(list[i]) && get.translation(list[i]) == result.control) {
									lib.character[event.character][3].splice(i, 1);
								}
							}
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == event.character) {
									for (var j = 0; j < game.players[i].skills.length; j++) {
										if (get.translation(game.players[i].skills[j]) == result.control) {
											game.players[i].removeSkill(game.players[i].skills[j]);
										}
									}
								}
							}
							game.log(event.character, '失去了', result.control);
							lib.config.monika[event.character] = lib.character[event.character];
						}
					} else if (event.index == 2) {
						if (event.value) {
							event.value = parseInt(event.value);
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == event.character) {
									game.players[i].maxHp = event.value;
									game.players[i].update();
								}
							}
							game.log(event.character, '的体力上限改为了', event.value);
							lib.character[event.character][2] = event.value;
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的体力上限没有改动');
						}
					} else if (event.index == 3) {
						if (event.value) {
							event.value = parseInt(event.value);
							game.log(event.character, '的起始灵力值改为了', event.value);
							lib.character[event.character][1] = event.value.toString();
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的起始灵力值没有改动');
						}
					} else if (event.index == 4) {
						if (event.value) {
							event.value = parseInt(event.value);
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i].name == event.character) {
									game.players[i].maxlili = event.value;
									game.players[i].update();
								}
							}
							game.log(event.character, '的灵力上限改为了', event.value);
							lib.character[event.character][6] = event.value.toString();
							lib.config.monika[event.character] = lib.character[event.character];
						} else {
							game.log(event.character, '的灵力上限没有改动');
						}
					}
					'step 4'
					game.saveConfig('gezi_monika', lib.config.monika);
					if (Object.keys(lib.config.monika).length >= 3 && event.num < 3) {
						alert('刻画的角色超过3名：\n解锁了“【刻画】可以修改莫妮卡”功能！\n以后也请好好照顾我~');
					} else if (Object.keys(lib.config.monika).length >= 5 && event.num < 5) {
						alert('刻画的角色数超过5名：\n解锁了看板角色莫妮卡！\n以后我们也会在一起的吧？');
					} else if (Object.keys(lib.config.monika).length >= 10 && event.num < 10) {
						alert('刻画的角色数超过10名：\n看板角色固定为莫妮卡！\n放心吧，我永远也不会离开你的。');
					}
				},
			},
			//发牌姬
			"gezi_huanri": {
				trigger: { global: ['drawBefore', 'gameDrawBefore'] },
				group: ['gezi_huanri_start', 'gezi_huanri_judge'],
				filter: function (event, player) {
					return event.num > 0 && ui.cardPile.childNodes.length > 0;
				},
				check: function (event, player) {
					if (event.name == 'gameDraw' && player.storage.gezi_huanri == 3) return false;
					return true;
				},
				content: function () {
					'step 0'
					var num = 0;
					if (trigger.name == 'draw') {
						num = trigger.num;
					} else if (trigger.name == 'gameDraw') {
						num = trigger.num * game.players.length;
					}
					var cards = [];
					var choices = [0, 0, 0, 0, 0];
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						cards.push(ui.cardPile.childNodes[i]);
						if (ui.cardPile.childNodes[i].name == 'wuzhong') {
							choices[2]++;
							continue;
						}
						if (player.storage.gezi_huanri == 1) {
							if (ui.cardPile.childNodes[i].name == 'sha') choices[0]++;
							else if (ui.cardPile.childNodes[i].name == 'gezi_danmakucraze') choices[1]++;
							else if (ui.cardPile.childNodes[i].name == 'gezi_tianguo') choices[3]++;
						} else if (player.storage.gezi_huanri == 2) {
							if (ui.cardPile.childNodes[i].name == 'juedou') choices[0]++;
							else if (ui.cardPile.childNodes[i].name == 'gezi_zuiye') choices[1]++;
							else if (ui.cardPile.childNodes[i].name == 'gezi_tianguo') choices[3]++;
						}
					}
					if (player.storage.gezi_huanri == 1) {
						if (trigger.name == 'gameDraw') {
							choices = ['sha'];
						} else if (trigger.name == 'draw') {
							if (trigger.player == player) {
								if (player.hp < trigger.player.maxHp && !trigger.player.countCards('h', { name: 'tao' })) choices = ['tao'];
								else if (choices[2] + choices[1] >= trigger.num) {
									choices = ['gezi_danmakucraze', 'wuzhong', 'gezi_huazhi'];
								} else if (choices[1] == 0) {
									choices = ['gezi_tianguo', 'wuzhong', 'gezi_zuiye', 'gezi_sijing'];
								} else {
									choices = ['gezi_tianguo', 'gezi_sijing', 'gezi_dianche'];
								}
								if (player.hasSkill('danmaku_skill')) {
									choices.push('sha');
								}
								if (trigger.getParent('phaseEnd') || _status.currentPhase != player) {
									choices = ['gezi_bailou', 'gezi_lunadial', 'gezi_mirror', 'gezi_dianche', 'tao'];
								}
							} else {
								choices = ['sha', 'gezi_tancheng'];
							}
						}
					} else if (player.storage.gezi_huanri == 2) {
						if (trigger.name == 'gameDraw') {
							choices = ['juedou', 'shan'];
						} else if (trigger.name == 'draw') {
							if (trigger.player == player) {
								if (player.hp < trigger.player.maxHp && !trigger.player.countCards('h', { name: 'tao' })) choices = ['tao'];
								else if (choices[0] + choices[1] + choices[2] >= trigger.num) {
									choices = ['juedou', 'wuzhong', 'gezi_huazhi', 'gezi_zuiye'];
								} else if (choices[0] == 0) {
									choices = ['gezi_tianguo', 'wuzhong', 'gezi_zuiye', 'gezi_sijing'];
								} else {
									choices = ['gezi_tianguo', 'gezi_sijing', 'gezi_dianche'];
								}
								if (trigger.getParent('phaseEnd') || _status.currentPhase != player) {
									choices = ['gezi_bailou', 'gezi_lunadial', 'gezi_mirror', 'gezi_dianche', 'tao', 'gezi_book', 'gezi_hourai'];
								}
							} else {
								choices = ['shan', 'gezi_louguan', 'gezi_bailou', 'gezi_pantsu', 'gezi_yuzhi', 'gezi_gungnir', 'gezi_tancheng'];
							}
						}
					} else {
						if (get.attitude(player, trigger.player) > 0) {
							if (trigger.player.hp < trigger.player.maxHp && !trigger.player.countCards('h', { name: 'tao' })) choices = ['tao'];
							else if (choices[2] > 0) choices = ['wuzhong'];
							else if (trigger.player.countCards('he', { type: 'equip' }) < 3) choices = ['gezi_mirror', 'gezi_book', 'gezi_lunadial', 'gezi_hourai', 'gezi_pantsu', 'gezi_stone', 'gezi_windfan', 'gezi_lantern'];
							else if (_status.currentPhase != trigger.player || trigger.getParent('phaseEnd')) choices = ['shan', 'gezi_bingyu'];
							else choices = ['shunshou', 'guohe', 'gezi_lingbi', 'sha', 'gezi_huazhi'];
						}
					}
					player.chooseCardButton(num, '将' + num + '张牌置于牌堆顶（先选的在上面）', cards).set('filterButton', function (button) {
						return true;
					}).set('ai', function (button) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						if (choices.length) {
							return choices.includes(button.link.name);
						} else if (get.attitude(player, trigger.player) > 0) {
							return get.value(button.link) <= 5;
						}
					}).set('choices', choices);
					'step 1'
					if (result.bool) {
						if (!player.isUnderControl(true) && trigger.name == 'gameDraw') {
							for (var i = result.links.length - 1; i >= 0; i--) {
								if (result.links[i].name == 'juedou') result.links.splice(0, 0, result.links.splice(i, 1)[0]);
								if (result.links[i].name == 'sha') result.links.splice(0, 0, result.links.splice(i, 1)[0]);
							}
							/*var playernum = 0;
							var tplayer = trigger.player;
							while (tplayer != player){
								playernum ++;
								tplayer = tplayer.next;
							}*/

						}
						for (var i = result.links.length - 1; i >= 0; i--) {
							ui.cardPile.insertBefore(result.links[i], ui.cardPile.firstChild);
						}
					}
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.name == 'tianguo' || card.name == 'sijing') {
								var count = 0;
								for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
									if (ui.cardPile.childNodes[i] == 'wuzhong') count++;
								}
								if (count == 0) return [1, 10000];
							}
						}
					},
				},
			},
			"gezi_huanri_judge": {
				trigger: { global: 'judgeBegin' },
				//frequent:true,
				filter: function () {
					return true;
				},
				check: function () {
					return true;
				},
				content: function () {
					'step 0'
					var cards = [];
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						cards.push(ui.cardPile.childNodes[i]);
					}
					player.chooseCardButton(1, '将一张牌置于牌堆顶（先选的在上面）', cards).set('filterButton', function (button) {
						return true;
					}).set('ai', function (button) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						var t = _status.event.getParent('useSkill');
						if (t && t.skill == 'mingyun2') {
							var e = trigger.getParent('useCard');
							console.log(e.targets[0]);
							if (get.attitude(player, e.targets[0]) > 0) {
								return get.subtype(button.link) == 'support';
							} else {
								return button.link.name == 'sha';
							}
						}
						var judging = trigger.player.judging[0];
						var result = trigger.judge(button.link) - trigger.judge(ui.cardPile.childNodes[0]);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0) return 0;
						if (attitude > 0) {
							return result;
						}
						else {
							return -result;
						}
					});
					'step 1'
					if (result.bool) {
						for (var i = result.links.length - 1; i >= 0; i--) {
							ui.cardPile.insertBefore(result.links[i], ui.cardPile.firstChild);
						}
					}
				},
				ai: {
					expose: 0.1,
					tag: {
						rejudge: 0.5
					}
				}
			},
			"gezi_huanri_start": {
				trigger: { global: 'gameStart' },
				direct: true,
				content: function () {
					if (get.mode() == 'boss') {
						var i = Math.random();
						if (i > 0.7) player.storage.gezi_huanri = 1;
						else player.storage.gezi_huanri = 2;
					} else {
						player.storage.gezi_huanri = 3;
					}
				},
			},
			"gezi_toutian": {
				enable: 'phaseUse',
				usable: 1,
				filter: function (event, player) {
					return player.getLili() > 0;
				},
				content: function () {
					'step 0'
					var list = [];
					for (var i in lib.card) {
						if (!lib.translate[i]) continue;
						if (!lib.translate[i + '_info']) continue;
						list.add(i);
					}
					if (list.length) {
						player.chooseButton(['创建并获得一张牌', [list, 'vcard']]).set('ai', function (button) {
							var count = 0;
							for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
								if (ui.cardPile.childNodes[i] == 'wuzhong') count++;
							}
							if (player.countCards('h', { name: 'sha' })) return button.link[2] == 'lianji' || button.link[2] == 'danmakucraze';
							if (player.getStat('damage') >= 2) return button.link[2] == 'huazhi';
							if (count == 0) return button.link[2] == 'tianguo' || button.link[2] == 'sijing';
							if (player.hp < player.maxHp) return button.link[2] == 'tao';
							return button.link[2] == 'wuzhong';
						});
					}
					'step 1'
					if (result && result.bool && result.links[0]) {
						player.gain(game.createCard(result.links[0][2]));
						player.loselili();
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							return 10;
						}
					},
				}
			},
			//六花
			"gezi_zhonger": {
				init: function (player) {
					player.storage.gezi_zhonger = 1;
					lib.translate.gezi_lianji_info = "锁定技，出牌阶段，你可以额外使用一张【杀】。你受到【杀】的伤害后，移除一张【连击】，获得该牌（无牌改为摸一张牌）。</br><u>特殊效果:视为你使用一张无视距离的杀。</u>";
					lib.translate.gezi_qianxing_info = "任意角色回合结束时，若你判定区内有【潜藏】，你不能成为带有伤害标签牌的目标直到你的准备阶段；准备阶段，移除一张【潜藏】。</br><u>特殊效果:令一名角色获得潜行直到你的下个回合开始。</u>";
					lib.translate.gezi_lingyong_info = "锁定技，你的攻击范围加一。你获得的灵力量加一。使用此效果不小于四次时，移除一张【灵涌】。</br><u>特殊效果:展示一张牌，令一名其他角色使用此牌（无距离限制）或者将此牌当【杀】使用</u>";
					lib.translate.gezi_ziheng_info = "出牌阶段结束时，你可以重铸一张手牌。准备阶段，你可以重铸区域内一张牌。使用此效果不小于四次时，移除一张【制衡】。</br><u>特殊效果:将区域内任意张牌重铸。</u>";
					lib.translate.gezi_firebook_info = "锁定技，你使用【杀】的次数上限+1。每当一名角色受到火焰伤害后，你摸一张牌。使用此效果不小于两次时，移除一张【火魔导书】。</br><u>特殊效果:视为对一名角色使用【火攻】。</u>";
					lib.translate.gezi_waterbook_info = "你可以将一张黑色手牌当做【闪】使用/打出。使用此效果不小于两次时，移除一张【水魔导书】。</br><u>特殊效果:视为对一名角色使用水淹七军。</u>";
					lib.translate.gezi_woodbook_info = "锁定技，你的手牌上限+2。弃牌阶段结束时，若你已受伤，你移除一张【木魔导书】，回复一点体力。</br><u>特殊效果:视为对一名角色使用【治疗波】。</u>";
					lib.translate.gezi_dirtbook_info = "锁定技，一名角色死亡后，你回复一点体力并摸一张牌。使用此效果不小于两次时，移除一张【土魔导书】。</br><u>特殊效果:视为对一名角色使用一张【望梅止渴】。</u>";
					lib.translate.gezi_goldbook_info = "锁定技，你的回合开始或回合结束后摸一张牌。使用此效果不小于三次时，移除一张【金魔导书】。</br><u>特殊效果:视为对一名角色使用【祠符】。</u>";
					lib.translate.gezi_shenyou_info = "锁定技，你的判定牌生效前，你移除一张【神佑】，令之视为红桃；你受到伤害时，若伤害大于你的体力值，你移除一张【神佑】，防止该伤害。</br><u>特殊效果:回复一点体力。若你的手牌为全场最小或之一，你摸2张牌。</u>";
					lib.translate.gezi_shengdun_info = "你成为其他角色的普通锦囊牌的目标后，可以与来源特殊拼点（拼点后双方各摸一张牌）；若你赢，移除一张【圣盾】，该牌对你无效。</br><u>特殊效果:发现一张锦囊牌。</u>";
				},
				forced: true,
				audio: "ext:东方project:3",
				trigger: {
					player: "useCard",
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					return get.type(event.card) == 'basic';
				},
				content: function () {
					player.useSkill('gezi_jinengpai_show');
				},
			},
			//河城荷取
			"qianghua_qianghuagezi": {
				init: function () {
					game.addGlobalSkill('qianghua_wuzhong');
					game.addGlobalSkill('qianghua_shunshou');
					game.addGlobalSkill('qianghua_guohe');
					game.addGlobalSkill('qianghua_jinnang');
					//替换无中
					if (lib.translate.wuzhong_info) {
						lib.translate.wuzhong_info = ["出牌阶段，对你使用：你摸两张牌。</br><u>强化（-1）：你摸一张牌。</u>"];
					}
					//替换顺手
					if (lib.translate.shunshou_info) {
						lib.translate.shunshou_info = ["出牌阶段，对距离为1且区域里有牌的一名其他角色使用。你获得其区域里的一张牌。</br><u>强化：若你的灵力不小于4，你使用【顺手牵羊】无距离限制。</u>"];
					}
					//替换过河
					if (lib.translate.guohe_info) {
						lib.translate.guohe_info = ["出牌阶段，对区域里有牌的一名其他角色使用。你弃置其区域里的一张牌。</br><u>强化（-1）：额外指定一个目标。</u>"];
					}
					//替换南蛮
					if (lib.translate.nanman_info) {
						lib.translate.nanman_info = ["出牌阶段，对所有其他角色使用。每名目标角色需打出一张【杀】，否则受到1点伤害。</br><u>强化（-1）:若指定目标大于一，减少一个目标。</u>"];
					}
					//替换万箭
					if (lib.translate.wanjian_info) {
						lib.translate.wanjian_info = ["出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。</br><u>强化（-1）:若指定目标大于一，减少一个目标。</u>"];
					}
					//替换桃园
					if (lib.translate.taoyuan_info) {
						lib.translate.taoyuan_info = ["出牌阶段，对所有角色使用。每名目标角色回复1点体力。</br><u>强化（-1）:若指定目标大于一，减少一个目标。</u>"];
					}
					//替换五谷
					if (lib.translate.wugu_info) {
						lib.translate.wugu_info = ["出牌阶段，对所有角色使用。（选择目标后）你从牌堆顶亮出等同于目标数量的牌，每名目标角色获得这些牌中（剩余的）的任意一张。</br><u>强化（-1）:若指定目标大于一，减少一个目标。</u>"];
					}
				},
				trigger: {
					global: "qianghuagezi",
				},
				audio: "ext:东方project:2",
				frequent: true,
				content: function () {
					player.draw();
				},
			},
			"qianghua_wuzhong": {
				trigger: {
					player: "useCard",
				},
				priority: 22,
				prompt: "消耗一点灵力，额外摸一张牌",
				filter: function (event, player) {
					if (player.lili) {
						return event.card.name == 'wuzhong';
					}
					return false;
				},
				check: function (event, player) {
					return player.lili > 2;
				},
				content: function () {
					player.draw();
					player.loselili();
					event.trigger('qianghuagezi');
				},
			},
			"qianghua_shunshou": {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (player.lili >= 4 && card.name == 'shunshou') return true;
					},
				},
			},
			"qianghua_guohe": {
				trigger: {
					player: "useCard",
				},
				direct: true,
				priority: 22,
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return player.lili && event.card.name == 'guohe';
				},
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt('qianghua_guohe'), '消耗一点灵力，为' + get.translation(trigger.card) + '增加一个额外目标', function (card, player, target) {
						var trigger = _status.event.getTrigger();
						return lib.filter.filterTarget(trigger.card, player, target) && target != trigger.targets[0];
					}).set('autodelay', true).set('ai', function (target) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						if (player.lili < 3) return false;
						return get.effect(target, trigger.card, player, player);
					});
					"step 1"
					if (result.bool) {
						player.loselili();
						trigger.targets.push(result.targets[0]);
						player.logSkill('qianghua_guohe', result.targets);
						event.trigger('qianghuagezi');
					}
				},
			},
			"qianghua_jinnang": {
				trigger: {
					player: "useCard",
				},
				direct: true,
				filter: function (event, player) {
					if (!event.targets) return false;
					if (event.targets.length <= 1) return false;
					return (event.card.name == 'nanman' || event.card.name == 'wanjian' || event.card.name == 'taoyuan' || event.card.name == 'wugu') && player.lili;
				},
				priority: 22,
				content: function () {
					'step 0'
					player.chooseTarget('是否消耗一点灵力，减少一名' + get.translation(trigger.card) + '的目标？', function (card, player, target) {
						return _status.event.getTrigger().targets.contains(target);
					}).set('ai', function (target) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						if (player.lili < 3) return false;
						return -get.effect(target, trigger.card, trigger.player, _status.event.player);
					});
					'step 1'
					if (result.bool) {
						game.delay();
						player.logSkill('qianghua_jinnang', result.targets);
						player.line(result.targets, 'red');
						player.loselili();
						event.targets = result.targets;
						if (event.isMine()) {
							event.finish();
						}
						for (var i = 0; i < result.targets.length; i++) {
							trigger.targets.remove(result.targets[i]);
						}
						game.delay();
						event.trigger('qianghuagezi');
					} else {
						event.finish();
					}
				},
			},
			//先代
			"gezi_tiequan": {
				trigger: {
					player: "useCardToTargeted",
				},
				logTarget: "target",
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter: function (event, player) {
					if (event.card.name != 'sha') return false;
					return get.lingxuCheck(player, 1);
				},
				content: function () {
					'step 0'
					var map = {};
					var list = [];
					var num2 = player.getLili();
					if (player.hasSkill('_damagelili')) num2 = player.getLili() - 1;
					var num = Math.min(3, num2);
					for (var i = 1; i <= num; i++) {
						var cn = get.cnNumber(i, true);
						map[cn] = i;
						list.push(cn);
					}
					event.map = map;
					player.chooseControl(list, function () {
						return get.cnNumber(_status.event.goon, true);
					}).set('prompt', '失去任意点灵力').set('goon', num);
					'step 1'
					var num = event.map[result.control] || 1;
					player.loselili(num);
					if (num > 1) trigger.getParent().directHit.push(trigger.target);
					if (num > 0) {
						var id = trigger.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].extraDamage != 'number') {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
					}
					if (num > 2) {
						trigger.target.addTempSkill('baiban');
						trigger.target.when({ global: 'useCardAfter' })
							.filter(evt => evt == trigger.getParent())
							.then(() => {
								player.removeSkill('baiban');
							});
					}
				}
			},
			"gezi_zhicai": {
				ai: {
					noFuka: true,
					skillTagFilter: function (player) {
						return _status.currentPhase == player;
					},
				}
			},

			/*-------------------乱入角色-------------------*/
			//樱
			"gezi_jiushu": {
				enable: 'phaseUse',
				usable: 1,
				filterTarget: lib.filter.notMe,
				content: function () {
					'step 0'
					if (player.countDiscardableCards(player, 'he') == 0) {
						event._result = {
							bool: true,
							control: '回复体力',
						}
					} else {
						player.chooseControl(['摸牌', '回复体力']);
					}
					'step 1'
					if (result.control == '摸牌') {
						player.chooseToDiscard('he', true);
						if (player.isMinHandcard(true)) target.draw(2);
						else target.draw();
					} else {
						player.loseHp();
						if (player.isMinHp(true)) target.recover(2);
						else target.recover();
					}
				},
			},
			"gezi_jiushuying": {
				inherit: 'gezi_jiushu',
				filterTarget: (card, player, target) => target.hasSkill('gezi_jiushu'),
				selectTarget: -1,
			},
			"gezi_mengsui": {
				audio: 2,
				trigger: {
					player: "damageBegin4",
				},
				juexingji: true,
				skillAnimation: true,
				animationColor: "fire",
				forced: true,
				filter: function (event, player) {
					return player.countCards('h') < 2 && player.hp < 2;
				},
				content: function () {
					player.awakenSkill('gezi_mengsui');
					trigger.cancel();
					player.node.avatar.setBackgroundImage('extension/东方project/gezi_FSakuraawake.jpg');
					var tgs = game.filterPlayer(target => target != player);
					for (var i of tgs) i.addSkillLog('gezi_jiushuying');
					player.addSkill('gezi_wuxian');
					player.addSkill('gezi_xuwu');
					player.addSkill('gezi_chunhui');
					player.loselili(player.lili);
					player.maxHp = 4;
					player.hp = 4;
					player.update();
				},
			},
			"gezi_xuwu": {
				group: 'death_normal',
				trigger: {
					player: "phaseJieshuBegin",
				},
				forced: true,
				filter: function (event, player) {
					return game.filterPlayer(current => current.inRangeOf(player)).length > 0;
				},
				content: function () {
					var tgs = game.filterPlayer(current => current.inRangeOf(player));
					for (var i of tgs) i.damage('thunder');
					var tgs2 = tgs.filter(target => target.lili == 0);
					if (tgs2.length) {
						for (var j of tgs2) j.damage();
					}
				}
			},
			"gezi_chunhui": {
				trigger: {
					player: "recoverAfter",
				},
				forced: true,
				silent: true,
				filter: function (event, player) {
					return event.source && event.source != player;
				},
				content: function () {
					'step 0'
					player.getHistory('custom').push({ gezi_chunhui: [trigger.source.name, trigger.num] });
					'step 1'
					var num = 0;
					player.getHistory('custom', function (evt) {
						if (evt.gezi_chunhui[0] == trigger.source.name) num += evt.gezi_chunhui[1];
					});
					if (num >= 2) {
						player.$skill('春回樱开');
						player.loseMaxHp();
						player.awakenSkill('gezi_chunhui');
						player.removeSkill('gezi_xuwu');
					}
				},
			},
			//BB
			'gezi_shiguan': {
				audio: "ext:东方project:2",
				enable: "chooseToUse",
				usable: 1,
				filter: function (event, player) {
					return event.type != 'wuxie' && event.type != 'respondShan' && player.countCards('hes') > 0;
				},
				chooseButton: {
					dialog: function (event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							var name = lib.inpile[i];
							if (name == 'sha') {
								list.push(['基本', '', 'sha']);
								for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
							}
							else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
							else if (get.type(name) == 'basic') list.push(['基本', '', name]);
						}
						return ui.create.dialog('十之王冠', [list, 'vcard']);
					},
					filter: function (button, player) {
						var num = (game.dead.length || 0) + 1;
						var list = {};
						var hs = player.getCards('hes');
						var numlist = [];
						for (var i = 0; i < hs.length; i++) {
							var namele = get.translation(hs[i].name).length;
							if (!numlist.includes(namele)) {
								numlist.push(namele);
							}
						}
						numlist.sort();
						for (var j of numlist) {
							var num1 = j - num;
							var num2 = j + num;
							list[j] = [num1, num2];
						}
						for (var k of numlist) {
							if (_status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent()) && list[k][0] <= (get.translation(button.link[2]).length) && (get.translation(button.link[2]).length) <= list[k][1]) return true;
						}
					},
					check: function (button) {
						var player = _status.event.player;
						if (player.countCards('hs', button.link[2]) > 0) return 0;
						if (button.link[2] == 'wugu') return;
						var effect = player.getUseValue(button.link[2]);
						if (effect > 0) return effect;
						return 0;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card) {
								var num = (game.dead.length || 0) + 1;
								var num1 = get.translation(links[0][2]).length - num;
								var num2 = get.translation(links[0][2]).length + num;
								if (((get.translation(card.name).length) < num1) || ((get.translation(card.name).length) > num2)) return false;
								return true;
							},
							selectCard: 1,
							popname: true,
							check: function (card) {
								return 6 - get.value(card);
							},
							position: 'hes',
							viewAs: { name: links[0][2], nature: links[0][3] },
						}
					},
					prompt: function (links, player) {
						return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
					},
				},
				ai: {
					order: 4,
					result: {
						player: 1,
					},
					threaten: 1.9,
				},
			},
			'gezi_jinbei': {
				trigger: {
					player: "gainEnd",
				},
				filter: function (event, player) {
					var num = (game.dead.length || 0) + 1;
					if ((player.countMark('gezi_jinbei') || 0) >= num) return false;
					if (event.source != undefined && event.source != player && event.cards && event.cards.length > 0 && event.source.countCards('hej') > 0) return true;
					return false;
				},
				content: function () {
					player.addMark('gezi_jinbei', 1);
					player.gain(trigger.source.getCards('hej'), trigger.source);
				}
			},
			'gezi_ccc': {
				mod: {
					globalFrom: function (from, to) {
						if (to.hasSkill('bbtanhu')) return -Infinity;
					},
				},
				audio: "ext:东方project:2",
				spell: ["gezi_ccc2"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				nobracket: true,
				filter: function (event, player) {
					return player.getLili() > 2;
				},
				check: function (event, player) {
					if (player.node.fuka) return false;
					if (!player.canUseFuka()) return false;
					return true;
				},
				content: function () {
					'step 0'
					player.loselili(2);
					player.Fuka();
					player.say('Cursed，cupid，cleanser!');
					event.targets = game.filterPlayer();
					event.targets.sort(lib.sort.seat);
					player.line(event.targets, 'green');
					"step 1"
					if (event.targets.length) {
						event.target = event.targets.shift();
						var str = get.translation(event.target), num = (game.dead.length || 0) + 1, list = [
							'与' + str + '距离减为1',
							'令' + str + '所有技能无效',
							'防止' + str + '本回合受到的伤害',
							'令' + str + '本回合不能成为牌的目标',
							'令' + str + '本回合不能BB(无效果)',
						];
						if ((player.countMark('gezi_jinbei') || 0) < num && player.hasSkill('gezi_jinbei')) list.push('给' + str + '都上一遍');
						player.chooseControl().set('choiceList', list).set('ai', function () {
							var player = _status.event.player;
							if (_status.event.controls.length > 5 && get.attitude(player, event.target) < 0) return 5;
							if (get.attitude(player, event.target) < 0) return [2, 3].randomGet();
							if (get.attitude(player, event.target) > 0) return [0, 1].randomGet();
							return 4;
						});
					}
					"step 2"
					if (result.index) {
						if (result.index == 5) {
							player.addMark('gezi_jinbei', 1);
							event.target.addTempSkill('bbtanhu');
							event.target.addTempSkill('baiban');
							event.target.addTempSkill('bbfangshang');
							event.target.addTempSkill('bbpaiban');
							event.target.addTempSkill('bbjinyan');
						} else {
							switch (result.index) {
								case 1: event.target.addTempSkill('baiban'); break;
								case 2: event.target.addTempSkill('bbfangshang'); break;
								case 3: event.target.addTempSkill('bbpaiban'); break;
								case 4: event.target.addTempSkill('bbjinyan'); break;
							}
						}
					} else {
						event.target.addTempSkill('bbtanhu')
					}
					if (event.targets.length) event.goto(1);
				},
			},
			'gezi_ccc2': {},
			'bbtanhu': {
				mark: true,
				marktext: 'B探',
				intro: {
					content: '让我康康！'
				},
				charlotte: true,
			},
			'bbfangshang': {
				mark: true,
				marktext: 'B盾',
				intro: {
					content: '不会受到伤害'
				},
				trigger: {
					player: "damageBegin4",
				},
				popup: false,
				charlotte: true,
				content: function () {
					trigger.cancel();
				},
			},
			'bbpaiban': {
				mark: true,
				marktext: '干扰',
				intro: {
					content: '不能成为牌的目标'
				},
				charlotte: true,
				mod: {
					targetEnabled: function (card, player, target, now) {
						return false;
					},
				},
			},
			'bbjinyan': {
				mark: true,
				marktext: '禁言',
				charlotte: true,
				intro: {
					content: '不许BB'
				}
			},
			//黑魔术少女
			'gezi_daomo': {
				audio: "ext:东方project:2",
				trigger: {
					target: "useCardToTarget",
				},
				direct: true,
				filter: function (event, player) {
					return event.card.name == 'sha' && event.targets.length == 1 && player.countCards('hs', (card) => player.hasUseTarget(card) && !get.tag(card, 'damage')) > 0;
				},
				content: function () {
					'step 0'
					player.chooseToUse(function (card) {
						return !get.tag(card, 'damage') && player.hasUseTarget(card);
					}, get.translation(player.name) + '试图魔导传导');
					'step 1'
					if (result.targets && !result.targets.includes(player)) {
						if (result.targets.length == 1) {
							event._result = {
								bool: true,
								targets: result.targets,
							};
						} else player.chooseTarget(get.prompt('gezi_daomo'), function (card, player, target) {
							return result.targets.includes(target);
						}).set('ai', function (target) {
							return -get.attitude(player, target);
						});
					} else event.finish();
					'step 2'
					if (result.bool) {
						var target = result.targets[0];
						trigger.targets.remove(player);
						//trigger.triggeredTargets1.remove(target);
						trigger.untrigger();
						trigger.targets.push(target);
						trigger.player.line(target, 'fire');
						game.log(trigger.card, '的目标被改为', target);
					}
				},
			},
			'gezi_chuancheng': {
				audio: "ext:东方project:2",
				group: 'gezi_chuancheng_draw',
				subSkill: {
					draw: {
						trigger: { global: 'useCardAfter' },
						filter: function (event, player) {
							return event.card.storage && event.card.storage.enhance;
						},
						forced: true,
						content: function () {
							player.draw();
						}
					}
				},
				content: function () {
					"step 0"
					player.chooseBool('是否发动传承让其他人代为支付灵力');
					"step 1"
					if (result.bool == false) {
						event.finish();
					}
					"step 2"
					if (event.current == undefined) event.current = player.next;
					if (result.bool) result.bool = false;
					if (event.current == player) {
						event.finish();
					}
					else if (event.current.lili > player.lili) {
						if ((event.current == game.me && !_status.auto) || (
							get.attitude(event.current, player) > 2) ||
							event.current.isOnline()) {
							player.storage.gezi_chuanchenging = true;
							var next = event.current.chooseBool('是否替' + get.translation(player) + '强化' + get.translation(card.name) + '？');
							next.set('ai', function () {
								game.log(event.current, player);
								return get.attitude(event.current, player) > 0;
							});
						}
					}
					"step 3"
					player.storage.gezi_chuanchenging = false;
					if (result.bool) {
						event.finish();
						player.logSkill('gezi_chuancheng');
						event.current.loselili(get.info(card).enhance);
						game.log(get.translation(player) + '强化了' + get.translation(card.name) + '。');
						if (!player.storage._enhance) {
							player.storage._enhance = 1;
						} else {
							player.storage._enhance += 1;
						}
						if (!card.storage) card.storage = {};
						card.storage.enhance = true;
					}
					else {
						event.current = event.current.next;
						event.goto(2);
					}
				},
				contentx: function () {
					'step 0'
					var target = targets.shift();
					target.chooseBool('是否替' + get.translation(player) + '强化' + get.translation(card.name) + '？').set('ai', function () {
						return get.attitude(target, player) > 0;
					});
					'step 1'
					if (result.bool) {
						event.finish();
						target.logSkill('gezi_chuancheng', player);
						target.loselili(get.info(card).enhance);
						game.log(get.translation(player) + '强化了' + get.translation(card.name) + '。');
						if (!player.storage._enhance) {
							player.storage._enhance = 1;
						} else {
							player.storage._enhance += 1;
						}
						if (!card.storage) card.storage = {};
						card.storage.enhance = true;
					} else if (targets.length) event.goto(2);
				},
				ai: {
					Enchange: true,
				}
			},
			'gezi_dba': {
				audio: "ext:东方project:2",
				spell: ["gezi_dba_fire_2"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return get.lingxuCheck(player, 3);
				},
				check: function (event, player) {
					if (player.node.fuka) return false;
					if (!player.canUseFuka()) return false;
					return true;
				},
				content: function () {
					"step 0"
					player.loselili(3);
					player.Fuka();
					player.say('黑·魔·导·爆·裂·破！');
					player.chooseTarget(get.prompt('gezi_dba'), lib.filter.notMe, true).set('ai', function (target) {
						return -get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						result.targets[0].discard(result.targets[0].getCards('he'));
						player.useCard({ name: 'sha' }, result.targets[0], false);
					}
				}
			},
			//多萝西
			"gezi_zhuanhuan": {
				audio: "ext:东方project:2",
				enable: 'phaseUse',
				usable: 1,
				nobracket: true,
				content: function () {
					player.discard(player.getCards('h'));
					player.draw(player.lili);
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							return player.lili - player.countCards('h');
						}
					},
				}
			},
			"gezi_moli": {
				audio: "ext:东方project:2",
				usable: 1,
				enable: 'phaseUse',
				selectTarget: [1, 3],
				selectCard: 1,
				filterTarget: function (card, player, target) {
					return target.countCards('hej');
				},
				filterCard: true,
				position: 'hej',
				nobracket: true,
				content: function () {
					player.discardPlayerCard('hej', target);
				},
				contentAfter: function () {
					'step 0'
					var cards = [];
					for (var i = targets.length; i > 0; i--) {
						if (ui.cardPile.childNodes.length < i) {
							var card = get.cards(i);
							//ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
						}
						cards.push(ui.cardPile.childNodes[ui.cardPile.childNodes.length - i]);
					}
					event.cards = cards;
					event.num = 0;
					'step 1'
					player.chooseCardButton('将一张牌分给' + get.translation(targets[event.num]), true, event.cards, 1).set('ai', function (button) {
						if (ui.selected.buttons.length == 0) return 1;
						return 0;
					});
					'step 2'
					if (result.bool) {
						for (var i = 0; i < result.links.length; i++) {
							event.cards.remove(result.links[i]);
						}
						targets[event.num].gain(result.links, 'draw');
						player.line(targets[event.num], 'green');
						game.log(targets[event.num], '获得了' + get.cnNumber(result.links.length) + '张牌');
					}
					if (event.cards.length == 0 || event.num >= targets.length) event.finish();
					else {
						event.num++;
						event.goto(1);
					}
				},
				ai: {
					result: {
						player: -1,
						target: 0.5,
					},
				}
			},
			"gezi_chaoyue": {
				audio: "ext:东方project:2",
				cost: 7,
				spell: ['gezi_chaoyue_skill'],
				group: 'gezi_chaoyue_reduce',
				trigger: { player: 'phaseBegin' },
				init: function (player) {
					player.storage.gezi_chaoyue = 0;
				},
				intro: {
					content: function (storage, player) {
						return '符卡消耗-' + player.storage.gezi_chaoyue;
					},
				},
				nobracket: true,
				filter: function (event, player) {
					return player.lili > (lib.skill.gezi_chaoyue.cost - player.storage.gezi_chaoyue);
				},
				content: function () {
					player.loselili(lib.skill.gezi_chaoyue.cost - player.storage.gezi_chaoyue);
					player.Fuka();
					player.storage.gezi_chaoyue = 0;
					player.syncStorage('gezi_chaoyue');
					player.unmarkSkill('gezi_chaoyue');
				},
				check: function (event, player) {
					return player.storage.gezi_chaoyue > 5;
				},
			},
			"gezi_chaoyue_skill": {
				trigger: { player: 'phaseAfter' },
				direct: true,
				content: function () {
					player.insertPhase();
				}
			},
			"gezi_chaoyue_reduce": {
				direct: true,
				trigger: { player: 'useCard' },
				frequent: true,
				filter: function (event) {
					return (get.type(event.card) == 'trick' && event.card.isCard);
				},
				content: function () {
					if (!player.storage.gezi_chaoyue) player.storage.gezi_chaoyue = 0;
					player.storage.gezi_chaoyue++;
					player.markSkill('gezi_chaoyue');
				},
			},
			//伊莉雅
			"gezi_huanzhao": {
				audio: "ext:东方project:4",
				unique: true,
				init: function (player) {
					player.storage.gezi_huanzhao = {
						list: [],
						shown: [],
						owned: {},
						player: player,
					}
				},
				get: function (player, msg) {
					var name = msg;
					if (typeof msg != 'number') {
						msg = 1;
					}
					var list = [];
					game.log(player, '获得了' + msg + '张“梦幻”');
					while (msg--) {
						if (typeof name != 'string') {
							name = player.storage.gezi_huanzhao.list.randomRemove();
						}
						var skills = lib.character[name][3].slice(0);
						for (var i = 0; i < skills.length; i++) {
							var info = lib.skill[skills[i]];
							if (!info) continue;
							if (info.unique && !info.gainable) {
								skills.splice(i--, 1);
							}
						}
						player.storage.gezi_huanzhao.owned[name] = skills;
						list.push(name);
						name = msg;
					}
					if (player.isUnderControl(true)) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = 'gezi_huanzhao_card_' + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: 'character:' + list[i]
							}
							lib.translate[cardname] = lib.translate[list[i]];
							cards.push(game.createCard(cardname, '', ''));
						}
						player.$draw(cards);
					}
				},
				group: ["gezi_huanzhao1", "gezi_huanzhao2", "gezi_huanzhao4"],
				intro: {
					content: function (storage, player) {
						var str = '';
						var slist = storage.owned;
						var list = [];
						for (var i in slist) {
							list.push(i);
						}
						if (list.length) {
							str += get.translation(list[0]);
							for (var i = 1; i < list.length; i++) {
								str += '、' + get.translation(list[i]);
							}
						}
						var skill = player.additionalSkills.gezi_huanzhao[0];
						if (skill) {
							str += '<p>当前技能：' + get.translation(skill);
						}
						return str;
					},
					mark: function (dialog, content, player) {
						var slist = content.owned;
						var list = [];
						for (var i in slist) {
							list.push(i);
						}
						if (list.length) {
							dialog.addSmall([list, 'character']);
						}
						if (!player.isUnderControl(true)) {
							for (var i = 0; i < dialog.buttons.length; i++) {
								if (!content.shown.contains(dialog.buttons[i].link)) {
									dialog.buttons[i].node.group.remove();
									dialog.buttons[i].node.hp.remove();
									dialog.buttons[i].node.intro.remove();
									dialog.buttons[i].node.name.innerHTML = '未<br>知';
									dialog.buttons[i].node.name.dataset.nature = '';
									dialog.buttons[i].style.background = '';
									dialog.buttons[i]._nointro = true;
									dialog.buttons[i].classList.add('menubg');
								}
							}
						}
						if (player.additionalSkills.gezi_huanzhao) {
							var skill = player.additionalSkills.gezi_huanzhao[0];
							if (skill) {
								dialog.add('<div><div class="skill">【' + get.translation(skill) + '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>');
							}
						}
					},
				},
				mark: true,
			},
			"gezi_huanzhao1": {
				trigger: {
					global: "gameStart",
					player: "enterGame",
				},
				direct: true,
				filter: function (event, player) {
					return !player.storage.gezi_huanzhaoinited;
				},
				content: function () {
					player.logSkill("gezi_huanzhao");
					for (var i in lib.character) {
						if (lib.filter.characterDisabled2(i)) continue;
						var add = false;
						for (var j = 0; j < lib.character[i][3].length; j++) {
							var info = lib.skill[lib.character[i][3][j]];
							if (!info) {
								continue;
							}
							if (info.gainable || !info.unique) {
								add = true;
								break;
							}
						}
						if (add) {
							player.storage.gezi_huanzhao.list.push(i);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						player.storage.gezi_huanzhao.list.remove([game.players[i].name]);
						player.storage.gezi_huanzhao.list.remove([game.players[i].name1]);
						player.storage.gezi_huanzhao.list.remove([game.players[i].name2]);
					}
					lib.skill.gezi_huanzhao.get(player, 2);
					player.storage.gezi_huanzhaoinited = true;
				},
			},
			"gezi_huanzhao2": {
				trigger: {
					player: ["phaseBegin"],
				},
				filter: function (event, player, name) {
					return true;
				},
				"prompt2": "明置一张“梦幻”并暗置其余；你视为持有明置“梦幻”牌的第一项技能。",
				content: function () {
					'step 0'
					event.trigger('playercontrol');
					player.logSkill("gezi_huanzhao");
					'step 1'
					var slist = player.storage.gezi_huanzhao.owned; //获取化身库
					var list = [];
					for (var i in slist) {
						list.push(i);
					}
					var dialog = ui.create.dialog('选择一张“梦幻”明置', 'hidden');
					dialog.add([list.randomGets(list.length), 'character']);
					player.chooseButton(dialog, true).ai = function (button) {
						return get.rank(button.link, true);
					};
					var skills = [];
					for (var i = 0; i < list.length; i++) {
						var sub = lib.character[list[i]][3];
						skills.addArray(sub);
					}
					var add = player.additionalSkills.gezi_huanzhao;
					if (typeof add == 'string') {
						add = [add];
					}
					if (Array.isArray(add)) {
						for (var i = 0; i < add.length; i++) {
							skills.remove(add[i]);
						}
					}
					'step 2' //标记
					player.storage.gezi_huanzhao.shown = [];
					player.storage.gezi_huanzhao.shown.add(result.links[0]);
					var mark = player.marks.gezi_huanzhao;
					mark.hide();
					mark.style.transition = 'all 0.3s';
					setTimeout(function () {
						mark.style.transition = 'all 0s';
						ui.refresh(mark);
						mark.setBackground(result.links[0], 'character');
						if (mark.firstChild) {
							mark.firstChild.remove();
						}
						setTimeout(function () {
							mark.style.transition = '';
							mark.show();
						}, 50);
					}, 500);
					'step 3'
					var name = result.links[0];
					event.char = name;
					if (name == 'gezi_kuro') player.say('你刚才在期待什么奇奇怪怪的东西么？');
					if (!player.additionalSkills.gezi_huanzhao || !player.additionalSkills.gezi_huanzhao.contains(lib.character[name][3][0])) {
						player.addAdditionalSkill('gezi_huanzhao', lib.character[name][3][0]);
						game.log(player, '获得技能', '【' + get.translation(lib.character[name][3][0]) + '】');
						player.popup(lib.character[name][3][0]);
					}
					'step 4'
					player.update();
					'step 5'
					player.chooseBool('幻召：你可以获得' + get.translation(event.char) + '的全部技能，直到回合结束').set('choice', true);
					'step 6'
					if (result.bool) {
						for (var i = 1; i < lib.character[event.char][3].length; i++) {
							player.addTempSkill(lib.character[event.char][3][i]);
						}
					}
				},
			},
			"gezi_huanzhao4": {
				audio: "ext:东方project:2",
				trigger: {
					source: "dieAfter",
				},
				forced: true,
				filter: function (event, player) {
					return !(get.mode() == 'boss' && game.bossinfo.chongzheng);
				},
				content: function () {
					lib.skill.gezi_huanzhao.get(player, trigger.player.name);
					player.storage.gezi_huanzhao.shown.add(trigger.player.name);
				},
			},
			"gezi_wuxian": {
				audio: "ext:东方project:2",
				forced: true,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					"step 0"
					player.gainlili();
					"step 1"
					if (player.lili == player.maxlili || !player.node.lili) {
						player.draw();
					}
				},
			},
			"gezi_quintette_fire": {
				audio: "ext:东方project:2",
				spell: ["gezi_quintette_fire_2"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					var slist = player.storage.gezi_huanzhao.owned; //获取化身库
					var num = 7;
					for (var i in slist) {
						num--;
						if (num <= 0) break;
					}
					return player.lili > num;
				},
				check: function (event, player) {
					if (player.node.fuka) return false;
					return true;
				},
				content: function () {
					'step 0'
					var slist = player.storage.gezi_huanzhao.owned; //获取化身库
					var num = 7;
					for (var i in slist) {
						num--;
						if (num <= 0) break;
					}
					player.loselili(num);
					player.Fuka();
					player.say('多元重奏饱和炮击!');
					player.chooseTarget(get.prompt('gezi_quintette_fire'), true).set('ai', function (target) {
						return -get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						result.targets[0].damage(3);
					}
					"step 2"
					player.discard(player.getCards('h'));
				},
			},
			"gezi_quintette_fire_2": {
			},
			//克洛伊
			"gezi_touying": {
				audio: "ext:东方project:3",
				enable: "phaseUse",
				group: ["gezi_touying_recast", "gezi_touying_target"],
				filter: function (event, player) {
					if (player.storage.counttrigger && player.storage.counttrigger['gezi_touying_target'] && player.storage.counttrigger['gezi_touying_target'] >= 1) return false;
					if (!player.isEmpty(1) && !player.isEmpty(2) && !player.isEmpty(3) && !player.isEmpty(4) && !player.isEmpty(5)) return false;
					return player.countCards('h') && player.countCards('h', {
						type: 'equip'
					}) != player.countCards('h');
				},
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					var player = _status.event.player;
					for (var i in lib.card) {
						if (!lib.translate[i]) continue;
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
						if (lib.card[i].type != 'equip') continue;
						if (lib.card[i].subtype == 'equip1' && !player.isEmpty(1)) continue;
						if (lib.card[i].subtype == 'equip2' && !player.isEmpty(2)) continue;
						if (lib.card[i].subtype == 'equip3' && !player.isEmpty(3)) continue;
						if (lib.card[i].subtype == 'equip4' && !player.isEmpty(4)) continue;
						if (lib.card[i].subtype == 'equip5' && !player.isEmpty(5)) continue;
						list.add(i);
					}
					if (player.hp <= 2) {
						list.remove('xuanyuanjian');
					}
					for (var i = 0; i < list.length; i++) {
						list[i] = [get.type(list[i]), '', list[i]];
					}
					if (list.length) {
						player.chooseButton(['声明一张装备牌', [list, 'vcard']], true).set('ai', function (button) {
							switch (button.link[2]) {
								case 'xuanyuanjian':
									return 8;
								case 'gezi_needle':
									return 7;
								case 'hstianqi_dalian':
									return 6;
								case 'rewrite_baiyin':
									return 5;
								case 'hstianqi_suolasi':
									return 4;
								case 'gezi_frog':
									return 3;
								case 'hstianqi_nazigelin':
									return 2;
								case 'jiuwei':
									return 1.5;
								default:
									return 1;
							}
						});
					}
					'step 1'
					if (result.links) {
						event.link = result.links[0][2];
						player.chooseCard('he', '选择一张非装备牌', true, function (card) {
							return get.type(card) != 'equip';
						}).set('ai', function (card) {
							return 7 - get.value(card);
						});
					}
					'step 2'
					if (result.cards) {
						player.logSkill('gezi_touying');
						var card = result.cards[0];
						player.$throw(card, 1000);
						player.lose(card);
						game.cardsDiscard(card);
						var card1 = game.createCard({
							name: event.link
						}, card.suit, card.number);
						card1._destroy = true;
						card1.dataset.cardType = 'touying';
						player.equip(card1);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['gezi_touying_target']) {
							player.storage.counttrigger['gezi_touying_target'] = 1;
						} else {
							player.storage.counttrigger['gezi_touying_target']++;
						}
					}
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"gezi_touying_target": {
				audio: "gezi_touying_backup",
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					if (get.name(event.card) != 'sha') return false;
					if (player.storage.counttrigger && player.storage.counttrigger['gezi_touying_target'] && player.storage.counttrigger['gezi_touying_target'] >= 1) return false;
					if (!player.isEmpty(1) && !player.isEmpty(2) && !player.isEmpty(3) && !player.isEmpty(4) && !player.isEmpty(5)) return false;
					return player.countCards('h') && player.countCards('h', {
						type: 'equip'
					}) != player.countCards('h');
				},
				content: function () {
					'step 0'
					var list = [];
					var player = _status.event.player;
					for (var i in lib.card) {
						if (!lib.translate[i]) continue;
						if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
						if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
						if (lib.card[i].type != 'equip') continue;
						if (lib.card[i].subtype == 'equip1' && !player.isEmpty(1)) continue;
						if (lib.card[i].subtype == 'equip2' && !player.isEmpty(2)) continue;
						if (lib.card[i].subtype == 'equip3' && !player.isEmpty(3)) continue;
						if (lib.card[i].subtype == 'equip4' && !player.isEmpty(4)) continue;
						if (lib.card[i].subtype == 'equip5' && !player.isEmpty(5)) continue;
						list.add(i);
					}
					if (player.hp <= 2) {
						list.remove('xuanyuanjian');
					}
					for (var i = 0; i < list.length; i++) {
						list[i] = [get.subtype(list[i]), '', list[i]];
					}
					if (list.length) {
						player.chooseButton(['声明一张装备牌', [list, 'vcard']], true).set('ai', function (button) {
							switch (button.link[2]) {
								case 'rewrite_bagua':
									return 7;
								case 'hstianqi_nazigelin':
									return 6;
								case 'xuanyuanjian':
									return 5;
								case 'gezi_yinyangyuguishen':
									return 4;
								case 'hstianqi_suolasi':
									return 3;
								case 'kongdongyin':
									return 2;
								default:
									return 1;
							}
						});
					}
					'step 1'
					if (result.links) {
						event.link = result.links[0][2];
						player.chooseCard('he', '选择一张非装备牌', true, function (card) {
							return get.type(card) != 'equip';
						}).set('ai', function (card) {
							return 7 - get.value(card);
						});
					}
					'step 2'
					if (result.cards) {
						player.logSkill('gezi_touying');
						var card = result.cards[0];
						player.$throw(card, 1000);
						player.lose(card);
						game.cardsDiscard(card);
						var card1 = game.createCard({
							name: event.link
						}, card.suit, card.number);
						card1._destroy = true;
						card1.dataset.cardType = 'touying';
						player.equip(card1);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['gezi_touying_target']) {
							player.storage.counttrigger['gezi_touying_target'] = 1;
						} else {
							player.storage.counttrigger['gezi_touying_target']++;
						}
					}
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (card.name != 'sha') return;
							if (card.name == 'sha') return 0.6;
						},
					},
				},
			},
			"gezi_touying_recast": {
				trigger: {
					global: "phaseEnd",
				},
				direct: true,
				popup: false,
				filter: function (event, player) {
					if (!player.countCards('e')) return false;
					var cards = player.getCards('e');
					for (var i = 0; i < cards.length; i++) {
						if (cards[i] && cards[i].dataset.cardType == 'touying') {
							return true;
						}
					}
				},
				content: function () {
					player.logSkill('gezi_touying');
					var cards = player.getCards('e');
					var list = [];
					for (var i = 0; i < cards.length; i++) {
						if (cards[i] && cards[i].dataset.cardType == 'touying') {
							list.push(cards[i]);
						}
					}
					player.recast(list);
				},
			},
			"gezi_wenmo": {
				audio: "ext:东方project:3",
				usable: 1,
				enable: "phaseUse",
				filter: function (event, player) {
					if (!player.countCards('h')) return false;
					return game.hasPlayer(function (current) {
						return current.countCards('he');
					});
				},
				filterTarget: function (card, player, target) {
					return target.countCards('he') && target != player;
				},
				content: function () {
					"step 0"
					if (player.countCards('h') == 0) {
						event.finish();
						return;
					}
					player.chooseCard('吻魔：选择一张牌展示给' + get.translation(target), true, 'h').ai = function (card) {
						if (_status.event.getRand() < 0.5) return Math.random();
						return get.value(card);
					};
					"step 1"
					player.showCards(result.cards);
					event.card2 = result.cards[0];
					game.log(player, '展示了', event.card2);
					if (target.countCards('h') == 0) {
						event.finish();
						return;
					}
					if (target.name == 'gezi_illyasviel') player.say('魔力不足啊，有没有哪里有魔力充足的可爱女孩子啊？');
					target.chooseCard('吻魔：选择一张牌与' + get.translation(player) + '的' + get.translation(event.card2) +
						'交换<br>相同颜色的话，' + get.translation(player) + '获得1点灵力', true, 'he').ai = function (card) {
							if (get.attitude(target, player) >= 0) return get.color(card) == get.color(event.card2);
							else return get.color(card) != get.color(event.card2);
						};
					"step 2"
					if (result.bool) {
						target.showCards(result.cards);
						target.gain(event.card2, player);
						player.$give(event.card2, target);
						player.gain(result.cards, target);
						target.$give(result.cards, player);
						if (get.color(result.cards[0]) == get.color(event.card2)) {
							if (player.lili < player.maxlili && !player.node.fuka) {
								player.gainlili();
							} else {
								player.draw();
							}
						};
					}
				},
				ai: {
					result: {
						target: 1,
						player: 1,
					},
					order: 2,
				},
			},
			"gezi_heyi": {
				cost: 1,
				audio: "ext:东方project:3",
				spell: ["gezi_heyi_skill"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_heyi.cost;
				},
				content: function () {
					player.loselili(lib.skill.gezi_heyi.cost);
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > 3 || player.countCards('e') < 4;
				},
			},
			"gezi_heyi_skill": {
				trigger: {
					player: "shaBegin",
				},
				init: function (player) {
					if (!player.storage.counttrigger) {
						player.addSkill('counttrigger');
						player.storage.counttrigger = {};
					}
					if (!player.storage.counttrigger['gezi_touying_target']) {
						player.storage.counttrigger['gezi_touying_target'] = -2;
					}
				},
				onremove: function (player) {
					if (player.storage.counttrigger['gezi_touying_target'] > -2) {
						player.storage.counttrigger['gezi_touying_target'] = 1;
					} else {
						player.storage.counttrigger['gezi_touying_target'] = 0;
					}
				},
				filter: function (event, player) {
					return player.countCards('e');
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseCard('e', [1, Infinity], '重铸任意张装备牌，弃置' + get.translation(trigger.target) + '等量张牌').set('ai', function (card) {
						return 7 - get.value(card);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_heyi');
						player.recast(result.cards);
						player.discardPlayerCard(trigger.target, 'he', result.cards.length);
					}
				},
			},
			//尼禄
			"gezi_muqi": {
				audio: "ext:东方project:6",
				group: "gezi_muqi2",
				enable: "chooseToUse",
				usable: 3,
				init: function (player) {
					player.storage.gezi_muqi = [];
					player.node.framebg.dataset.auto = 'gold';
					player.node.framebg.dataset.decoration = 'gold';
				},
				filter: function (event, player) {
					return player.countCards('he') && _status.currentPhase == player;
				},
				chooseButton: {
					dialog: function () {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							if (get.type(lib.inpile[i]) == 'basic') list.push(['基础', '', lib.inpile[i]]);
							if (get.type(lib.inpile[i]) == 'trick') list.push(['锦囊', '', lib.inpile[i]]);
						}
						return ui.create.dialog(get.translation('gezi_muqi'), [list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player) && !player.storage.gezi_muqi.contains(button.link[2]) && player.getCardUsable(button.link[2]);
						//return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent()) && !player.storage.gezi_muqi.contains(button.link[2]);
					},
					check: function (button) {
						var player = _status.event.player;
						return get.value({
							name: button.link[2]
						}) >= 6 && player.countCards('he') >= 3 && !player.countCards('he', {
							name: button.link[2]
						});
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return true;
							},
							audio: "ext:东方project:6",
							position: 'he',
							selectCard: 1,
							//popname: true,
							viewAs: {
								name: links[0][2]
							},
							onuse: function (result, player) {
								if (get.type(result.card.name) == 'trick') player.storage.gezi_muqi.push(result.card.name);
							},
							check: function (card) {
								return get.value(card) < 6;
							},
						}
					},
					prompt: function (links, player) {
						return '将一张牌当作' + get.translation(links[0][2]) + '使用';
					},
				},
				hiddenCard: function (player, name) {
					return (name == 'shan' || name == 'wuxie') && _status.currentPhase == player;
				},
				ai: {
					skillTagFilter: function (player) {
						return player.countCards('he') && _status.currentPhase == player;
					},
					save: true,
					order: 2,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"gezi_muqi2": {
				direct: true,
				popup: false,
				trigger: {
					global: "phaseAfter",
				},
				content: function () {
					player.storage.gezi_muqi = [];
				},
			},
			"gezi_AestusDomusAurea": {
				audio: "ext:东方project:2",
				roundi: true,
				priority: 22,
				spell: ["ADA2"],
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					if (!player.hasSkill('ADA2')) {
						player.loselili(2);
						player.Fuka();
					}
					player.drawTo(player.getHandcardLimit());
				},
				check: function (event, player) {
					return player.getHandcardLimit() - player.countCards('h') >= 2;
				},
			},
			"ADA2": {
				group: "ADA3",
				enable: "phaseUse",
				init: function (player) {
					game.pause();
					player.storage.ADA = [lib.config.background_music, ui.background.style.backgroundImage];
					setTimeout(function () {
						ui.backgroundMusic.src = '';
						player.say('目睹余之才华！耳闻万雷之喝彩！心怀掌权者的荣耀！');
						setTimeout(function () {
							game.playnBackgroundMusic('gezi_nero_2');
							player.say('如花般怒放……开幕吧！黄金的剧场！！');
							setTimeout(function () {
								player.say('以这一轮为供奉吧……飞舞散落为华，斩开切裂为星！这才是至高的美……');
								setTimeout(function () {
									player.say('然后赞颂吧！黄金的剧场！！');
									player.$skill('黄金剧场', null, null, true);
									ui.background.setBackgroundImage('extension/东方project/nero.jpg');
									game.resume();
								}, 1500);
							}, 1500);
						}, 1500);
					}, 1500);
				},
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				onremove: function (player) {
					game.playnBackgroundMusic(player.storage.ADA[0]);
					ui.background.style.backgroundImage = player.storage.ADA[1];
				},
				chooseButton: {
					dialog: function () {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'jinengpai') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = ['jinengpai', '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return true;
					},
					check: function (button) {
						var player = _status.event.player;
						return get.value({
							name: button.link[2]
						});
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return true;
							},
							forced: true,
							position: 'h',
							selectCard: 1,
							audio: "ext:东方project:2",
							check: function (card) {
								return 7 - get.value(card);
							},
							content: function (event, player) {
								player.addJudgen(game.createCard(event.getParent().getParent()._result.links[0][2], '', ''));
								player.say('什么，余居然没有这种技能？');
							}
						}
					},
					prompt: function (links, player) {
						return '弃置一张牌，获得一张' + get.translation(links[0][2]);
					},
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							return 3 - player.countJinengpai('j');
						},
					},
					threaten: 1.5,
				},
			},
			"ADA3": {
				audio: "ext:东方project:2",
				trigger: {
					player: "FukaBefore",
				},
				filter: function (event, player) {
					if (!player.node.fuka) return false;
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					trigger.cancel();
					player.useSkill('gezi_AestusDomusAurea');
				},
				prompt: "是否消耗1点灵力，让符卡不结束？",
				check: function (player) {
					return true;
				},
			},
			"gezi_FaxCaelestis": {
				audio: "ext:东方project:true",
				roundi: true,
				priority: 22,
				spell: ["FCN2"],
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					if (!player.canUseFuka()) return false;
					return player.getLili() > 2;
				},
				content: function () {
					if (!player.hasSkill('FCN2')) {
						player.loselili(2);
						player.Fuka();
					}
					player.drawTo(player.getHandcardLimit());
				},
				check: function (event, player) {
					return player.getHandcardLimit() - player.countCards('h') >= 2;
				},
			},
			"FCN2": {
				audio: "ext:东方project:2",
				group: "FCN3",
				init: function (player) {
					game.pause();
					player.storage.ADA = [lib.config.background_music, ui.background.style.backgroundImage];
					setTimeout(function () {
						ui.backgroundMusic.src = '';
						player.say('春日阳光，鲜花乱舞！五月之风拂面颊，祝福传向星球的远方——');
						setTimeout(function () {
							game.playnBackgroundMusic('gezi_nero_2');
							player.say('开启吧，黄金之结婚礼堂啊！歌颂吧，『星驰的终幕蔷薇』！');
							setTimeout(function () {
								player.say('这是余的大胜利！这份爱，犹如烈焰！');
								setTimeout(function () {
									player.say('稍微说一点悄悄话吧。……这是告白哦——余的奏者，余最喜欢你了！');
									player.$skill('终幕蔷薇', null, null, true);
									ui.background.setBackgroundImage('extension/东方project/nerobridge.png');
									game.resume();
								}, 1500);
							}, 1500);
						}, 1500);
					}, 1500);
				},
				trigger: {
					player: "useCardToPlayer",
				},
				filter: function (event, player) {
					if (event.skill == 'FCN2') return false;
					if (event.targets.length > 1) return false;
					var card = event.card;
					if (['tao', 'wuzhong', 'gezi_danmakucraze'].includes(card.name)) return true;
					return false;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt2('FCN2'), function (card, player, target) {
						if (player == target) return false;
						var trigger = _status.event;
						if (trigger.card.name == "wuzhong") return player != target;
						if (trigger.card.name == "tao") return player != target;
						return player.canUse(trigger.card, target) && trigger.targets.includes(target) == false;
					}).set('ai', function (target) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						return get.effect(target, trigger.card, player, player) + 0.01;
					}).set('targets', trigger.targets).set('card', trigger.card);
					"step 1"
					if (result.bool) {
						event.target = result.targets[0];
						game.log(event.target, '成为了', trigger.card, '的额外目标');
						player.logSkill('FCN2', event.target);
						player.line(event.target);
						trigger.getParent().targets.push(event.target);
					}
				},
			},
			"FCN3": {
				audio: "ext:东方project:2",
				trigger: { player: 'useCardToPlayer' },
				filter: function (event, player) {
					if (!game.hasPlayer(function (target) {
						return !event.targets.includes(target) && event.player != target && event.player.canUse(event.card.name, target, false);
					})) return false;
					if (player.hasSkill('FCN3temp')) return false;
					var card = event.card;
					if (get.tag(card, 'damage') > 0) return true;
					return false;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt2('FCN3'), function (card, player, target) {
						if (player == target) return false;
						var evt = _status.event.getTrigger();
						return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target);
					}).set('ai', function (target) {
						var trigger = _status.event.getTrigger();
						var player = _status.event.player;
						return get.effect(target, trigger.card, player, player) + 0.01;
					});
					"step 1"
					if (result.bool) {
						player.logSkill('FCN3', event.target);
						player.addTempSkill('FCN3temp');
						event.target = result.targets[0];
						var cards = [];
						for (var i = 0; i < trigger.cards.length; i++) {
							if (get.position(trigger.cards[i]) == 'd') {
								cards.push(trigger.cards[i]);
							}
						}
						if (cards.length) {
							event.target.gain(cards);
							event.target.$gain2(cards);
						}
						trigger.untrigger();
						trigger.getParent().player = event.target;
						game.log(event.target, '成为了', trigger.card, '的使用者');
					}
					else {
						event.finish();
					}
				}
			},
			"FCN3temp": {},
			//凛
			"gezi_cuican": {
				mod: {
					liliExtend: function (player, num) {
						return num + player.countCards('h', function (card) {
							return get.info(card).enhance;
						}) + (player.hasExpansions('gezi_cuican_stone') ? 3 : 0);
					}
				},
				audio: 2,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter: function (event, player) {
					return event.name != 'phase' || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				content: function () {
					player.addToExpansion(get.cards(), 'gain2').gaintag.add('gezi_cuican_stone');
				},
				group: 'gezi_cuican_coins',
				subSkill: {
					coins: {
						trigger: {
							player: "loseliliBegin",
						},
						filter: function (event, player) {
							var cards = player.getExpansions('gezi_cuican_stone');
							cards.addArray(player.getCards('h', function (card) {
								return get.info(card).enhance;
							}));
							return cards.length > 0;
						},
						direct: true,
						content: function () {
							'step 0'
							var cards = player.getExpansions('gezi_cuican_stone');
							cards.addArray(player.getCards('h', function (card) {
								return get.info(card).enhance;
							}));
							var next = player.chooseCardButton(cards, '选择灵力消耗的代替品', [1, cards.length]);
							next.set('filterButton', function (button) {
								var checknum = 0;
								if (ui.selected.buttons.length) {
									for (var i of ui.selected.buttons) {
										if (player.getExpansions('gezi_cuican_stone').includes(i)) checknum += 3;
										else checknum++;
									}
									if (checknum == _status.event.num) return false;
									return true;
								}
								return true;
							});
							next.set('filterOk', function (button) {
								var checknum = 0;
								if (ui.selected.buttons.length) {
									for (var i of ui.selected.buttons) {
										if (player.getExpansions('gezi_cuican_stone').includes(i)) checknum += 3;
										else checknum++;
									}
									if (checknum <= _status.event.num) return true;
									return false;
								}
							});
							next.set('num', trigger.num);
							next.set('ai', function (button) {
								var val = get.value(button.link);
								return val;
							});
							if (player.lili < trigger.num) next.set('forced', true);
							'step 1'
							if (result.bool && result.links) {
								var num = 0;
								player.loseToDiscardpile(result.links);
								for (var i of result.links) {
									if (i.original != 'h') num += 3;
									else num++;
								}
								trigger.num -= num;
							}
						}
					}
				}
			},
			"gezi_cuican_stone": {
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
			"gezi_shanyao": {
				enable: 'phaseUse',
				filter: function (event, player) {
					var list = [];
					for (var name of lib.inpile) {
						var info = get.info({ name: name });
						if (info.type != 'trick') continue;
						if (info.notarget) continue;
						if (!info.selectTarget) continue
						var card = { name: name, isCard: true };
						var num = game.countPlayer(current => {
							return player.canUse(card, current);
						});
						if (num > player.getLili()) continue;
						if (player.hasUseTarget(card)) {
							list.push([info.type, '', name]);
						}
					}
					return list.length > 0;
				},
				content: function () {
					'step 0'
					var list = [];
					for (var name of lib.inpile) {
						var info = get.info({ name: name });
						if (info.type != 'trick') continue;
						if (info.notarget) continue;
						if (!info.selectTarget) continue
						var card = { name: name, isCard: true };
						var num = game.countPlayer(current => {
							return player.canUse(card, current);
						});
						if (num > player.getLili()) continue;
						if (player.hasUseTarget(card)) {
							list.push([info.type, '', name]);
						}
					}
					if (list.length) {
						player.chooseButton(['是否视为使用一张锦囊牌？', [list, 'vcard']]).set('ai', function (button) {
							return _status.event.player.getUseValue({ name: button.link[2] });
						});
					}
					else event.finish();
					'step 1'
					if (result.bool) {
						event.card = { name: result.links[0][2], nature: result.links[0][3], isCard: true };
						var num = game.countPlayer(current => {
							return player.canUse({ name: result.links[0][2], nature: result.links[0][3], isCard: true }, current);
						});
						player.loselili(num);
					} else event.finish();
					'step 2'
					player.chooseUseTarget(event.card, true, false);
				},
				group: 'gezi_shanyao_moretg',
				subSkill: {
					moretg: {
						trigger: {
							player: "useCard2",
						},
						filter: function (event, player) {
							var type = get.type(event.card, false);
							return type == 'trick' && player.getLili() > 0 && game.hasPlayer(target => !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target));
						},
						prompt: '闪耀：额外指定目标',
						content: function () {
							'step 0'
							var num = player.getLili();
							var filter = function (event, player) {
								var card = event.card, info = get.info(card);
								if (info.allowMultiple == false) return false;
								if (event.targets && !info.multitarget) {
									if (game.hasPlayer(function (current) {
										return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
									})) {
										return true;
									}
								}
								return false;
							}
							if (!filter(trigger, player)) event.finish();
							else {
								var prompt = '为' + get.translation(trigger.card) + '增加至多' + get.cnNumber(num) + '个合法目标？';
								trigger.player.chooseTarget(get.prompt('gezi_shanyao'), prompt, [1, num], function (card, player, target) {
									var player = _status.event.player;
									return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
								}).set('ai', function (target) {
									var trigger = _status.event.getTrigger();
									var player = _status.event.player;
									return get.effect(target, trigger.card, player, player);
								}).set('card', trigger.card).set('targets', trigger.targets);
							}
							'step 1'
							if (result.bool) {
								if (!event.isMine() && !event.isOnline()) game.delayx();
							}
							else event.finish();
							'step 2'
							player.logSkill('gezi_shanyao', result.targets);
							game.log(result.targets, '也成为了', trigger.card, '的目标');
							trigger.targets.addArray(result.targets);
							player.loselili(result.targets.length);
						},
					}
				}
			},
			//斯卡哈
			"gezi_ruizhi": {
				audio: "ext:东方project:3",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				frequent: true,
				filter: function () {
					return true;
				},
				content: function () {
					'step 0'
					player.judge();
					'step 1'
					event.cards = [result.card];
					player.judge();
					'step 2'
					event.cards.push(result.card);
					player.judge();
					'step 3'
					event.cards.push(result.card);
					var list = [];
					for (var i = 0; i < event.cards.length; i++) {
						if (get.suit(event.cards[i]) == 'spade') {
							if (!list.contains('♠：获得2点灵力')) list.push('♠：获得2点灵力');
						} else if (get.suit(event.cards[i]) == 'club') {
							if (!list.contains('♣：将一名角色的一张牌置于牌堆顶')) list.push('♣：将一名角色的一张牌置于牌堆顶');
						} else if (get.suit(event.cards[i]) == 'diamond') {
							if (!list.contains('♢：视为使用一张【杀】')) list.push('♢：视为使用一张【杀】');
						}
					}
					if (list.length == 0) event.finish();
					event.list = list;
					'step 4'
					if (event.list.length == 0) event.finish();
					var str = '选择一项效果执行';
					if (player.hasSkill('gezi_mojing0')) str = '选择下一项执行的效果';
					player.chooseControl(event.list).set('ai', function () {
						if (event.list.contains('♣：将一名角色的一张牌置于牌堆顶')) return '♣：将一名角色的一张牌置于牌堆顶';
						if (event.list.contains('♢：视为使用一张【杀】')) return '♢：视为使用一张【杀】';
						if (event.list.contains('♠：获得2点灵力') && player.lili < 2) return '♠：获得2点灵力';
						return event.list.randomGet();
					}).set('prompt', str);
					'step 5'
					event.control = result.control;
					if (result.control == '♠：获得2点灵力') {
						player.gainlili(2);
					} else if (result.control == '♣：将一名角色的一张牌置于牌堆顶') {
						player.chooseTarget('选择一名角色，将其一张牌置于牌堆顶', function (card, player, target) {
							return target.countCards('he');
						}).set('ai', function (target) {
							return -get.attitude(player, target);
						});
					} else if (result.control == '♢：视为使用一张【杀】') {
						player.chooseTarget('选择【杀】的目标', function (card, player, target) {
							return player.canUse({
								name: 'sha'
							}, target, false);
						}).set('ai', function (target) {
							return get.effect(target, {
								name: 'sha'
							}, _status.event.player);
						});
					} else {
						event.finish();
					}
					'step 6'
					if (result.bool) {
						if (event.control == '♢：视为使用一张【杀】') {
							player.line(result.targets, 'red');
							player.useCard({
								name: 'sha'
							}, result.targets[0], false);
						} else if (event.control == '♣：将一名角色的一张牌置于牌堆顶') {
							event.target = result.targets[0];
							player.choosePlayerCard('he', '将' + get.translation(event.target) + '的一张牌置于牌堆顶', true, event.target);
						}
					}
					'step 7'
					if (result.bool && event.control == '♣：将一名角色的一张牌置于牌堆顶') {
						player.line(event.target, 'red');
						game.log(event.target, '的一张牌置于牌堆顶');
						var card = result.links[0];
						event.target.lose(card, ui.special);
						card.fix();
						event.card = card;
					}
					'step 8'
					if (event.card && event.control == '♣：将一名角色的一张牌置于牌堆顶') {
						ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
					}
					'step 9'
					if (player.hasSkill('gezi_mojing0')) {
						event.list.remove(event.control);
						if (event.list.length) event.goto(4);
					}
				},
			},
			"gezi_mojing": {
				spell: ["gezi_mojing1"],
				audio: "ext:东方project:3",
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				check: function (event, player) {
					var players = game.filterPlayer();
					var num = 0;
					for (var i = 0; i < players.length; i++) {
						if (players[i] == player) continue;
						if (get.attitude(player, players[i]) > 0) {
							if (players[i].hp == 1) {
								num -= 2;
							} else {
								num--;
							}
						} else {
							if (players[i].hp == 1) {
								num += 2;
							} else {
								num++;
							}
						}
						return num;
					}
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
					player.addSkill('gezi_mojing0');
					player.useCard({
						name: 'gezi_simen'
					}, game.filterPlayer().remove(player));
				},
			},
			"gezi_mojing0": {
				init: function () {
					lib.translate['gezi_ruizhi_info'] = '准备阶段，你可以判定3次，然后选择所有项：若结果中有黑桃，你获得2点灵力；若有方片，你视为使用一张无视距离的【杀】；若有梅花，你将一张角色的一张牌置于牌堆顶。';
				},
			},
			"gezi_mojing1": {
				trigger: {
					global: "discardAfter",
				},
				direct: true,
				filter: function (event, player) {
					if (player.lili <= 1) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.suit(event.cards[i]) == 'heart' && get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					"step 1"
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.suit(trigger.cards[i]) == 'heart' && get.position(trigger.cards[i]) == 'd') {
							cards.push(trigger.cards[i]);
						}
					}
					if (cards.length) {
						var players = game.filterPlayer();
						player.logSkill("gezi_mojing", players);
						for (var i = 0; i < players.length; i++) {
							if (players[i] != player) {
								players[i].loseHp();
							}
						}
						player.loselili();
					}
				},
			},
			//玉藻前
			"gezi_liyu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseDrawBegin1",
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt('gezi_liyu'), function (card, player, target) {
						return player != target;
					}, function (target) {
						if (get.attitude(_status.event.player, target) > 0 && target.hp <= 2) return 10;
						return get.attitude(_status.event.player, target);
					});
					"step 1"
					if (result.bool) {
						event.target = result.targets[0];
						var list = ['对方摸一张牌', '对方回复1点体力', '对方获得1点灵力', '对方贴一张技能牌'];
						if (!event.target.node.lili) list.remove('对方获得1点灵力');
						if (event.target.isHealthy()) list.remove('对方回复1点体力');
						player.logSkill('gezi_liyu', result.targets);
						player.chooseControl(list, true).set('prompt', '要送给' + get.translation(event.target) + '什么？').set('ai', function (card, player, target) {
							var target = event.target;
							if (target.hp <= 2 && target.hp <= player.hp && list.contains('对方回复1点体力')) return '对方回复1点体力';
							if (target.countJinengpai('j') < 2 && list.contains('对方贴一张技能牌')) return '对方贴一张技能牌';
							return '对方摸一张牌';
						});
						trigger.cancel(null, null, 'notrigger');
					} else {
						event.finish();
					}
					"step 2"
					if (result.control) {
						if (result.control == '对方摸一张牌') {
							event.target.draw();
						} else if (result.control == '对方回复1点体力') {
							event.target.recover();
						} else if (result.control == '对方获得1点灵力') {
							event.target.gainlili();
						} else if (result.control == '对方贴一张技能牌') {
							event.target.useSkill('gezi_jinengpai_use');
						}
						var list2 = ['对方摸一张牌', '对方回复1点体力', '对方获得1点灵力', '对方贴一张技能牌'];
						list2.remove(result.control);
						event.list = list2;
						if (!player.node.lili) event.list.remove('对方获得1点灵力');
						if (player.isHealthy()) event.list.remove('对方回复1点体力');
						event.target.chooseControl(event.list, true).set('prompt', '要送给' + get.translation(player) + '什么？').set('ai', function (player) {
							var player = _status.currentPhase;
							if (player.hp <= 2 && event.list.contains('对方回复1点体力')) return '对方回复1点体力';
							if (player.countJinengpai('j') < 2 && event.list.contains('对方贴一张技能牌')) return '对方贴一张技能牌';
							return '对方摸一张牌';
						});
					}
					"step 3"
					if (result.control) {
						if (result.control == '对方摸一张牌') {
							player.draw();
						} else if (result.control == '对方回复1点体力') {
							player.recover();
						} else if (result.control == '对方获得1点灵力') {
							player.gainlili();
						} else if (result.control == '对方贴一张技能牌') {
							player.useSkill('gezi_jinengpai_use');
						}
					}
				},
			},
			"gezi_zhoufa": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseJieshuEnd",
				},
				filter: function (event, player) {
					return player.countCards('he');
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseCardTarget({
						prompt: '弃置一张牌，令一名角色获得一个摸牌阶段或出牌阶段',
						filterCard: true,
						position: 'he',
						filterTarget: function (card, player, target) {
							return true;
						},
						ai1: function (card) {
							return 8 - get.value(card);
						},
						ai2: function (target) {
							if (target == player) return 15;
							return get.attitude(player, target);
						},
					});
					"step 1"
					if (result.targets) {
						player.discard(result.cards[0]);
						player.logSkill('gezi_zhoufa', result.targets[0]);
						event.target = result.targets[0];
						event.target.chooseControl(['摸牌阶段', '出牌阶段'], true).set('prompt', '选择一个阶段执行').set('ai', function () {
							return '摸牌阶段';
						});
					}
					"step 2"
					if (result.control) {
						event.target.addSkill('gezi_zhoufa_phase');
						event.target.storage.gezi_zhoufa = result.control;
					}
				},
			},
			"gezi_zhoufa_phase": {
				trigger: {
					global: "phaseAfter",
				},
				direct: true,
				content: function () {
					if (player.storage.gezi_zhoufa) {
						if (player.storage.gezi_zhoufa == '摸牌阶段') {
							player.phaseDraw();
						} else if (player.storage.gezi_zhoufa == '出牌阶段') {
							player.phaseUse();
						}
					}
					player.removeSkill('gezi_zhoufa_phase');
					delete player.storage.gezi_zhoufa;
				},
			},
			"gezi_shuitian": {
				spell: ["gezi_shuitian_1"],
				cost: 0,
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				filter: function (event, player) {
					return player.lili > 1 && game.hasPlayer(function (current) {
						return current.hp < current.maxHp || current.lili < current.maxlili;
					});
				},
				check: function (event, player) {
					if (player.lili > 2) return true;
				},
				content: function () {
					player.storage.gezi_shuitian = player.lili - 1;
					player.loselili(player.lili - 1);
					player.say('水天日光天照八野镇石!');
					player.Fuka();
				},
			},
			"gezi_shuitian_1": {
				trigger: {
					player: "phaseBegin",
				},
				direct: true,
				content: function () {
					"step 0"
					if (!player.storage.gezi_shuitian) {
						delete player.storage.gezi_shuitian;
						event.finish();
					}
					if (player.storage.gezi_shuitian == 4) {
						if (!game.dead || game.dead.length == 0) return;
						game.players.addArray(game.dead);
					}
					"step 1"
					player.chooseTarget('为一名角色分配1点体力或1点灵力，还剩' + player.storage.gezi_shuitian + '点', function (card, player, target) {
						if ((target.isHealthy() || target.storage.shuihp) && (target.lili == target.maxlili || target.node.fuka || target.storage.shuilili)) return false;
						return true;
					}).ai = function (target) {
						return get.attitude(player, target) > 0;
					};
					"step 2"
					if (result.bool) {
						event.target = result.targets[0];
						event.control = ['回复1点体力', '获得1点灵力'];
						if (event.target.storage.shuihp || event.target.isHealthy()) {
							event.control.remove('回复1点体力');
						}
						if (event.target.storage.shuilili || event.target.lili == event.target.maxlili || event.target.node.fuka) {
							event.control.remove('获得1点灵力');
						}
						player.chooseControl(event.control, true).set('prompt', '要让' + get.translation(event.target) + '怎么做？').set('ai', function () {
							if (event.control.contains('回复1点体力')) return '回复1点体力';
							return '获得1点灵力';
						});
					} else {
						if (player.storage.gezi_shuitian) {
							player.draw(player.storage.gezi_shuitian);
						}
						event.finish();
					}
					"step 3"
					if (result.control == '回复1点体力') {
						if (event.target.isDead()) {
							event.target.revive(1);
							if (event.target.node.dieidentity) {
								event.target.node.dieidentity.hide();
								delete event.target.node.dieidentity;
							}
						} else {
							event.target.recover();
						}
						event.target.storage.shuihp = true;
					} else if (result.control == '获得1点灵力') {
						event.target.gainlili();
						event.target.storage.shuilili = true;
					}
					"step 4"
					player.storage.gezi_shuitian--;
					if (player.storage.gezi_shuitian) {
						event.goto(1);
					} else if (!player.storage.gezi_shuitian) {
						game.players.remove(game.dead);
						delete player.storage.gezi_shuitian;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							delete players[i].storage.shuihp;
							delete players[i].storage.shuilili;
						}
					}
				},
			},
			//爱丽丝
			"gezi_waimai": {
				forced: true,
				trigger: { player: 'phaseJieshuBegin' },
				filter: function (event, player) {
					return player.lili == 0;
				},
				content: function () {
					player.draw(2);
				},
			},
			"gezi_heike": {
				enable: 'phaseUse',
				usable: 1,
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return target.countCards('h') && target != player;
				},
				filter: function (event, player) {
					return player.getLili() > 0;
				},
				content: function () {
					'step 0'
					player.loselili();
					event.videoId = lib.status.videoId++;
					var cards = target.getCards('h');
					if (player.isOnline2()) {
						player.send(function (cards, id) {
							ui.create.dialog('黑客', cards).videoId = id;
						}, cards, event.videoId);
					}
					event.dialog = ui.create.dialog('黑客', cards);
					event.dialog.videoId = event.videoId;
					if (!event.isMine()) {
						event.dialog.style.display = 'none';
					}
					player.chooseButton().set('filterButton', function (button) {
						return true;
					}).set('dialog', event.videoId);
					"step 1"
					if (result.bool) {
						player.gain(result.links[0], target);
						if (player.isOnline2()) {
							player.send('closeDialog', event.videoId);
						}
						event.dialog.close();
						event.finish();
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							return -target.countCards('h');
						}
					},
					order: 10,
					expose: 0.4,
				}
			},
			//贞德
			'gezi_chouzi': {
				onremove: true,
				trigger: {
					source: "damageBegin1",
					player: "damageAfter",
				},
				getMax: function () {
					var getNum = function (current) {
						var history = current.actionHistory;
						var num = 0;
						for (var i = history.length - 2; i >= 0; i--) {
							for (var j = 0; j < history[i].sourceDamage.length; j++) {
								num += history[i].sourceDamage[j].num;
							}
							if (history[i].isRound) break;
						}
						return num;
					};
					var max = 0, current = false, targets = game.filterPlayer();
					for (var target of targets) {
						var num = getNum(target);
						if (num > max) {
							max = num;
							current = target;
						}
						else if (num == max) current = false;
					}
					return num;
				},
				filter: function (event, player) {
					if (event._notrigger.includes(event.player) || !event.player.isIn()) return false;
					if (!event.source || event.source == event.player) return false;
					if (!player.storage.gezi_chouzi) {
						player.storage.gezi_chouzi = [];
					}
					if (event.source == player && player.storage.gezi_chouzi.includes(event.player) && game.roundNumber > 1) return true;
					if (event.source != player && !player.storage.gezi_chouzi.includes(event.source)) return true;
					return false;
				},
				frequent: true,
				logTarget: "player",
				mark: true,
				intro: {
					content: "player",
				},
				content: function () {
					if (!player.storage.gezi_chouzi) {
						player.storage.gezi_chouzi = [];
					}
					if (trigger.source != player) {
						player.storage.gezi_chouzi.add(trigger.source);
					} else trigger.num += lib.skill.gezi_chouzi.getMax();
				},
			},
			'gezi_yuanfen': {
				trigger: {
					player: ["phaseUseBegin", "phaseJieshuBegin"],
					source: "damageSource",
				},
				forced: true,
				filter: function (event, player, name) {
					if (name == 'phaseJieshu') return true;
					if (name == 'damageSource' && event.player.hasSkill('gezi_yuanfen_yuan')) return true;
					return player.storage.gezi_chouzi && player.storage.gezi_chouzi.length;
				},
				content: function () {
					if (trigger.name == 'phaseJieshu') {
						if (!player.getHistory('custom', function (evt) {
							return evt.gezi_yuanfen == true;
						}).length) {
							for (var i of game.players) i.removeSkill('gezi_yuanfen_yuan');
						}
					} else if (trigger.name == 'damageSource') {
						if (trigger.player.hasSkill('gezi_yuanfen_yuan')) player.getHistory('custom').push({ gezi_yuanfen: true });
					} else {
						var tgs = player.storage.gezi_chouzi.shift();
						var tg = game.findPlayer(target => target == tgs);
						if (tg && tg.isAlive()) {
							tg.addSkill('gezi_yuanfen_yuan');
							player.recover()
						}
					}
				},
				group: 'gezi_yuanfen_draw',
				subSkill: {
					draw: {
						trigger: {
							source: "dying",
						},
						filter: function (event, player) {
							return event.player.hasSkill('gezi_yuanfen_yuan') && event.player.hp < 0;
						},
						forced: true,
						content: function () {
							player.draw(2);
						}
					}
				},
				mod: {
					cardUsableTarget: function (card, player, target) {
						if (target.hasSkill('gezi_yuanfen_yuan')) return true;
					},
					targetInRange: function (card, player, target, now) {
						if (target.hasSkill('gezi_yuanfen_yuan')) return true;
					},
				},
			},
			'gezi_yuanfen_yuan': {
				mark: true,
				intro: {
					name: '怨忿',
					content: '假如有上帝的话',
				}
			},
			'gezi_huiqiong': {
				audio: "ext:东方project:2",
				enable: 'chooseToUse',
				spell: ["gezi_huiqiong1"],
				infinite: true,
				roundi: true,
				priority: 22,
				filter: function (event, player) {
					if (event.type == 'dying') {
						if (player != event.dying) return false;
						if (player.node.fuka) return false;
						if (!player.canUseFuka()) return false;
						if (player.storage.gezi_huiqiong) return false;
						return true;
					}
					return false;
				},
				content: function () {
					player.lili = 1;
					player.say('【符卡】咆哮吧！我的愤怒');
					player.storage.gezi_huiqiong = true;
					player.Fuka();
					player.updatelili();
				},
				check: function (event, player) {
					return true;
				},
				ai: {
					order: 1,
					save: true,
					skillTagFilter: function (player) {
						return _status.event.dying == player && !player.node.fuka;
					},
					result: {
						player: function (player) {
							if (player.hp <= 0) return 10;
							return 0;
						}
					},
				}
			},
			"gezi_huiqiong1": {
				init: player => player.nodying = true,
				onremove: player => delete player.nodying,
				trigger: {
					player: ["phaseEnd", "changeHpBegin"],
				},
				filter: function (event, player, name) {
					if (name == 'changeHpBegin') return player.hp < 1 && event.num < 0;
					return true;
				},
				direct: true,
				async content(event, trigger, player) {
					let num = (trigger.name == 'changeHp') ? Math.abs(trigger.num) : 1;
					player.loseMaxHp(num);
				},
				group: ["gezi_huiqiong1_fire"],
				subSkill: {
					"fire": {
						trigger: {
							source: "damageBefore",
						},
						filter: function (event, player) {
							return event.nature != 'fire';
						},
						forced: true,
						async content(event, trigger, player) {
							trigger.nature = 'fire';
						},
						sub: true,
					}
				},
			},
			//凉宫春日
			"gezi_haruhi1": {
				enable: 'phaseUse',
				content: function () {
					'step 0'
					player.chooseControl('移除牌', '创建牌', '世界线重置');
					'step 1'
					if (result.control == '移除牌') {
						var cards = [];
						for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
							cards.push(ui.cardPile.childNodes[i]);
						}
						player.chooseCardButton([1, Infinity], '移除任意张牌', cards).set('filterButton', function (button) {
							return true;
						});
					} else if (result.control == '创建牌') {
						event.goto(4);
					} else if (result.control == '世界线重置') {
						delete lib.config.customcardpile['当前牌堆'];
						game.saveConfig('customcardpile', lib.config.customcardpile);
						game.saveConfig('cardpilename', '默认牌堆', true);
						return;
					}
					'step 2'
					if (result.bool) {
						console.log(result.links);
						game.removeCardByObject(result.links);
						let mode = 'standard';
						for (var i = result.links.length - 1; i >= 0; i--) {
							var card = [get.suit(result.links[i]), result.links[i].number.toString(), result.links[i].name];
							if (lib.config.addedpile) {
								//lib.cardPack[];
								for (var j = lib.config.addedpile['standard'].length - 1; j >= 0; j--) {
									if (JSON.stringify(lib.config.addedpile['standard'][j]) === JSON.stringify(card)) {
										lib.config.addedpile['standard'].splice(j, 1);
										var flag = true;
										break;
									}
								}
								if (flag) continue;
							}
							for (var h = 0; h < lib.cardPile[mode].length; h++) {
								var c = lib.cardPile[mode][h];
								if (c[0] == card[0] && c[1] == card[1] && c[2] == card[2]) {
									lib.config.bannedpile[mode].push(h);
									break;
								}
							}
						}
						lib.config.customcardpile['当前牌堆'] = [lib.config.bannedpile, lib.config.addedpile];
						game.saveConfig('customcardpile', lib.config.customcardpile);
						game.saveConfig('cardpilename', '当前牌堆', true);
						return true;
					}
					'step 3'
					event.goto(8);
					'step 4'
					var list = [];
					for (var i in lib.card) {
						if (!lib.card[i].type) continue;
						if (lib.card[i].type == 'delay') continue;
						if (!lib.translate[i]) continue;
						if (!lib.translate[i + '_info']) continue;
						list.add(i);
					}
					player.chooseButton(['选择一种牌加入', [list, 'vcard']], true).set('filterButton', function (button) {
						return true;
					});
					'step 5'
					if (result.bool) {
						event.card = result.links[0];
						player.chooseControl('heart', 'spade', 'diamond', 'club').set('prompt', '选择' + get.translation(event.card[2]) + '的花色');
					}
					'step 6'
					if (result.control) {
						event.color = result.control;
						player.chooseControl(['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']).set('prompt', '选择' + get.translation(event.card[2]) + '的点数');
					}
					'step 7'
					if (result.control) {
						var num = result.control;
						switch (num) {
							case 'A': num = 1; break;
							case 'J': num = 11; break;
							case 'Q': num = 12; break;
							case 'K': num = 13; break;
							default: num = num;
						}
						lib.config.addedpile['standard'].push([event.color, num, event.card[2]]);
						lib.config.customcardpile['当前牌堆'] = [lib.config.bannedpile, lib.config.addedpile];
						game.saveConfig('customcardpile', lib.config.customcardpile);
						game.saveConfig('cardpilename', '当前牌堆', true);
						ui.cardPile.appendChild(game.createCard(event.card[2], event.color, num));
						game.broadcastAll(function (num1, num2) {
							if (ui.cardPileNumber) ui.cardPileNumber.innerHTML = num1 + '轮 剩余牌: ' + num2;
						}, game.roundNumber, ui.cardPile.childNodes.length);
						return true;
					}
					'step 8'
				},
			},
			"gezi_haruhi2": {
				forced: true,
				trigger: { player: 'phaseEnd' },
				filter: function (event, player) {
					return player.getLili() > 0;
				},
				content: function () {
					'step 0'
					event.num = player.getLili();
					'step 1'
					player.chooseTarget('选择一名角色（还剩' + event.num + '次）', true);
					'step 2'
					if (result.targets) {
						event.target = result.targets[0];
						var list = ['从牌堆随机位置获得一张牌', '获得随机一个技能'];
						player.chooseControlList(list, true).set('prompt', '为' + get.translation(event.target) + '选择一项，还剩' + event.num + '次');
					}
					'step 3'
					if (result.index == 0) {
						event.target.gain(ui.cardPile.childNodes[Math.floor(Math.random() * ui.cardPile.childNodes.length)]);
					} else if (result.index == 1) {
						var lis = Object.keys(lib.skill);
						for (; ;) {
							var s = lis.randomGet();
							if (lib.translate[s] && lib.translate[s + "_info"]) {
								event.target.addSkill(s);
								break;
							}
						}
					}
					'step 4'
					event.num--;
					if (event.num) {
						event.goto(1);
					}
				},
			},
			//M4A1
			"gezi_huoli": {
				audio: "ext:东方project:2",
				trigger: {
					player: "shaBefore",
				},
				direct: true,
				filter: function (event, player) {
					if (player.storage.counttrigger && player.storage.counttrigger['gezi_huoli']) return false;
					return player.countCards('he');
				},
				content: function () {
					'step 0'
					player.chooseToDiscard(1, 'he').set('ai', function (card) {
						var player = _status.event.player;
						if (get.damageEffect(trigger.targets[0], player, player, 'fire') <= 0) return 0;
						return 6 - get.value(card);
					});
					'step 1'
					if (result.bool) {
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['gezi_huoli']) {
							player.storage.counttrigger['gezi_huoli'] = 1;
						} else {
							player.storage.counttrigger['gezi_huoli']++;
						}
						player.logSkill('gezi_huoli', trigger.targets[0]);
						player.addTempSkill('gezi_huoli_1', {
							player: 'shaAfter'
						});
					}
				},
			},
			"gezi_huoli_1": {
				trigger: {
					source: "damageEnd",
				},
				direct: true,
				filter: function (event, player) {
					return event.card && event.card.name == 'sha';
				},
				content: function () {
					game.delay(2);
					player.line(trigger.player, 'green');
					trigger.player.damage('fire');
				},
			},
			"gezi_zhihui": {
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					if (event.player == player) {
						return true;
					} else {
						return player.lili;
					}
				},
				content: function () {
					'step 0'
					if (trigger.player != player) {
						player.loselili();
					}
					player.line(trigger.player, 'green');
					trigger.player.chooseControl(['摸一张牌', '多出一张杀', '获得1点灵力'], true).set('ai', function () {
						if (trigger.player.countCards('h', {
							name: 'sha'
						}) > 1) return '多出一张杀';
						if (trigger.player.lili < 2) return '获得1点灵力';
						return '摸一张牌';
					});
					'step 1'
					if (result.control == '摸一张牌') {
						trigger.player.draw();
					} else if (result.control == '多出一张杀') {
						trigger.player.addTempSkill('gezi_zhihui_1');
					} else if (result.control == '获得1点灵力') {
						trigger.player.gainlili();
					}
				},
				check: function (event, player) {
					if (event.player == player) return true;
					return get.attitude(player, event.player) > 0 && player.lili > 1;
				},
			},
			"gezi_zhihui_1": {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
				},
			},
			"gezi_shenyuan": {
				audio: "ext:东方project:2",
				cost: 2,
				spell: ["gezi_shenyuan_1"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_shenyuan.cost;
				},
				content: function () {
					player.loselili(lib.skill.gezi_shenyuan.cost);
					player.Fuka();
				},
				check: function (event, player) {
					return player.countCards('h', {
						name: 'sha'
					}) || player.maxHp - player.hp > 1;
				},
			},
			"gezi_shenyuan_1": {
				trigger: {
					player: "shaBegin",
				},
				"prompt2": "你可以令该【杀】无法闪避",
				content: function () {
					trigger.directHit = true;
				},
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name == 'sha' && range[1] != -1) range[1] = player.maxHp - player.hp;
					},
				},
			},
			//惠惠
			"gezi_honglian": {
				audio: "ext:东方project:2",
				trigger: {
					global: "damageAfter",
				},
				filter: function (event, player) {
					if (event.player == player) return false;
					if (_status.currentPhase != player) return false;
					if (player.storage.counttrigger && player.storage.counttrigger['gezi_honglian']) return false;
					return event.player.isAlive();
				},
				direct: true,
				content: function (event, player) {
					'step 0'
					var eff1 = get.effect(trigger.player, {
						name: "sha"
					}, player, player);
					var eff2 = 0;
					var list = ['视为对' + get.translation(trigger.player) + '出一张杀'];
					var players = [];
					var players2 = game.filterPlayer();
					if (player.lili > 0) {
						for (var i = 0; i < players2.length; i++) {
							if (players2[i] == player) continue;
							if (get.distance(trigger.player, players2[i]) <= player.lili) {
								players.push(players2[i]);
								eff2 += get.effect(players2[i], {
									name: "sha"
								}, player, player);
							}
						}
					}
					event.players = players;
					if (player.lili > 0) {
						list.push('视为对距离内的' + get.translation(event.players) + '出一张杀');
					}
					event.list = list;
					player.chooseControlList(list).set('prompt', '是否发动【红莲】？').set('ai', function (event, player) {
						if (eff1 > 0 && eff1 >= eff2) return list.indexOf('视为对' + get.translation(trigger.player) + '出一张杀');
						if (eff2 > 0 && eff2 >= eff1) return list.indexOf('视为对距离内的' + get.translation(event.players) + '出一张杀');
						return list.indexOf('cancel2');
					}).set('eff1', eff1).set('eff2', eff2);
					'step 1'
					if (event.list[result.index] == '视为对' + get.translation(trigger.player) + '出一张杀') {
						player.logSkill('gezi_honglian', trigger.player);
						player.useCard({
							name: 'sha'
						}, trigger.player, false);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['gezi_honglian']) {
							player.storage.counttrigger['gezi_honglian'] = 1;
						} else {
							player.storage.counttrigger['gezi_honglian']++;
						}
					}
					if (event.list[result.index] == '视为对距离内的' + get.translation(event.players) + '出一张杀') {
						player.logSkill('gezi_honglian', event.players);
						player.useCard({
							name: 'sha'
						}, event.players, false);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['gezi_honglian']) {
							player.storage.counttrigger['gezi_honglian'] = 1;
						} else {
							player.storage.counttrigger['gezi_honglian']++;
						}
					}
				},
			},
			"sbrs_liansuo": {
				audio: "ext:东方project:2",
				trigger: {
					global: "loseAfter",
				},
				direct: true,
				filter: function (event, player) {
					if (event.player == player) return false;
					if (_status.currentPhase != player) return false;
					if (player.storage.counttrigger && player.storage.counttrigger['sbrs_liansuo']) return false;
					if (event.getParent().name == 'discard' || event.getParent().name == 'gain' || event.getParent(2).name == 'gainPlayerCard') {
						return true;
					}
					return false;
				},
				content: function (event, player) {
					'step 0'
					var eff1 = get.effect(trigger.player, {
						name: "sha"
					}, player, player);
					var eff2 = 0;
					var list = ['视为对' + get.translation(trigger.player) + '出一张杀'];
					var players = [];
					var players2 = game.filterPlayer();
					if (player.lili > 0) {
						for (var i = 0; i < players2.length; i++) {
							if (players2[i] == player) continue;
							if (get.distance(trigger.player, players2[i]) <= player.lili) {
								players.push(players2[i]);
								eff2 += get.effect(players2[i], {
									name: "sha"
								}, player, player);
							}
						}
					}
					event.players = players;
					if (player.lili > 0) {
						list.push('视为对距离内的' + get.translation(event.players) + '出一张杀');
					}
					event.list = list;
					player.chooseControlList(list).set('prompt', '是否发动【莲锁】？').set('ai', function (event, player) {
						if (eff1 > 0 && eff1 >= eff2) return list.indexOf('视为对' + get.translation(trigger.player) + '出一张杀');
						if (eff2 > 0 && eff2 >= eff1) return list.indexOf('视为对距离内的' + get.translation(event.players) + '出一张杀');
						return list.indexOf('cancel2');
					}).set('eff1', eff1).set('eff2', eff2);
					'step 1'
					if (event.list[result.index] == '视为对' + get.translation(trigger.player) + '出一张杀') {
						player.logSkill('sbrs_liansuo', trigger.player);
						trigger.player.addTempSkill("sbrs_liansuo_2");
						player.useCard({
							name: 'sha'
						}, trigger.player, false);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['sbrs_liansuo']) {
							player.storage.counttrigger['sbrs_liansuo'] = 1;
						} else {
							player.storage.counttrigger['sbrs_liansuo']++;
						}
					}
					if (event.list[result.index] == '视为对距离内的' + get.translation(event.players) + '出一张杀') {
						player.logSkill('sbrs_liansuo', event.players);
						for (var i = 0; i < event.players.length; i++) {
							event.players[i].addTempSkill("sbrs_liansuo_2");
						}
						player.useCard({
							name: 'sha'
						}, event.players, false);
						if (!player.storage.counttrigger) {
							player.addSkill('counttrigger');
							player.storage.counttrigger = {};
						}
						if (!player.storage.counttrigger['sbrs_liansuo']) {
							player.storage.counttrigger['sbrs_liansuo'] = 1;
						} else {
							player.storage.counttrigger['sbrs_liansuo']++;
						}
					}
				},
			},
			"sbrs_liansuo_2": {
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					return event.getParent().getParent().name == 'sbrs_liansuo';
				},
				direct: true,
				content: function () {
					'step 0'
					var nono = true;
					if (get.effect(player, {
						name: 'sha'
					}, trigger.player, player) >= 0) nono = false;
					player.chooseToDiscard('he', '是否弃置一张非基本牌令莲锁无效？', function (card, player) {
						return get.type(card) != 'basic';
					}).set('ai', function (card) {
						if (_status.event.nono == false) return 0;
						return 8 - get.value(card);
					}).set('nono', nono);
					'step 1'
					if (result.bool) {
						player.logSkill('sbrs_liansuo_2', trigger.player);
						trigger.cancel();
					}
				},
			},
			"gezi_explosion": {
				cost: 4,
				audio: "ext:东方project:1",
				spell: ["gezi_explosion_2"],
				trigger: {
					player: "phaseBegin",
				},
				priority: 22,
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_explosion.cost;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('选择一名角色对其造成两点火焰伤害并弃置装备区所有牌', function (card, player, target) {
						return target != player;
					}).set('ai', function (target) {
						var player = _status.event.player;
						var eff = get.damageEffect(target, player, player, 'fire');
						if (target.countCards('e')) eff++;
						return eff;
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_explosion', result.targets[0]);
						player.loselili(lib.skill.gezi_explosion.cost);
						player.Fuka();
						player.skip('phaseUse');
						player.skip('phaseDiscard');
						result.targets[0].damage(2, 'fire');
						result.targets[0].discard(result.targets[0].getCards('e'));
					}
				},
				ai: {
					threaten: 2,
					tag: {
						firedamage: 2,
					},
				},
			},
			"gezi_explosion_2": {
			},
			//?
			"niguang": {
				group: ['ng_pinjian', 'ng_pinjian3'],
			},
			"ng_pinjian": {
				audio: 2,
				trigger: { player: 'useCardToBegin', target: 'useCardToBegin' },
				filter: function (event, player) {
					if (event._notrigger.includes(player)) return false;
					return event.card && get.tag(event.card, 'damage') > 0 && event.targets.length == 1 && event.player.canCompare(event.target);
				},
				check: function (event, player) {
					if (event.target == player) return -get.attitude(player, event.player);
					return -get.attitude(player, event.target);
				},
				content: function () {
					"step 0"
					event.target = trigger.target;
					if (trigger.target == player) event.target = trigger.player;
					player.chooseToCompare(event.target);
					"step 1"
					if (!result.tie) {
						if (result.bool) {
							player.discardPlayerCard('hej', event.target, true);
						} else {
							event.target.discardPlayerCard('hej', player, true);
						}
					}
				},
				ai: {
					expose: 0.3
				},
			},
			"ng_pinjian3": {
				trigger: { player: 'chooseCardBegin' },
				filter: function (event, player) {
					if (!(event.type == 'compare' && !event.directresult && player.getLili() > 0)) return false;
					if (player == event.parent.target) return event.parent.player.countCards('h') > 0 && event.parent.player.countCards('hej') > 1;
					if (player == event.parent.player) return event.parent.player.countCards('h') > 0 && event.parent.player.countCards('hej') > 1;
					return false;
				},
				content: function () {
					if (trigger.parent && trigger.parent.target) {
						player.loselili();
						if (player == trigger.parent.target) {
							var pos = 'hej';
							if (trigger.parent.player.countCards('h') == 1) pos = 'ej';
							player.discardPlayerCard(pos, trigger.parent.player, true);
						} else {
							var pos = 'hej';
							if (trigger.parent.target.countCards('h') == 1) pos = 'ej';
							player.discardPlayerCard(pos, trigger.parent.target, true);
						}
					}
				},
				prompt2: '消耗1点灵力，弃置与你拼点的角色一张牌',
			},
			"ng_wenhao2": {
				audio: 1,
				derivation: 'ClarentBloodArthur',
				init: function (player) {
					player.storage.ng_wenhao2 = false;
				},
				filter: function (event, player) {
					if (player.storage.ng_wenhao2) return false;
					return player.getLili() > 1;
				},
				trigger: { player: 'phaseBegin' },
				content: function (event, player) {
					'step 0'
					player.draw(player.maxHp - player.hp);
					'step 1'
					player.awakenSkill('ng_wenhao2');
					player.storage.ng_wenhao2 = true;
					'step 2'
					var hp = player.hp;
					var lili = player.lili;
					player.init('mordred');
					player.hp = hp;
					player.lili = lili;
					player.useSkill('ClarentBloodArthur');
					player.update();
					lib.translate['ng_pinjian'] = '逆光';
					lib.translate['ng_pinjian3'] = '逆光';
				},
				check: function (event, player) {
					return player.getLili() > 3 || player.hp < 3;
				},
			},
			"ClarentBloodArthur": {
				audio: 2,
				cost: 1,
				roundi: true,
				spell: ['CBA2'],
				//group:['CBA3'],
				trigger: { player: 'phaseBegin' },
				filter: function (event, player) {
					if (!player.canUseFuka()) return false;
					return !player.node.fuka && get.lingxuCheck(player, 1);
				},
				nobracket: true,
				content: function () {
					player.loselili(lib.skill.ClarentBloodArthur.cost);
					player.Fuka();
					player.maxlili = Infinity;
					//player.maxlili = 8;
				},
			},
			"CBA2": {
				mod: {
					cardnumber: function (card) {
						return 13;
					},
				},
				onremove: function (player) {
					player.maxlili = 5;
					if (player.lili > 0) player.useSkill('CBA3');
				}
			},
			"CBA3": {
				content: function () {
					"step 0"
					player.chooseTarget('对一名角色造成' + player.getLili() + '点伤害', true).set('ai', function (target) {
						return -get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						result.targets[0].damage(player.lili);
					}
					"step 2"
					//player.maxlili = parseInt(lib.character[player.name][6]);
					if (!player.node.fuka) player.maxlili = 5;
					player.loselili(player.lili);
				},
			},
			//利姆鲁
			"gezi_bushizhe": {
				trigger: { source: 'damageAfter' },
				filter: function (event, player) {
					return event.player.isAlive();
				},
				usable: 1,
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				nobracket: true,
				content: function () {
					if (trigger.player.getLili()) {
						trigger.player.loselili();
						player.gainlili();
					}
					if (trigger.player.countCards('h')) player.gainPlayerCard('h', trigger.player, true);
					if (!player.storage.gezi_bushizhe) player.storage.gezi_bushizhe = [];
					if (!player.storage.gezi_bushizhe.includes(trigger.player.name)) player.storage.gezi_bushizhe.push(trigger.player.name);
				}
			},
			"gezi_daxianzhe": {
				trigger: { player: 'phaseZhunbeiBegin' },
				filter: function (event, player) {
					if (!player.storage.gezi_bushizhe || (player.storage.gezi_bushizhe.length == 1 && player.storage.gezi_bushizhe[0] == player.name)) return false;
					return player.getLili() > 1;
				},
				nobracket: true,
				content: function () {
					'step 0'
					player.loselili(2);
					var list = player.storage.gezi_bushizhe;
					var skills = [];
					for (var i of list) {
						skills.addArray((lib.character[i][3] || []).filter(function (skill) {
							var info = lib.translate[skill + '_info'];
							return info && info.indexOf('符卡技') == -1;
						}));
					}
					if (!list.length || !skills.length) { event.finish(); return; }
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					var switchToAuto = function () {
						_status.imchoosing = false;
						event._result = {
							bool: true,
							skills: [skills.randomGet()],
						};
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
					};
					var chooseButton = function (list, skills) {
						var event = _status.event;
						if (!event._result) event._result = {};
						event._result.skills = [];
						var rSkill = event._result.skills;
						var dialog = ui.create.dialog('请选择获得一个技能', [list, 'character'], 'hidden');
						event.dialog = dialog;
						var table = document.createElement('div');
						table.classList.add('add-setting');
						table.style.margin = '0';
						table.style.width = '100%';
						table.style.position = 'relative';
						for (var i = 0; i < skills.length; i++) {
							var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.link = skills[i];
							table.appendChild(td);
							td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
							td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								if (!this.classList.contains('bluebg')) {
									if (rSkill.length >= 1) return;
									rSkill.add(link);
									this.classList.add('bluebg');
								}
								else {
									this.classList.remove('bluebg');
									rSkill.remove(link);
								}
							});
						}
						dialog.content.appendChild(table);
						dialog.add('　　');
						dialog.open();

						event.switchToAuto = function () {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						};
						event.control = ui.create.control('ok', function (link) {
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						});
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add('selectable');
						}
						game.pause();
						game.countChoose();
					};
					if (event.isMine()) {
						chooseButton(list, skills);
					}
					else if (event.isOnline()) {
						event.player.send(chooseButton, list, skills);
						event.player.wait();
						game.pause();
					}
					else {
						switchToAuto();
					}
					'step 1'
					var map = event.result || result;
					if (map && map.skills && map.skills.length) {
						for (var i of map.skills) player.addTempSkill(i);
					}
				}
			},
			//阿尔托莉雅
			'gezi_shengguang': {
				trigger: { player: 'useCardToBegin', target: 'useCardToBegin' },
				filter: function (event, player) {
					if (event._notrigger.includes(player)) return false;
					let pl = (event.player == player) ? event.target : event.player;
					return event.card && get.tag(event.card, 'damage') > 0 && event.targets.length == 1 && player.canCompare(pl);
				},
				check: function (event, player) {
					if (event.target == player) return -get.attitude(player, event.player);
					return -get.attitude(player, event.target);
				},
				async content(event, trigger, player) {
					let pl = (trigger.player == player) ? trigger.target : trigger.player;
					const { result: { bool } } = await player.chooseToCompare(pl);
					if (bool) await player.draw();
					else await pl.draw();
				},
				group: 'gezi_shengguang_win',
				subSkill: {
					win: {
						trigger: {
							player: "compare",
							target: "compare",
						},
						filter: function (event, player) {
							return player.getLili() > 0;
						},
						check: function (event, player) {
							var num1 = event[player == event.player ? 'num1' : 'num2'];
							var num2 = event[player == event.player ? 'num2' : 'num1'];
							var num3 = event[player == event.player ? 'num1' : 'num2'] * 2;
							return num1 < num2 && num3 > num2 && num2 != 13;
						},
						prompt: '是否消耗一点灵力令拼点牌数字翻倍（不大于13）',
						content: function () {
							player.loselili();
							if (player == trigger.target || !trigger.iwhile) {
								var num = trigger[player == trigger.player ? 'num1' : 'num2'] * 2;
								trigger[player == trigger.player ? 'num1' : 'num2'] = Math.min(num, 13);
								game.log(player, '的拼点牌点数翻倍');
							}
						}
					}
				}
			},
			'gezi_shijian': {
				audio: 2,
				cost: 1,
				roundi: true,
				spell: ['gezi_shijian_spell'],
				trigger: { player: 'phaseBegin' },
				filter: function (event, player) {
					if (!player.canUseFuka()) return false;
					return !player.node.fuka && player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.maxlili = Infinity;
				},
			},
			"gezi_shijian_spell": {
				mod: {
					maxHandcardFinal: function (player, num) {
						return 453145;
					},
				},
				onremove: function (player) {
					player.maxlili = 5;
					if (player.lili > 0) player.useSkill('gezi_shijian_attack');
				}
			},
			"gezi_shijian_attack": {
				content: function () {
					"step 0"
					player.chooseTarget('对一名角色造成' + player.getLili() + '点伤害', true).set('ai', function (target) {
						return -get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						result.targets[0].damage(player.lili);
					}
					"step 2"
					//player.maxlili = parseInt(lib.character[player.name][6]);
					if (!player.node.fuka) player.maxlili = 5;
					player.loselili(player.lili);
				},
			},
			//阿尔托莉雅lily
			'gezi_hualu': {
				trigger: { player: 'useCardToBegin', target: 'useCardToBegin' },
				filter: function (event, player) {
					if (event._notrigger.includes(player)) return false;
					let pl = (event.player == player) ? event.target : event.player;
					return event.card && get.tag(event.card, 'damage') > 0 && event.targets.length == 1 && player.canCompare(pl);
				},
				check: function (event, player) {
					if (event.target == player && get.attitude(player, event.player) < 0) return 1;
					if (get.attitude(player, event.target) < 0) return 1;
					return 0;
				},
				async content(event, trigger, player) {
					let pl = (trigger.player == player) ? trigger.target : trigger.player;
					const { result: { bool } } = await player.chooseToCompare(pl);
					if (bool) await player.draw();
					else await pl.draw();
				},
				group: 'gezi_hualu_glory',
				subSkill: {
					glory: {
						trigger: {
							player: "chooseToCompareBegin",
						},
						prompt: '是否招募勇士？',
						filter: function (event, player) {
							return game.hasPlayer(p => p != player && p.countCards('h') > 0);
						},
						content: function () {
							'step 0'
							event.targets = game.filterPlayer(p => p != player && p.countCards('h') > 0);
							event.cards = [];
							event.target = trigger.target;
							if (trigger.target == player) event.target = trigger.player;
							'step 1'
							var current = event.targets.shift();
							event.current = current;
							if (!current) {
								event.goto(3);
							} else if (!current.countCards('h') || (current == event.target && current.countCards('h') == 1)) {
								event.redo();
							} else {
								current.chooseCard('是否帮' + get.translation(player) + '打出一张拼点牌？').ai = function (card) {
									if (get.attitude(current, player) > 2) {
										return get.number(card) > 8 && 7 - get.value(card);
									} else if (get.attitude(current, player) < -2 && event.cards.length == 0 &&
										!event.targets.some(p => p.countCards('h') && get.attitude(p, player) > 2)) {
										// 使坏
										return get.number(card) < 5 && 7 - get.value(card);
									}
									return 0;
								}
							}
							'step 2'
							if (result.bool) {
								event.cards = event.cards.concat(result.cards[0]);
								event.current.lose(result.cards[0], ui.ordering).set('getlx', false);
								// event.current.$give(1, player);
								event.current.$throw(1, 1000);
							} else event.goto(1);
							'step 3'
							if (event.cards.length) {
								if (!trigger.fixedResult) trigger.fixedResult = {};
								trigger.fixedResult[player.playerid] = event.cards[0];
							} else event.finish();
							'step 4'
							player.chooseBool('是否令' + get.translation(event.current) + '获得一点灵力？').set('ai', get.attitude(player, event.current));
							'step 5'
							if (result.bool) event.current.gainlili();
						},
					}
				}
			},
			'gezi_jinjian': {
				audio: 2,
				cost: 1,
				roundi: true,
				spell: ['gezi_jinjian_spell'],
				trigger: { player: 'phaseBegin' },
				filter: function (event, player) {
					if (!player.canUseFuka()) return false;
					return !player.node.fuka && player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
					player.maxlili = Infinity;
				},
			},
			"gezi_jinjian_spell": {
				mod: {
					maxHandcardFinal: function (player, num) {
						return 453145;
					},
				},
				onremove: function (player) {
					player.maxlili = 5;
					if (player.lili > 0) player.useSkill('gezi_jinjian_use');
				}
			},
			"gezi_jinjian_use": {
				content: function () {
					"step 0"
					event.count = player.lili;
					"step 1"
					event.count--;
					player.chooseTarget(get.prompt2('gezi_jinjian_use'), function (card, player, target) {
						return true;
					}).set('ai', function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 2) {
							if (target.isDamaged()) return target.getDamagedHp();
							return 0;
						}
						return -att;
					});
					"step 2"
					if (result.bool) {
						player.logSkill('gezi_jinjian_use', result.targets);
						event.target = result.targets[0];
						player.chooseControl(['受到伤害', '回复体力']);
					} else event.finish();
					"step 3"
					if (result.control == '回复体力') {
						event.target.recover();
					} else event.target.damage('thunder');
					if (event.count) event.goto(1);
					"step 4"
					player.loselili(player.lili);
				}
			},
			//时雨
			"kc_yuzhi": {
				audio: "ext:东方project:2",
				group: ["kc_yuzhi_2"],
				forced: true,
				trigger: {
					global: "gameStart",
				},
				content: function () {
					player.addJudgen(game.createCard('gezi_shenyou', '', ''));
				},
			},
			"kc_yuzhi_2": {
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					return player.countCards('he') > 0;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseCardTarget({
						prompt: '将一张牌交给一名其他角色，令【杀】本回合对其无效',
						filterCard: function (card, player) {
							return true;
						},
						position: 'he',
						filterTarget: function (card, player, target) {
							if (player == target) return false;
							return true;
						},
						ai1: function (card) {
							if (_status.event.check) return 0;
							return 6 - get.value(card);
						},
						ai2: function (target) {
							var player = _status.event.player;
							if (get.attitude(player, _status.currentPhase) > 0) return 0;
							if (player.countCards('he') < 3) return 0;
							if (get.attitude(player, target) <= 0) return 0;
							if (target.hp > player.hp) return 0;
							if (target.hp == 1) return 1000;
							return get.attitude(player, target);
						},
					});
					"step 1"
					if (result.targets) {
						result.targets[0].gain(result.cards[0], 'draw');
						player.$give(result.cards.length, result.targets[0]);
						player.logSkill('kc_yuzhi', result.targets[0]);
						result.targets[0].addTempSkill('kc_yuzhi_3');
						if (player.hasSkill('gezi_chongzou_2')) {
							player.removeSkill('kc_yuzhi');
							player.removeSkill('gezi_chongzou_2');
						}
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			"kc_yuzhi_3": {
				audio: "ext:东方project:2",
				mark: true,
				intro: {
					content: "本回合免疫【杀】",
				},
				onremove: true,
				trigger: {
					target: "shaBefore",
				},
				forced: true,
				filter: function (event, player) {
					return event.card.name == 'sha';
				},
				content: function () {
					game.log('雨至：', trigger.card, '对', player, '无效');
					trigger.untrigger();
					trigger.finish();
				},
				check: function () {
					return true;
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == 'sha') return 'zerotarget';
						},
					},
				},
			},
			"gezi_zuoshibaozhan": {
				cost: 2,
				audio: "ext:东方project:2",
				roundi: true,
				priority: 22,
				spell: ["gezi_zuoshibao_2"],
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > lib.skill.gezi_zuoshibaozhan.cost;
				},
				check: function (event, player) {
					return player.countCards('h') < 2 || player.hp == 1;
				},
				content: function () {
					'step 0'
					player.loselili(lib.skill.gezi_zuoshibaozhan.cost);
					player.Fuka();
					'step 1'
					if (player.countCards('h') < 3) player.draw(3 - player.countCards('h'));
					'step 2'
					player.addJudgen(game.createCard('gezi_shenyou', '', ''));
				},
			},
			"gezi_zuoshibao_2": {
				trigger: {
					player: ["discardAfter", "useCardAfter"],
				},
				filter: function (event, player) {
					if (event.name == 'useCard' && player == _status.currentPhase) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				direct: true,
				content: function () {
					"step 0"
					if (trigger.delay == false) game.delay();
					event.cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == 'd') {
							event.cards.push(trigger.cards[i]);
							ui.special.appendChild(trigger.cards[i]);
						}
					}
					"step 1"
					if (event.cards.length) {
						var goon = false;
						for (var i = 0; i < event.cards.length; i++) {
							if (event.cards[i].name == 'du') {
								goon = true;
								break;
							}
						}
						if (!goon) {
							goon = game.hasPlayer(function (current) {
								return player != current && get.attitude(player, current) > 1;
							});
						}
						player.chooseCardButton('将弃置或使用的牌交给一名其他角色', event.cards, [1, event.cards.length]).set('ai', function (button) {
							if (!_status.event.goon || ui.selected.buttons.length) return 0;
							if (button.link.name == 'du') return 2;
							return 1;
						}).set('goon', goon);
					} else {
						event.finish();
					}
					"step 2"
					if (result.bool) {
						event.togive = result.links.slice(0);
						player.chooseTarget('将' + get.translation(result.links) + '交给一名角色', true, function (card, player, target) {
							return target != player;
						}).set('ai', function (target) {
							if (target == player) return 0;
							var att = get.attitude(_status.event.player, target);
							if (_status.event.enemy) {
								return -att;
							} else {
								if (att > 2) return att / Math.sqrt(1 + target.countCards('h'));
								return att / Math.sqrt(1 + target.countCards('h')) / 5;
							}
						}).set('enemy', get.value(event.togive[0]) < 0);
					} else {
						for (var i = 0; i < event.cards.length; i++) {
							event.cards[i].discard();
						}
						event.finish();
					}
					"step 3"
					if (result.bool) {
						player.logSkill('gezi_zuoshibaozhan', result.targets);
						for (var i = 0; i < event.togive.length; i++) {
							event.cards.remove(event.togive[i]);
						}
						result.targets[0].gain(event.togive, player);
						result.targets[0].$gain2(event.togive);
						event.goto(1);
					} else {
						for (var i = 0; i < event.cards.length; i++) {
							event.cards[i].discard();
						}
						event.finish();
					}
				},
				ai: {
					expose: 0.1,
					player: 1,
					effect: {
						target: function (card, player, target, current) {
							if (target.hasFriend() && get.tag(card, 'discard')) {
								if (current < 0) return 0;
								return [1, 1];
							}
						},
					},
				},
			},
			//椿
			"gezi_xiangyi": {
				group: ["gezi_xiangyi_2", "gezi_xiangyi_3"],
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: function (card, player) {
					if (!player.countCards('e', {
						color: 'black'
					})) {
						if (get.color(card) == 'black') return false;
					}
					if (!player.countCards('e', {
						color: 'red'
					})) {
						if (get.color(card) == 'red') return false;
					}
					return true;
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				viewAsFilter: function (player) {
					return player.countCards('e');
				},
				prompt: "将一张牌当作【杀】使用/打出",
				check: function (card) {
					return 6 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player) {
						return player.countCards('e');
					},
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function (item) {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						if (lib.linked.contains(get.nature(item))) return 3.1;
						return 3;
					},
					result: {
						target: function (player, target, card, isLink) {
							if (!isLink && player.hasSkill('jiu') && !target.hasSkillTag('filterDamage', null, {
								player: player,
								card: card,
								jiu: true,
							})) {
								if (get.attitude(player, target) > 0) {
									return -7;
								} else {
									return -4;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_xiangyi_2": {
				audio: "ext:东方project:2",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: function (card, player) {
					if (!player.countCards('e', {
						color: 'black'
					})) {
						if (get.color(card) == 'black') return false;
					}
					if (!player.countCards('e', {
						color: 'red'
					})) {
						if (get.color(card) == 'red') return false;
					}
					return true;
				},
				position: "he",
				viewAs: {
					name: "shan",
				},
				viewAsFilter: function (player) {
					return player.countCards('e');
				},
				prompt: "将一张牌当作【闪】使用/打出",
				check: function () {
					return 1
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						return player.countCards('e');
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, 'respondShan') && current < 0) return 0.6
						},
					},
					basic: {
						useful: [7, 2],
						value: [7, 2],
					},
					result: {
						player: 1,
					},
				},
			},
			"gezi_xiangyi_3": {
				audio: "ext:东方project:3",
				trigger: {
					player: "useCardAfter",
				},
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseTarget('【翔翼】：可以令一名角色流失一点灵力(无灵力改为弃置其一张牌)', function (card, player, target) {
						return target.lili > 0 || target.countCards('he') > 0;
					}).set('ai', function (target) {
						if (_status.currentPhase == target && get.attitude(player, _status.currentPhase) < 0 && target.lili == 1) return 100;
						return -get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('gezi_xiangyi', result.targets);
						if (result.targets[0].lili) {
							result.targets[0].loselili();
						} else {
							player.discardPlayerCard(result.targets[0], 'he', true);
						}
					}
				},
			},
			"gezi_chunse": {
				forced: true,
				audio: "ext:东方project:3",
				group: ["gezi_chunse_2"],
				trigger: {
					global: "phaseAfter",
				},
				frequent: true,
				filter: function (event, player) {
					return event.player.hp > player.hp || event.player.countCards('h') > player.countCards('h');
				},
				content: function () {
					if (player.maxlili > player.lili && !player.node.fuka) {
						player.gainlili();
					} else {
						player.draw();
					}
				},
			},
			"gezi_chunse_2": {
				audio: "ext:东方project:2",
				trigger: {
					source: "loseliliBefore",
				},
				check: function (event, player) {
					return get.damageEffect(event.player, player, player) > 0;
				},
				frequent: true,
				filter: function (event, player) {
					return event.player != player && player.lili == player.maxlili;
				},
				content: function () {
					trigger.untrigger();
					trigger.finish();
					player.logSkill('gezi_chunse', trigger.player);
					trigger.player.damage(trigger.num);
				},
			},
			//夕立
			"gezi_hongxi": {
				audio: "ext:东方project:3",
				enable: ["chooseToUse"],
				group: ["gezi_hongxi_2"],
				filterCard: function (card, player) {
					return true;
				},
				position: "he",
				viewAs: {
					name: "sha",
				},
				viewAsFilter: function (player) {
					if (!player.countCards('he')) return false;
				},
				prompt: "将一张牌当【杀】使用",
				check: function (card) {
					return 6 - get.value(card)
				},
				intro: {
					content: function (storage, player) {
						if (player.storage.gezi_hongxi) {
							return '你可以将一张牌当【杀】使用；此【杀】指定目标后，你令对方摸一张牌，根据转化牌的类型执行下列效果：<br />基本牌～你与目标角色拼点：若你赢，此【杀】必中；锦囊牌～你获得目标角色一张牌；其他牌～目标不能使用或打出手牌直到该【杀】结算完成。你下一次以此法造成的伤害+1。';
						}
					},
				},
				ai: {
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.hasSkillTag('filterDamage', null, {
								player: player,
								card: {
									name: 'sha'
								},
							})) {
								if (get.attitude(player, target) > 0) {
									return -7;
								} else {
									return -4;
								}
							}
							return -1.5;
						},
					},
					respondSha: "use",
					order: 4,
					skillTagFilter: function (player) {
						if (!player.countCards('he')) return false;
					},
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_hongxi_2": {
				forced: true,
				trigger: {
					player: "shaBefore",
				},
				filter: function (event, player) {
					if (event.skill != 'gezi_hongxi') return false;
					return true;
				},
				logTarget: "target",
				content: function () {
					'step 0'
					if (event.triggername == 'shaBefore') {
						trigger.target.draw();
						if (get.type(trigger.cards[0]) == 'basic') {
							player.draw();
							if (player.canCompare(trigger.target)) {
								player.chooseToCompare(trigger.target);
							}
						} else if (get.type(trigger.cards[0]) == 'trick' || get.type(trigger.cards[0]) == 'delay') {
							if (trigger.target.countCards('he')) {
								player.gainPlayerCard('he', trigger.target, true);
							}
						} else {
							trigger.target.addTempSkill('lunadial2', 'shaAfter');
						}
					}
					if (player.storage.gezi_hongxi) {
						player.addTempSkill('gezi_hongxi_3', 'damageBegin');
					}
					'step 1'
					if (result.bool) {
						trigger.directHit = true;
					}
				},
			},
			"gezi_hongxi_3": {
				forced: true,
				onremove: function (player) {
					delete player.storage.gezi_hongxi;
					player.unmarkSkill('gezi_hongxi');
				},
				trigger: {
					source: "damageBefore",
				},
				content: function () {
					if (player.storage.gezi_hongxi) {
						trigger.num++;
					}
				},
			},
			"gezi_solomon": {
				cost: 2,
				audio: "ext:东方project:3",
				spell: ["gezi_solomon2"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return (player.hp < 3 && player.lili > 0) || player.lili > lib.skill.gezi_solomon.cost;
				},
				check: function (event, player) {
					return true;
				},
				content: function () {
					'step 0'
					if (player.hp < 3) {
						player.loselili(0);
					} else {
						player.loselili(lib.skill.gezi_solomon.cost);
					}
					player.Fuka();
					'step 1'
					player.addJudgen(game.createCard('gezi_lianji', '', ''));
					'step 2'
					game.log(player, '更改了', '【轰袭】', '的描述');
					player.markSkill('gezi_hongxi');
					player.storage.gezi_hongxi = true;
				},
			},
			"gezi_solomon2": {
			},
			//爱丽丝
			"WLD1": {
				audio: "ext:东方project:2",
				group: ["WLD1_1"],
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: true,
				selectCard: [0, Infinity],
				check: function (card) {
					return 7 - ai.get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
				},
				filter: function (event, player) {
					return player.node.lili;
				},
				content: function () {
					'step 0'
					game.cardsDiscard(cards);
					'step 1'
					var list = [];
					for (var i = 0; i <= player.lili; i++) {
						list.push(i);
					}
					player.chooseControl(list, function () {
						if (list.contains(player.lili - 1)) return player.lili - 1;
						return 0;
					}).set('prompt', '消耗任意点灵力');
					'step 2'
					if (result.control) {
						player.loselili(result.control);
						var num = cards.length + result.control;
						for (var i = 0; i < num; i++) {
							player.gain(game.createCard(lib.cardPack['swd'].randomGet()));
						}
					}
				},
				prompt: "先弃置任意张牌，然后消耗任意点灵力，摸等量轩辕剑拓展的牌",
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			"WLD1_1": {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: true,
				selectCard: [0, Infinity],
				check: function (card) {
					return 7 - ai.get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$throw(cards, 1000);
				},
				filter: function (event, player) {
					return !player.node.lili;
				},
				content: function () {
					'step 0'
					player.logSkill('WLD1');
					game.cardsDiscard(cards);
					'step 1'
					player.$draw(cards.length);
					for (var i = 0; i < cards.length; i++) {
						player.gain(game.createCard(lib.cardPack['swd'].randomGet()));
					}
				},
				prompt: "弃置任意张牌，摸等量轩辕剑拓展的牌",
				ai: {
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			"WLD2": {
				audio: "ext:东方project:2",
				forced: true,
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return !player.storage.WLD2;
				},
				derivation: ["WLD3"],
				content: function () {
					'step 0'
					player.useCard({
						name: 'gezi_huanxiang'
					}, player);
					player.storage.WLD2 = true;
					'step 1'
					player.addSkill('WLD3');
				},
			},
			"WLD3": {
				audio: "ext:东方project:2",
				forced: true,
				trigger: {
					player: "phaseZhunbeiEnd",
				},
				content: function () {
					var list = [];
					for (var i in lib.card) {
						if (!lib.translate[i]) continue;
						list.push(i);
					}
					player.gain(game.createCard(list.randomGets(1)));
				},
			},
			//开膛手杰克
			"gezi_wulin": {
				skillAnimation: true,
				animationColor: "fire",
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					return (player.countCards('hej') > 0);
				},
				check: function (event, player) {
					var bad_att = false;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (-get.attitude(player, players[i]) && players[i].countCards('h') > 3) bad_att = true;
					}
					return bad_att && get.attitude(player, event.player) && event.player.countCards('h', 'sha') > 1;
				},
				priority: 3,
				mark: true,
				limited: true,
				intro: {
					content: 'limited',
				},
				async content(event, trigger, player) {
					let next = await player.chooseTarget("雾临：洗混一名角色手牌，且其本回合可以被杀两次", true, function (card, player, target) {
						return player.inRange(target);
					})
					next.ai = function (target) {
						return -get.attitude(player, target);
					}
					const { result: { targets } } = await next;
					player.awakenSkill('gezi_wulin');
					game.log(player, "对", targets, "发动了【雾临】");
					targets[0].addTempSkill('gezi_shiming_2');
					targets[0].addTempSkill('gezi_shiming_3');
					targets[0].addTempSkill('gezi_wulin_skill');
				},
			},
			"gezi_wulin_skill": {
				direct: true,
				charlotte: true,
				usable: 1,
				trigger: { target: 'shaBefore' },
				content: function () {
					trigger.player.getStat().card.sha--;
				},
			},
			"gezi_yejiang": {
				skillAnimation: true,
				animationColor: "fire",
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					return (player.countCards('hej') > 0);
				},
				check: function (event, player) {
					var bad_att = false;
					var players = game.filterPlayer();
					if (-get.attitude(player, event.player) && event.player.countCards('h') > 3) bad_att = true;
					return bad_att;
				},
				priority: 2,
				limited: true,
				mark: true,
				intro: {
					content: 'limited',
				},
				async content(event, trigger, player) {
					let next = await player.chooseTarget("夜降：一名角色攻击范围为0，且其本回合装备无效", true, function (card, player, target) {
						return player.inRange(target);
					})
					next.ai = function (target) {
						return -get.attitude(player, target) && target == trigger.player;
					}
					const { result: { targets } } = await next;
					player.awakenSkill('gezi_yejiang');
					game.log(player, "对", targets, "发动了【夜降】");
					targets[0].addTempSkill('gezi_yejiang_2');
					targets[0].addTempSkill('unequip');
				}
			},
			"gezi_yejiang_2": {
				mod: {
					attackFrom: function (from, to, distance) {
						// 数场上符合条件的角色，不错
						return distance + 10;
					}
				},
			},
			"gezi_maria": {
				audio: "ext:东方project:2",
				cost: 2,
				spell: ['gezi_maria_skill'],
				trigger: { player: 'phaseBegin' },
				filter: function (event, player) {
					return player.getLili() > lib.skill.gezi_maria.cost;
				},
				nobracket: true,
				content: function () {
					player.loselili(lib.skill.gezi_maria.cost);
					player.Fuka();
				},
				check: function (event, player) {
					//return player.awakenedSkills.includes('gezi_yejiang') && player.awakenSkills.includes('gezi_wulin');
					return player.hasSha();
				},
			},
			"gezi_maria_skill": {
				forced: true,
				onremove: function (player) {
					player.restoreSkill('gezi_yejiang');
					player.restoreSkill('gezi_wulin');
				},
				audio: "ext:东方project:2",
				trigger: { source: 'damageEnd' },
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return (event.card && event.card.name == 'sha' &&
						event.player.classList.contains('dead') == false &&
						event.player.countCards('h'));
				},
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function () {
					"step 0"
					trigger.player.discard(trigger.player.getCards('h'));
				}
			},
			//狂三
			"gezi_kedan": {
				audio: "ext:东方project:2",
				group: ["gezi_kedan2", "gezi_kedan3"],
				enable: "chooseToUse",
				init: function (player) {
					player.storage.gezi_kedan = [];
				},
				filter: function (event, player) {
					return player.countCards('he', {
						type: "equip"
					});
				},
				chooseButton: {
					dialog: function () {
						var list = [];
						for (var i in lib.card) {
							if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
							if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
							if (lib.card[i].type == 'jinjipai') {
								list.add(i);
							}
						}
						for (var i = 0; i < list.length; i++) {
							list[i] = [get.type(list[i]), '', list[i]];
						}
						return ui.create.dialog([list, 'vcard']);
					},
					filter: function (button, player) {
						return _status.event.getParent().filterCard({
							name: button.link[2]
						}, player) && !player.storage.gezi_kedan.contains(button.link[2]);
					},
					check: function (button) {
						var player = _status.event.player;
						return get.value({
							name: button.link[2]
						}) - 5;
					},
					backup: function (links, player) {
						return {
							filterCard: function (card, player) {
								return get.type(card) == 'equip';
							},
							audio: "ext:东方project:2",
							position: 'he',
							selectCard: 1,
							viewAs: {
								name: links[0][2]
							},
							onuse: function (result, player) {
								if (get.type(result.card.name) == 'jinjipai') player.storage.gezi_kedan.push(result.card.name);
							},
						}
					},
					prompt: function (links, player) {
						return '将一张牌当作' + get.translation(links[0][2]) + '使用';
					},
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"gezi_kedan2": {
				direct: true,
				trigger: {
					global: "phaseAfter",
				},
				popup: false,
				content: function () {
					player.storage.gezi_kedan = [];
				},
			},
			"gezi_kedan3": {
				trigger: {
					player: "useCard",
				},
				filter: function (event, player) {
					return get.type(event.card) == 'jinjipai' && !player.hasSkill('gezi_kedan4');
				},
				content: function () {
					'step 0'
					player.chooseTarget('选择一名角色成为' + get.translation(trigger.card) + '的唯一目标', function (card, player, target) {
						return player.canUse({
							name: trigger.card.name
						}, target, false);
					}).set('ai', function (target) {
						return get.effect(target, {
							name: trigger.card.name
						}, player, player);
					});
					"step 1"
					if (result.bool) {
						player.logSkill(event.name, result.targets);
						trigger.target = result.targets[0];
						trigger.targets = [];
						trigger.targets.push(result.targets[0]);
					} else {
						event.finish();
					}
					"step 2"
					trigger.untrigger();
					player.addTempSkill('gezi_kedan4', 'useCardAfter');
					trigger.trigger('useCard');
					game.delay();
				},
				prompt: "是否改变禁忌牌的目标？",
			},
			"gezi_kedan4": {
			},
			"gezi_shishu": {
				audio: "ext:东方project:2",
				group: ["gezi_shishu2", "gezi_shishu3", "gezi_shishu4"],
				trigger: {
					player: "phaseEnd",
				},
				direct: true,
				marktext: "时",
				intro: {
					name: "时溯",
					"name2": "时",
					content: "本回合扣减的体力总值：#",
				},
				filter: function (event, player) {
					if (!player.hasMark('gezi_shishu')) return false;
					var cards = [];
					if (player.storage.gezi_shishu3 && player.storage.gezi_shishu3.length) {
						for (var i = 0; i < player.storage.gezi_shishu3.length; i++) {
							if (get.position(player.storage.gezi_shishu3[i], true) == 'd') {
								cards.push(player.storage.gezi_shishu3[i]);
							}
						}
					}
					return player.canMoveCard(null, true) || cards.length;
				},
				content: function () {
					'step 0'
					var list = [];
					var cards = [];
					if (player.storage.gezi_shishu3 && player.storage.gezi_shishu3.length) {
						for (var i = 0; i < player.storage.gezi_shishu3.length; i++) {
							if (get.position(player.storage.gezi_shishu3[i], true) == 'd') {
								cards.push(player.storage.gezi_shishu3[i]);
							}
						}
					}
					if (cards.length) list.push('从牌堆获得一张装备牌或禁忌牌');
					if (player.canMoveCard(null, true)) list.push('移动场上一张装备牌');
					event.cards = cards;
					event.list = list;
					'step 1'
					player.chooseControlList(event.list).set('prompt', '选择一项，按【取消】结束此技能').set('ai', function (event, player) {
						if (player.canMoveCard(true, true)) return event.list.indexOf('移动场上一张装备牌');
						if (event.list.contains('从牌堆获得一张装备牌或禁忌牌')) return event.list.indexOf('从牌堆获得一张装备牌或禁忌牌');
						return list.indexOf('cancel2');
					})
					'step 2'
					if (event.list[result.index] == '移动场上一张装备牌') {
						player.moveCard().nojudge = true;
					} else if (event.list[result.index] == '从牌堆获得一张装备牌或禁忌牌') {
						player.chooseCardButton(event.cards, '捡回一张牌', 1, true).ai = function (button) {
							return get.value(button.link);
						}
					} else {
						event.finish();
					}
					'step 3'
					if (result.links) {
						player.gain(result.links, 'log');
						for (var i = 0; i < result.links.length; i++) {
							ui.discardPile.remove(result.links[i]);
							player.storage.gezi_shishu3.remove(result.links[i]);
							player.syncStorage('gezi_shishu3');
						}
					}
					'step 4'
					player.removeMark('gezi_shishu', 1);
					if (event.bool != true) {
						player.logSkill('gezi_shishu', player);
					}
					event.bool = true;
					if (player.hasMark('gezi_shishu')) {
						event.goto(0);
					}
				}
			},
			"gezi_shishu2": {
				direct: true,
				trigger: {
					global: "changeHp",
				},
				popup: false,
				filter: function (event, player) {
					return _status.currentPhase == player && event.num < 0;
				},
				content: function () {
					player.addMark('gezi_shishu', -num);
				},
			},
			"gezi_shishu3": {
				intro: {
					content: "cards",
				},
				trigger: {
					global: "loseEnd",
				},
				direct: true,
				popup: false,
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != 'jinjipai' && get.type(event.cards[i]) != 'equip') continue;
						if (get.type(event.cards[i]) == 'equip' && event.getParent().name == 'useCard' && event.getParent().card.name == event.cards[i].name) continue;
						if (get.position(event.cards[i]) == 'd') {
							return true;
						}
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) != 'jinjipai' && get.type(trigger.cards[i]) != 'equip') continue;
						if (!player.storage.gezi_shishu3) player.storage.gezi_shishu3 = [trigger.cards[i]];
						else player.storage.gezi_shishu3.push(trigger.cards[i]);
					}
					player.markSkill('gezi_shishu3');
					player.syncStorage('gezi_shishu3');
				},
			},
			"gezi_shishu4": {
				direct: true,
				popup: false,
				trigger: {
					player: "phaseAfter",
				},
				content: function () {
					player.unmarkSkill('gezi_shishu');
					delete player.storage.gezi_shishu3;
					player.syncStorage('gezi_shishu3');
					player.unmarkSkill('gezi_shishu3');
				},
			},
			"gezi_shishi": {
				audio: "ext:东方project:2",
				spell: ["gezi_shishi1"],
				priority: 22,
				roundi: true,
				trigger: {
					player: "phaseBegin",
				},
				check: function (event, player) {
					return false;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 4;
				},
				content: function () {
					player.loselili(4);
					player.Fuka();
				},
			},
			"gezi_shishi1": {
				audio: "ext:东方project:2",
				direct: true,
				group: "gezi_shishi2",
				trigger: {
					player: ["loseHpBegin", "loseliliBegin", "damageBegin"],
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					player.logSkill("gezi_shishi");
					trigger.cancel();
				},
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == 'sha') return true;
					},
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return Infinity;
					},
				},
			},
			"gezi_shishi2": {
				audio: "ext:东方project:2",
				trigger: {
					source: "dieAfter",
				},
				direct: true,
				filter: function (event, player) {
					//return !player.hasSkill('lianpo2');
					return true;
				},
				content: function () {
					player.logSkill("gezi_shishi");
					player.addSkill('gezi_shishi3');
					player.insertPhase();
				},
			},
			"gezi_shishi3": {
				direct: true,
				trigger: {
					player: "FukaBefore",
				},
				content: function () {
					player.removeSkill('gezi_shishi3');
					trigger.cancel();
					player.lili = 3;
					player.updatelili();
				},
			},
			//童谣
			"gezi_lvtu": {
				audio: "ext:东方project:2",
				trigger: { player: 'phaseZhunbeiBegin' },
				filter: function (event, player) {
					event.num = [player.maxHp, player.lili, player.countCards('h'), player.countJinengpai()];
					var choices = ['体力上限', '灵力值', '手牌数', '技能牌数'];
					var low = Math.min.apply(null, event.num);
					for (var i = 0; i < event.num.length; i++) {
						if (event.num[i] == low) {
							event.num.remove(event.num[i]);
							choices.remove(choices[i]);
							i = 0;
						}
					}
					if (choices.length == 1 && choices[0] == '体力上限' && low == 0) return false;
					return true;
				},
				content: function () {
					'step 0'
					event.num = [player.maxHp, player.lili, player.countCards('h'), player.countJinengpai()];
					var choices = ['体力上限', '灵力值', '手牌数', '技能牌数'];
					var low = Math.min.apply(null, event.num);
					for (var i = 0; i < event.num.length; i++) {
						if (event.num[i] == low) {
							event.num.remove(event.num[i]);
							choices.remove(choices[i]);
							i = 0;
						}
					}
					//choices.remove(event.num.indexOf(low));
					event.low = low;
					var str = "选择一项，将该项调整为与最少的一项相同（最少的一项为" + low + "）";
					player.chooseControl(choices).set('prompt', str).set('ai', function () {
						var player = _status.event.player, controls = _status.event.controls.slice(0);
						if (event.low == 0) {
							controls.remove('体力上限');
							if (controls.includes('手牌数')) return '手牌数';
							if (controls.includes('技能牌数')) return '技能牌数';
							return controls.randomGet();
						}
						return controls.randomGet();
					});
					'step 1'
					if (result.control) {
						event.choices = ['体力上限', '灵力值', '手牌数', '技能牌数'];
						event.choices.remove(result.control);
						if (result.control == '体力上限') {
							player.loseMaxHp(player.maxHp - event.low);
						} else if (result.control == '灵力值') {
							player.loselili(player.lili - event.low);
						} else if (result.control == "手牌数") {
							player.chooseToDiscard('h', true, player.countCards('h') - event.low);
						} else if (result.control == "技能牌数") {
							event.num = (player.countJinengpai() - event.low);
							event.goto(4)
						}
					}
					'step 2'
					if (event.choices) {
						event.num = [player.maxHp, player.lili, player.countCards('h'), player.countJinengpai()];
						event.high = Math.max.apply(null, event.num);
						var str = "选择一项，将该项调整为与最多的一项相同（最多的一项为" + event.high + "）";
						player.chooseControl(event.choices).set('prompt', str);
					}
					'step 3'
					if (result.control) {
						if (result.control == '体力上限') {
							player.gainMaxHp(event.high - player.maxHp);
						} else if (result.control == '灵力值') {
							player.gainlili(event.high - player.lili);
						} else if (result.control == "手牌数") {
							player.draw(event.high - player.countCards('h'));
						} else if (result.control == "技能牌数") {
							var list = ["gezi_firebook", "gezi_waterbook", "gezi_woodbook", "gezi_goldbook", "gezi_dirtbook"];
							var num = event.high - player.countJinengpai();
							if (num > 0) {
								while (num > 0) {
									player.addJudgen(game.createCard(list.randomGet(), '', ''));
									num--;
								}
							}
						}
					}
					event.finish();
					'step 4'
					player.chosenPlayerCard('j', '请移除一张技能牌', player, true);
					'step 5'
					if (result.bool) {
						event.num--;
						var cards = player.getJinengpai();
						for (var i = 0; i <= cards.length; i++) {
							if (cards[i] && cards[i].name == result.links[0].name) {
								player.removeJudgen(cards[i]);
								break;
							}
						}
					}
					if (event.num > 0) event.goto(4);
					else event.goto(2)
				},
				check: function (event, player) {
					return true;
				},
			},
			"gezi_mengjin": {
				enable: 'phaseUse',
				group: 'gezi_mengjin_unmark',
				usable: 1,
				intro: {
					content: function (storage) {
						return '已发动【梦镜】，濒死时重置';
					},
				},
				filter: function (event, player) {
					return !player.storage.gezi_mengjin;
				},
				content: function () {
					'step 0'
					var num = player.maxHp - player.hp;
					if (num > player.hp) {
						player.recover(num - player.hp);
					} else if (num < player.hp) {
						player.loseHp(player.hp - num);
					}
					'step 1'
					var num = 3 - player.countCards('h');
					if (num < 0) num = 0;
					if (num > player.countCards('h')) {
						player.draw(num - player.countCards('h'));
					} else if (num < player.countCards('h')) {
						player.chooseToDiscard('h', true, [player.countCards('h') - num, player.countCards('h') - num]);
					}
					'step 2'
					var num = 5 - player.lili;
					if (num > player.lili) {
						player.gainlili(num - player.lili);
					} else if (num < player.lili) {
						player.loselili(player.lili - num);
					}
					player.disableSkill('gezi_mengjin', 'gezi_mengjin');
					player.addTempSkill('gezi_mengjin_unmark', { player: 'dying' });
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							if ((player.maxHp - player.hp) > 1) {
								return 2;
							}
							return -1;
						}
					}
				}
			},
			"gezi_mengjin_unmark": {
				onremove: function (player) {
					player.enableSkill('gezi_mengjin');
				},
			},
			"gezi_weimo": {
				audio: "ext:东方project:2",
				cost: 1,
				spell: ['gezi_weimo_1'],
				trigger: { player: 'phaseBegin' },
				roundi: true,
				filter: function (event, player) {
					return player.lili > lib.skill.gezi_weimo.cost;
				},
				nobracket: true,
				content: function () {
					player.loselili(lib.skill.gezi_weimo.cost);
					player.Fuka();
				},
				check: function (event, player) {
					return player.hp < 2;
				},
			},
			"gezi_weimo_1": {
				global: ['gezi_weimo_2', 'gezi_weimo_3', 'gezi_weimo_4'],
			},
			"gezi_weimo_2": {
				mod: {
					maxHandcard: function (player, num) {
						if (!player.hasSkill('gezi_weimo')) return num - 2 * game.countPlayer(function (current) {
							return current.hasSkill('gezi_weimo_1') && current.isMinHandcard();
						});
					}
				}
			},
			"gezi_weimo_3": {
				trigger: { player: 'damageBegin1' },
				forced: true,
				filter: function (event, player) {
					return !player.hasSkill('gezi_weimo') && game.countPlayer(function (current) {
						return current.hasSkill('gezi_weimo_1') && current.isMinHp();
					});
				},
				content: function () {
					trigger.num++;
				}
			},
			"gezi_weimo_4": {
				init: function (player, skill) {
					if (!game.hasPlayer(function (current) {
						return current.hasSkill('gezi_weimo_1') && current.isMinlili();
					}) || player.hasSkill('gezi_weimo')) return;
					var skills = player.getSkills(true, false);
					for (var i = 0; i < skills.length; i++) {
						if (get.is.locked(skills[i])) {
							skills.splice(i--, 1);
						}
					}
					player.disableSkill(skill, skills);
				},
				onremove: function (player, skill) {
					player.enableSkill(skill);
				},
				trigger: { global: ['loseliliAfter', 'gainliliAfter'] },
				silent: true,
				filter: function (event, player) {
					return !player.hasSkill('gezi_weimo');
				},
				content: function () {
					if (!game.hasPlayer(function (current) {
						return current.hasSkill('gezi_weimo_1') && current.isMinlili();
					})) {
						player.enableSkill(skill);
					} else {
						var skills = player.getSkills(true, false);
						for (var i = 0; i < skills.length; i++) {
							if (get.is.locked(skills[i])) {
								skills.splice(i--, 1);
							}
						}
						player.disableSkill(skill, skills);
					}
				}
			},
			//莉莱
			"gezi_tanxue": {
				trigger: { target: 'shaBefore' },
				audio: "ext:东方project:2",
				filter: function (event, player) {
					return player.lili > event.player.lili;
				},
				nobracket: true,
				content: function () {
					player.addTempSkill('gezi_tanxue_damage', 'useCardAfter');
				},
				check: function () {
					return true;
				},
			},
			"gezi_tanxue_damage": {
				direct: true,
				trigger: { player: 'damageBefore' },
				filter: function (event, player) {
					return event.card && event.card.name == 'sha' && event.nature != 'thunder';
				},
				content: function () {
					trigger.nature = 'thunder';
					//player.damage(trigger.source, 'thunder', trigger.num);
					//trigger.cancel();
				},
			},
			"gezi_bingfeng": {
				audio: "ext:东方project:2",
				trigger: { global: 'useCard' },
				filter: function (event, player) {
					return !event.player.storage._enhance && player.countCards('hej') && lib.card[event.card.name].enhance;
				},
				nobracket: true,
				content: function () {
					'step 0'
					player.chooseToDiscard('he', 1);
					'step 1'
					if (result.bool) {
						trigger.player.addTempSkill('gezi_bingfeng_enhance', { player: 'useCardAfter' });
						trigger.player.storage.gezi_bingfeng_enhance = trigger.card;
						trigger.player.storage._enhance = 1;
					}
				},
				check: function (event, player) {
					return player.countCards('hej') > 3 && get.attitude(player, event.player) > 0;
				},
			},
			"gezi_bingfeng_enhance": {
				onremove: true,
				direct: true,
				trigger: { player: 'useCardToPlayered' },
				filter: function (event, player) {
					return (event.card == player.storage.gezi_bingfeng_enhance) && player.storage._enhance && event.target;
				},
				content: function () {
					for (var i = 0; i < player.storage._enhance; i++) {
						trigger.target.damage('thunder');
					}
				},
			},
			"gezi_aoshu": {
				audio: "ext:东方project:2",
				usable: 1,
				enable: 'phaseUse',
				filter: function (event, player) {
					return player.lili > 0;
				},
				nobracket: true,
				content: function () {
					'step 0'
					event.num = player.lili;
					player.loselili(player.lili);
					'step 1'
					if (event.num > 0) {
						player.chooseTarget('令一名角色获得1点灵力<br>还剩' + event.num + '点灵力可分配', true).set('ai', function (target) {
							return target.lili < target.maxlili && get.attitude(player, target) > 0;
						});
					}
					'step 2'
					if (result.bool) {
						result.targets[0].gainlili();
						event.num--;
						if (event.num > 0) event.goto(1);
					}
					'step 3'
					player.addSkill('gezi_aoshu_lili');
				},
				ai: {
					result: {
						player: 1,
					},
				},
			},
			"gezi_aoshu_lili": {
				audio: "ext:东方project:2",
				forced: true,
				/*
				trigger:{global:'useSkillAfter'},
				filter:function(event,player){
					return lib.skill[event.skill].spell;
				},
				*/
				trigger: { global: 'FukaAfter' },
				content: function () {
					player.gainlili();
				},
			},
			//七宫
			"gezi_guyin": {
				audio: "ext:东方project:3",
				forced: true,
				group: ["gezi_guyin_2", "gezi_guyin_3", "gezi_guyin_4"],
				trigger: {
					player: "useCard1",
				},
				filter: function (event, player) {
					if (player.storage._enhance && player.storage._enhance > 0) return false;
					return lib.card[event.card.name].enhance;
				},
				content: function () {
					game.log(player, '发动', '【孤樱】', '强化了', trigger.card);
					if (!player.storage._enhance) {
						player.storage._enhance = 1;
					} else {
						player.storage._enhance++;
					}
				},
			},
			"gezi_guyin_2": {
				forced: true,
				trigger: {
					player: "useCardToBegin",
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					return get.tag(event.card, 'respondShan');
				},
				content: function () {
					'step 0'
					trigger.cancel();
					var list = ['juedou', 'nanman', 'jingleishan'];
					for (var i = 0; i < list.length; i++) {
						list[i] = ['锦囊', '', list[i]];
					}
					if (list.length) {
						trigger.player.chooseButton(['视为使用一张锦囊牌', [list, 'vcard']], true).set('ai', function (button) {
							var card = {
								name: button.link[2]
							};
							return get.effect(trigger.target, card, trigger.player, trigger.player);
						});
					} else {
						event.finish();
					}
					'step 1'
					if (result && result.bool && result.links[0]) {
						var card = {
							name: result.links[0][2]
						};
						event.fakecard = card;
						if (lib.filter.targetEnabled2(event.fakecard, trigger.player, trigger.target)) {
							trigger.player.useCard(event.fakecard, trigger.target);
						}
					} else {
						event.finish();
					}
				},
				ai: {
					unequip: true,
				},
			},
			"gezi_guyin_3": {
				mod: {
					cardname: function (card, player) {
						if (card.name == 'shan') return 'wuxie';
					},
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.countCards('h', 'shan')) return false;
					},
				},
				trigger: {
					player: ["useCard1", "respond"],
				},
				firstDo: true,
				forced: true,
				filter: function (event, player) {
					return event.card.name == 'shan' && !event.skill && event.cards.length == 1 && event.cards[0].name == 'shan';
				},
				content: function () { },
			},
			"gezi_guyin_4": {
				mod: {
					cardname: function (card, player) {
						if (card.name == 'jiu') return 'tao';
					},
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.countCards('h', 'jiu')) return false;
					},
					save: true,
				},
				trigger: {
					player: ["useCard1", "respond"],
				},
				firstDo: true,
				forced: true,
				filter: function (event, player) {
					return event.card.name == 'tao' && !event.skill && event.cards.length == 1 && event.cards[0].name == 'jiu';
				},
				content: function () { },
			},
			"gezi_tianze": {
				forced: true,
				audio: "ext:东方project:1",
				group: "gezi_tianze2",
				trigger: {
					player: "damageEnd",
				},
				filter: function (event, player) {
					return true;
				},
				content: function () {
					if (player.lili < player.maxlili && !player.node.fuka) {
						player.gainlili();
					} else {
						player.draw();
					}
				},
			},
			"gezi_tianze2": {
				forced: true,
				trigger: {
					target: "useCardToBegin",
				},
				filter: function (event, player) {
					if (!event.target) return false;
					return event.card && get.suit(event.card) == 'heart' && player.lili > 1;
				},
				content: function () {
					"step 0"
					player.loselili();
					var list = ["gezi_danmakucraze", "gezi_caifang", "gezi_huazhi", "gezi_xuyuanshu"];
					if (list.length) {
						player.chooseButton(['视为使用一张强化牌', [list, 'vcard']], true).set('ai', function (button) {
							return (button.link[2] == 'gezi_xuyuanshu') ? 2 : -1;
						});
					} else {
						event.finish();
					}
					'step 1'
					if (result && result.bool && result.links[0]) {
						var card = {
							name: result.links[0][2]
						};
						event.fakecard = card;
						if (lib.filter.targetEnabled2(event.fakecard, player, trigger.target)) {
							player.useCard(event.fakecard, trigger.target);
						}
					} else {
						event.finish();
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (target.lili > 1 && get.suit(card) == 'heart') {
								if (get.attitude(player, target) > 0) {
									return 1.4;
								} else {
									return 0.8;
								}
							}
						},
					},
				},
			},
			//十香
			"gezi_iphone3": {
				audio: "ext:东方project:4",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: function (card, player) {
					return true;
				},
				selectCard: 0,
				position: "he",
				viewAs: {
					name: "sha",
				},
				usable: 2,
				precontent: function (player) {
					player.gainlili();
				},
				viewAsFilter: function (player) {
					return true;
				},
				prompt: "视为使用或打出一张【杀】",
				check: function (card) {
					return 1
				},
				ai: {
					order: function (card, player) {
						return 4;
					},
					skillTagFilter: function (player) {
						if (player.getStat().skill.gezi_iphone3 >= 2) return false;
						return false;
					},
					respondSha: true,
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					result: {
						player: 1,
						target: function (card, player, target) {
							if (get.tag(card, 'respondSha')) return 0.6;
							if (player.hasSkill('jiu') && !target.getEquip('baiyin')) {
								if (get.attitude(player, target) > 0) {
									return -6;
								} else {
									return -3;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
			},
			"gezi_Halvanhelev": {
				audio: "ext:东方project:4",
				spell: ["gezi_Halvanhelev_1"],
				group: "gezi_Halvanhelev2",
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 3;
				},
				priority: 22,
				content: function () {
					player.loselili(3);
					player.Fuka();
				},
				check: function (event, player) {
					return false;
				},
			},
			"gezi_Halvanhelev2": {
				spell: ["gezi_Halvanhelev_1"],
				trigger: {
					source: "damageBegin1",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 3;
				},
				"prompt2": "消耗三点灵力，令此次和本回合接下来造成的伤害+1。",
				priority: 22,
				content: function () {
					player.loselili(3);
					player.Fuka();
				},
				check: function (event, player) {
					if (event.player.getEquip('baiyin') && !event.player.hujia) return false;
					return get.damageEffect(event.player, player, player);
				},
			},
			"gezi_Halvanhelev_1": {
				trigger: {
					source: "damageBegin2",
				},
				filter: function (event) {
					return true;
				},
				direct: true,
				content: function () {
					player.logSkill('gezi_Halvanhelev', trigger.player);
					trigger.num++;
				},
			},
			//2B
			"gezi_qiyue": {
				trigger: {
					player: "shaBegin",
				},
				filter: function (event, player) {
					return event.target.countCards('he') > 0;
				},
				audio: "ext:东方project:2",
				logTarget: "target",
				content: function () {
					'step 0'
					player.discardPlayerCard(trigger.target, 'he', true);
					'step 1'
					if (trigger.target.countCards('h') == 0) {
						if (player.lili < player.maxlili && !player.node.fuka) {
							player.gainlili();
						} else {
							player.draw();
						}
					}
					'step 2'
					if (trigger.target.countCards('e')) {
						if (player.lili < player.maxlili && !player.node.fuka) {
							player.gainlili();
						} else {
							player.draw();
						}
					}
				},
				ai: {
					expose: 0.2,
				},
				check: function (event, player) {
					return -get.attitude(player, event.target);
				},
			},
			"gezi_yueding": {
				audio: "ext:东方project:2",
				spell: ["gezi_yueding1"],
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				content: function () {
					player.loselili(2);
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > 4;
				},
			},
			"gezi_yueding1": {
				trigger: {
					player: "shaBegin",
				},
				filter: function (event, player) {
					return event.target.countCards('he') > 0;
				},
				audio: "ext:东方project:2",
				group: "gezi_yueding2",
				logTarget: "target",
				content: function () {
					'step 0'
					player.discardPlayerCard(trigger.target, 'he', true);
					'step 1'
					if (trigger.target.countCards('e') == 0) player.draw();
				},
				"prompt2": "你使用【杀】指定目标后，可以弃置目标一张牌；然后，若目标没有装备牌，你摸一张牌。",
				ai: {
					expose: 0.2,
				},
				check: function (event, player) {
					return -get.attitude(player, event.target);
				},
			},
			"gezi_yueding2": {
				audio: "ext:东方project:2",
				enable: ["chooseToUse"],
				filter: function (event, player) {
					return true;
				},
				position: "he",
				selectCard: 1,
				usable: 1,
				viewAs: {
					name: "sha",
				},
				filterCard: true,
				prompt: "将一张牌当【杀】使用",
				check: function (card) {
					return 4 - get.value(card)
				},
				ai: {
					skillTagFilter: function (player, event) {
						if (!player.countCards('he')) return false;
						if (player.getStat().skill.gezi_yueding2 > 0) return false;
						return true;
					},
					respondSha: "use",
					basic: {
						useful: [5, 1],
						value: [5, 1],
					},
					order: function () {
						if (_status.event.player.hasSkillTag('presha', true, null, true)) return 10;
						return 3;
					},
					result: {
						target: function (player, target) {
							if (player.hasSkill('jiu') && !target.hasSkillTag('filterDamage', null, {
								player: player,
								card: {
									name: 'sha'
								},
							})) {
								if (get.attitude(player, target) > 0) {
									return -7;
								} else {
									return -4;
								}
							}
							return -1.5;
						},
					},
					tag: {
						respond: 1,
						respondShan: 1,
						damage: function (card) {
							if (card.nature == 'poison') return;
							return 1;
						},
						natureDamage: function (card) {
							if (card.nature) return 1;
						},
						fireDamage: function (card, nature) {
							if (card.nature == 'fire') return 1;
						},
						thunderDamage: function (card, nature) {
							if (card.nature == 'thunder') return 1;
						},
						poisonDamage: function (card, nature) {
							if (card.nature == 'poison') return 1;
						},
					},
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
				},
			},
			//亚里沙
			"gezi_yaowu": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseEnd",
				},
				priority: 2,
				direct: true,
				filter: function (event, player) {
					return player.countUsed() > 2;
				},
				content: function () {
					'step 0'
					player.chooseTarget('令一名角色收回一张装备牌', function (card, player, target) {
						return target.countCards('e');
					}).set('ai', function (target) {
						if (target.hasSkillTag('noe')) return 0;
						return get.attitude(player, target) < 0 && target.countCards('e', function (card) {
							if (get.subtype(card) == 'equip2') return 3;
							if (get.subtype(card) == 'equip3') return 2;
							return 1;
						});
					});
					'step 1'
					if (result.targets) {
						event.target = result.targets[0];
						player.choosePlayerCard(event.target, 'e', true).set('ai', function (button) {
							if (get.subtype(button.link) == 'equip2') return 3;
							if (get.subtype(button.link) == 'equip3') return 2;
							return 1;
						});
					}
					'step 2'
					if (result.bool) {
						player.logSkill('gezi_yaowu', event.target);
						event.target.gain(result.links, 'gain2');
						player.chooseTarget('弃置场上一张牌', function (card, player, target) {
							return target.countCards('ej');
						}).set('ai', function (target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							if (att > 0) {
								var js = target.getCards('j');
								if (js.length) {
									var jj = js[0].viewAs ? {
										name: js[0].viewAs
									} : js[0];
									if (jj.name == 'guohe' || js.length > 1 || get.effect(target, jj, target, player) < 0) {
										return 2 * att;
									}
								}
								if (target.getEquip('baiyin') && target.isDamaged() &&
									get.recoverEffect(target, player, player) > 0) {
									if (target.hp == 1 && !target.hujia) return 1.6 * att;
									if (target.hp == 2) return 0.01 * att;
									return 0;
								}
							}
							var es = target.getCards('e');
							var noe = target.hasSkillTag('noe');
							var noe2 = (es.length == 1 && es[0].name == 'baiyin' && target.isDamaged());
							if (noe || noe2) return 0;
							if (att <= 0 && !es.length) return 1.5 * att;
							return -1.5 * att;
						});
					}
					'step 3'
					if (result.bool) {
						player.discardPlayerCard(result.targets[0], 'ej', true);
					} else {
						player.draw();
					}
				},
			},
			"gezi_huanrao": {
				audio: "ext:东方project:2",
				group: ["gezi_huanrao_2"],
				enable: "phaseUse",
				viewAs: {
					name: "wuzhong",
				},
				usable: 1,
				filterCard: true,
				position: "he",
				viewAsFilter: function (player) {
					return player.countCards('he') > 0;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				ai: {
					basic: {
						order: 7.2,
						useful: 4.5,
						value: 9.2,
					},
					result: {
						target: 2,
					},
					tag: {
						draw: 2,
					},
				},
			},
			"gezi_huanrao_2": {
				trigger: {
					target: "useCardToBegin",
				},
				direct: true,
				filter: function (event, player) {
					return event.skill && event.skill == 'gezi_huanrao';
				},
				content: function () {
					"step 0"
					player.addTempSkill('gezi_huanrao_3', 'useCardAfter');
				},
			},
			"gezi_huanrao_3": {
				trigger: {
					player: "gainBegin",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					console.log(event);
					return true;
				},
				content: function () {
					player.addTempSkill('gezi_huanrao_4');
					if (!player.storage.gezi_huanrao) {
						player.storage.gezi_huanrao = [];
					}
					for (var i = 0; i < trigger.cards.length; i++) {
						player.storage.gezi_huanrao.add(trigger.cards[i]);
					}
					player.showCards(trigger.cards);
				},
			},
			"gezi_huanrao_4": {
				onremove: function (player) {
					player.storage.gezi_huanrao = [];
				},
				mod: {
					cardname: function (card, player) {
						if (player.storage.gezi_huanrao.contains(card)) return 'sha';
					},
					ignoredHandcard: function (card, player) {
						if (player.storage.gezi_huanrao.contains(card)) {
							return true;
						}
					},
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.storage.gezi_huanrao.length) return false;
					},
					respondSha: true,
				},
				audio: 2,
				trigger: {
					player: ["useCard1", "respond"],
				},
				firstDo: true,
				forced: true,
				filter: function (event, player) {
					return event.card.name == 'sha' && !event.skill && event.cards.length == 1 && player.storage.gezi_huanrao.contains(event.cards[0]);
				},
				content: function () { },
			},
			"sliver_arrow": {
				audio: "ext:东方project:2",
				spell: ["sliver_arrow_2"],
				cost: 4,
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili > lib.skill.sliver_arrow.cost;
				},
				check: function (event, player) {
					return game.countPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.countCards('he') <= player.countCards('h') + 2;
					});
				},
				content: function () {
					player.loselili(lib.skill.sliver_arrow.cost);
					player.Fuka();
				},
			},
			"sliver_arrow_2": {
				audio: "ext:东方project:2",
				trigger: {
					player: "phaseUseBefore",
				},
				direct: true,
				filter: function (event, player) {
					return player.countCards('h');
				},
				content: function () {
					"step 0"
					player.chooseTarget('【白银之箭】:选择一名角色, 弃置其' + player.countCards('h') + '张牌', function (card, player, target) {
						return player != target;
					}).set('ai', function (target) {
						if (target.countCards('he') && target.countCards('he') <= player.countCards('h') && get.damageEffect(target, player, player) > 0 && get.damageEffect(target, player, player, 'thunder') > 0) return 20;
						return -get.attitude(player, target);
					});
					'step 1'
					if (result.bool) {
						event.bool = true;
						event.target = result.targets[0];
						player.line(result.targets[0], 'red');
						event.target.addTempSkill('sliver_arrow_3');
						player.discardPlayerCard(event.target, 'he', Math.min(event.target.countCards('he'), player.countCards('h')), true);
					}
					"step 2"
					if (event.bool) {
						event.target.removeSkill('sliver_arrow_3');
						player.skip('phaseDiscard');
						trigger.cancel();
					}
				},
			},
			"sliver_arrow_3": {
				trigger: {
					player: "loseEnd",
				},
				direct: true,
				filter: function (event, player) {
					if (player.countCards('he')) return false;
					return true;
				},
				content: function () {
					player.damage();
					player.damage('thunder');
				},
			},
			//焰
			"gezi_time": {
				forced: true,
				group: "gezi_time2",
				trigger: {
					global: "gameStart",
					player: "enterGame",
				},
				audio: "ext:东方project:2",
				intro: {
					mark: function (dialog, content, player) {
						if (content && content.length) {
							if (player == game.me || player.isUnderControl()) {
								dialog.addAuto(content);
							} else {
								return '共有' + get.cnNumber(content.length) + '张';
							}
						}
					},
					content: function (content, player) {
						if (content && content.length) {
							if (player == game.me || player.isUnderControl()) {
								return get.translation(content);
							}
							return '共有' + get.cnNumber(content.length) + '张';
						}
					},
				},
				filter: function (event, player) {
					return lib.config.gameRecord.gezi_homura && lib.config.gameRecord.gezi_homura.length;
				},
				content: function () {
					player.storage.gezi_time = [];
					var sort;
					for (var i = 0; i < lib.config.gameRecord.gezi_homura.length; i++) {
						var card = game.createCard(lib.config.gameRecord.gezi_homura[i]);
						sort = lib.config.sort_card(card);
						if (sort > 1) player.storage.gezi_time.splice(0, 0, card);
						else player.storage.gezi_time.push(card);
					}
					player.syncStorage('gezi_time');
					player.markSkill('gezi_time');
				},
			},
			"gezi_time2": {
				forced: true,
				popup: false,
				audio: "ext:东方project:2",
				trigger: {
					player: "dieBegin",
				},
				filter: function (event, player) {
					return player.storage.gezi_time;
				},
				content: function () {
					var gezi_homura = [];
					for (var i = 0; i < player.storage.gezi_time.length; i++) {
						gezi_homura.push({
							name: player.storage.gezi_time[i].name,
							suit: player.storage.gezi_time[i].suit,
							number: player.storage.gezi_time[i].number,
							nature: player.storage.gezi_time[i].nature
						});
					}
					lib.config.gameRecord.gezi_homura = gezi_homura;
					game.saveConfig('gameRecord', lib.config.gameRecord);
				},
			},
			"gezi_time3": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				position: "h",
				filter: function (event, player) {
					return player.countCards('h') > 0;
				},
				filterCard: function (card) {
					var suit = get.suit(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.suit(ui.selected.cards[i]) == suit) return false;
					}
					return true;
				},
				complexCard: true,
				selectCard: [1, 4],
				discard: false,
				lose: true,
				group: ["gezi_time4", "gezi_time5", "gezi_time6"],
				content: function () {
					'step 0'
					if (!player.storage.gezi_time) player.storage.gezi_time = [];
					player.lose(result.cards, ui.special, 'toStorage', 'visible');
					player.storage.gezi_time = player.storage.gezi_time.concat(cards);
					player.syncStorage('gezi_time');
					player.markSkill('gezi_time');
					'step 1'
					var gezi_homura = [];
					for (var i = 0; i < player.storage.gezi_time.length; i++) {
						gezi_homura.push({
							name: player.storage.gezi_time[i].name,
							suit: player.storage.gezi_time[i].suit,
							number: player.storage.gezi_time[i].number,
							nature: player.storage.gezi_time[i].nature
						});
					}
					lib.config.gameRecord.gezi_homura = gezi_homura;
					game.saveConfig('gameRecord', lib.config.gameRecord);
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			"gezi_time4": {
				enable: "chooseToUse",
				audio: "ext:东方project:6",
				complexSelect: true,
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					return player.storage.gezi_time && player.countCards('h') < player.hp && event.type != 'wuxie';
				},
				chooseButton: {
					dialog: function (event, player) {
						return ui.create.dialog([player.storage.gezi_time, 'vcard']);
					},
					filter: function (button, player) {
						return true;
					},
					check: function (button) {
						var player = _status.event.player;
						return true;
					},
					backup: function (links, player) {
						return {
							selectCard: 0,
							content: function (event, player) {
								player.logSkill('gezi_time4');
								var cards = event.getParent().getParent()._result.links;
								player.$gain(cards);
								player.gain(cards);
								for (var i = 0; i < cards.length; i++) {
									player.storage.gezi_time.remove(cards[i]);
								}
								player.syncStorage('gezi_time');
								// 无可奈何的改法，以后希望可以有别的方法改
								event.getParent().getParent().goto(0);
								var gezi_homura = [];
								for (var i = 0; i < player.storage.gezi_time.length; i++) {
									gezi_homura.push({
										name: player.storage.gezi_time[i].name,
										suit: player.storage.gezi_time[i].suit,
										number: player.storage.gezi_time[i].number,
										nature: player.storage.gezi_time[i].nature
									});
								}
								lib.config.gameRecord.gezi_homura = gezi_homura;
								game.saveConfig('gameRecord', lib.config.gameRecord);
							},
							check: function (card) {
								return 1;
							},
						}
					},
				},
				hiddenCard: function (player, name) {
					return name == 'shan' || name == 'wuxie';
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					order: 2,
					result: {
						player: function (player) {
							return 1;
						},
					},
					threaten: 1,
				},
			},
			"gezi_time5": {
				enable: "chooseToUse",
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					return player.storage.gezi_time && player.storage.gezi_time.length;
				},
				chooseButton: {
					dialog: function (event, player) {
						return ui.create.dialog([player.storage.gezi_time, 'vcard']);
					},
					filter: function (button, player) {
						var evt = _status.event.getParent();
						if (evt && evt.filterCard) {
							return evt.filterCard(button.link, player, evt);
						}
						return player.storage.gezi_time;
					},
					check: function (button) {
						return 1;
					},
					backup: function (links, player) {
						return {
							filterCard: function () {
								return false
							},
							selectCard: -1,
							viewAs: links[0],
							onuse: function (result, player) {
								player.logSkill('gezi_time4');
								var card = links[0];
								player.storage.gezi_time.remove(card);
								player.syncStorage('gezi_time');
								game.delay();
								var gezi_homura = [];
								for (var i = 0; i < player.storage.gezi_time.length; i++) {
									gezi_homura.push({
										name: player.storage.gezi_time[i].name,
										suit: player.storage.gezi_time[i].suit,
										number: player.storage.gezi_time[i].number,
										nature: player.storage.gezi_time[i].nature
									});
								}
								lib.config.gameRecord.gezi_homura = gezi_homura;
								game.saveConfig('gameRecord', lib.config.gameRecord);
							}
						}
					},
					prompt: function (links, player) {
						return '【再回】：选择' + get.translation(links) + '的目标';
					},
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					result: {
						player: function (player) {
							if (_status.event.dying) return get.attitude(player, _status.event.dying);
							return 1;
						},
					},
				},
			},
			"gezi_time6": {
				audio: "ext:东方project:2",
				trigger: {
					player: "chooseToRespondBegin",
				},
				direct: true,
				filter: function (event, player) {
					if (_status.currentPhase == player) return false;
					if (event.responded) return false;
					return player.storage.gezi_time && player.storage.gezi_time.length;
				},
				content: function () {
					"step 0"
					var cards = [];
					for (var i = 0; i < player.storage.gezi_time.length; i++) {
						cards.push(player.storage.gezi_time[i]);
					}
					player.chooseCardButton('【再回】：选择一张卡牌打出', cards).set('filterButton', function (button) {
						return _status.event.getTrigger().filterCard(button.link);
					});
					"step 1"
					if (result.bool) {
						game.log(player, '【再回】发动成功');
						player.logSkill('gezi_time4');
						trigger.untrigger();
						trigger.responded = true;
						player.storage.gezi_time.remove(result.links[0]);
						player.syncStorage('gezi_time');
						trigger.result = {
							bool: true,
							card: result.links[0]
						}
						var gezi_homura = [];
						for (var i = 0; i < player.storage.gezi_time.length; i++) {
							gezi_homura.push({
								name: player.storage.gezi_time[i].name,
								suit: player.storage.gezi_time[i].suit,
								number: player.storage.gezi_time[i].number,
								nature: player.storage.gezi_time[i].nature
							});
						}
						lib.config.gameRecord.gezi_homura = gezi_homura;
						game.saveConfig('gameRecord', lib.config.gameRecord);
					}
				},
				ai: {
					respondSha: true,
					respondShan: true,
					save: true,
					effect: {
						player: 1,
						target: function (card, player, target, effect) {
							if (get.tag(card, 'respondShan')) return 0.8;
							if (get.tag(card, 'respondSha')) return 0.8;
						},
					},
				},
			},
			"gezi_homuraworld": {
				audio: "ext:东方project:2",
				roundi: true,
				priority: 22,
				spell: ["gezi_homuraworld_skill"],
				trigger: {
					player: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili > 1;
				},
				content: function () {
					player.loselili();
					player.Fuka();
				},
				check: function (event, player) {
					return player.lili > 3 && game.countPlayer(function (current) {
						return get.attitude(player, current) > 0 && current.hp == 1;
					});
				},
			},
			"gezi_homuraworld_skill": {
				trigger: {
					global: "useCardToBegin",
				},
				usable: 1,
				audio: "ext:东方project:2",
				filter: function (event, player) {
					if (event.player != _status.currentPhase) return false;
					return get.tag(event.card, 'damage') && player.lili;
				},
				content: function () {
					'step 0'
					player.loselili();
					trigger.cancel();
					player.line(trigger.player, 'red');
					if (get.itemtype(trigger.card) == 'card') {
						if (!player.storage.gezi_time) player.storage.gezi_time = [];
						player.storage.gezi_time = player.storage.gezi_time.concat(trigger.card);
						player.syncStorage('gezi_time');
						player.markSkill('gezi_time');
					}
				},
				check: function (event, player) {
					if (get.effect(event.target, event.card, event.player, player) >= 0)
						return false;
					if (event.target.hp > 2) return false;
					return true;
				},
				prompt: "要不要使用The World的力量？",
			},
			//女神官
			"gezi_xiaoyu": {
				audio: "ext:东方project:2",
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.lili > 0 || !player.node.lili;
				},
				filterTarget: function (card, player, target) {
					if (target.hp >= target.maxHp) return false;
					return true;
				},
				selectTarget: 1,
				content: function () {
					if (player.lili > 0) player.loselili();
					target.recover();
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							if (get.attitude(player, target) > 0) {
								return get.recoverEffect(target, player, player) + 1;
							}
							return 0;
						},
					},
					threaten: 2,
				},
			},
			"gezi_jinhua": {
				audio: "ext:东方project:2",
				group: "gezi_jinhua2",
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.lili > 0;
				},
				filterTarget: function (card, player, target) {
					return target.countCards('he');
				},
				selectTarget: 1,
				content: function () {
					"step 0"
					if (player.lili > 0) player.loselili();
					target.chooseCard('he', '净化：你可以重铸任意张牌', [1, Infinity]).set('ai', function (card) {
						return 5 - get.value(card);
					});
					"step 1"
					if (result.bool && result.cards.length) {
						target.recast(result.cards);
					}
				},
				ai: {
					order: 1,
					result: {
						target: 1,
					},
				},
			},
			"gezi_jinhua2": {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return !player.node.lili && player.countCards('he');
				},
				content: function () {
					"step 0"
					player.chooseCard('he', '净化：你可以重铸任意张牌', [1, Infinity]).set('ai', function (card) {
						return 6 - get.value(card);
					});
					"step 1"
					if (result.bool && result.cards.length) {
						player.logSkill('gezi_jinhua');
						player.recast(result.cards);
					}
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			"gezi_shengbi": {
				audio: "ext:东方project:2",
				trigger: {
					global: "phaseBegin",
				},
				filter: function (event, player) {
					return player.lili > 0;
				},
				direct: true,
				content: function () {
					"step 0"
					player.chooseTarget('圣壁：指定一名角色，该角色本回合受到的第一次伤害-1。').set('ai', function (target) {
						return get.attitude(_status.event.player, target);
					});
					'step 1'
					if (result.bool) {
						player.loselili();
						player.logSkill('gezi_shengbi', result.targets);
						game.notify('圣壁发动');
						result.targets[0].addTempSkill('gezi_shengbi_skill');
						result.targets[0].markSkillCharacter('gezi_shengbi', player, '圣壁（伤害-1）', '你受到的第一次伤害-1直到当前回合结束');
						result.targets[0].storage.gezi_shengbi_skill = player;
					}
				},
			},
			"gezi_shengbi_skill": {
				trigger: {
					player: "damageBegin",
				},
				onremove: function (player) {
					if (player.storage.gezi_shengbi_skill) {
						player.storage.gezi_shengbi_skill.gainlili();
					}
					player.unmarkSkill('gezi_shengbi');
				},
				forced: true,
				content: function () {
					'step 0'
					delete player.storage.gezi_shengbi_skill;
					'step 1'
					player.removeSkill('gezi_shengbi_skill');
					trigger.num--;
				},
			},
			//诗乃
			"gezi_yanju": {
				audio: "ext:东方project:3",
				trigger: {
					player: "phaseUseBegin",
				},
				filter: function (event, player) {
					return true;
				},
				direct: true,
				content: function () {
					'step 0'
					player.chooseControl(['造成伤害后摸一张牌', '无视装备效果', '不可闪避'], function (event, player) {
						return '不可闪避';
					}).set('prompt', '选择一个效果赋予你的下一张【杀】');
					'step 1'
					if (result.control) {
						if (result.control == '造成伤害后摸一张牌') {
							player.addTempSkill('gezi_yanju2', 'useCardAfter');
						} else if (result.control == '无视装备效果') {
							player.addTempSkill('louguan_skill', 'useCardAfter');
						} else if (result.control == '不可闪避') {
							player.addTempSkill('gezi_yanju3', 'useCardAfter');
						}
						player.chooseTarget('选择一名狙击目标', function (card, player, target) {
							return player.canUse({
								name: 'sha'
							}, target, false);
						}).set('ai', function (target) {
							return get.effect(target, {
								name: 'sha'
							}, _status.event.player);
						});
					}
					'step 2'
					if (result.bool) {
						player.logSkill('gezi_yanju', result.targets[0]);
						player.useCard({
							name: 'sha'
						}, result.targets[0], false);
					} else {
						player.removeSkill('gezi_yanju2');
						player.removeSkill('louguan_skill');
						player.removeSkill('gezi_yanju3');
					}
				},
			},
			"gezi_yanju1": {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == 'sha') return true;
					},
				},
			},
			"gezi_yanju2": {
				trigger: {
					source: "damageAfter",
				},
				forced: true,
				popup: false,
				filter: function (event) {
					return event.parent.parent.parent.name == 'gezi_yanju';
				},
				content: function () {
					player.draw();
				},
			},
			"gezi_yanju3": {
				trigger: {
					player: "shaBegin",
				},
				logTarget: "target",
				filter: function (event, player) {
					return true;
				},
				content: function () {
					trigger.directHit = true;
				},
				forced: true,
			},
			"gezi_shangtang": {
				audio: "ext:东方project:3",
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter: function (event, player) {
					return player.lili < 3 || player.countCards('h') < 4;
				},
				content: function () {
					'step 0'
					var l = [];
					if (player.lili < 3) {
						l.push('将灵力补至3');
					}
					if (player.countCards('h') < 4) {
						l.push('将手牌数补至4');
					}
					player.chooseControl(l).set('ai', function () {
						if (player.countCards('h') < 4 && !player.node.lili) return '将手牌数补至4';
						if (player.countCards('h') >= 4 && player.lili < 3) return '将灵力补至3';
						if (player.countCards('h') < 4 && 4 - player.countCards('h') > 3 - player.lili) return '将手牌数补至4';
						return '将灵力补至3';
					});
					'step 1'
					if (result.control == '将手牌数补至4') {
						player.draw(4 - player.countCards('h'));
						player.addTempSkill('gezi_shangtang1');
					} else if (result.control == '将灵力补至3') {
						player.gainlili(3 - player.lili);
						player.addTempSkill('gezi_shangtang1');
					}
				},
				check: function (event, player) {
					return player.countCards('h') < 3 || player.lili < 2;
				},
			},
			"gezi_shangtang1": {
				mark: true,
				intro: {
					content: "不能对其他角色使用杀以外的牌<br>手牌上限至少为4",
				},
				mod: {
					playerEnabled: function (card, player, target) {
						if (player != target && card.name != 'sha') return false;
					},
					maxHandcard: function (player, num) {
						if (num < 4) return 4;
						else return num;
					},
				},
			},
			//奏
			"gezi_zhongzou": {
				audio: "ext:东方project:4",
				trigger: {
					global: "phaseEnd",
				},
				group: ["gezi_zhongzou_2", "gezi_zhongzou_3", "gezi_zhongzou_5"],
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.storage.gezi_zhongzou == true;
					});
				},
				content: function () {
					'step 0'
					var targets = [];
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].storage.gezi_zhongzou == true) targets.push(players[i]);
					}
					if (targets.length) player.useCard({
						name: 'sha'
					}, targets, false);
				},
				check: function (event, player) {
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (!players[i].storage.gezi_zhongzou) continue;
						num += get.effect(players[i], {
							name: 'sha'
						}, player, player);
					}
					return num > 0;
				},
				prompt: function () {
					var player = _status.event.player;
					var list = game.filterPlayer(function (current) {
						return current.storage.gezi_zhongzou;
					});
					var str = '是否发动【终奏】对' + get.translation(list) + '视为使用一张【杀】？';
					return str;
				},
			},
			"gezi_zhongzou_2": {
				trigger: {
					global: "damageEnd",
				},
				filter: function (event, player) {
					if (!event.source) return false;
					return !event.card || get.name(event.card) != 'sha';
				},
				direct: true,
				popup: false,
				content: function () {
					trigger.source.storage.gezi_zhongzou = true;
				},
			},
			"gezi_zhongzou_3": {
				trigger: {
					global: "useCard",
				},
				filter: function (event, player) {
					return event.targets.length;
				},
				direct: true,
				popup: false,
				content: function () {
					lib.skill['gezi_zhongzou_4'].trigger = {
						global: trigger.card.name + 'Cancelled'
					};
					player.removeSkill('gezi_zhongzou_4');
					player.addSkill('gezi_zhongzou_4');
				},
			},
			"gezi_zhongzou_4": {
				direct: true,
				popup: false,
				trigger: {},
				content: function () {
					trigger.target.storage.gezi_zhongzou = true;
					player.removeSkill('gezi_zhongzou_4');
				},
			},
			"gezi_zhongzou_5": {
				direct: true,
				popup: false,
				trigger: {
					global: "phaseAfter",
				},
				content: function () {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						players[i].storage.gezi_zhongzou = false;
					}
				},
			},
			"gezi_moxin": {
				audio: "ext:东方project:4",
				trigger: {
					global: "phaseJieshuBegin",
				},
				filter: function (event, player) {
					return event.player.isAlive() && (!event.player.countUsed('sha') && !event.player.getStat('damage'));
				},
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					if (trigger.player.lili < trigger.player.maxlili) {
						list.push('令' + get.translation(trigger.player) + '恢复灵力');
					}
					list.push('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
					event.list = list;
					player.chooseControlList(event.list, function (event, player) {
						if (get.attitude(player, trigger.player) <= 0) return event.list.indexOf('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
						if (!_status.currentPhase.node.fuka && _status.currentPhase.lili < 3) return event.list.indexOf('令' + get.translation(trigger.player) + '恢复灵力');
						return event.list.indexOf('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
					})
					'step 1'
					if (event.list[result.index] == '令' + get.translation(trigger.player) + '恢复灵力') {
						player.logSkill('gezi_moxin', trigger.player);
						trigger.player.gainlili();
					} else if (event.list[result.index] == '摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌') {
						player.logSkill('gezi_moxin', trigger.player);
						player.draw();
						if (trigger.player != player) {
							player.chooseCard('he', '然后可以交给' + get.translation(trigger.player) + '一张牌').set('ai', function (card) {
								var player = _status.event.player;
								if (get.attitude(player, trigger.player) <= 0) return false;
								return 7 - get.value(card);
							});
						}
					}
					'step 2'
					if (result.bool) {
						trigger.player.gain(result.cards[0], player);
						player.$give(1, trigger.player);
					}
				},
			},
			//由理
			"gezi_chongzou": {
				enable: "phaseUse",
				audio: "ext:东方project:6",
				group: "gezi_chongzou_1",
				init: function (player) {
					player.storage.gezi_chongzou = [];
				},
				selectTarget: 1,
				filterTarget: function (card, player, target) {
					return true;
				},
				filter: function (event, player) {
					if (!player.node.lili) return player.storage.gezi_chongzou.length < 1;
					return player.storage.gezi_chongzou.length < 3 && player.lili > 0;
				},
				content: function () {
					'step 0'
					var control = ['获得【雨至】', '贴上【潜藏】', '【杀】造成灵力流失'];
					if (player.storage.gezi_chongzou.contains(1)) control.remove('贴上【潜藏】');
					if (player.storage.gezi_chongzou.contains(2)) control.remove('获得【雨至】');
					if (!target.node.lili || player.storage.gezi_chongzou.contains(3)) control.remove('【杀】造成灵力流失');
					if (control.length == 0) event.finish();
					event.controlList = control;
					player.chooseControlList(control, function (event, player) {
						if (target.hp <= 2 && control.contains('贴上【潜藏】')) return control.indexOf('贴上【潜藏】');
						if (target.countCards('h', {
							name: 'sha'
						}) && control.contains('【杀】造成灵力流失'))
							return control.indexOf('【杀】造成灵力流失');
						if (!target.hasSkill('kc_yuzhi')) return 0;
						return control.length - 1;
					}).set('prompt', '【重奏】：为' + get.translation(target) + '选择一项效果：');
					'step 1'
					if (result.control) {
						player.loselili();
						if (event.controlList[result.index] == '贴上【潜藏】') {
							target.addJudgen(game.createCard('gezi_qianxing', '', ''));
							player.storage.gezi_chongzou.push(1);
						} else if (event.controlList[result.index] == '获得【雨至】') {
							if (!target.hasSkill('kc_yuzhi')) {
								target.addSkill('kc_yuzhi');
								target.addSkill('gezi_chongzou_2');
							}
							player.storage.gezi_chongzou.push(2);
						} else if (event.controlList[result.index] == '【杀】造成灵力流失') {
							target.addTempSkill('gezi_chongzou_3', {
								player: 'phaseAfter'
							});
							player.storage.gezi_chongzou.push(3);
						}
						game.log(player, '令', target, '获得了以下效果：' + event.controlList[result.index]);
					}
				},
				ai: {
					order: 4,
					result: {
						player: function (player) {
							if (player.lili <= 2) return 0;
							return 1;
						},
						target: function (player, target) {
							if (get.attitude(player, target) > 0) {
								return 2;
							}
							return 0;
						},
					},
				},
			},
			"gezi_chongzou_1": {
				popup: false,
				direct: true,
				trigger: {
					player: "phaseBegin",
				},
				content: function () {
					player.storage.gezi_chongzou = [];
				},
			},
			"gezi_chongzou_2": {
				popup: false,
			},
			"gezi_chongzou_3": {
				forced: true,
				trigger: {
					player: "useCardToBefore",
				},
				filter: function (event, player) {
					return get.name(event.card) == 'sha';
				},
				content: function () {
					trigger.target.loselili();
				},
			},
			"gezi_qixin": {
				audio: "ext:东方project:3",
				trigger: {
					global: "phaseJieshuBegin",
				},
				filter: function (event, player) {
					return event.player.isAlive() && event.player.getStat('damage') && event.player.countUsed('sha');
				},
				direct: true,
				content: function () {
					'step 0'
					var list = [];
					if (trigger.player.lili < trigger.player.maxlili) {
						list.push('令' + get.translation(trigger.player) + '恢复灵力');
					}
					list.push('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
					event.list = list;
					player.chooseControlList(event.list, function (event, player) {
						if (get.attitude(player, trigger.player) <= 0) return event.list.indexOf('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
						if (!_status.currentPhase.node.fuka && _status.currentPhase.lili < 3) return event.list.indexOf('令' + get.translation(trigger.player) + '恢复灵力');
						return event.list.indexOf('摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌');
					})
					'step 1'
					if (event.list[result.index] == '令' + get.translation(trigger.player) + '恢复灵力') {
						player.logSkill('gezi_qixin', trigger.player);
						trigger.player.gainlili();
					} else if (event.list[result.index] == '摸一张牌，然后可以交给' + get.translation(trigger.player) + '一张牌') {
						player.logSkill('gezi_qixin', trigger.player);
						player.draw();
						if (trigger.player != player) {
							player.chooseCard('he', '然后可以交给' + get.translation(trigger.player) + '一张牌').set('ai', function (card) {
								var player = _status.event.player;
								if (get.attitude(player, trigger.player) <= 0) return false;
								return 7 - get.value(card);
							});
						}
					}
					'step 2'
					if (result.bool) {
						trigger.player.gain(result.cards[0], player);
						player.$give(1, trigger.player);
					}
				},
			},

			/*-------------------明置角色-------------------*/
			//美九
			"gezi_duzou": {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target.countCards('h');
				},
				content: function () {
					"step 0"
					event.videoId = lib.status.videoId++;
					var cards = target.getCards('h');
					if (player.isOnline2()) {
						player.send(function (cards, id) {
							ui.create.dialog('独奏', cards).videoId = id;
						}, cards, event.videoId);
					}
					event.dialog = ui.create.dialog('独奏', cards);
					event.dialog.videoId = event.videoId;
					if (!event.isMine()) {
						event.dialog.style.display = 'none';
					}
					player.chooseButton(true).set('filterButton', function (button) {
						return !target.getShownCards().includes(button.link);
					}).set('dialog', event.videoId);
					"step 1"
					if (result.bool) {
						event.card = result.links;
						target.addShownCards(event.card, 'visible_mingzhi');
					}
					"step 2"
					if (target.lili == 0) {
						game.log('回合结束后，', target, '执行一个由', player, '操作的出牌阶段');
						target.addSkill('gezi_duzou_extra');
					}
					if (player.isOnline2()) {
						player.send('closeDialog', event.videoId);
					}
					event.dialog.close();
					event.finish();
				},
				ai: {
					threaten: 1.5,
					result: {
						target: function (player, target) {
							return -target.countCards('h');
						}
					},
					order: 10,
					expose: 0.4,
				},
			},
			"gezi_duzou_extra": {
				direct: true,
				trigger: { global: 'phaseAfter' },
				content: function () {
					'step 0'
					if (get.mode() == 'boss' || get.mode() == 'chess') {
						game.swapControl(player);
						game.onSwapControl();
					} else {
						game.swapPlayer(player);
					}
					player.phaseUse();
					'step 1'
					game.log('————————————————————');
					if (get.mode() == 'boss' || get.mode() == 'chess') {
						game.swapControl(trigger.player);
						game.onSwapControl();
					} else {
						game.swapPlayer(trigger.player);
					}
					player.removeSkill('gezi_duzou_extra');
				},
			},
			"gezi_lunwu": {
				enable: 'phaseUse',
				usable: 1,
				filterCard: true,
				selectCard: 1,
				discard: false,
				prepare: 'give',
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					'step 0'
					target.gain(cards, player);
					target.addShownCards(cards, 'visible_diva');
					'step 1'
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] == player) continue;
						if (target.inRange(players[i])) players[i].damage('thunder');
					}
				},
				prompt: '低音炮向谁发射呢？',
				ai: {
					order: function (skill, player) {
						return 1;
					},
					result: {
						target: function (player, target) {
							var nh = target.countCards('h');
							var np = player.countCards('h');
							if (player.hp == player.maxHp || player.countCards('h') <= 1) {
								if (nh >= np - 1 && np <= player.hp) return 0;
							}
							return Math.max(1, 5 - nh);
						}
					},
					effect: {
						target: function (card, player, target) {
							if (player == target && get.type(card) == 'equip') {
								if (player.countCards('e', { subtype: get.subtype(card) })) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i] != player && get.attitude(player, players[i]) > 0) {
											return 0.1;
										}
									}
								}
							}
						}
					},
				},
			},
			"gezi_tiaoxian": {
				trigger: { global: 'addShownCardsAfter' },
				audio: 2,
				filter: function (event, player) {
					return true;
				},
				content: function () {
					var cards = trigger.cards;
					var red = false;
					var black = false;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.color(trigger.cards[i]) == 'red') {
							red = true;
						}
						if (get.color(trigger.cards[i]) == 'black') {
							black = true;
						}
					}
					if (red == true) {
						trigger.player.gainlili();
					}
					if (black == true) {
						trigger.player.damage('thunder');
					}
				},
			},
			//阿库娅
			'gezi_yuyin': {
				trigger: {
					player: "phaseEnd",
				},
				direct: true,
				filter: function (event, player) {
					if (!player.getShownCards().length) return false;
					var max = 0, cards = player.getShownCards(), map = {};
					for (var card of cards) {
						var suit = get.suit(card, player);
						if (!map[suit]) map[suit] = 0;
						map[suit]++;
						if (map[suit] > max) max = map[suit];
					}
					return max > 1;
				},
				content: function () {
					"step 0"
					player.chooseTarget(get.prompt(event.name)).set('ai', function (target) {
						return get.attitude(player, target);
					});
					"step 1"
					if (result.bool) {
						var target = result.targets[0];
						if (player.getShownCards().filter(card => get.color(card, player) == 'red').length > 1) {
							var next = player.phaseDraw();
							event.next.remove(next);
							trigger.getParent().next.push(next);
						}
						if (player.getShownCards().filter(card => get.color(card, player) == 'black').length > 1) {
							var next = player.phaseUse();
							event.next.remove(next);
							trigger.getParent().next.push(next);
						}
					}
				}
			},
			'gezi_qingqu_buff': {
				mod: {
					cardUsable: function (card, player, num) {
						var tg = game.filterPlayer(target => target.hasSkill('gezi_qingqu'))[0];
						if (tg && card.name == 'sha') return num + tg.getShownCards().filter(card => get.color(card, player) == 'black').length;
					},
					maxHandcard: function (player, num) {
						var tg = game.filterPlayer(target => target.hasSkill('gezi_qingqu'))[0];
						if (tg) return num + tg.getShownCards().filter(card => get.color(card, player) == 'red').length;
					},
				},
			},
			'gezi_qingqu': {
				global: 'gezi_qingqu_buff',
				trigger: {
					player: "phaseUseBegin",
				},
				direct: true,
				filter: function (event, player) {
					return player.lili > 0 && player.getCards('h', card => !player.getShownCards().includes(card)).length > 0;
				},
				content: function () {
					"step 0"
					player.chooseCard('你可以展示至多' + get.cnNumber(player.lili) + '张手牌', [0, player.lili], function (card) {
						return !player.getShownCards().includes(card);
					}).ai = function (card) {
						var val = get.value(card);
						if (val < 0) return 10;
						return 6 - val;
					};
					"step 1"
					if (result.bool) {
						player.addShownCards(result.cards, 'visible_mingzhi');
					}
				}
			},
			//初音未来
			"gezi_geying": {
				audio: "ext:东方project:2",
				trigger: {
					player: "loseEnd",
				},
				usable: 3,
				filter: function (event, player) {
					return player.countCards('h');
				},
				async content(event, trigger, player) {
					const { result: { cards } } = await player.chooseCard('h', true);
					if (get.is.shownCard(cards[0])) player.hideShownCards(cards[0]);
					else player.addShownCards(cards[0], 'visible_mingzhi');
				},
				group: ["gezi_geying_zhunbei", "gezi_geying_jieshu"],
				subSkill: {
					"zhunbei": {
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						filter: function (event, player) {
							if (player.countCards('j')) return true;
							if (player.getShownCards().length) return true;
							return false;
						},
						prompt2: function (event, player) {
							return "你可以重铸所有明置手牌和判定区内的牌";
						},
						async content(event, trigger, player) {
							await player.recast(player.getCards('j').concat(player.getShownCards()));
						},
						sub: true,
					},
					"jieshu": {
						trigger: {
							player: "phaseJieshuBegin",
						},
						filter: function (event, player) {
							return player.countCards('h') > player.getShownCards().length;
						},
						prompt2: function (event, player) {
							return "你可以重铸所有暗置手牌";
						},
						async content(event, trigger, player) {
							await player.recast(player.getCards('h', card => !player.getShownCards().includes(card)));
						},
						sub: true,
					},
				},
			},
			"gezi_wuyan": {
				mark: true,
				marktext: "舞",
				intro: {
					name: "舞燕",
					content: function (storage, player) {
						let cards = player.getShownCards().concat(player.getCards('e'));
						let suit = {
							spade: 0,
							heart: 0,
							club: 0,
							diamond: 0,
						}
						cards.forEach(card => suit[get.suit(card)]++);
						let num = Math.max(...Object.values(suit)), str = new String();
						Object.entries(suit).forEach(entry => {
							if (player.hasSkill('gezi_stage1') ? entry[1] : entry[1] && (entry[1] == num)) str += `${get.translation(entry[0])} `;
						});
						return str;
					},
				},
				global: ['gezi_wuyan_spade', 'gezi_wuyan_heart', 'gezi_wuyan_club', 'gezi_wuyan_diamond'],
				subSkill: {
					"spade": {
						trigger: {
							player: "phaseZhunbeiBegin",
						},
						filter: function (event, player) {
							return game.hasPlayer(function (target) {
								if (!target.hasSkill('gezi_wuyan')) return false;
								let cards = target.getShownCards().concat(target.getCards('e'));
								let suit = {
									spade: 0,
									heart: 0,
									club: 0,
									diamond: 0,
								}
								cards.forEach(card => suit[get.suit(card)]++);
								return target.hasSkill('gezi_stage1') ? suit.spade : suit.spade && Math.max(...Object.values(suit)) == suit.spade;
							});
						},
						forced: true,
						async content(event, trigger, player) {
							player.gainlili();
						},
						sub: true,
					},
					"heart": {
						enable: "chooseToUse",
						usable: 1,
						prompt: "将一张牌当【桃】使用",
						filterCard: true,
						position: "he",
						viewAs: {
							name: "tao",
						},
						viewAsFilter: function (player) {
							return game.hasPlayer(function (target) {
								if (!target.hasSkill('gezi_wuyan')) return false;
								let cards = target.getShownCards().concat(target.getCards('e'));
								let suit = {
									spade: 0,
									heart: 0,
									club: 0,
									diamond: 0,
								}
								cards.forEach(card => suit[get.suit(card)]++);
								return target.hasSkill('gezi_stage1') ? suit.heart : suit.heart && Math.max(...Object.values(suit)) == suit.heart;
							});
						},
						check: function (card) {
							return 8 - get.value(card);
						},
						sub: true,
					},
					"club": {
						trigger: {
							player: "phaseDrawBegin2",
						},
						filter: function (event, player) {
							return game.hasPlayer(function (target) {
								if (!target.hasSkill('gezi_wuyan')) return false;
								let cards = target.getShownCards().concat(target.getCards('e'));
								let suit = {
									spade: 0,
									heart: 0,
									club: 0,
									diamond: 0,
								}
								cards.forEach(card => suit[get.suit(card)]++);
								return target.hasSkill('gezi_stage1') ? suit.club : suit.club && Math.max(...Object.values(suit)) == suit.club;
							});
						},
						forced: true,
						async content(event, trigger, player) {
							trigger.num++;
						},
						sub: true,
					},
					"diamond": {
						trigger: {
							player: "phaseDiscardBegin",
						},
						filter: function (event, player) {
							return game.hasPlayer(function (target) {
								if (!target.hasSkill('gezi_wuyan')) return false;
								let cards = target.getShownCards().concat(target.getCards('e'));
								let suit = {
									spade: 0,
									heart: 0,
									club: 0,
									diamond: 0,
								}
								cards.forEach(card => suit[get.suit(card)]++);
								return target.hasSkill('gezi_stage1') ? suit.diamond : suit.diamond && Math.max(...Object.values(suit)) == suit.diamond;
							});
						},
						prompt: function (event, player) {
							return "你可以将一张牌交给初音未来";
						},
						async content(event, trigger, player) {
							const { result: { bool, targets, cards } } = await player.chooseCardTarget({
								prompt: "交给初音未来一张牌~",
								selectCard: 1,
								filterTarget: function (card, player, target) {
									return target.hasSkill('gezi_wuyan');
								},
								position: 'he',
								ai2: function (target) {
									return get.attitude(_status.event.player, target);
								},
							});
							if (bool) {
								await player.give(cards, targets[0]);
								targets[0].say("谢谢你的应援~！");
							}
						},
						sub: true,
					},
				},
			},
			"gezi_stage": {
				audio: "ext:东方project:2",
				spell: ["gezi_stage1"],
				roundi: true,
				priority: 22,
				trigger: {
					player: "phaseBegin",
				},
				check: function (event, player) {
					return player.countCards('h') < 2;
				},
				filter: function (event, player) {
					if (player.node.fuka) return false;
					return player.lili > 2;
				},
				async content(event, trigger, player) {
					player.loselili(2);
					player.say("旋转吧，舞台！");
					player.Fuka();
				},
			},
			"gezi_stage1": {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				forced: true,
				async content(event, trigger, player) {
					await player.drawTo(3);
					player.addShownCards(player.getCards('h'), 'visible_mingzhi');
				},
			},

			/*-------------------战棋-------------------*/
			//集气石
			"jiqitou": {
				nobracket: true,
				global: "jiqitou2",
			},
			"jiqitou2": {
				trigger: {
					player: "phaseAfter",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (player.hp == player.maxHp) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_jiqitou') {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_jiqitou') {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, 'thunder');
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					'step 1'
					game.log('集气石发动');
					player.recover('nosource');
					var he = player.getCards('he');
					if (he.length) {
						player.discard(he.randomGets(2));
					}
				},
			},
			//流星雨
			"paimaiyunshi": {
				nobracket: true,
				global: "paimaiyunshi2",
			},
			"paimaiyunshi2": {
				trigger: {
					player: "phaseAfter",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (player.hp <= 1) return false;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_paimaiyunshi') {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_paimaiyunshi') {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, 'thunder');
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					'step 1'
					game.log('流星雨发动');
					player.damage('nosource');
					player.draw(2);
				},
			},
			//黑洞
			"shenmiR18": {
				nobracket: true,
				global: "shenmiR182",
			},
			"shenmiR182": {
				trigger: {
					player: "phaseAfter",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_shenmiR18') {
							return player.canMoveTowards(game.treasures[i]) &&
								get.chessDistance(game.treasures[i], player) > 2;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					var source = null;
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_shenmiR18') {
							source = game.treasures[i];
							break;
						}
					}
					if (source) {
						event.source = source;
						source.chessFocus();
						source.playerfocus(1000);
						source.line(player, 'thunder');
						if (lib.config.animation && !lib.config.low_performance) {
							setTimeout(function () {
								source.$epic2();
							}, 300);
						}
						game.delay(2);
					} else {
						event.finish();
					}
					'step 1'
					game.log('黑洞酱发动');
					player.moveTowards(event.source);
				},
			},
			//守矢神社
			"shrine1": {
				global: "shrine2",
			},
			"shrine2": {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_shrine1') {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					game.log('守矢神社的保佑发动！');
					player.draw();
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].name == 'gezi_sanae') players[i];
					}
				},
			},
			//博丽神社
			"shrine3": {
				global: "shrine4",
			},
			"shrine4": {
				trigger: {
					player: "phaseBegin",
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					for (var i = 0; i < game.treasures.length; i++) {
						if (game.treasures[i].name == 'treasure_shrine2') {
							return get.chessDistance(game.treasures[i], player) <= 2;
						}
					}
					return false;
				},
				content: function () {
					'step 0'
					game.log('给博丽神社交了保护费……');
					player.chooseToDiscard(1, true, 'he');
					'step 1'
					if (result.bool && game.hasPlayer(function (current) {
						return current.name == 'gezi_reimu';
					})) {
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].name == 'gezi_reimu') players[i].gain(result.cards);
						}
					}
				},
			},

			/*-------------------其他-------------------*/
			"_gezi_mubiao": {
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				silent: true,
				priority: -100,
				content: function () {
					for (var i = 0; i < trigger.targets.length; i++) {
						if (!trigger.targets[i].storage._gezi_mubiao) {
							trigger.targets[i].storage._gezi_mubiao = 1;
						} else {
							trigger.targets[i].storage._gezi_mubiao += 1;
						}
					}
				},
				popup: false,
			},
			"_gezi_mubiaoend": {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				silent: true,
				priority: -100,
				content: function () {
					if (player.storage._gezi_mubiao) {
						player.storage._gezi_mubiao = 0;
					}
				},
				popup: false,
			},
		},
		translate: {
			/*-------------------锦囊牌-------------------*/
			"danmaku_skill": "弹幕狂欢",
			"danmaku_skill_info": "",
			"gezi_ruodianjielu": "弱点揭露",
			"gezi_ruodianjielu_info": "",
			/*-------------------武器牌-------------------*/
			"gezi_bagua_skill": "八卦炉MK",
			"gezi_bagua_skill_info": "",
			"bailou_skill": "白楼剑",
			"bailou_skill_info": "",
			"deathfan_skill": "凤蝶纹扇",
			"deathfan_skill_info": "",
			"gungnir_skill": "冈格尼尔",
			"gungnir_skill_info": "",
			"hakkero_skill": "八卦炉",
			"hakkero_skill_info": "",
			"hakkero_skill2": "八卦炉",
			"laevatein_skill": "魔剑莱瓦丁（计数）",
			"laevatein_skill_info": "",
			"laevatein3": "魔剑莱瓦丁",
			"laevatein3_info": "",
			"louguan_skill": "楼观剑",
			"louguan_skill_info": "",
			"gezi_missile_skill": "魔法飞弹",
			"gezi_missile_skill_info": "",
			"gezi_missile_count": "魔法飞弹",
			"gezi_missile_count_info": "",
			"gezi_missile_ready": "魔法飞弹",
			"gezi_missile_ready_info": "",
			"gezi_needle_skill": "封魔针",
			"gezi_needle_skill_info": "",
			"gezi_needle_2": "封魔针",
			"gezi_needle_2_info": "",
			"windfan_skill": "风神团扇",
			"windfan_skill_info": "",
			"gezi_wuqingqumobang":"无情驱魔棒",
			"gezi_wuqingqumobang_info":"",
			"gezi_yinyangfeiniao":"阴阳飞鸟井",
			"gezi_yinyangfeiniao_info":"",
			"gezi_yinyangyuguishen_skill": "鬼神阴阳玉",
			"gezi_yinyangyuguishen_skill2": "鬼神阴阳玉",
			"gezi_yinyangyuguishen_skill_info": "",
			"gezi_yinyangyuguishen_skill2_info": "",
			"gezi_yinyangyuguishen_duang": "鬼神阴阳玉",
			"gezi_yinyangyuguishen_duang_info": "",
			"zhiyuu_skill": "净颇梨之镜",
			"zhiyuu_skill_info": "",
			"stg_goldbook_skill": "金魔导书",
			"stg_goldbook_skill_info": "",
			"goldbook1": "金魔导书",
			"goldbook1_info": "",
			/*-------------------防具牌-------------------*/
			"hourai_skill": "替身人形",
			"hourai_skill_info": "",
			"lantern_skill": "人魂灯",
			"lantern_skill_info": "",
			"mirror_skill": "八咫镜",
			"mirror_skill_info": "",
			"yinyangyu_skill_1": "阴阳玉（闪）",
			"yinyangyu_skill_1_info": "",
			"yinyangyu_skill_2": "阴阳玉（杀）",
			"yinyangyu_skill_2_info": "",
			"stg_waterbook_skill": "水魔导书",
			"stg_waterbook_skill_info": "",
			"waterbook1": "水魔导书",
			"waterbook1_info": "",
			/*-------------------防御马-------------------*/
			"frog_skill": "冰镇青蛙",
			"frog_skill_info": "",
			"stg_dirtbook_skill": "土魔导书",
			"stg_dirtbook_skill_info": "",
			/*-------------------进攻马-------------------*/
			"lunadial_skill": "月时针",
			"lunadial_skill_info": "",
			"lunadial2": "月时针",
			"lunadial2_info": "",
			"stg_woodbook_skill": "木魔导书",
			"stg_woodbook_skill_info": "",
			"woodbook1": "木魔导书",
			"woodbook1_info": "",
			/*-------------------宝物牌-------------------*/
			"book_skill": "魔导书",
			"book_skill_info": "",
			"houraiyuzhi_skill": "蓬莱玉枝",
			"houraiyuzhi_skill_info": "",
			"houraiyuzhi_skill2": "蓬莱玉枝",
			"houraiyuzhi_skill2_info": "",
			"ibuki_skill": "伊吹瓢",
			"ibuki_skill_info": "",
			"pantsu_skill": "蓝白胖次",
			"pantsu_skill_info": "",
			"pantsu_skill2": "蓝白胖次",
			"pantsu_skill2_info": "",
			"saiqian_skill": "赛钱箱",
			"saiqian_skill_info": "",
			"saiqian_skill2": "赛钱箱",
			"saiqian_skill2_info": "",
			"saiqian_skill3": "例大祭",
			"saiqian_skill3_info": "",
			"stone_skill": "贤者之石",
			"stone_skill_info": "",
			"stg_deck_skill": "魔术卡片",
			"stg_deck_skill_info": "",
			"stg_firebook_skill": "火魔导书",
			"stg_firebook_skill_info": "",
			"firebook1": "火魔导书",
			"firebook1_info": "",
			/*-------------------禁忌牌-------------------*/
			"_bingyu": "冰域之宴",
			"_bingyu_info": "",
			"bingyu1": "冰域之宴",
			"bingyu1_info": "",
			"bingyu2": "冰域之宴",
			"bingyu2_info": "",
			"_gezi_dianche": "废线电车（给牌）",
			"_huanxiang": "幻想之扉",
			"_huanxiang_info": "",
			"huazhi_skill": "花之祝福",
			"huazhi_skill_info": "",
			"_jingxia": "惊吓派对",
			"_jingxia_info": "",
			"lingbi1": "令避之间",
			"lingbi1_info": "",
			"lingbi2": "令避之间",
			"lingbi2_info": "",
			"_lingbi": "令避之间",
			"_lingbi_info": "",
			"_lingbi2": "令避之间",
			"_lingbi2_info": "",
			"_gezi_shenlin": "神灵复苏（护盾）",
			"_gezi_shenlin_info": "弃置一张【神灵复苏】，免疫一切伤害，直到此回合结束。",
			"_simen": "死境之门",
			"_simen_info": "",
			"_tianguo": "天国之阶",
			"_tianguo_info": "",
			"_tianguo2": "天国之阶",
			"_tianguo2_info": "",
			"_zuiye": "罪业边狱",
			"_zuiye_info": "",
			"_gezi_zhunbei": "准备",
			"_gezi_zhunbei_info": "",
			/*-------------------异变牌-------------------*/
			"baka_normal": "笨蛋",
			"baka_normal_info": "",
			"baka_win": "笨蛋",
			"baka_win_info": "",
			"death_win":"皆杀",
			"death_win_info":"",
			"death_normal":"皆杀",
			"death_normal_info":"",
			"immaterial_normal": "萃梦",
			"immaterial_normal_info": "",
			"immaterial_win": "萃梦",
			"immaterial_win_info": "",
			"imperishable_normal": "永夜",
			"imperishable_normal_info": "",
			"imperishable_win": "永夜",
			"imperishable_win_info": "",
			"phantasmagoria_normal": "花映",
			"phantasmagoria_normal_info": "",
			"phantasmagoria_win": "花映",
			"phantasmagoria_win_info": "",
			"sakura_normal": "散樱",
			"sakura_normal_info": "",
			"sakura_win": "散樱",
			"sakura_win_info": "",
			"sb_normal": "文花",
			"sb_normal_info": "",
			"sb_win": "文花",
			"sb_win_info": "",
			"scarlet_normal": "红月",
			"scarlet_normal_info": "",
			"scarlet_normal2": "红月",
			"scarlet_normal2_info": "",
			"scarlet_win": "红月",
			"scarlet_win_info": "",
			/*-------------------技能牌-------------------*/
			"gezi_lianji_skill": "连击",
			"gezi_lianji_skill_info": "",
			"gezi_lingyong_skill": "灵涌",
			"gezi_lingyong_skill_info": "",
			"gezi_qianxing_skill": "潜行",
			"gezi_qianxing_skill_info": "",
			"gezi_qianxing_skill2": "潜行",
			"gezi_qianxing_skill2_info": "",
			"gezi_qianxing_skill3": "潜行",
			"gezi_qianxing_skill3_info": "",
			"shengdun_skill": "圣盾",
			"shengdun_skill_info": "",
			"shenyou_skill_1": "神佑",
			"shenyou_skill_1_info": "",
			"shenyou_skill_2": "神佑",
			"shenyou_skill_2_info": "",
			"ziheng_skill": "制衡",
			"ziheng_skill_info": "",
			"ziheng_skill_1": "制衡",
			"ziheng_skill_1_info": "",
			"gezi_firebook_skill": "火魔导书",
			"gezi_firebook_skill_info": "",
			"gezi_waterbook_skill": "水魔导书",
			"gezi_waterbook_skill_info": "",
			"gezi_woodbook_skill": "木魔导书",
			"gezi_woodbook_skill_info": "",
			"gezi_dirtbook_skill": "土魔导书",
			"gezi_dirtbook_skill_info": "",
			"gezi_goldbook_skill": "金魔导书",
			"gezi_goldbook_skill_info": "",
			"gezi_jinengpai_use": "技能使用",
			"gezi_jinengpai_use_info": "",
			"gezi_jinengpai_show": "技能展示",
			"gezi_jinengpai_show_info": "",
			"gezi_jinengpai_zhanshi": "技能牌",
			"gezi_jinengpai_zhanshi_info": "",
			/*-------------------主角-------------------*/
			//灵梦
			"gezi_yinyang": "阴阳",
			"gezi_yinyang_info": "一名角色的结束阶段，若你本回合使用过牌，或受到过伤害，你可以选择一项：<br><li>1，摸一张牌；<br><li>2，展示当前回合角色的一张牌，并将之置于牌堆底。<br><li>若你装备阴阳玉或灵力为满，可以选择两项。<br><li>进行选择后你获得一点灵力。",
			"gezi_yinyang2": "阴阳",
			"gezi_yinyang2_info": "",
			"gezi_mengdie": "梦蝶",
			"gezi_mengdie_info": "觉醒技，准备阶段，若你的手牌数不大于你已受伤值，你将灵力补满，并获得技能〖幻视〗",
			"gezi_mengxiang": "梦想",
			"gezi_mengxiang_info": "符卡技3(永续)<br><li>你的回合开始时，可以消耗三点灵力发动符卡技，直到你的下个回合开始。<br><li>你使用牌指定目标后，可以选择一项：令目标角色：受到1点雷电伤害；自弃一张牌。<br><li>若你持有异变牌，改为选择两项。",
			"gezi_mengxiang1": "梦想封印",
			"gezi_mengxiang1_info": "",
			"gezi_huanjinglili": "幻境",
			"gezi_huanjinglili_info": "一名角色的准备阶段开始时，你可以弃置一张牌，然后展示牌堆底的一张牌；<br><li>若该角色可以成为该牌的目标，将之对其使用；<br><li>若为装备牌，将之置于其装备区内；否则，弃置之。",
			//魔理沙
			"gezi_liuxing": "流星",
			"gezi_liuxing_info": "摸牌阶段，你可以少摸至少一张牌并获得等量灵力，令你本回合的攻击范围+X（X为以此法少摸的牌数）；<br><li>若如此做，结束阶段，你获得一点灵力并视为使用一张无视距离的【顺手牵羊】。",
			"gezi_liuxing_shun": "流星（顺手牵羊）",
			"gezi_liuxing_shun_info": "",
			"gezi_xingchen": "星尘",
			"gezi_xingchen_info": "若你的手牌数等于体力值：你可以将一张手牌当作【杀】使用/打出；<br><li>你手牌等于体力值时使用的【杀】不计次数。",
			"gezi_xingchen_2": "星尘",
			"gezi_xingchen_2_info": "",
			"gezi_stardust": "星屑",
			"gezi_stardust_info": "符卡技X<br><li>你的回合开始时，你可以消耗X点灵力值（X为任意值且至少为1）,发动符卡技。<br><li>本回合限一次，你使用一张牌时，可以无视距离限制指定X名合法的额外目标，当你使用牌指定多于1个目标时，取消此效果。",
			"gezi_stardust1": "星屑幻想",
			"gezi_stardust1_info": "",
			/*-------------------红月-------------------*/
			//芙兰
			"gezi_kuangyan": "狂宴",
			"gezi_kuangyan_info": "出牌阶段开始时，或你受到伤害后，你可以获得一点灵力并弃置攻击范围内的所有其他角色区域内各一张牌；<br><li>然后，对其中没有手牌的角色各造成1点伤害；<br><li>你发动此技能后，此技能改为锁定技，直到一名角色死亡。<br><li>若你装备了魔剑莱瓦丁，你可以选择是否发动。",
			"gezi_jiesha": "皆杀",
			"gezi_jiesha_info": "符卡技X(永续)<br><li>你的回合开始时，可以消耗X点灵力发动符卡技，直到你的下个回合开始。(X为你当前体力值)<br><li>永久效果：你的攻击范围+2。<br><li>符卡效果：你造成伤害时，封印目标非锁定技直到当前回合结束。<br><li>若目标已被封印，你需选择一项：令受伤角色：<br><li>1.扣减1点体力上限，直到你死亡；<br><li>2. 弃置一个有牌的区域内所有牌；<br><li>3.将灵力调整至1。",
			"gezi_jiesha2": "皆杀",
			"gezi_jiesha2_info": "",
			"gezi_jiesha3": "皆杀",
			"gezi_jiesha3_info": "",
			"gezi_jiesha4": "皆杀",
			"gezi_jiesha4_info": "",
			//小恶魔
			"gezi_qishu": "奇术",
			"gezi_qishu_info": "准备阶段，你可以选择摸牌阶段、出牌阶段、弃牌阶段中的一个阶段并获得一点灵力，然后指定一名其他角色；<br><li>若如此做，你此回合跳过该阶段，你的回合结束后，该角色获得1点灵力，并进行一个以此法跳过的阶段。",
			"gezi_qishu2": "奇术",
			"gezi_qishu2_info": "",
			"gezi_anye": "暗夜",
			"gezi_anye_info": "锁定技，你的回合外，你成为普通锦囊牌的目标后（无懈可击除外），若你本回合在此牌前成为过牌的目标且已结算完成，该牌对你无效。",
			//美铃
			"gezi_xingmai": "星脉",
			"gezi_xingmai_info": "你可以将一张【杀】当作一种基本牌使用；然后，调换描述中一张【杀】与一种基本牌的位置。",
			"gezi_xingmai2": "星脉",
			"gezi_xingmai2_info": "你可以将一种基本牌当作一张【杀】使用或打出；然后，调换描述中一张【杀】与一种基本牌的位置。",
			"gezi_dizhuan": "地转",
			"gezi_dizhuan_info": "你攻击范围内的一名其他角色成为【杀】的目标时，若目标不包括你，你可以交给目标你的区域内一张牌，然后将目标转移给你。<br><li>你受到【杀】造成的伤害后，获得1点灵力。",
			"gezi_dizhuan2": "地转",
			"gezi_dizhuan2_info": "",
			"gezi_jicai": "极彩",
			"gezi_jicai_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>效果：你使用/打出牌时，可以弃置一名角色区域内一张牌；若该牌颜色与使用/打出的牌颜色相同，其摸一张牌。",
			"gezi_jicai2": "极彩风暴",
			"gezi_jicai2_info": "",
			//帕秋莉
			"gezi_qiyao": "七曜",
			"gezi_qiyao_info": "准备阶段，你可以选择任意项：<br><li>1，消耗一点灵力跳过弃牌阶段，获得一张【贤者之石】；<br><li>2，跳过摸牌阶段，视为使用一张非延时锦囊牌；<br><li>3，跳过出牌阶段，使用一张锦囊牌或一张牌当作非延时锦囊牌使用。",
			"gezi_qiyao2": "七曜",
			"gezi_qiyao2_info": "",
			"gezi_qiyao3": "七曜",
			"gezi_qiyao3_info": "",
			"gezi_riyin": "日阴",
			"gezi_riyin_info": "",
			"gezi_riyin2": "日阴",
			"gezi_riyin2_info": "一名角色使用普通锦囊牌后，若该牌的所有目标本回合内都已成为过卡牌的目标且已结算完成，你可以将一张牌当作【无懈可击】使用并获得一点灵力，直到当前回合结束。",
			"gezi_xianzhe": "贤者",
			"gezi_xianzhe_info": "符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到当前回合结束。<br><li>效果：你使用非延时锦囊牌结束时，若该牌指定的所有目标在本回合内均已成为过卡牌的目标，该牌额外结算一次（不会重复结算【无懈可击】）。",
			"gezi_xianzhe2": "贤者之石",
			"gezi_xianzhe2_info": "",
			//蕾米
			"gezi_miingyunleimi": "命运",
			"gezi_miingyunleimi_info": "出牌阶段开始时，或你受到伤害后，你可以摸X张牌且获得一点灵力，并将等量牌置于牌堆顶（X为你的攻击范围）；<br><li>然后，直到结束阶段：一名角色使用非装备牌指定目标后，若该牌不是以此技能使用，其取消一个目标并判定。<br><li>若判定牌可以对目标使用（无视距离和次数限制），其将判定牌对目标使用<br><li>若你装备冈格尼尔，你不会进行目标判定。",
			"gezi_mingyunleimi2": "命运",
			"gezi_mingyunleimi2_info": "",
			"gezi_hongmo": "红魔",
			"gezi_hongmo_info": "觉醒技，准备阶段开始时，若你体力不大于一，且你没有装备武器牌，你减一点体力上限，获得技能【神枪】。",
			"gezi_gungirs": "神枪",
			"gezi_gungirs_info": "锁定技，你创造并装备一张【冈格尼尔】。<br><li>当你失去此装备时，销毁之，然后创造并装备一张【冈格尼尔】。<br><li>当你不因此技能装备武器前，取消之，改为获得其武器技能。",
			"gezi_gungirs2": "神枪",
			"gezi_gungirs2_info": "",
			"gezi_feise": "绯色",
			"gezi_feise_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>效果：其他角色的结束阶段，若其对其以外的角色使用过牌，你可以消耗1点灵力，对其造成1点伤害。",
			"gezi_feise2": "绯色幻想乡",
			"gezi_feise2_info": "",
			"gezi_feise3": "绯色",
			"gezi_feise3_info": "",
			"gezi_feise4": "绯色",
			"gezi_feise4_info": "",
			//露米娅
			"gezi_heiguan": "黑棺",
			"gezi_heiguan_info": "出牌阶段开始时，你可以与相邻的角色依次拼点。<br><li>若你赢，你获得一点灵力，视为对其使用一张【杀】；<br><li>否则，你选择一项：取消其他目标并摸等同其他目标数量的牌，结束出牌阶段与弃牌阶段，或消耗1点灵力。",
			"gezi_yuezhi": "月暗",
			"gezi_yuezhi_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>你攻击范围内的所有其他角色的攻击范围视为0。",
			"gezi_yuezhi2": "月之阴暗面",
			"gezi_yuezhi2_info": "",
			"gezi_yuezhi3": "月暗",
			"gezi_yuezhi3_info": "",
			//咲夜
			"gezi_huanzang": "幻葬",
			"gezi_huanzang_info": "你成为其他角色的卡牌的唯一目标后，或其他角色于你的回合内使用卡牌指定目标后，你可以将一张花色或点数相同的牌置于弃牌堆，令该牌对目标无效，然后你获得一点灵力。",
			"gezi_huanzang_1": "幻葬",
			"gezi_huanzang_1_info": "",
			"gezi_shijing": "时静",
			"gezi_shijing_info": "结束阶段，你可以获得本回合进入弃牌堆的牌，直到你的手牌数等于3（若你装备了月时针，则改为4）。",
			"gezi_shijing_mark": "时静",
			"gezi_shijing_mark_info": "",
			"gezi_shijing_mark2": "时静",
			"gezi_shijing_mark2_info": "",
			"gezi_shijing_mark3": "时静",
			"gezi_shijing_mark3_info": "",
			"gezi_shijing_mark4": "时静",
			"gezi_shijing_mark4_info": "",
			"gezi_world": "世界",
			"gezi_world_info": "符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到你的下个回合开始。<br><li>效果：一回合一次，当前回合角色使用带有伤害标签的牌指定目标时，你可以消耗1点灵力（装备月时针则不消耗），取消目标，并获得一名角色的一张牌，然后你可以使用获得牌。",
			"gezi_world_skill": "咲夜的世界",
			"gezi_world_skill_info": "",
			/*-------------------散樱-------------------*/
			//爱丽丝
			"gezi_huanfa": "幻法",
			"gezi_huanfa_bg": "手",
			"gezi_huanfa_info": "弃牌阶段开始时，若“手办”数小于场上角色数，你可以将一至两张手牌扣置于角色牌上，称为“手办”，并摸等量张牌，获得等量灵力。",
			"gezi_mocai": "魔彩",
			"gezi_mocai_info": "你攻击范围内的一名角色成为卡牌的目标后，你可以选择一项：<br><li>1，将一张“手办”交给一名角色，若此牌为装备牌，你可以置于其手牌区或装备区内；<br><li>2，弃置一张“手办”，观看牌堆顶的三张牌，并将其中一张交给目标。",
			"gezi_hanghourai": "蓬莱",
			"gezi_hanghourai1": "蓬莱人形",
			"gezi_hanghourai_info": "符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力，将任意张手牌扣置为“手办”，并摸等量牌，然后发动符卡，直到你的下个回合开始。<br><li>一名角色的结束阶段，你可以交给其一张“手办”；<br><li>若其可以使用该牌，你可以令其使用之，目标由你指定。",
			//橙
			"gezi_mingdong": "鸣动",
			"gezi_mingdong2": "鸣动",
			"gezi_mingdong_info": "一回合一次，你成为牌的目标后，你可以声明一种基本牌,你可以将普通锦囊牌当作该牌使用或打出，直到回合结束。",
			"gezi_shihuo": "式获",
			"gezi_shihuo_info": "一回合一次，你摸牌后，可以令一名角色摸一张牌并获得一点灵力。",
			"gezi_shuanggui": "双鬼",
			"gezi_shuanggui2": "青鬼赤鬼",
			"gezi_shuanggui2_info": "双鬼",
			"gezi_shuanggui3": "双鬼",
			"gezi_shuanggui4": "双鬼",
			"gezi_shuanggui5": "双鬼",
			"gezi_shuanggui_info": "符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，你指定一名其他角色，与其各摸一张牌；<br><li>该角色需要使用或打出基本牌时，可以使用或打出你的手牌，直到其回合结束。",
			//蕾蒂
			"gezi_shuangjiang": "霜降",
			"gezi_shuangjiang_info": "结束阶段，你可以对本回合成为过牌的目标，且没有使用/打出过牌的一名角色造成1点雷电伤害，然后你获得一点灵力。",
			"gezi_shuangjiang2": "霜降",
			"gezi_shuangjiang2_info": "",
			"gezi_shuangjiang3": "霜降",
			"gezi_shuangjiang3_info": "",
			"gezi_baofengxue": "暴风",
			"gezi_baofengxue2": "暴风雪之眼",
			"gezi_baofengxue3": "暴风雪之眼",
			"gezi_baofengxue_info": "符卡技1<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到当前回合结束。<br><li>你使用一张牌时，可以令其他角色不能使用/打出与之相同花色的牌；【霜降】中的“一名”视为“所有”",
			//莉莉白
			"gezi_chunxiao": "春晓",
			"gezi_chunxiao_info": "准备阶段，若你的灵力值不小于体力值（或灵力未定义），你可以令所有角色各摸一张牌，然后各弃置与其最近的一名角色一张牌。",
			"gezi_mengya": "萌芽",
			"gezi_mengya_info": "一回合两次，出牌阶段，你可以选择一项：<br><li>1，摸一张牌并获得1点灵力，然后弃置一张牌；<br><li>2，消耗1点灵力，然后摸两张牌。",
			//露娜萨
			"gezi_shenxuan": "神弦",
			"gezi_shenxuan_info": "一回合一次，出牌阶段，你可以记录一张与已记录牌均不同的手牌并获得一点灵力。<br><li>你攻击范围内的每名角色一回合一次，其可以将一张【杀】当作与你一张非装备记录手牌同名的牌使用。",
			"gezi_shenxuan_viewAs": "神弦（转化）",
			"gezi_zhenhun": "镇魂",
			"gezi_zhenhun_info": "一名角色的结束阶段，你可以选择一项：<br><li>1. 获得其本回合因弃置而进入弃牌堆的一张牌，并记录之；<br><li>2. 若当前回合角色不为你，将一张牌交给之。",
			"gezi_zhenhun_mark": "镇魂",
			"gezi_zhenhun_mark_info": "",
			"gezi_zhenhun_remove": "镇魂",
			"gezi_zhenhun_remove_info": "",
			"gezi_bianshenmingzhi2": "变身",
			"gezi_bianshenmingzhi2_info": "",
			"gezi_reshenxuan": "神弦",
			"gezi_reshenxuan_info": "一回合一次，出牌阶段，你可以明置一张手牌并获得一点灵力；每名角色一回合一次，其可以将一张【杀】当作与你一张非装备明置手牌同名的牌使用。",
			"gezi_reshenxuan_viewAs": "神弦（转化）",
			"gezi_rezhenhun": "镇魂",
			"gezi_rezhenhun_info": "一名角色的结束阶段，你可以选择一项：1. 获得其本回合因弃置而进入弃牌堆的一张牌，并明置之；2. 交给其一张明置牌。",
			"gezi_rezhenhun_mark": "镇魂",
			"gezi_rezhenhun_mark_info": "",
			"gezi_rezhenhun_remove": "镇魂",
			"gezi_rezhenhun_remove_info": "",
			"gezi_hezou": "合奏",
			"gezi_hezou_info": "符卡技1(瞬发)<br><li>你的回合开始时，或成为【杀】的目标时，可以消耗一点灵力发动符卡技，直到当前回合结束。<br><li>效果：你成为一张【杀】的目标时，可以选择一项：令之对你无效；或为之额外指定两名合法目标。",
			"gezi_hezou_2": "棱镜协奏曲",
			"gezi_hezou_2_info": "你可以消耗一点灵力发动符卡技，你成为一张【杀】的目标时，可以选择一项：令之对你无效；或为之额外指定两名合法目标。",
			"gezi_hezou_skill": "棱镜协奏曲",
			"gezi_hezou_skill_info": "",
			//莉莉卡
			"gezi_mingjian": "冥键",
			"gezi_mingjian_info": "出牌阶段，每种选项限一次，<br><li>1，你可以获得一点灵力展示一张未记录的手牌并记录为【冥键】，<br><li>2，将一张牌交给一名没有【冥键（伴奏）】的其他角色展示并记录为【冥键（伴奏）】，令其获得一点灵力；<br><li>如果你有【冥键】，所有有【冥键（伴奏）】的其他角色装备卡牌后你获得其装备技能，失去装备后你失去装备技能；<br><li>有【冥键（伴奏）】的其他角色在你装备卡牌后获得你的装备技能，失去装备后失去装备技能。<br><li>额外的，目标死亡对方不会失去装备技能。<br><li>该技能不会记录【木牛流马】。",
			"gezi_mingjian2": "冥键(给人)",
			"gezi_mingjian2_info": "",
			"gezi_mingjian3": "冥键",
			"gezi_mingjian3_info": "",
			"gezi_mingjian4": "冥键(伴奏)",
			"gezi_mingjian4_info": "",
			"gezi_huanzou": "幻奏",
			"gezi_huanzou_info": "一名有【冥键（伴奏）】的角色因使用，打出，或在自己回合内弃置而失去一张与【冥键（伴奏）】名称相同的牌时，你可以令其摸一张牌。",
			"gezi_huanzou2": "幻奏",
			"gezi_huanzou2_info": "",
			"gezi_bianshenmingzhi1": "变身",
			"gezi_bianshenmingzhi1_info": "",
			"gezi_remingjian": "冥键",
			"gezi_remingjian_info": "一回合各一次，出牌阶段，你可以明置一张手牌并获得一点灵力，或将一张牌交给一名其他角色并明置，令其获得一点灵力；<br><li>你视为拥有所有有明置手牌的其他角色的装备技能；有明置手牌的其他角色视为拥有你的装备技能。（不包括木牛牛马）",
			"gezi_remingjian2": "冥键（给别人）",
			"gezi_remingjian2_info": "",
			"gezi_remingjian3": "冥键",
			"gezi_remingjian3_info": "",
			"gezi_rehuanzou": "幻奏",
			"gezi_rehuanzou_info": "一名角色因使用，打出，或在自己回合内弃置而失去一张明置牌时，你可以令其摸一张牌。",
			"gezi_rehuanzou2": "幻奏",
			"gezi_rehuanzou2_info": "",
			//梅露兰
			"gezi_mingguan": "冥管",
			"gezi_mingguan_viewAs": "冥管（转化）",
			"gezi_mingguan_info": "一回合一次，出牌阶段，你可以记录一张手牌并获得一点灵力；<br><li>你攻击范围内的角色可以将与你的记录手牌同名的手牌当【杀】使用或打出。",
			"gezi_kuangxiang": "狂想",
			"gezi_kuangxiang_info": "一回合一次，体力不大于你的一名角色成为【杀】的目标时，你可以重铸你与其区域内各一张牌；<br><li>然后，若目标不包括你，将目标转移给你。",
			"gezi_bianshenmingzhi3": "变身",
			"gezi_bianshenmingzhi3_info": "",
			"gezi_remingguan": "冥管",
			"gezi_remingguan_info": "一回合一次，出牌阶段，你可以明置一张手牌并获得一点灵力；<br><li>你攻击范围内的角色的与你的明置手牌同名的手牌均不可使用或打出，除非将其当【杀】使用或打出。",
			"gezi_remingguan_viewAs": "冥管（转化）",
			"gezi_remingguan_viewAs_info": "",
			//蓝
			"gezi_jiubian": "九变",
			"gezi_jiubian_info": "你可以将一张普通锦囊牌当作【桃】，或将一张【桃】当作一种普通锦囊牌使用；<br><li>你以此法使用牌指定目标时，可以指定一名角色，将目标或来源改为其（目标需合法）。",
			"gezi_jiubian2": "九变（锦囊→桃）",
			"gezi_jiubian2_info": "",
			"gezi_jiubian3": "九变（变更目标/来源）",
			"gezi_jiubian3_info": "",
			"gezi_shiqu": "式取",
			"gezi_shiqu_info": "一回合一次，出牌阶段，你可以重铸一张牌并获得一点灵力，<br><li>若该牌价值大于0，你令一名角色从牌堆获得一张价值大于该牌的牌。<br><li>若目标不为你，直到你的准备阶段或对方的结束阶段，你或其需要失去体力时，可以改为由对方失去等量体力。",
			"gezi_shiqu2": "式取（py）",
			"gezi_shiqu2_info": "",
			"gezi_tianhugongzhu": "天狐",
			"gezi_tianhugongzhu_info": "准备阶段，你可以消耗一点灵力，指定一名已受伤的其它角色，与其各回复1点体力；<br><li>直到其回合结束阶段，该角色需要扣减灵力前，可以改为弃置等量的手牌。",
			"gezi_tianhugongzhu_1": "天狐公主",
			"gezi_tianhugongzhu_1_info": "",
			"gezi_tianhugongzhu_2": "天狐公主（氪血）",
			"gezi_tianhugongzhu_2_info": "",
			//妖梦
			"gezi_yishan": "一闪",
			"gezi_yishan_info": "一回合一次，你使用【杀】结算完毕后，你令一名其他角色摸一张牌，视为对其使用一张无视距离的【杀】（目标需合法）,结算完成后你获得一点灵力（无法获得改为摸一张牌）。",
			"gezi_yinhuashan": "樱闪",
			"gezi_yinhuashan_info": "符卡技1<br><li>你的回合开始时，可以消耗一点灵力，发动符卡直到当前回合结束。<br><li>你使用【杀】指定目标时，可以消耗1点灵力，并选择一项：额外指定一名目标角色，或重置【一闪】（令【一闪】本回合使用次数加一）。",
			"gezi_yinhuashan2": "六根清净斩",
			"gezi_yinhuashan2_info": "",
			"gezi_yinhuashan3": "樱闪",
			"gezi_yinhuashan3_info": "",
			//紫
			"gezi_huanjing": "幻境",
			"gezi_huanjing_info": "一名角色的准备阶段开始时，你可以弃置一张牌，然后展示牌堆底的一张牌；<br><li>若该角色可以成为该牌的目标，将之对其使用；若为装备牌，将之置于其装备区内；否则，弃置之。",
			"gezi_mengjie": "梦界",
			"gezi_mengjie_info": "出牌阶段开始时，或你成为带有伤害标签牌的目标后，你可以观看牌堆底的三张牌，并可以将其中任意张置于牌堆顶；<br><li>你获得一点灵力，若此时为回合外，你摸一张牌。",
			"gezi_mengjing": "梦境",
			"gezi_mengjing_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>你指定一名其他角色。<br><li>1，异变牌的胜利条件失效；<br><li>2，你与其以外的所有角色视为不在游戏内；<br><li>3,其非锁定技失效。",
			"gezi_mengjing2": "梦境诅咒",
			"gezi_mengjing2_info": "",
			//幽幽子
			"gezi_youdie": "幽蝶",
			"gezi_youdie_info": "结束阶段，你可以弃置一张牌，获得一点灵力，令体力大于0的其他角色中所有体力值最低(或之一)的所有角色各失去1点体力。",
			"gezi_youdie2": "幽蝶",
			"gezi_youdie2_info": "",
			"gezi_moyin": "墨樱",
			"gezi_moyin_info": "一名角色进入濒死状态时，你可以令至多X名角色各摸一张牌（X为你已受伤值加1）；<br><li>若如此做，一回合一次，你可以发动一次【幽蝶】。（仍需弃牌）",
			"gezi_moyin2": "墨樱",
			"gezi_moyin2_bg": "死",
			"gezi_moyin3": "墨樱",
			"gezi_moyin3_info": "",
			"gezi_moyin4": "墨樱",
			"gezi_moyin4_info": "",
			"gezi_fanhundie": "反魂",
			"gezi_fanhundie_die": "反魂",
			"gezi_fanhundie2": "反魂蝶",
			"gezi_fanhundie_info": "",
			"gezi_fanhundie_die_info": "符卡技1(终语)<br><li>你的回合开始时，或你进入濒死时，可以消耗一点灵力发动符卡技，直到没有灵力或当前回合结束。符卡结束时，若体力不大于0，你进入濒死。<br><li>符卡持续时，你不会死亡<br><li>当前回合的结束阶段，你需弃置一名角色的一张牌，其以此法失去最后的手牌后，其流失1点体力<br><li>然后你须消耗1点灵力并重复此流程，直到灵力为1，或重复第X次（X为你已受伤值）。",
			/*-------------------永夜-------------------*/
			//永琳
			"gezi_zhaixing": "摘星",
			"gezi_zhaixing_info": "结束阶段，你可以选择一项：<br><li>1，观看牌堆顶的X张牌（X为你本回合使用的牌花色数），将其中一张交给一名角色，其余按任意顺序置于该牌堆顶或底。<br><li>2，观看三张技能牌并令一名角色贴上其中一张。<br><li>本回合你每使用一种不同的花色牌，获得一点灵力。",
			"gezi_zhaixing_mark": "摘星",
			"gezi_zhaixing_mark_info": "",
			"gezi_zhaixing_remove": "摘星",
			"gezi_zhaixing_remove_info": "",
			"gezi_lanyue": "揽月",
			"gezi_lanyue_info": "一回合一次，出牌阶段，你可以令攻击范围内离你最远的一名角色选择：体力值或卡牌数量中与你不同的一项，然后将该项调整至与你相同。",
			"gezi_tianwen": "天文",
			"gezi_tianwen_info": "符卡技X<br><li>你的回合开始时，你可以消耗X点灵力值（X为任意值且至少为1）,发动符卡技。<br><li>你观看牌堆顶两倍数量的牌，以任意顺序置于牌堆顶，然后进行两次判定：<br><li>你获得其中一张，使用该牌后，若另一张效果能对所有指定的目标使用，可以视为你使用了一张与另一张效果相同的牌，直到回合结束。",
			"gezi_tianwen_skill": "天文秘葬法",
			"gezi_tianwen_skill_info": "",
			"gezi_tianwen_use": "天文秘葬法",
			"gezi_tianwen_use_info": "",
			"gezi_tianwen_nodo": "天文",
			"gezi_tianwen_nodo_info": "",
			//辉夜
			"gezi_nanti": "难题",
			"gezi_nanti_info": "一回合一次，出牌阶段，你可以展示任意张手牌，并声明一项：牌名的字数，花色，点数，属性，或颜色，然后令一名其他角色选择一项：<br><li>1，交给你一张该项与你展示的牌均不同的牌，然后你将展示的牌置于弃牌堆；<br><li>2，令你重铸其与展示的牌等量张牌，并对其造成1点雷电伤害。",
			"gezi_poxiao": "破晓",
			"gezi_poxiao_info": "结束阶段，你可以重铸任意张牌并获得1点灵力；<br><li>若你以此法重铸了4张不同花色的牌，你获得1点灵力并进行一个额外的回合。",
			"gezi_poxiao_2": "破晓",
			"gezi_poxiao_2_info": "",
			"gezi_yongye": "永夜",
			"gezi_yongye_info": "",
			"gezi_yongye_die": "永夜",
			"gezi_yongye_die_info": "符卡技1(极意)(终语)<br><li>你的回合开始时，或你进入濒死时，可以消耗一点灵力发动符卡技，直到你没有灵力。符卡结束时，你死亡。<br><li>符卡效果：你不会死亡；<br><li>你每扣减1点体力，若体力不大于0，失去等量的灵力；<br><li>回合结束时，你失去一点灵力；<br><li>若你的灵力值不大于：3，出牌阶段开始时，你可以重铸所有牌；2，准备阶段，你摸2张牌；1，你使用一张牌后，摸一张牌。",
			"gezi_yongye1": "永夜归返",
			"gezi_yongye1_info": "",
			"gezi_yongye2": "永夜归返",
			"gezi_yongye2_info": "",
			"gezi_yongye3": "永夜归返",
			"gezi_yongye3_info": "",
			"gezi_yongye4": "永夜归返",
			"gezi_yongye4_info": "",
			"gezi_yongye5": "永夜",
			"gezi_yongye5_info": "",
			//慧音
			"gezi_jiehuo": "解惑",
			"gezi_jiehuo_info": "一回合一次，一名角色的出牌阶段，一张牌因你使用/打出进入弃牌堆时，你可以令一名角色获得之，然后你获得一点灵力。",
			"gezi_richuguo": "日出",
			"gezi_richuguo_info": "符卡技3(限定)(永续)<br><li>你的回合开始时，可以消耗三点灵力，或弃置三种不同类型的牌各一张，发动符卡技，符卡技持续到你的下个回合开始。<br><li>效果：指定一名角色，重置其体力值，灵力值，将手牌补至四张；<br>在符卡状态，你进入濒死状态后，重置此技能。",
			"gezi_richuguo2": "日出国天子",
			"gezi_richuguo2_info": "",
			//妹红
			"gezi_yuhuo": "狱火",
			"gezi_yuhuo_info": "一回合X次，你可以将一张与本回合使用并指定目标后的【杀】花色均不同的牌当作【杀】使用（X为你已损失体力值）；<br><li>你以此法使用【杀】指定目标前，获得一点灵力并令之不计入次数限制。",
			"gezi_yuhuo_2": "狱火",
			"gezi_yuhuo_2_info": "",
			"gezi_businiao": "不死鸟之羽",
			"gezi_businiao_info": "",
			"gezi_businiao_die": "不死",
			"gezi_businiao_die_info": "符卡技1(终语)<br><li>你的回合开始时，或你进入濒死时，可以消耗一点灵力发动符卡技，直到没有灵力或当前回合结束。<br><li>符卡效果：你不死亡；<br><li>你每扣减1点体力，若体力不大于0，失去等量的灵力；<br><li>当前回合的结束阶段，你可以使用一张【杀】并消耗一点灵力；<br><li>你可以重复此流程任意次直到你没有灵力值；<br><li>然后，你须消耗所有灵力，将体力回复至1，并将手牌补至3张。",
			"gezi_businiao2": "不死鸟之羽",
			"gezi_businiao2_info": "",
			"gezi_businiao3": "不死",
			"gezi_businiao3_info": "",
			//米斯蒂娅
			"gezi_shiming": "失明",
			"gezi_shiming_info": "准备阶段，或你受到伤害后，你可以获得一点灵力，然后令一名角色获得以下效果，直到当前回合结束：<br><li>其不能以此技能以外的方式使用牌；<br><li>其需要使用牌时，可以洗混其手牌；<br><li>其不能查看其中暗置牌；<br><li>其展示其中一张：若可以使用，本次结算中其可以使用该牌；否则，其弃置之，并可以重复此流程。",
			"gezi_shiming_2": "失明",
			"gezi_shiming_2_info": "",
			"gezi_shiming_3": "失明",
			"gezi_shiming_3_info": "",
			"gezi_shiming_4": "失明",
			"gezi_shiming_4_info": "",
			"gezi_wuye": "午夜",
			"gezi_wuye_info": "符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到你的下个回合开始。<br><li>效果：你成为攻击范围内的角色的带有伤害标签牌的目标时，你可以消耗一点灵力并指定一名该角色可以使用此牌的其他角色，将目标转移给其。",
			"gezi_wuye2": "午夜合唱",
			"gezi_wuye2_info": "",
			//铃仙
			"gezi_huanshi": "幻视",
			"gezi_huanshi_info": "一回合每名角色限一次，出牌阶段，你可以扣置一张手牌，视为对一名角色使用了一张本局未以此法声明的普通锦囊牌，<br><li>若声明牌名后未使用（声明牌名后你获得一点灵力），你获得一张同名牌，且本回合无法使用此技能。<br><li>指定的目标成为该牌目标后，可将一张牌置于弃牌堆，并声明一种基本牌，令扣置牌无效且你亮出之。<br><li>若你扣置的牌与置于弃牌堆的牌花色不同，则你对其使用扣置牌，否则其获得一张其声明的牌。<br><li>若声明的牌名大于10，回合结束后会重置牌名。",
			"gezi_huanshi_2": "幻视",
			"gezi_huanshi_2_info": "",
			"gezi_huanshi_3": "幻视",
			"gezi_huanshi_3_info": "",
			"gezi_huanshi_4": "幻视",
			"gezi_huanshi_4_info": "",
			"gezi_huanshi_5": "幻视",
			"gezi_huanshi_5_info": "",
			"gezi_zhenshi": "真实",
			"gezi_zhenshi_info": "符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到你的下个回合开始。<br><li>你攻击范围内角色成为带有伤害标签的牌的唯一目标时，你可以消耗一点灵力并将一张牌置于弃牌堆，<br><li>然后将包括其的至多3名角色牌扣置并洗混；来源明置一张，然后将目标转移给明置的角色；然后将这些牌调整为原状态。",
			"gezi_zhenshi_1": "真实之月",
			"gezi_zhenshi_1_info": "",
			//帝
			"gezi_kaiyun": "开运",
			"gezi_kaiyun_info": "一名角色的出牌阶段结束时，若你和其之外的存活角色未成为过卡牌的目标，<br><li>其可以交给你一张牌，你可以使用'神佑（挖坑)'，然后其贴上一张【神佑】技能牌。",
			"gezi_kaiyun1": "开运",
			"gezi_kaiyun1_info": "一名角色的出牌阶段开始时，其可以交给你一张牌，<br><li>然后其贴上一张【神佑】技能牌，且其不能对你或其以外的角色使用牌，直到回合结束。",
			"gezi_kaiyun_1": "开运",
			"gezi_kaiyun_1_info": "",
			"gezi_kaiyun_3": "开运",
			"gezi_kaiyun_3_info": "",
			"gezi_kaiyun_4": "开运",
			"gezi_kaiyun_4_info": "",
			"gezi_mitu": "迷途",
			"gezi_mitu_info": "<挖坑>弃牌阶段开始时，你摸一张牌，然后可以将一张手牌扣置于角色牌上并获得一点灵力，称为'坑'。<br><li>你攻击范围内的一名角色成为牌的目标后，你可以展示同名或同花色'坑'，令来源判定；<br><li>若为黑色，弃置'坑'(若你已发动【远古】则可以额外发动一次【迷途（挖坑）】)，弃置来源一张牌，<br><li>且若目标为你，令该牌对你无效。",
			"gezi_mitu_storage": "迷途（挖坑）",
			"gezi_mitu_storage_info": "",
			"gezi_mitu_2": "迷途",
			"gezi_mitu_2_info": "",
			"gezi_mitu_3": "迷途",
			"gezi_mitu_3_info": "",
			"gezi_mitu2": "迷途",
			"gezi_mitu2_info": "弃牌阶段开始时，若你没有“伏”，你可以将一张牌扣置于角色牌上并获得一点灵力，称为“伏”；<br><li>你攻击范围内的一名角色成为牌的目标后，你可以展示同名“伏”，令来源判定；<br><li>若为黑色，弃置“伏”（若你已发动远古则无需弃置），弃置来源一张牌，且若目标为你，令该牌对你无效。",
			"gezi_mitu2_storage": "迷途（挖坑）",
			"gezi_mitu2_storage_info": "",
			"gezi_yuangu": "远古",
			"gezi_yuangu_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>一名角色的判定牌生效前，你可以打出一张牌替换之。",
			"gezi_yuangu_1": "远古骗术",
			"gezi_yuangu_1_info": "",
			"gezi_bianshentewi": "变身",
			"gezi_bianshentewi_info": "",
			//莉格露
			"gezi_yingguang": "萤光",
			"gezi_yingguang_info": "一回合一次，你使用牌后，可以展示一张技能牌并获得一点灵力，然后令一名角色贴上。",
			"gezi_yechong": "夜虫",
			"gezi_yechong_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>【萤光】中的“一回合一次”改为“一回合三次”；<br><li>准备阶段，你弃置有牌的所有其他角色一张牌或移除其一张技能牌；然后，对所有以此法移除技能牌，且手牌区和装备区牌数不小于你的角色造成1点雷电伤害。",
			"gezi_yechong1": "夜虫风暴",
			"gezi_yechong1_info": "",
			/*-------------------萃梦-------------------*/
			//萃香
			"gezi_cuiji": "萃集",
			"gezi_cuiji_info": "准备阶段，或你造成伤害后，你可以选择一项：<br><li>1. 失去1点体力，然后获得2点灵力；<br><li>2. 消耗2点灵力值，然后回复1点体力。<br><li>若你的灵力大于体力（或灵力未定义），一回合一次，你可以将一张黑色牌当作【杀】使用/打出。<br><li>你以此法使用的【杀】指定目标前本回合出【杀】次数+1。",
			"gezi_cuiji_buff": "萃集",
			"gezi_cuiji_buff_info": "",
			"gezi_cuiji_2": "萃集",
			"gezi_cuiji_2_info": "",
			"gezi_baigui": "百鬼",
			"gezi_baigui_info": "符卡技0<br><li>你的回合开始时，可以发动符卡技，直到当前回合结束。<br><li>效果：锁定技，你使用【杀】指定目标后，该【杀】额外需要X张【闪】才能抵消（X为你当前体力值）；<br><li>你的【杀】造成伤害时，你须将灵力调整至一点，若消耗了灵力，则依次弃置受伤角色Y张牌 ，目标无牌改为你依次摸剩余数量的牌（Y为你消耗的灵力值）。",
			"gezi_baigui1": "百鬼夜行",
			"gezi_baigui1_info": "",
			"gezi_baigui2": "百鬼",
			"gezi_baigui2_info": "",
			/*-------------------笨蛋-------------------*/
			//琪露诺
			"gezi_jidong": "急冻",
			"gezi_jidong_info": "锁定技，准备阶段，你可以展示一名角色的一张牌。<br><li>其不能使用/打出该牌，除非将之当作【杀】使用，直到你的结束阶段。",
			"gezi_jidong_2": "急冻",
			"gezi_jidong_2_info": "",
			"gezi_bingbi": "冰壁",
			"gezi_bingbi_info": "你成为一名角色的【杀】的目标后，可以打出一张【杀】，令之对你无效；<br><li>然后你摸X张牌（X为其本回合对你使用的牌数量）并获得一点灵力。",
			"gezi_dongjie": "冻结",
			"gezi_dongjie_info": "符卡技3(永续)<br><li>你的回合开始时，可以消耗三点灵力发动符卡技，直到你的下个回合开始。<br><li>效果：所有角色的所有手牌不能使用/打出，除非将一张手牌当作【杀】使用或打出。",
			"gezi_dongjie2": "完美冻结",
			"gezi_dongjie2_info": "",
			"gezi_dongjie3": "冻结",
			"gezi_dongjie3_info": "",
			//大妖精
			"gezi_zhufu": "祝福",
			"gezi_zhufu_info": "一回合一次，出牌阶段，你可以消耗1点灵力（灵力值未定义则不消耗），令一名体力值不大于你的角色回复1点体力。然后若你没有灵力，将灵力补至当前体力值。",
			"gezi_zhufu2": "祝福",
			"gezi_zhufu2_info": "",
			"gezi_zhufu3": "祝福",
			"gezi_zhufu3_info": "",
			"gezi_zhiyue": "织月",
			"gezi_zhiyue_info": "一回合一次，出牌阶段，你可以交给一名其他角色一张牌；然后，你可以消耗任意点灵力，摸1+X张牌。（X为你消耗的灵力值）。<br><li>若你以此法获得至少2张牌且灵力消耗为1，令所有角色回复一点体力。",
			/*-------------------花映-------------------*/
			//映姬
			"gezi_huiwu": "悔悟",
			"gezi_huiwu_info": "锁定技，一名角色的回合结束时，其须重铸一张牌；<br><li>若其本回合造成过伤害，该牌由你指定。<br><li>以此法重铸牌后，其获得一点灵力。",
			"gezi_caijue": "裁决",
			"gezi_caijue_info": "准备阶段开始时，你可以展示一名角色的手牌：弃置其中所有【杀】，其失去等量灵力，<br><li>然后你对其造成1点雷电伤害；<br><li>若其中没有【杀】，【裁决】无效，直到你受到伤害后。",
			"gezi_caijue2": "裁决",
			"gezi_caijue2_info": "",
			"gezi_shenpan": "审判",
			"gezi_shenpan_info": "符卡技X(限定)<br><li>限定技，你的回合开始时，你可以消耗X点灵力（X为你当前体力值）发动符卡，直到当前回合结束。<br><li>准备阶段，你视为使用一张【令避之间】。<br><li>结束阶段，你可以对场上体力最高或之一的角色造成１点雷电伤害，然后依次对卡牌数，手牌数，击杀数重复此流程。",
			"gezi_shenpan_1": "最终审判",
			"gezi_shenpan_1_info": "",
			//小町
			"gezi_guihang": "归航",
			"gezi_guihang_info": "一回合两次，你可以将一张牌当作无视距离的【杀】使用或打出并获得一点灵力。<br><li>你以此法使用的【杀】指定目标前本回合出【杀】次数+1。<br><li>以此法造成伤害后，你弃置受伤角色一张牌，令你与其距离视为１。<br><li>若受伤角色存活，则此技能无效，直到回合结束。",
			"gezi_guihang_cost": "归航",
			"gezi_guihang_cost_info": "",
			"gezi_guihang_2": "归航",
			"gezi_guihang_2_info": "",
			"gezi_guihang_flag": "归航",
			"gezi_guihang_flag_info": "",
			"gezi_wujian": "无间",
			"gezi_wujian_skill": "无间之狭间",
			"gezi_wujian_info": "符卡技X<br><li>你的回合开始时，可以消耗X点灵力（X为任意值且至少为1），直到当前回合结束。<br><li>一回合限X次，出牌阶段，你可以令攻击范围内的所有角色各失去1点灵力；<br><li>然后，若其中有角色灵力不大于2（或灵力未定义），你获得其区域内一张牌。<br><li>你以此法获得牌后，结束此符卡技，然后获得等同本回合未使用此技能次数的灵力值。",
			"gezi_wujian_skill2": "无间",
			"gezi_wujian_skill2_info": "",
			//莉莉黑
			"gezi_chunmian": "春眠",
			"gezi_chunmian_info": "准备阶段，若你的灵力值不大于体力值(或灵力未定义)，你可以令所有角色各弃置与其最近的一名角色一张牌；<br><li>然后，所有以此法失去牌的角色各摸一张牌。",
			"gezi_bamiao": "拔苗",
			"gezi_bamiao_info": "一回合两次，出牌阶段，你可以：获得1点灵力，然后重铸1张牌；或消耗1点灵力，然后摸2张牌。",
			//梅蒂欣
			"gezi_zaidu": "灾毒",
			"gezi_zaidu_info": "结束阶段，你可以指定一名体力不大于你的角色，对其造成1点伤害；<br><li>你造成伤害后，或回复体力后，获得1点灵力。",
			"gezi_zaidu2": "灾毒",
			"gezi_zaidu2_info": "",
			"gezi_zhanfang": "绽放",
			"gezi_zhanfang_info": "觉醒技，准备阶段，若你手牌大于体力值：<br><li>若你未受伤，将【灾毒】中的“对其造成1点伤害”改为“对其造成1点雷电伤害”；否则，改为“回复1点体力”；<br><li>然后，你增加１点体力上限。",
			"gezi_huayuan": "花园",
			"gezi_huayuan_info": "<u>若你体力为场上最高（或之一），你可以无视限制的使用此符卡的效果。</u>符卡技1(永续)<br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到你的下个回合开始。<br><li>一回合一次，一名角色回复体力时，你可以消耗1点灵力，令回复量-1或+1；一名角色的回复体力或受到伤害后，若体力为0，或为上限，你摸一张牌。",
			"gezi_huayuan_1": "毒气花园",
			"gezi_huayuan_2": "毒气花园",
			"gezi_huayuan_3": "毒气花园",
			"gezi_huayuan_3_info": "",
			//幽香
			"gezi_zanghua": "葬花",
			"gezi_zanghua_info": "出牌阶段，你可以与一名其他角色特殊拼点（拼点后双方各摸一张牌）；<br><li>赢的角色视为对输的角色使用了一张【决斗】；若平局，或其体力值小于你，此技能无效，你获得两点灵力，直到结束阶段。",
			"gezi_zanghua_boom": "葬花",
			"gezi_zanghua_boom_info": "",
			"gezi_xiaofeng": "啸风",
			"gezi_xiaofeng_info": "<u>若你的体力不大于2，消耗-2。</u>符卡技4<br><li>你的回合开始时，可以消耗四点灵力发动符卡技。<br><li>符卡发动时，视为使用一张【花之祝福】，然后符卡效果内，你获得以下效果：<br><li>你的攻击范围无限，你造成伤害时，该伤害+1，你拼点时的点数均视为Q。",
			"gezi_xiaofeng1": "啸风弄月",
			"gezi_xiaofeng1_info": "",
			"gezi_xiaofeng2": "啸风弄月",
			"gezi_xiaofeng2_info": "",
			/*-------------------文花-------------------*/
			//文
			"gezi_kuanglan": "狂岚",
			"gezi_kuanglan_info": "一名角色的结束阶段，你可以指定一名本回合内满足以下一项的其它角色：<br><li>1. 使用过基本牌；<br><li>2. 击杀过角色;<br><li> 3. 翻面过；<br><li>视为你对其使用一张【突击采访】。",
			"gezi_kuanglan_1": "狂岚",
			"gezi_kuanglan_1_info": "",
			"gezi_kuanglan_2": "狂岚",
			"gezi_kuanglan_2_info": "",
			"gezi_kuanglan_3": "狂岚",
			"gezi_kuanglan_3_info": "",
			"gezi_kuanglan_4": "狂岚",
			"gezi_kuanglan_4_info": "",
			"gezi_kuanglan_5": "狂岚",
			"gezi_kuanglan_5_info": "",
			"gezi_fengmi": "风靡",
			"gezi_fengmi_1": "幻想风靡",
			"gezi_fengmi_info": "符卡技0<br><li>你的回合开始时，你可以发动符卡直到当前回合结束。<br><li>你的摸牌/出牌/弃牌阶段开始前，可以消耗1点灵力，或跳过该阶段，然后视为使用一张【过河拆桥】。",
			//果
			"gezi_nianxie": "念写",
			"gezi_nianxie_info": "结束阶段，你可以判定；若判定牌与本回合或上回合进入弃牌堆的一张牌的花色相同，你令一名角色获得判定牌。",
			"gezi_nianxie_storage": "念写 花色",
			"gezi_nianxie_bg": "念",
			"gezi_nianxie_remove": "念写",
			"gezi_nianxie_remove_info": "",
			"gezi_jilan": "极岚",
			"gezi_jilan_info": "锁定技，你视为不在灵力值小于你的角色的攻击范围内。",
			"gezi_lianxu": "连拍",
			"gezi_lianxu_info": "符卡技1<br><li>你的回合开始时，你可以消耗1点灵力，发动符卡直到当前回合结束。<br><li>一回合限三次，你可以弃置一张与本回合进入弃牌堆的牌花色或点数相同的牌，摸两张牌。",
			"gezi_lianxu2": "连续拍摄",
			"gezi_lianxu2_info": "",
			"gezi_lianxu3": "连续拍摄 花色&点数",
			"gezi_lianxu3_bg": "连",
			/*-------------------秘封-------------------*/
			//莲子
			"gezi_xingdu": "星读",
			"gezi_xingdu_info": "准备阶段，你可以观看牌堆顶的两张牌，然后你可以令你的摸牌改为从牌堆底摸，直到回合结束；<br><li>选择完成后，摸一张牌。",
			"gezi_xingdu_1": "星读",
			"gezi_xingdu_1_info": "",
			"gezi_sihuan": "似幻",
			"gezi_sihuan_info": "你的第一个准备阶段，须视为使用一张目标数为2的【幻想之扉】；<br><li>出牌阶段，你可以弃置一张牌并选择一项，一回合每项限一次： <br><li>1. 获得2点灵力上限和灵力直到当前回合结束，摸两张牌；<br><li>2. 获得一名有异变牌的角色一张牌；<br><li>3. 贴上一张技能牌；<br><li>4. 将之交给一名翻面的角色并将翻回正面。",
			"gezi_sihuan_1": "似幻",
			"gezi_sihuan_1_info": "",
			"gezi_sihuan_2": "似幻",
			"gezi_sihuan_2_info": "",
			"gezi_sihuan_3": "似幻",
			"gezi_sihuan_3_info": "",
			"gezi_sihuan_4": "似幻",
			"gezi_sihuan_4_info": "",
			//梅莉
			"gezi_xijian": "隙见",
			"gezi_xijian_info": "结束阶段，你可以观看牌堆底的一张牌，然后选择一项：将之交给一名角色，或使用之。",
			"gezi_rumeng": "如梦",
			"gezi_rumeng_2": "如梦（梦境与现实的诅咒）",
			"gezi_rumeng_info": "你的第一个准备阶段开始时，须视为使用一张目标数为2的【幻想之扉】；<br><li>你体力变化时，增加1点体力上限（上限至多为5）；<br><li>准备阶段结束时，你可以扣减1点体力上限，然后无视消耗发动一次【梦境与现实的诅咒】；<br><li>发动后若你体力上限不大于3，失去此技能。",
			"gezi_dshift": "幻想之扉",
			"gezi_dshift_audio1": "撒，该是时候进入幻想了！",
			"gezi_dshift_info": "",
			"gezi_dshift2": "幻想之扉",
			"gezi_dshift2_info": "",

			/*-------------------图鉴-------------------*/
			//阿求
			"library_mengji": "缘起",
			"library_mengji_info": "锁定技，你的回合开始时，根据至今已经出场的异变牌，改变你的异变牌。",
			"library_mengji2": "缘起",
			"library_mengji2_info": "",
			"library_normal": "平和",
			"library_normal_info": "",
			"library_win": "平和",
			"library_win_info": "",
			"library_yixiang": '忆想',
			"library_yixiang_info": '一回合一次，出牌阶段，你可以交给一名角色至多三张牌并摸等量牌；<br><li>直到你的回合开始，一回合一次，该角色因牌以外的方式受到伤害前，或被其他角色弃置/获得牌时，可以弃置一张牌，防止之。',
			"yixiang_defend": '忆想（防止）',
			"yixiang_defend_2": '忆想（防止）',

			/*-------------------boss-------------------*/
			//祸灵梦
			"gezi_fenggui": "封鬼",
			"gezi_fenggui_info": "锁定技，游戏开始时，你选择装备【封魔针】或【鬼神阴阳玉】。",
			"gezi_lingji": "灵击",
			"gezi_lingji_info": "锁定技，你造成或受到伤害后，须判定：若为红色，你获得判定牌；否则，你获得1点灵力。",
			"saiqian_use": "灵击",
			"saiqian_use_info": "",
			"saiqian_die": "灵击",
			"saiqian_die_info": "",
			"gezi_mengxiangtiansheng": "梦想",
			"gezi_mengxiangtiansheng_info": "锁定技，准备阶段，或结束阶段，你需消耗1点灵力（灵力未定义则不消耗），视为对所有其他角色使用了一张【杀】。",
			"gezi_bianshenlingmeng": "灵梦变身",
			"gezi_bianshenlingmeng_info": "",
			"gezi_mengxian": "梦限",
			"gezi_mengxian_info": "当你对手牌数不小于其体力值的角色使用红色牌时，可以猜测其手牌哪种颜色最多，若猜中，此牌不能被响应。",
			"gezi_yichong": "一重",
			"gezi_yichong_info": "符卡技4(永续)<br><li>你的回合开始时，可以消耗四点灵力发动符卡技，直到你的下个回合开始。<br><li>你造成和受到的伤害均改为承受伤害的当前体力值。<br><li>当你回复灵力前，摸等量的牌。",
			"gezi_yichong1": "幻想一重",
			"gezi_yichong1_info": "",
			"gezi_juewang": "绝望",
			"gezi_juewang_1": '梦想封印·鬼',
			"gezi_juewang_2": '神罚',
			"gezi_juewang_3": '天地崩坏',
			"gezi_juewang_4": '返魂',
			"gezi_juewang_info": "<li><混沌>梦想封印·鬼：你使用没有伤害标签的牌后，本回合其他角色不能使用或打出相同花色的牌；</li><li><Heaven>神罚：回合开始时，所有两点体力上限以下的角色受到一点雷属性伤害；</li><li><诸神之黄昏>天地崩坏：你造成的非属性伤害+1；</li><li>返魂：除你外的角色回复体力后，弃置等量的牌。</li>",
			"gezi_lianyu": "炼狱",
			"gezi_lianyu_info": "符卡技2(永续)<br><li>你的回合开始时，可以消耗两点灵力发动符卡技，直到你的下个回合开始。<br><li>回合结束时，所有其他角色受到一点火焰伤害。<br><li>你令其他角色进入濒死时，若其不持有符卡，其立刻死亡。",
			"gezi_lianyu1": "天照大神",
			"gezi_lianyu1_info": "",

			/*-------------------stg-------------------*/
			"gezi_hongyue": "红月",
			"gezi_hongyue_info": "主公技，锁定技，游戏开始时，你视为持有【红月】异变牌。",
			"gezi_cuimeng": "萃梦",
			"gezi_cuimeng_info": "主公技，锁定技，游戏开始时，你视为持有【萃梦】异变牌。",

			/*-------------------采花集-------------------*/
			//魔导书塔
			"gezi_juguang": "聚光",
			"gezi_juguang_info": "当你获得此技能时，你装备五种魔导书装备牌。<br><li>你可以跳过摸牌阶段，出牌阶段和弃牌阶段，视为你使用了一张无视距离的【杀】。",
			//琪露诺boss
			"bianshen_cirno": '二阶段转换',
			"bianshen_cirno_info": '体力值变为4时，或你获得牌后，手牌数大于其他角色手牌数总和。',
			"gezi_jiqiang": "冰柱机枪",
			"gezi_jiqiang_info": '锁定技，所有其他角色的手牌上限-2；一名其他角色的回合结束时，若其手牌数小于你，摸一张牌，对其造成1点雷属性伤害，然后你可以对其使用一张牌。',
			"gezi_zuanshi": '钻石风暴',
			"gezi_zuanshi_info": '锁定技，出牌阶段开始时，你摸X张牌并展示（X为你手牌中【杀】的数量）：直到你的回合开始，与这些牌同名的牌均视为【杀】，且你的手牌上限+X。',
			"gezi_zuanshi2": '钻石风暴（转化【杀】）',
			"gezi_jubing": '巨冰破碎',
			"gezi_jubing_info": '限定技，锁定技，准备阶段，若你的体力为1，你对所有其他角色造成9点雷属性伤害。',
			//dio
			"gezi_zhipei": "支配",
			"gezi_zhipei_info": "一名角色使用卡牌指定目标后，你可以将一张花色或点数相同的牌置于弃牌堆，令该牌对目标无效，然后你获得一点灵力。",
			"gezi_shiting": "时停",
			"gezi_shiting_info": "其它角色的结束阶段，若你手牌不大于体力上限，你可以获得所有本回合因失去进入过弃牌堆的牌。",
			"gezi_shiting_mark": "世界",
			"gezi_shiting_mark_info": "",
			"gezi_shiting_mark2": "世界",
			"gezi_shiting_mark2_info": "",
			"gezi_the_world": "世界",
			"gezi_the_world_info": "一回合一次，一名角色使用带有伤害标签的牌指定目标时，你可以消耗1点灵力，取消目标，并获得一名角色的一张牌，然后你可以使用获得牌。",
			//妹红boss
			"gezi_huoniao1": '火鸟　-凤翼天翔-',
			"gezi_huoniao1_info": '准备阶段，你可以失去1点体力，视为使用了一张【弹幕狂欢】。',
			"bianshen_mokou": '二阶段转换',
			"bianshen_mokou_info": '你进入濒死状态。',
			"gezi_huoniao2": '火鸟　‐不死传说‐',
			"gezi_huoniao2_info": '锁定技，准备阶段，你视为使用了一张强化的【弹幕狂欢】。',
			"businiao_boss": '不死鸟重生',
			"businiao_boss_info": '锁定技，结束阶段，你回复X点体力，并获得X点灵力（X为你本回合造成的伤害值+1）。',
			//年兽
			"boss_nianrui": '年瑞',
			"boss_nianrui_info": '锁定技，摸牌阶段，你额外摸两张牌。',
			"boss_qixiang": '祺祥',
			"boss_qixiang1": '祺祥',
			"boss_qixiang2": '祺祥',
			"boss_qixiang_info": '乐不思蜀判定时，你的方块判定牌视为红桃；兵粮寸断判定时，你的黑桃判定牌视为草花',
			"boss_damagecount": '沙袋挑战',
			"boss_damagecount_info": '锁定技，跳过你的出牌阶段。<br>你在6分钟之内可以对我造成多少伤害呢？',
			//八云紫
			"gezi_genyuanzhini": "根源之力",
			"gezi_genyuanzhini_info": "锁定技，摸牌时，你额外摸一张牌；你的手牌上限为灵力值。",
			"gezi_jingjie": "境界",
			"gezi_jingjie_info": "锁定技，①当一名角色造成伤害后，则其获得X个“幻”标记（X为受伤角色已损失的体力值），②当你造成一点伤害后，你获得一点灵力",
			"gezi_yazhi": "压制",
			"gezi_yazhi_info": "<font color=#BF00FF>八云紫有着恐怖的根源之力，她的结界之力会压制周围的生物，让她时刻处于上风</font><br>①锁定技，你的手牌数始终视为X，（X为你的“幻”标记数量），由于弃牌阶段会重新检测真实手牌数，所以假手牌数并不影响弃牌阶段<br>②每轮限一次，其他角色弃牌阶段开始时，你可以压制对方，令其额外弃X张牌（不足则全弃，X为其“幻”标记数），弃牌阶段结束后，若对方的手牌数为0，你可以消耗3点灵力，封印其技能直到下一名角色的回合结束并对其造成一点伤害。",
			"gezi_yazhimod": "压制",
			"gezi_yazhimod_info": "",
			//灵乌路空
			"gezi_chizhimu": "赤之目",
			"gezi_chizhimu_info": "锁定技，你免疫火焰伤害。",
			"gezi_jibian": "极变",
			"gezi_jibian_info": "锁定技，你受到伤害后，伤害来源受到一点火焰伤害。",
			"gezi_huozhong": "火种",
			"gezi_huozhong_info": "锁定技，你造成不是由此技能造成的伤害改为使受伤害角色获得一个“火”标记；其他角色回合结束后，其受到X点火焰伤害（X为其“火”标记的数量）。",
			"gezi_bazhi": "八咫",
			"gezi_bazhi_info": "限定技，濒死阶段，可以弃置场上所有“火”标记，将体力上限变为标记数量，并回复至体力上限。然后你失去技能〖火种〗。",
			//莫妮卡
			"gezi_miaohui": "描绘",
			"gezi_miaohui_info": '一回合一次，出牌阶段，你可以输入一行代码并执行。',
			"gezi_kehua": "刻画",
			"gezi_kehua_info": '出牌阶段，你可以指定一名角色（包括不在场上的角色），然后选择一项：为该角色：增加技能；删除技能；更改起始灵力值；更改灵力上限；更改体力上限；或删除该角色；此改动在以后所有非联机模式的游戏中有效。',
			//发牌姬
			"gezi_huanri": '换日',
			"gezi_huanri_judge": '换日',
			"gezi_huanri_info": '一名角色摸一张牌时，或判定时，你可以观看牌堆，将其中一张牌置于牌堆顶。',
			"gezi_huanri_judge_info": '一名角色摸一张牌时，或判定时，你可以观看牌堆，将其中一张牌置于牌堆顶。',
			"gezi_toutian": '偷天',
			"gezi_toutian_info": '一回合一次，出牌阶段，你可以消耗1点灵力，创建一张牌（可以是其他模式或其他游戏的牌）并获得之。',
			//六花
			"gezi_zhonger": "中二",
			"gezi_zhonger_info": "<li>锁定技，你的技能区技能牌上限为1。<br><li>当你移除技能牌后，发动技能牌的特殊效果。<br><li>你使用基本牌，或成为基本牌的目标时，展示一张技能牌并令一名角色贴上。",
			//河城荷取
			"qianghua_qianghuagezi": "强化",
			"qianghua_qianghuagezi_info": "为游戏增加新的规则：<br><li>无中生有可以消耗一点灵力多摸一张牌；<br><li>灵力不小于四时顺手牵羊无距离限制；<br><li>过河拆桥可以消耗一点灵力额外指定一个目标；<br><li>南蛮入侵，万箭齐发，桃园结义，五谷丰登可以消耗一点灵力减少一个目标。<br><li>一名角色使用顺手牵羊外的规则时，你摸一张牌。",
			"qianghua_wuzhong": "【额外摸牌】",
			"qianghua_wuzhong_info": "消耗一点灵力，额外摸一张牌。",
			"qianghua_shunshou": "强化【顺手】",
			"qianghua_shunshou_info": "",
			"qianghua_guohe": "【增加目标】",
			"qianghua_guohe_info": "消耗一点灵力，额外指定一个目标。",
			"qianghua_jinnang": "【减少目标】",
			"qianghua_jinnang_info": "",
			//先代
			"gezi_tiequan": '铁拳',
			"gezi_tiequan_info": '当你使用【杀】指定目标时，可以消耗至多3点灵力获得以下效果：1点以上，此【杀】伤害+1；2点以上，此【杀】不能被【闪】响应；3点，令其技能失效直到此牌结算完成且此【杀】不计入出牌次数。',
			"gezi_zhicai": "制裁",
			"gezi_zhicai_info": '锁定技，你的回合内，所有的符卡技不能发动。你不能使用〖灵力卡牌〗。',

			/*-------------------乱入角色-------------------*/
			//樱
			"gezi_jiushu": "救赎",
			"gezi_jiushu_info": "一回合一次，出牌阶段，选择一名其他角色，并选择一项：弃置一张牌令其摸一张牌；或者失去一点体力令其回复一点体力。若选项条件中你是全场最低，则摸牌数/回复量+1。",
			"gezi_jiushuying": "救赎·改",
			"gezi_jiushuying_info": "一回合一次，出牌阶段，选择樱，并选择一项：弃置一张牌令其摸一张牌；或者失去一点体力令其回复一点体力。若选项条件中你是全场最低，则摸牌数/回复量+1。",
			"gezi_mengsui": '梦碎',
			"gezi_mengsui_info": '觉醒技，当你受到伤害时，若你的手牌数和体力均小于2，防止之。你消耗所有灵力，将体力和上限调整为4，获得〖无限〗、〖虚无〗和〖春回〗；所有其他角色获得“一名其他角色”改为“樱”的〖救赎〗。',
			"gezi_xuwu": "虚无",
			"gezi_xuwu_info": "锁定技，你视为拥有【皆杀】异变牌，所有其他角色的胜利条件失效(该效果仅异变模式生效)。结束阶段，所有攻击范围内的角色受到一点雷属性伤害，然后其中所有灵力为0的角色受到一点伤害。",
			"gezi_chunhui": '春回',
			"gezi_chunhui_info": '觉醒技，一名其他角色令你回复体力后，若该角色本回合令你回复至少两点体力，你减一点体力上限，失去〖虚无〗，令所有角色回复一点体力。',
			//BB
			'gezi_shiguan': '十冠',
			'gezi_shiguan_info': '一回合一次，你可以将一张牌当作与其牌名字数相差至多X的牌使用。(X为场上阵亡角色数+1)',
			'gezi_jinbei': "金杯",
			'gezi_jinbei_info': "每局游戏限X次，当你获得一名角色的牌时，你可以获得其全部的牌；你为【C.C.C】选择一项时，可以改为选择全部项。(X为场上阵亡角色数+1)",
			'gezi_ccc': "C.C.C",
			'gezi_ccc_info': "符卡技2</u><br><li>你的回合开始时，你可以消耗两点灵力，发动此符卡直到当前回合结束。<br><li>符卡发动时，你为每个角色依次选择一项，令其本回合内：1.你与其计算距离为1；2.技能无效；3.防止受到伤害；4.不能成为牌的目标；5.不能BB。",
			'gezi_ccc2': "C.C.C",
			'bbtanhu': 'BB探虎ing',
			'bbfangshang': 'BB守护中',
			'bbpaiban': 'BB干扰雷达',
			'bbjinyan': 'BB禁言',
			//黑魔术少女
			"gezi_daomo": "导魔",
			"gezi_daomo_info": "你成为【杀】的唯一目标时，可以使用一张没有伤害标签的牌，若该牌目标不包括你，将此【杀】目标转移给该牌的一名目标。",
			"gezi_chuancheng": "传承",
			"gezi_chuancheng_info": "你强化牌时，可以令灵力大于你的角色选择是否代替你消耗灵力；灵力小于你的其他角色使用牌强化时，其可以选择令你代替消耗灵力；以此法强化过的牌结算后，你摸一张牌。",
			"gezi_dba": "魔爆",
			"gezi_dba_fire_2": "黑魔导爆裂破",
			"gezi_dba_info": "符卡技3(瞬发)</u><br><li>准备阶段，你可以消耗三点灵力，发动此符卡直到当前回合结束。<br><li>此符卡发动时，你指定一名其他角色：弃置其所有牌，并视为对其使用一张【杀】。",
			//多萝西
			"gezi_zhuanhuan": "次元转换",
			"gezi_zhuanhuan_info": "出牌阶段限一次，你可以弃置所有手牌，然后摸X张牌（X为你当前灵力值）。",
			"gezi_moli": "次元魔力",
			"gezi_moli_info": "出牌阶段限一次，你可以弃置一张牌，并弃置至多三名角色各一张牌，然后你观看牌堆底等量牌，并依次交给这些角色各一张。",
			"gezi_chaoyue": "次元超越",
			"gezi_chaoyue_skill": "次元超越",
			"gezi_chaoyue_info": "符卡技7</u><br><li>你的回合开始时，你可以消耗七点灵力，发动此符卡直到当前回合结束。<br><li>你使用非转化的普通锦囊牌时，令此符卡下一次发动的消耗-1。<br><li>符卡效果：当前回合结束后，你进行一个额外回合。",
			//伊莉雅
			"gezi_huanzhao": "幻召",
			"gezi_huanzhao_info": "游戏开始时，你获得两张角色牌并暗置，称为“梦幻”；<br><li>你击杀一名角色后，将其角色牌暗置加入“梦幻”；<br><li>你视为拥有明置“梦幻”的第一项技能；<br><li>准备阶段开始时，你可以明置一张“梦幻”并暗置其余，然后可以获得该“梦幻”的所有技能，直到回合结束。",
			"gezi_huanzhao1": "设置“梦幻”",
			"gezi_huanzhao1_info": "",
			"gezi_huanzhao2": "幻召",
			"gezi_huanzhao2_info": "",
			"gezi_huanzhao4": "幻召",
			"gezi_huanzhao4_info": "",
			"gezi_wuxian": "无限",
			"gezi_wuxian_info": "锁定技，准备阶段，你获得1点灵力；<br><li>然后：若你的灵力等于上限（或灵力未定义），你摸一张牌。",
			"gezi_quintette_fire": "炮击",
			"gezi_quintette_fire_info": "符卡技7<br><u>此符卡消耗-X（X为“梦幻”的数量）；</u><br><li>你的回合开始时，可以发动此符卡。<br><li>符卡发动时，你对一名角色造成3点伤害，然后你弃置所有手牌。",
			"gezi_quintette_fire_2": "多元炮击",
			"gezi_quintette_fire_2_info": "",
			//克洛伊
			"gezi_touying": "投影",
			"gezi_touying_target": "投影",
			"gezi_touying_recast": "投影（重铸）",
			"gezi_touying_info": "一回合一次，出牌阶段，或你成为【杀】的目标后，<br><li>你可以声明一种你对应装备栏没有牌的装备，将一张非装备牌置于弃牌堆，并装备该装备，以此法装备的牌会在失去时销毁；<br><li>一名角色的回合结束后，你重铸装备区内以此法置入的牌。",
			"gezi_wenmo": "吻魔",
			"gezi_wenmo_info": "一回合一次，出牌阶段，你可以展示一张手牌，然后令一名其他角色展示一张牌，交换这两张牌；<br><li>若颜色相同，你获得1点灵力（无法获得灵力改为摸一张牌）。",
			"gezi_heyi": "鹤翼",
			"gezi_heyi_skill": "鹤翼三连",
			"gezi_heyi_info": "符卡技1<br><li>你的回合开始时，可以消耗一点灵力发动此符卡，直到当前回合结束。<br><li>【投影】中的“一次”视为“三次”；<br><li>你使用【杀】指定目标后，可以重铸装备区内的任意张牌，然后弃置目标等量牌。",
			//尼禄
			"gezi_muqi": "幕启",
			"gezi_muqi_info": "你的回合内限三次，你可以将一张牌当作一种基本牌，或本回合没有使用过的一种普通锦囊牌使用。",
			"gezi_muqi2": "幕启",
			"gezi_muqi2_info": "",
			"gezi_AestusDomusAurea": "剧场",
			"gezi_AestusDomusAurea_info": "符卡技2<永续><br><li>准备阶段，你将手牌数补至手牌上限；<br><li>出牌阶段，你可以弃置一张手牌，声明一种技能牌，然后获得之；<br><li>符卡结束时，你可以消耗1点灵力，令符卡不结束。",
			"ADA2": "黄金剧场",
			"ADA2_info": "",
			"ADA3": "招荡的黄金剧场",
			"ADA3_info": "",
			"gezi_FaxCaelestis": "蔷薇",
			"gezi_FaxCaelestis_info": "符卡技2<永续><br><li>准备阶段，你将手牌数补至手牌上限；<br><li>你使用【桃】、【无中生有】或【弹幕狂热】时，可以令一名其他角色也成为额外目标；<br><li>一回合一次，你使用有伤害标签的牌时，可以将之交给一名角色，令其成为该牌的来源。",
			"FCN2": "终幕蔷薇",
			"FCN2_info": "",
			"FCN3": "星驰的终幕蔷薇",
			"FCN3_info": "",
			//凛
			"gezi_cuican": "璀璨",
			"gezi_cuican_stone": "璀璨",
			"gezi_cuican_info": "游戏开始时，你将牌堆顶一张牌置于武将牌上，此牌位于武将牌上时，你计算当前灵力值+3。<br><br>你消耗灵力值时，可以弃置任意张具有灵力强化的手牌，视为消耗了X点灵力（X为其灵力强化值之和）；或弃置武将牌上的牌，视为消耗了3点灵力。若上述数值大于消耗值，你获得超出部分的灵力。",
			"gezi_shanyao": "闪耀",
			"gezi_shanyao_info": "出牌阶段，你可以视为使用一张普通锦囊牌，然后消耗等于此牌合法目标数的灵力；当你使用普通锦囊牌指定目标时，可以消耗任意点灵力为此牌指定等量合法目标。",
			//斯卡哈
			"gezi_ruizhi": "智慧",
			"gezi_ruizhi_info": "准备阶段，你可以判定3次，然后选择一项：<br><li>若结果中有黑桃，你获得2点灵力；<br><li>若有方片，你视为使用一张无视距离的【杀】；<br><li>若有梅花，你将一张角色的一张牌置于牌堆顶。",
			"gezi_mojing": "魔境",
			"gezi_mojing_info": "符卡技2<br><li>你的回合开始时，可以发动此符卡，直到你的回合结束。<br><li>符卡发动时，你视为使用了一张【死境之门】；<br><li>永久效果：【智慧】中的“选择一项”改为“选择所有项”;<br><li>符卡效果：一名角色因弃置而失去红桃牌后，若你灵力大于1，你需消耗1点灵力令所有其他角色各失去1点体力。",
			"gezi_mojing0": "魔镜",
			"gezi_mojing0_info": "",
			"gezi_mojing1": "魔境之门",
			"gezi_mojing1_info": "",
			//玉藻前
			"gezi_liyu": "礼浴",
			"gezi_liyu_info": "你可以跳过摸牌阶段，指定一名其他角色：你与其各选择不同的一项：<br><li>1，令对方摸一张牌；<br><li>2，令对方回复1点体力；<br><li>3，令对方获得1点灵力；<br><li>4，或令对方贴上一张技能牌。",
			"gezi_zhoufa": "咒法",
			"gezi_zhoufa_info": "结束阶段，你可以弃置一张牌，令一名角色选择一项：<br><li>回合结束后，其进行一个额外的：<br><li>1，摸牌阶段，<br><li>2，出牌阶段。",
			"gezi_zhoufa_phase": "咒法",
			"gezi_zhoufa_phase_info": "",
			"gezi_shuitian": "水天",
			"gezi_shuitian_info": "符卡技X(X为你的灵力值-1)<br><li>准备阶段，你可以为任意名角色分配体力回复或灵力获得<br><li>一名角色至多各1点，共计X点；<br><li>若X为4，你可以以此法指定阵亡的角色，令其重新加入游戏。<br><li>分配完成后，你摸等同于未分配点数的牌。",
			"gezi_shuitian_1": "水天日光",
			"gezi_shuitian_1_info": "",
			//爱丽丝
			"gezi_waimai": '外卖',
			"gezi_waimai_info": '锁定技，结束阶段，若你没有灵力，摸两张牌。',
			"gezi_heike": '黑客',
			"gezi_heike_info": '出牌阶段限一次，你可以消耗一点灵力，观看一名其他角色的手牌并获得其中一张。',
			//贞德
			"gezi_chouzi": "仇眦",
			"gezi_chouzi_info": "你受到其他角色造成的伤害后，记录伤害来源。你对已记录的角色造成的伤害+X（X为上一轮造成伤害最多的角色的伤害值）。",
			"gezi_yuanfen": "怨忿",
			"gezi_yuanfen_yuan": "怨忿",
			"gezi_yuanfen_info": "锁定技，出牌阶段开始时，删除〖仇眦〗中的首个记录，若其存活，你回复一点体力并令其获得一个「怨」标记。<br>你对有「怨」的角色使用牌无距离与次数限制；<br>你令有「怨」的角色进入濒死时，若其体力值小于0，你摸两张牌；<br>回合结束时，若你本回合未对有「怨」的角色造成过伤害，移除场上所有的「怨」。",
			"gezi_huiqiong": "睢穹",
			"gezi_huiqiong1": "咆哮吧，我的愤怒",
			"gezi_huiqiong_info": "锁定技，【神佑】进入技能牌区时，你弃置之。<br><br>符卡技1<限定><终语><br><li>你进入濒死状态时，你可以消耗一点灵力，发动此符卡直到当前回合结束，并将灵力值调整至1。<br><li>符卡效果：你不会因体力值减少而死亡；<br><li>你的体力值减少时，若你的体力值不大于0，你扣减等量的体力上限；<br><li>回合结束时，你扣减一点体力上限；<br><li>你造成的伤害均改为火属性。",
			//凉宫春日
			"gezi_haruhi1": '再组',
			"gezi_haruhi1_info": '出牌阶段，你可以创建任意张牌，将这些牌加入牌堆；或观看牌堆，并移除其中任意张牌；这些改动在以后所有非联机模式的游戏中有效。',
			"gezi_haruhi2": '梦现',
			"gezi_haruhi2_info": '锁定技，结束阶段，你指定一名角色，令其执行以下一项：从牌堆随机位置获得一张牌；或随机获得游戏内一项技能；重复此流程X次（X为你的灵力值）。',
			//M4A1
			"gezi_huoli": "火力",
			"gezi_huoli_info": "一回合一次，你使用【杀】指定目标时，可以弃置一张牌；<br><li>若如此做，该【杀】造成伤害时，对受伤角色造成1点火焰伤害。",
			"gezi_huoli_1": "火���",
			"gezi_huoli_1_info": "",
			"gezi_zhihui": "指挥",
			"gezi_zhihui_info": "一名其他角色的回合开始时，你可以消耗1点灵力，令其选择一项：<br><li>1，摸一张牌；<br><li>2，本回合可以额外使用一张【杀】；<br><li>3，获得1点灵力。<br><li>你的回合开始可以无视消耗的使用此技能。",
			"gezi_zhihui_1": "指挥",
			"gezi_zhihui_1_info": "",
			"gezi_shenyuan": "印记",
			"gezi_shenyuan_info": "符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动符卡，直到回合结束。<br><li>你使用的【杀】可以指定至多X名目标（X为你已受伤值）；<br><li>你使用【杀】指定目标后，你可以使之无法闪避。",
			"gezi_shenyuan_1": "申冤者印记",
			"gezi_shenyuan_1_info": "",
			//惠惠
			"gezi_honglian": "红链",
			"gezi_honglian_info": "你的回合限一次，其他角色受到伤害后，你可以选择一项：<br><li>1，视为对其出一张【杀】；<br><li>2，视为对除你外的所有与其距离X以内的角色使用一张【杀】（X为你的灵力值）。",
			"sbrs_liansuo": "莲锁",
			"sbrs_liansuo_info": "你的回合限一次，其他角色因弃置或被其他角色获得牌而失去牌后，你可以选择一项：<br><li>1，视为对其出一张【杀】；<br><li>2，视为对除你外的所有与其距离X以内的角色使用一张【杀】（X为你的灵力值）。<br><li>你以此法使用的【杀】指定目标时，目标可以弃置一张非基本牌令之无效。。",
			"sbrs_liansuo_2": "莲锁（无效）",
			"sbrs_liansuo_2_info": "",
			"gezi_explosion": "爆裂",
			"gezi_explosion_info": "符卡技4<br><li>你的回合开始时，可以消耗四点灵力发动符卡，直到回合结束。<br><li>你跳过你的出牌阶段与弃牌阶段，然后对一名其他角色造成2点火焰伤害，并弃置其装备区内所有牌。",
			"gezi_explosion_2": "EXPLOSIONNNNN",
			"gezi_explosion_2_info": "",
			//?
			"niguang": '？',
			"niguang_info": '你使用带有伤害标签的牌指定唯一目标后，或成为带有伤害标签牌的唯一目标后，可以与另一方拼点：赢的一方弃置没赢的一方一张牌；你选择拼点牌前，可以消耗1点灵力，弃置与你进行拼点的角色一张牌。',
			"ng_pinjian": '？',
			"ng_pinjian3": '？',
			"ng_wenhao2": '？',
			"ng_wenhao2_info": '限定技，准备阶段，若你的灵力大于1，你可以摸X张牌（X为你已受伤值），然后获得并发动你的符卡技。',
			"ClarentBloodArthur": '向端丽的吾父发起叛逆',
			"ClarentBloodArthur_skill": '向端丽的吾父发起叛逆',
			"ClarentBloodArthur_info": '符卡技1<永续><br><li>你的回合开始时，可以消耗一点灵力发动符卡，直到你的下个回合开始。<br><li>你的灵力上限为无限，你的牌点数均为K，符卡结束时，你对一名角色造成X点弹幕伤害，然后消耗所有灵力（X为你的灵力值）。',
			"CBA2": '向端丽的吾父发起叛逆',
			"CBA3": '向端丽的吾父发起叛逆',
			//利姆鲁
			"gezi_bushizhe": "捕食者",
			"gezi_bushizhe_info": '每回合限一次，你造成非雷属性伤害后，你可以获得受伤角色的一张手牌和1点灵力。',
			"gezi_daxianzhe": "大贤者",
			"gezi_daxianzhe_info": '准备阶段，你可以消耗2点灵力，然后选择一名你对其发动过【捕食者】的角色，视为拥有其一个不为符卡技的技能直到回合结束。',
			//阿尔托莉雅
			'gezi_shengguang': '胜光',
			'gezi_shengguang_info': '你使用带有伤害标签的牌指定目标后，或成为带有伤害标签牌的目标后，可以与目标/来源拼点；赢的角色摸一张牌；你拼点时，可以消耗1点灵力，令拼点牌点数翻倍。',
			'gezi_shijian': '誓剑',
			'gezi_shijian_spell': '契约胜利之剑',
			'gezi_shijian_attack': '契约胜利之剑',
			'gezi_shijian_info': '符卡技（1）<永续>你的手牌上限和灵力值上限视为无限；符卡结束时，对一名角色造成X点雷属性伤害（X为灵力值），然后消耗所有灵力。',
			//阿尔托莉雅lily
			'gezi_hualu': '花路',
			'gezi_hualu_info': '你使用带有伤害标签的牌指定目标后，或成为带有伤害标签牌的目标后，可以与目标/来源拼点；赢的角色摸一张牌；你拼点前，你可以令其他角色选择是否代替你打出拼点牌；然后，你可以令选择是的角色获得1点灵力。',
			'gezi_jinjian': '金剑',
			'gezi_jinjian_spell': '胜利黄金之剑',
			'gezi_jinjian_use': '胜利黄金之剑',
			'gezi_jinjian_info': '符卡技（1）<永续><仪式>你的手牌上限和灵力值上限视为无限：符卡结束时，你选择X次（X为灵力值）：令一名角色：受成1点雷属性伤害，或回复1点体力；然后，消耗所有灵力。',
			//时雨
			"kc_yuzhi": "雨至",
			"kc_yuzhi_info": "游戏开始时，你获得一张【神佑】技能牌。<br><li>一名角色的回合开始时，你可以交给一名其他角色一张牌；<br><li>若如此做，直到回合结束，当该角色成为【杀】的目标时，令之对其无效。",
			"kc_yuzhi_2": "雨至",
			"kc_yuzhi_2_info": "",
			"kc_yuzhi_3": "雨至",
			"kc_yuzhi_3_info": "",
			"gezi_zuoshibaozhan": "时雨",
			"gezi_zuoshibaozhan_info": "符卡技2<永续><br><li>符卡发动时，你将手牌数补至三张并获得一张【神佑】技能牌；<br><li>你的牌因弃置而进入弃牌堆，或于回合外因使用而进入弃牌堆时，你可以将之交给一名其他角色。",
			"gezi_zuoshibao_2": "佐世保时雨",
			"gezi_zuoshibao_2_info": "",
			//椿
			"gezi_xiangyi": "翔翼",
			"gezi_xiangyi_info": "你可以将与装备区内牌颜色相同的牌当作【杀】或【闪】使用/打出；<br><li>你于回合外使用牌后，可以令一名角色流失一点灵力。<br><li>该角色没有灵力改为弃置其一张牌",
			"gezi_xiangyi_2": "翔翼（→闪）",
			"gezi_xiangyi_2_info": "",
			"gezi_xiangyi_3": "翔翼（灵击）",
			"gezi_xiangyi_3_info": "",
			"gezi_chunse": "椿色",
			"gezi_chunse_info": "其他角色回合结束时，若其手牌数或体力值大于你，你获得1点灵力（无法获得灵力改为摸一张牌）；<br><li>你令一名角色流失灵力前，若你灵力等于上限，可以改为造成等量伤害。",
			"gezi_chunse_2": "椿色（伤害）",
			"gezi_chunse_2_info": "",
			//夕立
			"gezi_hongxi": "轰袭",
			"gezi_hongxi_info": "你可以将一张牌当作【杀】使用；<br><li>该【杀】指定目标后，你令对方摸一张牌，然后按照原牌类型执行对应效果：<br><li>基本～你摸一张牌，然后与目标拼点：若你赢，该【杀】不能成为【闪】的目标；<br><li>锦囊～获得目标角色一张牌；<br><li>其他牌～目标不能使用或打出手牌直到该【杀】结算完成。",
			"gezi_hongxi_2": "轰袭",
			"gezi_hongxi_2_info": "",
			"gezi_hongxi_3": "轰袭",
			"gezi_hongxi_3_info": "",
			"gezi_solomon": "噩梦",
			"gezi_solomon_info": "符卡技2<br><li><u>若你的体力值不大于2，此符卡消耗视为0；</u><br><li>符卡发动时，你贴上一张【连击】技能牌；<br><li>【轰袭】追加描述“你下一次以此法造成的伤害+1”。",
			"gezi_solomon2": "所罗门噩梦",
			"gezi_solomon2_info": "",
			//爱丽丝
			"WLD1": "追梦",
			"WLD1_info": "一回合一次，出牌阶段，你可以将任意张牌置于弃牌堆，消耗任意点灵力，随机创建并获得等量张轩辕剑拓展的牌。",
			"WLD1_1": "追梦",
			"WLD1_1_info": "",
			"WLD2": "世外",
			"WLD2_info": "你的第一个准备阶段，视为对自己使用了一张【幻想之扉】，并获得【奇缘】。",
			"WLD3": "奇缘",
			"WLD3_info": "锁定技，准备阶段，你随机创建并获得一张牌。",
			//开膛手杰克
			"gezi_wulin": '雾临',
			"gezi_wulin_info": '限定技，一名角色的回合开始时，你可以令你攻击范围内的一名角色获得以下效果，直到回合结束：<details><summary>其只能以随机选择手牌的方式使用/打出牌；弃置选择的不合理的牌。</summary><p>其不能以此法以外的方式使用牌；其需要使用牌时，可以扣置并洗混其手牌，然后展示其中一张：若可以使用，本次结算中其可以使用该牌；否则，其弃置之，并可以重复此流程。</details>其首次成为【杀】的目标后，令之不计次数。',
			"gezi_yejiang": '夜降',
			"gezi_yejiang_info": '限定技，一名角色的回合开始时，你可以令你攻击范围内的一名角色获得以下效果，直到回合结束：其攻击范围视为0，不能获得灵力，且装备效果无效。',
			"gezi_maria": '解体圣母',
			"gezi_maria_skill": '解体圣母',
			"gezi_maria_info": '符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动符卡，直到当前回合结束。<br><li>此符卡发动时，你指定一名其他角色，你与该角色距离视为一直到符卡结束。<br><li>符卡效果：你使用【杀】造成伤害后，弃置受伤角色所有手牌。<br><li>符卡结束时，重置【夜降】和【雾临】。',
			//狂三
			"gezi_kedan": "刻弹",
			"gezi_kedan_info": "你可以将一张装备牌当作一种禁忌牌使用，一回合一种禁忌牌名限一次；<br><li>你使用禁忌牌时，可以将目标改为“一名角色”。",
			"gezi_kedan2": "刻弹",
			"gezi_kedan2_info": "",
			"gezi_kedan3": "刻弹",
			"gezi_kedan3_info": "",
			"gezi_kedan4": "刻弹",
			"gezi_kedan4_info": "",
			"gezi_shishu": "时溯",
			"gezi_shishu_info": "回合结束时，你可以移动场上一张装备牌或获得本回合进入弃牌堆的一张装备牌或禁忌牌，最多X次。（Ｘ为本回合其他角色扣减的体力总值）",
			"gezi_shishu2": "时溯",
			"gezi_shishu2_info": "",
			"gezi_shishu3": "本回合进入弃牌堆的装备牌/禁忌牌",
			"gezi_shishu3_bg": "时",
			"gezi_shishu3_info": "",
			"gezi_shishu4": "时溯",
			"gezi_shishu4_info": "",
			"gezi_shishi": "食时",
			"gezi_shishi_info": "符卡技4<永续></u><br><li>你的回合开始时，可以发动此符卡，直到你的下个回合开始。<br><li>防止你扣减体力或灵力；<br><li>你的攻击范围和使用【杀】的次数限制视为无限；<br><li>结束阶段，若你本回合击杀过角色，你于回合结束后进行一个额外的回合，取消一次符卡的结束，取消符卡结束同时将灵力改为3。",
			"gezi_shishi1": "食时之城",
			"gezi_shishi1_info": "",
			"gezi_shishi2": "食时",
			"gezi_shishi2_info": "",
			"gezi_shishi3": "食时",
			"gezi_shishi3_info": "",
			//童谣
			"gezi_lvtu": '旅兔',
			"gezi_lvtu_info": '准备阶段，你可以将体力上限，灵力值，手牌数，技能牌数中不为最少的一项调整至与其中最少相同；然后，将另一项调整至与其中最多相同。',
			"gezi_mengjin": '梦镜',
			"gezi_mengjin_info": '出牌阶段限一次，你可以将体力值调整至已受伤值，手牌数调整至（3-手牌数，至少为0），灵力值调整至（5-灵力值）；然后此技能失效直到你进入濒死状态。',
			"gezi_weimo": '为某人所写的故事',
			"gezi_weimo_1": '为某人所写的故事',
			"gezi_weimo_info": '符卡技1<永续></u><br><li>你的回合开始时，可以发动此符卡，直到你的下个回合开始。<br><li>你每有以下一项为全场最低，所有该项大于你的其他角色获得对应效果：<br><u>体力：</u>受到伤害时，伤害+1；<br><u>灵力：</u>非符卡的技能无效；<br><u>手牌数：</u>手牌上限-2。',
			//莉莱
			"gezi_tanxue": '坍雪寒裘',
			"gezi_tanxue_info": '一名角色使用【杀】指定你为目标后，若其灵力小于你，你可以令该【杀】造成的伤害改为雷属性伤害。',
			"gezi_bingfeng": '冰封禁制',
			"gezi_bingfeng_info": '一名角色使用可强化牌时，若该牌未强化，你可以弃置一张牌，为该牌追加描述“强化（-1）：对目标造成１点雷属性伤害”，然后强化之。',
			"gezi_aoshu": '奥术光环',
			"gezi_aoshu_lili": '奥术光环（获得灵力）',
			"gezi_aoshu_info": '一回合一次，出牌阶段，你可将灵力消耗到0，并为任意名角色分配等量灵力；然后，直到你的准备阶段，一名角色发动符卡时，你获得1点灵力。',
			//七宫
			"gezi_guyin": "孤樱",
			"gezi_guyin_info": "锁定技，你使用牌时，无视消耗强化之；<br><li>你使用闪可响应的牌指定角色为目标时，或成为该种牌的目标时，取消之，<br><li>然后来源视为对原目标使用一张【决斗】【南蛮入侵】或【惊雷闪】；<br><li>你的【闪】视为【无懈可击】,你的【酒】均视为【桃】。",
			"gezi_guyin_2": "孤樱",
			"gezi_guyin_2_info": "",
			"gezi_guyin_3": "孤樱",
			"gezi_guyin_3_info": "",
			"gezi_tianze": "天则",
			"gezi_tianze_info": "锁定技，你受到伤害后，须获得一点灵力，否则摸一张牌；<br><li>你成为红桃牌的目标时，须消耗1点灵力，视为你对自己使用一张可强化的牌。",
			"gezi_tianze2": "天则",
			"gezi_tianze2_info": "",
			//十香
			"gezi_iphone3": "尘杀",
			"gezi_iphone3_info": "一回合两次，你可以在需要的时候，视为使用/打出了一张【杀】。",
			"gezi_Halvanhelev": "王座",
			"gezi_Halvanhelev_info": "符卡技3<瞬发><br><li>你的回合开始时，或造成伤害时，可以发动符卡技，直到回合结束。<br><li>效果：你造成伤害时，该伤害+1。",
			"gezi_Halvanhelev2": "王座",
			"gezi_Halvanhelev2_info": "",
			"gezi_Halvanhelev_1": "最后之剑",
			"gezi_Halvanhelev_1_info": "",
			//2B
			"gezi_qiyue": "契约",
			"gezi_qiyue_info": "你使用【杀】指定目标后，可以弃置目标一张牌；<br><li>然后，若目标没有手牌/装备牌，你依次获得1点灵力（不能获得改为摸一张牌）。",
			"gezi_yueding": "约定",
			"gezi_yueding_info": "符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动此符卡，直到当前回合结束。<br><li>一回合一次，你可以将一张牌当作【杀】使用；<br><li>你使用【杀】的次数上限+1；<br><li>你使用【杀】指定目标后，可以弃置目标一张牌；<br><li>然后，若目标没有装备牌，你摸一张牌。",
			"gezi_yueding1": "白之约定",
			"gezi_yueding2": "白之约定（转化）",
			//亚里沙
			"gezi_yaowu": "妖舞",
			"gezi_yaowu_info": "结束阶段，若你本回合使用过三张或更多的牌，<br><li>你可以令一名角色收回其装备区内一张牌；若如此做，你可以弃置场上一张牌。<br><li>若你没有弃置场上牌，摸一张牌。",
			"gezi_huanrao": "环绕",
			"gezi_huanrao_info": "一回合一次，出牌阶段，你可以将一张牌当【无中生有】使用；<br><li>你以此法获得的牌本回合不计入手牌上限且视为【杀】。",
			"gezi_huanrao_2": "环绕",
			"gezi_huanrao_2_info": "",
			"gezi_huanrao_3": "环绕",
			"gezi_huanrao_3_info": "",
			"gezi_huanrao_4": "环绕",
			"gezi_huanrao_4_sha": "环绕",
			"gezi_huanrao_4_info": "",
			"sliver_arrow": "白银",
			"sliver_arrow_info": "符卡技4<br><li>你可以跳过出牌阶段和弃牌阶段；<br><li>若如此做，你弃置一名角色X张牌（X为你的手牌数）<br><li>若你以此法弃置了其所有牌，对其造成1点伤害和1点雷电伤害。",
			"sliver_arrow_2": "白银之箭",
			"sliver_arrow_2_info": "",
			"sliver_arrow_3": "白银之箭",
			"sliver_arrow_3_info": "",
			//焰
			"gezi_time": "再回",
			"gezi_time_info": "锁定技，游戏开始时，你创建上次晓美焰上次死亡/使用【保存】后角色牌上的所有牌，将这些牌扣置于角色牌上。",
			"gezi_time_bg": "储",
			"gezi_time2": "再回",
			"gezi_time2_info": "",
			"gezi_time3": "保存",
			"gezi_time3_info": "一回合一次，出牌阶段，你可以将任意张花色不同的手牌扣置于角色牌上；<br><li>你的回合内，若你的手牌数小于体力值，你可以获得角色牌上一张牌。<br><li>你的回合外，可以使用或打出角色牌上的牌。",
			"gezi_time4": "保存（取）",
			"gezi_time4_info": "",
			"gezi_time5": "保存（取）",
			"gezi_time5_info": "",
			"gezi_time6": "保存（取）",
			"gezi_time6_info": "",
			"gezi_homuraworld": "世界",
			"gezi_homuraworld_info": "符卡技1<永续><br><li>你的回合开始时，可以消耗一点灵力发动符卡技，直到你的下个回合开始。<br><li>一回合一次，当前回合角色使用伤害牌指定目标时，你可以消耗1点灵力，取消之，并将之扣置于你的角色牌上。",
			"gezi_homuraworld_skill": "焰的世界",
			"gezi_homuraworld_skill_info": "",
			//女神官
			"gezi_xiaoyu": "小愈",
			"gezi_xiaoyu_info": "一回合一次，出牌阶段，你可以消耗1点灵力，令一名角色回复1点体力。<br><li>灵力未定义则不消耗。",
			"gezi_jinhua": "净化",
			"gezi_jinhua_info": "一回合一次，出牌阶段，你可以消耗1点灵力，令一名角色可以重铸任意张牌。<br><li>灵力未定义则不消耗，但只能指定你自己为目标。",
			"gezi_jinhua2": "净化",
			"gezi_jinhua2_info": "",
			"gezi_shengbi": "圣壁",
			"gezi_shengbi_info": "一名角色的回合开始时，你可以消耗1点灵力并指定一名角色：其本回合第一次受到伤害时，该伤害-1。<br><li>若其本回合未触发此效果，你获得一点灵力。",
			"gezi_shengbi_skill": "圣壁（伤害-1）",
			"gezi_shengbi_skill_info": "",
			//诗乃
			"gezi_yanju": "燕狙",
			"gezi_yanju_info": "出牌阶段开始时，你可以选择一项：造成伤害后摸一张牌，无视装备效果，或无法闪避；<br><li>然后视为使用一张持有该效果的无视次数和距离的【杀】。",
			"gezi_yanju1": "燕狙",
			"gezi_yanju1_info": "",
			"gezi_yanju3": "燕狙",
			"gezi_yanju3_info": "",
			"gezi_shangtang": "上膛",
			"gezi_shangtang_info": "准备阶段，若你的手牌数小于4或灵力小于3，你可以重置该数值，然后获得以下效果，直到回合结束开始：<br><li>你不能对其他角色使用杀以外的牌；你的手牌上限至少为4。",
			"gezi_shangtang1": "上膛（后续）",
			"gezi_shangtang1_info": "",
			//奏
			"gezi_zhongzou": "终奏",
			"gezi_zhongzou_info": "一名角色的回合结束时，若本回合有角色：<br><li>成为过牌的目标，并因牌以外的方式令牌取消其或无效；或以杀以外的方式造成伤害；<br><li>你可以视为对所有这些角色使用一张【杀】。",
			"gezi_zhongzou_2": "终奏",
			"gezi_zhongzou_2_info": "",
			"gezi_zhongzou_3": "终奏",
			"gezi_zhongzou_3_info": "",
			"gezi_zhongzou_4": "终奏",
			"gezi_zhongzou_4_info": "",
			"gezi_zhongzou_5": "终奏",
			"gezi_zhongzou_5_info": "",
			"gezi_moxin": "默心",
			"gezi_moxin_info": "一名角色的结束阶段，若其本回合：<br><li>没有使用过杀且没有造成过伤害，<br><li>你可以令其获得一点灵力，或摸一张牌然后交给其一张牌。",
			//由理
			"gezi_chongzou": "重奏",
			"gezi_chongzou_info": "一回合每项各一次，出牌阶段，你可以消耗1点灵力，令一名角色：<br><li>1，贴上一张【潜行】；<br><li>2，获得【雨至】，该技能发动后失去；<br><li>3，直到其回合结束，其使用杀指定目标时，令目标流失一点灵力。<br><li>灵力未定义则只能发动一次。",
			"gezi_chongzou_1": "重奏",
			"gezi_chongzou_1_info": "",
			"gezi_chongzou_2": "重奏（雨至）",
			"gezi_chongzou_2_info": "",
			"gezi_chongzou_3": "重奏（灵击）",
			"gezi_chongzou_3_info": "",
			"gezi_qixin": "齐心",
			"gezi_qixin_info": "一名角色的结束阶段，<br><li>若其本回合使用过杀且造成过伤害，<br><li>你可以令其获得一点灵力，或摸一张牌然后可以交给其一张牌。",

			/*-------------------明置角色-------------------*/
			//美九
			"gezi_duzou": '独奏',
			"gezi_duzou_info": '一回合一次，出牌阶段，你可以观看一名角色手牌，明置其中一张；然后，若其没有灵力，其于回合结束后进行一个额外的出牌阶段，该阶段内其由你控制。',
			"gezi_lunwu": '轮舞',
			"gezi_lunwu_info": '一回合一次，出牌阶段，你可以交给一名角色一张手牌，并明置之；然后，对其攻击范围内除你以外的所有角色各造成１点雷属性伤害。',
			"gezi_tiaoxian": '调弦',
			"gezi_tiaoxian_info": ' 一名角色明置手牌时，你可以：若其中有红色牌，令其获得１点灵力；若其中有黑色牌，对其造成１点雷属性伤害。',
			//阿库娅
			'gezi_yuyin': '愈音',
			'gezi_yuyin_info': '结束阶段，若你有至少两张相同花色的明置手牌，你可以令一名角色：若其中有至少两张红色牌，其执行一个摸牌阶段；若其中有至少两张黑色牌，其执行一个出牌阶段。',
			'gezi_qingqu': '轻曲',
			'gezi_qingqu_buff': '轻曲',
			'gezi_qingqu_info': '出牌阶段开始时，你可以明置至多X张手牌；所有角色使用【杀】的次数上限+Y，手牌上限+Z（X为灵力值，Y为黑色明置手牌数，Z为红色明置手牌数）。',
			//初音未来
			"gezi_geying": "歌莺",
			"gezi_geying_info": "每回合限三次，你失去牌后，可以明置或暗置一张手牌；<br>准备阶段，你可以重铸所有明置手牌和判定区内的牌；<br>结束阶段，你可以重铸所有暗置手牌。",
			"gezi_wuyan": "舞燕",
			"gezi_wuyan_info": "所有角色根据你明置手牌和装备区内的牌中数量最多的花色获得以下效果：<br><li>黑桃：准备阶段获得一点灵力；<br><li>梅花：摸牌阶段额外摸一张牌；<br><li>红桃：每回合限一次，可以将一张牌当作【桃】使用；<br><li>方片：弃牌阶段开始时，可以交给你一张牌。",
			"gezi_stage": "舞台",
			"gezi_stage_info": "符卡技2<永续><br><li>你的回合开始时，你可以消耗两点灵力发动此符卡，直到当前回合结束。<br><br><li>符卡效果：准备阶段，你将手牌数补至3，并明置所有手牌；<br>无视【舞燕】中的“数量最多”。",
			"gezi_stage1": "旋转舞台",
			"gezi_stage1_info": "",

			/*-------------------战棋-------------------*/
			//集气石
			"jiqitou": "集气？",
			"jiqitou_info": "距离两格以内的一名角色回合结束时，若其已受伤，其回复1点体力，然后弃置两张牌",
			"jiqitou2": "集气",
			"jiqitou2_info": "",
			//流星雨
			"paimaiyunshi": "拍卖陨石",
			"paimaiyunshi_info": "距离两格以内的一名角色回合结束时，若其体力值大于1，其受到1点弹幕伤害，然后摸两张牌",
			"paimaiyunshi2": "拍卖陨石",
			"paimaiyunshi2_info": "",
			//黑洞
			"shenmiR18": "啊——呜——",
			"shenmiR18_info": "距离两格以外的一名角色回合结束时，其向黑洞移动一格",
			"shenmiR182": "啊呜",
			"shenmiR182_info": "",
			//守矢神社
			"shrine1": "保佑",
			"shrine1_info": "距离两格以内的一名角色回合开始时，其摸一张牌；若场上有早苗，早苗可以交给其一张牌。",
			"shrine2": "保佑",
			"shrine2_info": "",
			//博丽神社
			"shrine3": "保护费",
			"shrine3_info": "距离两格以内的一名角色回合开始时，其弃置一张牌；若场上有灵梦，灵梦获得弃置牌。",
			"shrine4": "保护费",
			"shrine4_info": "",

			/*-------------------其他-------------------*/
			"_gezi_mubiao": "计数",
			"_gezi_mubiao_info": "",
			"_gezi_mubiaoend": "计数",
			"_gezi_mubiaoend_info": "",

		},
	},   
};

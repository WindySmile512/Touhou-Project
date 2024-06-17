KJZR = function (lib, game, ui, get, ai, _status) {
    game.KJimport("extension", function (lib, game, ui, get, ai, _status) {
        return {
            name: "KJ2", content: function (config, pack) {
                lib.element.player.changePhasen = function (name) {
                    if (!name.length) return;
                    if (!this.name && !this.name) return;
                    if (name.contains(true)) {
                        this.changePhasenAllthetime = true;
                        name.remove(true);
                    }
                    if (!this.truephase) this.truephase = this.phase;
                    this.phase = function (skill) {
                        var next = game.createEvent('phase');
                        next.player = this;
                        this.changePhasenorder = name;
                        this.changePhasenordermarks = name.slice(0);
                        this.markSkill('_changePhasen');
                        if (get.mode() == "guozhan") next.setContent(this.name1 + 'changePhasen');
                        else next.setContent(this.name + 'changePhasen');
                        if (!_status.roundStart) {
                            _status.roundStart = this;
                        }
                        if (skill) {
                            next.skill = skill;
                        }
                        return next;
                    }
                    if (get.mode() == "guozhan") var b = this.name1;
                    else var b = this.name;
                    lib.element.content[b + 'changePhasen'] = function () {
                        "step 0"
                        var name = player.changePhasenorder[0];
                        if (!player[name]) event.goto(2);
                        player[name]();
                        "step 1"
                        if (player.changePhasenorder[0] == "phaseDraw") {
                            if (!player.noPhaseDelay) {
                                if (player == game.me) {
                                    game.delay();
                                }
                                else {
                                    game.delayx();
                                }
                            }
                        }
                        if (player.changePhasenorder[0] == "phaseUse") {
                            game.broadcastAll(function () {
                                if (ui.tempnowuxie) {
                                    ui.tempnowuxie.close();
                                    delete ui.tempnowuxie;
                                }
                            });
                        }
                        if (player.changePhasenorder[0] == "phaseDiscard") {
                            if (!player.noPhaseDelay) game.delayx();
                        }
                        "step 2"
                        player.changePhasenorder.splice(0, 1);
                        if (player.changePhasenorder.length <= 0) {
                            delete player.using;
                            delete player._noSkill;
                            if (!player.changePhasenAllthetime) {
                                player.phase = player.truephase;
                                player.unmarkSkill('_changePhasen');
                            }
                            return;
                        }
                        else event.goto(0);
                    }
                }
                lib.translate.phaseZhunbei = "准备阶段";
                lib.translate.phaseJudge = "判定阶段";
                lib.translate.phaseDraw = "摸牌阶段";
                lib.translate.phaseUse = "出牌阶段";
                lib.translate.phaseDiscard = "弃牌阶段";
                lib.translate.phaseJieshu = "结束阶段";
                lib.translate._changePhasen = '回合顺序';
                lib.skill._changePhasen = {
                    mark: true,
                    popup: false,
                    forced: true,
                    nobracket: true,
                    superCharlotte: true,
                    unique: true,
                    intro: {
                        content: function (content, player) {
                            var str = '';
                            if (player.changePhasenordermarks) {
                                str = '你现在的回合内阶段顺序分别为：<br>' + get.translation(player.changePhasenordermarks[0]);
                                for (var i = 1; i < player.changePhasenordermarks.length; i++) {
                                    str += '、' + get.translation(player.changePhasenordermarks[i]);
                                }
                            }
                            return str;
                        },
                    },
                }
                game.otherUseCardTo = function () {
                    for (var i = 0; i < arguments.length; i++) {
                        if (typeof arguments[i] === "number") {
                            var num = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'players') {
                            var me = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'player') {
                            var me = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'card') {
                            var card = arguments[i];
                        }
                        else if ((typeof arguments[i] === "object" && arguments[i].name)) {
                            var suit, number, nature;
                            if (arguments[i].suit) {
                                suit = arguments[i].suit;
                            } else {
                                suit = '';
                            }
                            if (arguments[i].number) {
                                number = arguments[i].number;
                            } else {
                                number = '';
                            }
                            if (arguments[i].nature) {
                                nature = arguments[i].nature;
                            } else {
                                nature = '';
                            }
                            var card = game.createCard(arguments[i].name, suit, number, nature);
                            card.destroyed = true;
                        }
                    }//参数
                    var other = [];
                    if (!me) var me = game.me;
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i] !== me) other.add(game.players[i]);
                    }
                    if (typeof num === "undefined") var num = 1;
                    if (num <= 0) return;
                    if (num === 1) var players = [other.randomGet()];
                    else var players = other.randomGets(num);
                    //随机其他人
                    for (var i = 0; i < players.length; i++) {
                        players[i].useCard(card, me);
                    }
                }
                lib.skill._kj_mianshan = {
                    popup: false,
                    forced: true,
                    unique: true,
                    locked: true,
                    priority: 2020,
                    trigger: {
                        player: "damageBefore",
                    },
                    filter: function (event, player) {
                        if (!player.storage._kj_mianshang) return false;
                        var num = player.storage._kj_mianshang / 100;
                        return Math.random() <= num;
                    },
                    content: function () {
                        trigger.cancel();
                        player.$damagepop('免疫', 'unknownx');
                        game.log(trigger.source, '的攻击被', player, '的免伤抵消了');
                    },
                }
                lib.skill._kj_physics = {
                    popup: false,
                    forced: true,
                    unique: true,
                    locked: true,
                    priority: 2019,
                    trigger: {
                        player: "damageBefore",
                    },
                    filter: function (event, player) {
                        if (!player.storage._kj_physics) return false;
                        if (player.storage._kj_physics >= 100) player.storage._kj_physics = 100;
                        var num = player.storage._kj_physics;
                        var newnum = num / 100;
                        return Math.random() <= newnum && !event.nature;
                    },
                    content: function () {
                        trigger.cancel();
                        if (trigger.source) {
                            game.log(trigger.source, '的攻击被', player, '的物理防御抵消了');
                        }
                        player.$damagepop('物防', 'unknownx');
                    },
                }
                lib.skill._kj_magic = {
                    popup: false,
                    forced: true,
                    unique: true,
                    locked: true,
                    priority: 2019,
                    trigger: {
                        player: "damageBefore",
                    },
                    filter: function (event, player) {
                        if (!player.storage._kj_magic) return false;
                        if (player.storage._kj_magic >= 100) player.storage._kj_magic = 100;
                        var num = player.storage._kj_magic;
                        var newnum = num / 100;
                        return Math.random() <= newnum && event.nature;
                    },
                    content: function () {
                        trigger.cancel();
                        if (trigger.source) {
                            game.log(trigger.source, '的攻击被', player, '的法术防御抵消了');
                        }
                        player.$damagepop('法防', 'unknownx');
                    },
                }
                lib.skill._kj_hitspeed = {
                    trigger: {
                        player: "useCardAfter",
                    },
                    popup: false,
                    forced: true,
                    unique: true,
                    locked: true,
                    priority: 4000,
                    direct: true,
                    filter: function (event, player) {
                        if (!player.storage._kj_hitspeed) return false;
                        if (player.storage._kj_hitspeedstop) return false;
                        if (player.storage._kj_hitspeed >= 100) player.storage._kj_hitspeed = 100;
                        if (!event.targets || !event.card) return false;
                        if (player.storage._kj_hitspeed >= 50 && event.card.name == 'sha') return true;
                    },
                    content: function () {
                        'step 0'
                        player.storage._kj_hitspeedstop = true;
                        'step 1'
                        var num = player.storage._kj_hitspeed / 50;
                        for (var i = 0; i < num; i++) {
                            var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
                            card.destroyed = true;
                            player.useCard(card, (trigger._targets || trigger.targets).slice(0));
                        }
                        'step 2'
                        player.storage._kj_hitspeedstop = false;
                    },
                }
            }, precontent: function () {
                game.import('character',function(){
                    var KJ2 = {
                        name: 'KJ2',
                        connect: false,
                        character: {
                            "gezi_Nyaruko": ["female", "wei", 3, ["gezi_hundun", "gezi_bianshenjiamian"], ["ext:东方project/gezi_Nyaruko.jpg", "des:我是始终面带微笑潜行到你身边的混沌，奈亚拉托提普向你问好。<br>出自:潜行吧，奈亚子！"]],
                            "gezi_jiamian": ["male", "wei", 3, ["yinghun", "xinyongsi", "jigong", "nzry_kuizhu", "xinfu_zuilun"], ["ext:东方project/gezi_jiamian.jpg", "unseen", "des:《假面骑士》系列是由石森章太郎原作、东映株式会社制作的日本特摄系列英雄故事，至今共有36位（重置系列和番外系列未被算入其中）主角骑士。"]],
                            "gezi_kezi": ["female", "wei", 4, ["gezi_chiyan", "gezi_huoling"], ["ext:东方project/gezi_kezi.jpg", "des:奈亚子的青梅竹马，病娇似地爱着奈亚子，自称是她的妻子。<br>出自:潜行吧，奈亚子！"]],
                            "gezi_nep": ["female", "shu", 4, ["gezi_ziling"], ["ext:东方project/gezi_nep.jpg", "des:涅普迪努，又称：涅普缇努（妮普禔努），涅普顿。是《超次元游戏：海王星》、《超次元游戏：海王星mk2》等海王星系列游戏中紫耀之都Planeptune的守护女神。"]],
                            "gezi_Noire": ["female", "shu", 4, ["gezi_heiling"], ["ext:东方project/gezi_Noire.jpg", "des:诺瓦露，《超次元游戏：海王星》、《神次元游戏：海王星V》等海王星系列游戏的角色之一。Lastation的守护女神，喜欢Cosplay（动画中部分COS角色为今井麻美在其他作品内的角色），是个典型的努力型女神。"]],
                        },
                        skill: {
                            "gezi_ziling": {
                                audio: "ext:东方project:2",
                                pop: false,
                                mark: true,
                                locked: true,
                                zhuanhuanji: true,
                                marktext: "紫",
                                intro: {
                                    content: function (storage, player, skill) {
                                        if (player.storage.gezi_ziling == true) return '当你造成属性伤害后，获得100免伤。';
                                        return '当你造成非属性伤害后，获得50攻击速度。';
                                    },
                                },
                                group: ["gezi_ziling_1", "gezi_ziling_2"],
                                subSkill: {
                                    "1": {
                                        trigger: {
                                            source: "damageSource",
                                        },
                                        "prompt2": "当你造成非属性伤害后，获得50攻击速度。",
                                        filter: function (event, player) {
                                            if (event._notrigger.contains(event.player)) return false;
                                            return (player.storage.gezi_ziling == false || player.storage.gezi_ziling == undefined) && !event.nature;
                                        },
                                        forced: true,
                                        content: function () {
                                            player.logSkill('gezi_ziling');
                                            player.addSkill('gezi_ziling_3');
                                            player.removeSkill('gezi_ziling_4')
                                            player.storage.gezi_ziling = true;
                                        },
                                        sub: true,
                                    },
                                    "2": {
                                        trigger: {
                                            source: "damageSource",
                                        },
                                        "prompt2": "当你造成属性伤害后，获得100免伤。",
                                        filter: function (event, player) {
                                            if (event._notrigger.contains(event.player)) return false;
                                            return event.nature && player.storage.gezi_ziling == true;
                                        },
                                        forced: true,
                                        content: function () {
                                            player.logSkill('gezi_ziling');
                                            player.addTempSkill('gezi_ziling_4', { player: "phaseBegin" });
                                            player.removeSkill('gezi_ziling_3')
                                            player.storage.gezi_ziling = false;
                                        },
                                        sub: true,
                                    },
                                },
                            },
                            "gezi_ziling_3": {
                                init: function (player) {
                                    if (!player.storage._kj_hitspeed) {
                                        player.storage._kj_hitspeed = 50;
                                    } else {
                                        player.storage._kj_hitspeed += 50;
                                    }
                                    player.markSkill('gezi_ziling_3');
                                },
                                marktext: "攻",
                                intro: {
                                    name: "攻击速度",
                                    content: function (storage, player) {
                                        return "当前有" + player.storage._kj_hitspeed + "点攻击速度";
                                    },
                                },
                                onremove: function (player) {
                                    player.storage._kj_hitspeed -= 50;
                                    player.unmarkSkill('gezi_ziling_3');
                                },
                            },
                            "gezi_ziling_4": {
                                init: function (player) {
                                    //if (!player.storage._kj_mianshang) {
                                        player.storage._kj_mianshang = 100;
                                    //} else {
                                    //    player.storage._kj_mianshang += 100;
                                    //}
                                    player.markSkill('gezi_ziling_4');
                                },
                                marktext: "防",
                                intro: {
                                    name: "免伤",
                                    content: function (storage, player) {
                                        return "当前有" + player.storage._kj_mianshang + "点免伤";
                                    },
                                },
                                onremove: function (player) {
                                    player.storage._kj_mianshang -= 100;
                                    player.unmarkSkill('gezi_ziling_4');
                                },
                                ai: {
                                    nofire: true,
                                    nothunder: true,
                                    nodamage: true,
                                    effect: {
                                        target: function (card, player, target) {
                                            if (get.tag(card, 'damage')) return 'zerotarget';
                                        },
                                    },
                                },
                            },
                            "gezi_heiling": {
                                audio: "ext:东方project:2",
                                pop: false,
                                mark: true,
                                locked: true,
                                zhuanhuanji: true,
                                marktext: "黑",
                                intro: {
                                    content: function (storage, player, skill) {
                                        if (player.storage.gezi_heiling == true) return '当你受到属性伤害后，获得100法术防御。';
                                        return '当你受到非属性伤害后，获得100物理防御。';
                                    },
                                },
                                group: ["gezi_heiling_1", "gezi_heiling_2"],
                                subSkill: {
                                    "1": {
                                        trigger: {
                                            player: "damageAfter",
                                        },
                                        "prompt2": "当你受到非属性伤害后，获得100物理防御。",
                                        filter: function (event, player) {
                                            return (player.storage.gezi_heiling == false || player.storage.gezi_heiling == undefined) && !event.nature;
                                        },
                                        forced: true,
                                        content: function () {
                                            player.logSkill('gezi_heiling');
                                            player.addTempSkill('gezi_heiling_3', { player: "phaseBegin" });
                                            player.removeSkill('gezi_heiling_4')
                                            player.storage.gezi_heiling = true;
                                        },
                                        sub: true,
                                    },
                                    "2": {
                                        trigger: {
                                            player: "damageAfter",
                                        },
                                        "prompt2": "当你受到属性伤害后，获得100法术防御。",
                                        filter: function (event, player) {
                                            return player.storage.gezi_heiling == true && event.nature;
                                        },
                                        forced: true,
                                        content: function () {
                                            player.logSkill('gezi_heiling');
                                            player.addSkill('gezi_heiling_4');
                                            player.removeSkill('gezi_heiling_3')
                                            player.storage.gezi_heiling = false;
                                        },
                                        sub: true,
                                    },
                                },
                            },
                            "gezi_heiling_3": {
                                init: function (player) {
                                    //if (!player.storage._kj_physics) {
                                        player.storage._kj_physics = 100;
                                    //} else {
                                    //    player.storage._kj_physics += 100;
                                    //}
                                    player.markSkill('gezi_heiling_3');
                                },
                                marktext: "物",
                                intro: {
                                    name: "物理防御",
                                    content: function (storage, player) {
                                        return "当前有" + player.storage._kj_physics + "点物理防御";
                                    },
                                },
                                onremove: function (player) {
                                    player.storage._kj_physics -= 100;
                                    player.unmarkSkill('gezi_heiling_3');
                                },
                                ai: {
                                    nodamage: true,
                                    effect: {
                                        target: function (card, player, target) {
                                            if (get.tag(card, 'damage') && !get.tag(card, 'natureDamage')) return 'zerotarget';
                                        },
                                    },
                                },
                            },
                            "gezi_heiling_4": {
                                init: function (player) {
                                    if (!player.storage._kj_magic) {
                                        player.storage._kj_magic = 100;
                                    } else {
                                        player.storage._kj_magic += 100;
                                    }
                                    player.markSkill('gezi_heiling_4');
                                },
                                marktext: "法",
                                intro: {
                                    name: "法术防御",
                                    content: function (storage, player) {
                                        return "当前有" + player.storage._kj_magic + "点法术防御";
                                    },
                                },
                                onremove: function (player) {
                                    player.storage._kj_magic -= 100;
                                    player.unmarkSkill('gezi_heiling_4');
                                },
                                ai: {
                                    nofire: true,
                                    nothunder: true,
                                    effect: {
                                        target: function (card, player, target) {
                                            if (get.tag(card, 'damage') && get.tag(card, 'natureDamage')) return 'zerotarget';
                                        },
                                    },
                                },
                            },
                            "gezi_chiyan": {
                                audio: "ext:东方project:2",
                                trigger: {
                                    player: "phaseZhunbeiBegin",
                                },
                                forced: true,
                                content: function () {
                                    var arr = ['huogong', 'shatang', 'huoshaolianying', 'linghunzhihuo', 'liuxinghuoyu', 'chiyuxi'];
                                    var arr2 = game.players;
                                    function foo(arr) {
                                        var cloneArr = arr.concat();
                                        cloneArr.sort(function (n1, n2) {
                                            return Math.random() - 0.5;
                                        });
                                        return cloneArr;
                                    }
                                    var cards = foo(arr);
                                    var players = foo(arr2);
                                    for (var i = 0; i < Math.min(cards.length, players.length) ; i++) {
                                        //if (players[i].isAlive()) {
                                        game.otherUseCardTo({ name: cards[i] }, players[i]);
                                        //} 
                                    }
                                },
                            },
                            "gezi_huoling": {
                                audio: "ext:东方project:2",
                                trigger: {
                                    player: "damageBefore",
                                },
                                filter: function (event) {
                                    return event.nature == 'fire';
                                },
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
                            "gezi_hundun": {
                                audio: "ext:东方project:2",
                                trigger: {
                                    global: "gameStart",
                                    player: "phaseAfter",
                                },
                                forced: true,
                                content: function () {
                                    var arr = ['phaseZhunbei', 'phaseDraw', 'phaseUse', 'phaseDiscard', 'phaseJieshu'];
                                    function foo(arr) {
                                        var cloneArr = arr.concat();
                                        cloneArr.sort(function (n1, n2) {
                                            return Math.random() - 0.5;
                                        });
                                        return cloneArr;
                                    }
                                    var str = foo(arr);
                                    game.log(get.translation(player) + '下个回合顺序为' + get.translation(str));
                                    player.changePhasen(str);
                                },
                                mod: {
                                    targetEnabled: function (card, player, target) {
                                        if (get.type(card) == 'delay') {
                                            return false;
                                        }
                                    },
                                },
                            },
                            "gezi_bianshenjiamian": {
                                trigger: {
                                    player: "phaseUseEnd",
                                },
                                audio: "ext:东方project:2",
                                group: "gezi_bianshenjiamian2",
                                spell: ["gezi_bianshenjiamian3"],
                                frequent: true,
                                filter: function (event, player) {
                                    var history = player.getHistory('useCard', function (evt) {
                                        return evt.isPhaseUsing();
                                    });
                                    return history.length <= player.hp;
                                },
                                content: function () {
                                    player.Fuka();
                                },
                            },
                            "gezi_bianshenjiamian2": {
                                trigger: {
                                    player: "phaseDiscardEnd",
                                },
                                spell: ["gezi_bianshenjiamian3"],
                                frequent: true,
                                filter: function (event, player) {
                                    var cards = [];
                                    player.getHistory('lose', function (evt) {
                                        if (evt.type == 'discard' && evt.getParent('phaseDiscard') == event) cards.addArray(evt.cards2);
                                    });
                                    return cards.length >= player.hp;
                                },
                                content: function () {
                                    player.logSkill('gezi_bianshenjiamian');
                                    player.Fuka();
                                },
                            },
                            "gezi_bianshenjiamian3": {
                                init: function (player) {
                                    var name1 = player.name;
                                    player.reinit(name1, 'gezi_jiamian', false);
                                    player.storage.gezi_bianshenjiamian3 = name1;
                                },
                                onremove: function (player) {
                                    var name1 = player.storage.gezi_bianshenjiamian3;
                                    var name2 = player.name;
                                    player.reinit(name2, name1, false);
                                },
                            },
                        },
                        translate: {
                            "gezi_Nyaruko": "奈亚子",
                            "gezi_jiamian": "假面骑士",
                            "gezi_kezi": "克子",
                            "gezi_nep": "涅普迪努",
                            "gezi_Noire": "诺瓦露",
                            "gezi_hundun": "混沌",
                            "gezi_hundun_info": "锁定技，你始终跳过判定阶段。游戏开始或你的回合结束后，你随机确定你的下个回合准备/摸牌/出牌/弃牌/结束阶段的顺序。",
                            "gezi_bianshenjiamian": "假面",
                            "gezi_bianshenjiamian_info": "符卡技<br><li>发动条件：出牌阶段结束时，你于此阶段内使用的牌数小于等于体力值；或弃牌阶段结束时，你于此阶段内弃置的牌数大于等于体力值。<br><li>符卡效果：变身为假面骑士。<br><li>（假面骑士技能：【英魂】【庸肆】【急攻】【溃诛】【罪论】）",
                            "gezi_bianshenjiamian2": "假面",
                            "gezi_bianshenjiamian2_info": "变身为假面骑士",
                            "gezi_bianshenjiamian3": "假面变身",
                            "gezi_bianshenjiamian3_info": "",
                            "gezi_chiyan": "炽焰",
                            "gezi_chiyan_info": "锁定技，准备阶段，随机角色视为对一名未成为过目标的随机其他角色使用一张未使用过的随机卡牌，直到所有卡牌均使用或所有角色均成为过目标。<br><li>随机卡牌：火攻，火烧联营，沙棠，炽羽袭，流星火羽，灵魂之火。",
                            "gezi_huoling": "火灵",
                            "gezi_huoling_info": "锁定技，防止你受到的火焰伤害。",
                            "gezi_ziling": "紫灵",
                            "gezi_ziling_info": "转换技，锁定技，①你造成非属性伤害后，提升50攻击速度。②你造成属性伤害后，提升100免伤。<br><li>以此法获得的免伤会在你的回合开始时移除。<br><li>攻速：每50攻速额外结算一次杀的效果<br><li>免伤：你受到伤害时，有X%机率免疫，X为免伤数值",
                            "gezi_ziling_3": "攻速",
                            "gezi_ziling_4": "免伤",
                            "gezi_heiling": "黑灵",
                            "gezi_heiling_info": "转换技，锁定技，①你受到非属性伤害后，提升100物理防御。②你受到属性伤害后，提升100法术防御。<br><li>以此法获得的物防会在你的回合开始时移除。<br><li>物理防御：受到非属性伤害时，有X%机率免疫，X为物理防御数值<br><li>法术防御：受到属性伤害时，有X%机率免疫，X为法术防御数值",
                            "gezi_heiling_3": "物防",
                            "gezi_heiling_4": "法防",
                            "gezi_heiling_4_info": "",
                            "gezi_heiling_3_info": "",
                            "gezi_ziling_4_info": "",
                            "gezi_ziling_3_info": "",
                        },
                    };
                    return KJ2;
                })
                lib.config.all.characters.push('KJ2');
                if (!lib.config.characters.contains('KJ2')) {
                    lib.config.characters.remove('KJ2');
                };
                lib.translate['KJ2_character_config'] = '未来科技';
            }, help: {}, config: {}, package: {
                character: {
                    character: {  
                    },
                    translate: {
                    },
                },
                card: {
                    card: {
                    },
                    translate: {
                    },
                    list: [],
                },
                skill: {
                    skill: {
                        
                    },
                    translate: {   
                    },
                },
                intro: "",
                author: "",
                diskURL: "",
                forumURL: "",
                version: "1.0",
            }, files: { "character": [], "card": [], "skill": [] }
        }
    })
}
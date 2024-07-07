import {lib,game,ui,get,ai,_status} from '../../../noname.js'

export async function content(config,pack){
    //在这里编写启动阶段执行的代码
    
    //在十周年UI开启时不显示灵力
    //为兼容十周年UI，在十周年UI开启时用标记显示

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
    game.notify = function(str) {
        var dialog = ui.create.dialog(str);
        dialog.videoId = lib.status.videoId++;

        game.broadcast(function(str, id) {
            var dialog = ui.create.dialog(str);
            dialog.videoId = id;
        }, str, dialog.videoId);
        setTimeout(function() {
            game.broadcast('closeDialog', dialog.videoId);
            dialog.close();
        }, get.delayx(1000, 2000));
    }

    /*
    eg.
    ai:{
       lili:function(player,num){
       if(num<=3) return false;
       }
    }
    */
    //检测是否能使用灵力
    lib.element.player.canUselili = function() {
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

            if (info && info.ai && info.cost) {
                if (info.ai.skillTagFilter && info.ai[tag] && info.ai.skillTagFilter(this, tag) === false) continue;
                if (!info.ai[tag]) {
                    var cost = info.cost;
                    if (typeof cost === "number" && this.lili <= cost) return false;
                }
            }
        } //for循环
        return true;
    }

    game.switchModen = function(name) {
            if (!lib.layoutfixed.contains(name)) {
                if (lib.config.layout != game.layout) {
                    lib.init.layout(lib.config.layout);
                } else if (lib.config.mode == 'brawl') {
                    if (lib.config.player_border == 'normal' && (game.layout == 'long' || game.layout == 'long2')) {
                        ui.arena.classList.add('lslim_player');
                    }
                }
            }
            window.game = game;
            var script = lib.init.js(lib.assetURL + 'extension/东方project', name, function() {
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
                        } else {
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
                    } else {
                        ai[i] = mode[lib.config.mode].ai[i];
                    }
                }
                for (i in mode[lib.config.mode].ui) {
                    if (typeof mode[lib.config.mode].ui[i] == 'object') {
                        if (ui[i] == undefined) ui[i] = {};
                        for (j in mode[lib.config.mode].ui[i]) {
                            ui[i][j] = mode[lib.config.mode].ui[i][j];
                        }
                    } else {
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
                _status.event = {
                    finished: true,
                    next: [],
                    after: []
                };
                _status.paused = false;

                if (!lib.config.show_playerids || !game.showIdentity) {
                    ui.playerids.style.display = 'none';
                } else {
                    ui.playerids.style.display = '';
                }

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
                    } catch (err) {
                        lib.storage = {};
                        localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
                    }
                    game.loop();
                } else {
                    game.getDB('data', lib.config.mode, function(obj) {
                        lib.storage = obj || {};
                        game.loop();
                    });
                }
            });
        },

        //暂时死亡，由未来科技函数支持

        //音乐来
        game.playlili = function(fn, dir, sex) {
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
            global: "gameStart",
        },
        popup: false,
        forced: true,
        unique: true,
        locked: true,
        priority: -Infinity,
        audio: 2,
        content: function() {
            if (player.name === "aventurinepurple") {
                game.broadcastAll() + ui.background.setBackgroundImage("extension/东方project/backgroundpurple.jpg");
                //画师：wukloo  id：4401153
                //ui.backgroundMusic.src=lib.assetURL+'extension/东方project/aventurinepurple.mp3'; 
                // player.node.name.innerHTML='神<br>蓝<br>银<br>霜';
                //  player.update();                    
            }
            //八云紫
        },
    }

    //炉石卡牌
    if (get.mode() == 'stone') {
        lib.characterPack.mode_extension_stone_df = {
            rumia: ["female", "wei", 4, ["gezi_heiguan", "gezi_yuezhi"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            meiling: ["female", "wei", 4, ["gezi_xingmai", "gezi_dizhuan", "gezi_jicai"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            koakuma: ["female", "wei", 3, ["gezi_qishu", "gezi_anye"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            patchouli: ["female", "wei", 3, ["gezi_qiyao", "gezi_riyin2", "gezi_xianzhe"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            sakuya: ["female", "wei", 3, ["gezi_huanzang", "gezi_shijing", "gezi_world"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            remilia: ['female', 'wei', 4, ["gezi_miingyunleimi", "gezi_feise"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            flandre: ['female', 'wei', 4, ["gezi_kuangyan", "gezi_jiesha"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            cirno: ["female", "qun", 3, ["gezi_jidong", "gezi_bingbi", "gezi_dongjie"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            daiyousei: ["female", "qun", 3, ["gezi_zhufu", "gezi_zhiyue"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            suika: ["female", "qun", 4, ["gezi_cuiji", "gezi_baigui"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            mystia: ["female", "shu", 3, ["gezi_shiming", "gezi_wuye"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            keine: ["female", "shu", 4, ["gezi_jiehuo", "gezi_richuguo"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            reimu: ["female", "shu", 3, ["gezi_yinyang", "gezi_mengdie", "gezi_mengxiang"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            marisa: ["female", "shu", 3, ["gezi_liuxing", "gezi_xingchen", "gezi_stardust"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            tewi: ["female", "shu", 3, ["gezi_kaiyun", "gezi_mitu", "gezi_yuangu"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            reisen: ["female", "shu", 4, ["gezi_huanshi", "gezi_zhenshi"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            eirin: ["female", "shu", 3, ["gezi_zhaixing", "gezi_lanyue", "gezi_tianwen"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            kaguya: ["female", "shu", 3, ["gezi_nanti", "gezi_poxiao", "gezi_yongye_die"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            mokou: ["female", "shu", 4, ["gezi_yuhuo", "gezi_businiao_die"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            letty: ["female", "wu", 4, ["gezi_shuangjiang", "gezi_baofengxue"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            chen: ["female", "wu", 3, ["gezi_mingdong", "gezi_shihuo", "gezi_shuanggui"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            lilywhite: ["female", "wu", 3, ["gezi_chunxiao", "gezi_mengya"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            alice: ["female", "wu", 3, ["gezi_huanfa", "gezi_mocai", "gezi_hanghourai"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            youmu: ["female", "wu", 4, ["gezi_yishan", "gezi_yinhuashan"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            yuyuko: ["female", "wu", 3, ["gezi_youdie", "gezi_moyin", "gezi_fanhundie_die"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            ran: ["female", "wu", 3, ["gezi_jiubian", "gezi_shiqu", "gezi_tianhugongzhu"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            yukari: ["female", "wu", 3, ["gezi_huanjing", "gezi_mengjie", "gezi_mengjing"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            lilyblack: ["female", "qun", 3, ["gezi_chunmian", "gezi_bamiao"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            medicine: ["female", "qun", 3, ["gezi_zaidu", "gezi_zhanfang", "gezi_huayuan"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            yuuka: ["female", "qun", 4, ["gezi_zanghua", "gezi_xiaofeng"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            komachi: ["female", "qun", 4, ["gezi_guihang", "gezi_wujian"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            eiki: ["female", "qun", 4, ["gezi_huiwu", "gezi_caijue", "gezi_shenpan"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            aya: ["female", "qun", 4, ["gezi_kuanglan", "gezi_fengmi"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            hetate: ["female", "qun", 3, ["gezi_nianxie", "gezi_jilan", "gezi_lianxu"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            renko: ["female", "qun", 3, ["gezi_xingdu", "gezi_sihuan"],
                ['minskin', 'stone'],
                [3, 4]
            ],
            meribel: ["female", "qun", 3, ["gezi_xijian", "gezi_rumeng"],
                ['minskin', 'stone'],
                [3, 4]
            ],
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
            if (lib.characterPack.mode_extension_stone_df[i][4].contains('stonespecial')) continue;
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
            if (lib.character[i][4].contains('stonehidden')) {
                lib.card[name].stonehidden = true;
                continue;
            }
        }
    }
    //配合河城河曲
    game.removeGlobalSkill('qianghua_wuzhong');
    game.removeGlobalSkill('qianghua_shunshou');
    game.removeGlobalSkill('qianghua_guohe');
    game.removeGlobalSkill('qianghua_jinnang');
    //闯关角色
    if (get.mode() == 'stg') {
        lib.characterPack.mode_extension_stg = {
            stg_scarlet: ['male', 'wei', 0, ['dongfang_hongwu'],
                ['boss', 'chuangguan']
            ],
            stg_scarlet_ex: ['female', 'wei', 0, ['dongfang_hongwu_ex'],
                ['boss', 'chuangguan']
            ],
            stg_maoyu: ['male', 'wei', 2, [],
                ['hiddenboss', 'bossallowed']
            ],
            stg_yousei: ['female', 'wei', 1, [],
                ['hiddenboss', 'bossallowed']
            ],
            stg_maid: ['female', 'wei', 1, ['saochu'],
                ['hiddenboss', 'bossallowed']
            ],
            stg_bat: ['female', 'wei', 1, ['xixue'],
                ['hiddenboss', 'bossallowed']
            ],
        }
        for (var i in lib.characterPack.mode_extension_stg) {
            lib.character[i] = lib.characterPack.mode_extension_stg[i];
            lib.characterPack.mode_extension_stg[i][4].push('ext:东方project/' + i + '.jpg');
            if (lib.config.forbidai_user.contains(i)) {
                lib.config.forbidai.push(i);
            }
        }
    }
    //卡牌明置
    if (config.mingzhiBool) {
        lib.characterPack.mode_extension_mingzhi = {
            "re_lunasa": ["female", "wu", 3, ["gezi_reshenxuan", "gezi_rezhenhun", "gezi_hezou"],
                ["des:全名露娜萨·普莉兹姆利巴。骚灵三姐妹中的大姐，因此也担任乐团的领队。有些阴沉，但又不喜欢拐弯抹角，且很容易较真的性子。使用乐器为小提琴，演奏的曲调带有令观众镇静，低落，甚至忧郁的效果。</b>"]
            ],
            "re_merlin": ["female", "wu", 3, ["gezi_remingguan", "gezi_kuangxiang", "gezi_hezou"],
                ["des:全名梅露兰·普莉兹姆利巴。骚灵三姐妹中的二姐。很是开朗，但是感觉上有点神经质。力量上是姐妹中最强的。使用乐器为小号，演奏的曲调带有令观众激动，激昂，甚至抓狂的效果。1</b>"]
            ],
            "re_lyrica": ["female", "wu", 3, ["gezi_remingjian", "gezi_rehuanzou", "gezi_hezou"],
                ["des:全名莉莉卡·普莉兹姆利巴。骚灵三姐妹中的三妹。聪明，但是总是想用小聪明去赚姐姐们的便宜。使用乐器为键盘，打击乐器也可以使用。</b>"]
            ],
            "gezi_miku": ['female', 'qun', 3, ['gezi_geying', 'gezi_wuyan', 'gezi_stage'],
                ["des:全名初音未来，我们天下第一的公主大人~<br>出自：Vocaloid<b>画师：saberii</b>"]
            ]
        }
        for (var i in lib.characterPack.mode_extension_mingzhi) {
            lib.character[i] = lib.characterPack.mode_extension_mingzhi[i];
            lib.characterPack.mode_extension_mingzhi[i][4].push('ext:东方project/' + i + '.jpg');
            if (lib.config.forbidai_user.contains(i)) {
                lib.config.forbidai.push(i);
            }
        }
        //configOL
    }
    //分栏
    lib.characterPack.mode_extension_library_luanru = {
        'gezi_tohka': ['female', 'wu', 4, ['gezi_iphone3', 'gezi_Halvanhelev'],
            ["des:传说中的有史以来最敷衍最没有良心的技能组！<br>就跟原作的能力设置差不多。<br>出自：Date-A-Live!<b>画师：mmrailgun</b>"]
        ],
        'gezi_kanade': ['female', 'key', 3, ['gezi_zhongzou', 'gezi_moxin'],
            ["des:啊，是天使，我死了——<br>全名立华奏，死后世界的学校中的学生会长，标准的无口萌妹。<br>出自：Angel Beats! <b>画师：sua(スア)</b>"]
        ],
        'gezi_nero': ['female', 'wei', 4, ['gezi_muqi', 'gezi_AestusDomusAurea'],
            ["des:全名尼禄·克劳狄乌斯·凯萨·奥古斯都·日耳曼尼库斯。古罗马的皇帝，比起皇帝更像个偶像，奢华浪费和浮夸无人能出其右。<br>出自:Fate/Extra <b>画师：demercles</b>"]
        ],
        'gezi_illyasviel': ['female', 'wei', 3, ['gezi_huanzhao', 'gezi_wuxian', 'gezi_quintette_fire'],
            ["des:全名伊莉雅丝菲尔·冯·爱因兹贝伦，在日本的动漫中十分常见的那种使用特殊能力帮助他人或对抗恶役的女孩子<br>出自：Fate/kaleid liner 魔法少女☆伊莉雅 <b>画师：永恒之舞MK_2"]
        ],
        'gezi_kurumi': ['female', 'wu', 3, ['gezi_kedan', 'gezi_shishu', 'gezi_shishi'],
            ["des:全名时崎狂三。咕咕咕<br>出自：Date-A-Live! <b>画师：kyuriin</b>"]
        ],
        'gezi_sinon': ['female', 'qun', 3, ['gezi_yanju', 'gezi_shangtang'],
            ["des:被称为“冰之狙击手”的GGO玩家。“死枪”事件后在桐谷和人的邀请下转换到新生了ALO中，扮演擅长使用弓箭狙击的猫妖精。<br>出自：刀剑神域<b>画师：PCManiac88</b>"]
        ],
        'gezi_scathach': ['female', 'wei', 4, ['gezi_ruizhi', 'gezi_mojing'],
            ["des:影之国的女王，当女王当了几千年了。<br>出自：Fate/Grand Order <b>设计：冰茶	画师：saberii</b>"]
        ],
        'gezi_kuro': ['female', 'wei', 3, ['gezi_touying', 'gezi_wenmo', 'gezi_heyi'],
            ["des:全名克洛伊·冯·爱因兹贝伦，小腹上的那个不是○纹，不要问了！<br>出自：Fate/kaleid liner 魔法少女☆伊莉雅 <b>画师：トミフミ</b>"]
        ],
        'gezi_twob': ['female', 'wu', 4, ['gezi_qiyue', 'gezi_yueding'],
            ['des:——机器人会梦见电子绵羊吗？<br>——不，机器人会梦见和小男朋友一起去商城买T恤衫————<br>出自：NieR:Automata <b>设计：雪樱   画师：saberii</b>']
        ],
        "gezi_homura": ["female", "qun", 3, ["gezi_time3", "gezi_time", "gezi_homuraworld"],
            ["des:问题：如果你目睹你最喜欢的人死亡，要她死多少次你才会疯掉？<br><b>出自：魔法少女小圆 画师：Capura.L</b>"]
        ],
        "gezi_shigure": ["female", "shu", 4, ["kc_yuzhi", "gezi_zuoshibaozhan"],
            ["des:白露级驱逐舰2号舰，名是从前代神风级驱逐舰10号舰所继承。<br>出自：舰队collection <b>画师：konomi★きのこのみ</b>"]
        ],
        "gezi_yudachi": ["female", "shu", 4, ["gezi_hongxi", "gezi_solomon"],
            ["des:白露级驱逐舰4号舰，以初春级为基础，加固了舰体，提高了稳定性。<br>出自：舰队collection <b>画师：ﾏｸｰ</b>"]
        ],
        "gezi_m4a1": ["female", "shu", 4, ["gezi_huoli", "gezi_zhihui", "gezi_shenyuan"],
            ["des:<br>出自：少女前线 <b>画师：怠惰姬空白</b>"]
        ],
        "gezi_megumin": ["female", "shu", 3, ["gezi_honglian", "sbrs_liansuo", "gezi_explosion"],
            ["des:以“艺术就是爆炸”为人生信条的小萝莉红魔法师。<br>出自：为美好的世界献上祝福！<b>画师：seki</b>"]
        ],
        "gezi_satone": ["female", "wu", 3, ["gezi_guyin", "gezi_tianze"],
            ["des:全名索菲亚琳·SP·撒旦七世，传说中的魔法魔王少女，可以召唤天使！<br>出自：中二病也要谈恋爱！ <b>设计：子规    画师：あかつき聖</b>"]
        ],
        "gezi_yuri": ["female", "key", 3, ["gezi_chongzou", "gezi_qixin"],
            ["des:全名仲村由理，死后世界的学校中，死后世界战线的领导者，旨在与神，与神的天使对抗。<br>出自：angel beats! <b>画师：戦-G</b>"]
        ],
        "gezi_priestress": ["female", "qun", 3, ["gezi_xiaoyu", "gezi_jinhua", "gezi_shengbi"],
            ["des:女神官 是日本轻小说《哥布林杀手》及改编作品中的女主角，身材娇小的金发少女，会使用信仰地母神的教会法术。协助哥布林杀手一起不停地讨伐哥布林。"]
        ],
        "gezi_tamamo": ["female", "wei", 3, ["gezi_liyu", "gezi_zhoufa", "gezi_shuitian"],
            ["des:玉藻前，TYPE-MOON的游戏《Fate/EXTRA》、《Fate/EXTRA CCC》、《Fate/EXTELLA》、《Fate/EXTELLA LINK》及《Fate/Grand Order》中登场的Servant。"]
        ],
        "gezi_aliceWLD": ["female", "wu", 3, ["WLD2", "WLD1"],
            ["des:<br><b>出自：爱丽丝漫游仙境 画师：夕凪セシナ</b>"]
        ],
        "gezi_arisa": ["female", "qun", 3, ["gezi_yaowu", "gezi_huanrao", "sliver_arrow"],
            ["des:守护森林的妖精弓手。（不过森林里的东西比她要恐怖多了）<br>出自：暗影之诗 <b>画师：黒井ススム</b>"]
        ],
        "gezi_tsubaki": ["female", "shu", 4, ["gezi_xiangyi", "gezi_chunse"],
            ["des:全名朱雀院椿。“这是你为我锻造的翅膀，我将用它们尽情翱翔。”。。。椿姐赛高！<br>出自：牵绊闪耀的恋之伊吕波 <b>画师：ぺろ</b>"]
        ],
    };
    lib.characterPack.mode_extension_library = {
        "aventurinepurple": ["female", "wei", 4, ["gezi_genyuanzhini", "gezi_jingjie", "gezi_yazhi"],
            ["des:八云紫是日本的“东方Project”系列弹幕游戏及其衍生作品的登场角色之一。八云紫是个力量非常强大的妖怪，她持有与根源相关的危险能力，这能力能和神明对抗。她是幻想乡的创始人之一，和历代博丽巫女一同维护着博丽大结界。全东方系列唯一的PH（Phantasm）关卡头目（蓝则是《妖妖梦》的EX关卡的Boss） 主要剧情 东方求闻史纪 要说最像妖怪的妖怪，就必须要提到八云紫的名字。这个妖怪，由于其危险的与根源相关的能力，神出鬼没而性格不近人情，行为原理与人类完全相异等等的原因，是一个没人愿意与她为敌的妖怪。 外表和人类没有区别。喜欢华丽的衣服，撑着一把大阳伞。 主要活动时间是夜晚，白天睡觉。是个典型的妖怪（×1最近在夜晚活动的人类增加的同时，昼间活动的妖怪也增加了。）。另外，尽管都说冬天一直在冬眠，因为只是其本人所谈及而且实际在何处居住无法确认，所以真伪的程度无法确定。 古时候，幻想乡缘起阿一所著（×2初代撰写的的幻想乡缘起，有超过一千二百年的历史了。）的妖怪录中也有着这种相似的妖怪登场。那个时代她的身影就已经出现了。 能力 操纵境界的能力是能够从根源开始颠覆一切事物的恐怖的能力。众所周知，物的存在是建立在境界的存在之上的。没有水面的话，湖是不存在的。没有山脊的话，山和天空也是不存在的吧。没有幻想乡的大结界的话，幻想乡也不会存在。如果全部物的境界都不存在的话，那世界将会是一个巨大的整体吧。 也就是说，操纵境界的能力是逻辑的创造与破坏的能力。从本质上创造新的存在，从本质上否定已有的存在。妖怪所持有的能力中能够与神之力相匹敌的、最危险的能力之一。 还有，也能通过空间的裂缝从任何地方瞬间移动，或身体的一部分移动到别的场所。据说不仅仅是物理的空间，也能够在画中、梦中和故事中等移动。 另外，还拥有超人的头脑（×3因为是妖怪所以超越人类是当然的。），尤其是数学很强。而且，因为活了很久的缘故，知识和经验都很丰富。 日常 她本人意外地健谈，告诉别人各种各样的关于自己和幻想乡相关的事情。只是，哪一个都没有被确认过，实际上都是没有办法去确认，所以真假无从判断。 住所和博丽神社一样，据说是建在幻想乡和外边的世界的境界之处，但没有人见过那个建筑物。因为利用空间的断开处，从不知何处出现并消失去了无法得知的地方。没法从后面追赶，真伪的程度无从判定（×4也有传言说家是在外面的世界。）。 另外，平时自己行动很少，而是操纵妖兽作为式神，杂事全部都由这匹妖兽来做。特别是在白天和冬天，睡觉的时候这个式神会代替紫来行动。 还有就是，同样寿命很长的妖怪朋友也有很多。住在冥界的西行寺幽幽子（后述）、鬼族的伊吹萃香（后述）等，大部分的朋友都是最强一类的妖怪。 与幻想乡的关系 幻想乡自身，依靠大结界与外界相隔离。这个结界也是分开内外境界线。 只是，外面的世界和幻想乡在地理上是接续的，所以可以说是结界的境界从逻辑上面创造了幻想乡这个地方。 也就是说，只要境界之妖怪还存在，要创造或破坏幻想乡这样的地方都是可能的。被境界所环绕的幻想乡里，有着不知道居住在何处的境界之妖怪的存在，可以说是和幻想乡的成立有极重要的关系。 不可思议的是，这个妖怪很少袭击人类。因为不袭击人的妖怪不算是妖怪，可能还是在某个地方有袭击过人的吧。由于能够自由地前往外面的世界，那个地方说不定就是外面的世界了吧（×5有传言说是外面的世界的妖怪回到幻想乡来游玩。冬季与昼间等，据说是在睡觉的时候，可能就是在外面的世界度过的也说不定，也有的说法是紫的梦中世界就是外面的世界。）。 关于这个妖怪的逸闻 幻想月面战争骚动 此为一千多年前的秘史。据说她玩弄着实与虚的境界，跃入了映照在湖上的月亮并向其发动进攻。尽管聚集了大量的妖怪，在月面的近代兵器面前很快遭到惨败。从那以后，妖怪们很少再去进攻不属于自己的领土了。以这个骚动作为契机，这个境界妖怪的力量在人类之间也广为流传。 妖怪扩张计划 超过五百年以前的逸事了。由于人口的增加，为了恢复被人类压迫的妖怪在幻想乡的势力，紫策划并实行的。 在这以前的幻想乡仅仅是在远离人类村落的深山里的地方，这个计划是幻想乡周围创造了幻与实的境界，在逻辑上创造了这个世界。 幻想乡内为幻之世界，外面的世界为实体世界这般，在外面的世界里势力变弱了的妖怪会自动地被幻想乡召唤进来这样换时代的事件。 从此以后，变成了从日本以外的国家也有妖怪移民进来。境界的效现在仍在持续着。 此外，这个计划的高明之处在于，外面世界妖怪消失得越多，幻想乡里的妖怪就越强。外面的世界是人类的天下，幻想乡内还是妖怪的天下。 大结界骚动 理所当然般存在着的博丽大结界（×6分隔幻想乡与外面世界的境界。这是合乎逻辑的境界，是据说人类和妖怪都不能轻易地往来的，强大的境界。）。据说是这个妖怪是提议大结界并创建的幻想乡的贤者之一。但是，最初是大量的妖怪联合起来反对，她与妖怪之间为此发生了争斗。在这期间，妖怪都没有去袭击人类，幻想乡的人类们开始对大结界大为称赞。 　　结果，大结界的好处传到了妖怪们那里，反对这个结界的人几乎不存在了。 幽灵骚动 冥界与显界的境界变薄了，发生了幽灵会出显界、生者容易前往冥界这样的骚动。已经确认是这个妖怪的所作所为。因为是贤明的妖怪做的事，可能会有关系到妖怪社会的崇高的目的性所在（×7在我有生之年是无法确认了。）。这个异变仍然进行着没有被解决。 目击者报告 没注意到的时候放在眼前的食物就这样消失了，希望她别这样了。（博丽灵梦） 据说能够趁人不备把手伸进空间的断开处，并把远处的东西取走。 求你平时别突然出现在我家里了，好好的从门口进来不行么？（雾雨魔理沙） 神出鬼没也要有个限度。 对策 出现在人类村庄的情况很少。只要不发生特殊情况，是不会袭击普通人类的。 无论对自己的能力多么地有自信，最好也别去退治这个妖怪。但是，只要不是恶性战斗的话，她会配合这边的力量而手下留情。 总之，对于境界的能力的防御方法和弱点都不存在。而且，其智力也使远远凌驾于人类的想象之上的，当然身体能力也是和妖怪一样。万分之一的胜利希望也不会有吧。除了以绅士般的态度面对之外没有其他的有效对策。 东方妖妖梦 一到春天便会醒来的隙间妖怪。  主要拥有操纵所有境界程度的能力。 跟幽幽子是故知的关系，但并不是幽灵。是在幻想乡中，静静栖息在最边境的妖怪。从这里，边看着博丽大结界边生活着。 偶尔会有人类混进幻想乡，也是由于紫有时去摇晃境界的结果。人类所称的神隐这种现象，如果被知晓其实不是什么神明所为， 只是这名妖怪少女捣的鬼的话，什么神秘性都会失去吧。 紫平时不怎么活动，一般操纵式神的蓝来生活。 但因为基本都是在睡，其间都丢着蓝不管，所以基本不知道蓝在做什么。 当得知这位式神蓝被什么人打败了的时候，稍微惊讶了下但还是去睡回笼觉了。 自回笼觉醒来的时候，总算是察觉到周围已然是一片春色。 其实大约十天前就已经是春天了，但每每睡去又忘记，醒来又惊奇。 在蓝恢复之前，没法安心睡觉呀，这样想着但还是睡过去了。 这个时侯，幽幽子来拜托希望修复因为这次骚动而稀薄了的幽明的境界。 你自己叫它变弱的还管什么修复不修复呀，这样想着揉揉睡眼便出发了。 久违到访冥界的紫，因为异常热闹的气氛而感到奇怪。西行寺家不是更寂静的地方吗？虽然这么想，但也许是幽幽子换了个嗜好吧。 这样自顾自地理解了。 途中遇见了庭师妖梦，详细地了解了情况。根据妖梦所描述似乎是倒了大霉，但紫怎么听都觉得是自作自受。 所有人，看起来都因为那棵妖怪樱而失常了。那棵樱花树吸入的人类的精气太过量了。一直都觉得很危险。尽管这样想，但也很清楚，凭自己的力量是什么都做不到的。 幽幽子生前的时候，紫就知晓了。也知道，其实，并不是幽幽子被妖怪樱所封印，而是幽幽子的亡骸封印着妖怪樱这件事。[5] 东方萃梦想 幻想乡的妖怪。如同字面一样既妖又怪。住在幻想乡的境界的屋子，但是那个场所并无人知道。 不知道为何对于外面的世界很熟知。看起来非常的可疑。 性格是无法理解型，但是绝对不是好东西这点是大家都认同的地方。 都认为如果可以的话真不想见到她。 一般来说除了灵梦之外没有认真和她相处的人。 体术，采取和人类标准相异的行动。既不快也不迟钝。 到底是强是弱也是不可知。 紫的行动让自己看起来仿佛被耍了一样，就算赢了她也会生气。 但是，恐怕也没有像她一样真挚地接受幻想乡、爱着幻想乡的人了。 东方永夜抄 居住在幻想乡边境某处的妖怪。 鉴于境界本身不是一般人所能见，因此无法判定其住在哪里。 只能肯定不是在同一个边境上的神社里。 于幻想乡的妖怪中,她是从很久以前就已经存在,且力量也相当强大。 眼下仍然清楚了解幻想乡本身的人物,即使在妖怪当中亦极其稀少。 她看起来形迹可疑，那是因为她缺少人味，让人不能理解她的行动。 如果她有那个心思,要毁掉整个幻想乡是易如反掌,非常危险的妖怪。 东方绯想天 性格：冷静，经常避开他人。 东方地灵殿 平常根本搞不清楚她人在哪的神出鬼没的妖怪。 地灵殿中八云紫的支援子弹和BOMB 这次制作了能够对话的阴阳玉。 因为地底和地上的妖怪们所构筑的是完全不同的社会，因此并不想过多去干涉。对突然出现的怨灵感到很困惑。 因为怕异变扩大之后会很讨厌，而拜托影响力比较小的灵梦前往调查。 东方绀珠传 雾雨魔理沙打败纯狐后从月球回来后正在琢磨月之都的力量石的时候八云紫突然出现，在魔理沙同意下研究了下力量石，她指出从这石头能够得到各种情报和妖力会让幻想乡越来越变化多端，魔理沙始终被八云紫的语言压制着，她猜不透八云紫所说的变化到底是啥，更不知道八云紫是为什么而出现（或许是给新作做伏笔吧）"]
        ],
        "gezi_lingliaolukong": ["female", "shu", 3, ["gezi_chizhimu", "gezi_jibian", "gezi_huozhong", "gezi_bazhi"],
            ["des:灵乌路空 灵乌路空（れいうじ うつほ/Reiuji Utsuho），系列作品《东方Project》中的角色，于《东方地灵殿》首次登场。她有操控核融合程度的能力。 中文名 灵乌路空 其他名称 阿空（おくう）炽热焦躁的神之火 登场作品 《东方地灵殿》、《东方非想天则》 性别 女 血型 不明 日文名 れいうじ うつほ 种族 地狱鸦（体内寄宿着神灵八咫鸟） 能力 操控核融合程度的能力 英文名 Reiuji Utsuho 主题曲 霊知の太阳信仰～Nuclear Fusion 登场作品 《东方地灵殿》第6面Boss 《东方非想天则》可用角色、早苗线4面BOSS、琪露诺线4面BOSS 《Double Spoiler ～ 东方文花帖》Lv8 《东方心绮楼》地灵殿观众 设定文档 求闻口授立绘 东方求闻口授 栖息于旧地狱最深处的地狱鸦。住在旧地狱的妖怪基本上都是因为原住地成了废墟，继而迁居于此，但地狱鸦本来就住在地狱，是这里最早的住民。 与地面之上产生了瓜葛，因而被确认为是一种固有种（×1 在被隔离的特定环境里繁衍生息，只存在于那里的动物，妖怪们。）。自地狱的黑暗诞生而来的鸟，话虽如此，却没什么作为妖怪的特点可言。 不过，她仍旧是个特殊的存在。她的身体里寄宿着神灵。寄宿着神灵的话，就变成了类似移动分社一样的东西。对一般的人类跟妖怪来说这一定很难吧。无名无个性，对自己不加执着，且拥有接受一切的包容力，这显得非常必要。并且也需要一定的努力。当然这其中最简单的捷径应该是脑袋空空吧。 她总是一副异样的姿态。可疑的存在着的「分解之足」，看起来很重的「融合之足」，手上还安着一门大炮一样的东西，这好像是「第三足」，胸部有着深红的「赤之目」，这全都是寄宿在他身体里的神灵，八咫乌的影响。 很少到地面上去，也很少与人们接触，所以性格不明。唯一明确的就是她的脑袋空空的。 八咫乌　寄于她体内的神灵八咫乌，是出现在古事记中的高等神灵。　八咫乌被称作是栖息于太阳的乌鸦。用肉眼来看会比较困难，但在地面上还是可以观测到它们的身姿。八咫乌的身姿正是被人们称作是太阳黑子的那种东西。大约每隔十一年有一次力量上升，可以看到很多的黑点。　这位神明的力量是太阳之力，神之火。原封不动地成为了她的力量。　神之火这种东西，在超高温的前提下就算放着不管也会持续燃烧，所以控制起来非常困难。她的力量与其说是排出体内的神之火，倒不如说是花费力气控制神之火呢。　将此神灵附在她身上的人，好像是八坂神奈子。　明明具备了太阳这种至高无上的神格，却又被分灵到旧地狱这种尽是居住着被厌恶者的地方，这时候的八咫乌会怎么想呢。 对策　不知道算不算是危险。　没怎么去过地面上，只用记住这种妖怪都是住在地下的就好了。　顺带一提拜她所赐有温泉涌出来了的样子。这也算是给予的恩惠吧。 地灵殿立绘 东方地灵殿 外表大放异彩的乌鸦。 左足乃『分解之足』 右足乃『融合之足』 然后右手所持的是控制它们的『第三足』 据说她就是靠这三足来操纵究极的能量。 在沉入永眠的火焰地狱遗迹上有一座地灵殿。 在地底世界已经不再是地狱的现在，已经不再会有罪人被贬入此地， 现在只有以前就住在这里的地狱鸦，负责搬运尸体的火车，其他一些 怪异的妖怪们，以及只靠怨恨行动的怨灵们住在这里。 觉呢，把这块属于自己的土地分配给宠物们居住。 空也和燐一样，是觉的一只宠物。 燐负责怨灵，而空则负责看守火焰地狱遗迹防止其失控。 她的工作就是，发现火焰变旺了就打开中庭的天窗，火力不足了就 将燐送来的尸体扔进其中，借此来调整火力。 每天每天，虽然都重复着同样的事情，但也算过着平稳充实的生活。 但是，从某天开始这种日子被打破了。 有什么人从地上，没有被任何人发现一口气进入了地狱火焰遗迹当中。 然后对她说了什么。 那声音的内容刺激了她的好奇心。 『在地狱火焰遗迹中隐藏有诞生出人类能够获得的最后一种能量的 秘密。 以及，你这只栖息在火焰中的乌鸦。 你应该可以让那究极的力量寄宿于自己身体中。 那样一来不仅是对于地底，也可以给地上带来更多的希望吧』 她被光芒所包围，感觉到有什么人进入到了自己的身体当中。 等回过神来便发现自己的样子产生了巨大的变化。 空对于使用获得的力量感到非常有趣，回过神来发现灼热地狱遗迹 已经恢复了以前的热度。 那温度烧热了地下水，当水蒸气的压力到达极限时便会变成间歇泉 一口气喷出地面。 从地上来访的使者。 那究竟是什么人呢，以及目的是什么。 空小小的头脑中，立刻说出了那样的疑问。 ――八咫乌 进入她身体里的力量是一种被称为八咫乌的神。 有三只脚的乌鸦，据说居住在太阳上。 八咫乌所拥有的究极力量，便是创造原子的力量，核融合。 核能，这是留给未来的究极幻想。 非想天则立绘 东方非想天则 东方非想天则没有相关的文字设定。 符卡 地灵殿 中文名 日文名 难度 核热「Nuclear Fusion」（核聚变） 核热「ニュークリアフュージョン」 Easy / Normal 核热「Nuclear Excursion」（核功率骤增） 核热「ニュークリアエクスカーション」 Hard 核热「核反应失控」 核热「核反応制御不能」 Lunatic 非想天则 中文名 日文名 备注 「地狱的人造太阳」 「地狱の人工太阳」 对战使用 控制 「Self Tokamak」（自动托卡马克装置） 制御「セルフトカマク」 对战使用 遮光「核热护罩」 遮光「核热バイザー」 对战使用 Double Spoiler ～ 东方文花帖 中文名 日文名 等级 射命丸文的评价\t姬海棠果的评价 炉解「Melting White」（消熔的纯白） 炉解「メルティングホワイト」 Level 8-2 [1]拍到了正在进行核聚变反应的乌鸦 　　可是逆光太强了，拍出来的照片都是纯白色 　　怎样才能把太阳拍得更清晰一些呢？ 啊啊，这就是传说中的第二个太阳呀。温泉涌出来使 　　核聚变这个词广为人知，虽然不明白原理但是感觉很厉害 　　像是连外面的世界都无法实现的强大力量呢 巨星「Red Giant」（红色巨人） 巨星「レッドジャイアント」 Level 8-4 好热啊。而且因为逆光所以拍不到好照片 　　问河童的话，回答是「若是逆光的话调整一下曝光度就好了」 　　本来就很热，再加一件衣服的话真有点…… 不停乱动的太阳！ 　　如果这样迅速运转的话一天就会变短，会很有意思啊 　　就会有更多快乐的日子能够享受了！ 星符「巨星陨落」 星符「巨星坠つ」 Level 8-6 我已经放弃拍摄空的照片了 　　所以我考虑把一张全白的照片登在报纸上 　　然后写上「这就是灵乌路空」 真是热死人啦—— 　　烧温泉也很辛苦啊—— 　　以后一定要很小心地进去。把酒也带上吧 七星「Septentrion」（北斗星辰） 七星「セプテントリオン」 Level 8-8 北斗七星？啊啊，说的就是天龙呢 　　虽然如果龙真的出来闹了绝对不止这种程度吧 　　但是，在七星背面跟着的那颗小星星到底是……？ 北斗七星吗——？那个是巨人的勺子吧？ 　　当那把勺子翻过来的时候，大量的流星就会倾注而下 　　就这样概括一下写成新闻么——"]
        ],
        "gezi_hechenghequ": ['female', 'qun', 4, ['qianghua_qianghuagezi'],
            ['des:河城荷取（かわしろ にとり，Kawashiro Nitori）是系列作品《东方project》中的角色，初登场于《东方风神录》。能力是操纵水程度的能力，主要活动场所是玄武之泽等。<br><b>画师：ZYANNA</b>']
        ],
        "gezi_liuhua": ["female", "wu", 3, ["gezi_zhonger"],
            ["des:爆裂吧，现实！粉碎吧，精神！放逐这个世界！邪王真眼是最强的！<br>出自：中二病也要谈恋爱！<b>画师：雪降</b>"]
        ],
        "gezi_dio": ["male", "shen", 8, ["gezi_zhipei", "gezi_shiting", "gezi_the_world"],
            ["boss", "bossallowed", "forbidai", "des:ko no dio da!!!"]
        ],
        "stg_bookshelf": ["female", "shen", 5, ["gezi_juguang"],
            ["forbidai", "des:帕秋莉最喜欢的书架。。。大概。"]
        ],
    }

    if (get.mode() == 'chess') {
        lib.characterPack.mode_extension_chess_df = {
            treasure_paimaiyunshi: ['male', 'qun', 3, ['paimaiyunshi'],
                ['des:虽然陨石很值钱，但也不要冒着生命危险去捡啊……']
            ],
            treasure_jiqitou: ['male', 'qun', 3, ['jiqitou'],
                ['des:“这个石头有神奇的，治愈人心的力量！”<br>“这就是你用300块钱换了块石头的理由吗……”']
            ],
            treasure_shenmiR18: ['female', 'qun', 3, ['shenmiR18'],
                ['des:规则34：凡是存在的东西，都有R18表现<br>画师：メンヤンん']
            ],
            treasure_shrine1: ['female', 'qun', 3, ['shrine1'],
                ['des:“只要信仰了，每个月都有会员活动，年度烟火表演，还可以买到巫女的泳装照片集……怎么，太过分了？”<br>画师：朱シオ']
            ],
            treasure_shrine2: ['female', 'qun', 3, ['shrine3'],
                ['des:“所以你的神社到底是供奉谁的？”<br>“我也想知道啊？！”<br>画师：kirero']
            ],
        };
    }

    //lib.config.all.characters应该在precontent已经导入完成,加入card
    //lib.cardPack.mode_jinengpai = ['gezi_lianji','gezi_shenyou']
    //for (var i in lib.cardPack.mode_jinengpai) {
    //    lib.card[i] = lib.cardPack.mode_jinengpai[i];
    //    lib.cardPack.mode_jinengpai[i][4].push('ext:东方project/' + i + '.jpg');
    //    if (lib.config.forbidai_user.contains(i)) {
    //        lib.config.forbidai.push(i);
    //    }
    //}
    //card用此方法不行，需要移植card代码
    //lib.cardPack.mode_extension_chess_df = ["gezi_lianji", "gezi_qianxing", "gezi_lingyong", "gezi_ziheng", "gezi_firebook","gezi_waterbook","gezi_woodbook","gezi_dirtbook","gezi_goldbook","gezi_shenyou","gezi_shengdun"]
    for (var i in lib.characterPack.mode_extension_library_luanru) {
        lib.character[i] = lib.characterPack.mode_extension_library_luanru[i];
        lib.characterPack.mode_extension_library_luanru[i][4].push('ext:东方project/' + i + '.jpg');
        if (lib.config.forbidai_user.contains(i)) {
            lib.config.forbidai.push(i);
        }
    }
    for (var i in lib.characterPack.mode_extension_library) {
        lib.character[i] = lib.characterPack.mode_extension_library[i];
        lib.characterPack.mode_extension_library[i][4].push('ext:东方project/' + i + '.jpg');
        if (lib.config.forbidai_user.contains(i)) {
            lib.config.forbidai.push(i);
        }
    }
    if (get.mode() == 'chess') {
        for (var i in lib.characterPack.mode_extension_chess_df) {
            lib.character[i] = lib.characterPack.mode_extension_chess_df[i];
            lib.characterPack.mode_extension_chess_df[i][4].push('ext:东方project/' + i + '.jpg');
            if (lib.config.forbidai_user.contains(i)) {
                lib.config.forbidai.push(i);
            }
        }
    }
    var list = {
        gezi_tohka: '十香',
        gezi_kanade: '奏',
        gezi_nero: '尼禄',
        gezi_illyasviel: '伊莉雅',
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
        mode_extension_chess_df_character_config: '东方战旗',
        mode_extension_library_luanru_character_config: '乱入角色',
        mode_extension_library_character_config: '采花集',
        mode_extension_mingzhi_character_config: '明置角色',
    };
    for (var j in list) {
        lib.translate[j] = lib.translate[j] || list[j];
    }

    //牌堆替换
    game.removenCard = function(name, replace) {
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
        },
        //阵亡相关
        //game.createSkill("dieLiliAudio","东方project");
        lib.skill._gezizhengwangxiangguan = {
            trigger: {
                global: 'dieBegin',
            },
            priority: 2,
            forced: true,
            unique: true,
            frequent: true,
            content: function() {
                game.playAudio('..', 'extension', '东方project', trigger.player.name);
                if (trigger.player.node.lili) {
                    trigger.player.node.lili.hide();
                }
                if (trigger.player.node.fuka) {
                    trigger.player.node.fuka.hide();
                }
                if (trigger.player.hasJinengpai) {
                    var cards = trigger.player.getJinengpai('j');
                    for (var i = 0; i <= cards.length; i++) {
                        if (cards[i]) {
                            trigger.player.removeJudgen(cards[i]);
                        }
                    }
                }
            },
        }
    if (config.damagelili) {
        //没有灵力时无法造成伤害
        lib.skill._damagelili = {
            trigger: {
                source: "damageBefore",
            },
            forced: true,
            silent: true,
            logTarget: "player",
            filter: function(event, player) {
                if (!player.node.lili) return false;
                if (player.lili) return false;
                return event.num > 0;
            },
            content: function() {
                trigger.cancel();
            },
            ai: {
                effect: {
                    player: function(card, player, target) {
                        if (!player.node.lili) return;
                        if (player.lili) return;
                        if (get.tag(card, 'damage')) return -1;
                    },
                },
            },
        }
    }
    // 强化牌的地方
    lib.skill._enhance = {
            popup: false,
            trigger: {
                player: 'useCardToTargeted'
            },
            filter: function(event, player) {
                return (lib.card[event.card.name].enhance && event.player.lili > lib.card[event.card.name].enhance);
            },
            content: function() {
                player.loselili(lib.card[trigger.card.name].enhance);
                game.log(get.translation(player) + '强化了' + get.translation(trigger.card.name) + '。');
                if (!player.storage._enhance) {
                    player.storage._enhance = 1;
                } else {
                    player.storage._enhance += 1;
                }
            },
            check: function(event, player) {
                if (player.lili < 2) return false;
                var card = event.card;
                if (card.name == 'gezi_danmakucraze') {
                    return (player.countCards('h') < player.hp) || player.countCards('h', {
                        name: 'sha'
                    }) || player.hp >= 2;
                } else if (card.name == 'gezi_caifang') {
                    return player.lili > 2;
                } else if (card.name == 'gezi_xuyuanshu') {
                    return player.lili > 1;
                }
            },
            prompt: function(trigger, player) {
                return "是否消耗" + lib.card[trigger.card.name].enhance + '点灵力强化【' + lib.translate[trigger.card.name] + '】？';
            },
            prompt2: function(trigger, player) {
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
                    target: function(card, player, target, current) {
                        if (player.lili == 0 && get.tag(card, 'damage')) {
                            return 'zeroplayertarget';
                        }
                    },
                    player: function(card, player, target, current) {
                        if (card.source == 0 && get.tag(card, 'damage')) {
                            return 'zeroplayertarget';
                        }
                    },
                }
            },
        },
        // 强化的牌用完后清理标记
        lib.skill._enhanceend = {
            trigger: {
                player: 'useCardAfter'
            },
            forced: true,
            popup: false,
            filter: function(event, player) {
                return player.storage._enhance;
            },
            content: function() {
                if (player.storage._enhance && lib.card[trigger.card.name].enhance) {
                    player.storage._enhance = 0;
                }
            },
        },
        // 回合开始显示
        lib.skill._liliphasebegin = {
            trigger: {
                player: 'phaseBegin'
            },
            forced: true,
            // 一定要在符卡启动前使用
            priority: 200,
            popup: false,
            content: function() {
                // 回合开始时如果有不是极意的符卡就翻回去。
                if (player.node.fuka) {
                    if (player.storage.spell) {
                        var info = lib.skill[player.storage.spell];
                        if (info.spell) {
                            if (!info.infinite) player.Fuka();
                        }
                    }
                }
                player.stat.push({
                    card: {},
                    skill: {}
                });
            },
        },
        // 回合结束显示
        lib.skill._liliphaseend = {
            trigger: {
                player: 'phaseAfter'
            },
            forced: true,
            priority: -20,
            popup: false,
            content: function() {
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
        },
        // 灵力值变为0时，符卡结束
        lib.skill._0lili = {
            trigger: {
                player: 'changelili'
            },
            forced: true,
            priority: 20,
            popup: false,
            filter: function(event, player) {
                return player.node.fuka && player.lili < 1;
            },
            content: function() {
                if (player.storage.spell) {
                    game.log(get.translation(player) + '的灵力值变为0，符卡结束。');
                    player.Fuka();
                }
            },
        },
        // 符卡结束翻面回来，取除所有符卡技能。
        lib.skill._spellend = {
            trigger: {
                player: 'FukaEnd'
            },
            forced: true,
            popup: false,
            filter: function(event, player) {
                return true;
            },
            content: function() {
                if (player.node.fuka) {
                    var skillname = null;
                    var r = trigger.getParent();
                    while (r) {
                        if (!r.skill || !lib.skill[r.skill].spell) {} else {
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
        },
        //符卡
        lib.element.content.Fuka = function() {
            event.trigger('Fuka');
            const turnOn=function(){
                player.node.fuka = ui.create.div('.fuka', '<div>符<br>卡<div>', player);
                if (lib.config.background_audio) {
                    game.playlili('spell');
                }
                player.node.fuka.setBackgroundImage('extension/东方project/spell.gif');
                game.log(player, '启动符卡！');
                player.node.fuka.style.backgroundSize = '123px 123px';
                player.node.fuka.style.opacity = 0.2;
                player.node.fuka.style.backgroundRepeat = 'no-repeat';
                player.node.fuka.style.backgroundPosition = "center"
                ui.refresh(player);
            }
            const turnOff=function(){
                player.node.fuka.setBackgroundImage('');
                player.node.fuka.style.opacity = 0;
                game.log(player, '关闭符卡！');
                delete player.node.fuka;
            }
            let switch_bool=event.switch_bool;
            if(switch_bool!==undefined){
                if (switch_bool) {
                    turnOn();
                } else {
                    turnOff();
                }
            }else{
                if (!player.node.fuka) {
                    turnOn();
                } else {
                    turnOff();
                }
            }
            
        },
        lib.element.player.Fuka = function(switch_bool) {
            var next = game.createEvent('Fuka');
            next.player = this;
            next.switch_bool=switch_bool;
            next.setContent('Fuka');
            return next;
        },
        //更新灵力
        lib.element.player.updatelili = function() {
            if (!this.node.lili) return;
            if (this.node.lili.hide()) {
                this.node.lili.show();
            }
            if (_status.video && arguments.length == 0) return;
            if (this.lili >= this.maxlili) this.lili = this.maxlili;
            var lili = this.node.lili;
            lili.style.transition = 'none';
            if (this.maxlili == Infinity) {
                lili.innerHTML = '∞';
            } else if (game.layout == 'default' && this.maxlili > 14) {
                lili.innerHTML = this.lili + '/' + this.maxlili;
                lili.classList.add('text');
            } else if (get.is.newLayout() &&
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
            } else {
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
                    } else {
                        lili.childNodes[index].classList.add('lost');
                    }
                }
            }
            setTimeout(function() {
                lili.style.transition = '';
            });
            return this;
        }
    //获得灵力
    lib.element.content.gainlili = function() {
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
            player.changelili(num, false);
            player.$damagepop(num, 'pink');
            game.log(player, '获得了' + get.cnNumber(num) + '点灵力');
        }
    }
    lib.element.player.gainlili = function() {
        var next = game.createEvent('gainlili');
        next.player = this;
        var nocard, nosource;
        var event = _status.event;
        for (var i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == 'cards') {
                next.cards = arguments[i];
            } else if (get.itemtype(arguments[i]) == 'card') {
                next.card = arguments[i];
            } else if (get.itemtype(arguments[i]) == 'player') {
                next.source = arguments[i];
            } else if (typeof arguments[i] == 'object' && arguments[i].name) {
                next.card = arguments[i];
            } else if (typeof arguments[i] == 'number') {
                next.num = arguments[i];
            } else if (arguments[i] == 'nocard') {
                nocard = true;
            } else if (arguments[i] == 'nosource') {
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
    lib.element.content.loselili = function() {
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
    lib.element.player.loselili = function() {
        var next = game.createEvent('loselili');
        next.player = this;
        var nocard, nosource;
        var event = _status.event;
        for (var i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == 'cards') {
                next.cards = arguments[i];
            } else if (get.itemtype(arguments[i]) == 'card') {
                next.card = arguments[i];
            } else if (get.itemtype(arguments[i]) == 'player') {
                next.source = arguments[i];
            } else if (typeof arguments[i] == 'object' && arguments[i].name) {
                next.card = arguments[i];
            } else if (typeof arguments[i] == 'number') {
                next.num = arguments[i];
            } else if (arguments[i] == 'nocard') {
                nocard = true;
            } else if (arguments[i] == 'nosource') {
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
    //增加灵力上限
    lib.element.content.gainMaxlili = function() {
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
    lib.element.player.gainMaxlili = function() {
        var next = game.createEvent('gainMaxlili');
        next.player = this;
        next.num = 1;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'number') {
                next.num = arguments[i];
            } else if (typeof arguments[i] === 'boolean') {
                next.forced = arguments[i];
            }
        }
        next.setContent('gainMaxlili');
        return next;
    }
    //改变灵力
    lib.element.content.changelili = function() {
        event.trigger('changelili'); // 触发事件的地方
        if (!player.node.lili) return;
        player.lili += num;
        if (player.lili > player.maxlili) player.lili = player.maxlili;
        if (player.lili < 0) player.lili = 0;
        player.updatelili();
        player.setMark("_gezi_showlili",player.lili,false);
        if (event.popup !== false) {
            player.$damagepop(num, 'water'); // 这里改变的是颜色
        }
    }
    lib.element.player.changelili = function(num, popup) {
        var next = game.createEvent('changelili', false);
        next.num = num;
        if (popup != undefined) next.popup = popup;
        next.player = this;
        next.setContent('changelili');
        return next;
    }
    //场上灵力最大
    lib.element.player.isMaxlili = function(equal) {
        for (var i = 0; i < game.players.length; i++) {
            if (!game.players[i].node.lili) continue;
            if (game.players[i].isOut() || game.players[i] == this) continue;
            if (equal) {
                if (game.players[i].lili >= this.lili) return false;
            } else {
                if (game.players[i].lili > this.lili) return false;
            }
        }
        return true;
    }
    //图片特效
    lib.element.player.$effectn = function(name, frame, left, top) {
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
            } else {
                Animation.style.left = "5%";
                Animation.style.top = "50%";
                this.appendChild(Animation);
            }
            Animation.style.backgroundSize = "cover";
            var zhen = 0;
            var ID = setInterval(function() {
                var img = new Image();
                img.onload = function() {
                    //delete img;
                };
                img.onerror = function() {
                    zhen = frame + 1;
                };
                img.src = lib.assetURL + "image/effect/" + name + "/" + zhen + ".png";
                var SRC = lib.assetURL + "image/effect/" + name + "/" + zhen + ".png";
                if (zhen > frame) {
                    clearInterval(ID);
                    Animation.delete();
                    return;
                }
                Animation.setBackgroundImage(SRC);
                zhen++;
            }, 200);
        }
    }
    //gif新特效(然而没gif)
    lib.element.player.$effectnn = function(name, frame, left, top) {
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
            } else {
                Animation.style.left = "5%";
                Animation.style.top = "50%";
                this.appendChild(Animation);
            }
            Animation.style.backgroundSize = "cover";
            var SRC = lib.assetURL + "image/effect/" + name + ".gif";
            Animation.setBackgroundImage(SRC);
            setTimeout(function() {
                Animation.delete();
            }, 2000);
        }
    }

    if (config.yibianmoshi && get.mode() == 'identity') {
        // 出牌阶段的摊牌技能。
        lib.skill._tanpai = {
            line: true,
            enable: 'phaseUse',
            intro: {
                content: 'cards'
            },
            usable: 1,
            init: function(player) {
                player.storage._tanpai = [];
            },
            filter: function(event, player) {
                return player.identityShown != true;
            },
            content: function() {
                // 使用异变牌
                // 异变牌任选
                'step 0'
                var libincident = [];
                for (var i in lib.card) {
                    if (lib.card[i].type == 'zhenfa') {
                        if (lib.card[i].subtype == "yibianpai") {
                            libincident.add(i);
                        }
                    }
                }
                console.log(game.online);
                game.broadcastAll(function(player, identity) {
                    player.identityShown = true;
                    player.setIdentity(identity);
                    player.node.identity.classList.remove('guessing');
                }, player, player.identity);
                game.log(player, '的身份是', '#g' + get.translation(player.identity + '2'));
                player.$effectn('gezi_jinu_skill', 11);
                player.disableSkill('_tanpai');
                player.removeSkill('_tanpai');
                // 主公和内拿异变牌
                if (player.identity == "zhu" || player.identity == "nei") {
                    var num;
                    if (player.identity == 'zhu') num = Math.floor(Math.random() * (libincident.length - 1));
                    else num = Math.floor(Math.random() * (libincident.length));
                    player.chooseButton(['选择你本局要发动的异变', [libincident, 'vcard']], true).set('filterButton', function(button) {
                        return true;
                    }).set('ai', function(button) {
                        return button.link[2] == libincident[_status.event.num];
                    }).set('num', num);
                    // 忠：令一名角色抽牌	
                } else if (player.identity == "zhong") {
                    player.chooseTarget('【忠】身份明置效果：令一名角色摸一张牌', function(card, player, target) {
                        return true;
                    }).set('ai', function(target) {
                        if (target.identity == 'zhu') return true;
                        return get.attitude(_status.event.player, target) > 0;
                    });
                    // 反：伪采访一个
                } else if (player.identity == "fan") {
                    player.chooseTarget('【反】明置效果：令一名角色选择：弃一张牌或明置身份', function(card, player, target) {
                        return player != target && (target.countCards('h') || target.identityShown != true);
                    }).set('ai', function(target) {
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
                            result.targets[0].chooseControl(list, function(event, player) {
                                if (list.contains('_tanpai')) return '_tanpai';
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
                order: function(name, player) {
                    var cards = player.getCards('h');
                    if (player.countCards('h', 'sha') == 0) {
                        return 1;
                    }
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].name != 'sha' && cards[i].number > 11 && get.value(cards[i]) < 7) {
                            return 9;
                        }
                    }
                    return get.order({
                        name: 'sha'
                    }) - 1;
                },
                result: {
                    player: function(player) {
                        if (player.identity == 'fan') return 0.5;
                        if (player.identity == 'zhu') {
                            var num = game.countPlayer(function(current) {
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

        lib.skill._tanyibian = {
            enable: 'phaseUse',
            mark: true,
            intro: {
                mark: function(dialog, content, player) {
                    if (content && content.length) {
                        if (player == game.me || player.isUnderControl()) {
                            dialog.addAuto(content);
                        } else {
                            return '是什么呢，这' + get.cnNumber(content.length) + '异变？';
                        }
                    }
                },
                content: function(content, player) {
                    if (content && content.length) {
                        if (player == game.me || player.isUnderControl()) {
                            return get.translation(content);
                        }
                        return '是什么呢，这' + get.cnNumber(content.length) + '异变？';
                    }
                }
            },
            init: function(player) {
                player.storage._tanyibian = [];
            },
            filter: function(event, player) {
                return player.storage._tanyibian;
            },
            content: function() {
                var card = player.storage._tanyibian[0];
                player.addIncident(card);
                delete player.storage._tanyibian;
                player.unmarkSkill('_tanyibian');
            },
            ai: {
                order: 10,
                result: {
                    player: function(player, target) {
                        if (game.roundNumber > 1) return 3;
                        return -1;
                    }
                }
            },
        }

        lib.skill._enhance_yibianzhu = {
            trigger: {
                global: "gameStart",
            },
            priority: 66,
            filter: function(event, player) {
                return player.identity == "zhu" && player.identityShown == true;
            },
            forced: true,
            content: function() {
                'step 0'
                var libincident = [];
                for (var i in lib.card) {
                    if (lib.card[i].type == 'zhenfa') {
                        if (lib.card[i].subtype == "yibianpai") {
                            libincident.add(i);
                        }
                    }
                }
                // 主公拿异变牌
                if (player.identity == "zhu") {
                    var num;
                    num = Math.floor(Math.random() * (libincident.length - 1));
                    player.chooseButton(['选择你本局要发动的异变', [libincident, 'vcard']], true).set('filterButton', function(button) {
                        return true;
                    }).set('ai', function(button) {
                        return button.link[2] == libincident[_status.event.num];
                    }).set('num', num);
                }
                'step 1'
                if (result.bool) {
                    var card = game.createCard(result.links[0][2], 'yibianpai', '');
                    player.addIncident(card);
                }
            },
        }

        lib.translate._tanyibian = '明置异变牌'
        lib.translate._enhance_yibianzhu = '异变模式'
        lib.translate.discard = '弃牌'

    }

    if (config.mingzhiBool) {
        lib.element.content.choosePlayerCard = function() {
            "step 0"
            if (!event.dialog) event.dialog = ui.create.dialog('hidden');
            else if (!event.isMine) {
                event.dialog.style.display = 'none';
            }
            if (event.prompt) {
                event.dialog.add(event.prompt);
            } else {
                event.dialog.add('选择' + get.translation(target) + '的一张牌');
            }
            if (event.prompt2) {
                event.dialog.addText(event.prompt2);
            }
            var directh = true;
            for (var i = 0; i < event.position.length; i++) {
                if (event.position[i] == 'h') {
                    var hs = target.getCards('h');
                    if (hs.length) {
                        event.dialog.addText('手牌区');
                        hs.randomSort();
                        if (event.visible || target.isUnderControl(true)) {
                            event.dialog.add(hs);
                            directh = false;
                        } else {
                            if (target.storage.mingzhi) { //明置手牌
                                for (var j = 0; j < hs.length; j++) {
                                    if (target.storage.mingzhi.contains(hs[j])) {
                                        event.dialog.add([hs[j]]);
                                    } else {
                                        event.dialog.add([
                                            [hs[j]], 'blank'
                                        ]);
                                    }
                                }
                                directh = false;
                            } else {
                                event.dialog.add([hs, 'blank']);
                            }
                        }

                    }
                } else if (event.position[i] == 'e') {
                    var es = target.getCards('e');
                    if (es.length) {
                        event.dialog.addText('装备区');
                        event.dialog.add(es);
                        directh = false;
                    }
                } else if (event.position[i] == 'j') {
                    var js = target.getCards('j');
                    if (js.length) {
                        event.dialog.addText('判定区');
                        event.dialog.add(js);
                        directh = false;
                    }
                }
            }
            if (event.dialog.buttons.length == 0) {
                event.finish();
                return;
            }
            var cs = target.getCards(event.position);
            var select = get.select(event.selectButton);
            if (event.forced && select[0] >= cs.length) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons,
                    links: cs
                }
            } else if (event.forced && directh && select[0] == select[1]) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons.randomGets(select[0]),
                    links: []
                }
                for (var i = 0; i < event.result.buttons.length; i++) {
                    event.result.links[i] = event.result.buttons[i].link;
                }
            } else {
                if (event.isMine()) {
                    event.dialog.open();
                    game.check();
                    game.pause();
                } else if (event.isOnline()) {
                    event.send();
                } else {
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


        lib.element.content.discardPlayerCard = function() {
            "step 0"
            if (event.directresult) {
                event.result = {
                    buttons: [],
                    cards: event.directresult.slice(0),
                    links: event.directresult.slice(0),
                    targets: [],
                    confirm: 'ok',
                    bool: true
                };
                event.cards = event.directresult.slice(0);
                event.goto(2);
                return;
            }
            if (!event.dialog) event.dialog = ui.create.dialog('hidden');
            else if (!event.isMine) {
                event.dialog.style.display = 'none';
            }
            if (event.prompt == undefined) {
                var str = '弃置' + get.translation(target);
                var range = get.select(event.selectButton);
                if (range[0] == range[1]) str += get.cnNumber(range[0]);
                else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                str += '张';
                if (event.position == 'h' || event.position == undefined) str += '手';
                if (event.position == 'e') str += '装备';
                str += '牌';
                event.prompt = str;
            }
            if (event.prompt) {
                event.dialog.add(event.prompt);
            }
            if (event.prompt2) {
                event.dialog.addText(event.prompt2);
            }
            var directh = true;
            for (var i = 0; i < event.position.length; i++) {
                if (event.position[i] == 'h') {
                    var hs = target.getDiscardableCards(player, 'h');
                    if (hs.length) {
                        event.dialog.addText('手牌区');
                        hs.randomSort();
                        if (event.visible || target.isUnderControl(true)) {
                            event.dialog.add(hs);
                            directh = false;
                        } else {
                            if (target.storage.mingzhi) { //明置手牌
                                for (var j = 0; j < hs.length; j++) {
                                    if (target.storage.mingzhi.contains(hs[j])) {
                                        event.dialog.add([hs[j]]);
                                    } else {
                                        event.dialog.add([
                                            [hs[j]], 'blank'
                                        ]);
                                    }
                                }
                                directh = false;
                            } else {
                                event.dialog.add([hs, 'blank']);
                            }
                        }
                    }
                } else if (event.position[i] == 'e') {
                    var es = target.getDiscardableCards(player, 'e');
                    if (es.length) {
                        event.dialog.addText('装备区');
                        event.dialog.add(es);
                        directh = false;
                    }
                } else if (event.position[i] == 'j') {
                    var js = target.getDiscardableCards(player, 'j');
                    if (js.length) {
                        event.dialog.addText('判定区');
                        event.dialog.add(js);
                        directh = false;
                    }
                }
            }
            if (event.dialog.buttons.length == 0) {
                event.finish();
                return;
            }
            var cs = target.getCards(event.position);
            var select = get.select(event.selectButton);
            if (event.forced && select[0] >= cs.length) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons,
                    links: cs
                }
            } else if (event.forced && directh && select[0] == select[1]) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons.randomGets(select[0]),
                    links: []
                }
                for (var i = 0; i < event.result.buttons.length; i++) {
                    event.result.links[i] = event.result.buttons[i].link;
                }
            } else {
                if (event.isMine()) {
                    event.dialog.open();
                    game.check();
                    game.pause();
                } else if (event.isOnline()) {
                    event.send();
                } else {
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
            "step 2"
            event.resume();
            if (event.result.bool && event.result.links && !game.online) {
                if (event.logSkill) {
                    if (typeof event.logSkill == 'string') {
                        player.logSkill(event.logSkill);
                    } else if (Array.isArray(event.logSkill)) {
                        player.logSkill.apply(player, event.logSkill);
                    }
                }
                var cards = [];
                for (var i = 0; i < event.result.links.length; i++) {
                    cards.push(event.result.links[i]);
                }
                event.result.cards = event.result.links.slice(0);
                event.cards = cards;
                event.trigger("rewriteDiscardResult");
            }
            "step 3"
            if (event.boolline) {
                player.line(target, 'green');
            }
            if (!event.chooseonly) {
                var next = target.discard(event.cards, 'notBySelf');
                if (event.delay === false) {
                    next.set('delay', false);
                }
            }
        }

        lib.element.content.gainPlayerCard = function() {
            "step 0"
            if (event.directresult) {
                event.result = {
                    buttons: [],
                    cards: event.directresult.slice(0),
                    links: event.directresult.slice(0),
                    targets: [],
                    confirm: 'ok',
                    bool: true
                };
                event.cards = event.directresult.slice(0);
                event.goto(2);
                return;
            }
            if (!event.dialog) event.dialog = ui.create.dialog('hidden');
            else if (!event.isMine) {
                event.dialog.style.display = 'none';
            }
            if (event.prompt == undefined) {
                var str = '获得' + get.translation(target);
                var range = get.select(event.selectButton);
                if (range[0] == range[1]) str += get.cnNumber(range[0]);
                else if (range[1] == Infinity) str += '至少' + get.cnNumber(range[0]);
                else str += get.cnNumber(range[0]) + '至' + get.cnNumber(range[1]);
                str += '张';
                if (event.position == 'h' || event.position == undefined) str += '手';
                if (event.position == 'e') str += '装备';
                str += '牌';
                event.prompt = str;
            }
            if (event.prompt) {
                event.dialog.add(event.prompt);
            }
            if (event.prompt2) {
                event.dialog.addText(event.prompt2);
            }
            var directh = true;
            for (var i = 0; i < event.position.length; i++) {
                if (event.position[i] == 'h') {
                    var hs = target.getGainableCards(player, 'h');
                    if (hs.length) {
                        event.dialog.addText('手牌区');
                        hs.randomSort();
                        if (event.visible || target.isUnderControl(true)) {
                            event.dialog.add(hs);
                            directh = false;
                        } else {
                            if (target.storage.mingzhi) { //明置手牌
                                for (var j = 0; j < hs.length; j++) {
                                    if (target.storage.mingzhi.contains(hs[j])) {
                                        event.dialog.add([hs[j]]);
                                    } else {
                                        event.dialog.add([
                                            [hs[j]], 'blank'
                                        ]);
                                    }
                                }
                                directh = false;
                            } else {
                                event.dialog.add([hs, 'blank']);
                            }
                        }
                    }
                } else if (event.position[i] == 'e') {
                    var es = target.getGainableCards(player, 'e');
                    if (es.length) {
                        event.dialog.addText('装备区');
                        event.dialog.add(es);
                        directh = false;
                    }
                } else if (event.position[i] == 'j') {
                    var js = target.getGainableCards(player, 'j');
                    if (js.length) {
                        event.dialog.addText('判定区');
                        event.dialog.add(js);
                        directh = false;
                    }
                }
            }
            if (event.dialog.buttons.length == 0) {
                event.dialog.close();
                event.finish();
                return;
            }
            var cs = target.getCards(event.position);
            var select = get.select(event.selectButton);
            if (event.forced && select[0] >= cs.length) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons,
                    links: cs
                }
            } else if (event.forced && directh && select[0] == select[1]) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons.randomGets(select[0]),
                    links: []
                }
                for (var i = 0; i < event.result.buttons.length; i++) {
                    event.result.links[i] = event.result.buttons[i].link;
                }
            } else {
                if (event.isMine()) {
                    event.dialog.open();
                    game.check();
                    game.pause();
                } else if (event.isOnline()) {
                    event.send();
                } else {
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
            "step 2"
            event.resume();
            if (game.online || !event.result.bool) {
                event.finish();
            }
            "step 3"
            if (event.logSkill && event.result.bool && !game.online) {
                if (typeof event.logSkill == 'string') {
                    player.logSkill(event.logSkill);
                } else if (Array.isArray(event.logSkill)) {
                    player.logSkill.apply(player, event.logSkill);
                }
            }
            var cards = [];
            for (var i = 0; i < event.result.links.length; i++) {
                cards.push(event.result.links[i]);
            }
            event.result.cards = event.result.links.slice(0);
            event.cards = cards;
            event.trigger("rewriteGainResult");
            "step 4"
            if (event.boolline) {
                player.line(target, 'green');
            }
            if (!event.chooseonly) {
                if (event.delay !== false) {
                    var next = player.gain(event.cards, target, event.visibleMove ? 'give' : 'giveAuto', 'bySelf');
                } else {
                    var next = player.gain(event.cards, target, 'bySelf');
                    target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
                    if (event.visibleMove) next.visible = true;
                }
            } else target[event.visibleMove ? '$give' : '$giveAuto'](cards, player);
        }

        lib.element.content.lose = function() {
            "step 0"
            var evt = event.getParent();
            if (evt.name != 'discard' && event.type != 'discard') return;
            if (evt.animate != false) {
                evt.discardid = lib.status.videoId++;
                game.broadcastAll(function(player, cards, id) {
                    player.$throw(cards, null, 'nobroadcast');
                    var cardnodes = [];
                    cardnodes._discardtime = get.time();
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].clone) {
                            cardnodes.push(cards[i].clone);
                        }
                    }
                    ui.todiscard[id] = cardnodes;
                }, player, cards, evt.discardid);
                if (lib.config.sync_speed && cards[0] && cards[0].clone) {
                    if (evt.delay != false) {
                        var waitingForTransition = get.time();
                        evt.waitingForTransition = waitingForTransition;
                        cards[0].clone.listenTransition(function() {
                            if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                game.resume();
                            }
                            delete evt.waitingForTransition;
                        });
                    } else if (evt.getParent().discardTransition) {
                        delete evt.getParent().discardTransition;
                        var waitingForTransition = get.time();
                        evt.getParent().waitingForTransition = waitingForTransition;
                        cards[0].clone.listenTransition(function() {
                            if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                game.resume();
                            }
                            delete evt.getParent().waitingForTransition;
                        });
                    }
                }
            }
            "step 1"
            var hs = [],
                es = [],
                js = [];
            var hej = player.getCards('hej');
            event.stockcards = cards.slice(0);
            for (var i = 0; i < cards.length; i++) {
                cards[i].style.transform += ' scale(0.2)';
                cards[i].classList.remove('glow');
                cards[i].recheck();
                var info = lib.card[cards[i].name];
                if (info.destroy || cards[i]._destroy) {
                    cards[i].delete();
                    cards[i].destroyed = info.destroy || cards[i]._destroy;
                } else if (event.position) {
                    if (_status.discarded) {
                        if (event.position == ui.discardPile) {
                            _status.discarded.add(cards[i]);
                        } else {
                            _status.discarded.remove(cards[i]);
                        }
                    }
                    cards[i].goto(event.position);
                } else {
                    cards[i].delete();
                }
                //卡牌明置相关标记
                if (player.storage.mingzhi && player.storage.mingzhi.contains(cards[i])) {
                    if (player.storage.mingzhi.length == 1) {
                        delete player.storage.mingzhi;
                        player.unmarkSkill('mingzhi');
                    } else {
                        player.storage.mingzhi.remove(cards[i]);
                        player.syncStorage('mingzhi');
                    }
                    event.trigger('mingzhiCard');
                }


                if (!hej.contains(cards[i])) {
                    cards.splice(i--, 1);
                } else if (cards[i].parentNode) {
                    if (cards[i].parentNode.classList.contains('equips')) {
                        cards[i].original = 'e';
                        es.push(cards[i]);
                    } else if (cards[i].parentNode.classList.contains('judges')) {
                        cards[i].original = 'j';
                        js.push(cards[i]);
                    } else if (cards[i].parentNode.classList.contains('handcards')) {
                        cards[i].original = 'h';
                        hs.push(cards[i]);
                    } else {
                        cards[i].original = null;
                    }
                }
            }
            if (player == game.me) ui.updatehl();
            ui.updatej(player);
            game.broadcast(function(player, cards, num) {
                for (var i = 0; i < cards.length; i++) {
                    cards[i].classList.remove('glow');
                    cards[i].delete();
                }
                if (player == game.me) {
                    ui.updatehl();
                }
                ui.updatej(player);
                _status.cardPileNum = num;
            }, player, cards, ui.cardPile.childNodes.length);
            game.addVideo('lose', player, [get.cardsInfo(hs), get.cardsInfo(es), get.cardsInfo(js)]);
            event.cards2 = hs.concat(es);
            player.getHistory('lose').push(event);
            player.update();
            game.addVideo('loseAfter', player);
            event.num = 0;
            if (event.position == ui.ordering) {
                var evt = event.getParent();
                if (!evt.orderingCards) evt.orderingCards = [];
                if (!event.noOrdering && !event.cardsOrdered) {
                    event.cardsOrdered = true;
                    var next = game.createEvent('orderingDiscard', false, evt.getParent());
                    next.relatedEvent = evt;
                    next.setContent('orderingDiscard');
                }
                if (!event.noOrdering) evt.orderingCards.addArray(cards);
            }
            event.hs = hs;
            event.es = es;
            event.js = js;
            "step 2"
            if (num < cards.length) {
                if (cards[num].original == 'e') {
                    event.loseEquip = true;
                    player.removeEquipTrigger(cards[num]);
                    var info = get.info(cards[num]);
                    if (info.onLose && (!info.filterLose || info.filterLose(cards[num], player))) {
                        event.goto(3);
                        return;
                    }
                }
                event.num++;
                event.redo();
            } else {
                if (event.loseEquip) {
                    player.addEquipTrigger();
                }
                event.goto(4);
            }
            "step 3"
            var info = get.info(cards[num]);
            if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
                player.popup(cards[num].name);
                game.delayx();
            }
            if (Array.isArray(info.onLose)) {
                for (var i = 0; i < info.onLose.length; i++) {
                    var next = game.createEvent('lose_' + cards[num].name);
                    next.setContent(info.onLose[i]);
                    if (info.forceDie) next.forceDie = true;
                    next.player = player;
                    next.card = cards[num];
                }
            } else {
                var next = game.createEvent('lose_' + cards[num].name);
                next.setContent(info.onLose);
                next.player = player;
                if (info.forceDie) next.forceDie = true;
                next.card = cards[num];
            }
            event.num++;
            event.goto(2);
            "step 4"
            var evt = event.getParent();
            if (evt.name != 'discard' && event.type != 'discard') return;
            if (evt.delay != false) {
                if (evt.waitingForTransition) {
                    _status.waitingForTransition = evt.waitingForTransition;
                    game.pause();
                } else {
                    game.delayx();
                }
            }
        }
    }

    //按钮控制
    _status.gezidedongfanglili = config.gezidedongfanglili;
    _status.gezidelilistyle = config.gezidelilistyle;
    _status.mingzhiBool = config.mingzhiBool;
    _status.yibianmoshi = config.yibianmoshi;
    _status.stonetrans = config.stonetrans;
    //拥有技能牌
    lib.element.player.hasJinengpai = function() {
            var judges = this.node.judges.childNodes;
            for (var i = 0; i < judges.length; i++) {
                if (judges[i].classList.contains('removing')) continue;
                if (get.type(judges[i]) == 'jinengpai') {
                    return true;
                }
            }
            return false;
        },
        //技能牌数量
        lib.element.player.countJinengpai = function(arg1, arg2) {
            return this.getJinengpai(arg1, arg2).length;
        },
        //得到技能牌
        lib.element.player.getJinengpai = function(arg1, arg2) {
            if (typeof arg1 != 'string') {
                arg1 = 'j';
            }
            var cards = [],
                cards1 = [];
            var i, j;
            for (i = 0; i < arg1.length; i++) {
                if (arg1[i] == 'h') {
                    for (j = 0; j < this.node.handcards1.childElementCount; j++) {
                        if (!this.node.handcards1.childNodes[j].classList.contains('removing')) {
                            cards.push(this.node.handcards1.childNodes[j]);
                        }
                    }
                    for (j = 0; j < this.node.handcards2.childElementCount; j++) {
                        if (!this.node.handcards2.childNodes[j].classList.contains('removing')) {
                            cards.push(this.node.handcards2.childNodes[j]);
                        }
                    }
                } else if (arg1[i] == 'e') {
                    for (j = 0; j < this.node.equips.childElementCount; j++) {
                        if (!this.node.equips.childNodes[j].classList.contains('removing') && !this.node.equips.childNodes[j].classList.contains('feichu')) {
                            cards.push(this.node.equips.childNodes[j]);
                        }
                    }
                } else if (arg1[i] == 'j') {
                    for (j = 0; j < this.node.judges.childElementCount; j++) {
                        if (!this.node.judges.childNodes[j].classList.contains('removing') && this.node.judges.childNodes[j].classList.contains('feichu') && this.node.judges.childNodes[j].classList.contains('jinengpai')) {
                            cards.push(this.node.judges.childNodes[j]);
                            if (this.node.judges.childNodes[j].viewAs && arguments.length > 1) {
                                this.node.judges.childNodes[j].tempJudge = this.node.judges.childNodes[j].name;
                                this.node.judges.childNodes[j].name = this.node.judges.childNodes[j].viewAs;
                                cards1.push(this.node.judges.childNodes[j]);
                            }
                        }
                    }
                }
                if (arguments.length == 1) {
                    return cards;
                }
                if (arg2) {
                    if (typeof arg2 == 'string') {
                        for (i = 0; i < cards.length; i++) {
                            if (get.name(cards[i]) != arg2) {
                                cards.splice(i, 1);
                                i--;
                            }
                        }
                    } else if (typeof arg2 == 'object') {
                        for (i = 0; i < cards.length; i++) {
                            for (j in arg2) {
                                var value;
                                if (j == 'type' || j == 'subtype' || j == 'color' || j == 'suit' || j == 'number') {
                                    value = get[j](cards[i]);
                                } else {
                                    value = cards[i][j];
                                }
                                if ((typeof arg2[j] == 'string' && value != arg2[j]) ||
                                    (Array.isArray(arg2[j]) && !arg2[j].contains(value))) {
                                    cards.splice(i--, 1);
                                    break;
                                }
                            }
                        }
                    } else if (typeof arg2 == 'function') {
                        for (i = 0; i < cards.length; i++) {
                            if (!arg2(cards[i])) {
                                cards.splice(i--, 1);
                            }
                        }
                    }
                }
                for (i = 0; i < cards1.length; i++) {
                    if (cards1[i].tempJudge) {
                        cards1[i].name = cards1[i].tempJudge;
                        delete cards1[i].tempJudge;
                    }
                }
                return cards;
            }
        }
    //增加技能牌技能
    lib.element.player.addJinengpaiTrigger = function(card) {
            if (card) {
                var info = get.info(card);
                if (info.skills) {
                    for (var j = 0; j < info.skills.length; j++) {
                        this.addSkillTrigger(info.skills[j]);
                    }
                }
            } else {
                var n = this.getJinengpai();
                for (var i = 0; i < n.length; i++) {
                    this.addJinengpaiTrigger(n[i]);
                }
            }
            return this;
        },
        //移除技能牌技能
        lib.element.player.removeJinengpaiTrigger = function(card) {
            if (card) {
                var info = get.info(card);
                if (info.skills) {
                    for (var j = 0; j < info.skills.length; j++) {
                        this.removeSkillTrigger(info.skills[j]);
                    }
                }
                if (info.clearLose && typeof info.onLose == 'function') { //创建失去牌的事件
                    var next = game.createEvent('lose_' + card.name);
                    next.setContent(info.onLose);
                    next.player = this;
                    next.card = card;
                }
            } else {
                var n = this.getJinengpai();
                for (var i = 0; i < n.length; i++) {
                    this.removeJinengpaiTrigger(n[i]);
                }
            }
            return this;
        },
        //卡牌明置
        lib.skill.mingzhi = {
            intro: {
                content: 'cards',
            },
        },
        lib.translate.mingzhi = '明置';
    lib.element.player.mingzhiCard = function(cards, str) {
            var next = game.createEvent('mingzhiCard');
            next.player = this;
            next.str = str;
            // 如果cards是str（如果写反了，调换str和cards）
            if (typeof cards == 'string') {
                str = cards;
                cards = next.str;
                next.str = str;
            }
            if (get.itemtype(cards) == 'card') next.cards = [cards];
            else if (get.itemtype(cards) == 'cards') next.cards = cards;
            else _status.event.next.remove(next);
            next.setContent('mingzhiCard');
            next._args = Array.from(arguments);
            return next;
        },
        lib.element.content.mingzhiCard = function() {
            "step 0"
            if (get.itemtype(cards) != 'cards') {
                event.finish();
                return;
            }
            if (!event.str) {
                event.str = get.translation(player.name) + '明置了手牌';
            }
            event.dialog = ui.create.dialog(event.str, cards);
            event.dialogid = lib.status.videoId++;
            event.dialog.videoId = event.dialogid;

            if (event.hiddencards) {
                for (var i = 0; i < event.dialog.buttons.length; i++) {
                    if (event.hiddencards.contains(event.dialog.buttons[i].link)) {
                        event.dialog.buttons[i].className = 'button card';
                        event.dialog.buttons[i].innerHTML = '';
                    }
                }
            }
            game.broadcast(function(str, cards, cards2, id) {
                var dialog = ui.create.dialog(str, cards);
                dialog.videoId = id;
                if (cards2) {
                    for (var i = 0; i < dialog.buttons.length; i++) {
                        if (cards2.contains(dialog.buttons[i].link)) {
                            dialog.buttons[i].className = 'button card';
                            dialog.buttons[i].innerHTML = '';
                        }
                    }
                }
            }, event.str, cards, event.hiddencards, event.dialogid);
            if (event.hiddencards) {
                var cards2 = cards.slice(0);
                for (var i = 0; i < event.hiddencards.length; i++) {
                    cards2.remove(event.hiddencards[i]);
                }
                game.log(player, '明置了', cards2);
            } else {
                game.log(player, '明置了', cards);
            }
            game.delayx(2);
            game.addVideo('showCards', player, [event.str, get.cardsInfo(cards)]);
            "step 1"
            game.broadcast('closeDialog', event.dialogid);
            event.dialog.close();
            if (!player.storage.mingzhi) player.storage.mingzhi = cards;
            else player.storage.mingzhi = player.storage.mingzhi.concat(cards);
            player.markSkill('mingzhi');
            "step 2"
            event.trigger('mingzhiCard');
        },
        game.addJudgen = function(player, content) {
            if (player && content) {
                var card = get.infoCard(content[0]);
                card.viewAs = content[1];
                if (card.viewAs && card.viewAs != card.name && (card.classList.contains('fullskin') || card.classList.contains('fullborder'))) {
                    card.classList.add('fakejudge');
                    card.node.background.innerHTML = lib.translate[card.viewAs + '_bg'] || get.translation(card.viewAs)[0]
                }
                card.classList.add('drawinghidden');
                player.node.judges.insertBefore(card, player.node.judges.firstChild);
                ui.updatej(player);
            } else {
                console.log(player);
            }
        },
        game.playnBackgroundMusic = function(music, temp, marisa) {
            if (!marisa && config.backgroundmusicshow == 'marisa') return;
            if (!lib.config.background_music) lib.config.background_music = 'music_default';
            if (lib.config.background_music == 'music_off') {
                ui.backgroundMusic.src = '';
            } else {
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
                } else {
                    ui.backgroundMusic.src = url + 'extension/东方project/' + music + '.mp3';
                    ui.backgroundMusic.loop = true;
                }
            }
        },
        lib.skill.teshuchuwai = {
            init: function(player) {
                player.classList.add('out');
                player.hide();
            },
            onremove: function(player) {
                player.classList.remove('out');
                player.show();
            },
            mod: {
                cardEnabled: function() {
                    return false;
                },
                cardSavable: function() {
                    return false;
                },
                targetEnabled: function() {
                    return false;
                }
            },
            mark: true,
            intro: {
                content: '视为不在游戏内'
                // 那么应该使用game.player.isOut()之类的么？
            },
            group: ['undist', 'mianyi', 'qianxing'],
            trigger: {
                player: 'phaseBefore'
            },
            priority: 130,
            content: function() {
                trigger.cancel();
                player.phaseSkipped = true;
            },
        },
        lib.element.player.addnSkill = function(skill, checkConflict, nobroadcast) {
            if (Array.isArray(skill)) {
                for (var i = 0; i < skill.length; i++) {
                    this.addnSkill(skill[i]);
                }
            } else {
                if (this.skills.contains(skill)) return;
                var info = lib.skill[skill];
                if (!info) return;
                if (!nobroadcast) {
                    game.broadcast(function(player, skill) {
                        player.skills.add(skill);
                    }, this, skill);
                }
                this.skills.add(skill);
                this.addSkillTrigger(skill);
                if (this.awakenedSkills.contains(skill)) {
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
                    } else if (info.mark == 'card' &&
                        get.itemtype(this.storage[skill]) == 'cards') {
                        this.markSkill(skill, null, this.storage[skill][0]);
                    } else if (info.mark == 'image') {
                        this.markSkill(skill, null, ui.create.card(null, 'noclick').init([null, null, skill]));
                    } else if (info.mark == 'character') {
                        var intro = info.intro.content;
                        if (typeof intro == 'function') {
                            intro = intro(this.storage[skill], this);
                        } else if (typeof intro == 'string') {
                            intro = intro.replace(/#/g, this.storage[skill]);
                            intro = intro.replace(/&/g, get.cnNumber(this.storage[skill]));
                            intro = intro.replace(/\$/g, get.translation(this.storage[skill]));
                        }
                        var caption;
                        if (typeof info.intro.name == 'function') {
                            caption = info.intro.name(this.storage[skill], this);
                        } else if (typeof info.intro.name == 'string') {
                            caption = info.name;
                        } else {
                            caption = get.translation(skill);
                        }
                        this.markSkillCharacter(skill, this.storage[skill], caption, intro);
                    } else {
                        this.markSkill(skill);
                    }
                }
            }
            if (checkConflict) this.checkConflict();
            return skill;
        },
        lib.game.addnSkill = function(name, info, translate, description) {
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
        },
        lib.element.player.chosenToCompare = function(target, check) {
            var next = game.createEvent('chosenToCompare');
            next.player = this;
            if (Array.isArray(target)) {
                next.targets = target;
                if (check) next.ai = check;
                else next.ai = function(card) {
                    var addi = (get.value(card) >= 8 && get.type(card) != 'equip') ? -10 : 0;
                    var source = _status.event.source;
                    var player = _status.event.player;
                    if (source && source != player && get.attitude(player, source) > 1) {
                        return -get.number(card) - get.value(card) / 2 + addi;
                    }
                    return get.number(card) - get.value(card) / 2 + addi;
                }
                next.setContent('chosenToCompare');
            } else {
                next.target = target;
                if (check) next.ai = check;
                else next.ai = function(card) {
                    if (typeof card == 'string' && lib.skill[card]) {
                        var ais = lib.skill[card].check || function() {
                            return 0
                        };
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
                    } else {
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
        },
        lib.element.content.chosenToCompare = function() {
            "step 0"
            if (player.countCards('h') == 0 || target.countCards('h') == 0 || player == target) {
                event.result = {
                    cancelled: true,
                    bool: false
                }
                event.finish();
                return;
            }
            game.log(player, '对', target, '发起拼点');
            "step 1"
            var sendback = function() {
                if (_status.event != event) {
                    return function() {
                        event.resultOL = _status.event.resultOL;
                    };
                }
            };
            var str = '请选择拼点牌<br><br><div><div style="width:100%;text-align:center;font-size:14px">点数更大方为赢，点数相等为双方都没赢';
            if (lib.config.compare_discard) str += '<br>拼点完双方各摸一张牌</div>';
            if (player.isOnline()) {
                player.wait(sendback);
                event.ol = true;
                player.send(function(str, ai) {
                    game.me.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = ai;
                    game.resume();
                }, str, event.ai);
            } else {
                event.localPlayer = true;
                player.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = event.ai;
            }
            if (target.isOnline()) {
                target.wait(sendback);
                event.ol = true;
                target.send(function(str, ai) {
                    game.me.chooseCard(str, true).set('type', 'compare').set('glow_result', true).ai = ai;
                    game.resume();
                }, str, event.ai);
            } else {
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
            } catch (e) {
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
            game.broadcast(function() {
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
            } else {
                event.result.bool = false;
                str = get.translation(player.name) + '拼点失败';
                if (event.num1 == event.num2) {
                    event.result.tie = true;
                    player.popup('平');
                    target.popup('平');
                } else {
                    event.result.winner = target;
                    player.popup('负');
                    target.popup('胜');
                }
            }
            game.broadcastAll(function(str) {
                var dialog = ui.create.dialog(str);
                dialog.classList.add('center');
                setTimeout(function() {
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
            game.broadcastAll(function() {
                ui.arena.classList.remove('thrownhighlight');
            });
            game.addVideo('thrownhighlight2');
            if (event.clear !== false) {
                game.broadcastAll(ui.clear);
            }
            if (typeof event.preserve == 'function') {
                event.preserve = event.preserve(event.result);
            } else if (event.preserve == 'win') {
                event.preserve = event.result.bool;
            } else if (event.preserve == 'lose') {
                event.preserve = !event.result.bool;
            }
        },
        lib.element.player.addJudgen = function(card, cards) {
            var next = game.createEvent('addJudgen');
            next.card = card;
            next.cards = cards;
            if (next.cards == undefined) next.cards = [card];
            if (get.itemtype(next.cards) == 'card') next.cards = [next.cards];
            next.player = this;
            next.setContent('addJudgen');
            return next;
        },
        //添加技能牌
        lib.element.content.addJudgen = function() {
            "step 0"
            // 首先，持有这些卡的人失去这些卡。
            if (cards) {
                var owner = get.owner(cards[0]);
                if (owner) {
                    owner.lose(cards);
                }
            }
            // 然后，重置这张牌，这张牌明置，之类的……
            "step 1"
            if (cards[0].destroyed) {
                if (player.hasSkill(cards[0].destroyed)) {
                    delete cards[0].destroyed;
                } else {
                    event.finish();
                    return;
                }
            }
            cards[0].fix();
            cards[0].style.transform = '';
            cards[0].classList.remove('drawinghidden');
            cards[0]._transform = null;
            // 如果这卡是视为使用/转化的并且无效了就扔掉
            var viewAs = typeof card == 'string' ? card : card.name;
            if (!lib.card[viewAs] || !lib.card[viewAs].effect) {
                game.cardsDiscard(cards[0]);
            } else {
                // 然后插入.node.judges底部，添加废除与技能标记
                cards[0].style.transform = '';
                cards[0].classList.add('drawinghidden');
                cards[0].classList.add('feichu');
                cards[0].classList.add('jinengpai');
                //十周年ui技能牌（会改变全局ui）
                if (window.decadeUI) {
                    var css = function(t, s) {
                        s = document.createElement('style');
                        s.innerText = t;
                        document.body.appendChild(s);
                    };
                    css('.player>.judges>.card.feichu>.judge-mark>.judge::before{content:""}');
                    cards[0].node.judgeMark.node.judge.innerHTML = get.translation(viewAs)[0];
                }
                player.node.judges.appendChild(cards[0]);
                // 在这里追加效果就OK了吧
                var info = get.info(cards[0]);
                if (info.skills) {
                    for (var i = 0; i < info.skills.length; i++) {
                        player.addnSkill(info.skills[i]);
                    }
                }
                if (_status.discarded) {
                    _status.discarded.remove(cards[0]);
                }
                player.update();
                ui.updatej(player);
                // 这里是log部分
                game.broadcast(function(player, card, viewAs) {
                    card.fix();
                    card.style.transform = '';
                    card.classList.add('drawinghidden');
                    card.viewAs = viewAs;
                    if (viewAs && viewAs != card.name && (card.classList.contains('fullskin') || card.classList.contains('fullborder'))) {
                        card.classList.add('fakejudge');
                    } else {
                        card.classList.remove('fakejudge');
                    }
                    card.node.background.innerHTML = lib.translate[card.name] || get.translation(card.name)[0]
                    player.node.judges.insertBefore(card, player.node.judges.firstChild);
                    ui.updatej(player);
                    if (card.clone && (card.clone.parentNode == player.parentNode || card.clone.parentNode == ui.arena)) {
                        card.clone.moveDelete(player);
                        game.addVideo('gain2', player, get.cardsInfo([card]));
                    }
                }, player, cards[0], viewAs);
                //如果这张卡是复制的？鉴于后面跳过了，似乎是无意义？
                if (cards[0].clone && (cards[0].clone.parentNode == player.parentNode || cards[0].clone.parentNode == ui.arena)) {
                    cards[0].clone.moveDelete(player);
                    game.addVideo('gain2', player, get.cardsInfo(cards));
                }
                // player.$gain2(cards);
                if (get.itemtype(card) != 'card') {
                    if (typeof card == 'string') cards[0].viewAs = card;
                    else cards[0].viewAs = card.name;
                } else {
                    delete cards[0].viewAs;
                }
                // 这是转化后的log部分
                if (cards[0].viewAs && cards[0].viewAs != cards[0].name) {
                    if (cards[0].classList.contains('fullskin') || cards[0].classList.contains('fullborder')) {
                        cards[0].classList.add('fakejudge');
                        cards[0].node.background.innerHTML = lib.translate[cards[0].viewAs + '_bg'] || get.translation(cards[0].viewAs)[0];
                    }
                    game.log(player, '贴上了<span class="yellowtext">' + get.translation(cards[0].viewAs) + '</span>（', cards, '）');
                } else {
                    cards[0].classList.remove('fakejudge');
                    game.log(player, '贴上了', cards);
                }
                // 然后这里是动画
                game.addVideo('addJudge', player, [get.cardInfo(cards[0]), cards[0].viewAs]);
            }
            "step 2"
            //多了就扔掉
            var num = 3;
            //【中二】技能限制了技能牌上限为1
            if (player.storage.gezi_zhonger) {
                num = player.storage.gezi_zhonger;
            }
            if (player.countJinengpai('j') > num) {
                player.chosenPlayerCard('j', '技能牌数量达到上限，请移除一张技能牌', player, true);
            }
            "step 3"
            if (result.bool) {
                var cards = player.getJinengpai('j');
                for (var i = 0; i <= cards.length; i++) {
                    if (cards[i] && cards[i].name == result.links[0].name) {
                        player.removeJudgen(cards[i]);
                        break;
                    }
                }
            }
        }
    //移除技能牌
    lib.element.content.removeJudgen = function() {
        'step 0'
        var j = player.getJinengpai();
        if (j.contains(card)) {
            player.node.judges.removeChild(card);
            player.$throw(card);
            game.log(player, '移除了', card.name);
            player.update();
            ui.updatej(player);
        }
        'step 1'
        if (!player.countJinengpai('j', {
                name: card.name
            })) {
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
    lib.element.player.removeJudgen = function(card, cards) {
            var next = game.createEvent('removeJudgen');
            next.card = card;
            next.cards = cards;
            if (next.cards == undefined) next.cards = [card];
            if (get.itemtype(next.cards) == 'card') next.cards = [next.cards];
            next.player = this;
            next.setContent('removeJudgen');
            return next;
        },

        lib.element.content.recast = function() {
            "step 0"
            game.log(player, '重铸了', cards);
            player.lose(cards, event.position);
            if (event.animate != false) {
                event.discardid = lib.status.videoId++;
                game.broadcastAll(function(player, cards, id) {
                    player.$throw(cards, null, 'nobroadcast');
                    var cardnodes = [];
                    cardnodes._discardtime = get.time();
                    for (var i = 0; i < cards.length; i++) {
                        if (cards[i].clone) {
                            cardnodes.push(cards[i].clone);
                        }
                    }
                    ui.todiscard[id] = cardnodes;
                }, player, cards, event.discardid);
                if (lib.config.sync_speed && cards[0] && cards[0].clone) {
                    if (event.delay != false) {
                        var waitingForTransition = get.time();
                        event.waitingForTransition = waitingForTransition;
                        cards[0].clone.listenTransition(function() {
                            if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                game.resume();
                            }
                            delete event.waitingForTransition;
                        });
                    } else if (event.getParent().discardTransition) {
                        delete event.getParent().discardTransition;
                        var waitingForTransition = get.time();
                        event.getParent().waitingForTransition = waitingForTransition;
                        cards[0].clone.listenTransition(function() {
                            if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                game.resume();
                            }
                            delete event.getParent().waitingForTransition;
                        });
                    }
                }
            }
            event.trigger('recast');
            "step 1"
            if (event.delay != false) {
                if (event.waitingForTransition) {
                    _status.waitingForTransition = event.waitingForTransition;
                    game.pause();
                } else {
                    game.delayx();
                }
            }
            "step 2"
            var num = 0;
            for (var i = 0; i < cards.length; i++) {
                num++;
            }
            if (num > 0) player.draw(num);
        },
        lib.element.player.recast = function() {
            var next = game.createEvent('recast');
            next.player = this;
            next.num = 0;
            for (var i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) == 'player') {
                    next.source = arguments[i];
                } else if (get.itemtype(arguments[i]) == 'cards') {
                    next.cards = arguments[i];
                } else if (get.itemtype(arguments[i]) == 'card') {
                    next.cards = [arguments[i]];
                } else if (typeof arguments[i] == 'boolean') {
                    next.animate = arguments[i];
                } else if (get.objtype(arguments[i]) == 'div') {
                    next.position = arguments[i];
                }
            }
            if (next.cards == undefined) _status.event.next.remove(next);
            next.setContent('recast');
            return next;
        },
        game.incidentover = function(player, incident) {
            "step 0"
            //异变牌胜利条件失效
            var players = game.filterPlayer();
            for (var i = 0; i < players.length; i++) {
                if (players[i].hasSkill('gezi_mengjing2')) {
                    return;
                }
            }
            "step 1"
            // 玩家胜利
            player.$skill(get.translation(incident) + '胜利', null, null, true);
            game.log(get.translation(player) + '【' + get.translation(incident) + '】异变胜利！');
            game.saveConfig('gameRecord', lib.config.gameRecord);
            'step 2'
            //内异变胜利游戏不结束
            if ((get.mode() == 'identity' || get.mode() == 'old_identity') && player.identity == 'nei' && config.nei_end) return;
            'step 3'
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
            if (player.getFriends(true).contains(game.me)) {
                game.over(true);
            } else {
                game.over(false);
                return;
            }
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
        },
        //强行塞入一个装异变的玩意。
        lib.element.player.addIncident = function(card) {
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
                if ((this.identity == 'zhu' && config.gezimusicchange != 'off') || (this.identity == 'nei' && config.gezimusicchange == 'luren')) {
                    ui.backgroundMusic.src = '';
                    game.playnBackgroundMusic(card.name, false, true);
                }
                if ((this.identity == 'zhu' && config.gezibackgroundchange != 'off') || (this.identity == 'nei' && config.gezibackgroundchange == 'luren')) {
                    var str = 'extension/东方project/' + card.name + '.jpg';
                    ui.background.setBackgroundImage(str);
                }
            }
            // 并且，使用异变牌时，强行假装没有用牌，跳过效果
            //一键禁用异变胜利条件
            if (config.incidentoverbool) {
                for (var i = 0; i < get.info(card).incidentskills.length; i++) {
                    this.addnSkill(get.info(card).incidentskills[i]);
                }
                // 将异变牌加入记录（阿求不加）
                if (this.name == 'akyuu') return;
                if (!lib.config.gameRecord.incident) lib.config.gameRecord.incident = {
                    data: {}
                };
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
            if (config.incidentbool) {
                for (var j = 0; j < get.info(card).skills.length; j++) {
                    this.addnSkill(get.info(card).skills[j]);
                }
            }
            game.log(this, '明置了异变牌', card);
        },
        //选择卡牌，加入米斯蒂亚的专用变量，同时混入了技能牌
        lib.element.content.chosenPlayerCard = function() {
            "step 0"
            if (!event.dialog) event.dialog = ui.create.dialog('hidden');
            else if (!event.isMine) {
                event.dialog.style.display = 'none';
            }
            if (event.prompt) {
                event.dialog.add(event.prompt);
            } else {
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
                        if (target.storage.mingzhi) {
                            for (var j = 0; j < hs.length; j++) {
                                if (target.storage.mingzhi.contains(hs[j])) {
                                    event.dialog.add([hs[j]]);
                                } else {
                                    event.dialog.add([
                                        [hs[j]], 'blank'
                                    ]);
                                }
                            }
                            directh = false;
                        } else {
                            if (event.invisible) directh = false;
                            event.dialog.add([hs, 'blank']);
                        }
                    }
                } else if (event.position[i] == 'e' && target.countCards('e')) {
                    event.dialog.addText('装备区');
                    event.dialog.add(target.getCards('e'));
                    directh = false;
                } else if (event.position[i] == 'j' && target.countJinengpai('j')) {
                    event.dialog.addText('技能区');
                    event.dialog.add(target.getJinengpai('j'));
                    directh = false;
                }
            }
            if (event.dialog.buttons.length == 0) {
                event.finish();
                return;
            }
            var cs = target.getJinengpai(event.position);
            var select = get.select(event.selectButton);
            if (event.forced && select[0] >= cs.length) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons,
                    links: cs
                }
            } else if (event.forced && directh && select[0] == select[1]) {
                event.result = {
                    bool: true,
                    buttons: event.dialog.buttons.randomGets(select[0]),
                    links: []
                }
                for (var i = 0; i < event.result.buttons.length; i++) {
                    event.result.links[i] = event.result.buttons[i].link;
                }
            } else {
                if (event.isMine()) {
                    event.dialog.open();
                    game.check();
                    game.pause();
                } else if (event.isOnline()) {
                    event.send();
                } else {
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
        },
        lib.element.player.chosenPlayerCard = function() {
            var next = game.createEvent('chosenPlayerCard');
            next.player = this;
            for (var i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) == 'player') {
                    next.target = arguments[i];
                } else if (typeof arguments[i] == 'number') {
                    next.selectButton = [arguments[i], arguments[i]];
                } else if (get.itemtype(arguments[i]) == 'select') {
                    next.selectButton = arguments[i];
                } else if (typeof arguments[i] == 'boolean') {
                    next.forced = arguments[i];
                } else if (get.itemtype(arguments[i]) == 'position') {
                    next.position = arguments[i];
                } else if (arguments[i] == 'visible') {
                    next.visible = true;
                } else if (arguments[i] == 'invisible') {
                    next.invisible = true;
                } else if (typeof arguments[i] == 'function') {
                    if (next.ai) next.filterButton = arguments[i];
                    else next.ai = arguments[i];
                } else if (typeof arguments[i] == 'object' && arguments[i]) {
                    next.filterButton = get.filter(arguments[i]);
                } else if (typeof arguments[i] == 'string') {
                    next.prompt = arguments[i];
                }
            }
            if (next.filterButton == undefined) next.filterButton = lib.filter.all;
            if (next.position == undefined) next.position = 'he';
            if (next.selectButton == undefined) next.selectButton = [1, 1];
            if (next.ai == undefined) next.ai = function(button) {
                var val = get.buttonValue(button);
                if (get.attitude(_status.event.player, get.owner(button.link)) > 0) return -val;
                return val;
            };
            next.setContent('chosenPlayerCard');
            next._args = Array.from(arguments);
            return next;
        },
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
    lib.translate._tanpai = "异变";
    lib.translate.yibianpai = "异变";
    lib.translate.draw_spin = "摸牌并置于一张牌";
    lib.translate.jinengpai = "技能";
    lib.translate.extra_target = "额外目标";
    lib.translate.ADA2_backup = "扫荡的黄金剧场";
    lib.translate.gezi_time4_backup = "保存（取）";
    lib.translate.tutorial = "教程";
    if (config.gezidedongfanglili && get.mode() != 'library') {
        lib.skill._gezi_lili = {
            trigger: {
                global: 'gameDrawAfter',
                player: "enterGame",
            },
            silent: true,
            forced: true,
            popup: false,
            content: function() {
                if (get.mode() != 'stone') {
                    if (!player.node.lili) {
                        player.node.lili = ui.create.div('.hp.actcount', player);
                    }
                } else {
                    if (!player.node.lili) {
                        player.node.lili = ui.create.div('.hp.lili', player);
                    }
                }
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
            filter: function(event, player) {
                return player.node.lili;
            },
            content: function() {
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
            filter: function() {
                return get.mode() == 'stone';
            },
            content: function() {
                if (!trigger.source.node.lili) {
                    trigger.source.node.lili = ui.create.div('.hp.actcount', player);
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
    if (config.gezidedongfangkapai && get.mode() != 'library') {
        lib.skill._gezi_lilikapai = {
            enable: "phaseUse",
            usable: 1,
            cost: 1,
            filter: function(event, player) {
                return player.lili || !player.node.lili;
            },
            content: function() {
                "step 0"
                if (player.lili) {
                    player.loselili();
                }
                "step 1"
                var list = ["gezi_danmakucraze", "gezi_caifang", "gezi_pantsu", "gezi_louguan", "gezi_ibuki", "gezi_deathfan", "gezi_windfan", "gezi_saiqianxiang", "gezi_reidaisai", "gezi_yinyangyu", "gezi_zhiyuu", "gezi_mirror", "gezi_bailou", "gezi_houraiyuzhi", "gezi_hourai", "gezi_frog", "gezi_lunadial", "gezi_hakkero", "gezi_lantern", "gezi_stone", "gezi_simen", "gezi_huanxiang", "gezi_tianguo", "gezi_lingbi", "gezi_zuiye", "gezi_huazhi", "gezi_bingyu", "gezi_jingxia", "gezi_missile", "gezi_bagua", "gezi_book", "stg_bawu"]; //删除了魔剑莱瓦丁
                if (list.length) {
                    player.gain(game.createCard(list.randomGet()), 'gain2')._triggered = null;
                }
            },
            ai: {
                order: 11.2,
                result: {
                    player: function(player) {
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
        if (get.mode() != 'stone') {
            ui.css.lili_style = lib.init.css(lib.assetURL + 'extension/东方project', 'official');
        } else {
            ui.css.lili_style = lib.init.css(lib.assetURL + 'extension/东方project', 'lili');
        }
    }
    ui.css.attack_style = lib.init.css(lib.assetURL + 'extension/东方project', 'attack');
}
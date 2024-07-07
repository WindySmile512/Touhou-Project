import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export async function precontent(config, pack) {
    //在这里编写预启动阶段执行的代码
    if (config.enable) {
        //载入未来科技函数
        game.KJimport = function (type, content) {
            game.KJloadExtensioning = true;
            if (type == "extension") {
                game.KJloadExtension(content);
            }
        };
        game.KJloadExtension = function (obj) {
            try {
                obj = obj(lib, game, ui, get, ai, _status);
                var cfg = {};
                for (var j in lib.config) {
                    if (j.indexOf("extension_" + obj.name) == 0 && j != "extension_" + obj.name) {
                        cfg[j.slice(11 + obj.name.length)] = lib.config[j];
                    }
                }
                if (obj.precontent) {
                    obj.precontent(cfg);
                }
                if (obj.content) {
                    var packKJ = obj.package || {};
                    obj.content(cfg, packKJ);
                }
            } catch (e) {
                alert("载入错误：" + e);
            }
        };
        if (!lib.config.extension_未来科技_enable && !game.KJloadExtensioning) {
            lib.init.js(
                lib.assetURL + "extension/东方project/source/module",
                "KJ",
                function () {
                    KJZR(lib, game, ui, get, ai, _status);
                },
                function (e) {
                    alert(e);
                },
            );
            lib.init.js(
                lib.assetURL + "extension/东方project/source/module",
                "KJ2",
                function () {
                    KJZR(lib, game, ui, get, ai, _status);
                },
                function (e) {
                    alert(e);
                },
            );
        }
        game.addMode(
            "library",
            {
                game: {
                    syncMenu: true,
                },
                start: function () {
                    ui.auto.hide();
                    if (!lib.storage.scene) {
                        lib.storage.scene = {};
                    }
                    if (!lib.storage.stage) {
                        lib.storage.stage = {};
                    }
                    if (!_status.extensionmade) {
                        _status.extensionmade = [];
                    }
                    if (_status.extensionscene) {
                        game.save("scene", lib.storage.scene);
                    }
                    if (_status.extensionstage) {
                        game.save("stage", lib.storage.stage);
                    }
                    var dialog = ui.create.dialog("hidden");
                    dialog.classList.add("fixed");
                    dialog.classList.add("scroll1");
                    dialog.classList.add("scroll2");
                    dialog.classList.add("fullwidth");
                    dialog.classList.add("fullheight");
                    dialog.classList.add("noupdate");
                    dialog.classList.add("character");
                    dialog.contentContainer.style.overflow = "visible";
                    dialog.style.overflow = "scroll";
                    dialog.content.style.height = "100%";
                    dialog.contentContainer.style.transition = "all 0s";
                    if (!lib.storage.directStage) dialog.open();
                    var packnode = ui.create.div(".packnode", dialog);
                    lib.setScroll(packnode);
                    ui.background.setBackgroundImage("extension/东方project/gezi_library.jpg");
                    //背景图片
                    var clickCapt = function () {
                        var active = this.parentNode.querySelector(".active");
                        if (this.link == "stage") {
                            if (get.is.empty(lib.storage.scene)) {
                                alert("请创建至少1个场景");
                                return;
                            }
                        }
                        if (active) {
                            if (active == this) return;
                            for (var i = 0; i < active.nodes.length; i++) {
                                active.nodes[i].remove();
                                if (active.nodes[i].showcaseinterval) {
                                    clearInterval(active.nodes[i].showcaseinterval);
                                    delete active.nodes[i].showcaseinterval;
                                }
                            }
                            active.classList.remove("active");
                        }
                        this.classList.add("active");
                        for (var i = 0; i < this.nodes.length; i++) {
                            dialog.content.appendChild(this.nodes[i]);
                        }
                        var showcase = this.nodes[this.nodes.length - 1];
                        showcase.style.height = dialog.content.offsetHeight - showcase.offsetTop + "px";
                        if (typeof showcase.action == "function") {
                            if (showcase.action(showcase._showcased ? false : true) !== false) {
                                showcase._showcased = true;
                            }
                        }
                        if (this._nostart) start.show();
                        else start.hide();
                        game.save("currentLibrary", "help");
                    };
                    // 应该是这里是制作列表的地方
                    var createNode = function (name) {
                        var info = lib.library[name];
                        var node = ui.create.div(".dialogbutton.menubutton.large", info.name, packnode, clickCapt);
                        node.style.transition = "all 0s";
                        var caption = info.name;
                        var modeinfo = "";
                        if (info.mode) {
                            modeinfo = get.translation(info.mode) + "模式"; // 这个是标注哪个模式下使用的
                        }
                        if (info.submode) {
                            if (modeinfo) {
                                modeinfo += " - ";
                            }
                            modeinfo += info.submode;
                        }
                        var intro;
                        if (Array.isArray(info.intro)) {
                            intro = '<ul style="text-align:left;margin-top:0">';
                            if (modeinfo) {
                                intro += "<li>" + modeinfo;
                            }
                            for (var i = 0; i < info.intro.length; i++) {
                                intro += "<br>" + info.intro[i];
                            }
                        } else {
                            intro = "";
                            if (modeinfo) {
                                intro += "（" + modeinfo + "）";
                            }
                            intro += info.intro;
                        }
                        var today = new Date();
                        var i = ui.create.div(".text center", intro);
                        i.style.overflow = "scroll";
                        i.style.margin = "0px";
                        i.style.padding = "0px";
                        var showcase = ui.create.div();
                        showcase.style.margin = "0px";
                        showcase.style.padding = "0px";
                        showcase.style.width = "100%";
                        showcase.style.display = "block";
                        showcase.style.overflow = "scroll";
                        showcase.action = info.showcase;
                        showcase.link = name;
                        if (info.fullshow) {
                            node.nodes = [showcase];
                            showcase.style.height = "100%";
                        } else {
                            node.nodes = [i, showcase];
                        }
                        node.link = name;
                        node._nostart = info.nostart;
                        if (lib.storage.currentLibrary == name) {
                            clickCapt.call(node);
                        }
                        return node;
                    };
                    // 点那个巨大的“斗”之后
                    var clickStart = function () {
                        // dialog.delete();
                        // ui.auto.show();
                        // game.switchModen(info.mode);
                        var active = packnode.querySelector(".active");
                        if (active) {
                            for (var i = 0; i < active.nodes.length; i++) {
                                if (active.nodes[i].showcaseinterval) {
                                    clearInterval(active.nodes[i].showcaseinterval);
                                    delete active.nodes[i].showcaseinterval;
                                }
                            }
                            var info;
                            if (active.link.indexOf("stage_") == 0) {
                                var level;
                                if (Array.isArray(arguments[0])) {
                                    level = {
                                        index: arguments[0][1],
                                    };
                                } else {
                                    level = dialog.content.querySelector(".menubutton.large.active");
                                }
                                if (level) {
                                    var stagesave = lib.storage.stage;
                                    var stage = stagesave[active.link.slice(6)];
                                    game.save("lastStage", level.index);
                                    lib.onover.push(function (bool) {
                                        _status.createControl = ui.controls[0];
                                        if (bool && level.index + 1 < stage.scenes.length) {
                                            ui.create.control("下一关", function () {
                                                game.save("directStage", [stage.name, level.index + 1], "library");
                                                localStorage.setItem(lib.configprefix + "directstart", true);
                                                game.reload();
                                            });
                                            if (level.index + 1 > stage.level) {
                                                stage.level = level.index + 1;
                                                game.save("stage", stagesave, "library");
                                            }
                                            if (stage.mode != "sequal") {
                                                game.save("lastStage", level.index + 1, "library");
                                            }
                                        } else {
                                            ui.create.control("重新开始", function () {
                                                if (stage.mode == "sequal" && bool && level.index == stage.scenes.length - 1) {
                                                    game.save("directStage", [stage.name, 0], "library");
                                                } else {
                                                    game.save("directStage", [stage.name, level.index], "library");
                                                }
                                                localStorage.setItem(lib.configprefix + "directstart", true);
                                                game.reload();
                                            });
                                            if (stage.mode == "sequal" && level.index == stage.scenes.length - 1) {
                                                stage.level = 0;
                                                game.save("stage", stagesave, "library");
                                            }
                                            if (stage.mode != "sequal") {
                                                game.save("lastStage", level.index, "library");
                                            }
                                        }
                                        delete _status.createControl;
                                    });
                                    var scene = stage.scenes[level.index];
                                    info = {
                                        name: scene.name,
                                        intro: scene.intro,
                                    };
                                    for (var i in lib.library.scene.template) {
                                        info[i] = get.copy(lib.library.scene.template[i]);
                                    }
                                    if (!scene.gameDraw) {
                                        info.content.noGameDraw = true;
                                    }
                                    info.content.scene = scene;
                                } else {
                                    return;
                                }
                            } else {
                                info = lib.library[active.link];
                            }
                            lib.translate.restart = "返回";
                            dialog.delete();
                            ui.libraryinfo = ui.create.system("图鉴", null, true);
                            lib.setPopped(
                                ui.libraryinfo,
                                function () {
                                    var uiintro = ui.create.dialog("hidden");
                                    uiintro.add(info.name);
                                    var intro;
                                    if (Array.isArray(info.intro)) {
                                        intro = '<ul style="text-align:left;margin-top:0;width:450px">';
                                        for (var i = 0; i < info.intro.length; i++) {
                                            intro += "<li>" + info.intro[i];
                                        }
                                        intro += "</ul>";
                                    } else {
                                        intro = info.intro;
                                    }
                                    uiintro.add('<div class="text center">' + intro + "</div>");
                                    var ul = uiintro.querySelector("ul");
                                    if (ul) {
                                        ul.style.width = "180px";
                                    }
                                    uiintro.add(ui.create.div(".placeholder"));
                                    return uiintro;
                                },
                                250,
                            );
                            ui.auto.show();
                            _status.library = info.content;
                            game.switchModen(info.mode);
                            if (info.init) {
                                info.init();
                            }
                        }
                    };
                    // 制作那个“斗”的键的。去掉会出bug，不知道为什么
                    var start = ui.create.div(".menubutton.round.highlight", "斗", dialog.content, clickStart);
                    start.style.position = "absolute";
                    start.style.left = "auto";
                    start.style.right = "20px";
                    start.style.top = "auto";
                    start.style.bottom = "20px";
                    start.style.width = "80px";
                    start.style.height = "80px";
                    start.style.lineHeight = "80px";
                    start.style.margin = "0";
                    start.style.padding = "5px";
                    start.style.fontSize = "72px";
                    start.style.zIndex = 3;
                    start.style.transition = "all 0s";
                    start.hide();
                    game.addScene = function (name, clear) {
                        var scene = lib.storage.scene[name];
                        var library = {
                            name: name,
                            intro: scene.intro,
                        };
                        for (var i in lib.library.scene.template) {
                            library[i] = get.copy(lib.library.scene.template[i]);
                        }
                        if (!scene.gameDraw) {
                            library.content.noGameDraw = true;
                        }
                        library.content.scene = scene;
                        lib.library["scene_" + name] = library;
                        var node = createNode("scene_" + name);
                        if (clear) {
                            game.addSceneClear();
                            clickCapt.call(node);
                            _status.sceneChanged = true;
                        }
                    };
                    game.addStage = function (name, clear) {
                        var stage = lib.storage.stage[name];
                        var library = {
                            name: name,
                            intro: stage.intro,
                            content: {},
                        };
                        for (var i in lib.library.stage.template) {
                            library[i] = get.copy(lib.library.stage.template[i]);
                        }
                        library.content.stage = stage;
                        lib.library["stage_" + name] = library;
                        var node = createNode("stage_" + name);
                        if (clear) {
                            game.addStageClear();
                            clickCapt.call(node);
                        }
                    };
                    game.removeScene = function (name) {
                        delete lib.storage.scene[name];
                        game.save("scene", lib.storage.scene);
                        _status.sceneChanged = true;
                        for (var i = 0; i < packnode.childElementCount; i++) {
                            if (packnode.childNodes[i].link == "scene_" + name) {
                                if (packnode.childNodes[i].classList.contains("active")) {
                                    for (var j = 0; j < packnode.childElementCount; j++) {
                                        if (packnode.childNodes[j].link == "scene") {
                                            clickCapt.call(packnode.childNodes[j]);
                                        }
                                    }
                                }
                                packnode.childNodes[i].remove();
                                break;
                            }
                        }
                    };
                    game.removeStage = function (name) {
                        delete lib.storage.stage[name];
                        game.save("stage", lib.storage.stage);
                        for (var i = 0; i < packnode.childElementCount; i++) {
                            if (packnode.childNodes[i].link == "stage_" + name) {
                                if (packnode.childNodes[i].classList.contains("active")) {
                                    for (var j = 0; j < packnode.childElementCount; j++) {
                                        if (get.is.empty(lib.storage.scene)) {
                                            if (packnode.childNodes[j].link == "scene") {
                                                clickCapt.call(packnode.childNodes[j]);
                                            }
                                        } else {
                                            if (packnode.childNodes[j].link == "stage") {
                                                clickCapt.call(packnode.childNodes[j]);
                                            }
                                        }
                                    }
                                }
                                packnode.childNodes[i].remove();
                                break;
                            }
                        }
                    };
                    var sceneNode;
                    for (var i in lib.library) {
                        if (get.config(i) === false) continue;
                        if (i == "scene") {
                            sceneNode = createNode(i);
                        } else {
                            if (i == "updatelog" && location.hostname && !lib.device) continue;
                            if (i == "downloadlog" && (!location.hostname || lib.device)) continue;
                            createNode(i);
                        }
                    }
                    if (sceneNode) {
                        game.switchScene = function () {
                            clickCapt.call(sceneNode);
                        };
                    }
                    for (var i in lib.storage.scene) {
                        game.addScene(i);
                    }
                    for (var i in lib.storage.stage) {
                        game.addStage(i);
                    }
                    if (!lib.storage.currentLibrary) {
                        clickCapt.call(packnode.firstChild);
                    }
                    game.save("lastStage");
                    if (lib.storage.directStage) {
                        var directStage = lib.storage.directStage;
                        game.save("directStage");
                        clickStart(directStage);
                    }
                    if (lib.config.background_music != "music_off" && get.config("musicopen")) {
                        var today = new Date();
                        if (today.getMonth() == 9) {
                            game.playnBackgroundMusic("gezi_baka");
                        } else {
                            game.playnBackgroundMusic("gezi_library");
                        }
                    }
                    lib.init.onfree();
                },
                library: {
                    help: {
                        name: "欢迎光临!",
                        mode: "",
                        intro: [],
                        showcase: function (init) {
                            var node = this;
                            if (init) {
                                var player = ui.create.player(null, true);
                                lib.character["akyuu"] = ["female", "shen", 3, ["library_yixiang", "library_mengji", "mengji"], []];
                                lib.character["akyuu"][4].push("ext:东方project/akyuu.jpg");
                                lib.characterIntro["akyuu"] = "全名稗田阿求，将毕生奉献于记载幻想乡的历史的稗田家的现任家主。持有过目不忘的记忆能力。<br><b>画师：渡瀬　玲<br></b><br>现因一些原因，被赋予了幻想乡的管理员权限。不过依然是和平常一样做着记录屋的工作。";
                                lib.skill["mengji"] = {};
                                lib.translate["mengji"] = "隐藏";
                                lib.translate["mengji_info"] = "异变模式可用，为游戏添加一到三条规则。";
                                player.init("akyuu");
                                player.node.avatar.setBackgroundImage("extension/东方project/akyuu.jpg");
                                player.node.avatar.show();
                                player.style.left = "0px";
                                player.style.top = "0px";
                                player.style.zIndex = "10";
                                player.style.cursor = "pointer";
                                player.node.count.remove();
                                player.node.hp.remove();
                                player.style.transition = "all 0.5s";
                                player.onclick = function () {
                                    ui.arena.classList.add("only_dialog");
                                    var num;
                                    if (lib.config.gameRecord.incident && lib.config.gameRecord.incident.data["akyuu"]) {
                                        num = 3 - lib.config.gameRecord.incident.data["akyuu"];
                                        if (num <= 0) num = 0;
                                    } else {
                                        num = 3;
                                    }
                                    if (!lib.config.akyuu) {
                                        var d = '<div><div style="width:280px;margin-left:120px;font-size:18px">抱歉，' + lib.config.connect_nickname + "，我还没有准备好呢……再因异变牌胜利" + num + "次应该就可以了。……那个，要茶吗？</div>";
                                        if (num <= 0) d = '<div><div style="width:280px;margin-left:120px;font-size:18px">太好啦，' + lib.config.connect_nickname + "，我准备好了呢！快来异变模式玩吧！</div>";
                                        if (lib.config.connect_nickname == "黑白葱") d = '<div><div style="width:280px;margin-left:120px;font-size:18px">主人啊……你倒是什么时候才会不摸鱼啊？</div>';
                                        var dialog = ui.create.dialog(d);
                                        ui.create.div(".avatar", ui.dialog).setBackground("akyuu", "character");
                                        ui.create.control("没事，不用急", function () {
                                            dialog.close();
                                            while (ui.controls.length) ui.controls[0].close();
                                            ui.arena.classList.remove("only_dialog");
                                        });
                                    } else {
                                        var dialog = ui.create.dialog();
                                        dialog.classList.add("fixed");
                                        dialog.classList.add("scroll1");
                                        dialog.classList.add("scroll2");
                                        dialog.classList.add("fullwidth");
                                        dialog.classList.add("fullheight");
                                        dialog.classList.add("noupdate");
                                        dialog.classList.add("character");
                                        dialog.classList.remove("nobutton");
                                        dialog.style.top = "0px";

                                        var p = ui.create.player(null, true);
                                        p.init("akyuu");
                                        player.node.avatar.setBackgroundImage("extension/东方project/akyuu.jpg");
                                        p.node.avatar.show();
                                        p.style.left = "20px";
                                        p.style.top = "20px";
                                        p.style.zIndex = "10";
                                        p.style.cursor = "pointer";
                                        p.node.count.remove();
                                        p.classList.add("show");
                                        lib.translate["gezi_library"] = "平和";
                                        p.style.transition = "all 0.5s";
                                        dialog.appendChild(p);
                                        ui.create.div(".config.indent", '<div><div style="width:100%;left:140px;text-align:right;font-size:18px"><b><u>至今所发生过的异变：</b></u></div>', dialog);
                                        var list = [];
                                        for (i in lib.card) {
                                            if (lib.translate[i] && lib.card[i].type == "zhenfa") {
                                                list.push(i);
                                            }
                                        }
                                        dialog.addText('<div><div style="display:block;top:500px;text-align:left;font-size:16px">距离阿求下一次出场还有' + num + "次异变胜利。");
                                        list.push("gezi_library");
                                        for (var i = 0; i < list.length; i++) {
                                            if (!lib.config.gameRecord.incident.data[list[i]]) continue;
                                            var data = lib.config.gameRecord.incident.data[list[i]];
                                            ui.create.div(".config.indent", '<div><div style="width:100%;left:140px;text-align:right">' + lib.translate[list[i]] + "异变：" + data[0] + "次发生  " + data[1] + "胜<br>", dialog);
                                        }
                                        var control = ui.create.control("好了，谢谢！", function () {
                                            dialog.close();
                                            while (ui.controls.length) ui.controls[0].close();
                                            ui.arena.classList.remove("only_dialog");
                                        });
                                        var counter = 0;
                                        var f = get.rand(4);
                                        p.onclick = function () {
                                            if (counter > 6) return;
                                            var h = [
                                                ["其实流星夜有个四格漫画系列，可以在贴吧，公众号上和群里找到哟。", "主人没事做的时候，不仅会做漫画，也会做表情呢。所以，有有趣的情况请说给他听吧。", "别看主人那个样子，该忙的时候他还是会忙的啦。", "除了忙以外，灵感缺失也是一大问题呢。", "不过灵感缺失的一大方面，还是因为他的要求和想法总是太奇奇怪怪吧。", "不擅长弄一些正常的想法也不是坏事呢。毕竟，把我弄成这个样子……其实感觉也挺不错的呢。"],
                                                ["其实游戏开始的教程是我啦。对，就是问你名字的那个。……是个不错的名字呢，" + lib.config.connect_nickname + "。", "嗯？为什么我当时不露脸？主人觉得一开始不要出来那么多角色比较好。特别是，离我正式出场还有相当一段时间呢。", "我是怎么成为管理员的？主人说我不能战斗，又比较擅长这一块，而我觉得做管理员也挺有趣的。", "“不应该战斗那就别战斗”主人他是这么说的。确实，我也不觉得我有和其他人弹幕战的一天呢。", "如果能打弹幕战会怎么样？…………虽然我不反对试新事物，但是我有更重要的事情做呢。", "现在神主反常的开始高产起来了。我的工作也就自然越来越多了。没时间去参加弹幕战呢。而主人虽然也是越来越忙了，但是他却经常去乐悠悠的弹幕战。真是的……"],
                                                ["符卡和异变，是幻想乡中最重要的元素。异变推动着故事走向，亮出新人物，给已有人物追加新维度。", "而符卡则是战斗的核心。酷炫以外，战斗方式也是人心的镜子。如何运用能力，如何布置弹幕，都是很体现人物性格的。符卡更是如此。", "虽然符卡是有趣很多啦，但是我不会弹幕战，所以……我也没什么感觉。要研究符卡的话，魔理沙倒是有出书呢。", "我的工作则是记录幻想乡中的各色人物，和发生过的异变呢。成为管理员之后，也兼职进行规则的介绍了。", "异变毕竟是幻想乡中的超大变故，还会出现永久改变幻想乡的事情。大家每天吃的饭，用的牌……要记那种东西的话，就是一万辈子我也记不完啊。", "虽然有些异变也不是坏事，但是对于我们这些没有战斗力的人类，还是希望日子能正常一点好啊。啊……要是灵梦会老实干活就好了……"],
                                                ["幻想乡是个很神奇的地方。撰写《幻想乡缘起》的初衷是教导人类们对付妖怪现在看来，记载丰富多彩的大家也不错呢。", "其实幻想乡以前不是欢乐的地方。前几代巫女非常敬业，把妖怪们打的毫无还手之力。虽然正面冲突基本没有了，暗地里的袭击事件多了很多。", "而这代巫女，灵梦，是个很奇怪的人呢。她创建了符卡规则，让妖怪，人类，巫女，本来是类似食物链的关系，变成了可以同台对战。", "因为符卡规则，妖怪不但不惧怕，甚至还相当欢迎与巫女的正面冲突。也造成了异变事件常常发生。随着时间的推移，异变对人类的影响也越来越少。而本来可怕的妖怪，对人类的友好度也高了起来……", "即使是幻想乡，先吃饱才能表演的规则也是没变。所以，不用介意生计的妖怪们用异变进行表演，而异变则招来更多的妖怪…算是良性循环吧？", "是不是好事，我也说不上来。总之，我工作量是大幅度增加了呢……啊，不说了，我还要赶死线呢！"],
                                            ];
                                            var k = h[f][counter];
                                            if (counter == 6) k = lib.config.connect_nickname + "，虽然我并不讨厌和你说话,但是你肯定有更好的事情做吧？";
                                            var date = new Date();
                                            if (date.getHours() > 22 || date.getHours() < 8) k = "Zzz……";
                                            var d = ui.create.dialog('<div><div style="width:280px;margin-left:120px;">' + k + "</div>");
                                            ui.create.div(".avatar", d).setBackground("akyuu", "character");
                                            control.hide();
                                            var c = ui.create.control(counter != 6 ? "嗯嗯" : "抱歉……", function () {
                                                counter++;
                                                d.close();
                                                c.close();
                                                control.show();
                                            });
                                        };
                                    }
                                };
                                node.appendChild(player);
                                node.playernode = player;
                                var dialog = ui.create.dialog("hidden");
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.classList.add("fixed");
                                dialog.noopen = true;
                                node.appendChild(dialog);
                                var i = ["欢迎来到无名杀," + lib.config.connect_nickname + "!", "无名杀是一套以三国杀为原型的二次创作非商业化桌游游戏。", '<a href = "https://mp.weixin.qq.com/s/57EYPFZ1r0LSDzgYm2ZF7Q" target="_blank">详细介绍点这里</a>', "东方流星夜是基于无名杀1.9.51版的大型魔改。这里是东方project移植的流星夜图鉴。", "对游戏的不解，在我这里有规则，模式介绍，卡牌查询。 其它的不懂的，请去[其它-帮助]里查看。", "祝你游玩愉快！"];
                                var j = ["<u>程序使用须知：</u>", "1. 使用刷新键（f5）可以重置游戏。", "2.左上的[选项]可以更改很多游戏相关的设置，包括并不限于：", "<t>游戏模式的人数和身份分配", "牌局的布局，卡牌的样式 ([选项-选项-外观-布局]和[选项-选项-外观-卡牌样式/卡背样式])，", "和游戏录像。([选项-其他-录像])", "记得多多探索一下，没准有奇怪的东西！", "3. 在牌局中双击角色可以查看角色简介，也可以换皮肤和听配音（如果有配音的话）。", "3.1 在左上的[选项-角色]里双击角色牌也可以看到简介。", "4. 快捷键：按A托管，按space可以暂停，按W可以切换“不询问【无懈可击】”按钮", "5. 如果你在游戏过程中，可能会看到英文技能，不要惊讶，那是作者偷懒的结果。", "<b>6. 其实，点击我是可以跟我说话的啦。就上方那个。</b>"];
                                if (!game.layout == "nova") {
                                    //布局
                                    dialog.addText('<div><div style="display:block;left:180px;text-align:left;font-size:16px">' + i.join("<br>"));
                                    dialog.addText('<div><div style="display:block;top:240px;text-align:left;font-size:16px">' + j.join("<br>"));
                                } else {
                                    dialog.addText('<div><div style="display:block;left:150px;text-align:left;font-size:16px">' + i.join("<br>"));
                                    dialog.addText('<div><div style="display:block;top:210px;text-align:left;font-size:16px">' + j.join("<br>"));
                                }
                            }
                        },
                    },
                    /*
                        new:{
                            name:'例子',
                            mode:'',
                            intro:['','','','','','','',''],
                            showcase:function(init){
                            },
                        },
                        */
                    downloadlog: {
                        //这里是网页版使用的
                        name: "下载事宜",
                        mode: "",
                        intro: ["无名杀的数据库在github，github是美国的代码仓库，国外断网是日常啦！", "可以去群里获得相关数据包，找到对面文件夹解压覆盖即可。"],
                        showcase: function (init) {
                            if (init) {
                                var style2 = {
                                    position: "relative",
                                    display: "block",
                                    left: 10,
                                    top: 0,
                                    marginBottom: "6px",
                                    padding: 0,
                                    width: "100%",
                                };
                                var line2 = ui.create.div(style2, this);
                                line2.style.lineHeight = "50px";
                                var dialog = ui.create.dialog("hidden", line2);
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.addText("喏，" + lib.config.connect_nickname + '，<a href = "https://mp.weixin.qq.com/s/2dvbkhEezGQn7pUjETRlpQ" target = " _blank">这里也有教程哟。</a>');
                                dialog.classList.add("fixed");
                                dialog.noopen = true;
                                this.appendChild(dialog);
                                var incident = ui.create.node(
                                    "button",
                                    "电脑端下载",
                                    line2,
                                    function () {
                                        var i = ["下载链接：", "这里是东方流星夜的下载链接，某些特殊情况下使用的。", '国外镜像：<a href = "https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars/archive/master.zip">https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars/archive/master.zip</a>', "国内镜像：<a href = https://bws.coding.net/api/share/download/bcf9e902-4fd3-4919-9fc9-f681388b0523</a>", "", "国内镜像因神奇腾讯有可能炸了，还请大家注意。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var identity = ui.create.node(
                                    "button",
                                    "手机端下载",
                                    line2,
                                    function () {
                                        var i = ["手机端目前只支持安卓系统。为您带来的不便表达万分歉意。", "", '百度网盘链接：<a href = "https://pan.baidu.com/s/14ogm9-RAdDuuXUGTZYC_qA</a>', "提取码：en6f"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var versus = ui.create.node(
                                    "button",
                                    "我的存档啊！",
                                    line2,
                                    function () {
                                        var i = ["要保存你的数据的话，首先，从[选项-选项-文件-导出游戏设置]，把当前的游戏设置保存下来。", "然后，打开下载的程序，从[选项-选项-文件-导入游戏设置]，把刚存下来的游戏设置导入。", "", "这个操作也可以同样用于把本地的数据导入网页版，或者把电脑的数据导入手机。", "但是注意的是，像自己加的皮肤，自己加的音乐与配音这些本地素材，是无法导入网页版的。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                            }
                        },
                    },
                    updatelog: {
                        name: "更新事宜",
                        mode: "",
                        intro: ["更新注意！"],
                        showcase: function (init) {
                            if (init) {
                                var style2 = {
                                    position: "relative",
                                    display: "block",
                                    left: 10,
                                    top: 0,
                                    marginBottom: "6px",
                                    padding: 0,
                                    width: "100%",
                                };
                                var line2 = ui.create.div(style2, this);
                                line2.style.lineHeight = "50px";
                                var dialog = ui.create.dialog("hidden", line2);
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.addText("有什么更新相关的问题吗，" + lib.config.connect_nickname + "？");
                                dialog.classList.add("fixed");
                                dialog.noopen = true;
                                this.appendChild(dialog);
                                var incident = ui.create.node(
                                    "button",
                                    "更新方式",
                                    line2,
                                    function () {
                                        var i = ["更新方式有三种:", "1: 下载更新程序包", '<a href = "https://mp.weixin.qq.com/s/1zfstbhzlGvaW6E33oSnnQ" target="_blank">教你下载最新无名杀</a>', "无名杀数据通过下面三个网盘链接下载。", '<a href = "https://pan.baidu.com/s/1CqSyEelJfuMhnPgFGJFWKg" target="_blank">百度网盘分流数据包  </a>提取码:70yq ', '<a href = "https://pan.baidu.com/s/11CtKq7K7t5NFb_AAddMcVg" target="_blank">安卓客户端   </a>提取码:ug3c', '<a href = "https://pan.baidu.com/s/1tiH_EcbbKhILce3fJmIPcA" target="_blank">Windows客户端   </a>提取码:u890', "下载完毕后，在浏览器的默认下载文件夹里可以找到，然后解压到无名杀所在的文件夹里，并全部覆盖就OK啦。", "手机端也可以使用这个更新方式，安卓手机所需要拖到的文件夹在：<b>(默认SD卡)/android/data/com.widget.noname</b>", "覆盖完毕后，需要重启无名杀程序！", "", "2. 游戏内更新，在<b>[选项-其他-更新]</b>下有多个更新选项", "[检查游戏更新]是检查游戏的文件更新，有可能可以使用，也有可能不能使用。（网络问题，服务器问题之类的）", "[检查素材更新]是检查游戏新加的素材。 但是只能检查新加的素材，无法更新被覆盖的旧素材。", "检查素材更新在电脑和手机端都可以进行。", "", "3. 手机端更新，可以在<b>[选项—选项—文件—重新下载游戏]</b>来进行更新。", "这样会保留所有的设置，但是并不会更新素材。素材需要另外进行更新。", "", "4. 如果以上方法都不行，你可以去群里下载。", '<a href = "https://qinkunwei.gitee.io/noname/" target="_blank">交流网站点这里</a>'];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var identity = ui.create.node(
                                    "button",
                                    "相关链接",
                                    line2,
                                    function () {
                                        var i = [
                                            "无名杀的作者为水乎（贴吧id）。群内都叫做村长。",
                                            "",
                                            "一个无名杀的拓展作者自制的交流网站，教程和群号都有。",
                                            '<a href = "https://qinkunwei.gitee.io/noname/" target="_blank">交流网站点这里</a>',
                                            "",
                                            "设置相关",
                                            '<a href = "https://mp.weixin.qq.com/s/Jok6bpHbg6-CkOQTkpDuTg" target="_blank">设置篇</a>',
                                            "",
                                            "新版本新函数说明。（更新者为苏婆马里奥，现在的无名杀更新者）",
                                            '<a href = "http://tieba.baidu.com/p/6162185467?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.0.0.0&st=1578210420&unique=FF443B33E43BBC43777C4B7388A96693" target="_blank">新版本新函数</a>',
                                            "",
                                            "使人怀恋的拓展作者（纪念某些已弃坑的作者）",
                                            '<a href = "https://mp.weixin.qq.com/s/NdqMJ-bnVcefs3NHoZEA0w" target="_blank">使人怀念的拓展作者</a>',
                                            "",
                                            "百度贴吧拓展评测",
                                            '<a href = "https://tieba.baidu.com/p/6635697950" target="_blank">贴吧拓展评测</a>',
                                            "",
                                            //'网页',
                                            //'<a href = "3D.html" target="_blank">网页</a>',
                                            //'',
                                        ];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var versus = ui.create.node(
                                    "button",
                                    "拓展相关",
                                    line2,
                                    function () {
                                        var i = ["部分拓展的介绍，贴吧里很多链接都失效了，最好是去群里下载。", "神器：代码搜索器。", "部分拓展可以关注微信公众号（无名杀DIY定制）寻找。", '<a href = "http://mp.weixin.qq.com/mp/homepage?__biz=MzU1NTI2Mzc0NA==&hid=1&sn=4a88e933ac611af4328aacc95da5e14f&scene=18#wechat_redirect" target="_blank">拓展资讯</a>', "部分大型拓展贴吧地址如下", '<a href = "http://tieba.baidu.com/p/5864374860?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.0.0.0&st=1578210297&unique=745F1CFE046C7D6C427D8EDBC26B4E4E" target="_blank">拓展ol</a>', '<a href = "http://tieba.baidu.com/p/6100673452?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.0.0.0&st=1578210903&unique=9E67946D8E38BCDA44245597F7853919" target="_blank">金庸群侠传</a>', "群英会（去获取拓展里下载，贴吧链接炸了）", '<a href = "http://tieba.baidu.com/p/5602770701?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.0.0.0&st=1578210386&unique=E91E395EEB6E0171791507A1CB08FE9A" target="_blank">极略三国</a>', '<a href = "http://tieba.baidu.com/p/6470056961?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.1.8.2&st=1582171543&unique=9A2B10C23C6D971A7417DB528EC1E32A" target="_blank">混沌界</a>', '<a href = "http://tieba.baidu.com/p/5785758604?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.1.8.2&st=1582171616&unique=BB1F6516DB4BDE8AB36FBE8D910B4DF2" target="_blank">王者荣耀</a>', "作者包（纪念作者的拓展包）", "风华绝代（某付费群专属拓展）"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                            }
                        },
                    },
                    ruleview: {
                        name: "规则帮助",
                        mode: "",
                        intro: ["虽然新规则看起来有点太复杂，很麻烦，但是不用担心，规则比看起来的要容易理解多了！", ""],
                        showcase: function (init) {
                            if (init) {
                                var style2 = {
                                    position: "relative",
                                    display: "block",
                                    left: 10,
                                    top: 0,
                                    marginBottom: "6px",
                                    padding: 0,
                                    width: "100%",
                                };
                                var line2 = ui.create.div(style2, this);
                                line2.style.lineHeight = "50px";
                                var dialog = ui.create.dialog("hidden", line2);
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.addText("");
                                dialog.addText("");
                                dialog.addText("请选择你想要了解的系统，" + lib.config.connect_nickname + "，我会尽力解答的！");
                                dialog.classList.add("fixed");
                                dialog.noopen = true;
                                this.appendChild(dialog);
                                var incident = ui.create.node(
                                    "button",
                                    "灵力值是什么？",
                                    line2,
                                    function () {
                                        var i = ["<u>灵力值</u>:（角色下的绿色星星，或者蓝圆圈）", "用途：强化卡牌和启动符卡需要用。", "炉石模式随从的灵力值为蓝圆圈。", "关闭[启用灵力]值的选项后除了闯关模式将不会往游戏导入灵力值ui和符卡ui（ui发生错误时关闭灵力值即可）。", "闯关模式会强制导入灵力值ui和符卡ui。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var identity = ui.create.node(
                                    "button",
                                    "游戏牌有哪些新设定？",
                                    line2,
                                    function () {
                                        var i = ["游戏牌有很多小改动。其实你跟着感觉走就行，但是多了解些绝对不是坏事！", "<u>强化</u>：持有“强化”的牌通过消耗标注量的灵力可以强化，结算时追加描述里的效果", "", "<u>追加效果</u>：这牌有追加的效果。使用追加效果不算使用牌。", ""];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var versus = ui.create.node(
                                    "button",
                                    "符卡怎么使用？",
                                    line2,
                                    function () {
                                        var i = ["<u>符卡技</u>：游戏的核心技能系统。", "在幻想乡怎么可以不会用符卡呢！对吧！", "", "启动后，玩家持有符卡技描述中的技能，并且<u>不能获得灵力</u>，直到符卡结束。", "<u>符卡结束时机</u>：1.当前回合结束；2. 灵力值变化为0", "", "<u>符卡标签</u>：<br><u><永续></u>符卡结束时机1改为你的下个回合开始时；<br><u><瞬发></u>你可以在需要使用符卡描述技能时，发动符卡并立即使用（正常发动条件生效）;", "<u><限定></u>一局游戏只能启动一次；<br><u><终语></u>在决死状态可以启动（正常发动条件生效）；<br><u><极意></u>删除符卡结束时机1，符卡结束时，立即死亡", ""];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var boss = ui.create.node(
                                    "button",
                                    "技能牌是什么？",
                                    line2,
                                    function () {
                                        var i = ["技能牌是一种特殊牌，位于判定区底端，但只能通过特殊函数调用。（因为无名杀主体根本没有）", "技能牌与装备牌类似，摸到后可以任意使用上面的技能，且一次最多持有3张。", "", "贴上的技能牌不进入牌堆或弃牌堆，失去时直接移除游戏。（但是不触发移除游戏的技能，因为我懒得写了。）", "除此之外，技能牌不参也无名杀主体的部分功能。", "通过技能贴上的技能牌没有花色，点数，所以不能用于满足对应的要求。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var tafang = ui.create.node(
                                    "button",
                                    "其他注意事项？",
                                    line2,
                                    function () {
                                        var i = ["", "关于卡牌明置：修改了游戏的数个函数，如果不玩相关武将不建议开启。", "", "关于新模式：新模式是无法隐藏的，只能通过关闭此拓展关闭。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                            }
                        },
                    },
                    tutorial: {
                        name: "教程",
                        mode: "tutorial",
                        nostart: true,
                        intro: ["东方project教程模式", "模式中，记录了一定的本拓展规则。", "请按照教程提示进行游戏，否则会出现各种奇奇怪怪的bug。", "请不要在教程模式中使用各种奇奇怪怪的技能，否则bug警告。"],
                        showcase: function (init) {
                            var node = this;
                            var func = function () {
                                var list = ["gezi_danmakucraze", "gezi_caifang", "gezi_pantsu", "gezi_louguan", "gezi_ibuki", "gezi_deathfan", "gezi_windfan", "gezi_saiqianxiang", "gezi_reidaisai", "gezi_yinyangyu", "gezi_zhiyuu", "gezi_mirror", "gezi_bailou", "gezi_houraiyuzhi", "gezi_hourai", "gezi_frog", "gezi_lunadial", "gezi_hakkero", "gezi_lantern", "gezi_stone", "gezi_simen", "gezi_huanxiang", "gezi_tianguo", "gezi_lingbi", "gezi_zuiye", "gezi_huazhi", "gezi_bingyu", "gezi_jingxia", "gezi_missile", "gezi_bagua", "gezi_book", "stg_bawu"];
                                var card = game.createCard(list.randomGet(), "noclick");
                                node.nodes.push(card);
                                card.style.position = "absolute";
                                var rand1 = Math.round(Math.random() * 100);
                                var rand2 = Math.round(Math.random() * 100);
                                var rand3 = Math.round(Math.random() * 40) - 20;
                                card.style.left = "calc(" + rand1 + "% - " + rand1 + "px)";
                                card.style.top = "calc(" + rand2 + "% - " + rand2 + "px)";
                                card.style.transform = "scale(0.8) rotate(" + rand3 + "deg)";
                                card.style.opacity = 0;
                                node.appendChild(card);
                                ui.refresh(card);
                                card.style.opacity = 1;
                                card.style.transform = "scale(1) rotate(" + rand3 + "deg)";
                                if (node.nodes.length > 7) {
                                    setTimeout(function () {
                                        while (node.nodes.length > 5) {
                                            node.nodes.shift().delete();
                                        }
                                    }, 500);
                                }
                            };
                            if (init) {
                                node.nodes = [];
                                for (var i = 0; i < 5; i++) {
                                    func();
                                }
                            }
                            node.showcaseinterval = setInterval(func, 1000);
                        },
                    },
                    stone: {
                        name: "魔改炉石",
                        mode: "stone",
                        nostart: true,
                        intro: ["炉石模式的魔改！", "", "增加了攻击力设定。", "主将攻击力显示在面板上，每有2个友方随从，主将增加1攻击力。", "随从攻击力在右上方。", "对随从造成伤害或令其回复体力时,基础数值为攻击力。", "如死亡之翼描述为造成2伤害，实际为死亡之翼（攻击力+1）的伤害。", "对主将的默认值为1。", "攻击力再高不喝酒打主将都是1伤害。", "", "初始行动值+1。", "", "和炉石模式共用卡组。和炉石模式共用选项。", "", "修改了部分基础数值。", "", "平衡性较差，请谨慎使用。"],
                    },
                    modeview: {
                        name: "游戏模式",
                        mode: "",
                        intro: ["每个模式都在左上角的[选项——开始]里可以进行各种设置！"],
                        showcase: function (init) {
                            if (init) {
                                var style2 = {
                                    position: "relative",
                                    display: "block",
                                    left: 10,
                                    top: 0,
                                    marginBottom: "6px",
                                    padding: 0,
                                    width: "100%",
                                };
                                var line2 = ui.create.div(style2, this);
                                line2.style.lineHeight = "50px";
                                var dialog = ui.create.dialog("hidden", line2);
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.addText("请在上方点击你想要了解的模式，" + lib.config.connect_nickname + "。");
                                dialog.classList.add("fixed");
                                dialog.noopen = true;
                                this.appendChild(dialog);
                                var incident = ui.create.node(
                                    "button",
                                    "异变模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>异变模式：</u></b> 游戏人数：4~8人，推荐人数为7人", '<a href = "https://mp.weixin.qq.com/s/ZBT62CCpPWzqiLMFDQOSsg" target="_blank">详细介绍点这里</a>', "黑幕：其实就是主公。自机：其实就是反贼。异变：其实就是忠臣。路人：其实就是内奸。", "黑幕与异变身份为一方；自机身份为一方，且与黑幕为对立阵营；每个路人身份玩家为单独一方", "游戏开始时，每名玩家的身份暗置，随机玩家执行第一个回合", "每名玩家可以在出牌阶段明置自己的身份；身份明置时，根据身份执行效果：", "黑幕：获得一张异变牌并明置", "异变：令一名角色摸一张牌", "自机：令一名其他角色选择一项：弃置一张牌，或明置身份", "路人：获得一张异变牌并暗置；可以在出牌阶段明置异变牌", "", "<u>胜利条件：</u>", "黑幕：击杀所有自机", "异变：黑幕获得胜利", "自机：击杀黑幕", "路人：无", "特殊的，游戏结束时，存活的路人玩家不算游戏失败。路人玩家胜利时游戏结束（平局）。", "", "<u>异变牌：</u>任何持有异变牌的玩家可以通过异变牌的效果获得胜利；异变牌只有明置才有效果；异变胜利时，所有与其同阵营的玩家也获得胜利。", "<u>击杀奖励：</u>一名角色击杀其他角色后，获得1点灵力，并贴上一张技能牌。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var identity = ui.create.node(
                                    "button",
                                    "身份模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>身份模式：</u></b> 游戏人数：4~8人，推荐人数为8人", '<div style="margin:10px">选项</div><ul style="margin-top:0">', "", '<li>加强主公<br>反贼人数多于2时主公会额外增加一个技能（每个主公的额外技能固定，非常备主公增加天命）<li>特殊身份<br><ul style="padding-left:20px;padding-top:5px"><li>军师：忠臣身份。只要军师存活，主公在准备阶段开始时，可以观看牌堆顶的三张牌，然后将这些牌以任意顺序置于牌堆顶或牌堆底<li>大将：忠臣身份。只要大将存活，主公手牌上限+1<li>贼首：反贼身份，只要贼首存活，主公手牌上限-1</ul></ul>' + '<div style="margin:10px">明忠</div><ul style="margin-top:0">', "", "<li>本模式需要8名玩家进行游戏，使用的身份牌为：1主公、2忠臣、4反贼和1内奸。游戏开始时，每名玩家随机获得一个身份，由系统随机选择一名忠臣身份的玩家亮出身份（将忠臣牌正面朝上放在面前），其他身份（包括主公）的玩家不亮出身份。<li>" + "首先由亮出身份的忠臣玩家随机获得六张武将牌，挑选一名角色，并将选好的武将牌展示给其他玩家。之后其余每名玩家随机获得三张武将牌，各自从其中挑选一张同时亮出<li>" + "亮出身份牌的忠臣增加1点体力上限。角色濒死和死亡的结算及胜利条件与普通身份局相同。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var versus = ui.create.node(
                                    "button",
                                    "对决模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>对决模式：</u></b>", '<div style="margin:10px">同舟共济（四国）</div><ul style="margin-top:0">', "", "<li>游戏开始时，每个势力的随机一名角色得到一个龙船至宝，1号位角色所在的势力额外获得一个龙船至宝，场上共5枚龙船至宝。龙船至宝是一个特殊标记。" + "<li>争夺龙船至宝的方式：当敌人受到了你造成的伤害后，若其有龙船至宝，则你获得其一个龙船至宝。若你杀死了该敌人，则你获得其所有的龙船至宝。" + "<li>获得龙船至宝时的摸牌：除游戏开始时外，若你从非队友处获得了龙船至宝，则你和队友各摸X张牌。（X为该次获得的龙船至宝数；获得队友的龙船至宝不摸牌）" + "<li>无来源死亡时：当一名角色死亡时，若没有伤害来源，则其持有的所有龙船至宝交给场上龙船至宝数唯一最多的角色，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。" + "<li>杀死队友时：当你杀死队友时，则将你和队友持有的所有龙船至宝交给场上龙船至宝数唯一最多的敌人，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。" + "<li>胜利条件：满足一下任意条件游戏结束：（1）在新的一轮开始时，若你的势力获得的龙船至宝至少为4个，则你和队友获胜；（2）消灭所有敌人。" + "</ul>" + '<div style="margin:10px">2v2 替补模式</div><ul style="margin-top:0">', "", "<li>选将时额外选择一名替补武将，阵亡时使用自己的替补武将上场，无替补时改为用队友的替补武将，两人均无替补时游戏结束" + "<li>杀死敌方武将摸3张牌，杀死友方武将弃置所有牌</ul>" + '<div style="margin:10px">4v4</div><ul style="margin-top:0">', "", "<li>双方各有一名主公和三名忠臣，杀死对方主公获胜<li>" + "8号位游戏开始时额外摸一张牌，7、8号位可在游戏开始时置换一次手牌<li>" + "杀死对方忠臣摸2+x张牌，x为对方（含刚被杀的忠臣）与己方的存活人数之差；主公杀死己方忠臣须弃置所有牌"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var tafang = ui.create.node(
                                    "button",
                                    "塔防模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>塔防模式：</u></b>", "<ul><li>阻上敌人到达最下方的出口，坚持到给定的回合数即获得胜利<li>" + "每轮可获得10个行动点，用来布置机关、招募武将。场上每有一个友方武将，行动点数-1。游戏难度将影响不同操作消耗的行动点数。未用完的行动点将减半（向下取整）并累积到下一轮<li>" + "每一轮在最上方的一个随机位置增加一名敌人，若最上方已有角色，则将其下移一格<li>" + "战场上最多出现3个相同的机关，每个机关在置入战场3轮后消失。战场上最多招募5名友方角色。<li>" + "敌方角色到达底部出口时游戏失败，已方角色到达底部出口，将被移出游戏"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var stg = ui.create.node(
                                    "button",
                                    "闯关模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>闯关模式：</u></b>", '<a href = "https://mp.weixin.qq.com/s/owQpDcBP0_OFPSlZMecPYQ" target="_blank">详细介绍点这里</a>', "选择出你的自机角色，欺负小怪，连续打关，找出最后的黑幕并击破她吧！", "", "玩家的胜利条件为击杀最后一个BOSS，通过最后一个小关。 失败条件为自己死亡。", "一个大关最多有6个小关，最少只有1小关。", "", "<u>专属装备</u>", "每一个大关会限定一些自机角色。这些自机角色在游戏开始时，可以选择一张属于她的专属装备。", "并且，使用不同的专属装备会让玩家获得不同的符卡。", "使用[自由选自机]来选出这些角色以外的角色来闯关的话，不会有专属装备。", "", "<u>复活机会</u>", "玩家在死亡时，如果还剩复活机会，会消耗1个，然后弃置所有牌，摸4张牌，体力回复至满，灵力调整为2，继续游戏。", "没有复活机会的情况下死亡就是游戏失败咯。", "玩家初始的复活机会数量，和击杀哪些BOSS会获得更多的复活机会，在大关介绍上有写。", "在游戏中，可以随时用右上的[残机]键查看剩余复活次数。", "", "<u>击杀和通关奖励</u>", "任何角色死亡后，击杀那名角色的来源获得1点灵力，并摸一张牌。", "玩家通过一个小关后，牌堆会重置。", "", "<u>敌人增援</u>", "在玩家的回合开始时，如果场上敌人的数量小于2，会出现下一个敌人。", "这些敌人会继续出现，直到BOSS角色出现为止。", "即使小怪在场上，击杀BOSS角色依然是成功通关，所以不用太介意。", "", "<u>BOSS阶段转换</u>", "有些BOSS在死亡时，会进入下一个阶段：", "BOSS将体力值回复至上限，灵力调整为5，然后立即获得并启动符卡技。这些符卡技均视为持有<极意>标签。", "有些BOSS甚至有两个阶段，请千万小心。", "", "<u>手牌上限</u>", "每通过一个小关，增加一手牌上限。"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var chess = ui.create.node(
                                    "button",
                                    "战棋模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>战棋模式</u></b>", '<div style="margin:10px">对阵模式</div><ul style="margin-top:0">', "", "<li>n人对战n人的模式，由单人控制，开始游戏后随机分配位置与出牌顺序<li>" + "每人在出牌阶段有一次移动的机会，可移动的最大距离为2<li>" + "任何卡牌或技能无法指定位置相隔8个格以上的角色为目标<li>" + "杀死对方阵营的角色可摸一张牌，杀死本方阵营无惩罚<li>" + "若开启主将，双方各选择一名角色成为主将。主将体力上限加一，主将死亡后，若有副将，副将代替之成为主将，否则游戏结束<li>" + "开启无尽模式后，任何一方有角色死亡都将选择一名新角色重新加入战场，直到点击左上角的结束游戏按钮手动结束游戏。结束游戏时，杀敌更多的一方获胜<li>" + "行动顺序为指定时，双方无论存活角色角色多少都将轮流进行行动。在一方所有角色行动完毕进行下一轮行动时，若其人数比另一方少，另一方可指定至多X名角色名摸一张牌，X为人数之差<li>" + "开启战场机关后，每个回合结束时有一定机率出现一个机关，该机关不参与战斗，并有一个影响周围或全体角色的效果。机关在出现后的5~10个回合内消失<li>" + "开启击退效果后，当一名角色对距离两格以内的目标造成伤害后，受伤害角色将沿反方向移动一格<li>" + "战场上可设置出现随机路障，角色无法移动到路障处。当一名角色的周围四格有至少三格为路障或在战场外时，其可以在回合内清除一个相邻路障</ul>" + '<div style="margin:10px">君主模式</div><ul style="margin-top:0">', "", "<li>收集武将进行战斗，根据战斗难度及我方出场武将的强度，战斗胜利后将获得数量不等的金钱。没有君主出场时，获得的金钱较多<li>" + "金钱可以用来招募随机武将，招到已有武将，或遣返不需要的武将时可得到招募令<li>" + "战斗中有君主出场时可招降敌将，成功率取决于敌将的稀有度、剩余体力值以及手牌数。成功后战斗立即结束且没有金钱奖励。每发动一次招降，无论成功还是失败，都会扣除10招募令<li>" + "挑战武将会与该武将以及与其强度相近的武将进行战斗，敌方人数与我方出场人数相同，但不少于3。胜利后可通过招募令招募该武将，普通/稀有/史诗/传说武将分别需要40/100/400/1600招募令<li>" + "竞技场：<br>随机选择9名武将，每次派出1~3名武将参战。战斗中阵亡的武将不能再次上场。<br><br>战斗后武将进入疲劳状态，若立即再次出场则初始体力值-1。<br><br>战斗中本方武将行动时可召唤后援，令一名未出场的已方武将加入战斗。后援武将在战斗结束后无论存活与否均不能再次出场<br><br>当取得12场胜利或所有武将全部阵亡后结束，并根据胜场数获得随机奖励<li>" + "修改金钱：<br>game.changeMoney<br>修改招募令：<br>game.changeDust</ul>"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                                var stone = ui.create.node(
                                    "button",
                                    "炉石模式",
                                    line2,
                                    function () {
                                        var i = ["<u><b>炉石模式</u></b>", '<div style="margin:10px">构筑</div><ul style="margin-top:0">', "", "<li>点击右上角的卡组管理构建卡组<li>一套卡组共30张牌，由法术和随从牌构成，每个同名卡牌最多带两张" + "<li>卡组管理器中，随从右上角的x/y表示登场状态为x牌y血" + "<li>游戏开始时，双方摸三张牌并从牌库中获得一张牌，并可选择将手牌置换一次" + "<li>每当主将摸X张牌时，若X至少为2，则其中的X-1张牌从牌堆中获得，1张牌从牌库中获得" + "<li>每名角色使用一套卡组，卡组用完后会重新补满" + "<li>卡组与职业绑定，每个职业有一个专属技能，每回合限用一次，消耗两点行动值</ul>" + '<div style="margin:10px">职业技能</div><ul style="margin-top:0">', "", "<li>祭司：召唤一个随机图腾" + "<li>法师：对一名随从造成一点火焰伤害" + "<li>牧师：回复一点体力" + "<li>战士：获得一点护甲（不能超过3点）" + "<li>术士：牌库中摸两张牌" + "<li>潜行者：装备一把武器和一个随机非武器装备" + "<li>圣骑士：召唤一名士兵" + "<li>猎人：对敌方主将造成一点伤害" + "<li>德鲁伊：视为使用一张不计入出杀次数的杀</ul>" + '<div style="margin:10px">怒气值</div><ul style="margin-top:0">', "", "<li>每当友方随从受到伤害获得3点怒气值，主将受到伤害获得6点怒气值" + "<li>每有一个友方随从死亡，获得10点怒气值，主将死亡获得20点怒气值" + "<li>结束阶段，若己方随从数少于对方会获得10X点怒气值，X为随从数之差" + "<li>怒气值达到100时不再增加。准备阶段，若怒气值己满，可消耗全部怒气值和4点行动值并召唤一名传说随从</ul>" + '<div style="margin:10px">战斗</div><ul style="margin-top:0">', "", "<li>场上有两名主将进行对抗，主将的体力上限+1" + "<li>游戏牌堆移除了乐不思蜀等跳过出牌阶段以及包含翻面功能的卡牌" + "<li>主将出牌阶段的出牌数量（行动值）有上限，从1开始递增，后手的首个回合有一点额外行动值，装备牌不计入出牌上限<li>游戏每进行一轮，主将的出牌上限+1，直到增加至6" + "<li>使用随从牌可召唤一个随从，随从出场时背面朝上。每一方在场的随从数不能超过4<li>随从于摸牌阶段摸牌基数为1，随从的法术和随从牌均视为闪，装备牌均视为杀<li>" + "随从与其他所有角色相互距离基数为1<li>" + "主将杀死对方随从后获得一个额外的行动值并从牌库中获得一张牌，杀死己方随从无惩罚，随从杀死随从无效果" + "<li>主将在随从满员时可重铸随从牌，但回合内总的重铸次数不能超过3；若重铸的牌为随从牌或法术牌，则摸牌改为获得一张随机法术牌" + "<li>嘲讽：若一方阵营中有嘲讽角色，则同阵营的无嘲讽角色不以能成为杀目标" + "<li>行动顺序为先主将后随从。主将或随从死亡后立即移出游戏，主将死亡后替补登场，替补登场时摸3+X张牌，X为对方存活的随从数，无替补时游戏结束"];
                                        dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                    },
                                    {
                                        marginLeft: "6px",
                                    },
                                );
                            }
                        },
                    },
                    characterview: {
                        name: "角色牌",
                        mode: "",
                        intro: ["右击角色可以查看角色简介，和切换角色皮肤。", "（在游戏中，或左上[选项-角色]中 双击角色也可以查看角色简介和切换角色皮肤哟。）"],
                        showcase: function (init) {
                            if (init) {
                                var list = [];
                                for (var i in lib.character) {
                                    list.push(i);
                                }
                                var dialog = ui.create.dialog("hidden");
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                dialog.add([list, "character"], false);
                                for (var i = 0; i < dialog.buttons.length; i++) {
                                    dialog.buttons[i].classList.add("show");
                                }
                                this.appendChild(dialog);
                                dialog.noopen = true;
                            }
                        },
                    },
                    cardview: {
                        name: "游戏牌",
                        mode: "",
                        intro: ["卡牌的花色和点数以牌局内为准。右键可以查看卡牌简介。"],
                        showcase: function (init) {
                            if (init) {
                                var i;
                                var list = [];
                                event.list = list;
                                var dialog = ui.create.dialog("hidden");
                                dialog.classList.add("fixed");
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                for (i in lib.card) {
                                    if (lib.translate[i]) {
                                        var card = game.createCard(i, undefined, undefined, undefined);
                                        dialog.add(card);
                                    }
                                }
                                this.appendChild(dialog);
                                dialog.noopen = true;
                            }
                        },
                    },
                    skillview: {
                        name: "技能牌",
                        mode: "",
                        intro: ["技能牌是一种特殊牌，位于判定区底端，但只能通过特殊函数调用。", "技能牌与装备牌类似，摸到后可以任意使用上面的技能，且一次最多持有3张。额外的，相同技能牌的效果一般不会叠加。", "贴上的技能牌不进入牌堆或弃牌堆，失去时直接移除游戏。", "除此之外，技能牌不参也无名杀主体的部分功能。", "通过技能贴上的技能牌没有花色，点数。"],
                        showcase: function (init) {
                            if (init) {
                                var i;
                                var list = [];
                                event.list = list;
                                var dialog = ui.create.dialog("hidden");
                                dialog.classList.add("fixed");
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                for (i in lib.card) {
                                    if (lib.translate[i] && !lib.card[i].vanish && lib.card[i].type == "jinengpai") {
                                        list.push(i);
                                    }
                                }
                                dialog.add([list, "vcard"]);
                                this.appendChild(dialog);
                                dialog.noopen = true;
                            }
                        },
                    },
                    incidentview: {
                        name: "异变牌",
                        mode: "identity",
                        intro: ["异变牌持有胜利条件，特殊效果。是东方流星夜的特殊牌。", "在开启胜利条件的情况下，会记录异变牌的出场数。因异变牌胜利而结束游戏时，异变牌胜利次数也会被记录。", "在因异变牌胜利三次后，可以点击阿求查看异变牌的出场与胜利次数。"],
                        showcase: function (init) {
                            if (init) {
                                var i;
                                var list = [];
                                event.list = list;
                                var dialog = ui.create.dialog("hidden");
                                dialog.classList.add("fixed");
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                for (i in lib.card) {
                                    if (lib.translate[i] && lib.card[i].type == "zhenfa" && lib.card[i].subtype == "yibianpai") {
                                        list.push(i);
                                    }
                                }
                                dialog.add([list, "vcard"]);
                                this.appendChild(dialog);
                                dialog.noopen = true;
                            }
                        },
                    },
                    record: {
                        name: "我的战绩",
                        intro: [],
                        fullshow: true,
                        showcase: function (init) {
                            if (init) {
                                var node = this;
                                this.style.height = parseInt(this.style.height.substr(0, this.style.height.length - 2)) - this.offsetTop + "px";
                                ui.create.div(".config.indent", '<div><div style="width:100%;text-align:right;font-size:18px"><b><u>' + lib.config.connect_nickname + "的战绩：</b></u></div>", node);
                                if (lib.config.gameRecord.general) {
                                    ui.create.div(".config.indent", lib.translate["general"], node);
                                    var item = ui.create.div(".config.indent", lib.config.gameRecord.general.str + "<span><br><br></span>", node);
                                    item.style.height = "auto";
                                }
                                for (var i in lib.config.gameRecord) {
                                    if (lib.config.gameRecord[i].str && i != "general") {
                                        ui.create.div(".config.indent", lib.translate[i] + "模式", node);
                                        var item = ui.create.div(".config.indent", lib.config.gameRecord[i].str + "<span><br><br></span>", node);
                                        item.style.height = "auto";
                                        item.lastChild.classList.add("pointerdiv");
                                        item.link = i;
                                    }
                                }
                            }
                        },
                    },
                    diy: {
                        name: "我要DIY！",
                        mode: "",
                        intro: ["有好点子？想要更多萌妹？想要萌妹们穿上泳装？来把你的幻想变成现实吧！"],
                        showcase: function (init) {
                            if (init) {
                                var style2 = {
                                    position: "relative",
                                    display: "block",
                                    left: 10,
                                    top: 0,
                                    marginBottom: "6px",
                                    padding: 0,
                                    width: "100%",
                                };
                                var line2 = ui.create.div(style2, this);
                                line2.style.lineHeight = "50px";
                                var dialog = ui.create.dialog("hidden", line2);
                                dialog.style.left = "0px";
                                dialog.style.top = "0px";
                                dialog.style.width = "100%";
                                dialog.style.height = "100%";
                                if (location.hostname) {
                                    dialog.addText("很抱歉，" + lib.config.connect_nickname + "，网页版不能进行DIY操作。把游戏下载下来才可以的。");
                                } else {
                                    dialog.addText("想要了解哪些DIY手段呢，" + lib.config.connect_nickname + "？");
                                    dialog.classList.add("fixed");
                                    dialog.noopen = true;
                                    this.appendChild(dialog);
                                    var incident = ui.create.node(
                                        "button",
                                        "添加皮肤",
                                        line2,
                                        function () {
                                            var i = ["添加皮肤，按照以下步骤来，很简单的：", "1. 打开无名杀所在的文件夹（电脑为noname-resources-app，安卓手机在Android-data-com.widget.noname）", "2. 打开image文件夹。", "3. 你知道想要加皮肤的角色的内部名吗？知道的话，进入下一步。不知道的话，打开character文件夹，找到你想要改的角色的插图，文件名就是它的内部名（不包括后缀的.jpg）（拓展为extension）", "4. 打开image下的skin文件夹。", "5. 有它的名字的文件夹吗？如果有，打开它。如果没有，创建一个，然后打开它。", "6. 把图片（.jpg格式）放进文件夹里。命名为1.jpg。已经有了就+1，2.jpg。以此类推。", "就这样，皮肤就可以在游戏内切换啦！"];
                                            dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                        },
                                        {
                                            marginLeft: "6px",
                                        },
                                    );

                                    var versus = ui.create.node(
                                        "button",
                                        "添加背景",
                                        line2,
                                        function () {
                                            var i = ["右上，选项，选项，外观，游戏背景（随机背景打开的话，这个按键会被隐藏），添加背景", "点编辑背景可以删除已有的背景。", "顺带一提，随机背景可以随机到由你加入的背景。"];
                                            dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                        },
                                        {
                                            marginLeft: "6px",
                                        },
                                    );

                                    var library = ui.create.node(
                                        "button",
                                        "制作角色",
                                        line2,
                                        function () {
                                            var i = ['<a href = "http://tieba.baidu.com/p/5523328309?share=9105&fr=share&see_lz=0&sfc=copy&client_type=2&client_version=11.0.0.0&st=1578210565&unique=889357C58A03A56EB7C71AB2876CF653" target="_blank">制作拓展</a>', "", '<a href = "https://qinkunwei.gitee.io/noname/" target="_blank">交流网站点这里</a>'];
                                            dialog.setCaption('<div><div style="text-align:left;font-size:16px">' + i.join("<br>"));
                                        },
                                        {
                                            marginLeft: "6px",
                                        },
                                    );
                                }
                            }
                        },
                    },
                    download: {
                        name: "联系我们",
                        intro: ["你玩流星夜觉得开心吗？觉得不开心吗？觉得制作组是傻逼吗？自己也想要做吗？那么…………", "欢迎大家光临雾雨魔法店！", '东方流星夜app：<a href="https://pan.baidu.com/s/14ogm9-RAdDuuXUGTZYC_qA" target="_blank">百度网盘链接</a>，提取码：e6nf', '流星夜网页版更新下载链接→<a href = "https://github.com/BlackAndWhiteScallion/Night-of-Shooting-Stars-Extensions/archive/master.zip">国外镜像下载</a> <a href = "https://bws.coding.net/api/share/download/bcf9e902-4fd3-4919-9fc9-f681388b0523">国内镜像下载</a>', '流星夜网页地址：<a href="http://b_2.gitee.io/noss/target="_blank">网页链接</a>', '国内电脑版更新包：<a href="https://bws.coding.net/p[NO]SS-Extensions/d[NO]SS-Extensions/git/raw/master/%E4%B8%9C%E6%96%B9%E6%B5%81%E6%98%9F%E5%A4%9C%E6%9B%B4%E6%96%B0.exe"target="_blank">流星夜电脑版更新包</a>', '流星夜微信公众号：<a href="https://mp.weixin.qq.com/s/PC6a3Y8Y8bslqgsVWqcTqw" target="_blank">东方流星夜 大葱专线</a>', '无论是聊天，<a href="https://mp.weixin.qq.com/s/eq1HewSJkujUNA4U1vEq3Q" target="_blank">看漫画，</a>我们都会尊重你的选择。'],
                        showcase: function (init) {
                            //制作动画的地方
                            var node = this;
                            var player;
                            if (init) {
                                player = ui.create.player(null, true);
                                player.node.avatar.style.backgroundSize = "cover";
                                player.node.avatar.setBackgroundImage("extension/东方project/boss_reimu.jpg"); //这里是图片
                                player.node.avatar.show();
                                player.style.left = "calc(50% - 75px)";
                                player.style.top = "20px";
                                player.node.count.remove();
                                player.node.hp.remove();
                                player.style.transition = "all 0.5s";
                                node.appendChild(player);
                                node.playernode = player;
                            } else {
                                player = node.playernode;
                            }
                            var num = 0;
                            var num2 = 0;
                            this.showcaseinterval = setInterval(function () {
                                var dx, dy;
                                if (num2 % 5 == 0) {
                                    for (var i = 0; i < 5; i++) {
                                        switch (i) {
                                            case 0:
                                                dx = -180;
                                                dy = 0;
                                                break;
                                            case 1:
                                                dx = -140;
                                                dy = 100;
                                                break;
                                            case 2:
                                                dx = 0;
                                                dy = 155;
                                                break;
                                            case 3:
                                                dx = 140;
                                                dy = 100;
                                                break;
                                            case 4:
                                                dx = 180;
                                                dy = 0;
                                                break;
                                        }
                                        var card = game.createCard("tao", "noclick");
                                        card.style.left = "calc(50% - 52px)";
                                        card.style.top = "68px";
                                        card.style.position = "absolute";
                                        card.style.margin = 0;
                                        card.style.zIndex = 2;
                                        card.style.opacity = 0;
                                        node.appendChild(card);
                                        ui.refresh(card);
                                        card.style.opacity = 1;
                                        card.style.transform = "translate(" + dx + "px," + dy + "px)";
                                        setTimeout(
                                            (function (card) {
                                                return function () {
                                                    card.delete();
                                                };
                                            })(card),
                                            1000,
                                        );
                                    }
                                }
                                num2++;
                                if (num >= 5) {
                                    num = 0;
                                }
                            }, 700);
                        },
                    },
                    thanks: {
                        name: "鸣谢",
                        mode: "",
                        intro: ["无名杀开发者：水乎", "无名杀目前的更新者：苏婆马里奥", "然后，感谢无名杀的各位开发者和维护者，提供了如此靓丽的平台。", "接着，感谢魔法店里陪着我们走到现在的大家。", "最后，感谢你，玩这个游戏的玩家，的支持。", "我们衷心希望，你能在这里玩的开心。", "", "", "各个角色的画师可以在角色简介内找到。", "", "本拓展背景音乐皆出自东方。"],
                        showcase: function (init) {},
                    },
                },
            },
            {
                translate: "图鉴",
                config: {
                    musicopen: {
                        name: "开启专属音乐",
                        init: true,
                        intro: "开启本模式的专属音乐！开启前请确定自己已经导入了素材包，否则无声警告。",
                        frequent: true,
                        restart: true,
                    },
                    ladder_reset: {
                        name: "重置异变牌记录",
                        onclick: function () {
                            var node = this;
                            if (node._clearing) {
                                if (lib.config.gameRecord.incident) {
                                    lib.config.gameRecord.incident = {
                                        data: {},
                                    };
                                    game.saveConfig("gameRecord", lib.config.gameRecord);
                                }
                                clearTimeout(node._clearing);
                                node.firstChild.innerHTML = "重置异变牌记录";
                                delete node._clearing;
                                return;
                            }
                            node.firstChild.innerHTML = "单击以确认 (3)";
                            node._clearing = setTimeout(function () {
                                node.firstChild.innerHTML = "单击以确认 (2)";
                                node._clearing = setTimeout(function () {
                                    node.firstChild.innerHTML = "单击以确认 (1)";
                                    node._clearing = setTimeout(function () {
                                        node.firstChild.innerHTML = "重置异变牌记录";
                                        delete node._clearing;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        },
                        clear: true,
                    },
                    tutorial_reset: {
                        name: "重置异变教程",
                        onclick: function () {
                            var node = this;
                            if (node._clearing) {
                                game.saveConfig("old_tutorial", false);
                                clearTimeout(node._clearing);
                                node.firstChild.innerHTML = "重置异变教程";
                                delete node._clearing;
                                return;
                            }
                            node.firstChild.innerHTML = "单击以确认 (3)";
                            node._clearing = setTimeout(function () {
                                node.firstChild.innerHTML = "单击以确认 (2)";
                                node._clearing = setTimeout(function () {
                                    node.firstChild.innerHTML = "单击以确认 (1)";
                                    node._clearing = setTimeout(function () {
                                        node.firstChild.innerHTML = "重置异变教程";
                                        delete node._clearing;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        },
                        clear: true,
                    },
                    yan_reset: {
                        name: "清除焰保存记录",
                        onclick: function () {
                            var node = this;
                            if (node._clearing) {
                                lib.config.gameRecord.gezi_homura = [];
                                game.saveConfig("gameRecord", lib.config.gameRecord);
                                clearTimeout(node._clearing);
                                node.firstChild.innerHTML = "清除焰保存记录";
                                delete node._clearing;
                                return;
                            }
                            node.firstChild.innerHTML = "单击以确认 (3)";
                            node._clearing = setTimeout(function () {
                                node.firstChild.innerHTML = "单击以确认 (2)";
                                node._clearing = setTimeout(function () {
                                    node.firstChild.innerHTML = "单击以确认 (1)";
                                    node._clearing = setTimeout(function () {
                                        node.firstChild.innerHTML = "清除焰保存记录";
                                        delete node._clearing;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        },
                        clear: true,
                    },
                },
                onremove: function () {
                    game.clearModeConfig("library");
                },
            },
        );
        image: ["extension/东方project/library.jpg"];

        game.addMode(
            "old_identity",
            {
                name: "old_identity",
                start: function () {
                    "step 0";
                    //没有进行新手向导则创建
                    if (!lib.config.old_tutorial) {
                        ui.arena.classList.add("only_dialog");
                    }
                    //这里获得这局是什么东西（明忠或者普通）
                    _status.mode = get.config("identity_mode");
                    // 如果是图鉴模式的话，换成图鉴模式
                    if (_status.library && _status.library.submode) {
                        _status.mode = _status.library.submode;
                    }
                    // 首先，如果是录像就试图播放这个录像？
                    ("step 1");
                    var playback = localStorage.getItem(lib.configprefix + "playback");
                    if (playback) {
                        ui.create.me();
                        ui.arena.style.display = "none";
                        ui.system.style.display = "none";
                        _status.playback = playback;
                        localStorage.removeItem(lib.configprefix + "playback");
                        var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
                        store.get(parseInt(playback)).onsuccess = function (e) {
                            if (e.target.result) {
                                game.playVideoContent(e.target.result.video);
                            } else {
                                alert("播放失败：找不到录像");
                                game.reload();
                            }
                        };
                        event.finish();
                    }
                    // 如果不是录像且不是联机模式
                    else if (!_status.connectMode) {
                        // 如果是明忠模式
                        if (_status.mode == "zhong") {
                            if (get.config("zhong_card")) {
                                event.replacePile(); // 然后就替换牌堆，emmm
                            }
                            game.prepareArena(8);
                        }
                        // 如果阿求启动
                        // 阿求启动的条件是，异变胜利的次数为3……
                        else if (get.config("akyuu_bool") && lib.config.gameRecord.incident && lib.config.gameRecord.incident.data["akyuu"] && lib.config.gameRecord.incident.data["akyuu"] >= 3) {
                            game.prepareArena(7);
                        } else {
                            game.prepareArena();
                        }
                        if (!lib.config.old_tutorial) {
                            game.delay();
                        }
                    }
                    // 这里是新手向导w
                    // 或许可以换到图鉴那儿去？ 或者过程中切到图鉴那里。
                    // 反正是要设置的。就是不是现在。
                    ("step 2");
                    if (!lib.config.old_tutorial) {
                        _status.old_tutorial = true;
                        game.saveConfig("old_tutorial", true);
                        lib.init.onfree();
                        game.saveConfig("version", lib.version);
                        var clear = function () {
                            ui.dialog.close();
                            while (ui.controls.length) ui.controls[0].close();
                        };
                        var clear2 = function () {
                            ui.auto.show();
                            ui.arena.classList.remove("only_dialog");
                        };
                        var step1 = function () {
                            var dialog = ui.create.dialog('欢迎来到东方流星夜！<br>请问您的名字是什么？<br><br><br><div><div style="text-align:center;font-size:14px">这个名字以后可以修改。</div>');
                            var text2 = document.createElement("input");
                            text2.style.width = "200px";
                            text2.style.height = "20px";
                            text2.style.padding = "0";
                            text2.style.position = "relative";
                            text2.style.top = "80px";
                            text2.style.resize = "none";
                            text2.style.border = "none";
                            text2.style.borderRadius = "2px";
                            text2.style.boxShadow = "rgba(0, 0, 0, 0.2) 0 0 0 1px";
                            text2.value = lib.config.connect_nickname;
                            dialog.appendChild(text2);
                            ui.auto.hide();
                            ui.create.control("写好了", function () {
                                game.saveConfig("connect_nickname", text2.value);
                                game.saveConfig("connect_nickname", text2.value, "connect");
                                step15();
                            });
                        };
                        var step15 = function () {
                            clear();
                            ui.create.dialog("欢迎您，" + lib.config.connect_nickname + "! <br>这是第一次来到幻想乡吗？");
                            ui.auto.hide();
                            ui.create.control("怎么可能", function () {
                                clear();
                                clear2();
                                ui.create.dialog("欢迎回来！<br>祝你在幻想乡玩的愉快！");
                                ui.dialog.add('<div class="text center">你可以在左上角的图鉴模式选项中重置新手向导');
                                setTimeout(function () {
                                    game.resume();
                                }, 2500);
                            });
                            ui.create.control("是的", step2);
                        };
                        var step2 = function () {
                            if (!lib.config.phonelayout) {
                                clear();
                                ui.create.dialog("如果你在使用手机，可能会觉得按钮有点小" + "，将布局改成移动可以使按钮变大");
                                ui.dialog.add('<div class="text center">此设置可以随时在选项-外观-布局中变更。');
                                var lcontrol = ui.create.control("使用移动布局", function () {
                                    if (lib.config.phonelayout) {
                                        ui.control.firstChild.firstChild.innerHTML = "使用移动布局";
                                        game.saveConfig("phonelayout", false);
                                        lib.init.layout("mobile");
                                    } else {
                                        ui.control.firstChild.firstChild.innerHTML = "使用默认布局";
                                        game.saveConfig("phonelayout", true);
                                        lib.init.layout("mobile");
                                    }
                                });
                                ui.create.control("就这样吧！", step3);
                            } else {
                                step3();
                            }
                        };
                        var step3 = function () {
                            if (lib.config.touchscreen) {
                                clear();
                                ui.create.dialog("触屏模式中，下划可以显示菜单，上划可以切换托管，双指单击可以暂停");
                                ui.dialog.add('<div class="text center">你可以在选项-游戏-中更改手势设置');
                                ui.create.control("没问题！", step4);
                            } else {
                                step4();
                            }
                        };
                        var step4 = function () {
                            clear();
                            ui.click.configMenu();
                            ui.control.classList.add("noclick_click_important");
                            ui.control.style.top = "calc(100% - 105px)";
                            var text = ui.create.dialog("在菜单中，可以调整各种各样的设置。<br> 模式设置，体系设置，角色皮肤，禁止角色，游戏布局，应有尽有的哟！");
                            ui.create.control("按这里继续哟", function () {
                                ui.click.configMenu();
                                ui.click.menuTab("选项");
                                text = ui.create.dialog("如果你感到游戏较卡，可以开启流畅模式，或者下降游戏速度。<br> 在[特效]选项中也可以选择游戏中表现哪些特效。");
                                ui.controls[0].replace("知道了", function () {
                                    ui.click.configMenu();
                                    ui.click.menuTab("选项");
                                    text = ui.create.dialog("在[外观]中可以设置游戏的背景图，配色主题，和布局。<br>在[界面]中可以选择游戏界面中显示哪些按键和信息。<br>在[音效]中可以调整音量大小和角色及卡牌的音效。");
                                    ui.controls[0].replace("知道了知道了", function () {
                                        ui.click.configMenu();
                                        ui.click.menuTab("角色");
                                        text = ui.create.dialog("在角色或卡牌一栏中，单击角色/卡牌可以将其禁用，在角色/卡牌上悬空或右键可以查看描述，双击角色可以查看角色简介，和切换角色皮肤。");
                                        ui.controls[0].replace("这选项可真多", function () {
                                            ui.click.configMenu();
                                            ui.click.menuTab("其他");
                                            text = ui.create.dialog("在[其他]中可以检查更新，下载素材，查看你的战绩，和观看游戏录像。");
                                            ui.controls[0].replace("好了能玩了没", function () {
                                                ui.click.configMenu();
                                                ui.window.classList.remove("noclick_important");
                                                ui.control.classList.remove("noclick_click_important");
                                                ui.control.style.top = "";
                                                step5();
                                            });
                                        });
                                    });
                                });
                            });
                        };
                        var step5 = function () {
                            clear();
                            ui.create.dialog("如果还有其它问题，在图鉴模式里可以找到更多的帮助<br>顺便，游戏中的绝大部分界面都是可以往下划的哟？");
                            ui.create.control("所以能玩了没", function () {
                                clear();
                                clear2();
                                ui.create.dialog("那么就到此了！<br>祝你在幻想乡玩的愉快！");
                                ui.dialog.add('<div class="text center">你可以在左上角的图鉴模式选项中重置新手向导');
                                setTimeout(function () {
                                    game.resume();
                                }, 2500);
                            });
                        };
                        game.pause();
                        step1();
                        //game.saveConfig('show_splash', 'always');
                    } else {
                        if (!_status.connectMode) {
                            game.showChangeLog();
                        }
                    }
                    // 然后新手向导结束……
                    ("step 3");
                    if (typeof _status.old_tutorial == "function") {
                        _status.old_tutorial();
                    }
                    delete _status.old_tutorial;
                    if (_status.connectMode) {
                        game.waitForPlayer(function () {
                            // 这个还是明忠模式的设定？
                            if (lib.configOL.identity_mode == "zhong") {
                                lib.configOL.number = 8;
                            }
                        });
                    }
                    ("step 4");
                    if (lib.config.auto_auto && !_status.auto) {
                        ui.click.auto();
                    }
                    if (_status.connectMode) {
                        //联机相关，顺便我也不知道能不能用
                        // 是这里的问题吗？
                        _status.mode = lib.configOL.identity_mode;
                        if (_status.mode == "zhong") {
                            lib.configOL.number = 8; // 8人
                            if (lib.configOL.zhong_card) {
                                event.replacePile(); // 如果是明忠就又要换牌堆了（耸肩）
                            }
                        }
                        if (lib.configOL.number < 2) {
                            lib.configOL.number = 2; // 2人
                        }
                        game.randomMapOL(); // 随机位置吧
                    } else {
                        // 然后每个人选择角色
                        for (var i = 0; i < game.players.length; i++) {
                            game.players[i].getId();
                        }
                        if (_status.library && _status.library.chooseCharacterBefore) {
                            _status.library.chooseCharacterBefore();
                        }
                        // 没有看到别的地方亮身份，那应该就是混在选将这里了？
                        game.chooseCharacter();
                    }
                    // 金币？？？？
                    ("step 5");
                    if (ui.coin) {
                        _status.coinCoeff = get.coinCoeff([game.me.name]);
                    }
                    // 如果是单挑就亮身份了（毕竟身份没意义了）
                    if (game.players.length == 2) {
                        game.showIdentity(true);
                        var map = {};
                        for (var i in lib.playerOL) {
                            map[i] = lib.playerOL[i].identity;
                        }
                        game.broadcast(function (map) {
                            for (var i in map) {
                                lib.playerOL[i].identity = map[i];
                                lib.playerOL[i].setIdentity();
                                lib.playerOL[i].ai.shown = 1;
                            }
                        }, map);
                    }
                    // 否则重置AI对身份的信息
                    else {
                        for (var i = 0; i < game.players.length; i++) {
                            game.players[i].ai.shown = 0;
                        }
                    }
                    // 这里是主公的设置么
                    if (game.zhu == game.me && game.zhu.identity != "zhu" && _status.library && _status.library.identityShown) {
                        delete game.zhu; // 如果主公是自己或者主公不是主公就删除主公是什么意思……
                    } else {
                        // ？？？game.zhu2才是明忠么？？
                        // game.zhong才是明忠
                        // 这个是AI对主公的认识，原数值是1，改成0。
                        game.zhu.ai.shown = 0;
                        if (game.zhu2) {
                            game.zhong = game.zhu;
                            game.zhu = game.zhu2;
                            delete game.zhu2;
                            if (game.zhong.sex == "male" && game.zhong.maxHp <= 4) {
                                game.zhong.addSkill("dongcha");
                            } else {
                                game.zhong.addSkill("sheshen");
                            }
                        }
                    }
                    // 这里就游戏开始时了。
                    game.syncState();
                    event.trigger("gameStart");

                    // 设置每名角色的位置跟信息
                    var players = get.players(lib.sort.position);
                    var info = [];
                    for (var i = 0; i < players.length; i++) {
                        info.push({
                            name: players[i].name,
                            name2: players[i].name2,
                            identity: players[i].identity,
                        });
                    }
                    (_status.videoInited = true), game.addVideo("init", null, info);
                    // 这个是抽卡顺序了
                    players.randomSort();
                    game.gameDraw(players[0] || _status.firstAct || game.zhu || game.me);
                    game.phaseLoop(players[0] || _status.firstAct || game.zhu || game.me);
                },
                game: {
                    getState: function () {
                        var state = {};
                        for (var i in lib.playerOL) {
                            var player = lib.playerOL[i];
                            state[i] = {
                                identity: player.identity,
                            };
                            if (player == game.zhu) {
                                state[i].zhu = player.isZhu ? true : false;
                            }
                            if (player == game.zhong) {
                                state[i].zhong = true;
                            }
                            if (player.special_identity) {
                                state[i].special_identity = player.special_identity;
                            }
                            state[i].shown = player.ai.shown;
                        }
                        return state;
                    },
                    // game.zhu并不是这局游戏的主公，而是这局游戏的游戏开始的角色？
                    updateState: function (state) {
                        for (var i in state) {
                            var player = lib.playerOL[i];
                            if (player) {
                                player.identity = state[i].identity;
                                if (state[i].special_identity) {
                                    player.special_identity = state[i].special_identity;
                                    if (player.node.dieidentity) {
                                        player.node.dieidentity.innerHTML = get.translation(state[i].special_identity);
                                        player.node.identity.firstChild.innerHTML = get.translation(state[i].special_identity + "_bg");
                                    }
                                }
                                if (typeof state[i].zhu == "boolean") {
                                    game.zhu = player;
                                    player.isZhu = state[i].zhu;
                                }
                                if (state[i].zhong) {
                                    game.zhong = player;
                                }
                                player.ai.shown = state[i].shown;
                            }
                        }
                    },
                    // 有关房间的信息……居然全部都是使用?的设置，得全部重写……
                    getRoomInfo: function (uiintro) {
                        uiintro.add('<div class="text chat">游戏模式：' + (lib.configOL.identity_mode == "zhong" ? "明忠" : "标准"));
                        uiintro.add('<div class="text chat">双将模式：' + (lib.configOL.double_character ? "开启" : "关闭"));
                        if (lib.configOL.identity_mode != "zhong") {
                            uiintro.add('<div class="text chat">双内奸：' + (lib.configOL.double_nei ? "开启" : "关闭"));
                            uiintro.add('<div class="text chat">加强主公：' + (lib.configOL.enhance_zhu ? "开启" : "关闭"));
                        } else {
                            uiintro.add('<div class="text chat">卡牌替换：' + (lib.configOL.zhong_card ? "开启" : "关闭"));
                        }
                        uiintro.add('<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒");
                        uiintro.add('<div class="text chat">屏蔽弱将：' + (lib.configOL.ban_weak ? "开启" : "关闭"));
                        var last = uiintro.add('<div class="text chat">屏蔽强将：' + (lib.configOL.ban_strong ? "开启" : "关闭"));
                        if (lib.configOL.banned.length) {
                            last = uiintro.add('<div class="text chat">禁用武将：' + get.translation(lib.configOL.banned));
                        }
                        if (lib.configOL.bannedcards.length) {
                            last = uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
                        }
                        last.style.paddingBottom = "8px";
                    },
                    //可标记身份种类
                    getIdentityList: function (player) {
                        if (player.identityShown) return;
                        if (player == game.me) return;
                        if (_status.mode == "zhong") {
                            if (player.fanfixed) return;
                            if (game.zhu && game.zhu.isZhu) {
                                return {
                                    fan: "自",
                                    zhong: "异",
                                    nei: "路",
                                    cai: "猜",
                                };
                            } else {
                                return {
                                    fan: "自",
                                    zhong: "异",
                                    nei: "路",
                                    zhu: "黑",
                                    cai: "猜",
                                };
                            }
                        } else {
                            return {
                                fan: "自",
                                zhong: "异",
                                nei: "路",
                                zhu: "黑",
                                cai: "猜",
                            };
                        }
                    },
                    getVideoName: function () {
                        var str = get.translation(game.me.name);
                        if (game.me.name2) {
                            str += "/" + get.translation(game.me.name2);
                        }
                        var name = [str, get.cnNumber(get.playerNumber()) + "人" + get.translation(lib.config.mode) + " - " + lib.translate[game.me.identity + "2"]];
                        return name;
                    },
                    //战绩相关
                    addRecord: function (bool) {
                        if (typeof bool == "boolean") {
                            if (!lib.config.gameRecord.old_identity) {
                                lib.config.gameRecord.old_identity = {
                                    data: {},
                                };
                            }
                            var data = lib.config.gameRecord.old_identity.data;
                            var identity = game.me.identity;
                            if (identity == "mingzhong") {
                                identity = "zhong";
                            }
                            if (!data[identity]) {
                                data[identity] = [0, 0];
                            }
                            if (bool) {
                                data[identity][0]++;
                            } else {
                                data[identity][1]++;
                            }
                            var list = ["zhu", "zhong", "nei", "fan"];
                            var str = "";
                            for (var i = 0; i < list.length; i++) {
                                if (data[list[i]]) {
                                    str += lib.translate[list[i] + "2"] + "：" + data[list[i]][0] + "胜" + " " + data[list[i]][1] + "负<br>";
                                }
                            }
                            lib.config.gameRecord.old_identity.str = str;
                            game.saveConfig("gameRecord", lib.config.gameRecord);
                        }
                    },
                    // 这个是展示身份的函数，吼吼
                    // 但是是全部角色都展示……囧
                    showIdentity: function (me) {
                        for (var i = 0; i < game.players.length; i++) {
                            // if(me===false&&game.players[i]==game.me) continue;
                            game.players[i].node.identity.classList.remove("guessing");
                            game.players[i].identityShown = true;
                            game.players[i].ai.shown = 1;
                            game.players[i].setIdentity(game.players[i].identity);
                            if (game.players[i].special_identity) {
                                game.players[i].node.identity.firstChild.innerHTML = get.translation(game.players[i].special_identity + "_bg");
                            }
                            if (game.players[i].identity == "zhu") {
                                game.players[i].isZhu = true;
                            }
                        }
                        if (_status.clickingidentity) {
                            for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                                _status.clickingidentity[1][i].delete();
                                _status.clickingidentity[1][i].style.transform = "";
                            }
                            delete _status.clickingidentity;
                        }
                    },
                    //检测胜利条件
                    checkResult: function () {
                        if (_status.library && _status.library.checkResult) {
                            _status.library.checkResult();
                            return;
                        }
                        // 如果这局没有主公（单纯两方对战的话）
                        if (!game.zhu) {
                            if (get.population("fan") == 0) {
                                switch (game.me.identity) {
                                    case "fan":
                                        game.over(false);
                                        break;
                                    case "zhong":
                                        game.over(true);
                                        break;
                                    default:
                                        game.over();
                                        break;
                                }
                            } else if (get.population("zhong") == 0) {
                                switch (game.me.identity) {
                                    case "fan":
                                        game.over(true);
                                        break;
                                    case "zhong":
                                        game.over(false);
                                        break;
                                    default:
                                        game.over();
                                        break;
                                }
                            }
                            return;
                        }
                        // 如果主公还活着并且反+内还有人存活，不继续检测了
                        if (game.zhu.isAlive() && get.population("fan") > 0) return;
                        if (game.zhong) {
                            game.zhong.identity = "zhong";
                        }
                        game.showIdentity();
                        if (game.me.identity == "zhu" || game.me.identity == "zhong") {
                            if (game.zhu.classList.contains("dead")) {
                                game.over(false);
                            } else {
                                game.over(true);
                            }
                        } else if (game.me.identity == "nei") {
                            if (game.players.length == 1 && game.me.isAlive()) {
                                game.over(true);
                            } else if (!game.me.isAlive()) {
                                game.over(false);
                            } else {
                                game.over();
                            }
                        } else {
                            if ((get.population("fan") + get.population("zhong") > 0 || get.population("nei") > 1) && game.zhu.classList.contains("dead")) {
                                game.over(true);
                            } else {
                                game.over(false);
                            }
                        }
                        //晓美焰
                        var p = game.filterPlayer();
                        for (var i = 0; i < p.length; i++) {
                            if (p[i].hasSkill("gezi_time") && p[i].storage.gezi_time) {
                                var player = p[i];
                                var gezi_homura = [];
                                for (var j = 0; j < player.storage.gezi_time.length; j++) {
                                    gezi_homura.push({
                                        name: player.storage.gezi_time[j].name,
                                        suit: player.storage.gezi_time[j].suit,
                                        number: player.storage.gezi_time[j].number,
                                        nature: player.storage.gezi_time[j].nature,
                                    });
                                }
                                lib.config.gameRecord.gezi_homura = gezi_homura;
                                game.saveConfig("gameRecord", lib.config.gameRecord);
                            }
                        }
                    },
                    // OL都是玩家部分，也就是说这里是确认玩家有没有赢
                    checkOnlineResult: function (player) {
                        if (game.zhu.isAlive()) {
                            return player.identity == "zhu" || player.identity == "zhong";
                        } else if (game.players.length == 1 && game.players[0].identity == "nei") {
                            return player.isAlive();
                        } else {
                            return player.identity == "fan";
                        }
                    },
                    //这里是选将，也就是游戏开始部分。
                    chooseCharacter: function () {
                        var next = game.createEvent("chooseCharacter", false);
                        next.showConfig = true;
                        // 这个是分发身份的东西
                        next.addPlayer = function (player) {
                            // 果然是因为list长度的问题而-3和-2啊
                            // 不过，-2的是当前身份，-3的是少一个人的身份，然后玩家的身份是当前-少一人所剩下来的那个
                            // 请容我打出一句一脸懵逼。
                            var list = lib.config.mode_config.identity.identity[game.players.length - 3].slice(0);
                            var list2 = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                            for (var i = 0; i < list.length; i++) list2.remove(list[i]);
                            player.identity = list2[0];
                            player.setIdentity("cai");
                        };
                        next.removePlayer = function () {
                            return game.players.randomGet(game.me, game.zhu);
                        };
                        // 这段全是AI吗？好他喵混乱啊囧
                        // 这里的list应该是和addplayer的list是分开的
                        // 看来是武将列表，所以我就不纠结到底是在哪里引用的了
                        // 顺便，list是所有武将池，list2是主公武将池
                        next.ai = function (player, list, list2, back) {
                            if (_status.library && _status.library.chooseCharacterAi) {
                                if (_status.library.chooseCharacterAi(player, list, list2, back) !== false) {
                                    return;
                                }
                            }
                            // 如果是明忠模式
                            if (_status.event.zhongmode) {
                                // 如果是双将
                                if (get.config("double_character")) {
                                    // 使用-3的两个身份启动是什么鬼
                                    player.init(list[0], list[1]);
                                } else {
                                    player.init(list[0]);
                                }
                                // 是明忠的话，加血加上限
                                if (player.identity == "mingzhong") {
                                    player.hp++;
                                    player.maxHp++;
                                    player.update();
                                }
                            }
                            // 如果是主公的话
                            else if (player.identity == "zhu") {
                                var list2 = [];
                                list2.randomSort();
                                var choice, choice2;
                                // 如果是主公且概率检测过了，随机选择一个主公武将。
                                if (!_status.event.zhongmode && Math.random() - 0.8 < 0 && list2.length) {
                                    choice = list2[0];
                                    choice2 = list[0];
                                    if (choice2 == choice) {
                                        choice2 = list[1];
                                    }
                                }
                                // 要不然就无脑选1，2
                                else {
                                    choice = list[0];
                                    choice2 = list[1];
                                }
                                // player.init(武将1，武将2)
                                // 总之，这里是武将创建的地方
                                if (get.config("double_character")) {
                                    player.init(choice, choice2);
                                } else {
                                    player.init(choice);
                                }
                            } else if (get.config("akyuu_bool") && player.identity == "nei" && lib.config.gameRecord.incident && lib.config.gameRecord.incident.data["akyuu"] && lib.config.gameRecord.incident.data["akyuu"] >= 3) {
                                lib.character["akyuu"] = ["female", "shen", Infinity, ["library_mengji", "library_yixiang", "library_qiuwen", "boom"], []];
                                lib.character["akyuu"][4].push("ext:东方project/akyuu.jpg");
                                lib.characterIntro["akyuu"] = "全名稗田阿求，将毕生奉献于记载幻想乡的历史的稗田家的现任家主。持有过目不忘的记忆能力。<br><b>画师：渡瀬　玲<br></b><br>现因一些原因，被赋予了幻想乡的管理员权限。不过依然是和平常一样做着记录屋的工作。";
                                player.init("akyuu");
                            } else {
                                if (get.config("double_character")) {
                                    player.init(list[0], list[1]);
                                } else {
                                    player.init(list[0]);
                                }
                            }
                            if (back) {
                                list.remove(player.name);
                                list.remove(player.name2);
                                for (var i = 0; i < list.length; i++) {
                                    back.push(list[i]);
                                }
                            }
                        };
                        next.setContent(function () {
                            "step 0";
                            ui.arena.classList.add("choose-character");
                            var i;
                            var list;
                            var list2 = [];
                            var list3 = [];
                            var identityList;
                            var chosen = lib.config.continue_name || [];
                            game.saveConfig("continue_name");
                            event.chosen = chosen;
                            // 这一段设置身份
                            if (_status.mode == "zhong") {
                                event.zhongmode = true;
                                identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
                            } else {
                                identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                                if (get.config("double_nei")) {
                                    switch (get.playerNumber()) {
                                        case 8:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 7:
                                            identityList.remove("zhong");
                                            identityList.push("nei");
                                            break;
                                        case 6:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 5:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 4:
                                            identityList.remove("zhong");
                                            identityList.push("nei");
                                            break;
                                        case 3:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                    }
                                }
                            }

                            // 自由选择身份/座位的UI
                            var addSetting = function (dialog) {
                                dialog.add("选择身份").classList.add("add-setting");
                                var table = document.createElement("div");
                                table.classList.add("add-setting");
                                table.style.margin = "0";
                                table.style.width = "100%";
                                table.style.position = "relative";
                                var listi;
                                if (event.zhongmode) {
                                    listi = ["random", "zhu", "mingzhong", "zhong", "nei", "fan"];
                                } else {
                                    listi = ["random", "zhu", "zhong", "nei", "fan"];
                                }

                                for (var i = 0; i < listi.length; i++) {
                                    var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
                                    td.link = listi[i];
                                    if (td.link === game.me.identity) {
                                        td.classList.add("bluebg");
                                    }
                                    table.appendChild(td);
                                    td.innerHTML = "<span>" + get.translation(listi[i] + "2") + "</span>";
                                    td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                                        if (_status.dragged) return;
                                        if (_status.justdragged) return;
                                        _status.tempNoButton = true;
                                        setTimeout(function () {
                                            _status.tempNoButton = false;
                                        }, 500);
                                        var link = this.link;
                                        if (game.zhu.name) {
                                            if (link != "random") {
                                                _status.event.parent.fixedseat = get.distance(game.me, game.zhu, "absolute");
                                            }
                                            game.zhu.uninit();
                                            delete game.zhu.isZhu;
                                            delete game.zhu.identityShown;
                                        }
                                        var current = this.parentNode.querySelector(".bluebg");
                                        if (current) {
                                            current.classList.remove("bluebg");
                                        }
                                        current = seats.querySelector(".bluebg");
                                        if (current) {
                                            current.classList.remove("bluebg");
                                        }
                                        if (link == "random") {
                                            if (event.zhongmode) {
                                                link = ["zhu", "zhong", "nei", "fan", "mingzhong"].randomGet();
                                            } else {
                                                link = ["zhu", "zhong", "nei", "fan"].randomGet();
                                            }
                                            for (var i = 0; i < this.parentNode.childElementCount; i++) {
                                                if (this.parentNode.childNodes[i].link == link) {
                                                    this.parentNode.childNodes[i].classList.add("bluebg");
                                                }
                                            }
                                        } else {
                                            this.classList.add("bluebg");
                                        }
                                        num = get.config("choice_" + link);
                                        if (event.zhongmode) {
                                            num = 6;
                                            if (link == "zhu" || link == "nei" || link == "mingzhong") {
                                                num = 8;
                                            }
                                        }
                                        _status.event.parent.swapnodialog = function (dialog, list) {
                                            var buttons = ui.create.div(".buttons");
                                            var node = dialog.buttons[0].parentNode;
                                            dialog.buttons = ui.create.buttons(list, "character", buttons);
                                            dialog.content.insertBefore(buttons, node);
                                            buttons.animate("start");
                                            node.remove();
                                            game.uncheck();
                                            game.check();
                                            for (var i = 0; i < seats.childElementCount; i++) {
                                                if (get.distance(game.zhu, game.me, "absolute") === seats.childNodes[i].link) {
                                                    seats.childNodes[i].classList.add("bluebg");
                                                }
                                            }
                                        };
                                        _status.event = _status.event.parent;
                                        _status.event.step = 0;
                                        _status.event.identity = link;
                                        game.resume();
                                    });
                                }
                                dialog.content.appendChild(table);
                                //这里是选择座位
                                dialog.add("选择座位").classList.add("add-setting");
                                var seats = document.createElement("div");
                                seats.classList.add("add-setting");
                                seats.style.margin = "0";
                                seats.style.width = "100%";
                                seats.style.position = "relative";
                                for (var i = 2; i <= game.players.length; i++) {
                                    var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
                                    td.innerHTML = get.cnNumber(i, true);
                                    td.link = i - 1;
                                    seats.appendChild(td);
                                    if (get.distance(game.zhu, game.me, "absolute") === i - 1) {
                                        td.classList.add("bluebg");
                                    }
                                    td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                                        if (_status.dragged) return;
                                        if (_status.justdragged) return;
                                        if (get.distance(game.zhu, game.me, "absolute") == this.link) return;
                                        var current = this.parentNode.querySelector(".bluebg");
                                        if (current) {
                                            current.classList.remove("bluebg");
                                        }
                                        this.classList.add("bluebg");
                                        for (var i = 0; i < game.players.length; i++) {
                                            if (get.distance(game.players[i], game.me, "absolute") == this.link) {
                                                game.swapSeat(game.zhu, game.players[i], false);
                                                return;
                                            }
                                        }
                                    });
                                }
                                dialog.content.appendChild(seats);

                                dialog.add(ui.create.div(".placeholder.add-setting"));
                                dialog.add(ui.create.div(".placeholder.add-setting"));
                                if (get.is.phoneLayout()) dialog.add(ui.create.div(".placeholder.add-setting"));
                            };
                            // 如果自动选择身份/座位没有打开
                            var removeSetting = function () {
                                var dialog = _status.event.dialog;
                                if (dialog) {
                                    dialog.style.height = "";
                                    delete dialog._scrollset;
                                    var list = Array.from(dialog.querySelectorAll(".add-setting"));
                                    while (list.length) {
                                        list.shift().remove();
                                    }
                                    ui.update();
                                }
                            };

                            // 这里是读取设置
                            event.addSetting = addSetting;
                            event.removeSetting = removeSetting;
                            event.list = [];
                            // 洗身份
                            identityList.randomSort();
                            // 不是很懂这段是什么，身份事件？
                            if (event.identity) {
                                identityList.remove(event.identity);
                                identityList.unshift(event.identity);
                                if (event.fixedseat) {
                                    // 在这里设置了game.zhu的身份……
                                    var zhuIdentity = _status.mode == "zhong" ? "mingzhong" : "zhu";
                                    if (zhuIdentity != event.identity) {
                                        identityList.remove(zhuIdentity);
                                        identityList.splice(event.fixedseat, 0, zhuIdentity);
                                    }
                                    delete event.fixedseat;
                                }
                                delete event.identity;
                            }
                            // 然后是正常模式的设置：
                            else if (_status.mode != "zhong" && (!_status.library || !_status.library.identityShown)) {
                                var ban_identity = [];
                                ban_identity.push(get.config("ban_identity") || "off");
                                if (ban_identity[0] != "off") {
                                    ban_identity.push(get.config("ban_identity2") || "off");
                                    if (ban_identity[1] != "off") {
                                        ban_identity.push(get.config("ban_identity3") || "off");
                                    }
                                }
                                ban_identity.remove("off");
                                // 如果阿求启动就就屏蔽掉路人身份
                                if (get.config("akyuu_bool") && !_status.connectMode && lib.config.gameRecord.incident && lib.config.gameRecord.incident.data["akyuu"] && lib.config.gameRecord.incident.data["akyuu"] >= 3) {
                                    ban_identity.push("nei");
                                }
                                if (ban_identity.length) {
                                    var identityList2 = identityList.slice(0);
                                    for (var i = 0; i < ban_identity.length; i++) {
                                        while (identityList2.remove(ban_identity[i]));
                                    }
                                    ban_identity = identityList2.randomGet();
                                    identityList.remove(ban_identity);
                                    identityList.splice(game.players.indexOf(game.me), 0, ban_identity);
                                }
                            }
                            // 所有角色检索：
                            for (i = 0; i < game.players.length; i++) {
                                // 如果是乱斗模式并且乱斗模式设置明身份
                                if (_status.library && _status.library.identityShown) {
                                    // 所有角色把身份翻出来
                                    if (game.players[i].identity == "zhu") game.zhu = game.players[i];
                                    game.players[i].identityShown = true;
                                }
                                // 正常模式的话
                                else {
                                    // 隐藏所有角色的身份
                                    game.players[i].node.identity.classList.add("guessing");
                                    game.players[i].identity = identityList[i];
                                    game.players[i].setIdentity("cai");
                                    if (event.zhongmode) {
                                        if (identityList[i] == "mingzhong") {
                                            game.zhu = game.players[i];
                                        } else if (identityList[i] == "zhu") {
                                            game.zhu2 = game.players[i];
                                        }
                                    }
                                    // 主公设好
                                    else {
                                        if (identityList[i] == "zhu") {
                                            game.zhu = game.players[i];
                                        }
                                    }
                                    // 全部隐藏
                                    game.players[i].identityShown = false;
                                }
                            }

                            // 有特殊身份，不是明忠，的8人局
                            if (get.config("special_identity") && !event.zhongmode && game.players.length == 8) {
                                for (var i = 0; i < game.players.length; i++) {
                                    delete game.players[i].special_identity;
                                }
                                event.special_identity = [];
                                var zhongs = game.filterPlayer(function (current) {
                                    return current.identity == "zhong";
                                });
                                var fans = game.filterPlayer(function (current) {
                                    return current.identity == "fan";
                                });
                                if (fans.length >= 1) {
                                    fans.randomRemove().special_identity = "identity_zeishou";
                                    event.special_identity.push("identity_zeishou");
                                }
                                if (zhongs.length > 1) {
                                    zhongs.randomRemove().special_identity = "identity_dajiang";
                                    zhongs.randomRemove().special_identity = "identity_junshi";
                                    event.special_identity.push("identity_dajiang");
                                    event.special_identity.push("identity_junshi");
                                } else if (zhongs.length == 1) {
                                    if (Math.random() < 0.5) {
                                        zhongs.randomRemove().special_identity = "identity_dajiang";
                                        event.special_identity.push("identity_dajiang");
                                    } else {
                                        zhongs.randomRemove().special_identity = "identity_junshi";
                                        event.special_identity.push("identity_junshi");
                                    }
                                }
                            }

                            // 如果目前没有主，玩家是主
                            if (!game.zhu) game.zhu = game.me;
                            // 否则，亮出主公的身份
                            else {
                                game.me.setIdentity();
                                game.me.node.identity.classList.remove("guessing");
                            }

                            // 这里才是正经发武将的部分
                            for (i in lib.character) {
                                if (chosen.contains(i)) continue;
                                if (lib.filter.characterDisabled(i)) continue;
                                // 可以用的全部加入列表
                                if (!i || !lib.character[i]) continue;
                                event.list.push(i);
                                // 主公角色加入另外一个主公专属区
                                if (lib.character[i][4] && lib.character[i][4].contains("zhu")) {
                                    list2.push(i);
                                } else {
                                    // 这里是不为主公的区域
                                    list3.push(i);
                                }
                            }
                            // 都随机整理
                            event.list.randomSort();
                            // 非主公武将随机
                            list3.randomSort();
                            // 这个应该是乱斗处理掉非将池里的角色
                            if (_status.library && _status.library.chooseCharacterFilter) {
                                _status.library.chooseCharacterFilter(event.list, list2, list3);
                            }
                            // 然后获得各个身份的数量
                            var num = get.config("choice_" + game.me.identity);
                            if (event.zhongmode) {
                                num = 6;
                                if (game.me.identity == "zhu" || game.me.identity == "nei" || game.me.identity == "mingzhong") {
                                    num = 8;
                                }
                            }
                            // 如果自己不是主公
                            if (game.zhu != game.me) {
                                // 让身份为主公的AI选将
                                //event.ai(game.zhu,event.list,list2)
                                // 把已经选择的（主公的卡牌扔出去）
                                event.list.remove(game.zhu.name);
                                event.list.remove(game.zhu.name2);
                                // 如果是乱斗模式的话，让选
                                if (_status.library && _status.library.chooseCharacter) {
                                    list = _status.library.chooseCharacter(event.list, num);
                                    if (list === false || list === "nozhu") {
                                        list = event.list.slice(0, num);
                                    }
                                } else {
                                    list = event.list.slice(0, num);
                                }
                            } else {
                                // 然后，如果是乱斗模式
                                if (_status.library && _status.library.chooseCharacter) {
                                    list = _status.library.chooseCharacter(list2, list3, num);
                                    if (list === false) {
                                        if (event.zhongmode) {
                                            list = list3.slice(0, 6);
                                        } else {
                                            list = list2.concat(list3.slice(0, num));
                                        }
                                    } else if (list === "nozhu") {
                                        list = event.list.slice(0, num);
                                    }
                                } else {
                                    // 明忠
                                    if (event.zhongmode) {
                                        list = list3.slice(0, 8);
                                    }
                                    // 合并武将池
                                    else {
                                        list = list2.concat(list3.slice(0, num));
                                    }
                                }
                            }
                            delete event.swapnochoose;
                            var dialog;
                            // ？
                            if (event.swapnodialog) {
                                dialog = ui.dialog;
                                event.swapnodialog(dialog, list);
                                delete event.swapnodialog;
                            } else {
                                // 开始了！选择角色重头戏！
                                // 消息
                                var str = "选择角色";
                                // 如果是乱斗，根据乱斗设置消息
                                if (_status.library && _status.library.chooseCharacterStr) {
                                    str = _status.library.chooseCharacterStr;
                                }
                                // 用消息和上面的武将池做一个选择框
                                dialog = ui.create.dialog(str, "hidden", [list, "character"]);
                                if (!_status.library || !_status.library.noAddSetting) {
                                    if (get.config("change_identity")) {
                                        addSetting(dialog);
                                    }
                                }
                            }
                            if (game.me.special_identity) {
                                dialog.setCaption("选择角色（" + get.translation(game.me.special_identity) + "）");
                                game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + "_bg");
                            } else {
                                dialog.setCaption("选择角色（" + get.translation(game.me.identity) + "）");
                                game.me.setIdentity();
                            }
                            if (!event.chosen.length) {
                                game.me.chooseButton(dialog, true).set("onfree", true).selectButton = function () {
                                    if (_status.library && _status.library.doubleCharacter) return 2;
                                    return get.config("double_character") ? 2 : 1;
                                };
                            } else {
                                lib.init.onfree();
                            }
                            // 这里是作弊，换将卡什么的
                            ui.create.cheat = function () {
                                _status.createControl = ui.cheat2;
                                ui.cheat = ui.create.control("更换", function () {
                                    if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                                        return;
                                    }
                                    if (game.zhu != game.me) {
                                        event.list.randomSort();
                                        if (_status.library && _status.library.chooseCharacter) {
                                            list = _status.library.chooseCharacter(event.list, num);
                                            if (list === false || list === "nozhu") {
                                                list = event.list.slice(0, num);
                                            }
                                        } else {
                                            list = event.list.slice(0, num);
                                        }
                                    } else {
                                        list3.randomSort();
                                        if (_status.library && _status.library.chooseCharacter) {
                                            list = _status.library.chooseCharacter(list2, list3, num);
                                            if (list === false) {
                                                if (event.zhongmode) {
                                                    list = list3.slice(0, 6);
                                                } else {
                                                    list = list2.concat(list3.slice(0, num));
                                                }
                                            } else if (list === "nozhu") {
                                                event.list.randomSort();
                                                list = event.list.slice(0, num);
                                            }
                                        } else {
                                            if (event.zhongmode) {
                                                list = list3.slice(0, 6);
                                            } else {
                                                list = list2.concat(list3.slice(0, num));
                                            }
                                        }
                                    }
                                    var buttons = ui.create.div(".buttons");
                                    var node = _status.event.dialog.buttons[0].parentNode;
                                    _status.event.dialog.buttons = ui.create.buttons(list, "character", buttons);
                                    _status.event.dialog.content.insertBefore(buttons, node);
                                    buttons.animate("start");
                                    node.remove();
                                    game.uncheck();
                                    game.check();
                                });
                                delete _status.createControl;
                            };
                            if (lib.onfree) {
                                lib.onfree.push(function () {
                                    event.dialogxx = ui.create.characterDialog("heightset");
                                    if (ui.cheat2) {
                                        ui.cheat2.animate("controlpressdownx", 500);
                                        ui.cheat2.classList.remove("disabled");
                                    }
                                });
                            } else {
                                event.dialogxx = ui.create.characterDialog("heightset");
                            }
                            // 作弊：自由选将
                            ui.create.cheat2 = function () {
                                ui.cheat2 = ui.create.control("自由选将", function () {
                                    if (this.dialog == _status.event.dialog) {
                                        this.dialog.close();
                                        _status.event.dialog = this.backup;
                                        this.backup.open();
                                        delete this.backup;
                                        game.uncheck();
                                        game.check();
                                        if (ui.cheat) {
                                            ui.cheat.animate("controlpressdownx", 500);
                                            ui.cheat.classList.remove("disabled");
                                        }
                                    } else {
                                        this.backup = _status.event.dialog;
                                        _status.event.dialog.close();
                                        _status.event.dialog = _status.event.parent.dialogxx;
                                        this.dialog = _status.event.dialog;
                                        this.dialog.open();
                                        game.uncheck();
                                        game.check();
                                        if (ui.cheat) {
                                            ui.cheat.classList.add("disabled");
                                        }
                                    }
                                });
                                if (lib.onfree) {
                                    ui.cheat2.classList.add("disabled");
                                }
                            };
                            if (!_status.library || !_status.library.chooseCharacterFixed) {
                                if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
                                if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
                            }
                            ("step 1");
                            if (ui.cheat) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                            if (ui.cheat2) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                            if (event.chosen.length) {
                                game.me.init(event.chosen[0], event.chosen[1]);
                            } else if (event.modchosen) {
                                if (event.modchosen[0] == "random") event.modchosen[0] = result.buttons[0].link;
                                else event.modchosen[1] = result.buttons[0].link;
                                game.me.init(event.modchosen[0], event.modchosen[1]);
                            } else if (result.buttons.length == 2) {
                                game.me.init(result.buttons[0].link, result.buttons[1].link);
                            } else {
                                game.me.init(result.buttons[0].link);
                            }
                            game.addRecentCharacter(game.me.name, game.me.name2);
                            event.list.remove(game.me.name);
                            event.list.remove(game.me.name2);
                            /* 主公加血 */
                            event.list.randomSort();
                            if (!lib.config.old_tutorial) {
                                lib.character["zigui"] = ["female", "5", 5, [], []];
                                lib.character["zigui"][4].push("ext:东方project/zigui.jpg");
                                lib.translate.zigui = "子规";
                                event.list[0] = "zigui";
                            }
                            for (var i = 0; i < game.players.length; i++) {
                                // 主公和玩家不选将（已经选过了）
                                if (game.players[i] != game.me) {
                                    event.ai(game.players[i], event.list.splice(0, get.config("choice_" + game.players[i].identity)), null, event.list);
                                }
                            }
                            setTimeout(function () {
                                ui.arena.classList.remove("choose-character");
                            }, 500);

                            if (event.special_identity) {
                                for (var i = 0; i < event.special_identity.length; i++) {
                                    game.zhu.addSkill(event.special_identity[i]);
                                }
                            }
                        });
                    },
                    // 联机模式下的选将
                    chooseCharacterOL: function () {
                        var next = game.createEvent("chooseCharacter", false);
                        next.setContent(function () {
                            "step 0";
                            ui.arena.classList.add("choose-character");
                            var i;
                            var identityList;
                            // 明忠模式
                            if (_status.mode == "zhong") {
                                event.zhongmode = true;
                                identityList = ["zhu", "zhong", "mingzhong", "nei", "fan", "fan", "fan", "fan"];
                            }
                            // 正常模式
                            else {
                                identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                                if (lib.configOL.double_nei) {
                                    switch (lib.configOL.number) {
                                        case 8:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 7:
                                            identityList.remove("zhong");
                                            identityList.push("nei");
                                            break;
                                        case 6:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 5:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                        case 4:
                                            identityList.remove("zhong");
                                            identityList.push("nei");
                                            break;
                                        case 3:
                                            identityList.remove("fan");
                                            identityList.push("nei");
                                            break;
                                    }
                                }
                            }
                            identityList.randomSort();
                            //　随机分发身份
                            for (i = 0; i < game.players.length; i++) {
                                game.players[i].identity = identityList[i];
                                game.players[i].setIdentity("cai");
                                game.players[i].node.identity.classList.add("guessing");
                                if (event.zhongmode) {
                                    if (identityList[i] == "mingzhong") {
                                        game.zhu = game.players[i];
                                    } else if (identityList[i] == "zhu") {
                                        game.zhu2 = game.players[i];
                                    }
                                } else {
                                    if (identityList[i] == "zhu") {
                                        game.zhu = game.players[i];
                                    }
                                }
                                game.players[i].identityShown = false;
                            }
                            if (lib.configOL.special_identity && !event.zhongmode && game.players.length == 8) {
                                var map = {};
                                var zhongs = game.filterPlayer(function (current) {
                                    return current.identity == "zhong";
                                });
                                var fans = game.filterPlayer(function (current) {
                                    return current.identity == "fan";
                                });
                                if (fans.length >= 1) {
                                    map.identity_zeishou = fans.randomRemove();
                                }
                                if (zhongs.length > 1) {
                                    map.identity_dajiang = zhongs.randomRemove();
                                    map.identity_junshi = zhongs.randomRemove();
                                } else if (zhongs.length == 1) {
                                    if (Math.random() < 0.5) {
                                        map.identity_dajiang = zhongs.randomRemove();
                                    } else {
                                        map.identity_junshi = zhongs.randomRemove();
                                    }
                                }
                                game.broadcastAll(
                                    function (zhu, map) {
                                        for (var i in map) {
                                            map[i].special_identity = i;
                                        }
                                    },
                                    game.zhu,
                                    map,
                                );
                                event.special_identity = map;
                            }
                            // 玩家可以看身份了
                            game.me.setIdentity();
                            game.me.node.identity.classList.remove("guessing");
                            if (game.me.special_identity) {
                                game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + "_bg");
                            }
                            for (var i = 0; i < game.players.length; i++) {
                                game.players[i].send(
                                    function (me, identity) {
                                        for (var i in lib.playerOL) {
                                            lib.playerOL[i].setIdentity("cai");
                                            lib.playerOL[i].node.identity.classList.add("guessing");
                                        }
                                        me.setIdentity(identity);
                                        me.node.identity.classList.remove("guessing");
                                        if (me.special_identity) {
                                            me.node.identity.firstChild.innerHTML = get.translation(me.special_identity + "_bg");
                                        }
                                        ui.arena.classList.add("choose-character");
                                    },
                                    game.players[i],
                                    game.players[i].identity,
                                );
                            }
                            var list;
                            var list2 = [];
                            var list3 = [];
                            event.list = [];
                            event.list2 = [];

                            var libCharacter = {};
                            for (var i = 0; i < lib.configOL.characterPack.length; i++) {
                                var pack = lib.characterPack[lib.configOL.characterPack[i]];
                                for (var j in pack) {
                                    if (lib.character[j]) libCharacter[j] = pack[j];
                                }
                            }
                            for (i in libCharacter) {
                                if (lib.filter.characterDisabled(i, libCharacter)) continue;
                                event.list.push(i);
                                event.list2.push(i);
                                if (libCharacter[i][4] && libCharacter[i][4].contains("zhu")) {
                                    list2.push(i);
                                } else {
                                    list3.push(i);
                                }
                            }
                            if (event.zhongmode) {
                                list = event.list.randomGets(8);
                            } else {
                                list = list2.concat(list3.randomGets(3));
                            }
                            ("step 1");
                            var list = [];
                            var selectButton = lib.configOL.double_character ? 2 : 1;

                            var num,
                                num2 = 0;
                            if (event.zhongmode) {
                                num = 6;
                            } else {
                                num = Math.floor(event.list.length / (game.players.length - 1));
                                num2 = event.list.length - num * (game.players.length - 1);
                                if (lib.configOL.double_nei) {
                                    num2 = Math.floor(num2 / 2);
                                }
                                if (num > 5) {
                                    num = 5;
                                }
                                if (num2 > 2) {
                                    num2 = 2;
                                }
                            }

                            for (var i = 0; i < game.players.length; i++) {
                                var str = "选择角色";
                                if (game.players[i].special_identity) {
                                    str += "（" + get.translation(game.players[i].special_identity) + "）";
                                }
                                if (lib.configOL.free_choose) {
                                    list.push([game.players[i], [str, [event.list, "character"]], selectButton, true]);
                                } else {
                                    list.push([game.players[i], [str, [event.list.randomRemove(num), "character"]], selectButton, true]);
                                }
                                //}
                            }
                            // 这里是选将处
                            game.me.chooseButtonOL(list, function (player, result) {
                                if (game.online || player == game.me) player.init(result.links[0], result.links[1]);
                            });
                            ("step 2");
                            if (ui.cheat2) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                            for (var i in result) {
                                if (result[i] && result[i].links) {
                                    for (var j = 0; j < result[i].links.length; j++) {
                                        event.list2.remove(result[i].links[j]);
                                    }
                                }
                            }
                            for (var i in result) {
                                if (result[i] == "ai") {
                                    result[i] = event.list2.randomRemove(lib.configOL.double_character ? 2 : 1);
                                } else {
                                    result[i] = result[i].links;
                                }
                                lib.playerOL[i].init(result[i][0], result[i][1]);
                            }
                            game.broadcast(function (result) {
                                for (var i in result) {
                                    lib.playerOL[i].init(result[i][0], result[i][1]);
                                }
                                setTimeout(function () {
                                    ui.arena.classList.remove("choose-character");
                                }, 500);
                            }, result);
                            setTimeout(function () {
                                ui.arena.classList.remove("choose-character");
                            }, 500);
                        });
                    },
                },
                translate: {
                    zhu: "黑",
                    zhong: "异",
                    mingzhong: "忠",
                    nei: "路",
                    fan: "自",
                    cai: "猜",
                    zhu2: "黑幕",
                    zhong2: "异变",
                    mingzhong2: "明忠",
                    nei2: "路人",
                    fan2: "自机",
                    zhu_win: "<u>胜利条件：</u>所有自机死亡",
                    zhu_lose: "<u>失败条件：</u>黑幕死亡",
                    zhu_flip: "<u>摊牌效果：</u>获得一张异变牌，并明置之。",
                    zhong_win: "<u>胜利条件：</u>黑幕胜利",
                    zhong_lose: "<u>失败条件：</u>黑幕死亡",
                    zhong_flip: "<u>摊牌效果：</u>令一名角色摸一张牌。",
                    fan_win: "<u>胜利条件：</u>黑幕死亡",
                    fan_lose: "<u>失败条件：</u>所有自机死亡",
                    fan_flip: "<u>摊牌效果：</u>令一名角色选择一项：明置身份牌，或你弃置其一张牌。",
                    nei_win: "<u>胜利条件：</u>无",
                    nei_lose: "<u>失败条件：</u>你死亡",
                    nei_flip: "<u>摊牌效果：</u>获得一张异变牌，并暗置。",
                    random2: "随机",
                    identity_junshi_bg: "师",
                    identity_dajiang_bg: "将",
                    identity_zeishou_bg: "首",
                    identity_junshi: "军师",
                    identity_dajiang: "大将",
                    identity_zeishou: "贼首",
                    ai_strategy_1: "均衡",
                    ai_strategy_2: "偏反",
                    ai_strategy_3: "偏主",
                    ai_strategy_4: "酱油",
                    ai_strategy_5: "天使",
                    ai_strategy_6: "仇主",
                    _tanpai: "明置身份",
                    _tanpai_bg: "变",
                    tanpai_fan: "自机摊牌效果",
                    tanpai_fan_info: "令一名角色选择一项：明置身份牌，或你弃置其一张牌。",
                    tanpai_zhong: "异变摊牌效果",
                    tanpai_zhong_info: "令一名角色摸一张牌",
                    _tanyibian: "明置异变？",
                    _tanyibian_bg: "？",
                    discard: "被弃一张牌",
                    dongcha: "洞察",
                    dongcha_info: "游戏开始时，随机一名反贼的身份对你可见；准备阶段，你可以弃置场上的一张牌",
                    sheshen: "舍身",
                    sheshen_info: "锁定技，主公处于濒死状态即将死亡时，令主公+1体力上限，回复体力至X点（X为你的体力值数），获得你的所有牌，然后你死亡",
                    library_qiuwen: "求闻",
                    library_qiuwen_info: "锁定技，游戏开始时，根据玩家最近所使用的角色，追加一至三条规则。",
                    shuchu: "输出",
                    shuchu_info: "一名角色的回合结束时，其摸X张牌（X为其本回合造成的伤害数且至少为1）。",
                    shuchu_2: "输出",
                    fuzhu: "辅助",
                    fuzhu_info: "所有角色体力上限+1，灵力上限+2，手牌上限+3。",
                    kongchang: "控场",
                    guding_skill: "控场",
                    kongchang_info: "一名角色造成伤害时，若其手牌数为场上最高（或之一），该伤害+1。",
                },
                element: {
                    player: {
                        init: function (player) {
                            if (_status.gezidedongfanglili) {
                                if (!player.node.lili) {
                                    player.node.lili = ui.create.div(".hp.actcount", player);
                                }
                                if (typeof player.lili !== "number") {
                                    player.lili = 3;
                                }
                                if (typeof player.maxlili !== "number") {
                                    player.maxlili = 5;
                                }
                                player.updatelili();
                            }
                        },
                        $dieAfter: function () {
                            if (_status.video) return;
                            if (!this.node.dieidentity) {
                                var str;
                                if (this.special_identity) {
                                    str = get.translation(this.special_identity);
                                } else {
                                    str = get.translation(this.identity + "2");
                                }
                                var node = ui.create.div(".damage.dieidentity", str, this);
                                ui.refresh(node);
                                node.style.opacity = 1;
                                this.node.dieidentity = node;
                            }
                            var trans = this.style.transform;
                            if (trans) {
                                if (trans.indexOf("rotateY") != -1) {
                                    this.node.dieidentity.style.transform = "rotateY(180deg)";
                                } else if (trans.indexOf("rotateX") != -1) {
                                    this.node.dieidentity.style.transform = "rotateX(180deg)";
                                } else {
                                    this.node.dieidentity.style.transform = "";
                                }
                            } else {
                                this.node.dieidentity.style.transform = "";
                            }
                        },
                        // 哦哦，这里是死亡奖惩！
                        dieAfter: function (source) {
                            if (!this.identityShown) {
                                game.broadcastAll(
                                    function (player, identity, identity2) {
                                        player.setIdentity(player.identity);
                                        player.identityShown = true;
                                        player.node.identity.classList.remove("guessing");
                                        if (identity) {
                                            player.node.identity.firstChild.innerHTML = get.translation(identity + "_bg");
                                            game.log(player, "的身份是", "#g" + get.translation(identity));
                                        } else {
                                            game.log(player, "的身份是", "#g" + get.translation(identity2 + "2"));
                                        }
                                    },
                                    this,
                                    this.special_identity,
                                    this.identity,
                                );
                            }
                            game.checkResult();
                            // 奖惩：获得1灵力和1技能牌
                            if (source) {
                                source.gainlili();
                                source.useSkill("gezi_jinengpai_use");
                            }
                            // 投降设置
                            if (!_status.over) {
                                var giveup;
                                if (get.population("fan") + get.population("nei") == 1) {
                                    for (var i = 0; i < game.players.length; i++) {
                                        if (game.players[i].identity == "fan" || game.players[i].identity == "nei") {
                                            giveup = game.players[i];
                                            break;
                                        }
                                    }
                                } else if (get.population("zhong") + get.population("mingzhong") + get.population("nei") == 0) {
                                    giveup = game.zhu;
                                }
                                if (giveup) {
                                    giveup.showGiveup();
                                }
                            }
                        },
                        // 等下，这是AI用的吧？
                        logAi: function (targets, card) {
                            if (this.ai.shown == 1 || this.hasSkill("mad")) return;
                            if (typeof targets == "number") {
                                this.ai.shown += targets;
                            } else {
                                var effect = 0,
                                    c,
                                    shown;
                                var info = get.info(card);
                                if (info.ai && info.ai.expose) {
                                    if (_status.event.name == "_wuxie") {
                                        if (_status.event.source && _status.event.source.ai.shown) {
                                            this.ai.shown += 0.2;
                                        }
                                    } else {
                                        this.ai.shown += info.ai.expose;
                                    }
                                }
                                if (targets.length > 0) {
                                    for (var i = 0; i < targets.length; i++) {
                                        shown = Math.abs(targets[i].ai.shown);
                                        if (shown < 0.2 || targets[i].identity == "nei") c = 0;
                                        else if (shown < 0.4) c = 0.5;
                                        else if (shown < 0.6) c = 0.8;
                                        else c = 1;
                                        var eff = get.effect(targets[i], card, this);
                                        effect += eff * c;
                                        if (eff == 0 && shown == 0 && this.identity == "zhong" && targets[i] != this) {
                                            effect += 0.1;
                                        }
                                    }
                                }
                                if (effect > 0) {
                                    if (effect < 1) c = 0.5;
                                    else c = 1;
                                    if (targets.length == 1 && targets[0] == this);
                                    else if (targets.length == 1) this.ai.shown += 0.2 * c;
                                    else this.ai.shown += 0.1 * c;
                                } else if (effect < 0 && this == game.me && game.me.identity != "nei") {
                                    if (targets.length == 1 && targets[0] == this);
                                    else if (targets.length == 1) this.ai.shown -= 0.2;
                                    else this.ai.shown -= 0.1;
                                }
                            }
                            if (this != game.me) this.ai.shown *= 2;
                            if (this.ai.shown > 0.95) this.ai.shown = 0.95;
                            if (this.ai.shown < -0.5) this.ai.shown = -0.5;

                            // 如果这不是联机模式
                            var marknow = !_status.connectMode && this != game.me && get.config("auto_mark_identity") && this.ai.identity_mark != "finished";
                            if (true) {
                                if (marknow && _status.clickingidentity && _status.clickingidentity[0] == this) {
                                    for (var i = 0; i < _status.clickingidentity[1].length; i++) {
                                        _status.clickingidentity[1][i].delete();
                                        _status.clickingidentity[1][i].style.transform = "";
                                    }
                                    delete _status.clickingidentity;
                                }
                                if (!Array.isArray(targets)) {
                                    targets = [];
                                }
                                var effect = 0,
                                    c,
                                    shown;
                                var zhu = game.zhu;
                                if (_status.mode == "zhong" && !game.zhu.isZhu) {
                                    zhu = game.zhong;
                                }
                                if (targets.length == 1 && targets[0] == this) {
                                    effect = 0;
                                } else if (this.identity != "nei") {
                                    if (this.ai.shown > 0) {
                                        if (this.identity == "fan") {
                                            effect = -1;
                                        } else {
                                            effect = 1;
                                        }
                                    }
                                } else if (targets.length > 0) {
                                    for (var i = 0; i < targets.length; i++) {
                                        shown = Math.abs(targets[i].ai.shown);
                                        if (shown < 0.2 || targets[i].identity == "nei") c = 0;
                                        else if (shown < 0.4) c = 0.5;
                                        else if (shown < 0.6) c = 0.8;
                                        else c = 1;
                                        effect += get.effect(targets[i], card, this, zhu) * c;
                                    }
                                }
                                if (this.identity == "nei") {
                                    if (effect > 0) {
                                        if (this.ai.identity_mark == "fan") {
                                            if (marknow) this.setIdentity();
                                            this.ai.identity_mark = "finished";
                                        } else {
                                            if (marknow) this.setIdentity("zhong");
                                            this.ai.identity_mark = "zhong";
                                        }
                                    } else if (effect < 0 && get.population("fan") > 0) {
                                        if (this.ai.identity_mark == "zhong") {
                                            if (marknow) this.setIdentity();
                                            this.ai.identity_mark = "finished";
                                        } else {
                                            if (marknow) this.setIdentity("fan");
                                            this.ai.identity_mark = "fan";
                                        }
                                    }
                                } else if (marknow) {
                                    if (effect > 0 && this.identity != "fan") {
                                        this.setIdentity("zhong");
                                        this.ai.identity_mark = "finished";
                                    } else if (effect < 0 && this.identity == "fan") {
                                        this.setIdentity("fan");
                                        this.ai.identity_mark = "finished";
                                    }
                                }
                            }
                        },
                    },
                },
                get: {
                    rawAttitude: function (from, to) {
                        // X和num好像都是玩家自设的东西
                        var x = 0,
                            num = 0,
                            temp,
                            i;
                        if (_status.ai.customAttitude) {
                            for (i = 0; i < _status.ai.customAttitude.length; i++) {
                                temp = _status.ai.customAttitude[i](from, to);
                                if (temp != undefined) {
                                    x += temp;
                                    num++;
                                }
                            }
                        }
                        if (num) {
                            return x / num;
                        }
                        // difficulty是玩家设置的“AI对玩家态度”（只有对玩家的时候会不是0）
                        // 如果来源=目标，或者目标的身份明置，或者（洞察）敌人身份对玩家可见
                        // 弹real attitude
                        var difficulty = 0;
                        if (to == game.me) difficulty = 2 - get.difficulty();
                        if (from == to || to.identityShown || from.storage.dongcha == to) {
                            return get.realAttitude(from, to) + difficulty * 1.5;
                        }
                        // 否则，如果来源和目标不同人，并且目标身份暗置
                        else {
                            // 如果来源是忠，且AI探测身份为0，且AI不会暂时无视目标
                            /* 忠臣偷看身份还是去掉吧
                                if(from.identity=='zhong'&&to.ai.shown==0&&from.ai.tempIgnore&&
                                    !from.ai.tempIgnore.contains(to)){
                                    // 偷看一眼是反
                                    for(var i=0;i<game.players.length;i++){
                                        if(game.players[i].ai.shown==0&&game.players[i].identity=='fan'){
                                            return -0.1+difficulty*1.5;
                                        }
                                    }
                                }*/
                            // AI探测身份为0
                            var aishown = to.ai.shown;
                            // 如果玩家是内，且AI身份标记是反或忠，AI身份暴露为0.5……？
                            if (to.identity == "nei" && to.ai.shown < 1 && (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")) {
                                aishown = 0.5;
                            }
                            // 如果目标身份不是反也不是主（也就是是内或者忠）
                            else if (aishown == 0 && to.identity != "fan" && to.identity != "zhu") {
                                // 检测有没有玩家认识的反
                                var fanshown = true;
                                for (var i = 0; i < game.players.length; i++) {
                                    if (game.players[i].identity == "fan" && game.players[i].ai.shown == 0 && game.players[i] != from) {
                                        fanshown = false;
                                        break;
                                    }
                                }
                                if (fanshown) aishown = 0.3;
                            }
                            // 弹realattitude*暴露程度出去
                            return get.realAttitude(from, to) * aishown + difficulty * 1.5;
                        }
                    },
                    // realattitude出现了
                    realAttitude: function (from, to) {
                        // 如果没有主的话，来源或者目标是内的话，弹-1 来源身份=目标的话，为6，否则为-6
                        // 明忠模式模式？明忠模式也应该有主的吧？不管了反正
                        if (!game.zhu) {
                            if (from.identity == "nei" || to.identity == "nei") return -1;
                            if (from.identity == to.identity) return 6;
                            return -6;
                        }
                        // situation好像是下面检查场上角色数量的
                        var situation = get.situation();
                        var identity = from.identity;
                        var identity2 = to.identity;
                        if (from != to && !to.identityShown) return 0;
                        if (identity2 == "zhu" && !to.isZhu) {
                            identity2 = "zhong";
                            if (from == to) return 10;
                        }
                        if (from != to && to.identity == "nei" && to.ai.shown < 1 && (to.ai.identity_mark == "fan" || to.ai.identity_mark == "zhong")) {
                            identity2 = to.ai.identity_mark;
                        }
                        if (from.identity != "nei" && from != to && get.population("fan") == 0 && identity2 == "zhong") {
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].identity == "nei" && game.players[i].ai.identity_mark == "zhong" && game.players[i].ai.shown < 1) {
                                    identity2 = "nei";
                                    break;
                                }
                            }
                        }
                        var zhongmode = false;
                        if (!game.zhu.isZhu) {
                            zhongmode = true;
                        }
                        switch (identity) {
                            case "zhu":
                                switch (identity2) {
                                    case "zhu":
                                        return 10;
                                    case "zhong":
                                    case "mingzhong":
                                        return 6;
                                    case "nei":
                                        return 0;
                                    case "fan":
                                        return -4;
                                }
                                break;
                            case "zhong":
                            case "mingzhong":
                                switch (identity2) {
                                    case "zhu":
                                        return 10;
                                    case "zhong":
                                    case "mingzhong":
                                        return 4;
                                    case "nei":
                                        return 0;
                                    case "fan":
                                        return -8;
                                }
                                break;
                            case "nei":
                                if (identity2 == "zhu" && game.players.length == 2) return -10;
                                var strategy = get.aiStrategy();
                                if (strategy == 4) {
                                    if (from == to) return 10;
                                    return 0;
                                }
                                var num;
                                switch (identity2) {
                                    case "zhu":
                                        if (strategy == 6) return -1;
                                        if (strategy == 5) return 10;
                                        if (to.hp <= 0) return 10;
                                        if (get.population("fan") == 1) {
                                            var fan;
                                            for (var i = 0; i < game.players.length; i++) {
                                                if (game.players[i].identity == "fan") {
                                                    fan = game.players[i];
                                                    break;
                                                }
                                            }
                                            if (fan) {
                                                if (to.hp > 1 && to.hp > fan.hp && to.countCards("he") > fan.countCards("he")) {
                                                    return -3;
                                                }
                                            }
                                            return 0;
                                        } else {
                                            if (situation > 1 || get.population("fan") == 0) num = 0;
                                            else num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
                                        }
                                        if (strategy == 2) num--;
                                        if (strategy == 3) num++;
                                        return num;
                                    case "zhong":
                                        if (strategy == 5) return Math.min(0, -situation);
                                        if (strategy == 6) return Math.max(-1, -situation);
                                        if (get.population("fan") == 0) num = -5;
                                        else if (situation <= 0) num = 0;
                                        else if (game.zhu && game.zhu.hp < 2) num = 0;
                                        else if (game.zhu && game.zhu.hp == 2) num = -1;
                                        else if (game.zhu && game.zhu.hp <= 2 && situation > 1) num = -1;
                                        else num = -2;
                                        if (zhongmode && situation < 2) {
                                            num = 4;
                                        }
                                        if (strategy == 2) num--;
                                        if (strategy == 3) num++;
                                        return num;
                                    case "mingzhong":
                                        if (zhongmode) {
                                            if (from.ai.sizhong == undefined) {
                                                from.ai.sizhong = Math.random() < 0.5;
                                            }
                                            if (from.ai.sizhong) return 6;
                                        }
                                        if (strategy == 5) return Math.min(0, -situation);
                                        if (strategy == 6) return Math.max(-1, -situation);
                                        if (get.population("fan") == 0) num = -5;
                                        else if (situation <= 0) num = 0;
                                        else num = -3;
                                        if (strategy == 2) num--;
                                        if (strategy == 3) num++;
                                        return num;
                                    case "nei":
                                        if (from == to) return 10;
                                        if (from.ai.friend.contains(to)) return 5;
                                        if (get.population("fan") + get.population("zhong") > 0) return 0;
                                        return -5;
                                    case "fan":
                                        if (strategy == 5) return Math.max(-1, situation);
                                        if (strategy == 6) return Math.min(0, situation);
                                        if ((game.zhu && game.zhu.hp <= 2 && situation < 0) || situation < -1) num = -3;
                                        else if (situation < 0 || get.population("zhong") + get.population("mingzhong") == 0) num = -2;
                                        else if ((game.zhu && game.zhu.hp >= 4 && situation > 0) || situation > 1) num = 1;
                                        else num = 0;
                                        if (strategy == 2) num++;
                                        if (strategy == 3) num--;
                                        return num;
                                }
                                break;
                            case "fan":
                                switch (identity2) {
                                    case "zhu":
                                        if (get.population("nei") > 0) {
                                            if (situation == 1) return -6;
                                            if (situation > 1) return -5;
                                        }
                                        return -8;
                                    case "zhong":
                                        if (!zhongmode && game.zhu.hp >= 3 && to.hp == 1) {
                                            return -10;
                                        }
                                        return -7;
                                    case "mingzhong":
                                        return -5;
                                    case "nei":
                                        return 0;
                                    case "fan":
                                        return 5;
                                }
                        }
                    },
                    // 检测当前场上情况（好像不会计算内奸）
                    situation: function (absolute) {
                        var i, j, player;
                        // 数值：主忠，共计，主，反
                        var zhuzhong = 0,
                            total = 0,
                            zhu,
                            fan = 0;
                        // 每一名角色检测：
                        for (i = 0; i < game.players.length; i++) {
                            player = game.players[i];
                            // 检测角色的体力
                            var php = player.hp;
                            // 大于6就当作6了
                            if (php > 6) {
                                php = 6;
                            }
                            // j = 角色手牌数+角色装备数*1.5+体力值*2
                            j = player.countCards("h") + player.countCards("j") * 1.2 + player.countCards("e") * 1.5 + php * 2;
                            // 如果玩家是主公，主忠+j*1.2+5，主=j，共计+1.2j+5
                            if (player.identity == "zhu") {
                                zhuzhong += j + 5;
                                total += j + 5;
                                zhu = j;
                            }
                            // 如果玩家是忠，主忠+0.8j+3
                            else if (player.identity == "zhong" || player.identity == "mingzhong") {
                                zhuzhong += j + 3;
                                total += j + 3;
                            }
                            // 如果玩家是反贼，主忠方-j-4
                            else if (player.identity == "fan") {
                                zhuzhong -= j + 4;
                                total += j + 4;
                                fan += j + 4;
                            }
                        }
                        // 如果是绝对的，直接返回主忠计数
                        if (absolute) return zhuzhong;
                        // result是主忠计数/所有角色计数的十分比
                        var result = parseInt(10 * Math.abs(zhuzhong / total));
                        // 如果主忠计数为负值，负数值翻过来
                        if (zhuzhong < 0) result = -result;
                        // 如果不是明忠模式：
                        if (!game.zhong) {
                            // 如果主公没有反贼强，或者主公要死了，result下降
                            if (fan >= 2 * zhu) result--;
                            if (zhu < 4) result--;
                        }
                        return result;
                    },
                },
                skill: {
                    // 阿求的三个技能：输出，辅助，控场
                    library_qiuwen: {
                        direct: true,
                        trigger: {
                            global: "gameStart",
                            player: "enterGame",
                        },
                        init: function (player) {
                            game.pause();
                            if (_status.library) {
                                var name = lib.config.connect_nickname;
                                if (name == "黑白葱") name = "主人";
                                player.say(name + "你好！谢谢邀请我一起玩！");
                                setTimeout(function () {
                                    game.resume();
                                }, 2500);
                            } else {
                                player.say("欢迎回来！作为感谢你一直在幻想乡游玩的奖励——");
                                setTimeout(function () {
                                    player.say("我为你特别准备了一份特殊的牌局！");
                                    setTimeout(function () {
                                        player.say("谢谢你对东方流星夜的支持，以后也请多关照了！");
                                        game.resume();
                                    }, 2500);
                                }, 2500);
                            }
                        },
                        content: function () {
                            game.saveConfig("akyuu", true);
                            lib.config.gameRecord.incident.data["akyuu"] = 0;
                            //差一个game.saveConfig
                            var recent = get.config("recentCharacter");
                            var fav = lib.config.favouriteCharacter;
                            var num1 = 0;
                            var num2 = 0;
                            var num3 = 0;
                            // 输出角色
                            var list1 = ["gezi_rumia", "gezi_flandre", "gezi_letty", "gezi_youmu", "gezi_yuyuko", "gezi_suika", "gezi_marisa", "gezi_mokou", "gezi_medicine", "gezi_yuuka", "gezi_komachi", "gezi_sinon", "gezi_megumin", "gezi_yudachi", "gezi_mordred"];
                            // 辅助
                            var list2 = ["gezi_koakuma", "gezi_chen", "gezi_alice", "gezi_lilywhite", "gezi_lunasa", "gezi_merlin", "gezi_lyrica", "gezi_ran", "gezi_yukari", "gezi_wriggle", "gezi_keine", "gezi_tewi", "gezi_eirin", "gezi_lilyblack", "gezi_hetate", "gezi_daiyousei", "gezi_renko", "gezi_meribel", "gezi_kanade", "gezi_shigure", "gezi_nero", "gezi_miku"];
                            // 控场
                            var list3 = ["gezi_patchouli", "gezi_sakuya", "gezi_remilia", "gezi_yukari", "gezi_mystia", "gezi_reimu", "gezi_marisa", "gezi_reisen", "gezi_kaguya", "gezi_eiki", "gezi_aya", "gezi_cirno", "gezi_arisa", "gezi_kurumi", "gezi_scathach", "gezi_satone"];
                            for (var i = 0; i < recent.length; i++) {
                                if (list1.contains(recent[i])) num1++;
                                if (list2.contains(recent[i])) num2++;
                                if (list3.contains(recent[i])) num3++;
                            }
                            for (var i = 0; i < fav.length; i++) {
                                if (list1.contains(fav[i])) num1 += 3;
                                if (list2.contains(fav[i])) num2 += 3;
                                if (list3.contains(fav[i])) num3 += 3;
                            }
                            game.pause();
                            var time = 0;
                            var max = Math.max(num1, num2, num3);
                            if (num1 == max) {
                                player.say("喜欢输出角色啊。把别人暴揍一顿可比玩什么牌不牌的直接多了呢。");
                                setTimeout(function () {
                                    player.say("那我就让你更肆无忌惮的输出吧。");
                                    player.addSkill("shuchu");
                                    game.log("本局游戏，所有角色在回合结束时摸X张牌（X为本回合造成的伤害）。");
                                }, 2500);
                                time += 5000;
                            }
                            if (num2 == max) {
                                setTimeout(function () {
                                    player.say("喜欢辅助么……确实，大家都喜欢帮助别人和多摸摸牌呢。");
                                    setTimeout(function () {
                                        player.say("那我来让你可以更多的辅助和刷牌吧。");
                                        player.addSkill("fuzhu");
                                        game.log("本局游戏，所有角色体力上限+1，灵力上限+2，手牌上限+3。");
                                    }, 2500);
                                }, time);
                                time += 5000;
                            }
                            if (num3 == max) {
                                setTimeout(function () {
                                    player.say("喜欢控场么……<br>但是让你们控场翻倍并不好呢……");
                                    setTimeout(function () {
                                        player.say("那我就换个方式给你加成吧。");
                                        player.addSkill("kongchang");
                                        game.log("本局游戏，手牌最多的角色造成的伤害+1。");
                                    }, 2500);
                                }, time);
                                time += 5000;
                            }
                            setTimeout(function () {
                                game.resume();
                            }, time + 1000);
                        },
                    },
                    shuchu: {
                        fixed: true,
                        direct: true,
                        trigger: {
                            global: "phaseBegin",
                        },
                        content: function () {
                            trigger.player.addTempSkill("shuchu_2");
                        },
                    },
                    shuchu_2: {
                        trigger: {
                            global: "phaseEnd",
                        },
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return player.getStat("damage");
                        },
                        content: function () {
                            var num = player.getStat("damage");
                            player.draw(num);
                        },
                    },
                    fuzhu: {
                        fixed: true,
                        global: "fuzhu_max",
                        init: function (player) {
                            var players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                players[i].gainMaxHp();
                                players[i].gainMaxlili(2);
                            }
                        },
                    },
                    fuzhu_max: {
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + 3;
                            },
                        },
                    },
                    kongchang: {
                        fixed: true,
                        global: "guding_skill",
                    },
                    guding_skill: {
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event, player) {
                            return player.isMaxHandcard(false);
                        },
                        forced: true,
                        content: function () {
                            trigger.num++;
                        },
                        ai: {
                            effect: {
                                target: function (card, player, target, current) {
                                    if (player.isMaxHandcard(false)) return [1, -2];
                                },
                            },
                        },
                    },
                    boom: {
                        trigger: {
                            player: "dieBegin",
                        },
                        fixed: true,
                        direct: true,
                        filter: function (event) {
                            return true;
                        },
                        content: function () {
                            "step 0";
                            lib.character["cong"] = ["female", "shen", Infinity, ["finalspark", "mianyi"], [], [], "100000"];
                            lib.character["cong"][4].push("ext:东方project/cong.jpg");
                            lib.translate["cong"] = "黑白葱";
                            player.init("cong");
                            player.update();
                            game.pause();
                            player.say("居然击杀了管理员，你也是挺有勇气的呢。");
                            setTimeout(function () {
                                if (game.me.name != "gezi_marisa") {
                                    player.say("我，有必要给你一些惩罚呢。 下次不要这么做了哟。");
                                    setTimeout(function () {
                                        game.resume();
                                    }, 2500);
                                } else {
                                    player.say("看在你品味不错的份上，这次就算了吧。");
                                    setTimeout(function () {
                                        player.init("akyuu");
                                        game.resume();
                                    }, 2500);
                                }
                            }, 2500);
                            ("step 1");
                            if (game.me.name != "gezi_marisa") {
                                game.me.damage(Infinity);
                            }
                            ("step 2");
                            if (game.me.isAlive()) {
                                game.pause();
                                player.say("挺厉害的嘛，那这次就先放过你了吧。");
                                setTimeout(function () {
                                    player.init("akyuu");
                                    game.resume();
                                }, 2500);
                            } else {
                                game.over();
                            }
                            ("step 3");
                            trigger.cancel();
                        },
                        ai: {
                            threaten: -10,
                        },
                    },
                    finalspark: {
                        enable: "phaseUse",
                        selectTarget: 1,
                        filterTarget: function () {
                            return true;
                        },
                        content: function () {
                            targets[0].damage(Infinity);
                        },
                        ai: {
                            effect: {
                                player: function (card, player, target) {
                                    if (target == game.me) return 10000000;
                                },
                            },
                        },
                    },
                    // 出牌阶段的摊牌技能。
                    _tanpai: {
                        name: "摊牌",
                        line: true,
                        enable: "phaseUse",
                        intro: {
                            content: "cards",
                        },
                        usable: 1,
                        init: function (player) {
                            player.storage._tanpai = [];
                        },
                        filter: function (event, player) {
                            return player.identityShown != true;
                        },
                        content: function () {
                            // 使用异变牌
                            // 现在已经是所有异变牌都是任选了（耸肩），不是2张+主场了
                            "step 0";
                            var libincident = [];
                            for (var i in lib.card) {
                                if (lib.card[i].type == "zhenfa" && lib.card[i].subtype == "yibianpai") {
                                    libincident.add(i);
                                }
                            }
                            //libincident.push('gezi_library');
                            console.log(game.online);
                            game.broadcastAll(
                                function (player, identity) {
                                    player.identityShown = true;
                                    player.setIdentity(identity);
                                    player.node.identity.classList.remove("guessing");
                                },
                                player,
                                player.identity,
                            );
                            game.log(player, "的身份是", "#g" + get.translation(player.identity + "2"));
                            player.disableSkill("_tanpai");
                            player.removeSkill("_tanpai");
                            /*
                                } else {
                                    game.log(get.translation(player.name) + '明置了身份，是'+ lib.translate[player.identity+'2']);
                                    player.identityShown = true;
                                    player.setIdentity(player.identity);
                                    player.node.identity.classList.remove('guessing');
                                }
                                */
                            // 黑幕和路人拿异变牌
                            if (player.identity == "zhu" || player.identity == "nei") {
                                var num;
                                if (player.identity == "zhu") num = Math.floor(Math.random() * (libincident.length - 1));
                                else num = Math.floor(Math.random() * libincident.length);
                                player
                                    .chooseButton(["选择你本局要发动的异变", [libincident, "vcard"]], true)
                                    .set("filterButton", function (button) {
                                        return true;
                                    })
                                    .set("ai", function (button) {
                                        return button.link[2] == libincident[_status.event.num];
                                    })
                                    .set("num", num);
                                // 异变：令一名角色抽牌
                            } else if (player.identity == "zhong") {
                                player
                                    .chooseTarget("异变明置效果：令一名角色摸一张牌", function (card, player, target) {
                                        return true;
                                    })
                                    .set("ai", function (target) {
                                        if (target.identity == "zhu") return true;
                                        return get.attitude(_status.event.player, target) > 0;
                                    });
                                // 自机：伪采访一个
                            } else if (player.identity == "fan") {
                                player
                                    .chooseTarget("自机明置效果：令一名角色选择：弃一张牌或明置身份", function (card, player, target) {
                                        return player != target && (target.countCards("h") || target.identityShown != true);
                                    })
                                    .set("ai", function (target) {
                                        var player = _status.event.player;
                                        if (target.identityShown != true) return target;
                                        if (target.identity == "fan") return 0;
                                        return get.attitude(_status.event.player, target) < 0;
                                    });
                            }
                            ("step 1");
                            if (result.bool) {
                                if (result.targets != "") {
                                    if (player.identity == "fan") {
                                        player.line(result.targets[0], "green");
                                        var list = ["discard"];
                                        event.target = result.targets[0];
                                        if (result.targets[0].identityShown != true) list.push("_tanpai");
                                        result.targets[0].chooseControl(list, function (event, player) {
                                            if (list.contains("_tanpai")) return "_tanpai";
                                            return "discard";
                                        });
                                    } else if (player.identity == "zhong") {
                                        player.line(result.targets[0], "green");
                                        result.targets[0].draw();
                                    }
                                } else {
                                    var card = game.createCard(result.links[0][2], "yibianpai", "");
                                    if (player.identity == "zhu") {
                                        player.addIncident(card);
                                    } else if (player.identity == "nei") {
                                        if (!player.storage._tanyibian) player.storage._tanyibian = [];
                                        player.storage._tanyibian.add(card);
                                        player.markSkill("_tanyibian");
                                        player.syncStorage("_tanyibian");
                                    }
                                }
                            }
                            ("step 2");
                            if (result.control) {
                                if (result.control == "discard") {
                                    player.discardPlayerCard("he", event.target, true);
                                } else {
                                    event.target.useSkill("_tanpai");
                                }
                            }
                        },
                        ai: {
                            order: function (name, player) {
                                var cards = player.getCards("h");
                                if (player.countCards("h", "sha") == 0) {
                                    return 1;
                                }
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i].name != "sha" && cards[i].number > 11 && get.value(cards[i]) < 7) {
                                        return 9;
                                    }
                                }
                                return (
                                    get.order({
                                        name: "sha",
                                    }) - 1
                                );
                            },
                            result: {
                                player: function (player) {
                                    if (player.identity == "fan") return 0.5;
                                    if (player.identity == "zhu") {
                                        var num = game.countPlayer(function (current) {
                                            if (player != current && current.identityShown == true) return 1;
                                        });
                                        if (num > 2) return 0.5;
                                        return 0;
                                    }
                                    if (player.identity == "zhong") {
                                        if (game.zhu.identityShown == true) return 1;
                                        else return 0;
                                    }
                                    if (player.identity == "nei") {
                                        if (game.roundNumber > 1) return 1;
                                        else return 0;
                                    }
                                },
                            },
                        },
                    },
                    _tanyibian: {
                        name: "摊异变",
                        enable: "phaseUse",
                        mark: true,
                        intro: {
                            mark: function (dialog, content, player) {
                                if (content && content.length) {
                                    if (player == game.me || player.isUnderControl()) {
                                        dialog.addAuto(content);
                                    } else {
                                        return "是什么呢，这" + get.cnNumber(content.length) + "异变？";
                                    }
                                }
                            },
                            content: function (content, player) {
                                if (content && content.length) {
                                    if (player == game.me || player.isUnderControl()) {
                                        return get.translation(content);
                                    }
                                    return "是什么呢，这" + get.cnNumber(content.length) + "异变？";
                                }
                            },
                        },
                        init: function (player) {
                            player.storage._tanyibian = [];
                        },
                        filter: function (event, player) {
                            return player.storage._tanyibian;
                        },
                        content: function () {
                            var card = player.storage._tanyibian[0];
                            player.addIncident(card);
                            delete player.storage._tanyibian;
                            player.unmarkSkill("_tanyibian");
                        },
                        ai: {
                            order: 10,
                            result: {
                                player: function (player, target) {
                                    if (game.roundNumber > 1) return 3;
                                    return -1;
                                },
                            },
                        },
                    },
                },
                help: {},
            },
            {
                translate: "异变",
                connect: {
                    //联机相关，但这个模式其实不能联机的。。。
                    update: function (config, map) {
                        if (config.connect_identity_mode == "zhong") {
                            map.connect_player_number.hide();
                            map.connect_double_nei.hide();
                            map.connect_special_identity.hide();
                        } else {
                            map.connect_player_number.show();
                            if (config.connect_player_number != "2") {
                                map.connect_double_nei.show();
                            } else {
                                map.connect_double_nei.hide();
                            }
                        }
                    },
                    connect_identity_mode: {
                        name: "游戏模式",
                        init: "normal",
                        item: {
                            yibian: "异变",
                            normal: "经典",
                        },
                        restart: true,
                        frequent: true,
                        intro: "异变模式详见帮助",
                    },
                    connect_player_number: {
                        name: "游戏人数",
                        init: "7",
                        item: {
                            2: "两人",
                            3: "三人",
                            4: "四人",
                            5: "五人",
                            6: "六人",
                            7: "七人",
                            8: "八人",
                        },
                        frequent: true,
                        restart: true,
                    },
                    connect_double_nei: {
                        name: "双路人",
                        init: false,
                        restart: true,
                        intro: "开启后游戏中将有两个路人",
                    },
                    connect_double_character: {
                        name: "双将模式",
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    connect_free_choose: {
                        name: "自由选将",
                        init: false,
                    },
                },
                config: {
                    update: function (config, map) {
                        if (config.identity_mode == "zhong") {
                            map.player_number.hide();
                            map.double_nei.hide();
                            map.auto_identity.hide();
                            map.choice_zhu.hide();
                            map.choice_zhong.hide();
                            map.choice_nei.hide();
                            map.choice_fan.hide();
                            map.ban_identity.hide();
                            map.ban_identity2.hide();
                            map.ban_identity3.hide();
                            map.zhong_card.show();
                            map.special_identity.hide();
                        } else {
                            map.player_number.show();
                            map.auto_identity.show();
                            if (config.player_number != "2") {
                                map.double_nei.show();
                            } else {
                                map.double_nei.hide();
                            }
                            map.choice_zhu.show();
                            map.choice_zhong.show();
                            map.choice_nei.show();
                            map.choice_fan.show();
                            map.ban_identity.show();
                            if (config.ban_identity == "off") {
                                map.ban_identity2.hide();
                            } else {
                                map.ban_identity2.show();
                            }
                            if (config.ban_identity == "off" || config.ban_identity2 == "off") {
                                map.ban_identity3.hide();
                            } else {
                                map.ban_identity3.show();
                            }
                        }
                    },
                    identity_mode: {
                        name: "游戏模式",
                        init: "normal",
                        item: {
                            normal: "经典",
                        },
                        restart: true,
                        frequent: true,
                        intro: "很可惜，只有我哟~",
                    },
                    akyuu_bool: {
                        name: "启用阿求",
                        init: "true",
                        restart: true,
                        frequent: true,
                        intro: "关闭后关闭阿求的路人局。",
                    },
                    player_number: {
                        name: "游戏人数",
                        init: "7",
                        item: {
                            2: "两人",
                            3: "三人",
                            4: "四人",
                            5: "五人",
                            6: "六人",
                            7: "七人",
                            8: "八人",
                        },
                        frequent: true,
                        restart: true,
                    },
                    double_nei: {
                        name: "双路人",
                        init: false,
                        restart: true,
                        frequent: true,
                        intro: "开启后，8人游戏中将有两个路人",
                    },
                    double_character: {
                        name: "双将模式",
                        init: false,
                        frequent: true,
                        restart: true,
                    },
                    auto_identity: {
                        name: "自动显示身份",
                        item: {
                            off: "关闭",
                            one: "一轮",
                            two: "两轮",
                            three: "三轮",
                            always: "始终",
                        },
                        init: "off",
                        onclick: function (bool) {
                            game.saveConfig("auto_identity", bool, this._link.config.mode);
                            if (get.config("identity_mode") == "zhong") return;
                            var num;
                            switch (bool) {
                                case "一轮":
                                    num = 1;
                                    break;
                                case "两轮":
                                    num = 2;
                                    break;
                                case "三轮":
                                    num = 3;
                                    break;
                                default:
                                    num = 0;
                                    break;
                            }
                            if (num & !_status.identityShown && game.phaseNumber > game.players.length * num && game.showIdentity) {
                                _status.identityShown = true;
                                game.showIdentity(false);
                            }
                        },
                        intro: "游戏进行若干轮将自动显示所有角色的身份",
                    },
                    auto_mark_identity: {
                        name: "自动标记身份",
                        init: false,
                        intro: "根据角色的出牌行为自动标记可能的身份",
                    },
                    free_choose: {
                        name: "自由选将",
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig("free_choose", bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig) return;
                            if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
                            else if (ui.cheat2 && !get.config("free_choose")) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        },
                    },
                    change_identity: {
                        name: "自由选择身份和座位",
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig("change_identity", bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig) return;
                            var dialog;
                            if (ui.cheat2 && ui.cheat2.backup) dialog = ui.cheat2.backup;
                            else dialog = _status.event.dialog;
                            if (!_status.library || !_status.library.noAddSetting) {
                                if (!dialog.querySelector("table") && get.config("change_identity")) _status.event.getParent().addSetting(dialog);
                                else _status.event.getParent().removeSetting(dialog);
                            }
                            ui.update();
                        },
                    },
                    change_choice: {
                        name: "开启换将卡",
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig("change_choice", bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig) return;
                            if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
                            else if (ui.cheat && !get.config("change_choice")) {
                                ui.cheat.close();
                                delete ui.cheat;
                            }
                        },
                    },
                    continue_game: {
                        name: "显示再战",
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig("continue_game", bool, this._link.config.mode);
                            if (get.config("continue_game")) {
                                if (!ui.continue_game && _status.over && !_status.library) {
                                    ui.continue_game = ui.create.control("再战", game.reloadCurrent);
                                }
                            } else if (ui.continue_game) {
                                ui.continue_game.close();
                                delete ui.continue_game;
                            }
                        },
                        intro: "游戏结束后可选择用相同的角色再进行一局游戏",
                    },
                    dierestart: {
                        name: "死亡后显示重来",
                        init: true,
                        onclick: function (bool) {
                            game.saveConfig("dierestart", bool, this._link.config.mode);
                            if (get.config("dierestart")) {
                                if (!ui.restart && game.me.isDead() && !_status.connectMode) {
                                    ui.restart = ui.create.control("restart", game.reload);
                                }
                            } else if (ui.restart) {
                                ui.restart.close();
                                delete ui.restart;
                            }
                        },
                    },
                    revive: {
                        name: "死亡后显示复活",
                        init: false,
                        onclick: function (bool) {
                            game.saveConfig("revive", bool, this._link.config.mode);
                            if (get.config("revive")) {
                                if (!ui.revive && game.me.isDead()) {
                                    ui.revive = ui.create.control("revive", ui.click.dierevive);
                                }
                            } else if (ui.revive) {
                                ui.revive.close();
                                delete ui.revive;
                            }
                        },
                    },
                    ban_identity: {
                        name: "屏蔽身份",
                        init: "off",
                        item: {
                            off: "关闭",
                            zhu: "黑幕",
                            zhong: "异变",
                            nei: "路人",
                            fan: "自机",
                        },
                    },
                    ban_identity2: {
                        name: "屏蔽身份2",
                        init: "off",
                        item: {
                            off: "关闭",
                            zhu: "黑幕",
                            zhong: "异变",
                            nei: "路人",
                            fan: "自机",
                        },
                    },
                    ban_identity3: {
                        name: "屏蔽身份3",
                        init: "off",
                        item: {
                            off: "关闭",
                            zhu: "黑幕",
                            zhong: "异变",
                            nei: "路人",
                            fan: "自机",
                        },
                    },
                    ai_strategy: {
                        name: "内奸策略",
                        init: "ai_strategy_4",
                        item: {
                            ai_strategy_1: "均衡",
                            ai_strategy_2: "偏反",
                            ai_strategy_3: "偏忠",
                            ai_strategy_4: "酱油",
                            ai_strategy_5: "天使",
                            ai_strategy_6: "仇主",
                        },
                        intro: "设置内奸对主忠反的态度",
                    },
                    difficulty: {
                        name: "AI对人类态度",
                        init: "normal",
                        item: {
                            easy: "友好",
                            normal: "一般",
                            hard: "仇视",
                        },
                    },
                    choice_zhu: {
                        name: "黑幕候选角色数",
                        init: "5",
                        restart: true,
                        item: {
                            3: "三",
                            4: "四",
                            5: "五",
                            6: "六",
                            8: "八",
                            10: "十",
                        },
                    },
                    choice_zhong: {
                        name: "异变候选角色数",
                        init: "5",
                        restart: true,
                        item: {
                            3: "三",
                            4: "四",
                            5: "五",
                            6: "六",
                            8: "八",
                            10: "十",
                        },
                    },
                    choice_nei: {
                        name: "路人候选角色数",
                        init: "5",
                        restart: true,
                        item: {
                            3: "三",
                            4: "四",
                            5: "五",
                            6: "六",
                            8: "八",
                            10: "十",
                        },
                    },
                    choice_fan: {
                        name: "自机候选角色数",
                        init: "5",
                        restart: true,
                        item: {
                            3: "三",
                            4: "四",
                            5: "五",
                            6: "六",
                            8: "八",
                            10: "十",
                        },
                    },
                },
                onremove: function () {
                    game.clearModeConfig("old_identity");
                },
            },
        );
        image: ["extension/东方project/old_identity.jpg"];

        game.addMode(
            "stg",
            {
                name: "stg",
                start: function () {
                    "step 0";
                    ui.backgroundMusic.pause();
                    var playback = localStorage.getItem(lib.configprefix + "playback");
                    if (playback) {
                        ui.create.me();
                        ui.arena.style.display = "none";
                        ui.system.style.display = "none";
                        _status.playback = playback;
                        localStorage.removeItem(lib.configprefix + "playback");
                        var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
                        store.get(parseInt(playback)).onsuccess = function (e) {
                            if (e.target.result) {
                                game.playVideoContent(e.target.result.video);
                            } else {
                                alert("播放失败：找不到录像");
                                game.reload();
                            }
                        };
                        event.finish();
                        return;
                    }
                    // 这里是加载卡牌的地方（加载角色在content里）
                    for (var i in lib.cardPack.mode_extension_stg) {
                        lib.card[i] = lib.cardPack.mode_extension_stg[i];
                    }
                    for (var i in lib.skill) {
                        if (lib.skill[i].changeSeat) {
                            lib.skill[i] = {};
                            if (lib.translate[i + "_info"]) {
                                lib.translate[i + "_info"] = "此模式下不可用";
                            }
                        }
                    }
                    lib.translate.restart = "返回";
                    lib.init.css(lib.assetURL + "layout/mode", "boss");
                    game.delay(0.1);
                    ("step 1");
                    var bosslist = ui.create.div("#bosslist.hidden");
                    event.bosslist = bosslist;
                    lib.setScroll(bosslist);
                    if (!lib.config.touchscreen && lib.config.mousewheel) {
                        bosslist._scrollspeed = 30;
                        bosslist._scrollnum = 10;
                        bosslist.onmousewheel = ui.click.mousewheel;
                    }
                    var onpause = function () {
                        ui.window.classList.add("bosspaused");
                    };
                    var onresume = function () {
                        ui.window.classList.remove("bosspaused");
                    };
                    game.onpause = onpause;
                    game.onpause2 = onpause;
                    game.onresume = onresume;
                    game.onresume2 = onresume;
                    ui.create.div(bosslist);

                    event.current = null;
                    // boss选择
                    var list = [];
                    for (var i in lib.character) {
                        var info = lib.character[i];
                        if (info[4].contains("boss") && info[4].contains("chuangguan")) {
                            var player = ui.create.player(bosslist).init(i);
                            if (player.hp == 0) {
                                player.node.hp.style.display = "none";
                            }
                            list.push(player);
                            player.node.hp.classList.add("text");
                            player.node.hp.dataset.condition = "";
                            player.node.hp.innerHTML = info[2];
                            if (info[2] == Infinity) {
                                player.node.hp.innerHTML = "∞";
                            }
                            player.setIdentity(player.name);
                            player.classList.add("bossplayer");

                            if (lib.storage.current == i) {
                                event.current = player;
                                player.classList.add("highlight");
                                _status.bosschoice = i;
                                if (!lib.config.continue_name_boss && lib.boss[i] && lib.boss[i].control) {
                                    _status.bosschoice = lib.boss[i].control();
                                    _status.bosschoice.name = i;
                                    _status.bosschoice.link = lib.boss[i].controlid || i;
                                }
                            }
                        }
                    }
                    if (!list.length) {
                        alert("没有可挑战的场景");
                        event.finish();
                        lib.init.onfree();
                        _status.over = true;
                        return;
                    }
                    if (!event.current) {
                        event.current = bosslist.childNodes[1];
                        event.current.classList.add("highlight");
                    }
                    ui.create.div(bosslist);
                    ui.create.cardsAsync();
                    game.finishCards();
                    ui.arena.setNumber(8);
                    ui.control.style.transitionProperty = "opacity";
                    ui.control.classList.add("bosslist");
                    setTimeout(function () {
                        ui.control.style.transitionProperty = "";
                    }, 1000);

                    ui.window.appendChild(bosslist);

                    setTimeout(function () {
                        if (event.current) {
                            var left = event.current.offsetLeft - (ui.window.offsetWidth - 180) / 2;
                            if (bosslist.scrollLeft < left) {
                                bosslist.scrollLeft = left;
                            }
                        }
                        bosslist.show();
                    }, 200);
                    game.me = ui.create.player();
                    // 选将
                    if (lib.config.continue_name_boss) {
                        event.noslide = true;
                        lib.init.onfree();
                    } else {
                        game.chooseCharacter(function (target) {
                            if (event.current) {
                                event.current.classList.remove("highlight");
                            }
                            event.current = target;
                            game.save("current", target.name);
                            target.classList.add("highlight");
                            if (_status.bosschoice) {
                                var name = target.name;
                                if (lib.boss[target.name] && lib.boss[target.name].controlid) {
                                    name = lib.boss[target.name].controlid;
                                }
                            }
                            if (lib.boss[target.name] && lib.boss[target.name].control) {
                                _status.createControl = ui.control.firstChild;
                                _status.bosschoice = lib.boss[target.name].control();
                                _status.bosschoice.name = target.name;
                                _status.bosschoice.link = lib.boss[target.name].controlid || target.name;
                                if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                                    _status.bosschoice.classList.add("disabled");
                                }
                                delete _status.createControl;
                            }
                        });
                    }
                    if (lib.config.test_game) {
                        event.current.classList.remove("highlight");
                        if (event.current.nextSibling && event.current.nextSibling.classList.contains("player")) {
                            event.current = event.current.nextSibling;
                        } else {
                            event.current = event.current.parentNode.childNodes[1];
                        }
                        game.save("current", event.current.name);
                    }
                    ("step 2");
                    game.bossinfo = lib.boss.global;
                    for (var i in lib.boss[event.current.name]) {
                        game.bossinfo[i] = lib.boss[event.current.name][i];
                    }

                    setTimeout(function () {
                        ui.control.classList.remove("bosslist");
                    }, 500);
                    var boss = ui.create.player();
                    boss.getId();
                    game.boss = boss;
                    boss.init(event.current.name);
                    boss.side = true;
                    if (!event.noslide) {
                        var rect = event.current.getBoundingClientRect();
                        boss.animate("bossing");
                        boss.node.hp.animate("start");
                        boss.bossinginfo = [rect.left + rect.width / 2, rect.top + rect.height / 2];
                        boss.style.transition = "all 0s";
                        boss.node.equips.style.opacity = "0";
                    } else {
                        boss.animate("start");
                    }
                    boss.setIdentity("zhu");
                    boss.identity = "zhu";
                    if (lib.config.continue_name_boss) {
                        result = lib.config.continue_name_boss;
                        game.saveConfig("continue_name_boss");
                    }
                    // 玩家加入游戏
                    for (var i = 0; i < result.links.length; i++) {
                        var player = ui.create.player();
                        player.getId();
                        player.init(result.links[i]).animate("start");
                        player.setIdentity("cai");
                        player.identity = "cai";
                        player.side = false;
                        game.players.push(player);
                        // 如果玩家选择的是BOSS
                        if (result.boss) {
                            if (game.bossinfo.minion) {
                                player.dataset.position = i + 3;
                            } else {
                                player.dataset.position = (i + 1) * 2;
                            }
                        }
                        // 如果玩家选择的不是BOSS
                        else {
                            player.dataset.position = i;
                        }
                        ui.arena.appendChild(player);
                    }
                    // boss加入游戏:BOSS的UI座位位置（8人场，BOSS对应位置）
                    if (result.boss) {
                        game.players.unshift(boss);
                        boss.dataset.position = 0;
                    } else {
                        game.players.push(boss);
                        boss.dataset.position = 4;
                    }
                    // BOSS随从加入游戏
                    if (game.bossinfo.minion) {
                        // 如果玩家不是BOSS，BOSS放到6号位
                        for (var i in game.bossinfo.minion) {
                            var player = ui.create.player();
                            player.getId();
                            player.init(game.bossinfo.minion[i]);
                            if (boss.bossinginfo) {
                                player.animate("bossing");
                                player.node.hp.animate("start");
                                player.style.transition = "all 0s";
                            } else {
                                player.animate("start");
                            }
                            player.setIdentity("zhong");
                            player.identity = "zhong";
                            player.side = true;
                            game.players.push(player);
                            // parseInt 就是那个2和8
                            var num = parseInt(i);
                            // 如果玩家是boss（0号位），那么分别安排到1和7位
                            if (result.boss) {
                                player.dataset.position = num - 1;
                            }
                            // 如果玩家不是boss，2号位安排到7，8号位安排到5。
                            else {
                                if (num == 2) {
                                    //player.dataset.position=7;
                                    player.dataset.position = 3;
                                } else {
                                    //player.dataset.position=num-3;
                                    player.dataset.position = 5;
                                }
                            }
                            ui.arena.appendChild(player);
                            if (boss.bossinginfo) {
                                var rect = player.getBoundingClientRect();
                                player.style.transform = "translate(" + (boss.bossinginfo[0] - rect.left - rect.width / 2) + "px," + (boss.bossinginfo[1] - rect.top - rect.height / 2) + "px) scale(1.1)";
                                ui.refresh(player);
                                player.style.transition = "";
                                player.style.transform = "";
                            }
                        }
                    }
                    ui.create.me();
                    if (game.me !== boss) {
                        if (lib.config.show_handcardbutton) {
                            lib.setPopped(
                                ui.create.system("BOSS剩余符卡", null, true),
                                function () {
                                    var uiintro = ui.create.dialog("hidden");

                                    var players = game.players.concat(game.dead);
                                    var str = "";
                                    if (!game.me.storage || !game.me.storage.reskill) {
                                        str = "BOSS没有符卡";
                                    } else if (game.me.storage.reskill) {
                                        str = "BOSS剩余" + game.me.storage.reskill.length + "张符卡";
                                    }
                                    uiintro.add('<div class="text center">' + str + "</div>");
                                    uiintro.add(ui.create.div(".placeholder.slim"));

                                    return uiintro;
                                },
                                180,
                            );
                        }
                    } else {
                        ui.fakeme.style.display = "none";
                    }

                    lib.setPopped(
                        ui.create.system("残机", null, true),
                        function () {
                            var uiintro = ui.create.dialog("hidden");
                            uiintro.add("残机");
                            var table = ui.create.div(".bosschongzheng");
                            var tr,
                                td,
                                added = false;
                            added = true;
                            tr = ui.create.div(table);
                            td = ui.create.div(tr);
                            if (game.me.storage.fuhuo) {
                                td.innerHTML = "剩余" + game.me.storage.fuhuo + "次复活机会";
                            } else {
                                td.innerHTML = "不剩残机了";
                            }
                            if (!added) {
                                uiintro.add('<div class="text center">没有残机了/div>');
                                uiintro.add(ui.create.div(".placeholder.slim"));
                            } else {
                                uiintro.add(table);
                            }
                            return uiintro;
                        },
                        180,
                    );
                    if (get.config("single_control") || game.me == game.boss) {
                        ui.single_swap.style.display = "none";
                    }

                    ui.arena.appendChild(boss);
                    if (boss.bossinginfo) {
                        var rect = boss.getBoundingClientRect();
                        boss.style.transform = "translate(" + (boss.bossinginfo[0] - rect.left - rect.width / 2) + "px," + (boss.bossinginfo[1] - rect.top - rect.height / 2) + "px) scale(1.1)";
                        ui.refresh(boss);
                        boss.style.transition = "";
                        boss.style.transform = "";
                        delete boss.bossinginfo;
                        setTimeout(function () {
                            boss.node.equips.style.opacity = "";
                        }, 500);
                    }

                    event.bosslist.delete();

                    game.arrangePlayers();
                    // 跳过行动部分

                    var players = get.players(lib.sort.position);
                    var info = [];
                    for (var i = 0; i < players.length; i++) {
                        info.push({
                            name: players[i].name,
                            identity: players[i].identity,
                            position: players[i].dataset.position,
                        });
                    }
                    (_status.videoInited = true), (info.boss = game.me == game.boss);
                    game.addVideo("init", null, info);
                    if (game.bossinfo.init) {
                        game.bossinfo.init();
                    }
                    delete lib.boss;
                    ("step 3");
                    if (get.config("single_control")) {
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].side == game.me.side) {
                                game.addRecentCharacter(game.players[i].name);
                            }
                        }
                    } else {
                        game.addRecentCharacter(game.me.name);
                    }
                    event.trigger("gameStart");
                    game.gameDraw(game.boss, game.bossinfo.gameDraw || 4);
                    game.bossPhaseLoop();
                    setTimeout(function () {
                        ui.updatehl();
                    }, 200);
                },
                element: {
                    player: {
                        init: function (player) {
                            if (player.name == "stg_scarlet") return;
                            if (player.name == "stg_scarlet_ex") return;
                            if (!player.node.lili) {
                                player.node.lili = ui.create.div(".hp.actcount", player);
                            }
                            if (typeof player.lili !== "number") {
                                player.lili = 3;
                            }
                            if (typeof player.maxlili !== "number") {
                                player.maxlili = 5;
                            }
                            player.updatelili();
                        },
                        dieAfter2: function (source) {
                            if (this != game.boss && this != game.me) {
                                if (source) {
                                    source.draw();
                                    source.gainlili();
                                }
                                this.hide();
                                game.addVideo("hidePlayer", this);
                                game.players.remove(this);
                                game.dead.remove(this);
                                this.delete();
                            }
                            if (this == game.boss) {
                                ui.cardPile.innerHTML = "";
                                ui.discardPile.innerHTML = "";
                                ui.create.cardsAsync();
                                game.me.levelOver();
                            }
                            if (game.bossinfo.checkResult && game.bossinfo.checkResult(this) === false) {
                                return;
                            }
                            if (
                                this == game.boss ||
                                !game.hasPlayer(function (current) {
                                    return !current.side;
                                })
                            ) {
                                game.checkResult();
                            }
                        },
                        levelOver: function () {
                            var players = game.players;
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].identity != "cai") {
                                    game.players[i].hide();
                                    game.addVideo("hidePlayer", game.players[i]);
                                    game.players[i].delete();
                                    game.players.remove(game.players[i]);
                                }
                            }
                        },
                    },
                },
                card: {
                    stg_watch: {
                        fullskin: true,
                        type: "equip",
                        subtype: "equip3",
                        image: "ext:/东方project/stg_watch.png",
                        unique: true,
                        ai: {
                            basic: {
                                equipValue: 6,
                            },
                        },
                        skills: ["stg_watch_skill"],
                    },
                    stg_mingyun: {
                        audio: true,
                        fullskin: true,
                        type: "jinjipai",
                        image: "ext:/东方project/stg_mingyun.png",
                        selectTarget: -1,
                        filterTarget: function (card, player, target) {
                            return target == player;
                        },
                        modTarget: true,
                        content: function () {
                            "step 0";
                            player.$skill("命运之光", null, null, true);
                            var cards = [];
                            for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
                                cards.push(ui.cardPile.childNodes[i]);
                            }
                            player.chooseCardButton("命运之光：获得牌堆中的一张牌", cards).set("filterButton", function (button) {
                                return true;
                            });
                            ("step 1");
                            if (result.bool) {
                                player.gain(result.links[0]);
                                player.$gain2(result.links[0]);
                            }
                        },
                        ai: {
                            basic: {
                                order: 1,
                                useful: [4, 2],
                                value: [4, 2],
                            },
                            result: {
                                target: function (player, target) {
                                    return 2;
                                },
                            },
                            tag: {
                                draw: 1,
                            },
                        },
                    },
                    stg_lingji: {
                        audio: true,
                        fullskin: true,
                        notarget: true,
                        image: "ext:/东方project/stg_lingji.png",
                        type: "trick",
                        enable: true,
                        selectTarget: -1,
                        filterTarget: function (card, player, target) {
                            return target == player;
                        },
                        contentBefore: function () {
                            player.$skill("灵击");
                        },
                        content: function () {
                            var players = game.filterPlayer().remove(target);
                            for (var i = 0; i < players.length; i++) {
                                players[i].addTempSkill("lunadial2");
                            }
                            target.addTempSkill("mianyi");
                            console.log(event);
                            var e = event.getParent("useSkill");
                            if (e.skill == "_stg_lingji") {
                                var trigger = event.getParent("damage");
                                trigger.cancel();
                                game.log("灵击：防止本回合所有伤害");
                            }
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
                    stg_fengyin: {
                        audio: true,
                        fullskin: true,
                        image: "ext:/东方project/stg_fengyin.png",
                        type: "trick",
                        enable: true,
                        selectTarget: -1,
                        filterTarget: function (card, player, target) {
                            return target == player;
                        },
                        modTarget: true,
                        content: function () {
                            "step 0";
                            var list = [];
                            for (var i in lib.card) {
                                if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
                                if (lib.card[i].forbid && lib.card[i].forbid.contains(lib.config.mode)) continue;
                                if (lib.card[i].type == "jinjipai") {
                                    list.add(i);
                                }
                            }
                            for (var i = 0; i < list.length; i++) {
                                list[i] = [get.type(list[i]), "", list[i]];
                            }
                            if (list.length) {
                                target.chooseButton(["创建并获得一张禁忌牌", [list, "vcard"]]).set("ai", function (button) {
                                    var player = _status.event.player;
                                    var recover = 0,
                                        lose = 1,
                                        players = game.filterPlayer();
                                    for (var i = 0; i < players.length; i++) {
                                        if (!players[i].isOut()) {
                                            if (get.attitude(player, players[i]) >= 0) recover++;
                                            if (get.attitude(player, players[i]) < 0) {
                                                if (
                                                    players[i].hp == 1 &&
                                                    get.effect(
                                                        players[i],
                                                        {
                                                            name: "gezi_zuiye",
                                                        },
                                                        player,
                                                        player,
                                                    )
                                                )
                                                    return button.link[2] == "gezi_zuiye" ? 2 : -1;
                                                lose++;
                                            }
                                        }
                                    }
                                    if (recover - 2 >= lose) return button.link[2] == "gezi_huangxiang" ? 2 : -1;
                                    return get.value({
                                        name: button.link[2],
                                    });
                                });
                            }
                            ("step 1");
                            if (result.links) {
                                var card = game.createCard(result.links[0][2]);
                                target.$gain(card);
                                target.gain(card);
                            }
                        },
                        ai: {
                            basic: {
                                order: 1,
                                useful: [4, 2],
                                value: [4, 2],
                            },
                            result: {
                                target: function (player, target) {
                                    if (!target.getStat("damage") && get.attitude(player, target) > 0) return -1;
                                    return target.getStat("damage");
                                },
                            },
                            tag: {
                                draw: 0.5,
                            },
                        },
                    },
                    stg_pohuai: {
                        audio: true,
                        fullskin: true,
                        image: "ext:/东方project/stg_pohuai.png",
                        type: "jinjipai",
                        enable: true,
                        selectTarget: 1,
                        filterTarget: function (card, player, target) {
                            return true;
                        },
                        content: function () {
                            player.$skill("破坏之果", null, null, true);
                            var num = 0;
                            for (var j = 0; j < target.stat.length; j++) {
                                if (target.stat[j].kill != undefined) num += target.stat[j].kill;
                            }
                            if (target.countCards("h") > num) {
                                target.chooseToDiscard(target.countCards("h") - num, "h", true);
                            } else {
                                target.draw(num - target.countCards("h"));
                            }
                            if (target.lili < num) {
                                target.gainlili(num - target.lili);
                            } else {
                                target.loselili(target.lili - num);
                            }
                        },
                        ai: {
                            basic: {
                                order: 2,
                                useful: [4, 2],
                                value: [4, 2],
                            },
                            result: {
                                target: function (player, target) {
                                    var num = 0;
                                    for (var j = 0; j < target.stat.length; j++) {
                                        if (target.stat[j].kill != undefined) num += target.stat[j].kill;
                                    }
                                    return num - target.countCards("h");
                                },
                            },
                            tag: {
                                draw: 0.5,
                            },
                        },
                    },
                },
                characterPack: {},
                cardPack: {
                    mode_extension_stg: ["stg_watch", "stg_mingyun", "stg_lingji", "stg_fengyin", "stg_pohuai"],
                },
                init: function () {
                    for (var i in lib.characterPack.mode_extension_stg) {
                        if (lib.characterPack.mode_extension_stg[i][4].contains("hiddenboss")) continue;
                        lib.mode.boss.config[i + "_boss_config"] = {
                            name: get.translation(i),
                            init: true,
                            unfrequent: true,
                        };
                    }
                },
                game: {
                    reserveDead: true,
                    addBossFellow: function (position, name, cards) {
                        var fellow = game.addFellow(position, name, "zoominanim");
                        fellow.directgain(get.cards(cards));
                        fellow.side = true;
                        fellow.identity = "zhong";
                        fellow.setIdentity("zhong");
                        game.addVideo("setIdentity", fellow, "zhong");
                    },
                    addRecord: function (bool) {
                        if (typeof bool == "boolean") {
                            if (!lib.config.gameRecord.stg)
                                lib.config.gameRecord["stg"] = {
                                    data: {},
                                };
                            var data = lib.config.gameRecord.stg.data;
                            var name = game.me.storage.bossname;
                            if (!data[name]) {
                                data[name] = [0, 0, 0, 0];
                            }
                            if (bool) {
                                data[name][0]++;
                                if (data[name][1] == 0 || data[name][1] > game.phaseNumber) {
                                    data[name][1] = game.phaseNumber;
                                    data[name][2] = game.me.storage.fuhuo;
                                }
                            } else {
                                data[name][3]++;
                            }
                            var list = [];
                            for (var i in lib.character) {
                                var info = lib.character[i];
                                if (info[4] && info[4].contains("boss") && info[4].contains("chuangguan")) {
                                    list.push(i);
                                }
                            }
                            var str = "";
                            for (var i = 0; i < list.length; i++) {
                                if (data[list[i]]) {
                                    str += lib.translate[list[i]] + ": <br> 通关次数：" + data[list[i]][0] + "  最快纪录：" + data[list[i]][1] + "回合   剩余残机：" + data[list[i]][2] + "<br>挑战失败次数：" + data[list[i]][3] + "<br>";
                                }
                            }
                            lib.config.gameRecord.stg.str = str;
                            game.saveConfig("gameRecord", lib.config.gameRecord);
                        }
                    },
                    changeBoss: function (name, player) {
                        if (!player) {
                            if (game.additionaldead) {
                                game.additionaldead.push(game.boss);
                            } else {
                                game.additionaldead = [game.boss];
                            }
                            player = game.boss;
                            delete game.boss;
                        }
                        player.delete();
                        game.players.remove(player);
                        game.dead.remove(player);
                        var boss = ui.create.player();
                        boss.getId();
                        boss.init(name);
                        boss.side = true;
                        game.addVideo("bossSwap", player, (game.boss ? "_" : "") + boss.name);
                        boss.dataset.position = 4;

                        game.players.push(boss.animate("zoominanim"));
                        game.arrangePlayers();
                        if (!game.boss) {
                            game.boss = boss;
                            boss.setIdentity("zhu");
                            boss.identity = "zhu";
                        } else {
                            boss.setIdentity("zhong");
                            boss.identity = "zhong";
                        }
                        ui.arena.appendChild(boss);
                        boss.draw(game.bossinfo.gameDraw(game.boss));

                        if (game.me.storage.skill) {
                            for (var i = 0; i < game.me.storage.skill.length; i++) {
                                boss.addSkill(game.me.storage.skill[i]);
                            }
                        }
                        if (game.me.storage.unskill) {
                            for (var i = 0; i < game.me.storage.unskill.length; i++) {
                                boss.removeSkill(game.me.storage.unskill[i]);
                            }
                        }
                        if (game.me.storage.musicchange) {
                            ui.backgroundMusic.pause();
                            setTimeout(function () {
                                game.playnBackgroundMusic(game.me.storage.musicchange[0], false, true);
                                //ui.backgroundMusic.currentTime = game.me.storage.musicchange[1];
                                ui.backgroundMusic.play();
                            }, 2000);
                        }
                    },
                    checkResult: function () {
                        if (game.boss == game.me) {
                            game.over(game.boss.isAlive());
                        } else {
                            game.over(!game.boss.isAlive());
                        }
                    },
                    getVideoName: function () {
                        var str = get.translation(game.me.name);
                        if (game.me.name2) {
                            str += "/" + get.translation(game.me.name2);
                        }
                        var str2 = "挑战";
                        if (game.me != game.boss) {
                            str2 += " - " + get.translation(game.boss);
                        }
                        var name = [str, str2];
                        return name;
                    },
                    // 游戏回合顺序
                    bossPhaseLoop: function () {
                        var next = game.createEvent("phaseLoop");
                        // boss先行
                        if (game.bossinfo.loopFirst) {
                            next.player = game.bossinfo.loopFirst();
                        } else {
                            //next.player=game.boss;
                            // 因为不能选boss,由玩家视角先动。
                            next.player = game.me;
                        }
                        _status.looped = true;
                        next.setContent(function () {
                            "step 0";
                            if (player.identity == "zhu" && game.boss != player) {
                                player = game.boss;
                            }
                            player.phase();
                            ("step 1");
                            if (game.bossinfo.loopType == 2) {
                                _status.roundStart = true;
                                if (event.player == game.boss) {
                                    if (!_status.last || _status.last.nextSeat == game.boss) {
                                        event.player = game.boss.nextSeat;
                                    } else {
                                        event.player = _status.last.nextSeat;
                                    }
                                } else {
                                    _status.last = player;
                                    event.player = game.boss;
                                    if (player.nextSeat == game.boss) {
                                        delete _status.roundStart;
                                    }
                                }
                            } else {
                                event.player = event.player.nextSeat;
                            }
                            event.goto(0);
                        });
                    },
                    chooseCharacter: function (func) {
                        var next = game.createEvent("chooseCharacter", false);
                        next.showConfig = true;
                        next.customreplacetarget = func;
                        next.ai = function (player, list) {
                            if (get.config("double_character")) {
                                player.init(list[0], list[1]);
                            } else {
                                player.init(list[0]);
                            }
                        };
                        next.setContent(function () {
                            "step 0";
                            // 这里应该是选角色页面
                            // 要怎么做，才能获得当前BOSS呢？
                            var i;
                            var list = [];
                            event.list = list;
                            for (i in lib.character) {
                                list.push("gezi_reimu", "gezi_marisa");
                            }
                            var dialog = ui.create.dialog("选择自机角色", "hidden");
                            dialog.classList.add("fixed");
                            ui.window.appendChild(dialog);
                            dialog.classList.add("bosscharacter");
                            dialog.classList.add("modeshortcutpause");
                            dialog.classList.add("withbg");
                            dialog.add([list.slice(0, 2), "character"]);
                            dialog.noopen = true;
                            var next = game.me.chooseButton(dialog, true).set("onfree", true);
                            next._triggered = null;
                            next.custom.replace.target = event.customreplacetarget;
                            next.selectButton = 1;
                            event.changeDialog = function () {
                                if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                                    return;
                                }
                                list.randomSort();

                                var buttons = ui.create.div(".buttons");
                                var node = _status.event.dialog.buttons[0].parentNode;
                                _status.event.dialog.buttons = ui.create.buttons(list.slice(0, 20), "character", buttons);
                                _status.event.dialog.content.insertBefore(buttons, node);
                                buttons.animate("start");
                                node.remove();

                                game.uncheck();
                                game.check();
                            };
                            var createCharacterDialog = function () {
                                event.dialogxx = ui.create.characterDialog();
                                event.dialogxx.classList.add("bosscharacter");
                                event.dialogxx.classList.add("withbg");
                                event.dialogxx.classList.add("fixed");
                                if (ui.cheat2) {
                                    ui.cheat2.animate("controlpressdownx", 500);
                                    ui.cheat2.classList.remove("disabled");
                                }
                            };
                            if (lib.onfree) {
                                lib.onfree.push(createCharacterDialog);
                            } else {
                                createCharacterDialog();
                            }
                            ui.create.cheat2 = function () {
                                _status.createControl = event.asboss;
                                ui.cheat2 = ui.create.control("自由选自机", function () {
                                    if (this.dialog == _status.event.dialog) {
                                        this.dialog.close();
                                        _status.event.dialog = this.backup;
                                        ui.window.appendChild(this.backup);
                                        delete this.backup;
                                        game.uncheck();
                                        game.check();
                                        if (ui.cheat) {
                                            ui.cheat.animate("controlpressdownx", 500);
                                            ui.cheat.classList.remove("disabled");
                                        }
                                    } else {
                                        this.backup = _status.event.dialog;
                                        _status.event.dialog.close();
                                        _status.event.dialog = _status.event.parent.dialogxx;
                                        this.dialog = _status.event.dialog;
                                        ui.window.appendChild(this.dialog);
                                        game.uncheck();
                                        game.check();
                                        if (ui.cheat) {
                                            ui.cheat.classList.add("disabled");
                                        }
                                    }
                                });
                                if (lib.onfree) {
                                    ui.cheat2.classList.add("disabled");
                                }
                                delete _status.createControl;
                            };
                            if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();

                            ("step 1");
                            if (ui.cheat2) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                            if (event.boss) {
                                event.result = {
                                    boss: true,
                                    links: event.enemy,
                                };
                            } else {
                                event.result = {
                                    boss: false,
                                    links: result.links,
                                };
                                _status.coinCoeff = get.coinCoeff(result.links);
                            }
                        });
                        return next;
                    },
                },
                boss: {
                    stg_scarlet: {
                        checkResult: function (player) {
                            if (player == game.boss && game.boss.name != "gezi_remilia") {
                                return false;
                            }
                        },
                        init: function () {
                            var list = ["lebu", "bingliang", "shandian", "jiedao", "fulei", "shengdong", "du"];
                            var map = {
                                lebu: "stg_lingji",
                                bingliang: "stg_mingyun",
                                shandian: "stg_bawu",
                                jiedao: "gezi_reidaisai2",
                                fulei: "gezi_tianguo",
                                shengdong: "gezi_dianche",
                                du: "gezi_huanxiang",
                                wugu: "gezi_tancheng",
                            };
                            for (var i = 0; i < list.length; i++) {
                                game.removenCard(list[i], map[list[i]]);
                            }
                            game.addGlobalSkill("stg_mingyun");
                            game.addGlobalSkill("stg_mingyun2");
                            game.addGlobalSkill("stg_lingji");
                            _status.additionalReward = function () {
                                return 500;
                            };
                            ui.background.setBackgroundImage("extension/东方project/yongyuan.jpg");
                            game.playnBackgroundMusic("gezi_immaterial");
                            //ui.backgroundMusic.currentTime = 137;
                            ui.backgroundMusic.play();
                            game.me.storage.reinforce = ["stg_yousei", "stg_yousei", "gezi_rumia"];
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "好舒服呢", "因为每次白天出来妖怪都很少这次才试着在夜里出来的……", "不过该往哪边走都搞不清楚了这么暗", "但是……夜里的境内还真够浪漫呢", "", "呃，你谁啊？", "", "人类在一片漆黑的地方本来就看不到东西啊(刚刚见过吗？)", "", "那种人你就算抓来吃了也无所谓啊", "", "不过，你很碍事呢", "", "良药苦口这句话你有听过吗？", "end"],
                                    ["gezi_rumia", "就是说啊～还会出现妖怪，真是受不了啊", "", "刚刚不是见过了吗你难不成是夜盲症吗？", "", "是吗？我好像也看到过只在夜里才活动的人呢", "", "是——这样吗？", "", "在我眼前的就是吃了也没关系的人类？", ""],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "这种心情，是要怎么说来着……？", "要是那家伙呢肯定会说“感觉真不错呢”", "我可是不喜欢夜晚，只有奇怪的家伙而已", "", "谁也没有说是你啊。", "", "不过，干嘛把手伸得这么直啊。", "", "看上去像是“人类采用了十进制”", "end"],
                                    ["gezi_rumia", "你说谁是奇怪的家伙啊", "", "那个嘛，当然。", "", "看上去像不像是“圣人被钉在十字架上”？", ""],
                                ];
                            }
                            game.me.storage.tongguan = 0;
                            game.me.storage.stage = "dongfang_hongwu2x";
                            game.me.storage.fuhuo = 1;
                            game.me.storage.unskill = ["gezi_yuezhi"];
                            game.me.storage.musicchange = ["gezi_imperishable", 397];
                            game.me.addSkill("revive");
                            game.me.addSkill("reinforce");
                            if (lib.config.connect_nickname == "黑白葱") game.me.addSkill("finalspark");
                            game.me.addSkill("handcard_max");
                        },
                        gameDraw: function (player) {
                            if (player == game.boss && game.boss.name != "stg_scarlet") return 4;
                            if (player == game.me) return 4;
                            return 0;
                        },
                    },
                    stg_scarlet_ex: {
                        init: function () {
                            var list = ["lebu", "bingliang", "shandian", "jiedao", "fulei", "shengdong", "du", "wugu"];
                            var map = {
                                lebu: "stg_lingji",
                                bingliang: "stg_mingyun",
                                shandian: "stg_bawu",
                                jiedao: "gezi_reidaisai2",
                                fulei: "gezi_tianguo",
                                shengdong: "gezi_dianche",
                                du: "gezi_huanxiang",
                                wugu: "gezi_tancheng",
                            };
                            for (var i = 0; i < list.length; i++) {
                                game.removenCard(list[i], map[list[i]]);
                            }
                            game.addGlobalSkill("stg_lingji");
                            game.addGlobalSkill("stg_pohuai");
                            _status.additionalReward = function () {
                                return 500;
                            };
                            ui.background.setBackgroundImage("extension/东方project/stg_basement.jpg");
                            game.me.storage.reinforce = ["stg_yousei", "stg_yousei", "gezi_patchouli", "stg_maid", "stg_maid", "stg_maid", "gezi_flandre"];
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "今天比平常还要热呢。这么激烈的攻击难道就是因为刚才的女孩子变得奇怪了的缘故？", "", "还有其他奇怪的家伙在啊？", "谁？上次来的时候我感觉好像你不在的……", "", "啊啊，没错", "", "啊啊，是人类啊人类是比红茶还要复杂的东西呢……至少大部分人都是呢", "", "啊－？", "", "对于你来说，人类要由谁来宰杀呢？", "", "姐姐大人？你是说那个叫蕾普莉卡的恶魔？", "", "那家伙的话，我觉得她绝对不会做料理的呢", "", "我有话想对小妹你说你家姐姐大人经常跑到我家神社里去很烦人呢,能不能帮我说说她啊", "", "不要", "", "是需要注意人物呢，过去是不是做了什么事啊？", "", "还真是问题儿童呢", "", "玩什么？", "", "啊啊，模式化游戏呢。那个可是我得意的领域哦", "end"],
                                    ["gezi_flandre", "太天真了！那里的红白！", "", "在是在，没看到而已。不过，你难道是人类？", "", "不隐瞒一下吗？在我看来人类就和饮料没什么分别", "", "看，所谓的鸡", "", "就算是不懂得宰杀的人也能饱尝其美味", "", "这个呢？首先不可能是让姐姐大人来做的……", "", "蕾米莉亚！是蕾米莉亚姐姐大人啊", "", "不会做", "", "我知道啊，我也打算去……", "", "被阻止了，外面下着暴雨没法走", "", "什么都不可能做的。我在这495年间，一次都没有外出过啊", "", "飞到那边有游戏用的玩具……", "", "弹幕游戏", ""],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "究竟怎么了？这洋馆现在蕾米莉亚应该在神社里的啊。为啥，这里的攻击还是这么激烈呢？", "", "我啥也没叫", "你什么人？", "", "啊啊，我？是啊，博丽灵梦，是个巫女", "", "你是…什么东西？（是不是当护士会更合适呢？）", "", "都在？", "", "真好，我每星期只能休息两天", "", "姐姐大人？你是妹妹", "", "不是蛮不错的吗。你看你看，就好好给你看个够吧", "", "你出多少？", "", "一个的话，连人命也买不起啊", "end"],
                                    ["gezi_flandre", "你叫了什么吗？", "", "问别人姓名之前要……", "", "我叫芙兰朵露哦魔理沙小姐（当巫女有点勉强呢）", "", "我一直都在这个家里。包括你混进这个家的时候", "", "一直都在地下休息啊，大概495年左右", "", "我一直都有和姐姐大人保持联络的从她那里听说了", "", "我也想到外面的世界去，看看所谓的人长得什么样子", "", "能陪我一起玩吗？", "", "一个硬币", ""],
                                ];
                            }
                            game.me.storage.tongguan = 0;
                            game.me.storage.fuhuo = 0;
                            lib.character["gezi_flandre"] = ["female", "wei", 4, ["gezi_kuangyan", "flaninit"], []];
                            lib.character["gezi_flandre"][4].push("ext:东方project/gezi_flandre.jpg");
                            game.me.storage.reskill = ["fourof", "starbow", "hongwu_ex_win"];
                            game.me.storage.musicchange = ["gezi_death", 0];
                            lib.character["gezi_patchouli"] = ["female", "wei", 3, ["gezi_qiyao", "gezi_riyin", "silent"], []];
                            lib.character["gezi_patchouli"][4].push("ext:东方project/stg_patchouli.jpg");
                            game.me.addSkill("revive");
                            game.me.addSkill("reinforce");
                            if (lib.config.connect_nickname == "黑白葱") game.me.addSkill("finalspark");
                            game.me.addSkill("handcard_max");
                        },
                        gameDraw: function (player) {
                            if (player.name == "gezi_flandre") return 0;
                            if (player == game.boss) return 0;
                            if (player == game.me) return 4;
                            return 0;
                        },
                    },
                    global: {
                        loopType: 1,
                        chongzheng: 6,
                    },
                },
                skill: {
                    stg_mingyun: {
                        direct: true,
                        trigger: {
                            player: "drawAfter",
                        },
                        filter: function (event, player) {
                            if (event.parent.parent.name != "phaseDraw") return false;
                            if (event.result.length) {
                                for (var i = 0; i < event.result.length; i++) {
                                    if (event.result[i].name == "stg_mingyun") {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },
                        content: function () {
                            player.chooseToUse(function (card) {
                                return card.name == "stg_mingyun";
                            }, "这……这就是命运的指示？");
                        },
                    },
                    stg_mingyun2: {
                        audio: 2,
                        trigger: {
                            global: "judge",
                        },
                        filter: function (event, player) {
                            return (
                                player.countCards("h", {
                                    name: "stg_mingyun",
                                }) > 0
                            );
                        },
                        direct: true,
                        content: function () {
                            "step 0";
                            player
                                .chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + "是否打出命运之光替换之", "h", function (card) {
                                    return card.name == "stg_mingyun";
                                })
                                .set("ai", function (card) {
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
                                })
                                .set("judging", trigger.player.judging[0]);
                            ("step 1");
                            if (result.bool) {
                                player.respond(result.cards, "highlight");
                            } else {
                                event.finish();
                            }
                            ("step 2");
                            if (result.bool) {
                                player.$skill("命运之光");
                                player.logSkill("_stg_mingyun2");
                                player.$gain2(trigger.player.judging[0]);
                                player.gain(trigger.player.judging[0]);
                                trigger.player.judging[0] = result.cards[0];
                                if (!get.owner(result.cards[0], "judge")) {
                                    trigger.position.appendChild(result.cards[0]);
                                }
                                game.log(trigger.player, "的判定牌改为", result.cards[0]);
                            }
                            ("step 3");
                            game.delay(2);
                        },
                        ai: {
                            tag: {
                                rejudge: 1,
                            },
                        },
                    },
                    stg_lingji: {
                        trigger: {
                            player: "damageBefore",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return player.countCards("h", {
                                name: "stg_lingji",
                            });
                        },
                        content: function () {
                            "step 0";
                            var next = player.chooseToUse({
                                filterCard: function (card, player) {
                                    if (card.name != "stg_lingji") return false;
                                    var mod = game.checkMod(card, player, "unchanged", "cardEnabled", player.get("s"));
                                    if (mod != "unchanged") return mod;
                                    return true;
                                },
                                prompt: "是否使用【灵击】无效该伤害？",
                            });
                            next.set("ai1", function () {
                                var target = _status.event.player;
                                var evt = _status.event.getParent();
                                var sks = target.get("s");
                                return 1;
                            });
                        },
                    },
                    stg_pohuai: {
                        enable: "chooseToUse",
                        filterCard: function (card) {
                            return card.name == "stg_pohuai";
                        },
                        viewAsFilter: function (player) {
                            return (
                                player.countCards("h", {
                                    name: "stg_pohuai",
                                }) > 0
                            );
                        },
                        viewAs: {
                            name: "gezi_danmakucraze",
                        },
                        prompt: "将【破坏之果】当【弹幕狂欢】使用",
                        check: function (card) {
                            return 5 - get.value(card);
                        },
                    },
                    // 拿复活币复活。game.me.storage.fuhuo 是复活币的数量。
                    revive: {
                        trigger: {
                            player: "dieBefore",
                        },
                        direct: true,
                        filter: function (event, player) {
                            return player.storage.fuhuo;
                        },
                        content: function () {
                            event.cards = player.getDiscardableCards(player, "hej");
                            player.discard(event.cards);
                            game.playlili("die_female");
                            if (player.isTurnedOver()) {
                                player.turnOver();
                            }
                            player.node.turnedover.innerHTML = "";
                            player.node.turnedover.setBackgroundImage("");
                            player.node.turnedover.style.opacity = 0.7;
                            game.delay(3);
                            setTimeout(function () {
                                game.log(player, "消耗了1个残机复活");
                                player.node.turnedover.style.opacity = 0;
                                player.hp = player.maxHp;
                                player.lili = 2;
                                player.update();
                                player.storage.fuhuo--;
                                player.draw(4);
                                trigger.cancel();
                            }, 1000);
                        },
                    },
                    revive_boss: {
                        trigger: {
                            player: "dieBefore",
                        },
                        direct: true,
                        locked: true,
                        fixed: true,
                        filter: function (event, player) {
                            return game.me.storage.reskill && game.me.storage.reskill.length > 0;
                        },
                        content: function () {
                            game.log(player, "进入下一个阶段！");
                            player.hp = player.maxHp;
                            player.lili = player.maxlili;
                            if (player.node.fuka) {
                                player.Fuka()._triggered = null;
                            }
                            player.update();
                            player.addSkill(game.me.storage.reskill[0]);
                            game.me.storage.reskill.remove(game.me.storage.reskill[0]);
                            trigger.cancel();
                        },
                    },
                    // 增援：game.me.storage.reinforce是增援列表（最后一个自动是BOSS），game.me.storage.stage是给boss的，换场景使用的技能
                    reinforce: {
                        trigger: {
                            player: "phaseBefore",
                        },
                        direct: true,
                        priority: 1000,
                        filter: function (event, player) {
                            var num = 0;
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].identity == "zhu" || game.players[i].identity == "zhong") num++;
                            }
                            return game.me.storage.reinforce.length && num < 2;
                        },
                        content: function () {
                            var num = [1, 2, 3, 5, 6, 7];
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].identity == "zhu" || game.players[i].identity == "zhong") num.splice(num.indexOf(game.players[i].dataset.position), 1);
                            }
                            if (game.me.storage.reinforce.length > 1) {
                                game.addBossFellow(num.randomGet(), game.me.storage.reinforce[0], parseInt(lib.character[game.me.storage.reinforce[0]][1]));
                                game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
                            } else {
                                game.boss.addSkill("dongfang_hongwu2");
                            }
                        },
                    },
                    // 手牌上限+关卡数
                    handcard_max: {
                        alter: true,
                        intro: {
                            content: function (storage, player) {
                                return "手牌上限+" + player.storage.tongguan + "<br>你的手牌上限加关卡数。";
                            },
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + player.storage.tongguan;
                            },
                        },
                    },
                    // 直接秒一个人
                    finalspark: {
                        enable: "phaseUse",
                        selectTarget: 1,
                        filterTarget: function () {
                            return true;
                        },
                        content: function () {
                            targets[0].damage(Infinity);
                        },
                    },
                    // 红魔乡 （正常）
                    // 第一关
                    dongfang_hongwu: {
                        trigger: {
                            global: "gameStart",
                        },
                        forced: true,
                        popup: false,
                        unique: true,
                        fixed: true,
                        content: function () {
                            "step 0";
                            game.me.storage.bossname = "stg_scarlet";
                            player.hide();
                            game.addVideo("hidePlayer", player);
                            player.delete();
                            game.players.remove(player);
                            game.dead.remove(player);
                            event.target = game.me;
                            ("step 1");
                            var list = [];
                            if (event.target.name == "gezi_marisa") {
                                list = ["gezi_missile", "gezi_bagua"];
                                event.target.removeSkill("gezi_stardust");
                            } else if (event.target.name == "gezi_reimu") {
                                list = ["gezi_needle", "gezi_yinyangyuguishen"];
                                event.target.removeSkill("gezi_mengxiang");
                            }
                            for (var i = 0; i < list.length; i++) {
                                list[i] = ["", "", list[i]];
                            }
                            if (list.length) {
                                event.target.chooseButton(["选择本次闯关使用的装备", [list, "vcard"]], true);
                            }
                            ("step 2");
                            if (result.bool) {
                                event.target.equip(game.createCard(result.links[0][2]));
                                if (result.links[0][2] == "gezi_missile") {
                                    event.target.addSkill("masterspark");
                                }
                                if (result.links[0][2] == "gezi_bagua") {
                                    event.target.addSkill("privateSquare");
                                }
                                if (result.links[0][2] == "gezi_needle") {
                                    event.target.addSkill("fengmo");
                                }
                                if (result.links[0][2] == "gezi_yinyangyuguishen") {
                                    event.target.addSkill("doll");
                                }
                            }
                            ("step 3");
                            // 制作关卡开始的对话框
                            var dialog = ui.create.dialog("第一关<br><br>梦幻夜行绘卷");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                        },
                    },
                    // 第二关
                    dongfang_hongwu2: {
                        mode: ["stg"],
                        trigger: {
                            player: "dieBegin",
                        },
                        silent: true,
                        unique: true,
                        fixed: true,
                        init: function (event, character) {
                            var a = [1, 1]; // 记录玩家和敌人对话位置
                            var name = game.me.name; // 记录当前检测名字的
                            var j = 0; // 记录当前检测谁的对话的
                            var step1 = function () {
                                // 读取当前对话
                                var dialog = ui.create.dialog();
                                for (var i = 0; i < game.me.storage.dialog.length; i++) {
                                    if (game.me.storage.dialog[i][0] == name) {
                                        if (game.me.storage.dialog[i][a[j]] == "") {
                                            a[j]++;
                                            if (name == game.boss.name) {
                                                j = 0;
                                                name = game.me.name;
                                            } else {
                                                j++;
                                                if (game.me.storage.reinforce[0] && game.boss.name != game.me.storage.reinforce[0]) {
                                                    game.changeBoss(game.me.storage.reinforce[0]);
                                                    game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
                                                }
                                                name = game.boss.name;
                                            }
                                            i = -1;
                                        } else if (game.me.storage.dialog[i][a[j]] == "end") {
                                            game.resume();
                                            return;
                                        } else {
                                            var player = ui.create.div(".avatar", dialog).setBackground(name, "character");
                                            dialog.add('<div><div style="width:280px;margin-left:120px;font-size:18px">' + game.me.storage.dialog[i][a[j]] + "</div></div>");
                                            player.style.float = "left";
                                            dialog.style.height = "150px";
                                            a[j]++;
                                        }
                                    }
                                }
                                ui.auto.hide();
                                dialog.open();
                                ui.create.control("继续", function () {
                                    ui.dialog.close();
                                    while (ui.controls.length) ui.controls[0].close();
                                    var num1 = -1;
                                    for (var i = 0; i < game.me.storage.dialog.length; i++) {
                                        if (game.me.storage.dialog[i][0] == name) {
                                            num1 = i;
                                            if (game.me.storage.dialog[i][a[j]] == "end") num1 = -2;
                                            break;
                                        }
                                    }
                                    if (num1 == -1) {
                                        if (game.me.storage.reinforce[0]) {
                                            game.changeBoss(game.me.storage.reinforce[0]);
                                            game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
                                        }
                                        game.resume();
                                    } else if (num1 == -2) game.resume();
                                    else step1();
                                });
                            };
                            game.pause();
                            if (!game.me.storage.dialog) {
                                if (game.me.storage.reinforce[0]) {
                                    game.changeBoss(game.me.storage.reinforce[0]);
                                    game.me.storage.reinforce.remove(game.me.storage.reinforce[0]);
                                }
                                game.resume();
                            } else {
                                step1();
                            }
                            game.me.addSkill(game.me.storage.stage);
                        },
                        filter: function (event, player) {
                            return player == game.boss;
                        },
                        content: function () {
                            player.hide();
                            game.addVideo("hidePlayer", player);
                        },
                    },
                    dongfang_hongwu2x: {
                        trigger: {
                            global: "dieAfter",
                        },
                        forced: true,
                        priority: -10,
                        unique: true,
                        filter: function (event) {
                            if (lib.config.mode != "stg") return false;
                            return event.player == game.boss;
                        },
                        content: function () {
                            "step 0";
                            game.playnBackgroundMusic("gezi_immaterial");
                            ui.backgroundMusic.pause();
                            game.boss.hide();
                            game.boss.delete();
                            game.players.remove(game.boss);
                            game.dead.remove(game.boss);
                            game.addVideo("hidePlayer", game.boss);
                            game.delay();
                            ("step 1");
                            var line;
                            if (game.me.name == "gezi_reimu") {
                                line = "不过就算说是良药如果不喝了试试的话又怎么知道";
                            } else if (game.me.name == "gezi_marisa") {
                                line = "难道说，除了人类以外都不是十指吗";
                            } else {
                                line = "红魔乡一面BOSS——通关！";
                            }
                            var dialog = ui.create.dialog();
                            dialog.add('<div><div style="width:280px;margin-left:120px;font-size:18px">' + line + "</div></div>");
                            var playerui = ui.create.div(".avatar", dialog).setBackground(game.me.name, "character");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("下一关", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 2");
                            var dialog = ui.create.dialog("第二关<br><br>湖上的魔精");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 3");
                            game.addBossFellow(3, "stg_yousei", 1);
                            game.addBossFellow(5, "stg_maoyu", 2);
                            ("step 4");
                            while (_status.event.name != "phaseLoop") {
                                _status.event = _status.event.parent;
                            }
                            game.me.storage.tongguan++;
                            game.me.storage.reinforce = ["gezi_daiyousei", "stg_yousei", "gezi_cirno"];
                            game.me.storage.stage = "dongfang_hongwu3x";
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "这座湖原来是如此宽广的吗？浓雾遮天视野不良真麻烦啊。难不成我是路痴？", "", "啊啦是吗？那么，带个路吧？这附近有岛对不对？", "", "靶子？这还真是令人吃惊啊", ""],
                                    ["gezi_cirno", "如果迷路，定是妖精所为", "", "你啊 可别吓着了喔，在你面前可是有个强敌呢!", "", "开什么玩笑啊~", "像你这样的人，就和英吉利牛肉一起冰冻冷藏起来吧！！", "end"],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "我记着岛屿明明是在这附近来着…难道说那个岛屿移动了不成？", "而且……现在可是夏天呢为什么天气会这么冷的说？", "", "是你吧。让天这么冷", "", "寒酸的家伙", "", "不对的地方有很多很多哦？", "end"],
                                    ["gezi_cirno", "不会再让你回到陆地上了啊！", "", "这比热不是要好得多吗？", "", "听起来好像哪里不对...", ""],
                                ];
                            }
                            game.me.removeSkill("dongfang_hongwu2x");
                            game.me.storage.unskill = ["gezi_dongjie"];
                            game.me.storage.musicchange = ["gezi_baka", 1039];
                            ui.background.setBackgroundImage("extension/东方project/gezi_baka.jpg");
                            game.resetSkills();
                            _status.paused = false;
                            _status.event.player = game.me;
                            _status.event.step = 0;
                            _status.roundStart = game.me;
                            //ui.backgroundMusic.currentTime = 693;
                            ui.backgroundMusic.play();
                            if (game.bossinfo) {
                                game.bossinfo.loopType = 1;
                            }
                        },
                    },
                    // 第三关
                    dongfang_hongwu3x: {
                        trigger: {
                            global: "dieAfter",
                        },
                        forced: true,
                        priority: -10,
                        unique: true,
                        filter: function (event) {
                            if (lib.config.mode != "stg") return false;
                            return event.player == game.boss;
                        },
                        content: function () {
                            "step 0";
                            game.playnBackgroundMusic("gezi_immaterial");
                            ui.backgroundMusic.pause();
                            game.boss.hide();
                            game.boss.delete();
                            game.players.remove(game.boss);
                            game.dead.remove(game.boss);
                            game.addVideo("hidePlayer", game.boss);
                            game.delay();
                            ("step 1");
                            var line;
                            if (game.me.name == "gezi_reimu") {
                                line = "啊啊，越来越冷了啊这样会得空调病的啊";
                            } else if (game.me.name == "gezi_marisa") {
                                line = "啊啊，短袖对身体不好赶快去找个能招待我喝茶的房子好了嗯，就这么办";
                            } else {
                                line = "红魔乡二面BOSS——通关！";
                            }
                            var dialog = ui.create.dialog();
                            dialog.add('<div><div style="width:280px;margin-left:120px;font-size:18px">' + line + "</div></div>");
                            var playerui = ui.create.div(".avatar", dialog).setBackground(game.me.name, "character");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("下一关", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 2");
                            var dialog = ui.create.dialog("第三关<br><br>红色之境");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 3");
                            game.addBossFellow(5, "stg_maid", 2);
                            game.addBossFellow(3, "stg_maoyu", 2);
                            ("step 4");
                            while (_status.event.name != "phaseLoop") {
                                _status.event = _status.event.parent;
                            }
                            game.me.storage.tongguan++;
                            game.me.storage.reinforce = ["stg_maid", "gezi_meiling"];
                            game.me.storage.stage = "dongfang_hongwu4x";
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "", "你是不会往啥都没有的地方逃的对吧？", "", "顺便问下，你是什么人？", "", "	我只是个当巫女的普通人来着啊", "", "不要传谣了！", "end"],
                                    ["gezi_meiling", "啊啦，就算你跟着我过来这边也是什么都没有的啊？", "", "嗯——逃的时候就只想着逃的事情了", "", "哎—普通人哟你是普通之外的说", "", "那可真是太好了", "确实有……巫女是吃了也没问题的人类之类的传说呢……", ""],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "好久不见了呢。", "", "就在刚才吧？", "", "好了，不要碍事了", "你就是这里看门的吧？", "", "果然，你是看门的吧？", "", "也就是说，普通人呢", "那就让我给你点惩罚吧～", ""],
                                    ["gezi_meiling", "咦？我们什么时候开始成了熟人？", "", "呜呜，遇到奇怪的人了啊。", "", "正因为是门卫才要碍你的事啊", "", "只是个做门卫的普通人哦。", "", "你这家伙，究竟受的什么教育啊～", "end"],
                                ];
                            }
                            game.me.removeSkill("dongfang_hongwu3x");
                            game.me.storage.skill = ["revive_boss"];
                            game.me.storage.unskill = ["gezi_jicai"];
                            game.me.storage.reskill = ["shogon"];
                            game.me.storage.musicchange = ["gezi_sakura", 1688]; //先写个翠梦的音乐，以后改
                            game.resetSkills();
                            _status.paused = false;
                            _status.event.player = game.me;
                            _status.event.step = 0;
                            _status.roundStart = game.me;
                            //ui.backgroundMusic.currentTime = 1338;
                            ui.backgroundMusic.play();
                            ui.background.setBackgroundImage("extension/东方project/stg_scarlet2.jpg");
                            if (game.bossinfo) {
                                game.bossinfo.loopType = 1;
                            }
                        },
                    },
                    dongfang_hongwu4x: {
                        trigger: {
                            global: "dieAfter",
                        },
                        forced: true,
                        priority: -10,
                        unique: true,
                        filter: function (event) {
                            if (lib.config.mode != "stg") return false;
                            return event.player == game.boss;
                        },
                        content: function () {
                            "step 0";
                            game.playnBackgroundMusic("gezi_immaterial");
                            ui.backgroundMusic.pause();
                            game.boss.hide();
                            game.boss.delete();
                            game.players.remove(game.boss);
                            game.dead.remove(game.boss);
                            game.addVideo("hidePlayer", game.boss);
                            game.delay();
                            event.list = [];
                            if (game.me.name == "gezi_reimu") {
                                event.list = ["那么，领路就拜托你了哦"];
                            } else if (game.me.name == "gezi_marisa") {
                                event.list = ["果然，和普通人战斗，不符合我的性格呢。"];
                            } else {
                                line = "红魔乡三面BOSS——通关！";
                            }
                            ("step 1");
                            var dialog = ui.create.dialog();
                            dialog.add('<div><div style="width:280px;margin-left:120px;font-size:18px">' + event.list[0] + "</div></div>");
                            var playerui = ui.create.div(".avatar", dialog).setBackground(game.me.name, "character");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("下一关", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 2");
                            var dialog = ui.create.dialog("第四关<br><br>漆黑之馆");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 3");
                            game.addBossFellow(3, "stg_maid", 2);
                            game.addBossFellow(5, "stg_bookshelf", 0);
                            ("step 4");
                            while (_status.event.name != "phaseLoop") {
                                _status.event = _status.event.parent;
                            }
                            game.me.storage.tongguan++;
                            game.me.storage.fuhuo++;
                            game.log(game.me, "获得了一个残机！");
                            game.me.storage.reinforce = ["gezi_koakuma", "gezi_patchouli"];
                            game.me.storage.stage = "dongfang_hongwu5x";
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "这家人屋里都不安窗户的吗？", "而且从外面看的时候感觉有这么大吗？", "", "书房？（红白？）", "", "我那里就算年中无休也一个参拜客也没有哦", "", "说起来在这么暗的屋子里能读书吗？", "", "所以说～我才不是夜盲症什么的", "切，才不是想说这个呢", "你就是这里的主人吗？", "", "放出的雾太多了，很令人困扰啊", ""],
                                    ["gezi_patchouli", "那边的红白！", "不准在我的书房里捣乱", "", "这里的书价值能比得上你家神社５年份的香火钱呢", "", "嘛你的神社也就只有那种程度的价值了", "", "我可不是像你一样的夜盲症患者", "", "你找大小姐有什么事？", "", "那么，就绝对不可以让你去见大小姐了", "end"],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "哇啊，好多书啊", "等一下全都爽快地借走", "", "就要拿", "", "（书里有这个？）", "", "不是因为房间太暗了吗？", "", "要说的话是缺维生素A", "", "我不缺，我什么都很充足呢", "", "我是很美味的哦", ""],
                                    ["gezi_patchouli", "不要拿", "", "让我看看，如何把眼前的黑色给消极地处理掉…", "", "嗯～，最近，眼睛不太好了", "", "是不是身体里铁不足啊", "", "那你呢？", "", "那我就不客气了，可以吗", "", "让我看看，简单又能除去素材腥味的烹饪法是…", "end"],
                                ];
                            }
                            game.me.removeSkill("dongfang_hongwu4x");
                            game.me.storage.skill = ["revive_boss"];
                            game.me.storage.unskill = ["gezi_xianzhe"];
                            game.me.storage.reskill = ["patchyspell"];
                            game.me.storage.musicchange = ["gezi_library", 2331];
                            game.resetSkills();
                            _status.paused = false;
                            _status.event.player = game.me;
                            _status.event.step = 0;
                            _status.roundStart = game.me;
                            //ui.backgroundMusic.currentTime = 1970;
                            ui.backgroundMusic.play();
                            ui.background.setBackgroundImage("extension/东方project/stg_library.jpg");
                            if (game.bossinfo) {
                                game.bossinfo.loopType = 1;
                            }
                        },
                    },
                    dongfang_hongwu5x: {
                        trigger: {
                            global: "dieAfter",
                        },
                        forced: true,
                        priority: -10,
                        unique: true,
                        filter: function (event) {
                            if (lib.config.mode != "stg") return false;
                            return event.player == game.boss;
                        },
                        content: function () {
                            "step 0";
                            game.playnBackgroundMusic("gezi_immaterial");
                            ui.backgroundMusic.pause();
                            game.boss.hide();
                            game.boss.delete();
                            game.players.remove(game.boss);
                            game.dead.remove(game.boss);
                            game.addVideo("hidePlayer", game.boss);
                            game.delay();
                            event.list = [];
                            event.string = game.me.name;
                            if (game.me.name == "gezi_reimu") {
                                event.list = ["不许碍事"];
                            } else if (game.me.name == "gezi_marisa") {
                                event.string = game.boss.name;
                                event.list = ["呜呜，因为贫血<br>所以魔法咏唱不下去了"];
                            } else {
                                line = "红魔乡四面BOSS——通关！";
                            }
                            ("step 1");
                            var dialog = ui.create.dialog();
                            dialog.add('<div><div style="width:280px;margin-left:120px;font-size:18px">' + event.list[0] + "</div></div>");
                            var playerui = ui.create.div(".avatar", dialog).setBackground(event.string, "character");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("下一关", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 2");
                            var dialog = ui.create.dialog("第五关<br><br>红月之下潇洒的从者");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 3");
                            game.addBossFellow(3, "stg_maid", 2);
                            game.addBossFellow(4, "stg_maid", 2);
                            game.addBossFellow(5, "stg_maid", 2);
                            ("step 4");
                            while (_status.event.name != "phaseLoop") {
                                _status.event = _status.event.parent;
                            }
                            game.me.storage.tongguan++;
                            game.me.storage.reinforce = ["stg_maid", "gezi_sakuya"];
                            game.me.storage.stage = "dongfang_hongwu6x";
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "", "你—看上去不是这里的主人呢", "", "（看样子如果说是去打倒她的的话她就不会让我过了呢）", "", "被软禁了吗？", "", "那问不暗的你也行啦", "在这一带放出大雾的是你们对吧？", "那个很烦人啊你们有什么目的？", "", "我可不喜欢那样能请你们住手么？", "", "那就叫她出来", "", "我要是在这里大闹一场的话她会不会出来呢？", ""],
                                    ["gezi_sakuya", "啊—没法继续扫除了！", "这不是会惹大小姐生气吗！！", "", "怎么回事？是大小姐的客人吗？", "", "不让你过去的哦", "大小姐很少见人的", "", "大小姐喜欢暗的地方", "", "阳光很碍事啊大小姐就喜欢昏昏暗暗的", "", "这个请你去和大小姐商量", "", "喂，我没有理由让主人遇到危险的对吧？", "", "但是，你是见不到大小姐的", "为此，即使要停止时间我也要拖延你的脚步", "end"],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "", "竟然会出现女仆啊", "抓住她的话，会不会扯上华盛顿公约呢？", "", "不要你可怜", "", "啊啊，那好像也不错呢", "", "不会呢", "", "（被发现了啊）不如说是负责修缮的", "", "负责恋爱就属于中学部了吗", "", "也就是说，我要是打倒你的话就能成为女仆长了呢。", "", "啊，相当正常嘛那种事情", "", "end"],
                                    ["gezi_sakuya", "啊—这样就没法打扫了！", "这不是会惹大小姐生气吗！！", "", "啊啊，魔法使可是受《生类怜悯令》保护呢。", "", "是吗？", "难道你也被这个洋馆雇佣了吗？", "", "不过，你看起来也不像会打扫卫生的样子呢。", "", "那你是负责什么的？负责恋爱的？", "", "那是什么啊又不是在小学里", "", "好了，还是赶快让我着手工作吧。", "忘了说了，我呢，是这里的女仆长——咲夜。", "", "嘴上那么说最后惨败的人，", "我见过的就比钍衰变链的数目还要多呢", "", "你的时间也是属于我的…古旧魔女胜利的希望，是零。", "end"],
                                ];
                            }
                            game.me.removeSkill("dongfang_hongwu5x");
                            game.me.storage.skill = ["revive_boss", "gezi_sakuyainit"];
                            game.me.storage.unskill = ["gezi_world"];
                            game.me.storage.reskill = ["perfectSquare"];
                            game.me.storage.musicchange = ["gezi_sb", 3105]; //文花的音乐
                            ui.background.setBackgroundImage("extension/东方project/stg_scarletstairs.jpg");
                            game.resetSkills();
                            _status.paused = false;
                            _status.event.player = game.me;
                            _status.event.step = 0;
                            _status.roundStart = game.me;
                            //ui.backgroundMusic.currentTime = 2715;
                            ui.backgroundMusic.play();
                            if (game.bossinfo) {
                                game.bossinfo.loopType = 1;
                            }
                        },
                    },
                    dongfang_hongwu6x: {
                        trigger: {
                            global: "dieAfter",
                        },
                        forced: true,
                        priority: -10,
                        unique: true,
                        filter: function (event) {
                            if (lib.config.mode != "stg") return false;
                            return event.player == game.boss;
                        },
                        content: function () {
                            "step 0";
                            game.playnBackgroundMusic("gezi_immaterial");
                            ui.backgroundMusic.pause();
                            game.boss.hide();
                            game.boss.delete();
                            game.players.remove(game.boss);
                            game.dead.remove(game.boss);
                            game.addVideo("hidePlayer", game.boss);
                            game.delay();
                            event.list = [];
                            event.string = game.me.name;
                            if (game.me.name == "gezi_reimu") {
                                event.string = game.boss.name;
                                event.list = ["好强……但是，大小姐的话也许"];
                            } else if (game.me.name == "gezi_marisa") {
                                event.list = ["就算不是女仆，<br>是不是也能当女仆长啊？"];
                            } else {
                                line = "红魔乡五面BOSS——通关！";
                            }
                            ("step 1");
                            var dialog = ui.create.dialog();
                            dialog.add('<div><div style="width:280px;margin-left:120px;">' + event.list[0] + "</div></div>");
                            var playerui = ui.create.div(".avatar", dialog).setBackground(event.string, "character");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("下一关", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 2");
                            var dialog = ui.create.dialog("最终关<br><br>在乐土上洒下血雨");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                            ("step 3");
                            game.addBossFellow(3, "stg_bat", 1);
                            game.addBossFellow(4, "stg_bat", 1);
                            game.addBossFellow(5, "stg_bat", 1);
                            game.addBossFellow(6, "stg_bat", 1);
                            ("step 4");
                            while (_status.event.name != "phaseLoop") {
                                _status.event = _status.event.parent;
                            }
                            game.me.storage.tongguan++;
                            game.me.storage.fuhuo++;
                            game.log(game.me, "获得了一个残机！");
                            game.me.storage.reinforce = ["gezi_sakuya", "gezi_remilia"];
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "差不多也该现出你的原形了吧？", "大小姐？", "", "刚才的女仆原来是人类啊", "", "一个人的话又不是大量屠杀所以没关系", "", "是啊是啊，给人添麻烦了呢你", "", "总而言之，从这里离开成吗？", "", "我是说要你从这世上离开", "", "当护卫的那个女仆是你雇来的对吧？", "像你这样的深闺大小姐一招就能打倒！", "", "你难道很强么？", "", "……似乎很有一手的样子呢", "", "既然月亮如此鲜红", "", "看来会成为永远之夜呢", ""],
                                    ["gezi_remilia", "果然，人类还是不中用啊", "", "你这家伙，是杀人犯呢", "", "脑子秀逗呢。而且理由不明", "", "这里是我的城哦？", "要离开也该是你离开才对。", "", "真是没办法呢", "虽然现在，已经吃得饱饱的了……", "", "咲夜是个优秀的扫除者", "托她的福，这里一颗头都没掉过哦", "", "谁知道呢。我又不怎么到外面去", "因为我对阳光很没辙", "", "在如此鲜红的月亮之下我真的会杀掉你哦", "", "看来会成为欢愉之夜呢", "", "end"],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "来了来了有寒气在奔走，这股妖气", "为什么越是强大的家伙越要隐藏？", "", "…你看起来没有脑子呐", "", "你就是，那个吧？", "那什么阳光啦、难闻的蔬菜和银的什么之类的，", "明明是夜的支配者哪来这么多弱点…", "", "好像很有趣呢，你果然有喝吧？那个", "", "你到现在吸了多少人的血了？", "", "13块我是和食主义者", "", "是吗，不过我可是饿了哦。", "", "啊啊，是这样吗", "刚才那是植物的名字，「亚阿相界」", "", "是快乐的人类哦", "", "似乎会成为清凉之夜呢", ""],
                                    ["gezi_remilia", "有能力的鹰不藏尾巴…呢", "", "只有人啊", "需要脑之类的单纯的化学思考中枢。", "", "就是啊，是病弱的女孩呢", "", "那是当然的了。不过饭量小所以每次都会剩下", "", "你能记得清楚到今天为止自己吃过的面包的数量吗？", "", "那，你是来干嘛的？", "我现在是已经吃饱了…", "", "…要吃的话，也无所谓。", "", "人类真是快乐啊。", "还是说，你根本就不是人类比较好呢？", "", "呵呵呵，因为月亮也如此之红吗？", "", "似乎会是酷暑之夜呢", "end"],
                                ];
                            }
                            game.me.removeSkill("dongfang_hongwu6x");
                            game.me.storage.skill = ["revive_boss"];
                            game.me.storage.unskill = ["gezi_hongmo", "gezi_feise"];
                            game.me.storage.reskill = ["gezi_gungirs", "gens"];
                            game.me.storage.musicchange = ["gezi_scarlet", 3621];
                            game.resetSkills();
                            _status.paused = false;
                            _status.event.player = game.me;
                            _status.event.step = 0;
                            _status.roundStart = game.me;
                            //ui.backgroundMusic.currentTime = 3463;
                            ui.backgroundMusic.play();
                            ui.background.setBackgroundImage("extension/东方project/gezi_scarlet.jpg");
                            if (game.bossinfo) {
                                game.bossinfo.loopType = 1;
                            }
                        },
                    },
                    hongwu_win: {
                        trigger: {
                            player: "die",
                        },
                        direct: true,
                        forceDie: true,
                        content: function () {
                            game.boss.hide();
                            var clear = function () {
                                ui.dialog.close();
                                while (ui.controls.length) ui.controls[0].close();
                            };
                            var clear2 = function () {
                                ui.auto.show();
                                ui.arena.classList.remove("only_dialog");
                            };
                            var step1 = function () {
                                ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">就这样，红雾异变的黑幕被击退了。没过几天，红雾就从幻想乡彻底的散去了。恭喜你闯关成功！');
                                ui.create.div(".avatar", ui.dialog).setBackground("akyuu", "character");
                                ui.create.control("呼……累死人了", step3);
                            };
                            var step3 = function () {
                                clear();
                                if (lib.config.gameRecord.stg && lib.config.gameRecord.stg.data["stg_scarlet"] && lib.config.gameRecord.stg.data["stg_scarlet"][0] > 1) {
                                    step5();
                                } else {
                                    ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">总之呢，暂时就是这些了。</div></div><div><div style="width:280px;margin-left:120px;font-size:8px">欢迎去红魔乡Ex玩啊。</div></div>');
                                    ui.create.div(".avatar", ui.dialog).setBackground("akyuu", "character");
                                    ui.create.control("不错不错", step4);
                                }
                            };
                            var step4 = function () {
                                clear();
                                ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">还会继续更新更多关卡的。下次再见？</div></div>');
                                ui.create.div(".avatar", ui.dialog).setBackground("akyuu", "character");
                                ui.create.control("下次再见！", step6);
                            };
                            var step5 = function () {
                                clear();
                                ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">下次欺负蕾米的时候轻一点啊人家也是很累的。</div></div>');
                                ui.create.div(".avatar", ui.dialog).setBackground("akyuu", "character");
                                ui.create.control("哎，好吧", step6);
                            };
                            var step6 = function () {
                                clear();
                                clear2();
                                game.resume();
                            };
                            game.pause();
                            step1();
                        },
                    },
                    // 红魔乡EX
                    dongfang_hongwu_ex: {
                        trigger: {
                            global: "gameStart",
                        },
                        forced: true,
                        popup: false,
                        unique: true,
                        fixed: true,
                        content: function () {
                            "step 0";
                            game.me.storage.bossname = "stg_scarlet_ex";
                            player.hide();
                            game.addVideo("hidePlayer", player);
                            player.delete();
                            game.players.remove(player);
                            game.dead.remove(player);
                            event.target = game.me;
                            game.playnBackgroundMusic("gezi_magicalgirl");
                            //ui.backgroundMusic.currentTime = 137;
                            ui.backgroundMusic.play();
                            ("step 1");
                            var list = [];
                            if (event.target.name == "gezi_marisa") {
                                list = ["gezi_missile", "gezi_bagua"];
                                event.target.removeSkill("gezi_stardust");
                            } else if (event.target.name == "gezi_reimu") {
                                list = ["gezi_needle", "gezi_yinyangyuguishen"];
                                event.target.removeSkill("gezi_mengxiang");
                            }
                            for (var i = 0; i < list.length; i++) {
                                list[i] = ["", "", list[i]];
                            }
                            if (list.length) {
                                event.target.chooseButton(["选择本次闯关使用的装备", [list, "vcard"]], true);
                            }
                            ("step 2");
                            if (result.bool) {
                                event.target.equip(game.createCard(result.links[0][2]));
                                if (result.links[0][2] == "gezi_missile") {
                                    event.target.addSkill("masterspark");
                                }
                                if (result.links[0][2] == "gezi_bagua") {
                                    event.target.addSkill("privateSquare");
                                }
                                if (result.links[0][2] == "gezi_needle") {
                                    event.target.addSkill("fengmo");
                                }
                                if (result.links[0][2] == "gezi_yinyangyuguishen") {
                                    event.target.addSkill("doll");
                                }
                            }
                            ("step 3");
                            // 制作关卡开始的对话框
                            var dialog = ui.create.dialog("EX面<br><br>东方红魔狂");
                            dialog.open();
                            game.pause();
                            var control = ui.create.control("走起！", function () {
                                dialog.close();
                                control.close();
                                game.resume();
                            });
                            lib.init.onfree();
                        },
                    },
                    flaninit: {
                        init: function (player) {
                            game.me.storage.reskill = ["fourof", "starbow", "hongwu_ex_win"];
                            player.addSkill("revive_boss");
                            player.equip(game.createCard("gezi_laevatein"));
                            game.addBossFellow(2, "stg_bat", 0);
                            game.addBossFellow(3, "stg_bat", 0);
                            game.addBossFellow(5, "stg_bat", 0);
                            game.addBossFellow(6, "stg_bat", 0);
                        },
                    },
                    // EX 胜利
                    hongwu_ex_win: {
                        trigger: {
                            player: "die",
                        },
                        forceDie: true,
                        direct: true,
                        init: function (player) {
                            var list = game.filterPlayer();
                            for (var i = 0; i < list.length; i++) {
                                if (list[i] == game.boss) {
                                    list[i].removeSkill("starbow");
                                    list[i].removeSkill("starbow1");
                                    list[i].addSkill("stg_jiesha");
                                    list[i].useSkill("stg_jiesha");
                                }
                            }
                        },
                        content: function () {
                            game.me.storage.stage = "die";
                            if (game.me.name == "gezi_reimu") {
                                game.me.storage.dialog = [
                                    ["gezi_reimu", "看吧？这就是侍奉神灵的人所拥有的力量！", "", "！？不过，你分明就已经没那个力气了呢", "", "我随时都来陪你玩算我求你了，不要来神社里玩", "", "你这的食物是绝对不能拿到人类那里去的", "", "无糖食品也一样！", "所以好孩子的话现在就乖乖地回家睡觉", "", "那不回去也无所谓了，是坏孩子的话", "不过我差不多要回去了", "", "···神社里还放着一个坏孩子在那儿呢", "", "就是你和你姐姐啦！！", "end"],
                                    ["gezi_flandre", "你以为靠那个就能赢了好戏才不过刚开始啊！", "", "是，受不了，连烟都冒不了", "", "哎呀，我本来还想带些蛋糕和红茶作为礼物去的呢", "", "因为控制甜食？", "", "……这里是我家哦？", "", "坏孩子不用回家也可以", "", "坏孩子，你说的是谁？", ""],
                                ];
                            } else if (game.me.name == "gezi_marisa") {
                                game.me.storage.dialog = [
                                    ["gezi_marisa", "啊，满足了吧！", "", "啊啊、可能是骗人的", "不过，我今天也该回去了", "", "？！剩你一个人了的话就会去上吊吗？", "", "She went and hanged herselfand then there were none.", "", "一个有名的童谣", "", "在刚才的攻击中，你消失的时候吧", "", "没命中，真不好意思呐。很遗憾，我擅长的就是躲避弹幕呢", "", "上吊的尸体很丑陋的老老实实地按照那首童谣来啊", "", "喂喂，真的不知道啊？", "She got marriedand then there were none...", "", "给你介绍那个神社的女孩哦", "end"],
                                    ["gezi_flandre", "不敢相信，我竟然会输了……", "", "但是结果最后还是剩下我一个了", "", "为什么？", "", "那些你都是从谁那里听说的啊", "", "我本来预定好最后的那一个人就是你哦？", "", "She died by the bulletand then there were none.", "", "算了，无所谓了反正即使上吊我也不会死", "", "本来歌里唱的？", "", "和谁？", ""],
                                ];
                            }
                            player.addSkill("dongfang_hongwu2");
                            player.useSkill("dongfang_hongwu2");
                        },
                    },
                    /////////////////////////////// 这里开始是正经的角色技能 ////////////////////////////////////////////////////
                    shogon: {
                        init: function (event, character) {
                            var players = game.players;
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].identity == "zhong") {
                                    game.players[i].hide();
                                    game.addVideo("hidePlayer", game.players[i]);
                                    game.players[i].delete();
                                    game.players.remove(game.players[i]);
                                }
                            }
                            game.addBossFellow(6, "stg_maid", 2);
                            game.addBossFellow(2, "stg_maid", 2);
                            game.boss.addSkill("stg_jicai");
                            game.boss.useSkill("stg_jicai");
                        },
                    },
                    patchyspell: {
                        init: function (event, character) {
                            if (game.me.name == "gezi_reimu") {
                                game.boss.addSkill("mercury");
                                game.boss.useSkill("mercury");
                            } else if (game.me.name == "gezi_marisa") {
                                game.boss.addSkill("emerald");
                                game.boss.useSkill("emerald");
                            } else {
                                game.boss.addSkill("waterfairy");
                                game.boss.useSkill("waterfairy");
                            }
                            game.boss.equip(game.createCard("gezi_book"));
                        },
                    },
                    mercury: {
                        audio: 2,
                        infinite: true,
                        spell: ["mercury1"],
                        trigger: {},
                        init: function (player) {
                            var target = game.findPlayer(function (current) {
                                return current.name == "stg_bookshelf";
                            });
                            console.log(target);
                            if (!target) target = player;
                            console.log(target);
                            if (target) {
                                target.equip(game.createCard("stg_goldbook"));
                                target.equip(game.createCard("stg_waterbook"));
                            }
                        },
                        content: function () {
                            player.Fuka();
                            player.say("金＆水符「水银之毒」!");
                        },
                    },
                    mercury1: {
                        trigger: {
                            player: ["useCard", "respondAfter"],
                        },
                        frequent: true,
                        filter: function (event, player) {
                            if (player == _status.currentPhase) return false;
                            if (event.cards2) {
                                for (var i = 0; i < event.cards2.length; i++) {
                                    if (get.color(event.cards2[i]) == "black") return true;
                                }
                            }
                            return false;
                        },
                        content: function () {
                            "step 0";
                            player
                                .chooseTarget(get.prompt("mercury"), function (card, player, target) {
                                    return true;
                                })
                                .set("ai", function (target) {
                                    return get.attitude(_status.event.player, target) < 0;
                                });
                            ("step 1");
                            if (result.target) {
                                result.target.loseHp();
                            }
                        },
                    },
                    emerald: {
                        audio: 2,
                        infinite: true,
                        spell: ["emerald1"],
                        init: function (player) {
                            var target = game.findPlayer(function (current) {
                                return current.name == "stg_bookshelf";
                            });
                            if (!target) target = player;
                            if (target) {
                                target.equip(game.createCard("stg_goldbook"));
                                target.equip(game.createCard("stg_dirtbook"));
                            }
                        },
                        content: function () {
                            player.Fuka();
                            player.say("土＆金符「翡翠巨石」");
                        },
                    },
                    emerald1: {
                        global: "emerald2",
                    },
                    emerald2: {
                        alter: true,
                        mod: {
                            canBeDiscarded: function (card, player, target, event) {
                                if (
                                    get.is.altered("emerald2") &&
                                    get.type(card) == "equip" &&
                                    game.hasPlayer(function (current) {
                                        return current.hasSkill("emerald1") && current.isFriendsOf(player);
                                    })
                                )
                                    return false;
                            },
                            cardDiscardable: function (card, player, target, event) {
                                if (
                                    get.is.altered("emerald2") &&
                                    get.type(card) == "equip" &&
                                    game.hasPlayer(function (current) {
                                        return current.hasSkill("emerald1") && current.isFriendsOf(player);
                                    })
                                )
                                    return false;
                            },
                            canBeGained: function (card, player, target, event) {
                                if (
                                    get.is.altered("emerald2") &&
                                    get.type(card) == "equip" &&
                                    game.hasPlayer(function (current) {
                                        return current.hasSkill("emerald1") && current.isFriendsOf(player);
                                    })
                                )
                                    return false;
                            },
                            cardGainable: function (card, player, target, event) {
                                if (
                                    get.is.altered("emerald2") &&
                                    get.type(card) == "equip" &&
                                    game.hasPlayer(function (current) {
                                        return current.hasSkill("emerald1") && current.isFriendsOf(player);
                                    })
                                )
                                    return false;
                            },
                        },
                    },
                    waterfairy: {
                        audio: 2,
                        infinite: true,
                        spell: ["waterfairy1"],
                        init: function (player) {
                            var target = game.findPlayer(function (current) {
                                return current.name == "stg_bookshelf";
                            });
                            if (!target) target = player;
                            if (target) {
                                target.equip(game.createCard("stg_woodbook"));
                                target.equip(game.createCard("stg_waterbook"));
                            }
                        },
                        content: function () {
                            player.Fuka();
                            player.say("水＆木符「水精灵」");
                        },
                    },
                    waterfairy1: {
                        direct: true,
                        trigger: {
                            player: "phaseEnd",
                        },
                        content: function () {
                            var players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                players[i].drawTo(players[i].getHandcardLimit());
                            }
                        },
                    },
                    gezi_sakuyainit: {
                        init: function (player) {
                            player.equip(game.createCard("stg_watch"));
                            player.equip(game.createCard("gezi_lunadial"));
                            player.equip(game.createCard("stg_deck"));
                            player.addSkill("handcard_max");
                        },
                    },
                    perfectSquare: {
                        audio: 2,
                        infinite: true,
                        spell: ["perfectSquare1"],
                        init: function (player) {
                            player.useSkill("perfectSquare");
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return true;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("[时符]完美空间！");
                        },
                    },
                    perfectSquare1: {
                        audio: 2,
                        forced: true,
                        group: ["perfectSquare2"],
                        trigger: {
                            global: "useCardtoBegin",
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return event.player.countUsed() >= player.lili && event.player != player;
                        },
                        content: function () {
                            trigger.untrigger();
                            trigger.finish();
                            player.logSkill("gezi_world", trigger.player);
                        },
                    },
                    perfectSquare2: {
                        forced: true,
                        trigger: {
                            player: "phaseEnd",
                        },
                        content: function () {
                            player.loselili();
                        },
                    },
                    gungirs: {
                        audio: 2,
                        infinite: true,
                        trigger: {
                            player: "phaseBegin",
                        },
                        spell: ["gezi_gungirs2"],
                        skillAnimation: true,
                        init: function (player) {
                            if (get.mode() == "stg") {
                                player.useSkill("gungirs");
                                game.addBossFellow(2, "stg_bat", 1);
                                game.addBossFellow(8, "stg_bat", 1);
                            }
                        },
                        content: function () {
                            player.equip(game.createCard("gungnir"));
                            player.Fuka();
                        },
                    },
                    gungirs1: {
                        direct: true,
                        trigger: {
                            player: "loseAfter",
                        },
                        filter: function (event, player) {
                            return !player.countCards("e", {
                                name: "gungnir",
                            });
                        },
                        content: function () {
                            player.equip(game.createCard("gungnir"));
                        },
                    },
                    gens: {
                        init: function (player) {
                            player.classList.remove("turnedover");

                            player.addSkill("stg_feise");

                            player.useSkill("stg_feise");
                            player.addSkill("hongwu_win");
                            player.addIncident(game.createCard("gezi_scarlet", "yibianpai", ""));
                            player.removeSkill("scarlet_win");
                        },
                    },
                    saochu: {
                        audio: 2,
                        forced: true,
                        trigger: {
                            player: "phaseEnd",
                        },
                        filter: function () {
                            return true;
                        },
                        content: function () {
                            "step 0";
                            if (player.countCards("he")) player.chooseToDiscard(true);
                            ("step 1");
                            player.draw();
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + 1;
                            },
                        },
                    },

                    stg_watch_skill: {
                        equipSkill: true,
                        forced: true,
                        trigger: {
                            source: "damageEnd",
                        },
                        filter: function () {
                            return true;
                        },
                        content: function () {
                            player.addTempSkill("stg_watch_stop");
                        },
                    },
                    stg_watch_stop: {
                        direct: true,
                        trigger: {
                            player: ["damageBegin", "loseHpBegin", "loseliliBegin"],
                        },
                        filter: function (event, player) {
                            return true;
                        },
                        content: function () {
                            trigger.cancel();
                        },
                    },
                    doll: {
                        audio: 2,
                        spell: ["doll2"],
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
                    },
                    doll2: {
                        audio: 2,
                        trigger: {
                            player: "phaseJieshuEnd",
                        },
                        filter: function (event, player) {
                            return true;
                        },
                        direct: true,
                        content: function () {
                            "step 0";
                            event.count = 0;
                            ("step 1");
                            player.chooseTarget(get.prompt("doll"), function (card, player, target) {
                                return player.canUse(
                                    {
                                        name: "sha",
                                    },
                                    target,
                                    false,
                                );
                            });
                            ("step 2");
                            if (result.bool) {
                                player.logSkill("doll2", result.targets);
                                player.useCard(
                                    {
                                        name: "sha",
                                    },
                                    result.targets[0],
                                    false,
                                );
                                event.count++;
                                if (event.count <= 2) event.goto(1);
                            }
                        },
                    },
                    privateSquare: {
                        audio: 2,
                        roundi: true,
                        priority: 22,
                        spell: ["private2"],
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
                    },
                    private2: {
                        audio: 2,
                        group: ["private3"],
                        forced: true,
                        trigger: {
                            player: "phaseAfter",
                        },
                        content: function () {
                            player.insertPhase();
                        },
                    },
                    private3: {
                        direct: true,
                        trigger: {
                            source: "damageBegin",
                            player: "loseliliBegin",
                        },
                        content: function () {
                            trigger.cancel();
                        },
                    },
                    masterspark: {
                        audio: 2,
                        spell: ["spark1"],
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
                            player.Fuka();
                        },
                        check: function (event, player) {
                            return player.lili > 3;
                        },
                    },
                    spark1: {
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event) {
                            return true;
                        },
                        forced: true,
                        content: function () {
                            trigger.num += player.lili - 1;
                            player.loselili(player.lili - 1);
                        },
                    },
                    fengmo: {
                        audio: 2,
                        spell: ["fengmo1"],
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
                            return player.lili > 3;
                        },
                    },
                    fengmo1: {
                        init: function (player) {
                            var players = game.filterPlayer();
                            players.remove(player);
                            for (var i = 0; i < players.length; i++) {
                                players[i].addTempSkill("fengyin");
                                players[i].addTempSkill("unequip");
                                player.discardPlayerCard(players[i], "he", [1, 1], true);
                                players[i].addTempSkill("lunadial2");
                            }
                        },
                        onremove: function (player) {
                            var players = game.filterPlayer();
                            players.remove(player);
                            for (var i = 0; i < players.length; i++) {
                                players[i].removeSkill("fengyin");
                                players[i].removeSkill("unequip");
                                players[i].removeSkill("lunadial2");
                            }
                        },
                    },
                    xixue: {
                        trigger: {
                            source: "damageEnd",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return game.hasPlayer(function (current) {
                                return current.name == "gezi_remilia" || current.name == "gezi_flandre";
                            });
                        },
                        content: function () {
                            var players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                if (players[i].name == "gezi_remilia" || players[i].name == "gezi_flandre") {
                                    players[i].gainlili();
                                    if (players[i].lili == players[i].maxlili || players[i].node.fuka) players[i].draw();
                                }
                            }
                        },
                    },
                    silent: {
                        audio: 2,
                        infinite: true,
                        trigger: {
                            player: "phaseBegin",
                        },
                        spell: ["silent1"],
                        init: function (player) {
                            if (player.storage.silent1) return;
                            if (get.mode() == "stg") {
                                game.pause();
                                setTimeout(function () {
                                    if (game.me.name == "gezi_reimu") {
                                        player.say("什么啊，怎么又来了？");
                                        setTimeout(function () {
                                            player.say("今天哮喘也没怎么犯，就让你看看我珍藏的魔法吧！");
                                            setTimeout(function () {
                                                game.resume();
                                            }, 2500);
                                        }, 2500);
                                    } else if (game.me.name == "gezi_marisa") {
                                        player.say("什么啊，你又来了啊？");
                                        setTimeout(function () {
                                            player.say("现在不说这个——不论对你还是对妹妹大人，今天都是厄日！");
                                            setTimeout(function () {
                                                game.resume();
                                            }, 2500);
                                        }, 2500);
                                    } else {
                                        player.say("虽然不知道你是做什么来的……");
                                        setTimeout(function () {
                                            player.say("但是你可是挑了错误的时间出现在错误的地方了！");
                                            setTimeout(function () {
                                                game.resume();
                                            }, 2500);
                                        }, 2500);
                                    }
                                }, 0);
                                player.useSkill("silent");
                                game.me.storage.reskill = ["royal"];
                                game.me.storage.reinforce = [];
                                player.addSkill("revive_boss");
                                player.equip(game.createCard("gezi_book"));
                                //ui.boss.style.display = 'initial';
                            }
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("[月神]静寂月神！");
                            if (!player.storage.silent1) {
                                player.storage.silent1 = true;
                            }
                        },
                    },
                    silent1: {
                        audio: 2,
                        trigger: {
                            player: "phaseJieshuEnd",
                        },
                        forced: true,
                        content: function () {
                            "step 0";
                            player
                                .chooseTarget("月光炮目标是？", function (card, player, target) {
                                    return player != target;
                                })
                                .set("ai", function (target) {
                                    return -get.attitude(target, player);
                                });
                            ("step 1");
                            if (result.bool && result.targets) {
                                event.target = result.targets[0];
                                event.target.chooseControl("受到1点伤害", "下一次对" + get.translation(player) + "造成的伤害-1").set("ai", function () {
                                    return "下一次对" + get.translation(player) + "造成的伤害-1";
                                });
                            }
                            ("step 2");
                            if (result.control == "受到1点伤害") {
                                event.target.damage();
                            } else if (result.control == "下一次对" + get.translation(player) + "造成的伤害-1") {
                                event.target.addSkill("silent_negate");
                            }
                        },
                    },
                    silent_negate: {
                        forced: true,
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event) {
                            return event.player.hasSkill("silent1");
                        },
                        content: function () {
                            trigger.num--;
                            player.removeSkill("silent_negate");
                        },
                    },
                    royal: {
                        audio: 2,
                        infinite: true,
                        skillAnimation: true,
                        trigger: {
                            player: "phaseZhunbeiBegin",
                        },
                        spell: ["royal1"],
                        init: function (player) {
                            if (get.mode() == "stg") {
                                player.removeSkill("silent");
                                player.removeSkill("silent1");
                                player.useSkill("royal");
                            }
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("[日符]皇家烈焰！");
                        },
                    },
                    royal1: {
                        audio: 2,
                        forced: true,
                        group: ["royal_die"],
                        trigger: {
                            player: "phaseBegin",
                        },
                        content: function () {
                            "step 0";
                            event.current = player.next;
                            event.players = game.filterPlayer().remove(player);
                            player.line(event.players, "fire");
                            ("step 1");
                            var next = event.current.chooseToRespond({
                                name: "sha",
                            });
                            next.set("ai", function (card) {
                                var evt = _status.event.getParent();
                                if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
                                return 11 - get.value(card);
                            });
                            next.autochoose = lib.filter.autoRespondSha;
                            ("step 2");
                            if (result.bool == false) {
                                event.current.damage();
                            }
                            if (event.current.next != player) {
                                event.current = event.current.next;
                                game.delay(0.5);
                                event.goto(1);
                            }
                        },
                    },
                    royal_die: {
                        trigger: {
                            player: "die",
                        },
                        fixed: true,
                        direct: true,
                        forceDie: true,
                        filter: function () {
                            return get.mode() == "stg";
                        },
                        content: function () {
                            game.me.storage.reskill = ["fourof", "starbow", "hongwu_ex_win"];
                            game.me.storage.reinforce = ["stg_maid", "stg_maid", "stg_maid", "gezi_flandre"];
                            game.me.recover(game.me.maxHp);
                            game.me.storage.fuhuo++;
                            game.log(game.me, "获得了一个残机！");
                        },
                    },
                    fourof: {
                        audio: 2,
                        infinite: true,
                        spell: ["fourof1"],
                        init: function (player) {
                            player.useSkill("fourof");
                        },
                        content: function () {
                            player.Fuka();
                            player.say("[禁忌]四重存在！");
                            ui.background.setBackgroundImage("extension/东方project/gezi_death.jpg");
                        },
                    },
                    fourof1: {
                        init: function (event, character) {
                            var list = game.filterPlayer();
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].identity == "zhong") list[i].die();
                            }
                            lib.character["gezi_flandre"] = ["female", "wei", 2, ["stg_kuangyan", "flandimmune"], []];
                            lib.character["gezi_flandre"][4].push("ext:东方project/gezi_flandre.jpg");
                            game.addBossFellow(2, "gezi_flandre", 0);
                            game.addBossFellow(5, "gezi_flandre", 0);
                            game.addBossFellow(7, "gezi_flandre", 0);
                        },
                        content: function () {},
                    },
                    flandimmune: {
                        direct: true,
                        trigger: {
                            source: "damageBegin",
                        },
                        filter: function (event, player) {
                            return event.player.name == "gezi_flandre";
                        },
                        content: function () {
                            trigger.cancel();
                        },
                    },
                    flandie: {
                        trigger: {
                            player: "die",
                        },
                        direct: true,
                        forceDie: true,
                        filter: function () {
                            return get.mode() == "stg";
                        },
                        content: function () {
                            game.me.recover();
                        },
                    },
                    starbow: {
                        audio: 2,
                        infinite: true,
                        spell: ["starbow1"],
                        init: function (player) {
                            var list = game.filterPlayer();
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].name == "gezi_flandre" && !list[i].hasSkill("starbow")) {
                                    if (list[i].lili == 0) list[i].gainlili();
                                    list[i].removeSkill("fourof");
                                    list[i].removeSkill("fourof1");
                                    list[i].addSkill("starbow");
                                    list[i].useSkill("starbow");
                                }
                            }
                            if (!player.hasSkill("starbow1") && player == game.boss) {
                                player.classList.remove("turnedover");
                                player.removeSkill("fourof");
                                player.removeSkill("fourof1");
                                player.useSkill("starbow");
                            }
                        },
                        content: function () {
                            player.Fuka();
                            player.say;
                        },
                        intro: {
                            content: function (storage, player) {
                                if (!storage) return null;
                                return "所有角色不能使用" + get.translation(storage) + "花色的牌";
                            },
                        },
                    },
                    starbow1: {
                        trigger: {
                            player: "phaseBegin",
                        },
                        global: "starbow2",
                        group: "starbow3",
                        forced: true,
                        filter: function () {
                            return true;
                        },
                        content: function () {
                            "step 0";
                            player.judge();
                            ("step 1");
                            player.storage.starbow = get.suit(result.card);
                            player.syncStorage("starbow");
                            player.markSkill("starbow");
                        },
                    },
                    starbow2: {
                        mod: {
                            cardEnabled: function (card, player) {
                                if (
                                    _status.event.skill != "starbow3" &&
                                    game.hasPlayer(function (current) {
                                        return current.storage.starbow && get.suit(card) == current.storage.starbow;
                                    })
                                )
                                    return false;
                            },
                            cardUsable: function (card, player) {
                                if (
                                    _status.event.skill != "starbow3" &&
                                    game.hasPlayer(function (current) {
                                        return current.storage.starbow && get.suit(card) == current.storage.starbow;
                                    })
                                )
                                    return false;
                            },
                            cardRespondable: function (card, player) {
                                if (
                                    _status.event.skill != "starbow3" &&
                                    game.hasPlayer(function (current) {
                                        return current.storage.starbow && get.suit(card) == current.storage.starbow;
                                    })
                                )
                                    return false;
                            },
                            cardSavable: function (card, player) {
                                if (
                                    _status.event.skill != "starbow3" &&
                                    game.hasPlayer(function (current) {
                                        return current.storage.starbow && get.suit(card) == current.storage.starbow;
                                    })
                                )
                                    return false;
                            },
                        },
                    },
                    starbow3: {
                        audio: 2,
                        enable: ["chooseToUse", "chooseToRespond"],
                        filterCard: function (card, player) {
                            return player.storage.starbow && get.suit(card) == player.storage.starbow;
                        },
                        viewAs: {
                            name: "sha",
                        },
                        check: function () {
                            return 1;
                        },
                        ai: {
                            effect: {
                                target: function (card, player, target, current) {
                                    if (get.tag(card, "respondSha") && current < 0) return 0.6;
                                },
                            },
                            respondSha: true,
                            order: 4,
                            useful: -1,
                            value: -1,
                        },
                    },
                    stg_jicai: {
                        audio: "ext:东方project:2",
                        trigger: {
                            player: "phaseBegin",
                        },
                        priority: 22,
                        spell: ["gezi_jicai2"],
                        infinite: true,
                        check: function (event, player) {
                            return false;
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("<符卡>极彩风暴！");
                        },
                    },
                    stg_feise: {
                        audio: "ext:东方project:2",
                        trigger: {
                            player: "phaseBegin",
                        },
                        spell: ["gezi_feise2"],
                        infinite: true,
                        priority: 22,
                        check: function (event, player) {
                            return false;
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("【符卡】绯色幻想乡！");
                        },
                    },
                    stg_xianzhe: {
                        audio: "ext:东方project:2",
                        trigger: {
                            player: "phaseBegin",
                        },
                        spell: ["gezi_xianzhe2"],
                        infinite: true,
                        priority: 22,
                        check: function (event, player) {
                            return false;
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.say("<符卡>贤者之石！");
                        },
                    },
                    stg_kuangyan: {
                        audio: 2,
                        trigger: {
                            player: ["phaseUseBegin", "damageEnd"],
                        },
                        filter: function (event, player) {
                            return true;
                        },
                        forced: true,
                        direct: true,
                        content: function () {
                            "step 0";
                            event.players = game.filterPlayer(function (current) {
                                return current != player && get.distance(player, current, "attack") <= 1;
                            });
                            event.num = 0;
                            player.line(event.players, "red");
                            player.logSkill("gezi_kuangyan", event.players);
                            ("step 1");
                            if (event.num < event.players.length) {
                                var target = event.players[event.num];
                                player.discardPlayerCard(target, "hej", 1, true);
                                if (target.name == "gezi_remilia") {
                                    if (player.isTurnedOver()) player.say("姐姐大人不喜欢一起玩吗……？");
                                    else player.say("这么就碎掉的话，一点也不好玩呢……");
                                }
                                event.num++;
                                event.redo();
                            }
                            ("step 2");
                            for (var i = 0; i < event.players.length; i++) {
                                if (event.players[i].countCards("h") == 0) event.players[i].damage();
                            }
                        },
                        ai: {
                            threaten: 1.2,
                            maixie_defend: true,
                            effect: {
                                target: function (card, player, target) {
                                    if (!target.hasFriend()) return false;
                                    if (player.hasSkillTag("jueqing", false, target)) return;
                                    var num = game.countPlayer(function (current) {
                                        if (current != target && get.distance(target, current, "attack") <= 1) {
                                            if (get.attitude(player, current) > 0) return -2;
                                            else return 2;
                                        }
                                        return 0;
                                    });
                                    if (get.tag(card, "damage")) {
                                        if (num >= 2) return [1, -1, 1, 1];
                                        if (num > 0 && num < 2) return [1, -0.2, 1, 0.2];
                                        if (num <= 0 && num > -2) return [1, 0.2, 1, -0.2];
                                        if (num <= -2) return [1, 1, 1, -1];
                                    }
                                },
                            },
                        },
                        group: ["flandimmune", "flandie"],
                    },
                    stg_jiesha: {
                        audio: 2,
                        trigger: {
                            player: "phaseBegin",
                        },
                        spell: ["gezi_jiesha2"],
                        infinite: true,
                        priority: 22,
                        check: function (event, player) {
                            return false;
                        },
                        filter: function (event, player) {
                            if (player.node.fuka) return false;
                            return player.lili > 0;
                        },
                        content: function () {
                            player.Fuka();
                            player.addnSkill("gezi_jiesha4");
                            player.say("【符卡】之后就一个人都没有了吗！");
                        },
                    },
                },
                forbidstg: [
                    ["stg_scarlet", "gezi_reimu", "gezi_marisa"],
                    ["stg_scarlet_ex", "gezi_reimu", "gezi_marisa"],
                    ["stg_sakura", "gezi_reimu", "gezi_marisa", "gezi_sakuya"],
                ],
                translate: {
                    zhu: "BOSS",
                    cai: "自",
                    zhong: "从",

                    cai2: "自机",
                    zhong2: "从属",
                    zhu2: "Boss",
                    cai_win: "<u>胜利条件：</u>最终关的BOSS，最大的黑幕死亡！",
                    cai_lose: "<u>失败条件：</u>你死亡",
                    zhong_win: "<u>胜利条件：</u>自机死亡",
                    zhong_lose: "<u>失败条件：</u>无",
                    zhu_win: "<u>胜利条件：</u>那个该死的自机快点死亡！",
                    zhu_lose: "<u>失败条件：</u>最终的黑幕死亡",

                    handcard_max: "手牌上限",
                    stg_scarlet: "红魔乡",
                    stg_scarlet_ex: "红魔乡EX",
                    stg_next: "敬请期待",
                    stg_maoyu: "毛玉",
                    stg_yousei: "妖精",
                    stg_maid: "妖精女仆",
                    stg_bat: "蝙蝠",
                    _tanpai: "明置异变",
                    _tanpai_bg: "变",

                    saochu: "扫除",
                    saochu_info: "锁定技，你的手牌上限+1；结束阶段：若你有牌，弃置一张牌；然后，无论是否弃置了牌，摸一张牌。",
                    juguang: "聚光",
                    juguang_info: "锁定技，跳过你的所有阶段，消耗1点灵力，视为使用一张【杀】；你的装备上限+2。",
                    xixue: "吸血",
                    xixue_info: "锁定技，你造成伤害后：令蕾米莉亚或芙兰朵露获得1点灵力；然后若其灵力等于上限，或其为符卡状态，令其摸一张牌。",
                    revive_boss: "阶段切换！",
                    masterspark: "极限",
                    spark1: "极限火花",
                    masterspark_info: "符卡技1<br><li>你的回合开始时，可以消耗一点灵力发动符卡，直到回合结束。<br><li>效果：你造成伤害时，将灵力值消耗至1：令该伤害+X（X为消耗灵力量）。",
                    finalspark: "最终火花",
                    fengmo: "封魔",
                    fengmo_info: "符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动符卡，直到回合结束。<br><li>符卡发动时，弃置所有其他角色各一张牌；其他角色不能使用/打出手牌，封印技能和装备技能。",
                    fengmo1: "封魔阵",
                    fengmo1_info: "",
                    stg_watch: "血月时针",
                    stg_watch_skill: "血月时针",
                    stg_watch_info: "你造成伤害后，防止你的灵力和体力扣减，直到回合结束。",
                    doll: "结界",
                    doll_info: "符卡技2<br><li>你的回合开始时，可以消耗两点灵力发动符卡，直到回合结束。<br><li>结束阶段，你可以视为使用一张【杀】；然后你可以重复此流程两次。",
                    doll2: "二重结界",
                    privateSquare: "黑洞",
                    privateSquare_info: "符卡技2<永续>2<br><li>你的回合开始时，可以消耗两点灵力发动符卡，直到你的下个回合开始。<br><li>防止你造成的伤害；防止你的灵力扣减；当前回合结束后，进行一个额外的回合。",
                    private2: "黑洞边缘",
                    stg_mingyun: "命运之光",
                    stg_mingyun_info: "你于摸牌阶段摸到此牌后，对你使用；你观看牌堆，获得其中一张牌。<br><u>追加效果：一张判定牌生效前，你可以打出此牌替换之。</u>",
                    stg_lingji: "灵击",
                    stg_lingji_info: "出牌阶段，或你受到伤害前，对你使用；除你以外的角色不能使用/打出手牌，防止目标受到的伤害，直到回合结束。",
                    stg_pohuai: "破坏之果",
                    stg_pohuai_info: "出牌阶段，对一名角色使用；目标将手牌数和灵力值调整至X（X为目标本局游戏击杀的角色数）。<br><u>追加效果：你可以将此牌当作【弹幕狂欢】使用。</u>",
                    stg_fengyin: "封印解除",
                    stg_fengyin_info: "出牌阶段，对自己使用；你创建并获得一张禁忌牌。",

                    mercury: "金水",
                    mercury1: "水银之毒",

                    mercury_info: "符卡技0(极意)<br><li>你于回合外使用/打出黑色牌后，可以令一名角色失去1点体力。",
                    emerald: "土金",
                    emerald1: "翡翠巨石",

                    emerald_info: "符卡技0(极意)<br><li>与你相同阵营的角色的装备牌不能被弃置/获得。",
                    //waterfairy: "水木",
                    waterfairy: "水精灵",

                    waterfairy_info: "符卡技0(极意)<br><li>结束阶段，所有角色将手牌数补至手牌上限。",

                    perfectSquare: "时符",
                    perfectSquare1: "完美空间",

                    perfectSquare_info: "符卡技0(极意)<br><li>其他角色每回合使用牌时，若其本回合已使用过X张牌，取消该牌（X为你的灵力）；结束阶段，你消耗1点灵力。",
                    mode_extension_stg_card_config: "闯关卡牌",
                    mode_extension_stg_character_config: "闯关角色",

                    gungirs: "神枪「冈格尼尔」",

                    gungirs_info: "符卡技（0）<极意> 符卡发动时，你创建并装备一张【冈格尼尔】；你失去装备区内的【冈格尼尔】后，创建一张【冈格尼尔】并装备之。",

                    dongfang_hongwu: "红雾异变",
                    dongfang_hongwu_info: "幻想乡被红雾包围了，去红雾源头的洋馆找出元凶吧！<br><br> 关卡数：6 <br><br> 复活机会：1       第3关和第5关后追加1次。",

                    dongfang_hongwu_ex: "红魔乡EX关卡",
                    dongfang_hongwu_ex_info: "异变结束后，蕾米来到博丽神社玩，然后因为回不去而赖着不走了。<br>去红魔馆检查一下情况（来把蕾米赶走）吧！<br><br> 关卡数：1 <br><br> 复活机会：0       道中击破后追加1次。",
                    silent: "月符",
                    silent_info: "符卡技0(极意)<br><li>结束阶段，你令一名其他角色选择一项：受到1点伤害，或令其对你造成的下一次伤害值-1。",
                    silent1: "寂静月神",

                    royal: "日符",
                    royal1: "皇家烈焰",
                    royal_info: "符卡技0(极意)<br><li>准备阶段，所有其他角色选择一项：打出一张【杀】，或受到1点伤害。",

                    fourof: "禁忌",
                    fourof1: "四重存在",
                    fourof_info: "符卡技0(极意)<br><li>符卡发动时，召唤3个分身；这些分身的【狂宴】视为锁定技，防止这些分身对你或其他分身造成的伤害，且这些分身死亡时，玩家回复1点体力。",
                    starbow: "禁弹",
                    starbow1: "星弧破碎",
                    starbow3: "禁弹「星弧破碎」",
                    starbow_info: "符卡技0(极意)<br><li>准备阶段，你进行一次判定：其他角色不能使用/打出判定牌花色的牌，你的判定牌花色的牌均视为【杀】，直到符卡结束或你的准备阶段。",
                    stg_jicai: "极彩",
                    stg_jicai_info: "符卡技0(极意)<br><li>你的回合开始时，可以发动符卡技，直到符卡结束。符卡结束时你死亡。<br><li>效果：你使用/打出牌时，可以弃置一名角色区域内一张牌；若该牌颜色与使用/打出的牌颜色相同，其摸一张牌。",
                    stg_feise: "绯色",
                    stg_feise_info: "符卡技0(极意)<br><li>你的回合开始时，可以发动符卡技，直到符卡结束。符卡结束时你死亡。<br><li>效果：其他角色的结束阶段，若其对其以外的角色使用过牌，你可以消耗1点灵力，对其造成1点伤害。",
                    stg_kuangyan: "狂宴",
                    stg_kuangyan_info: "锁定技，出牌阶段开始时，或你受到伤害后，你可以获得一点灵力并弃置攻击范围内的所有其他角色区域内各一张牌；<br><li>然后，对其中没有手牌的角色各造成1点伤害；<br><li>若你死亡，令玩家回复一点体力。",
                    stg_jiesha: "皆杀",
                    stg_jiesha_info: "符卡技0(极意)<br><li>永久效果：你的攻击范围+2。<br><li>符卡效果：你造成伤害时，封印目标非锁定技直到当前回合结束。<br><li>若目标已被封印，你需选择一项：令受伤角色：<br><li>1.扣减1点体力上限，直到你死亡；<br><li>2. 弃置一个有牌的区域内所有牌；<br><li>3.将灵力调整至1。",
                },
                get: {
                    rawAttitude: function (from, to) {
                        var num = to.identity == "zhong" ? 10 : 10;
                        return from.side === to.side ? num : -num;
                    },
                },
            },
            {
                translate: "闯关",
                config: {
                    free_choose: {
                        name: "自由选将",
                        init: true,
                        frequent: true,
                        onclick: function (bool) {
                            game.saveConfig("free_choose", bool, this._link.config.mode);
                            if (!_status.event.getParent().showConfig && !_status.event.showConfig) return;
                            if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
                            else if (ui.cheat2 && !get.config("free_choose")) {
                                ui.cheat2.close();
                                delete ui.cheat2;
                            }
                        },
                    },
                    ladder_reset: {
                        name: "重置闯关数据",
                        onclick: function () {
                            var node = this;
                            if (node._clearing) {
                                if (lib.config.gameRecord.stg) {
                                    lib.config.gameRecord.stg = {
                                        data: {},
                                    };
                                    game.saveConfig("gameRecord", lib.config.gameRecord);
                                }
                                clearTimeout(node._clearing);
                                node.firstChild.innerHTML = "重置闯关数据";
                                delete node._clearing;
                                return;
                            }
                            node.firstChild.innerHTML = "单击以确认 (3)";
                            node._clearing = setTimeout(function () {
                                node.firstChild.innerHTML = "单击以确认 (2)";
                                node._clearing = setTimeout(function () {
                                    node.firstChild.innerHTML = "单击以确认 (1)";
                                    node._clearing = setTimeout(function () {
                                        node.firstChild.innerHTML = "重置闯关数据";
                                        delete node._clearing;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        },
                        clear: true,
                    },
                },
                onremove: function () {
                    game.clearModeConfig("stg");
                },
            },
        );
        image: ["extension/东方project/stg.jpg"];
    }
}
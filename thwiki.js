KJZR = function (lib, game, ui, get, ai, _status) {
    game.KJimport("extension", function (lib, game, ui, get, ai, _status) {
        return {
            name: "thwiki", content: function (config, pack) {
            }, precontent: function () {
                game.import('card',function(lib,game,ui,get,ai,_status){
                    var thwiki = {
                        name: 'thwiki',
                        connect:true,
                        card:{
                        },
                        skill:{
                        },
                        translate:{
                        },
                    };
                    for (var i in thwiki.card) {
                        var str = "<img src=" + lib.assetURL + 'extension/东方project/' + i + '.png' + " width='100%' height='100%'>";
                        thwiki.translate[i + '_info'] = str;
                    };
                    for (var i in thwiki.card) {
                        thwiki.card[i].fullimage = true;
                        thwiki.card[i].image = 'ext:东方project/' + i + '.png';
                    };
                    for (var i in thwiki.translate) {
                        if (i.indexOf('thwiki_tz_') != -1) {
                            var str = i.slice(12);
                            for (var j in thwiki.translate) {
                                if (j.indexOf(str) != -1 && j.indexOf('_info') != -1) {
                                    thwiki.translate[j] += thwiki.translate[i];
                                };
                            };
                        };
                    };
                    return thwiki;
                });
                lib.translate['thwiki_card_config'] = '车万';
                lib.config.all.cards.push('thwiki');
                if (!lib.config.cards.contains('thwiki')) lib.config.cards.push('thwiki');
            }, help: {}, config: {}, package: {}, files: { "character": [], "card": [], "skill": [] }
        }
    })
}
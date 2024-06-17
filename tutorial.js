'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
	return {
		name:'tutorial',
		start:function(){
		    "step 0"
		    ui.css.fuka_style = lib.init.css(lib.assetURL + 'extension/东方project', 'fuka');
		    ui.css.lili_style = lib.init.css(lib.assetURL + 'extension/东方project', 'official');
			if(!lib.config.re_tutorial){
				ui.arena.classList.add('only_dialog');
			}
			"step 1"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
			}
			else{
				game.prepareArena(2);
				if(!lib.config.re_tutorial){
					game.delay();
				}
			}
			// 这里是新手向导w
			// 或许可以换到图鉴那儿去？ 或者过程中切到图鉴那里。
			// 反正是要设置的。就是不是现在。
			"step 2"
			_status.re_tutorial=true;
			lib.init.onfree();
			game.saveConfig('version',lib.version);
			var clear=function(){
				ui.dialog.close();
				while(ui.controls.length) ui.controls[0].close();
			};
			var clear2=function(){
				ui.arena.classList.remove('only_dialog');
			};
			var step1=function(){
				var dialog = ui.create.dialog('欢迎来到无名杀！<br>请问您的名字是什么？<br><br><br><div><div style="text-align:center;font-size:14px">这个名字以后可以修改。</div>');
				var text2=document.createElement('input');
					text2.style.width='200px';
					text2.style.height='20px';
					text2.style.padding='0';
					text2.style.position='relative';
					text2.style.top='80px';
					text2.style.resize='none';
					text2.style.border='none';
					text2.style.borderRadius='2px';
					text2.style.boxShadow='rgba(0, 0, 0, 0.2) 0 0 0 1px';
					text2.value=lib.config.connect_nickname; 
					dialog.appendChild(text2);
				ui.auto.hide();
				ui.create.control('写好了',function(){
					game.saveConfig('connect_nickname',text2.value);
					game.saveConfig('connect_nickname',text2.value,'connect');
					step15();
				});
			}
			var step15=function(){
				clear();
				ui.create.dialog('欢迎您，'+lib.config.connect_nickname+'! <br>这是第一次来到无名杀吗？');
				ui.auto.hide();
				ui.create.control('怎么可能',function(){
					clear();
					clear2();
					ui.create.dialog('欢迎回来！<br>祝你在无名杀玩的愉快！');
					ui.dialog.add('<div class="text center">你可以在左上角的选项-其它中重置新手向导');
					setTimeout(function(){
						game.resume();
					}, 2500);
				});
				ui.create.control('是的',step2);
			}
			var step2=function(){
				if(!lib.config.phonelayout){
					clear();
					ui.create.dialog('如果你在使用手机，可能会觉得按钮有点小'+
					'，将布局改成移动可以使按钮变大');
					ui.dialog.add('<div class="text center">此设置可以随时在选项-外观-布局中变更。');
					var lcontrol=ui.create.control('使用移动布局',function(){
						if(lib.config.phonelayout){
							ui.control.firstChild.firstChild.innerHTML='使用移动布局';
							game.saveConfig('phonelayout',false);
							lib.init.layout('mobile');
						}
						else{
							ui.control.firstChild.firstChild.innerHTML='使用默认布局';
							game.saveConfig('phonelayout',true);
							lib.init.layout('mobile');
						}
					});
					ui.create.control('就这样吧！',step3);
				}
				else{
					step3();
				}
			};
			var step3=function(){
				if(lib.config.touchscreen){
					clear();
					ui.create.dialog('触屏模式中，下划可以显示菜单，上划可以切换托管，双指单击可以暂停');
					ui.dialog.add('<div class="text center">你可以在选项-游戏-中更改手势设置');
					ui.create.control('没问题！',step4);
				}
				else{
					step4();
				}
			};
			var step4=function(){
				clear();
				ui.click.configMenu();
				ui.control.classList.add('noclick_click_important');
				ui.control.style.top='calc(100% - 105px)';
				var text = ui.create.dialog('在菜单中，可以调整各种各样的设置。<br> 模式设置，体系设置，角色皮肤，禁止角色，游戏布局，应有尽有的哟！');
				ui.create.control('按这里继续哟',function(){
					ui.click.configMenu();
					ui.click.menuTab('选项');
					text = ui.create.dialog('如果你感到游戏较卡，可以开启流畅模式，或者下降游戏速度。<br> 在[特效]选项中也可以选择游戏中表现哪些特效。');
					ui.controls[0].replace('知道了',function(){
						ui.click.configMenu();
						ui.click.menuTab('选项');
						text = ui.create.dialog('在[外观]中可以设置游戏的背景图，配色主题，和布局。<br>在[界面]中可以选择游戏界面中显示哪些按键和信息。<br>在[音效]中可以调整音量大小和角色及卡牌的音效。');
						ui.controls[0].replace('知道了知道了',function(){
							ui.click.configMenu();
							ui.click.menuTab('角色');
							text = ui.create.dialog('在角色或卡牌一栏中，单击角色/卡牌可以将其禁用，在角色/卡牌上悬空或右键可以查看描述，双击角色可以查看角色简介，和切换角色皮肤。');
							ui.controls[0].replace('这选项可真多',function(){
									ui.click.configMenu();
									ui.click.menuTab('其它');
									text = ui.create.dialog('在[其他]中可以检查更新，下载素材，查看你的战绩，和观看游戏录像。');
									ui.controls[0].replace('好了能玩了没',function(){
										ui.window.classList.remove('noclick_important');
										ui.control.classList.remove('noclick_click_important');
										ui.control.style.top='';
										step5();
									});
								});
							});
						});
					});
			};
			var step5=function(){
				clear();
				ui.create.dialog('如果还有其它问题，在其它-帮助里可以找到查看。<br>流星夜的具体规则在图鉴模式也可以查看哦<br>其它模式也是非常有趣的哦。');
				ui.create.control('所以能玩了没',function(){
					clear();
					clear2();
					ui.create.dialog('那么就到此了！<br>祝你在无名杀游玩愉快！');
					ui.dialog.add('<div class="text center">你可以在左上角的选项-其它中重置新手向导');
					setTimeout(function(){
						game.resume();
					}, 2500);
				})
			};
			if (!lib.device || lib.config.asset_version){
				game.pause();
				step1();
			}
			// 然后新手向导结束……
			"step 3"
			if(typeof _status.re_tutorial=='function'){
				_status.re_tutorial();
			}
			delete _status.re_tutorial;
			for (var i in lib.cardPack.mode_tutorial) {
			    lib.card[i] = lib.cardPack.mode_tutorial[i];
			}
			"step 4"
			for(var i=0;i<game.players.length;i++){
				game.players[i].getId();
			}
			game.chooseCharacter();
			"step 5"
			if(game.players.length==2){
				game.showIdentity(true);
				var map={};
				for(var i in lib.playerOL){
					map[i]=lib.playerOL[i].identity;
				}
				game.broadcast(function(map){
					for(var i in map){
						lib.playerOL[i].identity=map[i];
						lib.playerOL[i].setIdentity();
						lib.playerOL[i].ai.shown=1;
					}
				},map);
			}
			game.zhu.ai.shown=1;
			if(game.zhu2){
				game.zhong=game.zhu;
				game.zhu=game.zhu2;
				delete game.zhu2;
			}
			game.syncState();
			event.trigger('gameStart');

			var players=get.players(lib.sort.position);
			var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name,
					name2:players[i].name2,
					identity:players[i].identity
				});
			}
			//_status.videoInited=true,
			//game.addVideo('init',null,info);
			ui.auto.hide();
			var top = [ game.createCard('sha', 'club', 12),
						game.createCard('sha', 'spade', 7),
						game.createCard('sha', 'spade', 2),
						game.createCard('sha', 'spade', 12),
						game.createCard('shan', 'heart', 11),
						game.createCard('shan', 'diamond', 7),
                        game.createCard('tao', 'heart', 8),
						game.createCard('tao', 'heart', 8),
						game.createCard('tao', 'heart', 8),
						game.createCard('shan', 'heart', 4),
						game.createCard('sha', 'spade', 6), 
						game.createCard('gezi_ibuki', 'spade', 2),
						game.createCard('gezi_lingguang', 'heart', 5), 
						game.createCard('shan', 'diamond', 3),
						];
			for(var i=0;i<top.length;i++){
                ui.cardPile.insertBefore(top[i],ui.cardPile.firstChild);
            }
			game.phaseLoop(game.me);
		},
		game:{
			getState:function(){
				var state={};
				for(var i in lib.playerOL){
					var player=lib.playerOL[i];
					state[i]={identity:player.identity};
					if(player==game.zhu){
						state[i].zhu=player.isZhu?true:false;
					}
					if(player==game.zhong){
						state[i].zhong=true;
					}
					if(player.special_identity){
						state[i].special_identity=player.special_identity;
					}
					state[i].shown=player.ai.shown;
				}
				return state;
			},
			updateState:function(state){
				for(var i in state){
					var player=lib.playerOL[i];
					if(player){
						player.identity=state[i].identity;
						if(state[i].special_identity){
							player.special_identity=state[i].special_identity;
							if(player.node.dieidentity){
								player.node.dieidentity.innerHTML=get.translation(state[i].special_identity);
								player.node.identity.firstChild.innerHTML=get.translation(state[i].special_identity+'_bg');
							}
						}
						if(typeof state[i].zhu=='boolean'){
							game.zhu=player;
							player.isZhu=state[i].zhu;
						}
						if(state[i].zhong){
							game.zhong=player;
						}
						player.ai.shown=state[i].shown;
					}
				}
			},
			getVideoName:function(){
				var str=get.translation(game.me.name);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var name=[
					str,
					get.cnNumber(get.playerNumber())+'人'+
						get.translation(lib.config.mode)+' - '+lib.translate[game.me.identity+'2']
				];
				return name;
			},
			showIdentity:function(me){
				for(var i=0;i<game.players.length;i++){
					game.players[i].node.identity.classList.remove('guessing');
					game.players[i].identityShown=true;
					game.players[i].ai.shown=1;
					game.players[i].setIdentity(game.players[i].identity);
					if(game.players[i].special_identity){
						game.players[i].node.identity.firstChild.innerHTML=get.translation(game.players[i].special_identity+'_bg');
					}
					if(game.players[i].identity=='zhu'){
						game.players[i].isZhu=true;
					}
				}
				if(_status.clickingidentity){
					for(var i=0;i<_status.clickingidentity[1].length;i++){
						_status.clickingidentity[1][i].delete();
						_status.clickingidentity[1][i].style.transform='';
					}
					delete _status.clickingidentity;
				}
			},
			checkResult:function(){
				if(_status.brawl&&_status.brawl.checkResult){
					_status.brawl.checkResult();
					return;
				}
				if(!game.zhu){
					if(get.population('fan')==0){
						switch(game.me.identity){
							case 'fan':game.over(false);break;
							case 'zhong':game.over(true);break;
							default:game.over();break;
						}
					}
					else if(get.population('zhong')==0){
						switch(game.me.identity){
							case 'fan':game.over(true);break;
							case 'zhong':game.over(false);break;
							default:game.over();break;
						}
					}
					return;
				}
				if(game.zhu.isAlive()&&get.population('fan')+get.population('nei')>0) return;
				if(game.zhong){
					game.zhong.identity='zhong';
				}
				game.showIdentity();
				if(game.me.identity=='zhu'||game.me.identity=='zhong'){
					if(game.zhu.classList.contains('dead')){
						game.over(false);
					}
					else{
						game.over(true);
					}
				}
				else if(game.me.identity=='nei'){
					if(game.players.length==1&&game.me.isAlive()){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}
				else{
					if((get.population('fan')+get.population('zhong')>0||get.population('nei')>1)&&
						game.zhu.classList.contains('dead')){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}
			},
			chooseCharacter:function(){
				var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.addPlayer=function(player){
					var list=lib.config.mode_config.identity.identity[game.players.length-3].slice(0);
					var list2=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);
					for(var i=0;i<list.length;i++) list2.remove(list[i]);
					player.identity=list2[0];
					player.setIdentity('cai');
				};
				next.removePlayer=function(){
					return game.players.randomGet(game.me,game.zhu);
				};
				next.ai=function(player,list,list2,back){
					if(_status.brawl&&_status.brawl.chooseCharacterAi){
						if(_status.brawl.chooseCharacterAi(player,list,list2,back)!==false){
							return;
						}
					}
					else if(player.identity=='zhu'){
						list2.randomSort();
						var choice,choice2;
						if(!_status.event.zhongmode&&Math.random()-0.8<0&&list2.length){
							choice=list2[0];
							choice2=list[0];
							if(choice2==choice){
								choice2=list[1];
							}
						}
						else{
							choice=list[0];
							choice2=list[1];
						}
						if(get.config('double_character')){
							player.init(choice,choice2);
						}
						else{
							player.init(choice);
						}
						if(game.players.length>4){
							player.hp++;
							player.maxHp++;
							player.update();
						}
					}
					else{
						if(get.config('double_character')){
							player.init(list[0],list[1]);
						}
						else{
							player.init(list[0]);
						}
					}
					if(back){
						list.remove(player.name);
						list.remove(player.name2);
						for(var i=0;i<list.length;i++){
							back.push(list[i]);
						}
					}
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var list;
					var list2=[];
					var list3=[];
					var identityList;
					var chosen=lib.config.continue_name||[];
					game.saveConfig('continue_name');
					event.chosen=chosen;
					identityList=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);

					var addSetting=function(dialog){
						dialog.add('选择身份').classList.add('add-setting');
						var table=document.createElement('div');
						table.classList.add('add-setting');
						table.style.margin='0';
						table.style.width='100%';
						table.style.position='relative';
						var listi;
						if(event.zhongmode){
							listi=['random','zhu','mingzhong','zhong','nei','fan'];
						}
						else{
							listi=['random','zhu','zhong','nei','fan'];
						}

						for(var i=0;i<listi.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.link=listi[i];
							if(td.link===game.me.identity){
								td.classList.add('bluebg');
							}
							table.appendChild(td);
							td.innerHTML='<span>'+get.translation(listi[i]+'2')+'</span>';
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								_status.tempNoButton=true;
								setTimeout(function(){
									_status.tempNoButton=false;
								},500);
								var link=this.link;
								if(game.zhu.name){
									if(link!='random'){
										_status.event.parent.fixedseat=get.distance(game.me,game.zhu,'absolute');
									}
									game.zhu.uninit();
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								current=seats.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								if(link=='random'){
									if(event.zhongmode){
										link=['zhu','zhong','nei','fan','mingzhong'].randomGet();
									}
									else{
										link=['zhu','zhong','nei','fan'].randomGet();
									}
									for(var i=0;i<this.parentNode.childElementCount;i++){
										if(this.parentNode.childNodes[i].link==link){
											this.parentNode.childNodes[i].classList.add('bluebg');
										}
									}
								}
								else{
									this.classList.add('bluebg');
								}
								num=get.config('choice_'+link);
								if(event.zhongmode){
									num=6;
									if(link=='zhu'||link=='nei'||link=='mingzhong'){
										num=8;
									}
								}
								_status.event.parent.swapnodialog=function(dialog,list){
									var buttons=ui.create.div('.buttons');
									var node=dialog.buttons[0].parentNode;
									dialog.buttons=ui.create.buttons(list,'character',buttons);
									dialog.content.insertBefore(buttons,node);
									buttons.animate('start');
									node.remove();
									game.uncheck();
									game.check();
									for(var i=0;i<seats.childElementCount;i++){
										if(get.distance(game.zhu,game.me,'absolute')===seats.childNodes[i].link){
											seats.childNodes[i].classList.add('bluebg');
										}
									}
								}
								_status.event=_status.event.parent;
								_status.event.step=0;
								_status.event.identity=link;
								if(link!=(event.zhongmode?'mingzhong':'zhu')){
									seats.previousSibling.style.display='';
									seats.style.display='';
								}
								else{
									seats.previousSibling.style.display='none';
									seats.style.display='none';
								}
								game.resume();
							});
						}
						dialog.content.appendChild(table);

						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('div');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=2;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(game.zhu,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(game.zhu,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								for(var i=0;i<game.players.length;i++){
									if(get.distance(game.players[i],game.me,'absolute')==this.link){
										game.swapSeat(game.zhu,game.players[i],false);return;
									}
								}
							});
						}
						dialog.content.appendChild(seats);
						if(game.me==game.zhu){
							seats.previousSibling.style.display='none';
							seats.style.display='none';
						}

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;
					event.list=[];
					identityList.randomSort();
					if(event.identity){
						identityList.remove(event.identity);
						identityList.unshift(event.identity);
						if(event.fixedseat){
							var zhuIdentity=(_status.mode=='zhong')?'mingzhong':'zhu';
							if(zhuIdentity!=event.identity){
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat,0,zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					}
					else if(_status.mode!='zhong'&&(!_status.brawl||!_status.brawl.identityShown)){
						var ban_identity=[];
						ban_identity.push(get.config('ban_identity')||'off');
						if(ban_identity[0]!='off'){
							ban_identity.push(get.config('ban_identity2')||'off');
							if(ban_identity[1]!='off'){
								ban_identity.push(get.config('ban_identity3')||'off');
							}
						}
						ban_identity.remove('off');
						if(ban_identity.length){
							var identityList2=identityList.slice(0);
							for(var i=0;i<ban_identity.length;i++){
								while(identityList2.remove(ban_identity[i]));
							}
							ban_identity=identityList2.randomGet();
							identityList.remove(ban_identity);
							identityList.splice(game.players.indexOf(game.me),0,ban_identity);
						}
					}
					for(i=0;i<game.players.length;i++){
						if(_status.brawl&&_status.brawl.identityShown){
							if(game.players[i].identity=='zhu') game.zhu=game.players[i];
							game.players[i].identityShown=true;
						}
						else{
							game.players[i].node.identity.classList.add('guessing');
							game.players[i].identity=identityList[i];
							game.players[i].setIdentity('cai');
							if(event.zhongmode){
								if(identityList[i]=='mingzhong'){
									game.zhu=game.players[i];
								}
								else if(identityList[i]=='zhu'){
									game.zhu2=game.players[i];
								}
							}
							else{
								if(identityList[i]=='zhu'){
									game.zhu=game.players[i];
								}
							}
							game.players[i].identityShown=false;
						}
					}

					if(!game.zhu) game.zhu=game.me;
					else{
						game.zhu.setIdentity();
						game.zhu.identityShown=true;
						game.zhu.isZhu=(game.zhu.identity=='zhu');
						game.zhu.node.identity.classList.remove('guessing');
						game.me.setIdentity();
						game.me.node.identity.classList.remove('guessing');
					}
					for(i in lib.character){
						if(chosen.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						if (!i || !lib.character[i]) continue;
						event.list.push(i);
						if(lib.character[i][4]&&lib.character[i][4].contains('zhu')){
							list2.push(i);
						}
						else{
							list3.push(i);
						}
					}
					event.list.randomSort();
					list3.randomSort();
						// 在场景和残局模式下，这个init是额外的（角色在choosecharacterbefore里就已经选好的话，在这里会再选一次），
						// 只针对game.me。副作用是会清掉玩家的choosecharacterbefore里获得的所有技能，包括技能牌效果。
						// 目前已删掉，检测是如果game.me已经有名字了（已经有选角色了）就不会再生成。
					game.me.init('gezi_reimu');
					game.me.addSkill('tutorial');
					game.me.addSkill('tutorial1');
					game.me.addSkill('tutorial2');
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
						    lib.character['zigui'] = ['female', '5', 3, [],[]];
						    lib.character['zigui'][4].push('ext:东方project/zigui.jpg');
							game.players[i].init('zigui');
						}
					}
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);
				});
			},
		},
		translate:{
			zhu:"黑幕",
			zhong:"异",
			mingzhong:"异",
			nei:"路",
			fan:"自",
			cai:"猜",
			zhu2:"黑幕",
			zhong2:"异变",
			nei2:"路人",
			fan2:"自机",
			random2: "随机",
			zigui: "子规",
			gezi_lingguang: "灵光一闪",
			gezi_lingguang_info: "出牌阶段，对你使用：目标摸两张牌。</br><u>强化(-1)：贴上一张技能牌。</u>",
			zhu_win:'<u>胜利条件：</u>所有自机与路人坠机',
			zhu_lose:'<u>失败条件：</u>黑幕坠机',
			zhong_win:'<u>胜利条件：</u>黑幕胜利',
			zhong_lose:'<u>失败条件：</u>黑幕坠机',
			fan_win:'<u>胜利条件：</u>黑幕坠机',
			fan_lose:'<u>失败条件：</u>所有自机与路人坠机',
			nei_win:'<u>胜利条件：</u>所有其他角色坠机',
			nei_lose:'<u>失败条件：</u>你坠机',
		},
		element:{
		    player: {
		        init: function (player) {
		                if (!player.node.lili) {
		                    player.node.lili = ui.create.div('.hp.actcount', player);
		                }
		                if (typeof player.lili !== 'number') {
		                    player.lili = 3;
		                }
		                if (typeof player.maxlili !== 'number') {
		                    player.maxlili = 5;
		                }
		                player.updatelili(); 
		        },
				$dieAfter:function(){
					if(_status.video) return;
					if(!this.node.dieidentity){
						var str;
						if(this.special_identity){
							str=get.translation(this.special_identity);
						}
						else{
							str=get.translation(this.identity+'2');
						}
						var node=ui.create.div('.damage.dieidentity',str,this);
						ui.refresh(node);
						node.style.opacity=1;
						this.node.dieidentity=node;
					}
					var trans=this.style.transform;
					if(trans){
						if(trans.indexOf('rotateY')!=-1){
							this.node.dieidentity.style.transform='rotateY(180deg)';
						}
						else if(trans.indexOf('rotateX')!=-1){
							this.node.dieidentity.style.transform='rotateX(180deg)';
						}
						else{
							this.node.dieidentity.style.transform='';
						}
					}
					else{
						this.node.dieidentity.style.transform='';
					}
				},
				dieAfter:function(source){
					game.saveConfig('re_tutorial',false);
					game.checkResult();
				},
				showIdentity:function(){
					this.node.identity.classList.remove('guessing');
					this.identityShown=true;
					this.ai.shown=1;
					this.setIdentity();
					if(this.special_identity){
						this.node.identity.firstChild.innerHTML=get.translation(game.players[i].special_identity+'_bg');
					}
					if(this.identity=='zhu'){
						this.isZhu=true;
					}
					else{
						delete this.isZhu;
					}
					if(_status.clickingidentity){
						for(var i=0;i<_status.clickingidentity[1].length;i++){
							_status.clickingidentity[1][i].delete();
							_status.clickingidentity[1][i].style.transform='';
						}
						delete _status.clickingidentity;
					}
				}
			}
		},
		card: {
		    gezi_lingguang: {
		        audio: true,
		        fullskin: true,
		        image: 'ext:/东方project/gezi_lingguang.png',
		        type: 'trick',
		        enable: true,
		        enhance: 1,
		        selectTarget: -1,
		        filterTarget: function (card, player, target) {
		            return target == player;
		        },
		        modTarget: true,
		        content: function () {
		            if (target.name == 'gezi_cirno') target.say('我是最强的！');
		            if (player.storage._enhance) {
		                for (var i = 0; i < player.storage._enhance; i++) {
		                    if (player.hasSkill('tutorial4')) {
		                        target.addJudgen(game.createCard('gezi_lianji', '', ''));
		                    } else {
		                        target.useSkill('gezi_jinengpai_use');
		                    }
		                }
		            }
		            target.draw(2);
		        },
		        ai: {
		            basic: {
		                order: 7.2,
		                useful: 4,
		                value: 9.2
		            },
		            result: {
		                target: 2,
		            },
		            tag: {
		                draw: 2
		            }
		        }
		    }
		},
		get:{
			rawAttitude:function(from,to){
				var x=0,num=0,temp,i;
				if(_status.ai.customAttitude){
					for(i=0;i<_status.ai.customAttitude.length;i++){
						temp=_status.ai.customAttitude[i](from,to);
						if(temp!=undefined){
							x+=temp;
							num++;
						}
					}
				}
				if(num){
					return x/num;
				}
				var difficulty=0;
				if(to==game.me) difficulty=2-get.difficulty();
				if(from==to||to.identityShown||(from.storage.dongcha==to)){
					return get.realAttitude(from,to)+difficulty*1.5;
				}
				else{
					if(from.identity=='zhong'&&to.ai.shown==0&&from.ai.tempIgnore&&
						!from.ai.tempIgnore.contains(to)){
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].ai.shown==0&&game.players[i].identity=='fan'){
								return -0.1+difficulty*1.5;
							}
						}
					}
					var aishown=to.ai.shown;
					if(to.identity=='nei'&&to.ai.shown<1&&(to.ai.identity_mark=='fan'||to.ai.identity_mark=='zhong')){
						aishown=0.5;
					}
					else if(aishown==0&&to.identity!='fan'&&to.identity!='zhu'){
						var fanshown=true;
						for(var i=0;i<game.players.length;i++){
							if(game.players[i].identity=='fan'&&game.players[i].ai.shown==0&&game.players[i]!=from){
								fanshown=false;break;
							}
						}
						if(fanshown) aishown=0.3;
					}
					return get.realAttitude(from,to)*aishown+difficulty*1.5;
				}
			},
			realAttitude:function(from,to){
				if(!game.zhu){
					if(from.identity=='nei'||to.identity=='nei') return -1;
					if(from.identity==to.identity) return 6;
					return -6;
				}
				var situation=get.situation();
				var identity=from.identity;
				var identity2=to.identity;
				if(identity2=='zhu'&&!to.isZhu){
					identity2='zhong';
					if(from==to) return 10;
				}
				if(from!=to&&to.identity=='nei'&&to.ai.shown<1&&(to.ai.identity_mark=='fan'||to.ai.identity_mark=='zhong')){
					identity2=to.ai.identity_mark;
				}
				if(from.identity!='nei'&&from!=to&&get.population('fan')==0&&identity2=='zhong'){
					for(var i=0;i<game.players.length;i++){
						if(game.players[i].identity=='nei'&&
						game.players[i].ai.identity_mark=='zhong'&&
						game.players[i].ai.shown<1){
							identity2='nei';break;
						}
					}
				}
				var zhongmode=false;
				if(!game.zhu.isZhu){
					zhongmode=true;
				}
				switch(identity){
					case 'zhu':
						switch(identity2){
							case 'zhu': return 10;
							case 'zhong':case 'mingzhong': return 6;
							case 'nei':
								if(game.players.length==2) return -10;
								if(to.identity=='zhong') return 0;
								if(get.population('fan')==0){
									if(to.ai.identity_mark=='zhong'&&to.ai.shown<1) return 0;
									return -0.5;
								}
								if(zhongmode&&to.ai.sizhong&&to.ai.shown<1) return 6;
								if(get.population('fan')==1&&get.population('nei')==1&&game.players.length==3){
									var fan;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='fan'){
											fan=game.players[i];break;
										}
									}
									if(fan){
										if(to.hp>1&&to.hp>fan.hp&&to.countCards('he')>fan.countCards('he')){
											return -3;
										}
									}
									return 0;
								}
								if(situation>1) return 0;
								return Math.min(3,get.population('fan'));
							case 'fan':
								if(get.population('fan')==1&&get.population('nei')==1&&game.players.length==3){
									var nei;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='nei'){
											nei=game.players[i];break;
										}
									}
									if(nei){
										if(nei.hp>1&&nei.hp>to.hp&&nei.countCards('he')>to.countCards('he')){
											return 0;
										}
									}
									return -3;
								}
								return -4;
						}
						break;
					case 'zhong':case 'mingzhong':
						switch(identity2){
							case 'zhu': return 10;
							case 'zhong':case 'mingzhong': return 4;
							case 'nei':
								if(get.population('fan')==0) return -2;
								if(zhongmode&&to.ai.sizhong&&to.ai.shown<1) return 6;
								return Math.min(3,-situation);
							case 'fan': return -8;
						}
						break;
					case 'nei':
						if(identity2=='zhu'&&game.players.length==2) return -10;
						var strategy=get.aiStrategy();
						if(strategy==4){
							if(from==to) return 10;
							return 0;
						}
						var num;
						switch(identity2){
							case 'zhu':
								if(strategy==6) return -1;
								if(strategy==5) return 10;
								if(to.hp<=0) return 10;
								if(get.population('fan')==1){
									var fan;
									for(var i=0;i<game.players.length;i++){
										if(game.players[i].identity=='fan'){
											fan=game.players[i];break;
										}
									}
									if(fan){
										if(to.hp>1&&to.hp>fan.hp&&to.countCards('he')>fan.countCards('he')){
											return -3;
										}
									}
									return 0;
								}
								else{
									if(situation>1||get.population('fan')==0) num=0;
									else num=get.population('fan')+Math.max(0,3-game.zhu.hp);
								}
								if(strategy==2) num--;
								if(strategy==3) num++;
								return num;
							case 'zhong':
								if(strategy==5) return Math.min(0,-situation);
								if(strategy==6) return Math.max(-1,-situation);
								if(get.population('fan')==0) num=-5;
								else if(situation<=0) num=0;
								else if(game.zhu&&game.zhu.hp<2) num=0;
								else if(game.zhu&&game.zhu.hp==2) num=-1;
								else if(game.zhu&&game.zhu.hp<=2&&situation>1) num=-1;
								else num=-2;
								if(zhongmode&&situation<2){
									num=4;
								}
								if(strategy==2) num--;
								if(strategy==3) num++;
								return num;
							case 'nei':
								if(from==to) return 10;
								if(from.ai.friend.contains(to)) return 5;
								if(get.population('fan')+get.population('zhong')>0) return 0;
								return -5;
							case 'fan':
								if(strategy==5) return Math.max(-1,situation);
								if(strategy==6) return Math.min(0,situation);
								if((game.zhu&&game.zhu.hp<=2&&situation<0)||situation<-1) num=-3;
								else if(situation<0||get.population('zhong')+get.population('mingzhong')==0) num=-2;
								else if((game.zhu&&game.zhu.hp>=4&&situation>0)||situation>1) num=1;
								else num=0;
								if(strategy==2) num++;
								if(strategy==3) num--;
								return num;
						}
						break;
					case 'fan':
						switch(identity2){
							case 'zhu':
								if(get.population('nei')>0){
									if(situation==1) return -6;
									if(situation>1) return -5;
								}
								return -8;
							case 'zhong':
								if(!zhongmode&&game.zhu.hp>=3&&to.hp==1){
									return -10;
								}
								return -7;
							case 'nei':
								if(zhongmode&&to.ai.sizhong) return -7;
								if(get.population('fan')==1) return 0;
								if(get.population('zhong')+get.population('mingzhong')==0) return -7;
								if(game.zhu&&game.zhu.hp<=2) return -1;
								return Math.min(3,situation);
							case 'fan': return 5;
						}
				}
			},
			situation:function(absolute){
				var i,j,player;
				var zhuzhong=0,total=0,zhu,fan=0;
				for(i=0;i<game.players.length;i++){
					player=game.players[i];
					var php=player.hp;
					if(player.hasSkill('benghuai')&&php>4){
						php=4;
					}
					else if(php>6){
						php=6;
					}
					j=player.countCards('h')+player.countCards('e')*1.5+php*2;
					if(player.identity=='zhu'){
						zhuzhong+=j*1.2+5;
						total+=j*1.2+5;
						zhu=j;
					}
					else if(player.identity=='zhong'||player.identity=='mingzhong'){
						zhuzhong+=j*0.8+3;
						total+=j*0.8+3;
					}
					else if(player.identity=='fan'){
						zhuzhong-=j+4;
						total+=j+4;
						fan+=j+4;
					}
				}
				if(absolute) return zhuzhong;
				var result=parseInt(10*Math.abs(zhuzhong/total));
				if(zhuzhong<0) result=-result;
				if(!game.zhong){
					if(zhu<12&&fan>30) result--;
					if(zhu<6&&fan>15) result--;
					if(zhu<4) result--;
				}
				return result;
			},
		},
		skill:{
			tutorial:{
				direct:true,
				trigger:{global:'gameStart'},
				content:function(){
					'step 0'
					player.draw(4);
					'step 1'
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step0=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">欢迎来到无名杀，'+lib.config.connect_nickname+'!<br>我是新手导师子规。</div>');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('你好！',step1);
					}
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">在东方流星夜的规则中，每个人有体力值，和灵力值（那些白色的星星）。<br>体力值就是生命，掉到0就会阵亡。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step2);
					};
					var step2=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">灵力值则是能力条。符卡技，部分技能，以及强化卡牌都需要用到灵力值。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step3);
					};
					var step3=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">看到对面那个3血5灵力的我了吗？这次的目标就是把我的体力降到0。<br>加油！');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step0();
				},
			},
			tutorial1:{
				direct:true,
				trigger:{player:['phaseDrawBegin', 'phaseUseBegin', 'phaseDiscardBegin', 'phaseDiscardAfter']},
				content:function(){
					if(_status.event.endButton) _status.event.endButton.close();
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">每个回合，首先是回合开始，准备阶段，判定阶段和摸牌阶段。<br>符卡技一般在回合开始阶段发动。<br>摸牌阶段，你从牌堆摸两张牌。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step2=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">摸牌阶段后，进入你的出牌阶段。<br>出牌阶段是使用牌和技能的阶段。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step3);
					};
					var step3=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">我们首先来用一张【杀】吧。<br>要使用牌，先点击牌，点击目标（这次是坐在对面的我），然后点击确定。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step4=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">出牌阶段结束后，进入弃牌阶段。在弃牌阶段，你需要把手牌弃到与手牌上限（一般为体力值）相同数量的手牌数。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step6=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">弃牌阶段之后，是结束阶段和回合结束。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step7);
					};
					var step7=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">按时机发动的技能，会在可以发动技能的时机出现对话框。<br>灵梦的【阴阳】就是在结束阶段发动的技能。<br>选择确定，然后选择摸一张牌吧。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					if (trigger.name == 'phaseDraw'){
						step1();
					} else if (trigger.name == 'phaseUse'){
						step2();
						player.addSkill('tutorial3');
					} else if (trigger.name == 'phaseDiscard' && trigger.finished == false){
						step4();
					} else if (trigger.name == 'phaseDiscard' && trigger.finished == true){
						step6();
						player.removeSkill('tutorial1');
						player.removeSkill('tutorial2');
						player.addSkill('tutorial6');
					}
				},
			},
			tutorial2:{
				direct:true,
				trigger:{player:'useCardAfter'},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">通过【灵光一闪】的强化，我们贴上了一张技能牌！<br>当你只有技能牌而无其它牌时，你相当于无牌，请注意。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step4);
					};
					var step2=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">啊，疼疼疼疼疼——<br>那啥，我们来装备【伊吹瓢】。<br>这是一张装备牌，装备后会进入你的装备区。<br>以自己为目标的牌，点一下就可以使用了。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step3=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">你可以任意使用装备区里的装备技能。<br>同种装备牌只能装备1张，多了就要弃。<br>那么，来试着发动一下【伊吹瓢】的主动技能吧。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step4=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">技能牌与装备牌很类似。你可以任意使用技能牌区的技能，而且最多同时装备3张，多了就要弃。<br>用右键点一下技能牌或者悬浮就可以查看技能了。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step6);
					};
					var step6=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">虽然【连击】让我们可以多出一张【杀】，但是我们已经没有牌可以出了，就让我们结束回合吧。<br>点一下左边的【结束回合】。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					if (trigger.card.name == 'sha'){
						step2();
						player.removeSkill('tutorial3');
						player.addSkill('tutorial5');
					} else if (trigger.card.name == 'gezi_lingguang'){
						step1();
						player.removeSkill('tutorial4');
					} else if (trigger.card.name == 'gezi_ibuki'){
						step3();
					}
				},
			},
			tutorial3:{
				direct:true,
				mod:{
					cardEnabled:function(card, player){
						if (card.name != 'sha') return false;
					},
					cardUsable:function(card, player){
						if (card.name != 'sha') return false;
					},
					cardRespondable:function(card, player){
						if (card.name != 'sha') return false;
					},
					cardSavable:function(card, player){
						if (card.name != 'sha') return false;
					},
				},
			},
			tutorial4:{
				direct:true,
				trigger:{player:'useCardBefore'},
				filter:function(event, player){
					return event.card.name == 'gezi_lingguang';
				},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step0=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">有的牌有强化效果：消耗一定量的灵力，来执行额外的效果。<br>额外的，多次强化会多次执行强化效果。<br>【突击采访】多次强化时对方会多次获得“弱点揭露”状态。<br></div>');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step1);
					}
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">【灵光一闪】的强化，是消耗1点灵力，贴上一张技能牌。<br>我们既然灵力这么多，就来发动一下吧！');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step0();
				},
				mod:{
					cardEnabled:function(card, player){
						if (card.name != 'gezi_lingguang') return false;
					},
					cardUsable:function(card, player){
						if (card.name != 'gezi_lingguang') return false;
					},
					cardRespondable:function(card, player){
						if (card.name != 'gezi_lingguang') return false;
					},
					cardSavable:function(card, player){
						if (card.name != 'gezi_lingguang') return false;
					},
				},
			},
			tutorial5:{
				direct:true,
				trigger:{player:'useSkillAfter'},
				filter:function(event, player){
					if (event.skill){
						return event.skill == 'ibuki_skill';
					}
					return false;
				},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step0=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">出牌阶段使用的技能，都是通过这样按键来使用的。<br>一回合一次的技能，一回合只能使用一次呢。<br>要查看技能，只需要在你的角色/装备牌上右键或者悬浮就可以看到了。</div>');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step1);
					}
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">伊吹瓢的效果让我们获得了1点灵力并摸了一张牌！<br>除了技能效果以外，使用有“灵力+1”的牌（比如这张伊吹瓢）也能获得灵力。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step2);
					};
					var step2=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">那么来使用【灵光一闪】吧。<br>以自己为目标的牌只要点一下就行了。<br>你可以右击或长按查看卡牌简介。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step0();
					player.removeSkill('tutorial5');
					player.addSkill('tutorial4');
				},
				mod:{
					cardEnabled:function(card, player){
						if (card.name != 'gezi_ibuki') return false;
					},
					cardUsable:function(card, player){
						if (card.name != 'gezi_ibuki') return false;
					},
					cardRespondable:function(card, player){
						if (card.name != 'gezi_ibuki') return false;
					},
					cardSavable:function(card, player){
						if (card.name != 'gezi_ibuki') return false;
					},
				},
			},
			tutorial6:{
				direct:true,
				trigger:{global:'phaseBegin'},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step0=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">既然是个刻板的回合制游戏，你的回合结束后，就到我的回合了！<br>哈哈哈哈！</div>');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					}
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step0();
					player.removeSkill('tutorial6');
					player.addSkill('tutorial7');
				},
			},
			tutorial7:{
				direct:true,
				trigger:{target:'useCardToBegin'},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step0=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">【杀】过来了！<br>基本牌和无懈可击就是用来，在回合外防御别人的攻击的。<br>【杀】的对应防御牌是【闪】，来华丽的【闪】掉我的攻击吧！</div>');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					}
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					step0();
					player.removeSkill('tutorial7');
					player.addSkill('tutorial8');
				},
			},
			tutorial8:{
				direct:true,
				trigger:{player:['phaseBeginStart', 'phaseUseBegin']},
				content:function(){
					var clear=function(){
						if (ui.dialog) ui.dialog.close();
						while(ui.controls.length) ui.controls[0].close();
					};
					var clear2=function(){
						ui.arena.classList.remove('only_dialog');
					};
					var step1=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">又到你的回合了呢。<br>符卡技的发动，是在自己的回合开始时，你灵力大于消耗值时，消耗标注量的灵力值发动。<br>等于是不能用的哦。<br>部分符卡技有自己的时机。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step2);
					};
					var step2=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">符卡在发动期间，可以任意使用描述里的技能。<br>来试一下，发动【梦想封印】！');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step3=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">符卡技在发动后，在当前回合结束时失去效果。<br>部分符卡技有自己的结束时机。<br>符卡技发动期间，灵力值变为0的话，也会失去效果。<br>若你开启了灵力虚弱，灵力为0时无法造成伤害。');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step4);
					};
					var step4=function(){
						clear();
						ui.create.dialog('<div><div style="width:280px;margin-left:120px;font-size:18px">那么，你该学的都已经学完了。用两张【杀】结束游戏吧！');
						ui.create.div('.avatar',ui.dialog).setBackground('zigui','character');
						ui.create.control('继续',step5);
					};
					var step5=function(){
						clear();
						clear2();
						game.resume();
					};
					game.pause();
					if (trigger.name == 'phasing'){
						step1();
					} else if (trigger.name == 'phaseUse'){
						step3();
					}
				},
			},
		},
		help:{
		}
	};
});

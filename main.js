'use strict';
const serp = require("serp");
const Keyv = require('keyv');
const os = require('os');
const {prefix, token, startchannel, ownerid, watch, log1, log2, splace} = require('./config.json');
const moneys = new Keyv(`sqlite://${splace}/money.sqlite`, {table: 'money'});
const levels = new Keyv(`sqlite://${splace}/levels.sqlite`, { table: 'levels' });
const ytdl = require('ytdl-core')
const Discord = require('discord.js');
const { ReactionController } = require('discord.js-reaction-controller')
const client = new Discord.Client();
client.login(token);
setInterval(function () {
  client.user.setActivity(`${prefix}help | ${client.guilds.cache.size}guilds | ${watch}`, { type: 'WATCHING' })
    .catch(console.error);
  setTimeout(wait, 5000)
}, 10000)
function wait(){
  let r = client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)
  client.user.setActivity(`${prefix}help | ${r}users | ${watch}`, { type: 'WATCHING' })
  .catch(console.error);
}
client.on('ready', async() => {
  console.log('-----------');
  console.log(`${client.user.tag}としてログインしました。`);
	console.log('**botが正常に開始しました。**');
  console.log('-----------');
  client.user.setActivity(`${prefix}help | ${client.guilds.cache.size}guilds | ${watch}`, { type: 'WATCHING' })
    .then(presence => console.log(`アクテビティが正常に${presence.activities[0].name}へとセットされました。`))
    .catch(console.error);
});
client.on('guildMemberAdd', member => {
  client.channels.cache.get(startchannel).send(
    `${member.guild.name}に${member.user.tag} が参加しました。`
  )
})
client.on('guildMemberRemove', member => {
  client.channels.cache.get(startchannel).send(
    `${member.guild.name}から${member.user.tag} が退出しました。`
  )
})
client.on('message', async message => {
  if (message.author.id == "834062809142657055" && (message.content.includes('@here') || message.content.includes('@everyone'))){
    message.delete()
  }
  if (message.author.id == "302050872383242240") {
    if (message.embeds[0].color == "2406327" &&message.embeds[0].url == "https://disboard.org/" &&(message.embeds[0].description.match(/表示順をアップしたよ/) || message.embeds[0].description.match(/Bump done/) || message.embeds[0].description.match(/Bump effectué/) || message.embeds[0].description.match(/Bump fatto/) || message.embeds[0].description.match(/Podbito serwer/) || message.embeds[0].description.match(/Успешно поднято/) || message.embeds[0].description.match(/갱신했어/) || message.embeds[0].description.match(/Patlatma tamamlandı/))) {
      const noti = await message.channel.send({
        embed: {title: "Bumpが実行されました！",description:"再度実行可能になったらお知らせします。\n(再起動後は反応できません。)", color: 7506394}
      });
      noti.delete({ timeout: 7200000 });
      setTimeout(() => {message.channel.send({embed: {title: "Bumpできます！",description: "コマンド`!d bump`を送信できます。",color: 7506394}});}, 7200000);
    }else if(message.embeds[0].color == "15420513" &&message.embeds[0].url == "https://disboard.org/" && (message.embeds[0].description.match(/このサーバーを上げられるようになるまで/) || message.embeds[0].description.match(/あなたがサーバーを上げられるようになるまで/))){
      var splcontent_a = message.embeds[0].description.split("と");
      var splcontent_b = splcontent_a[1].split("分");
      var waittime_bump = splcontent_b[0];
      message.channel.send({embed: {title: "Bumpに失敗したようです…",description: waittime_bump + "分後にもう一度お試しください。",color: 7506394}});
    }
  }
})
client.on('message', async message => {
  if(message.author.bot) return;
  const level = (await levels.get(message.author.id)) || { count: 0, level: 0};
  level.count += 1;
  if (level.count >= leveler(level.level)) {
    level.count = 0;
    level.level += 1;
    message.reply(`、レベルが${level.level}に上がりました。`)
  }
  levels.set(message.author.id, level);
  if(!message.content.startsWith(prefix)) return;
  let channel = message.channel;
  let channel2 = message.member.voice.channel
  let author = message.author.username;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
  if(command == 'help'){
    if(!args.length){
      const page1 = new Discord.MessageEmbed()
        .setColor('#0099ff')
	      .setTitle('help/bot関連')
        .setDescription('リアクションでページ切り替えができます。\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)')
        .addFields(
          { name: `${prefix}bot`, value: 'Glow-bot関連のurlを送信します。'},
          { name: `${prefix}discord`, value: 'サポートサーバーの招待リンクを送信します。'},
          { name: `${prefix}help <コマンド名>`, value: 'helpを表示することができます。'},
          { name: `${prefix}invite`, value: 'botの招待リンクを出します。'},
          { name: `${prefix}invite2`, value: 'テストbotの招待リンクを出します。'},
          { name: `${prefix}log`, value: 'botの更新内容を表示します。'},
          { name: `${prefix}ping`, value: 'botのpingを送信します。'}
        )
	      .setTimestamp()
	      .setFooter(`コマンドの詳細は${prefix}help <コマンド名>からご確認ください。`);
      const page2 = new Discord.MessageEmbed()
        .setColor('#0099ff')
	      .setTitle('help/サーバー管理関連')
        .setDescription('リアクションでページ切り替えができます。\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)')
        .addFields(
          { name: `${prefix}ban <メンション>`, value: '管理人はbanできます。'},
          { name: `${prefix}banlist`, value: 'ban者のリストを表示します。'},
          { name: `${prefix}help <コマンド名>`, value: 'helpを表示することができます。'},
          { name: `${prefix}kick <メンション>`, value: '管理人はkickできます。'},
          { name: `${prefix}undoban <id>`, value: 'banの解除をします'}
        )
	      .setTimestamp()
	      .setFooter(`コマンドの詳細は${prefix}help <コマンド名>からご確認ください。`);
      const page3 = new Discord.MessageEmbed()
        .setColor('#0099ff')
	      .setTitle('help/娯楽関連')
        .setDescription('リアクションでページ切り替えができます。\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)')
        .addFields(
          { name: `${prefix}avatar <メンション>`, value: 'アイコンを取得します。'},
          { name: `${prefix}bank <いろいろ>`, value: 'お金の引き出しや残量確認を行えます。'},
          { name: `${prefix}help <コマンド名>`, value: 'helpを表示することができます。'},
          { name: `${prefix}omikuji`, value: 'おみくじを引きます。'},
          { name: `${prefix}play <url>`, value: '音楽を再生します。'},
          { name: `${prefix}repeat <メッセージ>`, value: 'おうむ返しします。'},
          { name: `${prefix}rn <最小値> <最大値>`, value: '最小値と最大値の間からランダムな数を取得します。'},
          { name: `${prefix}slot <掛け金>`, value: 'スロットを回します。'},
          { name: `ぐー、ちょき、ぱー`, value: 'じゃんけんできます。'}
        )
	        .setTimestamp()
	        .setFooter(`コマンドの詳細は${prefix}help <コマンド名>からご確認ください。`);
        const page4 = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('help/検索機能関連')
          .setDescription('リアクションでページ切り替えができます。\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)')
          .addFields(
            { name: `${prefix}googlesearch <キーワード>`, value: 'Googleで検索します。'},
            { name: `${prefix}youtubesearch <キーワード>`, value: 'Yotubeで検索します。'},
            { name: `${prefix}customsearch <サイトリンク> <キーワード>`, value: '指定されたサイトで検索します。'},
            { name: `${prefix}nyannkodbsearch <キーワード>`, value: 'にゃんこ大戦争データーベースで検索します。'},
            { name: `${prefix}wikipediasearch <キーワード>`, value: 'Wikipediaで検索します。'},
            { name: `${prefix}githubsearch <キーワード>`, value: 'Githubで検索します。'}
          )
          .setTimestamp()
          .setFooter(`コマンドの詳細は${prefix}help <コマンド名>からご確認ください。`);
        const page5 = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('help/bot管理関連(使用できるのはbot管理者のみ)')
          .setDescription('リアクションでページ切り替えができます。\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)')
          .addFields(
            { name: `${prefix}send <チャンネルid> <メッセージ>`, value: '指定したチャンネルにメッセージを送ります。'},
            { name: `${prefix}serverls`, value: 'botの参加しているサーバーのリストを出します。'},
            { name: `${prefix}stop`, value: 'botをストップします。'}
          )
          .setTimestamp()
          .setFooter(`コマンドの詳細は${prefix}help <コマンド名>からご確認ください。`);
      const controller = new ReactionController(client)
      controller.addPages([page1,page2,page3,page4,page5])
      controller.sendTo(message.channel, message.author).catch(console.error)
    }else if(args[0] === 'invite' || args[0] === 'inv'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}inv`},fields: [{name: `${prefix}invite`,value: 'Glow-botを他のサーバーに導入したい時にどうぞ。'}]}})
    }else if(args[0] === 'invite2' || args[0] === 'inv2'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}inv2`},fields: [{name: `${prefix}invite2`,value: 'Glow-botのβ版を他のサーバーに導入したい時にどうぞ。'}]}})
    }else if(args[0] === 'slot' || args[0] === 'sl'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}sl`},fields: [{name: `${prefix}slot <掛け金>`,value: 'スロットを回せます。'}]}})
    }else if(args[0] === 'ping'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),fields: [{name: `${prefix}ping`,value: 'botのpingを取得します。'}]}})
    }else if(args[0] === 'bot'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),fields: [{name: `${prefix}bot`,value: 'Glow-bot関連のurlを送信します。' }]}})
    }else if(args[0] === 'discord' || args[0] === 'dis'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}dis`},fields: [{name: `${prefix}discord`,value: 'Glow-botのサポートサーバーのurlを送信します。'}]}})
    }else if(args[0] === 'stop'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: `${prefix}stop`,value: 'Googlefanのみ使用可能です。botが止まります。'}]}})
    }else if(args[0] === 'rn' || args[0] === 'getrandom'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}getrandom`},fields: [{name: `${prefix}rn <最小値> <最大値>`,value: '乱数を返します。'}]}})
    }else if(args[0] === 'play' || args[0] === 'p'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}p`},fields: [{name: `${prefix}play <url>`,value: '音楽を再生します。'}]}})
    }else if(args[0] === 'じゃんけん'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),fields: [{name: `じゃんけん`,value: 'ぐー、ちょき、ぱー(カタカナでも可)'}]}})
    }else if(args[0] === 'avatar' || args[0] === 'avt'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}avt`},fields: [{name: `${prefix}avatar <メンション>`,value: 'アイコンを送信します。'}]}})
    }else if(args[0] === 'listban' || args[0] === 'banlist' || args[0] === 'banls'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}listban${prefix}banls`},fields: [{name: `${prefix}banlist`,value: 'ban者のリストを送信します。'}]}})
    }else if(args[0] === 'ban'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {fields: [{name: `${prefix}ban <メンション>`,value: 'op所持者はbanできます。'}]}}})
    }else if(args[0] === 'kick'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {fields: [{name: `${prefix}kick <メンション>`,value: 'op所持者はkickできます。'}]}}})
    }else if(args[0] === 'repeat' || args[0] === 'rp'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}rp`},fields: [{name: `${prefix}repeat <メッセージ>`,value: 'おうむ返しします。'}]}})
    }else if(args[0] === 'send'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: `${prefix}send <チャンネルid> <メッセージ>`,value: '指定されたチャンネルにメッセージを送信します。'}]}})
    }else if(args[0] === 'omikuji' || args[0] === 'omi'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}omi`},fields: [{name: `${prefix}omikuji`,value: 'おみくじを引きます。'}]}})
    }else if(args[0] === 'log'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {fields: [{name: `${prefix}log`,value: 'botの更新内容を送信します。'}]}}})
    }else if(args[0] === 'serverls' || args[0] === 'svls'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}svls,botの権限を持っている人のみ実行できます。`},fields: [{name: `${prefix}serverls`,value: 'botの参加しているサーバーのリストを出します。'}]}})
    }else if(args[0] === 'googlesearch' || args[0] === 'gs'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}gs`},fields: [{name: `${prefix}googlesearch <キーワード>`,value: 'Googleで検索します。'}]}})
    }else if(args[0] === 'youtubesearch' || args[0] === 'ys'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}ys`},fields: [{name: `${prefix}youtubesearch <キーワード>`,value: 'Youtubeで検索します。'}]}})
    }else if(args[0] === 'githubsearch' || args[0] === 'gh'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}gh`},fields: [{name: `${prefix}githubsearch <キーワード>`,value: 'Githubで検索します。'}]}})
    }else if(args[0] === 'customsearch' || args[0] === 'cs'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}cs`},fields: [{name: `${prefix}customsearch <検索サイトurl> <キーワード>`,value: '指定されたサイトで検索します。'}]}})
    }else if(args[0] === 'wikipediasearch' || args[0] === 'wp'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}wp`},fields: [{name: `${prefix}wikipediasearch <キーワード>`,value: 'Wikipediaで検索します。'}]}})
    }else if(args[0] === 'nyannkodbsearch' || args[0] === 'bdb'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}bdb`},fields: [{name: `${prefix}nyannkodbsearch <キーワード>`,value: 'にゃんこ大戦争データーベースで検索します。'}]}})
    }else if(args[0] === 'undoban' || args[0] === 'dban'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: `エイリアス:${prefix}dban`},fields: [{name: `${prefix}undoban <id>`,value: 'banの解除をします。'}]}})
    }else if(args[0] === 'bank'){
      channel.send({embed: {color: 7506394,timestamp: new Date(),fields: [{name: `${prefix}bank info`,value: 'お金の残量確認をします。'}, {name: `${prefix}bank in`,value: '預金します。'}, {name: `${prefix}bank out`,value: '口座からお金を出します。'}, {name: `${prefix}bank give`,value: 'bot管理者はお金の付与ができます。'}]}})
    }
  }else if(command=== 'invite' || command === 'inv'){
    channel.send({
      embed: {
        color: 7506394,
        timestamp: new Date(),
        footer: {text: "Glow-botの招待リンク"},
        fields: [{name: "招待リンクです。",value: "[URL](https://discord.com/api/oauth2/authorize?client_id=832614051514417202&permissions=8&scope=bot)",inline: true}]
      }
    })
      .then(channel => console.log(`sent<invite link>to ${author} as command ${prefix}invite`))
      .catch(console.error);
  }else if(command === 'invite2' || command === 'inv2'){
    channel.send({
      embed: {
        color: 7506394,
        timestamp: new Date(),
        footer: {text: "Glow-botβ版の招待リンク"},
        fields: [{name: "招待リンクです。",value: "[URL](https://discord.com/api/oauth2/authorize?client_id=821033562555809824&permissions=8&scope=bot)",inline: true}]
      }
    })
      .catch(console.error);
  }else if(command === 'bot'){
    channel.send({
      embed: {
        title: "Glow-bot関連のurl一覧",
        color: 7506394,
        timestamp: new Date(),
        footer: {text: "Glow-bot関連のurl"},
        fields: [
          {name: "公式Discordサーバーの招待リンク",value: "[URL](https://discord.gg/dVVp5pPp5H)",inline: true},
          {name: "公式minecraftサーバーの招待リンク",value: "[URL](https://discord.com/invite/tC5FJKp7FM)",inline: true},
          {name: "サーバー管理人(Twitter)",value: "[URL](https://twitter.com/advictrius85)",inline: true},
          {name: "Bot招待リンク",value: "[URL](https://discord.com/api/oauth2/authorize?client_id=832614051514417202&permissions=8&scope=bot)",inline: true},
          {name: "β版Bot招待リンク",value: "[URL](https://discord.com/api/oauth2/authorize?client_id=821033562555809824&permissions=8&scope=bot)",inline: true}
        ]
      }
    })
      .catch(console.error);
  }else if(command === 'stop'){
    if(message.author.id === ownerid){
      console.log('-----------\nbotのメインセッションを終了しています。\n**botのメインセッションが正常に終了しました**\n-----------');
      channel.send('botを終了しています...')
      setTimeout(exit, 20)
    }else{
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
    }
  }else if(command === 'discord' || command === 'dis'){
    let reply_text ='https://discord.gg/dVVp5pPp5H';
		channel.send(reply_text)
			.catch(console.error);
  }else if(command === 'ping') {
		let reply_text =`${client.ws.ping}ms`;
		channel.send(reply_text)
			.catch(console.error);
	}else if (command === 'rn' || command === 'getrandom') {
    let q = args[1] - 0;
    let reply_text = q + Math.floor(Math.random() * (args[0] - args[1] + 1)) - 0;
    channel.send(reply_text)
			.catch(console.error);
  }else if(command === 'playurl' || command == 'purl' && message.guild) {
    const url = args[0];
    if (!ytdl.validateURL(url)) return message.reply('動画が存在しません！')
    if (!channel2) return message.reply('先にボイスチャンネルに参加してください！')
    const connection = await channel2.join()
    const stream = ytdl(ytdl.getURLVideoID(url), { filter: 'audioonly' })
    const dispatcher = connection.play(stream)
    dispatcher.once('finish', () => {
      channel2.leave()
    })
  }else if(command === 'play' || command == 'p' && message.guild){
    if (!args[0]) return channel.send("エラー:空白がないまたは検索内容を書いていません");
    const yts = require( 'yt-search' )
    yts(args[0], async function ( err, r ) {
      const url = r.videos[0].url;
      if (!ytdl.validateURL(url)) return message.reply('動画が存在しません！')
      if (!channel2) return message.reply('先にボイスチャンネルに参加してください！')
      const connection = await channel2.join()
      channel.send(url)
      const stream = ytdl(ytdl.getURLVideoID(url), { filter: 'audioonly' })
      const dispatcher = connection.play(stream)
      dispatcher.once('finish', () => {
      channel2.leave()
    })})
  }else if(command === 'disconnect' || command == 'dc' && message.guild) {
    if (message.guild.roles.cache.some(r => 'DJ'.includes(r.name)) || message.author.id === ownerid){
      channel2.leave()
      channel.send('再生を止めました。')
    }else{
      channel.send('指定されたロールまたは権限を持っていません。')
    }
  }else if (command === 'avatar' || command === 'avt') {
    if(message.mentions.users.size){
      const avatar = new Discord.MessageEmbed()
      const user = message.mentions.users.first()
      avatar.setTitle(`${user.username}'s avatar`).setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
      channel.send(avatar);
    }else{
      channel.send({embed:{title:`${message.author.username}'s avatar`,thumbnail:{url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`}}})
    }
  }else if(command === 'slot' || command === 'sl') {
    const money = (await moneys.get(message.author.id)) || {bank: 1000, hand: 1000};
    if(!isNaN(args[0])){}else{args[0] = 0}
    let w = args[0] * 1 + 1 - 1;
    if(money.hand < w)return message.reply('掛け金が所持金以上になっています。')
    if(w <= 0)return message.reply('掛け金が0円以下になっています。')
    let reply_text = 'error'
    let q = 3 + Math.floor(Math.random() * 8);
    let n = Math.floor(Math.random() * q);
    let r = w * q;
    r = r * 1 + 1 - 1;
    if(n === 2){
      money.hand = money.hand + r;
      reply_text = `当選しました!!)\nコインが${r}増加しました`;
    }else{
      money.hand = money.hand - args[0];
      reply_text = `外れました。\nコインが${args[0]}減少しました。`;
    }
    let msg = await channel.send('スロットを回しています...');
    msg.send;
    moneys.set(message.author.id, money);
    channel.startTyping()
    setTimeout(() => {
      channel.stopTyping()
      msg.edit(reply_text)
			  .catch(console.error);
    }, 3000)
  }else if(command === 'listban' || command === 'banlist' || command === 'banls' && message.guild){
    const bans = await message.guild.fetchBans()
    channel.send(bans.map(ban => ban.user.tag).join('\n') || 'ban者はまだいないようです...')
      .catch(console.error);
  }else if(command === 'ban'){
    if (!message.member.hasPermission('BAN_MEMBERS')) return channel.send('BANする権限がありません')
    if (message.mentions.members.size !== 1) return channel.send('BANするメンバーを1人指定してください')
    const member = message.mentions.members.first()
    if (!member.bannable) return channel.send('このユーザーをBANすることができません')
    channel.send('本当にbanしますか?する場合は10秒以内にyesもしくはokと送信してください。')
    const filter = msg => msg.author.id === message.author.id
    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000 })
    const response = collected.first()
    if (!response) return channel.send('banされませんでした。')
    if (!['yes','ok'].includes(response.content)) return channel.send('banされませんでした。')
    const msg = await channel.send('banしています...')
    await member.ban()
    msg.edit(`${member.user.tag}をbanしました。`);
  }else if(command === 'kick'){
    if (!message.member.hasPermission('KICK_MEMBERS')) return channel.send('KICKする権限がありません')
    if (message.mentions.members.size !== 1) return channel.send('KICKするメンバーを1人指定してください')
    const member = message.mentions.members.first()
    if (!member.bannable) return channel.send('このユーザーをKICKすることができません')
    channel.send('本当にkickしますか?する場合はyesもしくはokと送信してください。')
    const filter = msg => msg.author.id === message.author.id
    const collected = await message.channel.awaitMessages(filter, { max: 1, time: 10000 })
    const response = collected.first()
    if (!response) return channel.send('kickされませんでした。')
    if (!['yes','ok'].includes(response.content)) return channel.send('kickされませんでした。')
    const msg = await channel.send('kickしています...')
    await member.ban()
    msg.edit(`${member.user.tag}をkickしました。`);
  }else if(command === 'dban' || command === 'undoban'){
    if (!message.member.hasPermission('BAN_MEMBERS')) return channel.send('BANを解除する権限がありません')
    message.guild.members.unban(args[0])
      .catch(console.error)
    channel.send(`${user.username}をban解除されました。`)
  }else if(command === 'repeat' || command === 'rp'){
    if (message.content.includes('@')){
      message.delete()
      const reply_text = await message.reply('メンションは利用できません')
      reply_text.delete({ timeout: 5000 })
    }else{
      message.delete()
      channel.send(args[0])
    }
  }else if(command === 'send'){
    if(message.content.includes('@')){
      message.delete()
      const reply_text = await message.reply('メンションは利用できません')
      reply_text.delete({ timeout: 5000 })
    }else{
      if (message.author.id === ownerid){
        client.channels.cache.get(args[0]).send(args[1])
      }else{
        message.delete()
        const reply_text = await channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
        reply_text.delete({ timeout: 5000 })
      }
    }
  }else if(command === 'omikuji' || command === 'omi'){
    let arr = ["大吉", "中吉", "小吉", "吉", "凶", "大凶"];
    var random = Math.floor(Math.random() * arr.length);
    var result = arr[random];
    message.reply({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'おみくじの結果です。'},fields: [{name: 'あなたの運は??',value: `${result}でした。`}]}})
  }else if(command === 'log'){
    message.reply({embed: {color: 7506394,timestamp: new Date(),footer: {text:'updatelog'},fields: [{name: log1,value: log2}]}})
  }else if(command === 'serverls' || command === 'svls'){
    if (message.author.id === ownerid){
      channel.send(client.guilds.cache.map(a => a.name));
    }else{
      channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
    }
  }else if(command === 'googlesearch' || command === 'gs'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[0], filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: 'Googleの検索結果', icon_url: `https://google.com/favicon.ico`}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[0]})`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'youtubesearch' || command === 'ys'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[0] + '+site:https://youtube.com', filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: 'Youtubeの検索結果'}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[0]}+site:youtube.com)`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'nyannkodbsearch' || command === 'bdb'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[0] + '+site:https://battlecats-db.com', filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: 'にゃんこデーターベースの検索結果'}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[0]}+site:battlecats-db.com)`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'customsearch' || command === 'cs'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[1] + `+site:${args[0]}`, filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: `${args[0]}の検索結果`, icon_url: `https://${args[0]}/favicon.ico`}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[1]}+site:${args[0]})`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'githubsearch' || command === 'gh'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[0] + '+site:https://github.com', filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: `githubの検索結果`}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[0]}+site:github.com)`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'wikipediasearch' || command === 'wp'){
    try{
      var options = {host : "google.co.jp", qs : {q : args[0] + '+site:https://wikipedia.org', filter : 0, pws : 0}, num : 3};
      const links = await serp.search(options);
      channel.send({embed: {title: "検索結果", timestamp: new Date(),footer: {text: 'wikipediaの検索結果'}, description: `[${links[0].title}](https://www.google.co.jp${links[0].url})\n\n[${links[1].title}](https://www.google.co.jp${links[1].url})\n\n[${links[2].title}](https://www.google.co.jp${links[2].url})\n\n他の検索結果は[こちら](https://www.google.com/search?q=${args[0]}+site:wikipedia.org)`, color: "#4285F4"}});
    }catch(error){
      channel.send({embed: {title: "検索結果", description: `検索結果が見つからなかったようです…\n検索語句を変えてもう一度試してください。`, color: "#4285F4"}});
    }
  }else if(command === 'bank'){
    const money = (await moneys.get(message.author.id)) || {bank: 1000, hand: 1000};
    let w = args[1] * 1 + 1 - 1;
    if(!isNaN(w)){}else{w = 0;}
    if(args[0] === 'info'){
      channel.send(`あなたの手持ちのお金は${money.hand}coinです。\nあなたの預金は${money.bank}coinです。`)
    }else if(args[0] === 'in'){
      if(args[1] >= 0){
        if(args[1] <= money.hand){
          money.hand = money.hand - w;
          money.bank = money.bank + w;
          moneys.set(message.author.id, money);
          channel.send(`正常に${w}コイン預けました。`)
        }else if(args[1] > money.hand){
          channel.send('預金額が所持金より大きくなってます。')
        }
      }else if(args[1] < 0){
        channel.send('0以下です。')
      }
    }else if(args[0] === 'out'){
      if(w >= 0){
        if(w <= money.hand){
          money.hand = money.hand + w;
          money.bank = money.bank - w;
          moneys.set(message.author.id, money);
          channel.send(`正常に${w}コイン引き出しました。`)
        }else if(w > money.hand){
          channel.send('引き出し額が所持金より大きくなってます。')
        }
      }else if(w < 0){
        channel.send('0以下です。')
      }
    }else if(args[0] === 'give'){
      if (message.author.id === ownerid){
        if(w < 0) return channel.send('0以下です。')
        money.hand = money.hand + w;
        moneys.set(message.author.id, money);
        channel.send(`正常に${w}コイン付与しました。`)
      }else{
        channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
      }
    }
  }else if(command === 'xp'){
    if(args[0] === 'give'){
      let w = args[1] * 1 + 1 - 1;
      if(!isNaN(w)){}else{w = 0;}
      if (message.author.id === ownerid){
        if(w < 0) return channel.send('0以下です。')
        level.count = level.count + w
        levels.set(message.author.id, level)
        channel.send(`正常に${w}経験値付与しました。`)
      }else{
        channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
      }
    }
  }else if(command === 'level'){
    const levelemb = new Discord.MessageEmbed()
    if(args[0] === 'give'){
      let w = args[1] * 1 + 1 - 1;
      if(!isNaN(w)){}else{w = 0;}
      if (message.author.id === ownerid){
        if(w < 0) return channel.send('0以下です。')
        level.level = level.level + w
        levels.set(message.author.id, level)
        channel.send(`正常に${w}レベル付与しました。`)
      }else{
        channel.send({embed: {color: 7506394,timestamp: new Date(),footer: {text: 'botの権限を持っている人のみ実行できます。'},fields: [{name: '実行できませんでした',value: 'あなたには権限がありません。'}]}})
      }
    }else if(message.mentions.users.size){
      const user = message.mentions.users.first()
      const level2 = (await levels.get(user.id)) || { count: 0, level: 0 };
      let up2 = leveler(level2.level) - level2.count;
      levelemb.setDescription(`現在の${user.username}のレベルは ${level2.level} です。\n次のレベルまであと ${up2}`)
      channel.send(levelemb)
    }else if(message.content ===`${prefix}level`){
      let up = leveler(level.level) - level.count;
      levelemb.setDescription(`現在のあなたのレベルは ${level.level} です。\n次のレベルまであと ${up}`)
      channel.send(levelemb)
    }else{
      const user = args[0]
      const level2 = await levels.get(user)
      let up2 = leveler(level2.level) - level2.count;
      levelemb.setDescription(`現在の${user}のレベルは ${level2.level} です。\n次のレベルまであと ${up2}`)
      channel.send(levelemb)
    }
  }else if(command === 'status'){
    const r = client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)
    const mem = Math.floor(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100;
    const s = (os.totalmem() / 1024 / 1024 * 100) / 100;
    channel.send(`${client.guilds.cache.size}guilds\n${r}users\n${mem}MB / ${s}MB\n`)
  }else if(command === 'beta'){
    channel.send('this command is beta.')
  }else if(command === 'test'){
    channel.send('this is the test command')
  }else if(message.content.startsWith(`${prefix}`)){
    const error = new Discord.MessageEmbed()
        .setColor('#0099ff')
	      .setTitle('エラりました')
        .setDescription(`コマンドが見つかりませんでした\nあるいは使用方法が間違えています\n${prefix}helpを参照してください\nそれでも分からなかったらこちらへ\n\n[サポートサーバー](https://discord.gg/dVVp5pPp5H)`)
	      .setTimestamp()
	      .setFooter('このメッセージは5秒後に自動で消えます');
    message.delete()
    const sender = await channel.send(error)
    sender.delete({ timeout: 5000 })
  }
})
client.on('message', async message => {
  if(message.author.bot){
    return;
  }else if(message.content === 'ぐー' || message.content ===  'グー') {
    let rannum = Math.floor( Math.random() * 3 );
    let reply_text;
    if (rannum == 1){
      reply_text = ':fist: あいこ';
    } else if(rannum == 2) {
      reply_text = ':v: あなたの勝利!!';
    } else {
      reply_text = ':hand_splayed: あなたの負け';
    }
    message.reply(reply_text)
      .catch(console.error);
  }else if(message.content === 'ちょき' || message.content ===  'チョキ') {
    let rannum = Math.floor( Math.random() * 3 );
    let reply_text;
    if (rannum == 1){
      reply_text = ':fist: あなたの負け';
    } else if(rannum == 2) {
      reply_text = ':v: あいこ';
    } else {
      reply_text = ':hand_splayed: あなたの勝利!!';
    }
    message.reply(reply_text)
      .catch(console.error);
  }else if(message.content=== 'ぱー' || message.content ===  'パー') {
    let rannum = Math.floor( Math.random() * 3 );
    let reply_text;
    if (rannum == 1){
      reply_text = ':fist: あなたの勝利!!';
    } else if(rannum == 2) {
      reply_text = ':v: あなたの負け';
    } else {
      reply_text = ':hand_splayed: あいこ';
    }
    message.reply(reply_text)
      .catch(console.error);
  }
})
function exit(){
  process.exit();
}
function leveler(a){
  let n = 100;
  let i = 0;
  for (i = 0; i < a; i++){
    n = n + 100 + i * a;
  }
  return n;
}

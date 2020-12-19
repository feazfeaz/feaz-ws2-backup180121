const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.json("Sao cung dc ma")
})
app.listen(port, () => {
    console.log("App is running!!!");
})
///monius
const Discord = require("discord.js")
const bot = new Discord.Client()
const disTokken = 'Nzg5MTM5NzU1MzUwMDk3OTgw.X9ttqw.57lW6eBs9zM_ZlzYwKCQ0DHLk_c'
const PREFIX = '~';

/////////bot location
bot.on('ready', () => {
    console.log("Monius is ready!");
})
// var isPlayingMusic = false;
var musicList = [];
bot.on('message', async msg => {
    if (!msg.guild) return;
    // console.log(msg.content.substring(0, 1));
    if (msg.content.substring(0, 1) != PREFIX) return;
    let session = (msg.content.substring(1, msg.content.length)).split(" ")
    if (session[0] === 'p') {
        musicList.length = 0;
        for (let i = 1; i < session.length; i++) { musicList.push(session[i]); }
        if (msg.member.voice.channel) {
            const connection = await msg.member.voice.channel.join();
            const ytdl = require('ytdl-core');
            recPlay(ytdl, connection, musicList, 0)
        } else { msg.reply('You need to join a voice channel first!'); }
        msg.reply('Danh sách đã khởi tạo, vui lòng chỉ dùng ~a nếu bạn muốn thêm nhạc!');
    } else if (session[0] === 'a') {
        musicList.push(session[1]);
        msg.reply("Đã thêm, bây giờ danh sách có " + musicList.length + " bản nhạc");
    } else if (session[0] === 'hello') {
        msg.reply("Con Card!");
    }
    console.log(session, session.length);
    console.log('ms ls', musicList);
});
function recPlay(ytdl, connection, musicListRecPlay, index) {
    if (typeof musicListRecPlay[index] == 'undefined') { console.log('end!'); return }

    const dispatcher = connection.play(ytdl(musicListRecPlay[index], { filter: 'audioonly' }));
    dispatcher.on('finish', () => {
        recPlay(ytdl, connection, musicListRecPlay, index + 1)
    });

}
bot.login(disTokken);
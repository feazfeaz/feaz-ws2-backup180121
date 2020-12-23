const express = require('express');
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.json("Sao cung dc ma")
})
app.get('/monius', (req, res) => {
    // let listJson = require("./MusicList.json")
    // res.send(listJson);
    fs.readFile("./MusicList.json", (err, data) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(data);
        return res.end();
    })
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
    } else if (session[0] === 'l') {
        fs.readFile("./MusicList.json", async (err, data) => {
            const listUrl = [];
            const listName = [];

            var list = JSON.parse((data.toString()));
            for (var key in list) {
                if (session[1] == key) {
                    // msg.reply("tìm thấy ");
                    // console.log(list[key]);
                    for (var keyin in list[key]) {
                        listUrl.push(keyin);
                        listName.push(list[key][keyin])
                        // console.log(keyin);
                        // console.log(list[key][keyin]);
                    }
                }
            }

            if (listUrl.length == 0) {
                msg.reply("không tìm thấy danh sách!! ~d (display) để hiển thị tên các danh sách hiện có!")
            } else {
                let textReply = "\nCác bài hát có trong danh sách hiện tại:\n";
                for (let i = 0; i < listName.length; i++) {
                    textReply += (i + 1) + ". " + listName[i] + "\n";
                }
                msg.reply(textReply);

                musicList.length = 0;
                for (let i = 0; i < listUrl.length; i++) { musicList.push(listUrl[i]); }
                if (msg.member.voice.channel) {
                    const connection = await msg.member.voice.channel.join();
                    const ytdl = require('ytdl-core');
                    recPlay(ytdl, connection, musicList, 0)
                } else { msg.reply('You need to join a voice channel first!'); }
                // console.log(listUrl);
                // console.log(listName);
            }
            // console.log(list);
            // console.log(list[session[1]]);
        })

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
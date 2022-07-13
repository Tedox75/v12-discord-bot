const fs=require('fs');
const Discord=require("discord.js");
const client=new Discord.Client();
const db = require('quick.db')
const moment = require("moment");
const ayarlar=require("./ayarlar.json");
const express = require('express');

const app = express()
app.get('/', (req, res) => res.send("Bot Aktif"))
app.listen(process.env.PORT, () => console.log('Port ayarlandı: ' + process.env.PORT))




client.on("message", message => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.yetkiler(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
})


  
    

 client.on("ready", () => {
  console.log(`Bütün komutlar başarıyla yüklendi!`);
  client.user.setStatus("dnd");
  client.user.setActivity('Hxgo Bot Her Zaman Yanında!');
})



const log = message => {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} adet komut yüklemeye hazırlanılıyor.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut ismi: ${props.help.name.toUpperCase()}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

  
client.yetkiler = message => {
  if(!message.guild) {
	return; }
  let permlvl = -ayarlar.varsayilanperm  ;
  if(message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
  if(message.member.hasPermission("KICK_MEMBERS")) permlvl = 2;
  if(message.member.hasPermission("BAN_MEMBERS")) permlvl = 3;
  if(message.member.hasPermission("MANAGE_GUILD")) permlvl = 4;
  if(message.member.hasPermission("ADMINISTRATOR")) permlvl = 5;
  if(message.author.id === message.guild.ownerID) permlvl = 6;
  if(message.author.id === ayarlar.sahip) permlvl = 7;
  return permlvl;
};

 
client.on('message', message => {
  // Data
  let sistem = db.fetch(`cmfsaas_${message.guild.id}`)

  // Sa
  var sa = ["Sa","SA","sa","Sea","sea","SEA","selamın aleyküm","Selamın Aleyküm","SELAMIN ALEYKÜm","selamun aleyküm","Selamun Aleyküm","SELAMUN ALEYKÜM"]

  if(sistem === 'aktif'){
    if(sa.includes(message.content.toLowerCase())){
      message.channel.send(`${message.author} **<a:sa1:987281900555075664> Aleyküm Selam Dostum, Hoşgeldin.**`)
    }
  } else {
    // Sistem Kapalıysa Bot İplemesin.
    return;
  }
})

//Caps Engel Baş
client.on("message", async msg => {
const cdb = require("croxydb")
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  if (msg.content.length > 4) {
    if (cdb.get(`capslock_${msg.guild.id}`)) {
      let caps = msg.content.toUpperCase();
      if (msg.content == caps) {
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
          if (!msg.mentions.users.first()) {
            msg.delete();
            return msg.channel
              .send(`✋ Lütfen Büyük Harf Kullanma!`)
              .then(m => m.delete({ timeout: 5000}));
          }
        }
      }
    }
  }
});
//Caps Engel Son

//Güvenlik Baş

client.on("guildMemberAdd", member => {
  let kanal = db.fetch(`güvenlik.${member.guild.id}`);
  if (!kanal) return;

  let aylar = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  };

  let bitiş = member.user.createdAt;
  let günü = moment(new Date(bitiş).toISOString()).format("DD");
  let ayı = moment(new Date(bitiş).toISOString())
    .format("MM")
    .replace("01", "Ocak")
    .replace("02", "Şubat")
    .replace("03", "Mart")
    .replace("04", "Nisan")
    .replace("05", "Mayıs")
    .replace("06", "Haziran")
    .replace("07", "Temmuz")
    .replace("08", "Ağustos")
    .replace("09", "Eylül")
    .replace("10", "Ekim")
    .replace("11", "Kasım")
    .replace("12", "Aralık")
  let yılı = moment(new Date(bitiş).toISOString()).format("YYYY");
  let saati = moment(new Date(bitiş).toISOString()).format("HH:mm");

  let günay = `${günü} ${ayı} ${yılı} ${saati}`;

  let süre = member.user.createdAt;
  let gün = moment(new Date(süre).toISOString()).format("DD");
  let hafta = moment(new Date(süre).toISOString()).format("WW");
  let ay = moment(new Date(süre).toISOString()).format("MM");
  let ayy = moment(new Date(süre).toISOString()).format("MM");
  let yıl = moment(new Date(süre).toISOString()).format("YYYY");
  let yıl2 = moment(new Date().toISOString()).format("YYYY");

  let netyıl = yıl2 - yıl;

  let created = ` ${netyıl} yıl  ${ay} ay ${hafta} hafta ${gün} gün önce`;

  let kontrol;
  if (süre < 1296000000)
    kontrol = "`Bu hesap şüpheli!` <a:aYanpSnennleGif:988906095487619092>";
  if (süre > 1296000000)
    kontrol = "`Bu hesap güvenli!` <a:onay1:915609682385711104>";

  let codare = new Discord.MessageEmbed()
    .setColor("#00ff00")
    .setTitle(`${member.user.username} Katıldı`)
    .setDescription(
      "<@" +
        member.id +
        "> Bilgileri  \n\n  __Hesap Oluşturulma Tarihi__  \n\n**[" +
        created +
        "]** (`" +
        günay +
        "`) \n\n __Hesap durumu__  \n\n**" +
        kontrol +
        "**"
    );
  client.channels.cache.get(kanal).send(codare);
});

//Güvenlik Son

//Sayaç Baş
client.on("guildMemberAdd", async member => {
      const cdb = require("croxydb")
      const profil = cdb.get("sayaç." + member.guild.id);
      if (profil) {
        let sayaçkanalID = profil.kanal;
        let sayaçsayı = profil.sayi;
        let sayaçkanal = client.channels.cache.get(sayaçkanalID);
        let aralık =
          parseInt(sayaçsayı) - parseInt(member.guild.members.cache.size);

        if (member.guild.memberCount > sayaçsayı) {
         cdb.delete("sayaç." + member.guild.id);
          const e = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setThumbnail(member.user.avatarURL())
            .setFooter(member.displayName)
            .setDescription(
              `**\`${member.user.tag}\` Sunucuya Katıldı!\n\nHey Sonunda Hedeflenen Üye Sayısına Ulaştık ve Sayaç Sıfırlandı Sunucumuz Şuan Anlık Olarak \`${member.guild.memberCount}\` Üyeye Sahip!**`
            );
          sayaçkanal.send(e);
        } else {
          const e = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setThumbnail(member.user.avatarURL())
            .setFooter(member.displayName)
            .setDescription(
              `**\`${member.user.tag}\` Sunucuya Katıldı!\n\nHedeflenen Üye Sayısı \`${sayaçsayı}\`\nBelirlenen Üye Sayısına Ulaşmaya \`${aralık}\` Kişi Kaldı!\nSunucuda Şuan \`${member.guild.members.cache.size}\` Üye Var!**`
            );
          sayaçkanal.send(e);
        }
    }
});


client.on("guildMemberRemove", async member => {
const cdb = require("croxydb")
      const profil = cdb.get("sayaç." + member.guild.id);
      if (profil) {
        let sayaçkanalID = profil.kanal;
        let sayaçsayı = profil.sayi;
        let sayaçkanal = client.channels.cache.get(sayaçkanalID);
        let aralık =
          parseInt(sayaçsayı) - parseInt(member.guild.members.cache.size);

        const ee = new Discord.MessageEmbed()
          .setColor("RED")
          .setTimestamp()
          .setThumbnail(member.user.avatarURL())
          .setFooter(member.user.tag)
          .setDescription(
            `**\`${member.user.tag}\` Sunucudan Ayrıldı\n\nHedeflenen Üye Sayısı \`${sayaçsayı}\` \nHedefe Ulaşmamıza \`${aralık}\` Kişi Kaldı!\nSunucuda Şuan \`${member.guild.members.cache.size}\` Üye Var!**`
          );
        sayaçkanal.send(ee);
      }
  
});
//Sayaç Son

//Panel Baş
client.on('ready', async () => {
const cdb = require("orio.db")
    const dakika = 7.5;
    setInterval(() => {
        client.guilds.cache.forEach(sunucu => {
            const sunucu_panel = cdb.get(`panel.${sunucu.id}`);
            if (!sunucu_panel) return;
            sunucu_panel.filter(id => (id.split(" "))[1] === "v").forEach(kanal => {
                try {
                    const kanal_bul = sunucu.channels.cache.get((kanal.split(" "))[0]);
                    if (!kanal_bul) return cdb.delete(`panel.${sunucu.id}`);
                    let kanal_ayır = kanal_bul.name.split(" ");
                    let sunucu_üyeleri;
                    switch (kanal_ayır[0]) {
                        case "Üye":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => !üye.user.bot).size;
                            break;
                        case "Bot":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => üye.user.bot).size;
                            break;
                        case "Çevrim":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => üye.user.presence.status !== 'offline').size;
                            break;
                    };
                    if (sunucu_üyeleri == undefined) return;
                    if (sunucu_üyeleri === kanal_ayır.slice(-1)) return;
                    kanal_ayır[kanal_ayır.length - 1] = sunucu_üyeleri;
                    return kanal_bul.setName(kanal_ayır.join(" "), 'Sunucu üye panel sistemi').catch(() => {});
                } catch (h) {};
            });
        });  
    }, dakika * 60000);
});
//Panel Son

//Küfür Engel Baş

const küfür = [
  "siktir",
  "fuck",
  "puşt",
  "pust",
  "piç",
  "sikerim",
  "sik",
  "yarra",
  "yarrak",
  "amcık",
  "orospu",
  "orosbu",
  "orosbucocu",
  "oç",
  ".oc",
  "ibne",
  "yavşak",
  "bitch",
  "dalyarak",
  "amk",
  "awk",
  "taşak",
  "taşşak",
  "daşşak",
  "sikm",
  "sikim",
  "sikmm",
  "skim",
  "skm",
  "sg"
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
    if (i) {
      if (küfür.some(word => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
        const embed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajını editleyerek küfür etmeye çalıştı!**`
          )
          .addField("Mesajı:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajı editleyerek küfür etmene izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
  if (i) {
    if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(
              ` <@${msg.author.id}> , **Bu sunucuda küfür yasak!**`
            );
          msg.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
          const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(` ${msg.author} , **Küfür etmeye çalıştı!**`)
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//KüfürEngel Son

//Reklam Engel Baş

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".com.tr",
  ".biz",
  ".net",
  ".rf",
  ".gd",
  ".az",
  ".party",
  ".gif",
  ".31"
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
    if (i) {
      if (reklam.some(word => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
        const embed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajını editleyerek reklam yapmaya çalıştı!**`
          )
          .addField("Mesajı:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setDescription(
            ` ${nev.author} , **Mesajı editleyerek reklam yapamana izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
  if (i) {
    if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(
              ` <@${msg.author.id}> , **Bu sunucuda reklam yapmak yasak!**`
            );
          msg.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
          const embed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setDescription(` ${msg.author} , **Reklam yapmaya çalıştı!**`)
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//Reklam Engel Son

//ModLog Baş

client.on("messageDelete", async message => {
  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "");

  log.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let modlog = await db.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

    .addField("**Eylem:**", "Mesaj Düzenleme")

    .addField(
      "**Mesajın sahibi:**",
      `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
    )

    .addField("**Eski Mesajı:**", `${oldMessage.content}`)

    .addField("**Yeni Mesajı:**", `${newMessage.content}`)

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(
      `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
      oldMessage.guild.iconURL()
    )

    .setThumbnail(oldMessage.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelCreate", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `<#${channel.id}>`;

  if (channel.type === "voice") kanal = `\`${channel.name}\``;

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal:**", `${kanal}`)

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconUR);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelDelete", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal:**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleCreate", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Oluşturma")

    .addField("**Rolü oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("#00ff00")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Silme")

    .addField("**Rolü silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor("#00ff00")

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Oluşturma")

    .addField("**Emojiyi oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan emoji:**", `${emoji} - İsmi: \`${emoji.name}\``)

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Silme")

    .addField("**Emojiyi silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen emoji:**", `${emoji}`)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setColor("#00ff00")

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Güncelleme")

    .addField("**Emojiyi güncelleyen kişi:**", `<@${entry.executor.id}>`)

    .addField(
      "**Güncellenmeden önceki emoji:**",
      `${oldEmoji} - İsmi: \`${oldEmoji.name}\``
    )

    .addField(
      "**Güncellendikten sonraki emoji:**",
      `${newEmoji} - İsmi: \`${newEmoji.name}\``
    )

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(
      `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
      oldEmoji.guild.iconURL
    )

    .setThumbnail(oldEmoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanAdd", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasaklama")

    .addField("**Kullanıcıyı yasaklayan yetkili:**", `<@${entry.executor.id}>`)

    .addField("**Yasaklanan kullanıcı:**", `**${user.tag}** - ${user.id}`)

    .addField("**Yasaklanma sebebi:**", `${entry.reason}`)

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanRemove", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasak kaldırma")

    .addField("**Yasağı kaldıran yetkili:**", `<@${entry.executor.id}>`)

    .addField(
      "**Yasağı kaldırılan kullanıcı:**",
      `**${user.tag}** - ${user.id}`
    )

    .setTimestamp()

    .setColor("#00ff00")

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});
// ModLog Son
//Ekonomi Baş
client.k4h1n = {
  parabirimi: "TL", //Para Birimi TL İsterseniz Dolar Euro Vb. Para Birimleri Girebilirsiniz.
  prefix: "h!",
  botunuzunidsi: "946758323590561842",
  botismi: "Hxgo Bot",
  renk: "BLUE",
  isimsiz: "Bilinmiyor",
  rastgelepara: true,
  minpara: 10,
  maxpara: 200,
  günlükpara: 50,
  dbloy: false,
  dblkey: "https://top.gg/bot/946758323590561842/vote",
  dblmsj:
    "Bu komutu kullanabilmek için bota oy vermelisiniz. Oy vermek için h!oyver",
  başlangıçparası: 50,
  admin: ["847536094739431424"],
};
//Ekonomi Son
client.login(ayarlar.token)




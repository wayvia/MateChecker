const config = require("./config")
const Discord = require("discord.js")
const client = new Discord.Client()
client.login(config.token)
const Fonction = require("./fonction")
var Mysql = require("mysql")
server = new Mysql.createConnection(config.connectServ)
var blizzardclient = require("blizzapi")
var bnet

client.on("ready", () => {
    client.guilds.forEach(guild => {
        server.query("SELECT * from server where ID_SERVER = '" + guild.id + "';", (error, results, fields) => {
            if (results.length === 0) {
                server.query("INSERT INTO server (ID_SERVER) values ('" + guild.id + "')")
            }
        })
    })
    bnet = new blizzardclient(config.bnetconnect)
})

//const data = await clientbnet.query("/path/to/endpoint")

client.on("guildMemberAdd", member => {
    Fonction.welcomeNew(member)
})

client.on("guildMemberRemove", member => {
    Fonction.deleteUser(member, server)
})

client.on("message", message => {
    if (message.content.startsWith("!")) {
        var abrmess = message.content.toLowerCase()
        switch (true) {
            case abrmess.startsWith("!aide"):
                Fonction.aide(message)
                break
            case abrmess.startsWith("!register"):
                Fonction.register(message, server, bnet)
                break
            case abrmess.startsWith("!lvl"):
                Fonction.lvl(message, server, bnet)
                break
            case abrmess.startsWith("!gear"):
                Fonction.gear(message, server, bnet)
                break
            case abrmess.startsWith("!roster"):
                Fonction.roster(message, server, bnet)
                break
            default:
                message.channel.send("Je ne parviens à trouver cette commande ! Vérifie l'orthographe ou tape !aide pour avoir toute les commandes.")
        }
    }
})

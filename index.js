const config = require("./config")
const Discord = require("discord.js")
const client = new Discord.Client()
client.login(config.token)
const Fonction = require("./fonction")
var Mysql = require("mysql")
server = new Mysql.createConnection(config.connectServ)
var blizzardclient = require("battlenet.js")
module.exports = { server }
var cregion = "eu"
var clocale = "fr_FR"

//console.log(
client.guilds.forEach(guild => {
    console.log(guild)
    server.query("SELECT * from server where ID_SERVER = " + guild.id + ";", (error, results, fields) => {
        console.log(results)
        if (results === null || "") {
            server.query("INSERT INTO server (ID_SERVER) values ('" + guild.id + "')")
        }
    })
})
//)

var clientbnet = new blizzardclient(config.APIKey, { region: cregion, locale: clocale })
console.log(clientbnet)

client.on("guildMemberAdd", member => {
    Fonction.welcomeNew(member, server, clientbnet)
})

client.on("guildMemberRemove", member => {
    Fonction.deleteUser(member, server)
})

client.on("message", message => {
    if (message.content.startsWith("!")) {
        if (message.content.toLowerCase().startsWith("!aide")) {
            Fonction.aide(message)
        } else if (message.content.toLowerCase().startsWith("!register")) {
            Fonction.register(message, server)
        } else if (message.content.toLowerCase().startsWith("!lvl")) {
            Fonction.lvl(message, clientbnet, server)
        } else if (message.content.toLowerCase().startsWith("!gear")) {
            Fonction.gear(message, clientbnet, server)
        } else message.channel.send("Je ne parviens à trouver cette commande ! Vérifie l'orthographe ou tape !aide pour avoir toute les commandes.")
    }
})

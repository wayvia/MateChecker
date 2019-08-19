const Config = require('./config')
const Discord = require('discord.js')
const Client = new Discord.Client()
Client.login(Config.token)
const Fonction = require('./fonction')

Client.on('guildMemberAdd', member =>{
    Fonction.WelcomeNew(member)
})

Client.on('message', message =>{
    if(message.content.startsWith('!')){
        if(message.content.toLowerCase.startsWith('!aide')){
            Fonction.Aide(member)
        }
        if(message.content.toLowerCase.startsWith('!register')){
            Fonction.Register(message)
        }
        if(message.content.toLowerCase.startsWith('!lvl')){
            Fonction.Register(message)
        }
        if(message.content.toLowerCase.startsWith('!gear')){
            Fonction.Register(message)
        }

    }
})

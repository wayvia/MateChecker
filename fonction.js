const axios = require("axios")

function welcomeNew(member) {
    member.createDM().then(function(channel) {
        channel.send("```Bienvenue " + member.displayName + "! Je suis là afin de te guider pour que tu sâches comment utiliser mes fonctions. Fais un !aide dans un channel du discord pour que je t'indique les différentes fonctions. N'hésite pas!```")
    })
}

function deleteUser(member, server) {
    server.query("DELETE FROM utilisateurs WHERE ID_PERSO = '" + member.id + "';")
}

async function register(message, server, bnet) {
    let string = message.content.split(" ")[1].split("-")
    let serveur = string[1]
    let pseudo = string[0]
    let persoId = message.member.id
    let idserver = message.guild.id
    try {
        const uri = await axios.get("https://eu.api.blizzard.com/wow/character/" + serveur + "/" + pseudo + "?locale=fr_FR&access_token=" + (await bnet.getAccessToken()))
        console.log(uri)
        server.query("SELECT count(*) as NB FROM utilisateurs where ID_PERSO = '" + persoId + "';", (error, results, fields) => {
            if (results[0].NB === 0) {
                server.query("INSERT INTO utilisateurs (PSEUDO, SERVEUR, ID_PERSO, isMain, ID_SERVER) VALUES ('" + pseudo + "','" + serveur + "','" + persoId + "',true,'" + idserver + "');")
                message.guild.members
                    .get(message.member.id)
                    .setNickname(pseudo + "-" + serveur)
                    .then(() => {
                        message.channel.send(message.member + " Enregistré !")
                    })
                    .catch(() => {
                        message.channel.send("J'ai pas les droits pour changer les pseudos des admins, mais tu es quand même rentrer dans la base de données ;) !")
                    })
            } else {
                server.query("INSERT INTO utilisateurs (PSEUDO, SERVEUR, ID_PERSO, ID_SERVER) VALUES ('" + pseudo + "','" + serveur + "','" + persoId + "','" + idserver + "');")
            }
        })
    } catch (error) {
        message.channel.send("Ce personnage n'existe pas !")
    }
    message.delete(1000)
}

function aide(message) {
    message.member.createDM().then(function(channel) {
        return channel.send("```Tout d'abords, pour t'enregistrer, tu dois faire !register Tonpseudo-Tonserveur. Attention à l'ortographe c'est important sinon ça ne fonctionnera pas. Ensuite tu as la commande !gear qui te permet de voir en temps réel l'équipement de tout le monde ou d'une personne si tu mets son pseudo après. Tu as la commande !Lvl qui te permet de savoir le niveau de tes collègues ou d'une personne en particulier, si tu mets son pseudo après. Voilà c'est tout pour l'instant.```")
    })
    message.delete(1000)
}

function lvl(message, server, clientbnet) {}

function gear(message, server, clientbnet) {
    var fields = ["items", "progression"]
    console.log(Object.keys(clientbnet))
    clientbnet.warcraft.getCharacter(message.content.split(" ")[1].split("-")[1], message.content.split(" ")[1].split("-")[0], fields, (error, response) => {
        if (error) {
            console.log(error)
        }
    })
}

function roster(message, serveur, bnet) {
    var heal = []
    var dps = []
    var tank = []
    server.query("select PSEUDO, SERVEUR from utilisateurs where ID_SERVER = '" + message.guild.id + "' AND isMain = true", async (error, results, fields) => {
        for (const index in results) {
            var pseudo = results[index]
            const data = await axios.get("https://eu.api.blizzard.com/wow/character/" + pseudo["SERVEUR"] + "/" + pseudo["PSEUDO"] + "?fields=talents&locale=fr_FR&access_token=" + (await bnet.getAccessToken()))
            var spe = data.data.talents.find(talent => talent.selected)
            var selspe = spe.spec.role
            switch (selspe) {
                case "HEALING":
                    heal.push(pseudo["PSEUDO"] + "-" + pseudo["SERVEUR"] + " niveau : " + data.data.level)
                    break
                case "TANK":
                    tank.push(pseudo["PSEUDO"] + "-" + pseudo["SERVEUR"] + " niveau : " + data.data.level)
                    break
                case "DPS":
                    dps.push(pseudo["PSEUDO"] + "-" + pseudo["SERVEUR"] + " niveau : " + data.data.level)
                    break
            }
        }
        message.channel.send("Tanks\n" + tank + "\nHeals\n" + heal + "\nDPS\n" + dps)
    })
}
module.exports = { roster, welcomeNew, register, aide, lvl, gear, deleteUser }

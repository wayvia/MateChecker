function welcomeNew(member) {
    member.createDM().then(function(channel) {
        channel.send("```Bienvenue " + member.displayName + "! Je suis là afin de te guider pour que tu sâches comment utiliser mes fonctions. Fais un !aide dans un channel du discord pour que je t'indique les différentes fonctions. N'hésite pas!```")
    })
}

function deleteUser(member, server) {
    server.query("DELETE FROM utilisateurs WHERE ID_PERSO = '" + member.id + "';")
}

function register(message, server) {
    let string = message.content.split(" ")[1].split("-")
    let serveur = string[1]
    let pseudo = string[0]
    let persoId = message.member.id
    let idserver = message.guild.id
    console.log(persoId, idserver, pseudo, serveur)
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
                    message.channel.send("Il y a eu une erreur !")
                })
        } else {
            server.query("INSERT INTO utilisateurs (PSEUDO, SERVEUR, ID_PERSO, ID_SERVER) VALUES ('" + pseudo + "','" + serveur + "','" + persoId + "','" + idserver + "');")
        }
    })
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

module.exports = { welcomeNew, register, aide, lvl, gear, deleteUser }

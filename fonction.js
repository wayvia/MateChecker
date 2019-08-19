
module.exports = {WelcomeNew, Register, Aide, Lvl, Gear}
    
    function WelcomeNew(member) {
    member.createDM().then(function(Channel){
        Channel.send('Bienvenue ' + member.displayName + '! Je suis là afin de te guider pour que tu sâches comment utiliser mes fonctions. Fais un !aide pour que je t\'indique les différentes fonctions. N\'hésite pas!')
    })
}

function Register(member){

}

function Aide() {

}

function Lvl(member){

}

function Gear(member){

}
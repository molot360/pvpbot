const { VK, Keyboard } = require('vk-io');
const vk = new VK();
const users = require('./users.json');
const fs = require('fs');
const { HearManager } = require('@vk-io/hear');
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
const { on } = require('process');
const { ALL } = require('dns');
vk.setOptions({
token:"69226fb08e5bbc9c33198fd74c3e7e858a5bbd801b921dd37725dee9f2e13f061378586dad76ea9358e50"
})
const bot = new HearManager()

vk.updates.on('message_new', bot.middleware)

setInterval(async () => {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, "\t"))
}, 500);

vk.updates.on('message', (next, context) => {
  const user = users.filter(x => x.id === next.senderId)[0]
  if(user) {
    return context()
  }
  vk.api.users.get({ user_ids: next.senderId, name_case: 'nom' }).then((result) => {
    users.push({
      id: next.senderId,
      name: result[0].first_name + ' ' + result[0].last_name, 
      nick: "Игрок",
      atk: 100,
      duelatk: 0,
      hp: 400,
      duelhp: 0,
      def: 50,
      dueldef: 0,
      control: 0,
      clan: {
        name: "Нет",
        id: 0
      },
      money: 10000,
      adm: false,
      predictionduel: false,
      predictduel: false,
      duel: false,
      steps: 0,
      timer: 0,
      cd11: 0,
      del11: -1,
      cd12: 0,
      del12: -1,
      cd13: 0,
      cd14: 0,
      cd15: 0,
      spikes: -1,
      cd16: 0,
      clinch: 0,
      cd21: 0,
      cd22: 0,
      nakopleniye: 0,
      el1: 0,
      burn: 0,
      el2: 0,
      el3: 0,
      cd31: 0,
      poison: 0,
      cd32: 0,
      cd33: 0,
      cd34: 0,
      invisible: false,
      cd35: 0,
      cd36: 0,
      cd37: 0,
      poisoning: 0
  })
})
  return context()
})

const clans = [
    {
      name: 'Воин',
      id: 1,
    },
    {
      name: 'Маг',
      id: 2,
    },
    {
      name: 'Ассасин',
      id: 3,
    }
  ]
  
  vk.updates.hear(/^(.*) Классы$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    msg.send(`${user.nick}, вот все существующие классы:\n1. Воин\n2. Маг\n3. Ассасин\nДля смены класса необходимо иметь 5000💵\n\nЧтобы сменить класс, введи: "!класс [номер класса]"`)
  })
  
  vk.updates.hear(/^!класс ([0-9]+)/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    num = Number(msg.$match[1])
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(num > 3 || num < 1) return msg.send(`Такого класса не существует`)
    if(user.money < 5000) return msg.send (`Не хватает ${1000 - user.money}💵 на смену класса`)
    clan = clans.filter(x => x.id === num)[0]
    user.clan.name = clan.name
    user.clan.id = clan.id
    user.money -= 5000
    msg.send(`"${user.nick}", ты сменил класс на "${clan.name}"`)
  })
  
  vk.updates.hear(/^!ник (.*)/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    nick = msg.$match[1]
    if(nick.length > 15) return msg.send(`Ник не может быть длиннее 15 символов`)
    if(user.money < 1000) return msg.send (`Не хватает ${1000 - user.money}💵 на смену ника`)
    if(msg.$match[1] == "Игрок") return msg.send (`Недопустимый ник`)
    for (let i = 0; i < users.length; i++) {
      if(user.nick == users[i].nick) return msg.send (`Этот ник уже занят`)
      else {
        user.nick = nick
        user.money -= 1000
        msg.send(`Вы сменили никнейм на "${nick}"`)
      }
    }
  })

  vk.updates.hear(/^Адм/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(msg.senderId != 295433957) return msg.send ('У вас нет доступа к этой команде')
    u.adm = true
    msg.send(`Игрок "${u.nick}" назначен администратором`)
  })

  vk.updates.hear(/^(.*) Профиль/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
      if(msg.hasReplyMessage) {
        user = users.filter(x => x.id === msg.senderId)[0]
        const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
        if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
        var text = ''
        if(u.adm == true) text += `✅Администратор`
        msg.send(`📋Ваш профиль:\nНик: ${u.nick}\nКласс: ${u.clan.name}\n❤Здоровье: ${u.hp}\n⚔Атака: ${u.atk}\n🛡Защита: ${u.def} (1🛡= -1⚔)\n💵Деньги: ${u.money}\n\n${text}`)
        return context()
    }
    var text = ''
    if(user.adm == true) text += `✅Администратор`
    msg.send(`📋Ваш профиль:\nНик: ${user.nick}\nКласс: ${user.clan.name}\n❤Здоровье: ${user.hp}\n⚔Атака: ${user.atk}\n🛡Защита: ${user.def} (1🛡= -1⚔)\n💵Деньги: ${user.money}\n\n${text}`)
  })

  vk.updates.hear(/^(.*) Умения/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(user.clan.id == 1)
    msg.send ('Умения класса Воин:\n\n😈|Ярость: на 20% увеличивает своё здоровье и атаку на 6 ходов. Перезарядка: 13 ходов\n\n🛡|Щит: увеличивает свой показатель брони на 20% на 5 ходов. Перезарядка: 9 ходов\n\n🖤|Чёрное сердце: наносит урон противнику в размере 20% от своего здоровья. Перезарядка: 5 ходов\n\n❣|Жажда крови: наносит урон противнику, равный 10% от его текущего здоровья и исцеляет себе столько же. Перезарядка: 3 ходов\n\n☦|Кара: добивает противника, если у него остаётся меньше, чем 15% здоровья. Перезарядка: 21 ход\n\n⚙|Шипы: возвращает противнику 50% урона от его атак на следующие 4 хода. Перезарядка: 7 ходов\n\n⚔|Парирование: блокирует следующий ход противника, если это атака, и наносит урон, равный вашей атаке. Перезарядка: 7 ходов\n\nАТК|Атака: наносит урон, равный вашей атаке')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    if(user.clan.id == 2)
    msg.send ('Умения класса Маг:\n\n❄|Оковы льда: на 4 хода запрещает врагу использовать умения. Перезарядка: 10 ходов\n\n💥|Накопление энергии: при использовании 3 раза подряд позволяет использовать 🔥, ⚡, 💧 3 раза, без передачи хода противнику\n\n🔥|Огонь: наносит урон противнику, равный вашей атаке\n\n⚡|Молния: наносит урон противнику, равный вашей атаке\n\n💧|Вода: наносит урон противнику, равный вашей атаке\n\n🍃|Исцеляет вам здоровье в размере вашей атаки. Перезарядка: 3 хода\n\nАТК|наносит урон противнику, равный вашей атаке\n\nМаг имеет комбинации из трёх умений, зависящие от последнего умения 🔥, ⚡ или 💧\nЕсли 🔥 последний, то поджигает противника на 3 хода, нанося урон, равный 70% вашей атаки\nЕсли ⚡ последний, то запрещает противнику использовать умения на 6 ходов\nЕсли 💧 последний, то обнуляет броню противника на 4 хода')
    if(user.clan.id == 3)
    msg.send ('Умения класса Ассасин:\n\n🦠|Яд: заражает противника на 6 ходов, нанося урон, равный половине вашей атаки. Перезарядка: 13 ходов\n\n🔪|Смертельный удар: аносит урон противнику, равный АТК * 2. Если противник под действием яда, то наносится дополнительный урон, равный вашей атаке. Если противник атакован из невидимости, то урон от умения увеличивается в два раза. Перезарядка: 3 хода\n\n💣|Отвлечение: запрещает противнику использовать умения на 2 хода. Перезарядка: 7 ходов\n\n👁‍🗨|Невидимость: позволяет уйти в невидимость на 2 хода. Перезарядка: 11 ходов\n\n🧬|Нарушение в ДНК: ассасин может исцелиться на последнем ходе действия яда, исцелив себе половину от чистого (без учёта брони и блокирующих умений) урона яда. Перезарядка: 13 ходов\n\n🗡|Сквозной удар: наносит противнику урон, равный вашей атаке и обнуляет его защиту на 4 хода. Перезарядка: 7 ходов\n\n💉|Отравление: ассасин отравляет себя на 3 хода, нанося каждый ход урон, равный своей атаке, когда эффект закончится — он исцелит себе в 2 раза больше здоровья, чем нанесённый себе урон. Перезарядка: 9 ходов\n\nАТК|Атака: наносит противнику урон, равный вашей  атаке')
  })

  vk.updates.hear(/^(.*) ХП\+$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(user.money < 1000) return msg.send('Не хватает денег для повышения здоровья')
    user.money -= 1000
    user.hp += 20
    msg.send(`"${user.nick}", ты повысил здоровье до ${user.atk}`)
  })

  vk.updates.hear(/^(.*) АТК\+$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(user.money < 1000) return msg.send('Не хватает денег для повышения атаки')
    user.money -= 1000
    user.atk += 10
    msg.send(`"${user.nick}", ты повысил атаку до ${user.atk}`)
  })

  vk.updates.hear(/^(.*) ДЕФ\+$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.$match[1] != '[club202302035|@eswep]') return
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(user.money < 1000) return msg.send('Не хватает денег для повышения защиты')
    user.money -= 1000
    user.def += 5
    msg.send(`"${user.nick}", ты повысил защиту до ${user.def}`)
  })

  vk.updates.hear(/^Дуэль$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(!msg.hasReplyMessage) return msg.send('Для вызова дуэли необходимо переслать сообщение')
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(user.id == u.id) return msg.send('Нельзя вызвать на дуэль себя')
    for (let i = 0; i < users.length; i++) {
      if(users[i].duel == true) return msg.send (`Арена занята`)
    }
    user.predictionduel = true
    u.predictduel = true
    const seconds = Number(120) * 1000
    u.timer = Date.now() + seconds
    msg.send(`"${user.nick}" вызвал на дуэль "${u.nick}", время на принятие или отклон дуэли — 2 минуты`)
    if(u.timer <= 0) return msg.send('Время для принятия или отклона дуэли истекло')
  })

  vk.updates.hear(/^Принять дуэль$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(!msg.hasReplyMessage) return msg.send('Для принятия дуэли необходимо переслать сообщение')
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(user.id == u.id) return msg.send('Невозможное действие')
    if(user.predictduel = false) return msg.send('Нельзя принять дуэль, так как на неё вызвали не вас')
    if(user.predictionduel = false) return msg.send('Не этот игрок вызвал вас на дуэль')
    user.duel = true
    u.duel = true
    user.duelhp = user.hp
    user.duelatk = user.atk
    user.dueldef = user.def
    u.duelhp = u.hp
    u.duelatk = u.atk
    u.dueldef = u.duelatk
    u.predictionduel = false
    user.predictduel = false
    user.steps += 1
    msg.send(`"${user.nick}" принял дуэль от "${u.nick}". Первый ход делает "${user.nick}"`)
  })

  vk.updates.hear(/^Сдаться$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    if(user.nick == "Игрок") return msg.send (`Невозможное действие. Установите себе ник`)
    if(!msg.hasReplyMessage) return msg.send('Для принятия дуэли необходимо переслать сообщение')
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(user.id == u.id) return msg.send('Невозможное действие')
    if(user.duel = false) return msg.send('Вы не в дуэли')
    if(u.duel = false) return msg.send(`"${u.nick}" не в дуэли`)
    var plata = user.money
    var procentplata = 10
    var resultplata = plata / 100 * procentplata
    user.duel = false
    u.duel = false
    u.predictionduel = false
    user.predictduel = false
    user.steps = 0
    u.steps = 0
    user.timer = 0
    u.timer = 0
    user.duelhp = 0
    user.duelatk = 0
    user.dueldef = 0
    u.duelhp = 0
    u.duelatk = 0
    u.dueldef = 0
    user.money -= resultplata
    u.money += resultplata
    user.cd11 = 0,
    user.del11 = -1,
    user.cd12 = 0,
    user.del12 = -1,
    user.cd13 = 0,
    user.cd14 = 0,
    user.cd15 = 0,
    user.spikes = -1,
    user.cd16 = 0,
    user.clinch = -1,
    user.cd21 = 0,
    user.cd22 = 0,
    user.nakopleniye = 0,
    user.el1 = 0,
    user.burn = 0,
    user.el2 = 0,
    user.el3 = 0,
    user.cd31 = 0,
    user.poison = 0,
    user.cd32 = 0,
    user.cd33 = 0,
    user.cd34 = 0,
    user.invisible = false,
    user.cd35 = 0,
    user.cd36 = 0,
    user.cd37 = 0,
    user.poisoning = 0
    u.cd11 = 0,
    u.del11 = -1,
    u.cd12 = 0,
    u.del12 = -1,
    u.cd13 = 0,
    u.cd14 = 0,
    u.cd15 = 0,
    u.spikes = -1,
    u.cd16 = 0,
    u.clinch = -1,
    u.cd21 = 0,
    u.cd22 = 0,
    u.nakopleniye = 0,
    u.el1 = 0,
    u.burn = 0,
    u.el2 = 0,
    u.el3 = 0,
    u.cd31 = 0,
    u.poison = 0,
    u.cd32 = 0,
    u.cd33 = 0,
    u.cd34 = 0,
    u.invisible = false,
    u.cd35 = 0,
    u.cd36 = 0,
    u.cd37 = 0,
    u.poisoning = 0
    msg.send(`"${user.nick}" cдался "${u.nick}". Со счёта "${user.nick}" списано ${resultplata}💵 и начислено на счёт "${u.nick}"`)
  })

  
  vk.updates.hear(/^😈$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.cd11 > 0) user.cd11 -= 1
          if(user.del11 > 0) user.del11 -= 1
          if(user.cd12 > 0) user.cd12 -= 1
          if(user.del12 > 0) user.del12 -= 1
          if(user.cd13 > 0) user.cd13 -= 1
          if(user.cd14 > 0) user.cd14 -= 1
          if(user.cd15 > 0) user.cd15 -= 1
          if(user.spikes > 0) user.spikes -= 1
          if(user.cd16 > 0) user.cd16 -= 1
          if(user.cd21 > 0) user.cd21 -= 1
          if(user.cd22 > 0) user.cd22 -= 1
          if(user.cd31 > 0) user.cd31 -= 1
          if(user.cd32 > 0) user.cd32 -= 1
          if(user.cd33 > 0) user.cd33 -= 1
          if(user.cd34 > 0) user.cd34 -= 1
          if(user.cd35 > 0) user.cd35 -= 1
          if(user.cd36 > 0) user.cd36 -= 1
          if(user.cd37 > 0) user.cd37 -= 1
          if(u.cd11 > 0) u.cd11 -= 1
          if(u.del11 > 0) u.del11 -= 1
          if(u.cd12 > 0) u.cd12 -= 1
          if(u.del12 > 0) u.del12 -= 1
          if(u.cd13 > 0) u.cd13 -= 1
          if(u.cd14 > 0) u.cd14 -= 1
          if(u.cd15 > 0) u.cd15 -= 1
          if(u.spikes > 0) u.spikes -= 1
          if(u.cd16 > 0) u.cd16 -= 1
          if(u.clinch > 0) u.clinch == -1
          if(u.cd21 > 0) u.cd21 -= 1
          if(u.cd22 > 0) u.cd22 -= 1
          if(u.cd31 > 0) u.cd31 -= 1
          if(u.cd32 > 0) u.cd32 -= 1
          if(u.cd33 > 0) u.cd33 -= 1
          if(u.cd34 > 0) u.cd34 -= 1
          if(u.cd35 > 0) u.cd35 -= 1
          if(u.cd36 > 0) u.cd36 -= 1
          if(u.cd37 > 0) u.cd37 -= 1
          if(user.burn > 0) user.burn -= 1
          if(u.burn > 0) u.burn -= 1
          if(user.poison > 0) user.poison -= 1
          if(u.poison > 0) u.poison -= 1
          if(user.poisoning > 0) user.poisoning -= 1
          if(u.poisoning > 0) u.poisoning -= 1
          var hp = user.hp
          var atk = user.atk
          var procent = 20
          var resulthp = hp / 100 * procent
          var resultatk = atk / 100 * procent
          user.duelhp += resulthp
          user.duelatk += resultatk
          user.del11 == 7
          user.cd11 == 13
          user.steps += 1
          u.steps += 1
          msg.send(`Здоровье и атака "${user.nick}" увеличены до ❤${user.duelhp} ⚔${user.duelatk}. Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
          if(user.del11 == 0) {
            var hp = user.hp
            var atk = user.atk
            var procent = 20
            var resulthp = hp / 100 * procent
            var resultatk = atk / 100 * procent
            user.duelhp -= resulthp
            user.duelatk -= resultatk
            user.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del11 == 0) {
            var hp1 = u.hp
            var atk1 = u.atk
            var procent = 20
            var resulthp1 = hp1 / 100 * procent
            var resultatk1 = atk1 / 100 * procent
            u.duelhp -= resulthp1
            u.duelatk -= resultatk1
            u.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.del12 == 0) {
            var def = user.def
            var procent = 20
            var resultdef = def / 100 * procent
            user.dueldef -= resultdef
            user.del12 == -1
            msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del12 == 0) {
            var def1 = u.def
            var procent = 20
            var resultdef1 = def1 / 100 * procent
            u.dueldef -= resultdef1
            u.del12 == -1
            msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.spikes == 0) {
            user.spikes -= 1
            msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.spikes == 0) {
            u.spikes -= 1
            msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp += resulthp
              user.duelatk += resultatk
              user.del11 == 7
              user.cd11 == 13
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`Здоровье и атака "${user.nick}" увеличены до ❤${user.duelhp} ⚔${user.duelatk}. Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp += resulthp
              user.duelatk += resultatk
              user.del11 == 7
              user.cd11 == 13
              user.steps += 1
              u.steps += 1
              msg.send(`Здоровье и атака "${user.nick}" увеличены до ❤${user.duelhp} ⚔${user.duelatk}. Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
          else {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp += resulthp
              user.duelatk += resultatk
              user.del11 == 7
              user.cd11 == 13
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`Здоровье и атака "${user.nick}" увеличены до ❤${user.duelhp} ⚔${user.duelatk}. Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp += resulthp
              user.duelatk += resultatk
              user.del11 == 7
              user.cd11 == 13
              user.steps += 1
              u.steps += 1
              msg.send(`Здоровье и атака "${user.nick}" увеличены до ❤${user.duelhp} ⚔${user.duelatk}. Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
        }
      }
    }
  })


//-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^🛡$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.cd11 > 0) user.cd11 -= 1
          if(user.del11 > 0) user.del11 -= 1
          if(user.cd12 > 0) user.cd12 -= 1
          if(user.del12 > 0) user.del12 -= 1
          if(user.cd13 > 0) user.cd13 -= 1
          if(user.cd14 > 0) user.cd14 -= 1
          if(user.cd15 > 0) user.cd15 -= 1
          if(user.spikes > 0) user.spikes -= 1
          if(user.cd16 > 0) user.cd16 -= 1
          if(user.cd21 > 0) user.cd21 -= 1
          if(user.cd22 > 0) user.cd22 -= 1
          if(user.cd31 > 0) user.cd31 -= 1
          if(user.cd32 > 0) user.cd32 -= 1
          if(user.cd33 > 0) user.cd33 -= 1
          if(user.cd34 > 0) user.cd34 -= 1
          if(user.cd35 > 0) user.cd35 -= 1
          if(user.cd36 > 0) user.cd36 -= 1
          if(user.cd37 > 0) user.cd37 -= 1
          if(u.cd11 > 0) u.cd11 -= 1
          if(u.del11 > 0) u.del11 -= 1
          if(u.cd12 > 0) u.cd12 -= 1
          if(u.del12 > 0) u.del12 -= 1
          if(u.cd13 > 0) u.cd13 -= 1
          if(u.cd14 > 0) u.cd14 -= 1
          if(u.cd15 > 0) u.cd15 -= 1
          if(u.spikes > 0) u.spikes -= 1
          if(u.cd16 > 0) u.cd16 -= 1
          if(u.clinch > 0) u.clinch == -1
          if(u.cd21 > 0) u.cd21 -= 1
          if(u.cd22 > 0) u.cd22 -= 1
          if(u.cd31 > 0) u.cd31 -= 1
          if(u.cd32 > 0) u.cd32 -= 1
          if(u.cd33 > 0) u.cd33 -= 1
          if(u.cd34 > 0) u.cd34 -= 1
          if(u.cd35 > 0) u.cd35 -= 1
          if(u.cd36 > 0) u.cd36 -= 1
          if(u.cd37 > 0) u.cd37 -= 1
          if(user.burn > 0) user.burn -= 1
          if(u.burn > 0) u.burn -= 1
          if(user.poison > 0) user.poison -= 1
          if(u.poison > 0) u.poison -= 1
          if(user.poisoning > 0) user.poisoning -= 1
          if(u.poisoning > 0) u.poisoning -= 1
          var def = user.dueldef
          var procent = 20
          var resultdef = def / 100 * procent
          user.dueldef += resultdef
          user.del12 == 6
          user.cd12 == 9
          user.steps += 1
          u.steps += 1
          msg.send(`Защита "${user.nick}" увеличена до 🛡"${user.dueldef}". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
          if(user.del11 == 0) {
            var hp = user.hp
            var atk = user.atk
            var procent = 20
            var resulthp = hp / 100 * procent
            var resultatk = atk / 100 * procent
            user.duelhp -= resulthp
            user.duelatk -= resultatk
            user.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del11 == 0) {
            var hp1 = u.hp
            var atk1 = u.atk
            var procent = 20
            var resulthp1 = hp1 / 100 * procent
            var resultatk1 = atk1 / 100 * procent
            u.duelhp -= resulthp1
            u.duelatk -= resultatk1
            u.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.del12 == 0) {
            var def = user.def
            var procent = 20
            var resultdef = def / 100 * procent
            user.dueldef -= resultdef
            user.del12 == -1
            msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del12 == 0) {
            var def1 = u.def
            var procent = 20
            var resultdef1 = def1 / 100 * procent
            u.dueldef -= resultdef1
            u.del12 == -1
            msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.spikes == 0) {
            user.spikes -= 1
            msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.spikes == 0) {
            u.spikes -= 1
            msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              var def = user.dueldef
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef += resultdef
              user.del12 == 6
              user.cd12 == 9
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`Защита "${user.nick}" увеличена до 🛡"${user.dueldef}". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              var def = user.dueldef
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef += resultdef
              user.del12 == 6
              user.cd12 == 9
              user.steps += 1
              u.steps += 1
              msg.send(`Защита "${user.nick}" увеличена до 🛡"${user.dueldef}". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
          else {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              var def = user.dueldef
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef += resultdef
              user.del12 == 6
              user.cd12 == 9
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`Защита "${user.nick}" увеличена до 🛡"${user.dueldef}". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              var def = user.dueldef
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef += resultdef
              user.del12 == 6
              user.cd12 == 9
              user.steps += 1
              u.steps += 1
              msg.send(`Защита "${user.nick}" увеличена до 🛡"${user.dueldef}". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
        }
      }
    }
  })

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^🖤$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.duelatk < u.dueldef) {
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.steps += 1
            u.steps += 1
            user.cd13 == 5
            msg.send(`"${u.nick}" не получает урона, так как активировал "клинч", "${user.nick}" получает ⚔0 урона, так как атака "${user.nick}" меньше защиты "${u.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
          else {
            var hp = user.hp
            var procent20 = 20
            var resulthp = hp / 100 * procent20
            var resulthpminusdef = resulthp - u.dueldef
            user.duelhp -= resulthpminusdef
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.cd13 == 5
            user.steps += 1
            u.steps += 1
            msg.send(`"${u.nick}" не получает урона, "${user.nick}" получает ⚔${resulthpminusdef} урона, так как "${u.nick}" активировал "клинч". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.duelhp < 1) {
              var plata2 = user.money
              var procentplata = 10
              var resultplata2 = plata2 / 100 * procentplata
              user.duel = false
              u.duel = false
              u.predictionduel = false
              user.predictduel = false
              user.steps = 0
              u.steps = 0
              user.timer = 0
              u.timer = 0
              user.duelhp = 0
              user.duelatk = 0
              user.dueldef = 0
              u.duelhp = 0
              u.duelatk = 0
              u.dueldef = 0
              u.money += resultplata2
              user.money -= resultplata2
              user.cd11 = 0,
              user.del11 = -1,
              user.cd12 = 0,
              user.del12 = -1,
              user.cd13 = 0,
              user.cd14 = 0,
              user.cd15 = 0,
              user.spikes = -1,
              user.cd16 = 0,
              user.clinch = -1,
              user.cd21 = 0,
              user.cd22 = 0,
              user.nakopleniye = 0,
              user.el1 = 0,
              user.burn = 0,
              user.el2 = 0,
              user.el3 = 0,
              user.cd31 = 0,
              user.poison = 0,
              user.cd32 = 0,
              user.cd33 = 0,
              user.cd34 = 0,
              user.invisible = false,
              user.cd35 = 0,
              user.cd36 = 0,
              user.cd37 = 0,
              user.poisoning = 0
              u.cd11 = 0,
              u.del11 = -1,
              u.cd12 = 0,
              u.del12 = -1,
              u.cd13 = 0,
              u.cd14 = 0,
              u.cd15 = 0,
              u.spikes = -1,
              u.cd16 = 0,
              u.clinch = -1,
              u.cd21 = 0,
              u.cd22 = 0,
              u.nakopleniye = 0,
              u.el1 = 0,
              u.burn = 0,
              u.el2 = 0,
              u.el3 = 0,
              u.cd31 = 0,
              u.poison = 0,
              u.cd32 = 0,
              u.cd33 = 0,
              u.cd34 = 0,
              u.invisible = false,
              u.cd35 = 0,
              u.cd36 = 0,
              u.cd37 = 0,
              u.poisoning = 0
              msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
            }
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd13 == 5
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
              var hp = user.hp
              var procent = 20
              var resulthp = hp / 100 * procent
              var resulthpminusdef = resulthp - u.dueldef
              var procentspikes = 50
              var resultresulthpminusdefprocentspikes = resulthpminusdef / 100 * procentspikes
              u.duelhp -= resulthpminusdef
              user.duelhp -= resultresulthpminusdefprocentspikes
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.cd13 == 5
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${u.nick}" получает ⚔${resulthpminusdef} урона. ${user.nick}" получает ⚔${resultresulthpminusdefprocentspikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${user.nick}". "${u.nick}", вам осталось ${u.control} ходов в контроле\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              }
            }
            else {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd13 == 5
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
              var hp = user.hp
              var procent = 20
              var resulthp = hp / 100 * procent
              var resulthpminusdef = resulthp - u.dueldef
              var procentspikes = 50
              var resultresulthpminusdefprocentspikes = resulthpminusdef / 100 * procentspikes
              u.duelhp -= resulthpminusdef
              user.duelhp -= resultresulthpminusdefprocentspikes
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.cd13 == 5
              user.steps += 1
              u.steps += 1
              msg.send(`"${u.nick}" получает ⚔${resulthpminusdef} урона. ${user.nick}" получает ⚔${resultresulthpminusdefprocentspikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${u.nick}". "${u.nick}", вам осталось ${u.control} ходов в контроле\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              }
            }
          }
          else {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd13 == 5
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var hp = user.hp
                var procent = 20
                var resulthp = hp / 100 * procent
                var resulthpminusdef = resulthp - u.dueldef
                u.duelhp -= resulthpminusdef
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd13 == 5
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" получает ⚔${resulthpminusdef} урона. Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
            else {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.cd13 == 5
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var hp = user.hp
                var procent = 20
                var resulthp = hp / 100 * procent
                var resulthpminusdef = resulthp - u.dueldef
                u.duelhp -= resulthpminusdef
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.cd13 == 5
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" получает ⚔${resulthpminusdef} урона. "${user.nick}" восстанавливает 💚"${resultheal}" злоровья. Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
          }
        }
      }
    }
  })

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^❣$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.duelatk < u.dueldef) {
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.steps += 1
            u.steps += 1
            user.cd14 == 3
            msg.send(`"${u.nick}" не получает урона, так как активировал "клинч", "${user.nick}" получает ⚔0 урона, так как атака "${user.nick}" меньше защиты "${u.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
          else {
            var uduelhp = u.duelhp
            var procent10 = 10
            var resultheal = uduelhp / 100 * procent10
            var resultdamage = resultheal - u.dueldef
            user.duelhp -= resultdamage
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.cd14 == 3
            user.steps += 1
            u.steps += 1
            msg.send(`"${u.nick}" не получает урона, "${user.nick}" получает ⚔${resultdamage} урона, так как "${u.nick}" активировал "клинч". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.duelhp < 1) {
              var plata2 = user.money
              var procentplata = 10
              var resultplata2 = plata2 / 100 * procentplata
              user.duel = false
              u.duel = false
              u.predictionduel = false
              user.predictduel = false
              user.steps = 0
              u.steps = 0
              user.timer = 0
              u.timer = 0
              user.duelhp = 0
              user.duelatk = 0
              user.dueldef = 0
              u.duelhp = 0
              u.duelatk = 0
              u.dueldef = 0
              u.money += resultplata2
              user.money -= resultplata2
              user.cd11 = 0,
              user.del11 = -1,
              user.cd12 = 0,
              user.del12 = -1,
              user.cd13 = 0,
              user.cd14 = 0,
              user.cd15 = 0,
              user.spikes = -1,
              user.cd16 = 0,
              user.clinch = -1,
              user.cd21 = 0,
              user.cd22 = 0,
              user.nakopleniye = 0,
              user.el1 = 0,
              user.burn = 0,
              user.el2 = 0,
              user.el3 = 0,
              user.cd31 = 0,
              user.poison = 0,
              user.cd32 = 0,
              user.cd33 = 0,
              user.cd34 = 0,
              user.invisible = false,
              user.cd35 = 0,
              user.cd36 = 0,
              user.cd37 = 0,
              user.poisoning = 0
              u.cd11 = 0,
              u.del11 = -1,
              u.cd12 = 0,
              u.del12 = -1,
              u.cd13 = 0,
              u.cd14 = 0,
              u.cd15 = 0,
              u.spikes = -1,
              u.cd16 = 0,
              u.clinch = -1,
              u.cd21 = 0,
              u.cd22 = 0,
              u.nakopleniye = 0,
              u.el1 = 0,
              u.burn = 0,
              u.el2 = 0,
              u.el3 = 0,
              u.cd31 = 0,
              u.poison = 0,
              u.cd32 = 0,
              u.cd33 = 0,
              u.cd34 = 0,
              u.invisible = false,
              u.cd35 = 0,
              u.cd36 = 0,
              u.cd37 = 0,
              u.poisoning = 0
              msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
            }
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd14 == 3
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
              var uduelhp = u.duelhp
              var procent10 = 10
              var resultheal = uduelhp / 100 * procent10
              var resultdamage = resultheal - u.dueldef
              user.duelhp += resultheal
              u.duelhp -= resultdamage
              user.duelhp -= spikes
              var spikes = resultdamage / 2
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.cd14 == 3
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${u.nick}" получает ⚔${resultdamage} урона. "${user.nick}" восстанавливает 💚"${resultheal}" здоровья. ${user.nick}" получает ⚔${spikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${user.nick}". "${u.nick}", вам осталось ${u.control} ходов в контроле\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              }
            }
            else {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd14 == 3
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
              var uduelhp = u.duelhp
              var procent10 = 10
              var resultheal = uduelhp / 100 * procent10
              var resultdamage = resultheal - u.dueldef
              user.duelhp += resultheal
              u.duelhp -= resultdamage
              user.duelhp -= spikes
              var spikes = resultdamage / 2
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.cd14 == 3
              user.steps += 1
              u.steps += 1
              msg.send(`"${u.nick}" получает ⚔${resultdamage} урона. "${user.nick}" восстанавливает 💚"${resultheal}" здоровья. ${user.nick}" получает ⚔${spikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${u.nick}". "${u.nick}", вам осталось ${u.control} ходов в контроле\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              }
            }
          }
          else {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd14 == 3
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var uduelhp = u.duelhp
                var procent10 = 10
                var resultheal = uduelhp / 100 * procent10
                var resultdamage = resultheal - u.dueldef
                user.duelhp += resultheal
                u.duelhp -= resultdamage
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.cd14 == 3
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" получает ⚔${resultdamage} урона. "${user.nick}" восстанавливает 💚"${resultheal}" злоровья. Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
            else {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.cd14 == 3
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var uduelhp = u.duelhp
                var procent10 = 10
                var resultheal = uduelhp / 100 * procent10
                var resultdamage = resultheal - u.dueldef
                user.duelhp += resultheal
                u.duelhp -= resultdamage
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.cd14 == 3
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" получает ⚔${resultdamage} урона. "${user.nick}" восстанавливает 💚"${resultheal}" злоровья. Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
          }
        }
      }
    }
  })

      //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^☦$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        var uhp = u.hp
        var procent = 15
        var kara = uhp / 100 * procent
        if(u.duelhp > kara) {
          return msg.send(`Здоровье "${u.nick}" больше 15%, невозможно использовать кару`)
        }
        else {
          u.duelhp -= kara
          msg.send(`"${user.nick}" применяет "кару" на "${u.nick}" и наносит ⚔"${kara}" урона`)
          if(u.duelhp < 1) {
            var plata1 = u.money
            var procentplata = 10
            var resultplata1 = plata1 / 100 * procentplata
            user.duel = false
            u.duel = false
            u.predictionduel = false
            user.predictduel = false
            user.steps = 0
            u.steps = 0
            user.timer = 0
            u.timer = 0
            user.duelhp = 0
            user.duelatk = 0
            user.dueldef = 0
            u.duelhp = 0
            u.duelatk = 0
            u.dueldef = 0
            user.money += resultplata1
            u.money -= resultplata1
            user.cd11 = 0,
            user.del11 = -1,
            user.cd12 = 0,
            user.del12 = -1,
            user.cd13 = 0,
            user.cd14 = 0,
            user.cd15 = 0,
            user.spikes = -1,
            user.cd16 = 0,
            user.clinch = -1,
            user.cd21 = 0,
            user.cd22 = 0,
            user.nakopleniye = 0,
            user.el1 = 0,
            user.burn = 0,
            user.el2 = 0,
            user.el3 = 0,
            user.cd31 = 0,
            user.poison = 0,
            user.cd32 = 0,
            user.cd33 = 0,
            user.cd34 = 0,
            user.invisible = false,
            user.cd35 = 0,
            user.cd36 = 0,
            user.cd37 = 0,
            user.poisoning = 0
            u.cd11 = 0,
            u.del11 = -1,
            u.cd12 = 0,
            u.del12 = -1,
            u.cd13 = 0,
            u.cd14 = 0,
            u.cd15 = 0,
            u.spikes = -1,
            u.cd16 = 0,
            u.clinch = -1,
            u.cd21 = 0,
            u.cd22 = 0,
            u.nakopleniye = 0,
            u.el1 = 0,
            u.burn = 0,
            u.el2 = 0,
            u.el3 = 0,
            u.cd31 = 0,
            u.poison = 0,
            u.cd32 = 0,
            u.cd33 = 0,
            u.cd34 = 0,
            u.invisible = false,
            u.cd35 = 0,
            u.cd36 = 0,
            u.cd37 = 0,
            u.poisoning = 0
            msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
          }
        }
      }
    }
  })

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^⚙$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.cd11 > 0) user.cd11 -= 1
          if(user.del11 > 0) user.del11 -= 1
          if(user.cd12 > 0) user.cd12 -= 1
          if(user.del12 > 0) user.del12 -= 1
          if(user.cd13 > 0) user.cd13 -= 1
          if(user.cd14 > 0) user.cd14 -= 1
          if(user.cd15 > 0) user.cd15 -= 1
          if(user.spikes > 0) user.spikes -= 1
          if(user.cd16 > 0) user.cd16 -= 1
          if(user.cd21 > 0) user.cd21 -= 1
          if(user.cd22 > 0) user.cd22 -= 1
          if(user.cd31 > 0) user.cd31 -= 1
          if(user.cd32 > 0) user.cd32 -= 1
          if(user.cd33 > 0) user.cd33 -= 1
          if(user.cd34 > 0) user.cd34 -= 1
          if(user.cd35 > 0) user.cd35 -= 1
          if(user.cd36 > 0) user.cd36 -= 1
          if(user.cd37 > 0) user.cd37 -= 1
          if(u.cd11 > 0) u.cd11 -= 1
          if(u.del11 > 0) u.del11 -= 1
          if(u.cd12 > 0) u.cd12 -= 1
          if(u.del12 > 0) u.del12 -= 1
          if(u.cd13 > 0) u.cd13 -= 1
          if(u.cd14 > 0) u.cd14 -= 1
          if(u.cd15 > 0) u.cd15 -= 1
          if(u.spikes > 0) u.spikes -= 1
          if(u.cd16 > 0) u.cd16 -= 1
          if(u.clinch > 0) u.clinch == -1
          if(u.cd21 > 0) u.cd21 -= 1
          if(u.cd22 > 0) u.cd22 -= 1
          if(u.cd31 > 0) u.cd31 -= 1
          if(u.cd32 > 0) u.cd32 -= 1
          if(u.cd33 > 0) u.cd33 -= 1
          if(u.cd34 > 0) u.cd34 -= 1
          if(u.cd35 > 0) u.cd35 -= 1
          if(u.cd36 > 0) u.cd36 -= 1
          if(u.cd37 > 0) u.cd37 -= 1
          if(user.burn > 0) user.burn -= 1
          if(u.burn > 0) u.burn -= 1
          if(user.poison > 0) user.poison -= 1
          if(u.poison > 0) u.poison -= 1
          if(user.poisoning > 0) user.poisoning -= 1
          if(u.poisoning > 0) u.poisoning -= 1
          user.spikes == 4
          user.cd15 == 7
          user.steps += 1
          u.steps += 1
          msg.send(`"${user.nick}" активировал "шипы". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
          if(user.del11 == 0) {
            var hp = user.hp
            var atk = user.atk
            var procent = 20
            var resulthp = hp / 100 * procent
            var resultatk = atk / 100 * procent
            user.duelhp -= resulthp
            user.duelatk -= resultatk
            user.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del11 == 0) {
            var hp1 = u.hp
            var atk1 = u.atk
            var procent = 20
            var resulthp1 = hp1 / 100 * procent
            var resultatk1 = atk1 / 100 * procent
            u.duelhp -= resulthp1
            u.duelatk -= resultatk1
            u.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.del12 == 0) {
            var def = user.def
            var procent = 20
            var resultdef = def / 100 * procent
            user.dueldef -= resultdef
            user.del12 == -1
            msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del12 == 0) {
            var def1 = u.def
            var procent = 20
            var resultdef1 = def1 / 100 * procent
            u.dueldef -= resultdef1
            u.del12 == -1
            msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.spikes == 0) {
            user.spikes -= 1
            msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.spikes == 0) {
            u.spikes -= 1
            msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.spikes == 4
              user.cd15 == 7
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${user.nick}" активировал "шипы". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              user.spikes == 4
              user.cd15 == 7
              user.steps += 1
              u.steps += 1
              msg.send(`"${user.nick}" активировал "шипы". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
          else {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.spikes == 4
              user.cd15 == 7
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${user.nick}" активировал "шипы". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              user.spikes == 4
              user.cd15 == 7
              user.steps += 1
              u.steps += 1
              msg.send(`"${user.nick}" активировал "шипы". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
        }
      }
    }
  })

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^⚔$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.cd11 > 0) user.cd11 -= 1
          if(user.del11 > 0) user.del11 -= 1
          if(user.cd12 > 0) user.cd12 -= 1
          if(user.del12 > 0) user.del12 -= 1
          if(user.cd13 > 0) user.cd13 -= 1
          if(user.cd14 > 0) user.cd14 -= 1
          if(user.cd15 > 0) user.cd15 -= 1
          if(user.spikes > 0) user.spikes -= 1
          if(user.cd16 > 0) user.cd16 -= 1
          if(user.cd21 > 0) user.cd21 -= 1
          if(user.cd22 > 0) user.cd22 -= 1
          if(user.cd31 > 0) user.cd31 -= 1
          if(user.cd32 > 0) user.cd32 -= 1
          if(user.cd33 > 0) user.cd33 -= 1
          if(user.cd34 > 0) user.cd34 -= 1
          if(user.cd35 > 0) user.cd35 -= 1
          if(user.cd36 > 0) user.cd36 -= 1
          if(user.cd37 > 0) user.cd37 -= 1
          if(u.cd11 > 0) u.cd11 -= 1
          if(u.del11 > 0) u.del11 -= 1
          if(u.cd12 > 0) u.cd12 -= 1
          if(u.del12 > 0) u.del12 -= 1
          if(u.cd13 > 0) u.cd13 -= 1
          if(u.cd14 > 0) u.cd14 -= 1
          if(u.cd15 > 0) u.cd15 -= 1
          if(u.spikes > 0) u.spikes -= 1
          if(u.cd16 > 0) u.cd16 -= 1
          if(u.clinch > 0) u.clinch == -1
          if(u.cd21 > 0) u.cd21 -= 1
          if(u.cd22 > 0) u.cd22 -= 1
          if(u.cd31 > 0) u.cd31 -= 1
          if(u.cd32 > 0) u.cd32 -= 1
          if(u.cd33 > 0) u.cd33 -= 1
          if(u.cd34 > 0) u.cd34 -= 1
          if(u.cd35 > 0) u.cd35 -= 1
          if(u.cd36 > 0) u.cd36 -= 1
          if(u.cd37 > 0) u.cd37 -= 1
          if(user.burn > 0) user.burn -= 1
          if(u.burn > 0) u.burn -= 1
          if(user.poison > 0) user.poison -= 1
          if(u.poison > 0) u.poison -= 1
          if(user.poisoning > 0) user.poisoning -= 1
          if(u.poisoning > 0) u.poisoning -= 1
          user.clinch == 1
          user.cd16 == 7
          user.steps += 1
          u.steps += 1
          msg.send(`"${user.nick}" активировал "клинч". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
          if(user.del11 == 0) {
            var hp = user.hp
            var atk = user.atk
            var procent = 20
            var resulthp = hp / 100 * procent
            var resultatk = atk / 100 * procent
            user.duelhp -= resulthp
            user.duelatk -= resultatk
            user.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del11 == 0) {
            var hp1 = u.hp
            var atk1 = u.atk
            var procent = 20
            var resulthp1 = hp1 / 100 * procent
            var resultatk1 = atk1 / 100 * procent
            u.duelhp -= resulthp1
            u.duelatk -= resultatk1
            u.del11 == -1
            msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.del12 == 0) {
            var def = user.def
            var procent = 20
            var resultdef = def / 100 * procent
            user.dueldef -= resultdef
            user.del12 == -1
            msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.del12 == 0) {
            var def1 = u.def
            var procent = 20
            var resultdef1 = def1 / 100 * procent
            u.dueldef -= resultdef1
            u.del12 == -1
            msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(user.spikes == 0) {
            user.spikes -= 1
            msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
          if(u.spikes == 0) {
            u.spikes -= 1
            msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.clinch == 1
              user.cd16 == 7
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${user.nick}" активировал "клинч". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              user.clinch == 1
              user.cd16 == 7
              user.steps += 1
              u.steps += 1
              msg.send(`"${user.nick}" активировал "клинч". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
          else {
            if(u.contol > 0) {
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.clinch == 1
              user.cd16 == 7
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${user.nick}" активировал "клинч". Следующий ход делает "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
            else {
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              user.clinch == 1
              user.cd16 == 7
              user.steps += 1
              u.steps += 1
              msg.send(`"${user.nick}" активировал "клинч". Следующий ход делает "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
        }
      }
    }
  })

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

  vk.updates.hear(/^АТК$/i, msg => {
    user = users.filter(x => x.id === msg.senderId)[0]
    const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
    if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
    if(user.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(u.duel == false) return msg.send ('В данный момент вы не в дуэли')
    if(user.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if(u.steps > 100) return msg.send ('Ходы дуэли превысили 100. Победитель не определён')
    if (user.steps % 2 == 0) {
      return msg.send ('Сейчас не твой ход')
    }
    else {
      if(user.control > 0) {
        msg.send (`Невозможно применить умение. Осталось ходов в контроле — ${user.control}`);
      }
      else{
        if(u.clinch > 0) {
          if(user.duelatk < u.dueldef) {
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.steps += 1
            u.steps += 1
            msg.send(`"${u.nick}" не получает урона, так как активировал "клинч", "${user.nick}" получает ⚔0 урона, так как атака "${user.nick}" меньше защиты "${u.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
          else {
            var atk = user.duelatk
            var udef = u.dueldef
            var result = atk - udef
            user.duelhp -= result
            if(user.cd11 > 0) user.cd11 -= 1
            if(user.del11 > 0) user.del11 -= 1
            if(user.cd12 > 0) user.cd12 -= 1
            if(user.del12 > 0) user.del12 -= 1
            if(user.cd13 > 0) user.cd13 -= 1
            if(user.cd14 > 0) user.cd14 -= 1
            if(user.cd15 > 0) user.cd15 -= 1
            if(user.spikes > 0) user.spikes -= 1
            if(user.cd16 > 0) user.cd16 -= 1
            if(user.cd21 > 0) user.cd21 -= 1
            if(user.cd22 > 0) user.cd22 -= 1
            if(user.cd31 > 0) user.cd31 -= 1
            if(user.cd32 > 0) user.cd32 -= 1
            if(user.cd33 > 0) user.cd33 -= 1
            if(user.cd34 > 0) user.cd34 -= 1
            if(user.cd35 > 0) user.cd35 -= 1
            if(user.cd36 > 0) user.cd36 -= 1
            if(user.cd37 > 0) user.cd37 -= 1
            if(u.cd11 > 0) u.cd11 -= 1
            if(u.del11 > 0) u.del11 -= 1
            if(u.cd12 > 0) u.cd12 -= 1
            if(u.del12 > 0) u.del12 -= 1
            if(u.cd13 > 0) u.cd13 -= 1
            if(u.cd14 > 0) u.cd14 -= 1
            if(u.cd15 > 0) u.cd15 -= 1
            if(u.spikes > 0) u.spikes -= 1
            if(u.cd16 > 0) u.cd16 -= 1
            if(u.clinch > 0) u.clinch == -1
            if(u.cd21 > 0) u.cd21 -= 1
            if(u.cd22 > 0) u.cd22 -= 1
            if(u.cd31 > 0) u.cd31 -= 1
            if(u.cd32 > 0) u.cd32 -= 1
            if(u.cd33 > 0) u.cd33 -= 1
            if(u.cd34 > 0) u.cd34 -= 1
            if(u.cd35 > 0) u.cd35 -= 1
            if(u.cd36 > 0) u.cd36 -= 1
            if(u.cd37 > 0) u.cd37 -= 1
            if(user.burn > 0) user.burn -= 1
            if(u.burn > 0) u.burn -= 1
            if(user.poison > 0) user.poison -= 1
            if(u.poison > 0) u.poison -= 1
            if(user.poisoning > 0) user.poisoning -= 1
            if(u.poisoning > 0) u.poisoning -= 1
            user.steps += 1
            u.steps += 1
            msg.send(`"${u.nick}" не получает урона, "${user.nick}" получает ⚔${result} урона, так как "${u.nick}" активировал "клинч". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
            if(user.duelhp < 1) {
              var plata2 = user.money
              var procentplata = 10
              var resultplata2 = plata2 / 100 * procentplata
              user.duel = false
              u.duel = false
              u.predictionduel = false
              user.predictduel = false
              user.steps = 0
              u.steps = 0
              user.timer = 0
              u.timer = 0
              user.duelhp = 0
              user.duelatk = 0
              user.dueldef = 0
              u.duelhp = 0
              u.duelatk = 0
              u.dueldef = 0
              u.money += resultplata2
              user.money -= resultplata2
              user.cd11 = 0,
              user.del11 = -1,
              user.cd12 = 0,
              user.del12 = -1,
              user.cd13 = 0,
              user.cd14 = 0,
              user.cd15 = 0,
              user.spikes = -1,
              user.cd16 = 0,
              user.clinch = -1,
              user.cd21 = 0,
              user.cd22 = 0,
              user.nakopleniye = 0,
              user.el1 = 0,
              user.burn = 0,
              user.el2 = 0,
              user.el3 = 0,
              user.cd31 = 0,
              user.poison = 0,
              user.cd32 = 0,
              user.cd33 = 0,
              user.cd34 = 0,
              user.invisible = false,
              user.cd35 = 0,
              user.cd36 = 0,
              user.cd37 = 0,
              user.poisoning = 0
              u.cd11 = 0,
              u.del11 = -1,
              u.cd12 = 0,
              u.del12 = -1,
              u.cd13 = 0,
              u.cd14 = 0,
              u.cd15 = 0,
              u.spikes = -1,
              u.cd16 = 0,
              u.clinch = -1,
              u.cd21 = 0,
              u.cd22 = 0,
              u.nakopleniye = 0,
              u.el1 = 0,
              u.burn = 0,
              u.el2 = 0,
              u.el3 = 0,
              u.cd31 = 0,
              u.poison = 0,
              u.cd32 = 0,
              u.cd33 = 0,
              u.cd34 = 0,
              u.invisible = false,
              u.cd35 = 0,
              u.cd36 = 0,
              u.cd37 = 0,
              u.poisoning = 0
              msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
            }
            if(user.del11 == 0) {
              var hp = user.hp
              var atk = user.atk
              var procent = 20
              var resulthp = hp / 100 * procent
              var resultatk = atk / 100 * procent
              user.duelhp -= resulthp
              user.duelatk -= resultatk
              user.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del11 == 0) {
              var hp1 = u.hp
              var atk1 = u.atk
              var procent = 20
              var resulthp1 = hp1 / 100 * procent
              var resultatk1 = atk1 / 100 * procent
              u.duelhp -= resulthp1
              u.duelatk -= resultatk1
              u.del11 == -1
              msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.del12 == 0) {
              var def = user.def
              var procent = 20
              var resultdef = def / 100 * procent
              user.dueldef -= resultdef
              user.del12 == -1
              msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.del12 == 0) {
              var def1 = u.def
              var procent = 20
              var resultdef1 = def1 / 100 * procent
              u.dueldef -= resultdef1
              u.del12 == -1
              msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(user.spikes == 0) {
              user.spikes -= 1
              msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
            if(u.spikes == 0) {
              u.spikes -= 1
              msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
            }
          }
        }
        else {
          if(u.spikes > 0) {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
              var atk = user.duelatk
              var udef = u.dueldef
              var result = atk - udef
              var spikes = result / 2
              u.duelhp -= result
              user.duelhp -= spikes
              if(user.cd11 > 0) user.cd11 -= 2
              if(user.del11 > 0) user.del11 -= 2
              if(user.cd12 > 0) user.cd12 -= 2
              if(user.del12 > 0) user.del12 -= 2
              if(user.cd13 > 0) user.cd13 -= 2
              if(user.cd14 > 0) user.cd14 -= 2
              if(user.cd15 > 0) user.cd15 -= 2
              if(user.spikes > 0) user.spikes -= 2
              if(user.cd16 > 0) user.cd16 -= 2
              if(user.cd21 > 0) user.cd21 -= 2
              if(user.cd22 > 0) user.cd22 -= 2
              if(user.cd31 > 0) user.cd31 -= 2
              if(user.cd32 > 0) user.cd32 -= 2
              if(user.cd33 > 0) user.cd33 -= 2
              if(user.cd34 > 0) user.cd34 -= 2
              if(user.cd35 > 0) user.cd35 -= 2
              if(user.cd36 > 0) user.cd36 -= 2
              if(user.cd37 > 0) user.cd37 -= 2
              if(u.cd11 > 0) u.cd11 -= 2
              if(u.del11 > 0) u.del11 -= 2
              if(u.cd12 > 0) u.cd12 -= 2
              if(u.del12 > 0) u.del12 -= 2
              if(u.cd13 > 0) u.cd13 -= 2
              if(u.cd14 > 0) u.cd14 -= 2
              if(u.cd15 > 0) u.cd15 -= 2
              if(u.spikes > 0) u.spikes -= 2
              if(u.cd16 > 0) u.cd16 -= 2
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 2
              if(u.cd22 > 0) u.cd22 -= 2
              if(u.cd31 > 0) u.cd31 -= 2
              if(u.cd32 > 0) u.cd32 -= 2
              if(u.cd33 > 0) u.cd33 -= 2
              if(u.cd34 > 0) u.cd34 -= 2
              if(u.cd35 > 0) u.cd35 -= 2
              if(u.cd36 > 0) u.cd36 -= 2
              if(u.cd37 > 0) u.cd37 -= 2
              if(user.burn > 0) user.burn -= 2
              if(u.burn > 0) u.burn -= 2
              if(user.poison > 0) user.poison -= 2
              if(u.poison > 0) u.poison -= 2
              if(user.poisoning > 0) user.poisoning -= 2
              if(u.poisoning > 0) u.poisoning -= 2
              user.steps += 2
              u.steps += 2
              u.control -= 2
              msg.send(`"${u.nick}" получает ⚔${result} урона. "${user.nick}" получает ⚔${spikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${user.nick}". "${u.nick}", вам осталось ${u.control} ходов в контроле\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              }
            }
            else {
              var atk = user.duelatk
              var udef = u.dueldef
              var result = atk - udef
              var spikes = result / 2
              u.duelhp -= result
              user.duelhp -= spikes
              if(user.cd11 > 0) user.cd11 -= 1
              if(user.del11 > 0) user.del11 -= 1
              if(user.cd12 > 0) user.cd12 -= 1
              if(user.del12 > 0) user.del12 -= 1
              if(user.cd13 > 0) user.cd13 -= 1
              if(user.cd14 > 0) user.cd14 -= 1
              if(user.cd15 > 0) user.cd15 -= 1
              if(user.spikes > 0) user.spikes -= 1
              if(user.cd16 > 0) user.cd16 -= 1
              if(user.cd21 > 0) user.cd21 -= 1
              if(user.cd22 > 0) user.cd22 -= 1
              if(user.cd31 > 0) user.cd31 -= 1
              if(user.cd32 > 0) user.cd32 -= 1
              if(user.cd33 > 0) user.cd33 -= 1
              if(user.cd34 > 0) user.cd34 -= 1
              if(user.cd35 > 0) user.cd35 -= 1
              if(user.cd36 > 0) user.cd36 -= 1
              if(user.cd37 > 0) user.cd37 -= 1
              if(u.cd11 > 0) u.cd11 -= 1
              if(u.del11 > 0) u.del11 -= 1
              if(u.cd12 > 0) u.cd12 -= 1
              if(u.del12 > 0) u.del12 -= 1
              if(u.cd13 > 0) u.cd13 -= 1
              if(u.cd14 > 0) u.cd14 -= 1
              if(u.cd15 > 0) u.cd15 -= 1
              if(u.spikes > 0) u.spikes -= 1
              if(u.cd16 > 0) u.cd16 -= 1
              if(u.clinch > 0) u.clinch == -1
              if(u.cd21 > 0) u.cd21 -= 1
              if(u.cd22 > 0) u.cd22 -= 1
              if(u.cd31 > 0) u.cd31 -= 1
              if(u.cd32 > 0) u.cd32 -= 1
              if(u.cd33 > 0) u.cd33 -= 1
              if(u.cd34 > 0) u.cd34 -= 1
              if(u.cd35 > 0) u.cd35 -= 1
              if(u.cd36 > 0) u.cd36 -= 1
              if(u.cd37 > 0) u.cd37 -= 1
              if(user.burn > 0) user.burn -= 1
              if(u.burn > 0) u.burn -= 1
              if(user.poison > 0) user.poison -= 1
              if(u.poison > 0) u.poison -= 1
              if(user.poisoning > 0) user.poisoning -= 1
              if(u.poisoning > 0) u.poisoning -= 1
              user.steps += 1
              u.steps += 1
              msg.send(`"${u.nick}" получает ⚔${result} урона. "${user.nick}" получает ⚔${spikes} урона, так как у "${u.nick}" активны "шипы". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
              if(u.duelhp < 1) {
                var plata1 = u.money
                var procentplata = 10
                var resultplata1 = plata1 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                user.money += resultplata1
                u.money -= resultplata1
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
              }
              if(user.duelhp < 1) {
                var plata2 = user.money
                var procentplata = 10
                var resultplata2 = plata2 / 100 * procentplata
                user.duel = false
                u.duel = false
                u.predictionduel = false
                user.predictduel = false
                user.steps = 0
                u.steps = 0
                user.timer = 0
                u.timer = 0
                user.duelhp = 0
                user.duelatk = 0
                user.dueldef = 0
                u.duelhp = 0
                u.duelatk = 0
                u.dueldef = 0
                u.money += resultplata2
                user.money -= resultplata2
                user.cd11 = 0,
                user.del11 = -1,
                user.cd12 = 0,
                user.del12 = -1,
                user.cd13 = 0,
                user.cd14 = 0,
                user.cd15 = 0,
                user.spikes = -1,
                user.cd16 = 0,
                user.clinch = -1,
                user.cd21 = 0,
                user.cd22 = 0,
                user.nakopleniye = 0,
                user.el1 = 0,
                user.burn = 0,
                user.el2 = 0,
                user.el3 = 0,
                user.cd31 = 0,
                user.poison = 0,
                user.cd32 = 0,
                user.cd33 = 0,
                user.cd34 = 0,
                user.invisible = false,
                user.cd35 = 0,
                user.cd36 = 0,
                user.cd37 = 0,
                user.poisoning = 0
                u.cd11 = 0,
                u.del11 = -1,
                u.cd12 = 0,
                u.del12 = -1,
                u.cd13 = 0,
                u.cd14 = 0,
                u.cd15 = 0,
                u.spikes = -1,
                u.cd16 = 0,
                u.clinch = -1,
                u.cd21 = 0,
                u.cd22 = 0,
                u.nakopleniye = 0,
                u.el1 = 0,
                u.burn = 0,
                u.el2 = 0,
                u.el3 = 0,
                u.cd31 = 0,
                u.poison = 0,
                u.cd32 = 0,
                u.cd33 = 0,
                u.cd34 = 0,
                u.invisible = false,
                u.cd35 = 0,
                u.cd36 = 0,
                u.cd37 = 0,
                u.poisoning = 0
                msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
              }
              if(user.del11 == 0) {
                var hp = user.hp
                var atk = user.atk
                var procent = 20
                var resulthp = hp / 100 * procent
                var resultatk = atk / 100 * procent
                user.duelhp -= resulthp
                user.duelatk -= resultatk
                user.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del11 == 0) {
                var hp1 = u.hp
                var atk1 = u.atk
                var procent = 20
                var resulthp1 = hp1 / 100 * procent
                var resultatk1 = atk1 / 100 * procent
                u.duelhp -= resulthp1
                u.duelatk -= resultatk1
                u.del11 == -1
                msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.del12 == 0) {
                var def = user.def
                var procent = 20
                var resultdef = def / 100 * procent
                user.dueldef -= resultdef
                user.del12 == -1
                msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.del12 == 0) {
                var def1 = u.def
                var procent = 20
                var resultdef1 = def1 / 100 * procent
                u.dueldef -= resultdef1
                u.del12 == -1
                msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(user.spikes == 0) {
                user.spikes -= 1
                msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
              if(u.spikes == 0) {
                u.spikes -= 1
                msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
              }
            }
          }
          else {
            if(u.control > 0) {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${user.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var atk = user.duelatk
                var udef = u.dueldef
                var result = atk - udef
                u.duelhp -= result
                if(user.cd11 > 0) user.cd11 -= 2
                if(user.del11 > 0) user.del11 -= 2
                if(user.cd12 > 0) user.cd12 -= 2
                if(user.del12 > 0) user.del12 -= 2
                if(user.cd13 > 0) user.cd13 -= 2
                if(user.cd14 > 0) user.cd14 -= 2
                if(user.cd15 > 0) user.cd15 -= 2
                if(user.spikes > 0) user.spikes -= 2
                if(user.cd16 > 0) user.cd16 -= 2
                if(user.cd21 > 0) user.cd21 -= 2
                if(user.cd22 > 0) user.cd22 -= 2
                if(user.cd31 > 0) user.cd31 -= 2
                if(user.cd32 > 0) user.cd32 -= 2
                if(user.cd33 > 0) user.cd33 -= 2
                if(user.cd34 > 0) user.cd34 -= 2
                if(user.cd35 > 0) user.cd35 -= 2
                if(user.cd36 > 0) user.cd36 -= 2
                if(user.cd37 > 0) user.cd37 -= 2
                if(u.cd11 > 0) u.cd11 -= 2
                if(u.del11 > 0) u.del11 -= 2
                if(u.cd12 > 0) u.cd12 -= 2
                if(u.del12 > 0) u.del12 -= 2
                if(u.cd13 > 0) u.cd13 -= 2
                if(u.cd14 > 0) u.cd14 -= 2
                if(u.cd15 > 0) u.cd15 -= 2
                if(u.spikes > 0) u.spikes -= 2
                if(u.cd16 > 0) u.cd16 -= 2
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 2
                if(u.cd22 > 0) u.cd22 -= 2
                if(u.cd31 > 0) u.cd31 -= 2
                if(u.cd32 > 0) u.cd32 -= 2
                if(u.cd33 > 0) u.cd33 -= 2
                if(u.cd34 > 0) u.cd34 -= 2
                if(u.cd35 > 0) u.cd35 -= 2
                if(u.cd36 > 0) u.cd36 -= 2
                if(u.cd37 > 0) u.cd37 -= 2
                if(user.burn > 0) user.burn -= 2
                if(u.burn > 0) u.burn -= 2
                if(user.poison > 0) user.poison -= 2
                if(u.poison > 0) u.poison -= 2
                if(user.poisoning > 0) user.poisoning -= 2
                if(u.poisoning > 0) u.poisoning -= 2
                user.steps += 2
                u.steps += 2
                u.control -= 2
                msg.send(`"${u.nick}" получает ⚔${result} урона. Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
            else {
              if(u.dueldef > user.duelatk) {
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" не получает урона, так как его защита выше атаки "${user.nick}". Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
              else {
                var atk = user.duelatk
                var udef = u.dueldef
                var result = atk - udef
                u.duelhp -= result
                if(user.cd11 > 0) user.cd11 -= 1
                if(user.del11 > 0) user.del11 -= 1
                if(user.cd12 > 0) user.cd12 -= 1
                if(user.del12 > 0) user.del12 -= 1
                if(user.cd13 > 0) user.cd13 -= 1
                if(user.cd14 > 0) user.cd14 -= 1
                if(user.cd15 > 0) user.cd15 -= 1
                if(user.spikes > 0) user.spikes -= 1
                if(user.cd16 > 0) user.cd16 -= 1
                if(user.cd21 > 0) user.cd21 -= 1
                if(user.cd22 > 0) user.cd22 -= 1
                if(user.cd31 > 0) user.cd31 -= 1
                if(user.cd32 > 0) user.cd32 -= 1
                if(user.cd33 > 0) user.cd33 -= 1
                if(user.cd34 > 0) user.cd34 -= 1
                if(user.cd35 > 0) user.cd35 -= 1
                if(user.cd36 > 0) user.cd36 -= 1
                if(user.cd37 > 0) user.cd37 -= 1
                if(u.cd11 > 0) u.cd11 -= 1
                if(u.del11 > 0) u.del11 -= 1
                if(u.cd12 > 0) u.cd12 -= 1
                if(u.del12 > 0) u.del12 -= 1
                if(u.cd13 > 0) u.cd13 -= 1
                if(u.cd14 > 0) u.cd14 -= 1
                if(u.cd15 > 0) u.cd15 -= 1
                if(u.spikes > 0) u.spikes -= 1
                if(u.cd16 > 0) u.cd16 -= 1
                if(u.clinch > 0) u.clinch == -1
                if(u.cd21 > 0) u.cd21 -= 1
                if(u.cd22 > 0) u.cd22 -= 1
                if(u.cd31 > 0) u.cd31 -= 1
                if(u.cd32 > 0) u.cd32 -= 1
                if(u.cd33 > 0) u.cd33 -= 1
                if(u.cd34 > 0) u.cd34 -= 1
                if(u.cd35 > 0) u.cd35 -= 1
                if(u.cd36 > 0) u.cd36 -= 1
                if(u.cd37 > 0) u.cd37 -= 1
                if(user.burn > 0) user.burn -= 1
                if(u.burn > 0) u.burn -= 1
                if(user.poison > 0) user.poison -= 1
                if(u.poison > 0) u.poison -= 1
                if(user.poisoning > 0) user.poisoning -= 1
                if(u.poisoning > 0) u.poisoning -= 1
                user.steps += 1
                u.steps += 1
                msg.send(`"${u.nick}" получает ⚔${result} урона. Следующим ходит — "${u.nick}"\n"${user.nick}": ❤"${user.duelhp}" ⚔"${user.duelatk}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" ⚔"${u.duelatk}" 🛡"${u.dueldef}"`)
                if(u.duelhp < 1) {
                  var plata1 = u.money
                  var procentplata = 10
                  var resultplata1 = plata1 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  user.money += resultplata1
                  u.money -= resultplata1
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${user.nick}" победил "${u.nick}" в дуэли. Со счёта "${u.nick}" списано ${resultplata}💵 и начислено на счёт "${user.nick}"`)
                }
                if(user.duelhp < 1) {
                  var plata2 = user.money
                  var procentplata = 10
                  var resultplata2 = plata2 / 100 * procentplata
                  user.duel = false
                  u.duel = false
                  u.predictionduel = false
                  user.predictduel = false
                  user.steps = 0
                  u.steps = 0
                  user.timer = 0
                  u.timer = 0
                  user.duelhp = 0
                  user.duelatk = 0
                  user.dueldef = 0
                  u.duelhp = 0
                  u.duelatk = 0
                  u.dueldef = 0
                  u.money += resultplata2
                  user.money -= resultplata2
                  user.cd11 = 0,
                  user.del11 = -1,
                  user.cd12 = 0,
                  user.del12 = -1,
                  user.cd13 = 0,
                  user.cd14 = 0,
                  user.cd15 = 0,
                  user.spikes = -1,
                  user.cd16 = 0,
                  user.clinch = -1,
                  user.cd21 = 0,
                  user.cd22 = 0,
                  user.nakopleniye = 0,
                  user.el1 = 0,
                  user.burn = 0,
                  user.el2 = 0,
                  user.el3 = 0,
                  user.cd31 = 0,
                  user.poison = 0,
                  user.cd32 = 0,
                  user.cd33 = 0,
                  user.cd34 = 0,
                  user.invisible = false,
                  user.cd35 = 0,
                  user.cd36 = 0,
                  user.cd37 = 0,
                  user.poisoning = 0
                  u.cd11 = 0,
                  u.del11 = -1,
                  u.cd12 = 0,
                  u.del12 = -1,
                  u.cd13 = 0,
                  u.cd14 = 0,
                  u.cd15 = 0,
                  u.spikes = -1,
                  u.cd16 = 0,
                  u.clinch = -1,
                  u.cd21 = 0,
                  u.cd22 = 0,
                  u.nakopleniye = 0,
                  u.el1 = 0,
                  u.burn = 0,
                  u.el2 = 0,
                  u.el3 = 0,
                  u.cd31 = 0,
                  u.poison = 0,
                  u.cd32 = 0,
                  u.cd33 = 0,
                  u.cd34 = 0,
                  u.invisible = false,
                  u.cd35 = 0,
                  u.cd36 = 0,
                  u.cd37 = 0,
                  u.poisoning = 0
                  msg.send(`"${u.nick}" победил "${user.nick}" в дуэли. Со счёта "${user.nick}" списано ${resultplata2}💵 и начислено на счёт "${u.nick}"`)
                }
                if(user.del11 == 0) {
                  var hp = user.hp
                  var atk = user.atk
                  var procent = 20
                  var resulthp = hp / 100 * procent
                  var resultatk = atk / 100 * procent
                  user.duelhp -= resulthp
                  user.duelatk -= resultatk
                  user.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${user.nick}" уменьшены до ❤${user.duelhp} ⚔${user.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del11 == 0) {
                  var hp1 = u.hp
                  var atk1 = u.atk
                  var procent = 20
                  var resulthp1 = hp1 / 100 * procent
                  var resultatk1 = atk1 / 100 * procent
                  u.duelhp -= resulthp1
                  u.duelatk -= resultatk1
                  u.del11 == -1
                  msg.send (`Действие ярости закончилось закончилось. Здоровье и атака "${u.nick}" уменьшены до ❤${u.duelhp} ⚔${u.duelatk}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.del12 == 0) {
                  var def = user.def
                  var procent = 20
                  var resultdef = def / 100 * procent
                  user.dueldef -= resultdef
                  user.del12 == -1
                  msg.send(`Действие щита у "${user.nick}" закончилось. Защита "${user.nick}" снижена до 🛡${user.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.del12 == 0) {
                  var def1 = u.def
                  var procent = 20
                  var resultdef1 = def1 / 100 * procent
                  u.dueldef -= resultdef1
                  u.del12 == -1
                  msg.send(`Действие щита у "${u.nick}" закончилось. Защита "${u.nick}" снижена до 🛡${u.dueldef}\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(user.spikes == 0) {
                  user.spikes -= 1
                  msg.send(`Действие шипов у "${user.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
                if(u.spikes == 0) {
                  u.spikes -= 1
                  msg.send(`Действие шипов у "${u.nick}" закончилось\n"${user.nick}": ❤"${user.duelhp}" 🛡"${user.dueldef}"\n "${u.nick}": ❤"${u.duelhp}" 🛡"${u.dueldef}"`)
                }
              }
            }
          }
        }
      }
    }
  })

  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------------------------

vk.updates.hear(/^Начать$/i, async (context) => {
  await vk.api.messages.send({
    peer_id: context.peerId,
    message: "—> открываю клавиатуру",
    keyboard: Keyboard.keyboard([
      [
      Keyboard.textButton({
        label: "Профиль",
        color: "positive",
        payload: "project RQ"
      })
    ],
    [
      Keyboard.textButton({
        label: "Классы",
        color: "secondary",
        payload: "project RQ"
      }),
      Keyboard.textButton({
        label: "Умения",
        color: "primary",
        payload: "project RQ"
      })
    ],
    [
      Keyboard.textButton({
        label: "ХП+",
        color: "negative",
        payload: "project RQ"
      }),
      Keyboard.textButton({
        label: "АТК+",
        color: "negative",
        payload: "project RQ"
      }),
      Keyboard.textButton({
        label: "ДЕФ+",
        color: "negative",
        payload: "project RQ"
      })
    ]
    ])
  })
})

  console.log("Бот запущен!");
  vk.updates.start().catch(console.error)
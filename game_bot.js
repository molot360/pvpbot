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

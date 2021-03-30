const { VK, Keyboard, } = require('vk-io');
const vk = new VK();
const fs = require('fs');
const { HearManager } = require('@vk-io/hear');
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
vk.setOptions({
token: 'e26be2f46a3f621b923878ccae34bf6471c149a8c64ae4333c0c6d183fdc169b3e8e6ad4af3fb5a91d976'
})

const bot = new HearManager()

vk.updates.on('new_message', bot.middleware)

vk.updates.on('new_wall_post', async (context) => {
  console.log(context)
  await vk.api.messages.send({
    peer_id: 2000000007, 
    chat_id: 170, 
    attachment: 'wall' + context.wall.ownerId + '_' + context.wall.id,
    keyboard: Keyboard.builder()
    .inline()
      .textButton({
        label: "Удалить",
        color: "negative",
        payload: "DBD"
        })
    .row()
      .inline()
        .textButton({
          label: "Восстановить",
          color: "positive",
          payload: "DBD"
          })
    .row()
      .inline()
        .textButton({
          label: "Заблокировать",
          color: "secondary",
          payload: "DBD"
          })
  })

  var owner = context.wall.ownerId
  var post = context.wall.id

  vk.updates.hear(/^(.*) Удалить$/i, async (context) => {
    if(context.$match[1] != '[club160897920|@dbdmobilecomm]') return                                            
    if(context.messagePayload != "DBD") return
    vk.api.wall.delete({owner_id: owner, post_id: post})
    context.send(`Запись удалена`)
  })
  
  vk.updates.hear(/^(.*) Восстановить$/i, async (context) => {
    if(context.$match[1] != '[club160897920|@dbdmobilecomm]') return
    if(context.messagePayload != "DBD") return
    vk.api.wall.restore({owner_id: owner, post_id: post})
    context.send(`Запись восстановлена`)
  })

  vk.updates.hear(/^(.*) Заблокировать$/i, async (context) => {
    if(context.$match[1] != '[club160897920|@dbdmobilecomm]') return
    if(context.messagePayload != "DBD") return
    vk.api.wall.delete({owner_id: owner, post_id: post})
    context.send(`Автор записи забанен`)
  })
})

vk.updates.hear(/^.$/i, async (context) => {
  console.log(context)
  await context.send(`.`)
})
  
console.log("Бот запущен!");
vk.updates.start().catch(console.error)
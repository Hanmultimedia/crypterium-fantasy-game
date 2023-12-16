export function randomRewards(config, rewards) {
  rewards.diamond += config.diamond
  rewards.exp += config.exp

  config.items.forEach(item => {
    if (!rewards[item.uid]) {
      rewards[item.uid] = calcReward(item.percent, item.tick)
    } else {
      rewards[item.uid] += calcReward(item.percent, item.tick)
    }
    
  })
}

export function calcReward(percent:number, tick:number) {
  let quantity = 0
  for(let i=0; i<tick;i++) {
    let ran = Math.random()
    if (ran < percent) {
      quantity++;
    }
  }

  return quantity
}
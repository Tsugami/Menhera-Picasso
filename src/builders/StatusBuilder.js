const { getStatus, getHeart, getMana, getXp, getDamage, getArmor, getAp, getGem, getClass, getJob, getLevel } = require("../ImageReader");
const CanvasImport = require('canvas')
const { millify } = require('millify');

const LoadedIcons = {}

const start = async () => {
  const statusimage = await getStatus()
  const heartIcon = await getHeart()
  const manaIcon = await getMana()
  const xpIcon = await getXp()
  const levelIcon = await getLevel()
  const dmgIcon = await getDamage()
  const armorIcon = await getArmor()
  const magicIcon = await getAp()
  const gemIcon = await getGem()
  const classIcon = await getClass()
  const jobIcon = await getJob()


  LoadedIcons.status = await CanvasImport.loadImage(statusimage);
  LoadedIcons.heart = await CanvasImport.loadImage(heartIcon)
  LoadedIcons.mana = await CanvasImport.loadImage(manaIcon)
  LoadedIcons.xp = await CanvasImport.loadImage(xpIcon)
  LoadedIcons.level = await CanvasImport.loadImage(levelIcon)
  LoadedIcons.damage = await CanvasImport.loadImage(dmgIcon)
  LoadedIcons.armor = await CanvasImport.loadImage(armorIcon)
  LoadedIcons.magic = await CanvasImport.loadImage(magicIcon)
  LoadedIcons.gem = await CanvasImport.loadImage(gemIcon)
  LoadedIcons.class = await CanvasImport.loadImage(classIcon)
  LoadedIcons.job = await CanvasImport.loadImage(jobIcon)

}

const buildStatusImage = async (user, userAvatarLink, i18n) => {
  /* ---------------------- CREATE CANVAS -------------------------- */

  const canvas = CanvasImport.createCanvas(582, 275);
  const ctx = canvas.getContext('2d');

  /* ---------------------- LOADING IMAGES -------------------------- */

  const avatarImage = await CanvasImport.loadImage(userAvatarLink);

  const roundedImage = await ctx.roundImageCanvas(avatarImage, 180, 180);

  /* ---------------------- CONSTANTS -------------------------- */

  const lifeFillMultiplier = user.life / user.maxLife;
  const manaFillMultiplier = user.mana / user.maxMana;
  const xpFillMultiplier = user.xp / user.nextLevelXp;
  const dmg = user.damage;
  const ptr = user.armor;
  const ap = user.abilityPower

  /* ---------------------- CREATE BARS -------------------------- */

  const lifeGradiant = ctx.createLinearGradient(315, 67, 555, 90);
  lifeGradiant.addColorStop(1, 'red');
  lifeGradiant.addColorStop(0, '#FF5151');

  ctx.fillStyle = lifeGradiant;
  ctx.fillRect(312, 67, 240 * lifeFillMultiplier, 24);

  const manaGradiant = ctx.createLinearGradient(315, 95, 555, 115);
  manaGradiant.addColorStop(1, 'blue');
  manaGradiant.addColorStop(0, '#0080ff');

  ctx.fillStyle = manaGradiant;
  ctx.fillRect(312, 95, 240 * manaFillMultiplier, 20);

  const xpGradiant = ctx.createLinearGradient(315, 130, 555, 150);
  xpGradiant.addColorStop(1, '#ff8300');
  xpGradiant.addColorStop(0, '#ffd323');

  ctx.fillStyle = xpGradiant;
  ctx.fillRect(315, 120, 240 * xpFillMultiplier, 20);

  /* ---------------------- ADD ALL IMAGES -------------------------- */

  ctx.drawImage(roundedImage, 35, 25, 120, 120);
  ctx.drawImage(LoadedIcons.status, 0, 0, 582, 275);
  ctx.drawImage(LoadedIcons.heart, 265, 57, 42, 42);
  ctx.drawImage(LoadedIcons.mana, 275, 85, 28, 28);
  ctx.drawImage(LoadedIcons.xp, 280, 115, 24, 24);
  ctx.drawImage(LoadedIcons.level, 160, 80, 48, 48);

  /* ---------------------- WRITE TEXT -------------------------- */

  // BAR VALUES
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.font = 'bold 20px Sans';
  ctx.lineWidth = 0;

  ctx.fillText(`${user.life}/${user.maxLife}`, 400, 86);
  ctx.strokeText(`${user.life}/${user.maxLife}`, 400, 86);

  ctx.fillText(`${user.mana}/${user.maxMana}`, 400, 112);
  ctx.strokeText(`${user.mana}/${user.maxMana}`, 400, 112);

  ctx.fillText(`${millify(user.xp)}/${millify(user.nextLevelXp)}`, 400, 137);
  ctx.strokeText(`${millify(user.xp)}/${millify(user.nextLevelXp)}`, 400, 137);

  // USERNAME

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 38px Sans';
  ctx.lineWidth = 2;
  ctx.fillText(user.tag, 160, 32);
  ctx.strokeText(user.tag, 160, 32);

  // LEVEL

  ctx.fillStyle = '#aa8dd8';
  ctx.font = 'bold 32px Sans';
  ctx.textAlign = 'center';

  ctx.fillText(user.level, 240, 115);
  ctx.strokeText(user.level, 240, 115);

  // DAMAGE

  ctx.textAlign = 'left';
  ctx.font = 'bold 18px Verdana';
  ctx.lineWidth = 1;

  ctx.fillStyle = 'red';
  ctx.drawImage(LoadedIcons.damage, 60, 160, 28, 28);
  ctx.fillText(`${i18n.damage}: ${dmg}`, 90, 180);

  // PROTECTION

  ctx.fillStyle = '#295564';
  ctx.drawImage(LoadedIcons.armor, 60, 200, 28, 28);
  ctx.fillText(`${i18n.armor}: ${ptr}`, 90, 220);

  // MAGIC POWER

  ctx.fillStyle = 'purple';
  ctx.drawImage(LoadedIcons.magic, 60, 235, 26, 26);
  ctx.fillText(`${i18n.ap}: ${ap}`, 90, 255);

  // GEMAS

  ctx.fillStyle = 'aqua';
  ctx.drawImage(LoadedIcons.gem, 270, 235, 26, 26);
  ctx.fillText(`${i18n.money}: ${user.money}`, 295, 255);

  // CLASSE

  ctx.fillStyle = '#fff';
  ctx.drawImage(LoadedIcons.class, 270, 160, 28, 28);
  ctx.fillText(i18n.userClass, 300, 180);

  // TRABALHO
  if (user?.jobId > 0) {
    ctx.fillStyle = 'yellow';
    ctx.drawImage(LoadedIcons.job, 290, 200, 28, 28);
    ctx.fillText(i18n.userJob, 320, 220);
  }
  return canvas.toBuffer();
}

module.exports = { buildStatusImage, start }
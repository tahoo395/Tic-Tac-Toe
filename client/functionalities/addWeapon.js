export let addWeapon = (weapon, place) => {
    let img = document.createElement('img')
    img.src = `/${weapon}.png`
    place.appendChild(img)
}
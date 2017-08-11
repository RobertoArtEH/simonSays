let reload = 0
let levels
let keySpeed
let keys


function setLevel(lvlNum) {
  reload++
  if(reload >= 2){
    reload = 0
    return swal({
      timer: 2000,
      imageUrl: "img/diff.png",
      title: "GAME CANCELED!",
      text: "Select a difficulty to start a new game."
    }, function(ok) {
      if(ok) return location.reload();
    })
  }
  switch(lvlNum) {
    case 1:
      levels = 5
      keySpeed = 700
      break
    case 2:
      levels = 10
      keySpeed = 600
      break
    default:
      levels = 15
      keySpeed = 400
  }

  keys = generateKeys(levels)
  nextRound(0)
}

function nextRound(currentLvl) {
  if(currentLvl == levels){
    return swal({
      imageUrl: "img/win.png",
      title: "YOU WIN!",
      text: "Congratulations, well played!",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Play again",
      confirmButtonColor: "Black",
      closeOnConfirm: true
    }, function(ok){
      if(ok) return location.reload();
    })
  }

  swal({
    timer:1000,
    imageUrl: "img/showLevel.png",
    title: `Level ${currentLvl + 1} of ${levels}`,
    showConfirmButton:false
  })

  for(let i = 0; i <= currentLvl; i++){
    setTimeout(() => activate(keys[i]), keySpeed * (i+1) + 1000)
  }
  let i = 0
  let currentKey = keys[i]
  window.addEventListener('keydown', onkeydown)

  function onkeydown(ev) {
    if(ev.keyCode == currentKey){
      activate(currentKey, {success: true})
      i++
      if(i > currentLvl){
        window.removeEventListener('keydown', onkeydown)
        setTimeout(() => nextRound(i), 1500)
      }
      currentKey = keys[i]
    } else{
      activate(ev.keyCode, {fail: true})
      window.removeEventListener('keydown', onkeydown)
      swal({
        imageUrl: "img/lost.png",
        title:"OOPS!",
        text:`Wrong key! Want to play again? \n\ (correct key: ${String.fromCharCode(keys[i])})`,
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Play again",
        confirmButtonColor: "Black",
        closeOnConfirm: true
      }, function(ok) {
        if(ok){
          location.reload();
        }
      })
    }
  }
}

function generateKeys(levels) {
  return new Array(levels).fill(0).map(generateRandomKey)
}

function generateRandomKey() {
  const min = 65
  const max = 90
  return Math.round(Math.random() * (max - min) + min)
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key="${keyCode}"]`)
}

function activate(keyCode, opts = {}) {
  const el = getElementByKeyCode(keyCode)
  el.classList.add('active')
  if(opts.success){
    el.classList.add('success')
  }else if(opts.fail){
    el.classList.add('fail')
  }
  setTimeout(() => desactivate(el), 500)
}
function desactivate(el) {
  el.className = 'key'
}

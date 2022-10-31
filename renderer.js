/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
 var distro, de, onskb_state, onskb_button_text;
const func = async () => {
try{
  var info = await versions.info();
  info = JSON.parse(info);
  distro = info.distro;
  de = info.de
  if(info.hasOwnProperty('onskb_state')){
	  onskb_state = info.onskb_state;
	  console.log(onskb_state)
	  if(onskb_state === 'true'){onskb_button_text = 'off'}else{onskb_button_text = 'on'}
	}
  if(distro === 'Manjaro-ARM'||distro === 'Arch Linux ARM'){
  	document.getElementById('kb_config_app_name').innerHTML = 'xkeyboard-config';
  	install = 'pacman -S xkeyboard-config';  	
  	}
  if(distro === 'Debian GNU/Linux'){
  	document.getElementById('kb_config_app_name').innerHTML = 'xkb-data'; 
  	install = 'apt install xkb-data';  	
  	}
  
  if(de === 'Phosh:GNOME'){
	  document.getElementById('file_to_create').innerHTML = 'phosh.service.d/override.conf';
	  document.getElementById('osk_container').style.display = 'block';
	  document.getElementById('on_screen_keyboard').innerText = 'Toggle on screen keyboard '+onskb_button_text;
	}
  if(de === 'Plasma'){document.getElementById('file_to_create').innerHTML = '~/.config/xkbrc'}
  document.getElementById('distro').innerText = info.distro;
  document.getElementById('de').innerText = info.de;
  document.getElementById('save-folder').innerText = info.folder;
  var json = await versions.get_json();
  json = JSON.parse(json)
  json.forEach((item)=>{
	  var clone_command = item.command.replace(/"/g,'\"')
	  var buttons = '';
	  if(item.command.includes('git clone')||item.command.includes('git push')||item.command.includes('git pull')){
		var clone_command = item.command.replace('git push','git clone').replace('git pull','git clone');
		var pull_command = item.command.replace('git push','git pull').replace('git clone','git pull');
		var push_command = item.command.replace('git clone','git push').replace('git pull','git push');
		buttons = `<button class="clone" id="${item.name}" data-command='${clone_command}'>Clone</button>
		<button class="push" id="${item.name}" data-command='${push_command}'>Push</button>
		<button class="pull" id="${item.name}" data-command='${pull_command}'>Pull</button>
		<br><button class="delete" id="${item.name}">Delete Command</button>`
	}else{buttons = `<button class="copy" id="${item.name}" data-command='${clone_command}'>Copy</button><br><button class="delete" id="${item.name}">Delete Command</button>`;}
	
	document.getElementById('commands').innerHTML += `<div class="commands_container">
	<div class="commands_name">${item.name}</div>
	<div class="commands_buttons">
	${buttons}
	</div>
	</div>`;

  });
  var clones = document.querySelectorAll('.clone');
  clones.forEach(clone => {
	  clone.addEventListener("click", (event)=>{
		  copyText(clone.dataset.command)
	console.log(clone.dataset.command)
	})
});
var pushes = document.querySelectorAll('.push');
  pushes.forEach(push => {
	  push.addEventListener("click", (event)=>{
		  copyText(push.dataset.command)
	console.log(push.dataset.command)
	})
});
var pulls = document.querySelectorAll('.pull');
  pulls.forEach(pull => {
	  pull.addEventListener("click", (event)=>{
		  copyText(pull.dataset.command)
	console.log(pull.dataset.command)
	})
});
var deletes = document.querySelectorAll('.delete');
  deletes.forEach(delete_ => {
	  delete_.addEventListener("click", (event)=>{
		  versions.delete_item(delete_.id)
		  console.log(delete_.id)
	})
});
var copys = document.querySelectorAll('.copy');
  copys.forEach(copy => {
	  copy.addEventListener("click", (event)=>{
		  copyText(copy.dataset.command)
	console.log(copy.dataset.command)
	})
});
  
}catch(err){console.log(err)}
}

func()
document.getElementById("keyboard").addEventListener("click", keyboard_config)
async function keyboard_config(){
	  var passwd = document.getElementById('password').value;
	  //console.log(passwd)
	  //const res = await versions.keyboard_config(passwd)
	  //console.log(res)
	  copyText(`sudo ${install} && 
	  mkdir -p /usr/lib/systemd/system/phosh.service.d && 
	  sudo touch /usr/lib/systemd/system/phosh.service.d/override.conf && 
	  echo "[Service]\nEnvironment=XKB_DEFAULT_MODEL=ppkb" | sudo tee /usr/lib/systemd/system/phosh.service.d/override.conf`)
	}
document.getElementById("add_command_button").addEventListener("click", add_command)
async function add_command(){
	var name = document.getElementById('name').value;
	var command = document.getElementById('command').value;
		versions.add(`${name},${command}`)
	}

document.getElementById("on_screen_keyboard").addEventListener("click", toggle_kb_on)
async function toggle_kb_on(){
	if(onskb_state === 'true'){
		onskb_state = 'false'
		document.getElementById('on_screen_keyboard').innerText = 'Toggle on screen keyboard on';
	}else{
		onskb_state = 'true'
		document.getElementById('on_screen_keyboard').innerText = 'Toggle on screen keyboard off';
	}
		versions.toggle_kb()
	}
	
function copyText(text){
		navigator.clipboard.writeText(text);
	}

document.querySelector('.button.close').addEventListener("click", ()=>{versions.closeW();});
document.querySelector('.button.minimize').addEventListener("click", ()=>{versions.minW()});
document.querySelector('.button.maximize').addEventListener("click", ()=>{versions.maxW()});


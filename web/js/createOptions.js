import { fetchNui } from './fetchNui.js';

const circleContainer = document.getElementById('circle-container');
const labelsWrapper = document.getElementById('labels-wrapper');
const returnLastMenu = document.getElementById('returnMenu');

/** Only from lua */
export function generateOptions(event){
  circleContainer.innerHTML = "";
  circleContainer.className = "closed";
  let options = [];
  for (const type in event.data.options) {
    event.data.options[type].forEach((data, id) => {
      options.push({type:type, data:data, id: id + 1});
    });
  }
  createCircleMenu(options)
}

/** From lua and submenu  */
export function createCircleMenu(options, menuId=null){
  //Initial menu
  if(menuId == null){ 
    menuId = "0";
  }

  const newMenu = document.createElement('div');
  newMenu.className = 'circular-menu close';
  newMenu.setAttribute('menuId', menuId );
  circleContainer.appendChild(newMenu);

  options.forEach(option => {
    createOption(newMenu, option.type, option.data, option.id, menuId);
  });
}

export function createSubmenu(type, submenuOptions, menuId) {
  let options = [];
  submenuOptions.forEach((data, id) => {
    options.push({type:type, data:data, id: menuId+"-"+(id+1)})
  });
  createCircleMenu(options, menuId);
}

export function createOption(element, type, data, id, menuId) {
  if (data.hide) return;

  createLabel(id, data.label)

  const option = document.createElement('div');
  option.className = 'option-container';
  option.innerHTML = `
    <div class="option-div">
      <i class="fa-fw ${data.icon} option-icon" style="color:${data.iconColor || '#cfd2da'}"></i>
    </div>
    `;
  if(data.submenu != null){
    if(menuId.includes("-")){
      createSubmenu(type, data.submenu, id);
    }else{
      createSubmenu(type, data.submenu, menuId+"-"+id);
    }
    option.addEventListener('click', () => {
      if(menuId.includes("-")){
        toggleMenu(id);
      }else{
        toggleMenu(menuId+"-"+id) 
      }
    });
  }else{
    option.addEventListener('click', () => {
      document.querySelectorAll('[menuId]').forEach(e=>e.classList.add("close"));
      circleContainer.className = "closed";
      fetchNui('select', [type, String(id).replaceAll("0-","")]) 
    });
  }

  option.addEventListener('mouseenter', () => document.querySelector(`[labelElement='${id}']`).style.display = "flex" );
  option.addEventListener('mouseleave', () => document.querySelector(`[labelElement='${id}']`).style.display = "none" );

  element.appendChild(option);
}

export function createLabel(id, text) {

  const label = document.createElement('div');
  label.className = 'label-container';
  label.innerHTML = `
    <p class="option-label" labelElement="${id}">${text}</p>
    `;
  labelsWrapper.appendChild(label);

}

export function toggleMenu(numberSubmenu){
  if(numberSubmenu.includes("-")){
    returnLastMenu.style.display = "block";
  }else{
    returnLastMenu.style.display = "none";
  }
  document.querySelectorAll('[menuId]').forEach(e=>e.classList.add("close"));
  document.querySelector(`[menuId='${numberSubmenu}']`).classList.remove("close");
}

returnLastMenu.addEventListener("click", ()=>{
  // Is impossible in one initial menu, everything in submenu
  let menu = document.querySelector('[menuId]:not(.close)');
  let menuId = menu.getAttribute("menuId");
  let arrayMenu = menuId.split("-");
  arrayMenu.pop();
  toggleMenu(arrayMenu.join("-"));
})

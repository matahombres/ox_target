import { generateOptions } from './createOptions.js';
import { fetchNui } from './fetchNui.js';

const returnLastMenu = document.getElementById('returnMenu');
const labelsWrapper = document.getElementById('labels-wrapper');
const circleContainer = document.getElementById("circle-container");
const eye = document.getElementById('eyeSvg');
const body = document.body;

window.addEventListener('message', (event) => {
  if(event.data.event != "showCircle" || eye.style.fill == "black"){
    let firstMenu = document.querySelector("[menuId='0']");
    if(firstMenu!=null){
      firstMenu.classList.add("close");
    }
    labelsWrapper.innerHTML = '';
    circleContainer.className = "closed";
    eye.style.display = "block";
    returnLastMenu.style.display = "none";
  }

  switch (event.data.event) {
    case 'visible': {
      body.style.visibility = event.data.state ? 'visible' : 'hidden';
      return (eye.style.fill = 'black');
    }

    case 'leftTarget': {
      return (eye.style.fill = 'black');
    }

    case 'showCircle': {
      if(eye.style.fill == "black"){ 
        fetchNui('forceRemoveFocus', ['true']);
        return;
      }
      document.querySelector("[menuId='0']").classList.remove("close");
      document.querySelectorAll(".option-container").forEach((elem)=>{
        elem.style.display = "flex";
      });
      setTimeout(() => {
        circleContainer.className = "oppened";
      }, 10);
      eye.style.display = "none";
      break;
    }

    case 'setTarget': {
      eye.style.fill = '#cfd2da';

      if (event.data.options) {
        generateOptions(event);
      }
    }
  }
});

const newPaletteBtn = document.querySelector(".new-palette-btn");
const swatchRow = document.querySelector(".swatch-row");
const newPaletteSubmit = document.querySelector(".palette-input-form");
const newProjectBtn = document.querySelector(".project-input-form");
const noProjectNameWarning = document.querySelector(".no-project-name-warning");
const projectsSection = document.querySelector(".projects-section");
const projectDropdownLabelText = document.querySelector(
  ".project-dropdown-label-text"
);
const projectList = document.querySelector(".project-list");
const projectDropdownArrow = document.querySelector(".project-dropdown-arrow");
const paletteNameInput = document.querySelector(".palette-input");
const noActiveProjectWarningText = document.querySelector(
  ".no-active-project-warning"
);
let projects = [];
let palettes = [];

newPaletteBtn.addEventListener("click", generateNewPalette);
swatchRow.addEventListener("click", toggleLock);
newProjectBtn.addEventListener("submit", addProject);
newPaletteSubmit.addEventListener("submit", addPalette);
projectsSection.addEventListener("click", handlePaletteClick);
projectDropdownArrow.addEventListener("click", handleDropdown);
projectList.addEventListener("click", selectProject);

class Project {
  constructor(title) {
    this.title = title;
  }
}

class Palette {
  constructor(colors, title) {
    this.title = title;
    this.color1 = colors[0];
    this.color2 = colors[1];
    this.color3 = colors[2];
    this.color4 = colors[3];
    this.color5 = colors[4];
  }
}

getProjects();

function getProjects() {
  fetch("/api/v1/projects")
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        setProjects(data);
      }
    })
    .catch(error => console.log(error.message));
}

function getPalettes(project) {
  fetch(`/api/v1/projects/${project}/palettes`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        data.forEach(palette => {
          addPaletteHTML(palette, project);
        });
      }
    })
    .catch(error => console.log(error.message));
}

function setProjects(data) {
  data.forEach(project => {
    addProjectHTML(project);
    getPalettes(project.id);
    projects.push(project.title);
  });
}

function generateNewPalette() {
  for (let i = 0; i < swatchRow.children.length; i++) {
    if (swatchRow.children[i].children[1].className === "unlocked") {
      let newHex = generateRandomHex();
      swatchRow.children[i].style.background = newHex;
      swatchRow.children[i].children[0].innerText = newHex;
    }
  }
}

function generateRandomHex() {
  const hexArray = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g"
  ];
  const hexCodeArray = ["#"];
  for (i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * 15);
    hexCodeArray.push(hexArray[randomNum]);
  }

  const hexCode = hexCodeArray.join("");

  return hexCode;
}

function toggleLock(event) {
  if (
    event.target.classList.contains("locked") ||
    event.target.classList.contains("unlocked")
  ) {
    event.target.classList.toggle("locked");
    event.target.classList.toggle("unlocked");
  }
}

function addProject(event) {
  event.preventDefault();
  const projectNameInput = document.querySelector(".project-name-input");

  if (projectNameInput.value.length === 0) {
    noProjectName();
    return;
  }

  const duplicate = projects.find(project => {
    return project === projectNameInput.value;
  });

  if (duplicate) {
    noProjectName();
    return;
  }

  createNewProject(projectNameInput.value);
  projects.push(projectNameInput.value);
  projectNameInput.value = "";
}

function createNewProject(projectName) {
  const newProject = new Project(projectName);
  projects.push(newProject);

  sendProjectToServer(newProject);
}

function addProjectHTML(project) {
  const newProjectElement = `
    <article class='project' id=${project.id}>
      <h4 class='project-label'>${project.title}</h4>
    </article>
  `;

  projectsSection.innerHTML += newProjectElement;
  projectDropdownLabelText.innerText = project.title;
  projectDropdownLabelText.id = project.id;

  projectList.innerHTML += `<li id=${project.id} class='project-list-item'>${
    project.title
  }</li>`;
}

function sendProjectToServer(project) {
  return fetch("/api/v1/projects", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(project)
  })
    .then(response => response.json())
    .then(data => addProjectHTML({ ...project, id: data.id }))
    .catch(error => console.log(error.message));
}

function noProjectName() {
  noProjectNameWarning.classList.add("show");

  setTimeout(() => {
    noProjectNameWarning.classList.remove("show");
  }, 5000);
}

function addPalette(event) {
  event.preventDefault();

  if (projectDropdownLabelText.innerText === "") {
    console.log("no project");
    noActiveProjectWarningText.classList.toggle("show");
    setTimeout(noProjectWarningClear, 5000);
    return;
  }

  const palette = [];

  let paletteName = paletteNameInput.value || "palette";

  for (let i = 0; i < swatchRow.children.length; i++) {
    if (swatchRow.children[i].children[1].className === "unlocked") {
      palette.push(swatchRow.children[i].children[0].innerText);
    }
  }

  const newPalette = new Palette(palette, paletteName);

  sendPaletteToServer(newPalette);
  paletteNameInput.value = "";
}

function noProjectWarningClear() {
  noActiveProjectWarningText.classList.toggle("show");
}

function addPaletteHTML(newPalette, id) {
  const array = Array.from(projectsSection.children);

  const ourProject = array.find(child => {
    return parseInt(child.id) === id;
  });

  if (!ourProject) {
    return;
  }

  const hexObject = {
    id: newPalette.id,
    hexes: [
      newPalette.color1,
      newPalette.color2,
      newPalette.color3,
      newPalette.color4,
      newPalette.color5
    ]
  };

  palettes.push(hexObject);

  const newPaletteElement = `
    <div class='palette' id=${newPalette.id}>
      <p class='palette-label'>${newPalette.title}</p>
      <div class='hex-row'>
        <div style='background:${newPalette.color1}' class='hex hex1'></div>
        <div style='background:${newPalette.color2}' class='hex hex2'></div>
        <div style='background:${newPalette.color3}' class='hex hex3'></div>
        <div style='background:${newPalette.color4}' class='hex hex4'></div>
        <div style='background:${newPalette.color5}' class='hex hex5'></div>
        <div class='delete-btn' id=${newPalette.id}></div>
      </div>
    </div>
  `;

  ourProject.innerHTML += newPaletteElement;
}

function sendPaletteToServer(palette) {
  return fetch(`/api/v1/projects/${projectDropdownLabelText.id}/palettes`, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(palette)
  })
    .then(response => response.json())
    .then(data => {
      addPaletteHTML(
        { ...palette, id: data[0] },
        parseInt(projectDropdownLabelText.id)
      );
    })
    .catch(error => console.log(error.message));
}

function handlePaletteClick(event) {
  if (event.target.classList.contains("delete-btn")) {
    deletePalette(event);
  } else if (event.target.classList.contains("palette")) {
    const hexRow = event.target.id;
    const hexObject = palettes.find(palette => {
      return palette.id === parseInt(hexRow);
    });
    populateMainPalette(hexObject);
  } else if (event.target.classList.contains("palette-label")) {
    const hexRow = event.target.parentNode.id;
    const hexObject = palettes.find(palette => {
      return palette.id === parseInt(hexRow);
    });
    populateMainPalette(hexObject);
  } else if (event.target.classList.contains("hex")) {
    const hexRow = event.target.parentNode.parentNode.id;
    const hexObject = palettes.find(palette => {
      return palette.id === parseInt(hexRow);
    });
    populateMainPalette(hexObject);
  }
}

function populateMainPalette(hexObject) {
  for (let i = 0; i < swatchRow.children.length; i++) {
    swatchRow.children[i].style.background = hexObject.hexes[i];
    swatchRow.children[i].children[0].innerText = hexObject.hexes[i];
  }
}

function deletePalette(event) {
  const id = event.target.id;
  const node = event.target.parentNode.parentNode;

  return fetch(`/api/v1/palettes/${id}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      event.target.parentNode.parentNode.parentNode.removeChild(node);
    });
}

function handleDropdown() {
  const dropdownList = document.querySelector(".project-list");

  dropdownList.classList.toggle("deploy");
}

function selectProject(event) {
  const dropdownList = document.querySelector(".project-list");
  if (event.target.classList.contains("project-list-item")) {
    projectDropdownLabelText.innerText = event.target.innerText;
    projectDropdownLabelText.id = event.target.id;
    dropdownList.classList.toggle("deploy");
  }
}

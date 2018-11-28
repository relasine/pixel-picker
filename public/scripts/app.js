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

const projects = [];

newPaletteBtn.addEventListener("click", generateNewPalette);
swatchRow.addEventListener("click", toggleLock);
newProjectBtn.addEventListener("submit", addProject);
newPaletteSubmit.addEventListener("submit", addPalette);
projectsSection.addEventListener("click", deletePalette);
projectDropdownArrow.addEventListener("click", handleDropdown);
projectList.addEventListener("click", selectProject);

class Project {
  constructor(name) {
    this.name = name;
    this.ide = Date.now();
  }
}

class Palette {
  constructor(colors, name) {
    this.name = name;
    this.color1 = colors[0];
    this.color2 = colors[1];
    this.color3 = colors[2];
    this.color4 = colors[3];
    this.color5 = colors[4];
    this.id = Date.now();
  }
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

  createNewProject(projectNameInput.value);
  projectNameInput.value = "";
}

function createNewProject(projectName) {
  const newProject = new Project(projectName);
  projects.push(newProject);

  addProjectHTML(newProject);
}

function addProjectHTML(project) {
  const newProjectElement = `
    <article class='project' id=${project.id}>
      <h4 class='project-label'>${project.name}</h4>
    </article>
  `;

  projectsSection.innerHTML += newProjectElement;
  projectDropdownLabelText.innerText = project.name;

  projectList.innerHTML += `<li class='project-list-item'>${project.name}</li>`;
}

function noProjectName() {
  noProjectNameWarning.classList.add("show");

  setTimeout(() => {
    noProjectNameWarning.classList.remove("show");
  }, 5000);
}

function duplicateProjectName() {
  duplicateProjectNameWarning.classList.add("show");

  setTimeout(() => {
    duplicateProjectNameWarning.classList.remove("show");
  }, 5000);
}

function addPalette(event) {
  event.preventDefault();
  const paletteNameInput = document.querySelector(".palette-input");
  const palette = [];

  let paletteName = paletteNameInput.value || "palette";

  for (let i = 0; i < swatchRow.children.length; i++) {
    if (swatchRow.children[i].children[1].className === "unlocked") {
      palette.push(swatchRow.children[i].children[0].innerText);
    }
  }

  const newPalette = new Palette(palette, paletteName);

  addPaletteHTML(newPalette);
}

function addPaletteHTML(newPalette) {
  const array = Array.from(projectsSection.children);

  const ourProject = array.find(child => {
    return child.children[0].innerText === projectDropdownLabelText.innerText;
  });

  if (!ourProject) {
    return;
  }

  const newPaletteElement = `
    <div class='palette' id=${newPalette.id}>
      <p class='palette-label'>${newPalette.name}</p>
      <div style='background:${newPalette.color1}' class='hex hex1'></div>
      <div style='background:${newPalette.color2}' class='hex hex2'></div>
      <div style='background:${newPalette.color3}' class='hex hex3'></div>
      <div style='background:${newPalette.color4}' class='hex hex4'></div>
      <div style='background:${newPalette.color5}' class='hex hex5'></div>
      <div class='delete-btn'></div>
    </div>
  `;

  ourProject.innerHTML += newPaletteElement;
}

function deletePalette(event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.parentNode;
    event.target.parentNode.parentNode.removeChild(id);
  }
}

function handleDropdown() {
  const dropdownList = document.querySelector(".project-list");

  dropdownList.classList.toggle("deploy");
}

function selectProject(event) {
  const dropdownList = document.querySelector(".project-list");
  if (event.target.classList.contains("project-list-item")) {
    projectDropdownLabelText.innerText = event.target.innerText;
    dropdownList.classList.toggle("deploy");
  }
}

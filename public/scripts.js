const newPaletteBtn = document.querySelector(".new-palette-btn");
const swatchRow = document.querySelector(".swatch-row");
const newProjectBtn = document.querySelector(".new-project-submit");
const noProjectNameWarning = document.querySelector(".no-project-name-warning");
const projectDropdownLabelText = document.querySelector(
  ".project-dropdown-label-text"
);
const projects = [];

newPaletteBtn.addEventListener("click", generateNewPalette);
swatchRow.addEventListener("click", toggleLock);
newProjectBtn.addEventListener("click", addProject);

class Project {
  constructor(name) {
    this.name = name;
    this.ide = Date.now();
  }
}

class Palette {
  constructor(colors) {
    this.color1 = colors[0];
    this.color2 = colors[1];
    this.color3 = colors[2];
    this.color4 = colors[3];
    this.color5 = colors[4];
    this.color6 = colors[5];
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

function addProject() {
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
  const projectsSection = document.querySelector(".projects-section");

  const newProjectElement = `
    <article class='project' id=${project.id}>
      <h4 class='project-label'>${project.name}</h4>
    </article>
  `;

  projectsSection.innerHTML += newProjectElement;
  projectDropdownLabelText.innerText = project.name;
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

const state = {
  currentTool: '',
  currentColor: '#C4C4C4',
  previousColor: '#41F795',
};

// ================== Local Storage ==============================
if (JSON.parse(localStorage.getItem('pageState'))) {
  document.documentElement.innerHTML = JSON.parse(localStorage.getItem('pageState'));
  state.currentColor = JSON.parse(localStorage.getItem('currentColor'));
  state.previousColor = JSON.parse(localStorage.getItem('previousColor'));
  state.currentTool = JSON.parse(localStorage.getItem('currentTool'));
}

const savePageState = () => {
  localStorage.setItem('pageState', JSON.stringify(document.documentElement.innerHTML));
  localStorage.setItem('currentColor', JSON.stringify(state.currentColor));
  localStorage.setItem('previousColor', JSON.stringify(state.previousColor));
  localStorage.setItem('currentTool', JSON.stringify(state.currentTool));
};

// ================== Color Picker Tool ==============================
const pickColor = (e) => {
  const backgroundColor = window.getComputedStyle(e.target, '').getPropertyValue('background-color');
  if (backgroundColor !== state.currentColor) {
    state.previousColor = state.currentColor;
    state.currentColor = backgroundColor;
    document.querySelector('.current-color').style.backgroundColor = state.currentColor;
    document.querySelector('.previous-color').style.backgroundColor = state.previousColor;
    savePageState();
  }
};

// ================== Bucket Tool ==============================
const colorFigure = (e) => {
  e.target.style.backgroundColor = state.currentColor;
  savePageState();
};

// ================== Transform Tool ==============================
const transformFigure = (e) => {
  if (e.target.style.borderRadius === '50%') e.target.style.borderRadius = '0';
  else e.target.style.borderRadius = '50%';
  savePageState();
};

// ================== Move Tool ==============================
let dragSrcEl = null;

function handleDragStart(e) {
  if (state.currentTool === 'move') {
    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    e.dataTransfer.setData('text/backgroundColor', e.target.style.backgroundColor);
    e.dataTransfer.setData('text/borderRadius', e.target.style.borderRadius);
  }
}

function handleDragOver(e) {
  if (state.currentTool === 'move') {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
  }
  return false;
}

function handleDragEnter(e) {
  if (state.currentTool === 'move') {
    e.target.classList.add('over');
  }
}

function handleDragLeave(e) {
  if (state.currentTool === 'move') {
    e.target.classList.remove('over');
  }
}

function handleDrop(e) {
  if (state.currentTool === 'move') {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    if (dragSrcEl !== e.target) {
      dragSrcEl.innerHTML = e.target.innerHTML;
      dragSrcEl.style.backgroundColor = e.target.style.backgroundColor;
      dragSrcEl.style.borderRadius = e.target.style.borderRadius;
      e.target.innerHTML = e.dataTransfer.getData('text/html');
      e.target.style.backgroundColor = e.dataTransfer.getData('text/backgroundColor');
      e.target.style.borderRadius = e.dataTransfer.getData('text/borderRadius');
    }
  }
  savePageState();
  return false;
}

const figures = document.querySelectorAll('.figure');

function handleDragEnd() {
  if (state.currentTool === 'move') figures.forEach(figure => figure.classList.remove('over'));
  savePageState();
}

// ================== Event Listeners ==============================
figures.forEach((figure) => {
  figure.addEventListener('click', (e) => {
    if (state.currentTool === 'bucket') colorFigure(e);
    else if (state.currentTool === 'transform') transformFigure(e);
  });
  figure.addEventListener('dragstart', handleDragStart, false);
  figure.addEventListener('dragenter', handleDragEnter, false);
  figure.addEventListener('dragover', handleDragOver, false);
  figure.addEventListener('dragleave', handleDragLeave, false);
  figure.addEventListener('drop', handleDrop, false);
  figure.addEventListener('dragend', handleDragEnd, false);
});

const highlightButton = (e) => {
  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => button.classList.remove('highlight-tool'));
  e.target.classList.add('highlight-tool');
  savePageState();
};

document.querySelector('.bucket').addEventListener('click', (e) => {
  state.currentTool = 'bucket';
  highlightButton(e);
});

document.querySelector('.color-picker').addEventListener('click', (e) => {
  state.currentTool = 'color-picker';
  highlightButton(e);
});

document.querySelector('.move').addEventListener('click', (e) => {
  state.currentTool = 'move';
  highlightButton(e);
});

document.querySelector('.transform').addEventListener('click', (e) => {
  state.currentTool = 'transform';
  highlightButton(e);
});

document.addEventListener('click', (e) => {
  if (state.currentTool === 'color-picker'
      && (e.target !== document.querySelector('.color-picker'))) pickColor(e);
});

// ================== Keyboard Controls ==============================

const isLetterB = e => e.keyCode === 66;
const isLetterC = e => e.keyCode === 67;
const isLetterM = e => e.keyCode === 77;
const isLetterT = e => e.keyCode === 84;

const handleKeyPress = (e) => {
  if (isLetterB(e)) state.currentTool = 'bucket';
  else if (isLetterC(e)) state.currentTool = 'color-picker';
  else if (isLetterM(e)) state.currentTool = 'move';
  else if (isLetterT(e)) state.currentTool = 'transform';
};

document.onkeydown = handleKeyPress;

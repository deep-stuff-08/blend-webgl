var simulator

function setupProgramForOceanDeep() {
}

function initForOceanDeep() {
	simulator = new Simulator(canvas, window.innerWidth, window.innerHeight);
}

function renderForOceanDeep(perspectiveMatrix, viewMatrix, viewPos) {
	simulator.render(0.01, perspectiveMatrix, viewMatrix, viewPos)
}
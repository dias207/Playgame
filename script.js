(() => {
  const driveButtons = Array.from(document.querySelectorAll('.drive-btn'));
  const resetBtn = document.getElementById('resetBtn');
  const resultEl = document.getElementById('result');
  const cars = Array.from(document.querySelectorAll('.car'));
  const carNames = cars.map((car, i) => car.getAttribute('data-name') || `Машина ${i+1}`);

  let finished = false;

  const trackEl = document.querySelector('.track');
  const finishOffsetPx = 70; // match CSS right: 70px

  function resetPositions() {
    cars.forEach((car) => {
      car.style.transform = `translateX(0px)`;
      car.classList.remove('winner');
    });
    finished = false;
  }

  function hideResult() {
    resultEl.hidden = true;
    resultEl.textContent = '';
  }

  function showResult(text) {
    resultEl.hidden = false;
    resultEl.textContent = text;
  }

  function getFinishX() {
    const trackRect = trackEl.getBoundingClientRect();
    const finishX = trackRect.width - finishOffsetPx; // x position for finish line
    return finishX;
  }

  // Per-press movement settings (no hold)
  const stepPerClick = 24; // px per tap/click
  const finishMargin = 110; // keep car nose before line

  function driveCar(index) {
    if (finished) return;
    const car = cars[index];
    const currentX = parseFloat(car.style.transform.replace(/[^0-9.-]/g, '')) || 0;
    const finishX = Math.max(0, getFinishX() - finishMargin);
    const nextX = Math.min(finishX, currentX + stepPerClick);
    car.style.transform = `translateX(${nextX}px)`;
    car.classList.add('moving');
    if (nextX >= finishX) {
      finished = true;
      cars.forEach(c => c.classList.remove('winner'));
      car.classList.add('winner');
      const name = carNames[index];
      showResult(`Победил ${name}!`);
      cars.forEach(c => c.classList.remove('moving'));
    }
  }

  function resetGame() {
    hideResult();
    resetPositions();
  }

  // Event listeners
  driveButtons.forEach((btn) => {
    const idx = Number(btn.dataset.car);
    // click/tap advances once; add brief moving effect
    function flashMoving() {
      const c = cars[idx];
      c.classList.add('moving');
      setTimeout(() => c.classList.remove('moving'), 120);
    }
    btn.addEventListener('click', () => { driveCar(idx); flashMoving(); });
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); driveCar(idx); flashMoving(); });
  });
  resetBtn.addEventListener('click', resetGame);

  // Keyboard controls disabled: movement only via on-screen buttons
})();



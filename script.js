document.querySelectorAll('.draggable').forEach(wheel => {
  let isDragging = false;
  let startAngle = 0;
  let currentAngle = 0;
  let center = { x: 0, y: 0 };

  wheel.addEventListener('mousedown', startDrag);
  wheel.addEventListener('mousemove', dragWheel);
  wheel.addEventListener('mouseup', endDrag);
  
  wheel.addEventListener('touchstart', startDrag);
  wheel.addEventListener('touchmove', dragWheel);
  wheel.addEventListener('touchend', endDrag);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const rect = wheel.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    startAngle = calculateAngle(clientX, clientY);
  }

  function dragWheel(e) {
    if (!isDragging) return;
    e.preventDefault();
    const { clientX, clientY } = e.touches ? e.touches[0] : e;
    const newAngle = calculateAngle(clientX, clientY);
    const deltaAngle = newAngle - startAngle;
    currentAngle += deltaAngle;
    startAngle = newAngle;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
  }

  function endDrag() {
    isDragging = false;
  }

  function calculateAngle(x, y) {
    const dx = x - center.x;
    const dy = y - center.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }
});

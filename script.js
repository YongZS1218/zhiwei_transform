document.querySelectorAll('.draggable').forEach(wheel => {
  let isDragging = false, startAngle = 0, currentAngle = 0, center = { x: 0, y: 0 };

  wheel.addEventListener('mousedown', startDrag);
  wheel.addEventListener('mousemove', dragWheel);
  wheel.addEventListener('mouseup', () => isDragging = false);

  function startDrag(e) {
    isDragging = true;
    const rect = wheel.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    startAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
  }

  function dragWheel(e) {
    if (!isDragging) return;
    const newAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
    currentAngle += newAngle - startAngle;
    startAngle = newAngle;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
  }
});

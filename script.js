document.querySelectorAll('.draggable').forEach(wheel => {
  let isDragging = false, startAngle = 0, currentAngle = 0, center = { x: 0, y: 0 };

  // 鼠標事件
  wheel.addEventListener('mousedown', startDragMouse);
  window.addEventListener('mousemove', dragWheelMouse);
  window.addEventListener('mouseup', stopDrag);

  // 觸摸事件
  wheel.addEventListener('touchstart', startDragTouch);
  window.addEventListener('touchmove', dragWheelTouch);
  window.addEventListener('touchend', stopDrag);

  // 鼠標拖動邏輯
  function startDragMouse(e) {
    isDragging = true;
    const rect = wheel.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    startAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
  }

function dragWheelTouch(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newAngle = Math.atan2(touch.clientY - center.y, touch.clientX - center.x) * (180 / Math.PI);
    currentAngle += newAngle - startAngle;
    startAngle = newAngle;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
  }

  function stopDrag() {
    isDragging = false;
  }
});
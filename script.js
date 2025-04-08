document.querySelectorAll('.draggable').forEach(wheel => {
  let isDragging = false, startAngle = 0, currentAngle = 0, center = { x: 0, y: 0 };

  // 支持鼠標事件
  wheel.addEventListener('mousedown', startDragMouse);
  window.addEventListener('mousemove', dragWheelMouse);
  window.addEventListener('mouseup', stopDrag);

  // 支持觸屏事件
  wheel.addEventListener('touchstart', startDragTouch);
  window.addEventListener('touchmove', dragWheelTouch);
  window.addEventListener('touchend', stopDrag);

  // 鼠標拖動起始
  function startDragMouse(e) {
    isDragging = true;
    const rect = wheel.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    startAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
  }

  // 鼠標拖動過程
  function dragWheelMouse(e) {
    if (!isDragging) return;
    const newAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
    currentAngle += newAngle - startAngle;
    startAngle = newAngle;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
  }

  // 觸屏拖動起始
  function startDragTouch(e) {
    isDragging = true;
    const rect = wheel.getBoundingClientRect();
    center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const touch = e.touches[0];
    startAngle = Math.atan2(touch.clientY - center.y, touch.clientX - center.x) * (180 / Math.PI);
  }

  // 觸屏拖動過程
  function dragWheelTouch(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newAngle = Math.atan2(touch.clientY - center.y, touch.clientX - center.x) * (180 / Math.PI);
    currentAngle += newAngle - startAngle;
    startAngle = newAngle;
    wheel.style.transform = `rotate(${currentAngle}deg)`;
  }

  // 停止拖動
  function stopDrag() {
    isDragging = false;
  }
});
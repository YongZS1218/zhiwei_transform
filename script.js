document.addEventListener('DOMContentLoaded', function() {
  // 為外圈每個扇形自動配置 transform
  const outerSegments = document.querySelectorAll('.outer-wheel .segment');
  const outerCount = outerSegments.length;
  outerSegments.forEach((seg, index) => {
    let angle = index * (360 / outerCount);
    // 第一個 rotate 將扇區定位到對應位置，translate 將文字向外移動，
    // 第二個 rotate(-angle) 使文字方向保持水平（不跟著轉）
    seg.style.transform = `rotate(${angle}deg) translate(200%) rotate(-${angle}deg)`;
  });

  // 為內圈每個扇形自動配置 transform
  const innerSegments = document.querySelectorAll('.inner-wheel .segment');
  const innerCount = innerSegments.length;
  innerSegments.forEach((seg, index) => {
    let angle = index * (360 / innerCount);
    // 內圈用較小的平移值，例如 70%
    seg.style.transform = `rotate(${angle}deg) translate(150%) rotate(-${angle}deg)`;
  });

  // 原有轉盤拖拽功能
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
});

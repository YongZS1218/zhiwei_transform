document.addEventListener('DOMContentLoaded', function() {
  // 為外圈每個扇形自動配置 transform
  const outerSegments = document.querySelectorAll('.outer-wheel .segment');
  const outerCount = outerSegments.length;
  outerSegments.forEach((seg, index) => {
    const anglePerSegment = 360 / outerCount;
    // 將初始角度偏移半個格子的角度
    let angle = index * anglePerSegment + anglePerSegment / 2;
    // 移除反向旋轉
    seg.style.transform = `rotate(${angle}deg) translate(440%)`;
  });

  // 為內圈每個扇形自動配置 transform
  const innerSegments = document.querySelectorAll('.inner-wheel .segment');
  const innerCount = innerSegments.length;
  innerSegments.forEach((seg, index) => {
    const anglePerSegment = 360 / innerCount;
    // 將初始角度偏移半個格子的角度，並添加一個小的調整值（例如 -7 度）
    let angle = index * anglePerSegment + anglePerSegment / 2 - 7;
    const text = seg.textContent.trim(); // 取得文字內容並去除空白
    let translateValue = 165; // 預設值

    if (text.length === 1) {
      translateValue = 400; // 單字平移較多
    } else if (text.length === 2) {
      translateValue = 200; // 雙字平移較少
    } else if (text.length === 0) {
      translateValue = 0; // 空格
    }

    seg.style.transform = `rotate(${angle}deg) translate(${translateValue}%)`;
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
    window.addEventListener('touchmove', dragWheelTouch, { passive: false });
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
      e.preventDefault();
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

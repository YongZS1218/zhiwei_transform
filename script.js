document.addEventListener('DOMContentLoaded', function() {
  // 為外圈每個扇形自動配置 transform
  const outerSegments = document.querySelectorAll('.outer-wheel .segment');
  const outerCount = outerSegments.length;
  outerSegments.forEach((seg, index) => {
    const anglePerSegment = 360 / outerCount;
    // 將初始角度偏移半個格子的角度
    let angle = index * anglePerSegment + anglePerSegment / 2 - 5;
    // 移除反向旋轉
    seg.style.transform = `rotate(${angle}deg) translate(580%)`;
  });

  // 為中間圈每個扇形自動配置 transform
  const middleSegments = document.querySelectorAll('.middle-wheel .segment');
  const middleCount = middleSegments.length;
  middleSegments.forEach((seg, index) => {
    const anglePerSegment = 360 / middleCount;
    let angle = index * anglePerSegment + anglePerSegment / 2 - 5;
    const text = seg.textContent.trim(); // 取得文字內容並去除空白
    let translateValue = 165; // 預設值

    if (text.length === 1) {
      translateValue = 860; // 單字平移較多
    } else if (text.length === 2) {
      translateValue = 400; // 雙字平移較少
    } else if (text.length === 3) {
      translateValue = 400; // “𩒺”占2個碼元
    }

    seg.style.transform = `rotate(${angle}deg) translate(${translateValue}%)`;
  });
  
  // 為內圈每個扇形自動配置 transform
  const innerSegments = document.querySelectorAll('.inner-wheel .segment');
  const innerCount = innerSegments.length;
  innerSegments.forEach((seg, index) => {
    const anglePerSegment = 360 / innerCount;
    // 將初始角度偏移半個格子的角度，並添加一個小的調整值（例如 -7 度）
    let angle = index * anglePerSegment + anglePerSegment / 2 - 5;
    const text = seg.textContent.trim(); // 取得文字內容並去除空白
    let translateValue = 165; // 預設值

    if (text.length === 1) {
      translateValue = 470; // 單字平移較多
    } else if (text.length === 2) {
      translateValue = 200; // 雙字平移較少
    } else if (text.length === 0) {
      translateValue = 0; // 空格
    }

    seg.style.transform = `rotate(${angle}deg) translate(${translateValue}%)`;
  });

  // === 轉盤拖拽功能修改 ===
  const outerWheel = document.querySelector('.outer-wheel');
  const middleWheel = document.querySelector('.middle-wheel');
  const innerWheel = document.querySelector('.inner-wheel');
  const wheelContainer = document.querySelector('.wheel-container'); // 需要一個共同的中心點參考

  let isDraggingOuter = false; // 外圈拖曳狀態
  let isDraggingInnerSync = false; // 中間圈和內圈同步拖曳狀態
  let startAngle = 0; // 拖曳開始時的起始角度
  let currentOuterAngle = 0; // 外圈當前的旋轉角度
  let currentInnerSyncAngle = 0; // 中間圈和內圈同步的當前旋轉角度
  let center = { x: 0, y: 0 }; // 轉盤容器的中心點

  // 獲取轉盤容器的中心點（在頁面載入時計算一次）
  const containerRect = wheelContainer.getBoundingClientRect();
  center = { x: containerRect.left + containerRect.width / 2, y: containerRect.top + containerRect.height / 2 };

  // 外圈拖動事件監聽
  outerWheel.addEventListener('mousedown', startDragOuter);
  outerWheel.addEventListener('touchstart', startDragOuter);

  // 中間圈和內圈同步拖動事件監聽
  middleWheel.addEventListener('mousedown', startDragInnerSync);
  middleWheel.addEventListener('touchstart', startDragInnerSync);
  innerWheel.addEventListener('mousedown', startDragInnerSync);
  innerWheel.addEventListener('touchstart', startDragInnerSync);

  // 在 window 上監聽 mousemove 和 touchmove，以便在轉盤外也能繼續拖動
  window.addEventListener('mousemove', dragWheel);
  window.addEventListener('touchmove', dragWheel, { passive: false }); // 阻止默認滾動行為

  // 在 window 上監聽 mouseup 和 touchend/touchcancel，結束拖動
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchend', stopDrag);
  window.addEventListener('touchcancel', stopDrag);


  // 開始拖動外圈
  function startDragOuter(e) {
    isDraggingOuter = true;
    isDraggingInnerSync = false; // 確保另一個同步拖曳狀態為 false
    e.preventDefault(); // 阻止默認事件，例如圖片拖拽

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    startAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
     // 記錄當前外圈的旋轉角度，以便從當前位置開始拖動
    const transform = outerWheel.style.transform;
    if (transform && transform.includes('rotate')) {
      const rotateMatch = transform.match(/rotate\(([^deg)]+)deg\)/);
      if (rotateMatch && rotateMatch[1]) {
        currentOuterAngle = parseFloat(rotateMatch[1]);
      }
    } else {
      currentOuterAngle = 0; // 如果沒有旋轉，初始角度為 0
    }
  }

  // 開始拖動中間圈或內圈 (同步)
  function startDragInnerSync(e) {
    isDraggingInnerSync = true;
    isDraggingOuter = false; // 確保另一個獨立拖曳狀態為 false
    e.preventDefault(); // 阻止默認事件

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    startAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);

    // 記錄中間圈（或內圈，因為它們同步）當前的旋轉角度
    const transform = middleWheel.style.transform; // 可以選中間圈或內圈
    if (transform && transform.includes('rotate')) {
      const rotateMatch = transform.match(/rotate\(([^deg)]+)deg\)/);
      if (rotateMatch && rotateMatch[1]) {
        currentInnerSyncAngle = parseFloat(rotateMatch[1]);
      }
    } else {
      currentInnerSyncAngle = 0; // 如果沒有旋轉，初始角度為 0
    }
  }


  // 拖動中
  function dragWheel(e) {
    if (!isDraggingOuter && !isDraggingInnerSync) return;

    // 確保觸摸事件不會滾動頁面（雖然在 start 中已加，但在 move 中再加一次更保險）
    if (e.type === 'touchmove') {
        e.preventDefault();
    }


    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    const newAngle = Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
    const angleDifference = newAngle - startAngle;

    if (isDraggingOuter) {
      currentOuterAngle += angleDifference;
      outerWheel.style.transform = `rotate(${currentOuterAngle}deg)`;
    } else if (isDraggingInnerSync) {
      currentInnerSyncAngle += angleDifference;
      middleWheel.style.transform = `rotate(${currentInnerSyncAngle}deg)`;
      innerWheel.style.transform = `rotate(${currentInnerSyncAngle}deg)`;
    }

    startAngle = newAngle;
  }

  // 停止拖動
  function stopDrag() {
    isDraggingOuter = false;
    isDraggingInnerSync = false;
  }

  // === 轉盤拖拽功能修改結束 ===
  // 注意：在頁面載入時獲取中心點，如果頁面佈局在載入後有變化，可能需要重新計算中心點
  // 例如，如果容器尺寸是根據內容動態變化的，或者頁面可以滾動並改變容器在視口中的位置
  // 對於固定的佈局，載入時計算一次通常足夠

});

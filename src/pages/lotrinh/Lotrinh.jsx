import React, { useEffect, useRef, useState } from 'react';

const Lotrinh = () => {
  const playerRef = useRef(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('player', {
          height: '390',
          width: '640',
          videoId: 'GMYUq0PIwho', // ID của video từ YouTube
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      };
    };
    loadYouTubeAPI();
  }, []);

  // Khi video đã sẵn sàng
  const onPlayerReady = (event) => {
    const duration = playerRef.current.getDuration(); // Lấy tổng thời lượng (giây)
    setTotalDuration(duration); // Cập nhật tổng thời gian
  };

  // Theo dõi tiến trình phát
  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const interval = setInterval(() => {
        const time = playerRef.current.getCurrentTime(); // Lấy thời gian đã xem
        setCurrentTime(time); // Cập nhật thời gian đã xem
      }, 1000);

      return () => clearInterval(interval); // Xóa interval khi dừng phát
    }
  };

  return (
    <div>
      <h2>Video Progress Tracking</h2>
      <div id="player"></div> {/* YouTube player */}
      <div>
        <p>Total Duration: {(totalDuration / 60).toFixed(2)} minutes</p>
        <p>Current Time Watched: {(currentTime / 60).toFixed(2)} minutes</p>
      </div>
    </div>
  );
};

export default Lotrinh;

import React, { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useHistory } from 'react-router-dom';

const LocationRequest: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const requestLocationPermission = async () => {
      const checkPermission = async () => {
        const permission = await Geolocation.checkPermissions();

        if (permission.location === 'granted') {
          history.push('/home'); // Chuyển đến trang chính
        } else {
          // Nếu chưa có quyền, yêu cầu cấp quyền
          const requestResult = await Geolocation.requestPermissions();
          
          if (requestResult.location === 'granted') {
            history.push('/home');
          } else {
            // Nếu người dùng từ chối, hiển thị alert
            alert('Ứng dụng cần quyền truy cập vị trí để hoạt động. Vui lòng cấp quyền.');
            checkPermission(); // Gọi lại hàm để kiểm tra quyền tiếp tục
          }
        }
      };

      await checkPermission();
      setLoading(false);
    };

    requestLocationPermission();
  }, [history]);

  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể hiển thị một loading spinner
  }

  return null; // Không trả về gì nếu đã xử lý xong
};

export default LocationRequest;

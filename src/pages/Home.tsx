import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAlert,
  IonMenu,
  IonMenuButton,
  IonList,
  IonItem,
  IonAvatar,
} from '@ionic/react';
import { GoogleMap } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import env from '../env';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useHistory } from 'react-router';
import Header from '../components/Header';

interface RideRequest {
  id: string;
  userID: string;
  driverID: string;
  fromAddress: string;
  toAddress: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  distance: number;
  cost: number;
}

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'free-pick' | 'doing'>('free-pick');
  const [isFreePickDisabled, setIsFreePickDisabled] = useState(false);
  const { user, isLogin } = useSelector((state: RootState) => state.user);

  const [showAlert, setShowAlert] = useState(false);
  const [dataBooking, setDataBooking] = useState<RideRequest>({} as RideRequest);
  const history = useHistory();

  const mapContainerStyle = {
    width: '100%',
    height: '350px',
  };
  const center = {
    lat: 10.8231,
    lng: 106.6297,
  };
  const driverId = 'driver123';
  const SERVER_URL = env.API_URL;

  const getBooking = async () => {
    const response = await fetch(`${SERVER_URL}booking/driver/${user?.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}` },
    });
    const data = await response.json();
    setDataBooking(data?.data || null);
  };

  useEffect(() => {
    getBooking();

    const socket = io(SERVER_URL, { query: { driverId: user?.id } });
    socket.on('newBooking', (data: RideRequest) => {
      if (data.driverID === user?.id) {
        setDataBooking(data);
        setShowAlert(true);
        setSelectedTab('doing');
      }
    });

    return () => socket.disconnect();
  }, [user?.id]);

  useEffect(() => {
    if (dataBooking && dataBooking.id) {
      setSelectedTab('doing');
      setIsFreePickDisabled(true);
    }
  }, [dataBooking]);

  function formatNumber(num: number) {
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'k';
    }
    return num;
  }

  function roundDistance(num: number) {
    const km = num / 1000;
    return (Math.round(km * 10) / 10).toFixed(1) + 'km';
  }

  // Click handler for the avatar
  const handleAvatarClick = () => {
    // Open the menu
    document.querySelector('ion-menu')?.open();
  };

  return (
    <IonPage>

      <Header />

      <IonContent id="main-content">
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header='Đơn hàng mới'
          message={"Bạn vừa nhận được đơn hàng mới"}
        />

        <IonSegment
          value={selectedTab}
          onIonChange={(e: any) => setSelectedTab(e.detail.value as 'free-pick' | 'doing')}
          className='bg-white'
        >
          <IonSegmentButton value="free-pick" className='h-12' disabled={isFreePickDisabled}>
            <IonLabel className="text-red-600 font-bold ">FREE-PICK</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="doing" disabled={!isFreePickDisabled}>
            <IonLabel className="text-gray-600">ĐANG LÀM</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {selectedTab === 'free-pick' && (
          <>
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={12}
                options={{
                  disableDefaultUI: true,
                  zoomControl: false,
                  scrollwheel: false,
                  disableDoubleClickZoom: true,
                  draggable: false,
                }}
              />
            </div>

            <div className="p-4 h-52 items-center flex justify-center">
              <div className="flex flex-col items-center justify-center max-w w-full mt-6 h-52 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">Bạn đang không có đơn :)</p>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'doing' && (
          <div className="p-4">
            <div className="rounded-lg" onClick={() => history.push(`/booking-detail/${dataBooking?.id}`)}>
              <div className='flex justify-between bg-yellow-50 px-3 py-4'>
                <div>
                  <p className='text-md text-red-500 uppercase font-[600]'>{dataBooking?.bookingID}</p>
                  <p className='text-sm text-gray-500'>{formatNumber(dataBooking?.cost)} ( {roundDistance(dataBooking?.distance)})</p>
                </div>
                <div className="text-sm bg-red-500 text-white items-center space-x-2 px-2 h-[22px] rounded-sm uppercase">
                  {dataBooking?.type}
                </div>
              </div>
              <div className="mt-4 p-4">
                <div className='flex items-center'>
                  <div className='w-2 h-2 bg-red-500 rounded'></div>
                  <p className='ml-2 text-sm text-gray-500'>Điểm bắt đầu: </p>
                </div>
                <p className='text-sm'>{dataBooking?.fromAddress}</p>
                <div className='h-[1px] bg-gray-200 w-full mt-3 mb-3'></div>
                <div className='flex items-center'>
                  <div className='w-2 h-2 bg-green-500 rounded'></div>
                  <p className='ml-2 text-sm text-gray-500'>Điểm kết thúc: </p>
                </div>
                <p className='text-sm'>{dataBooking?.toAddress}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;

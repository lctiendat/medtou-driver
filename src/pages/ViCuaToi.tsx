import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const ViCuaToi = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ví của tôi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="p-4">
        <div className="bg-red-100 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <p className="text-2xl font-bold text-red-600">-33,495 đ</p>
            <div className="flex space-x-4">
              <button className="bg-red-500 text-white p-2 rounded">Nạp tiền</button>
              <button className="bg-green-500 text-white p-2 rounded">Rút tiền</button>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">Tài khoản ký quỹ: 200,000đ (Số dư thấp)</div>
      </IonContent>
    </IonPage>
  );
};

export default ViCuaToi;

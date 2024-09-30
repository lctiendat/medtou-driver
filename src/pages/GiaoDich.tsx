import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const GiaoDich = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Giao dịch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">Điều chỉnh thủ công</span>
          <span className="text-green-600 font-bold">+1,000 đ</span>
        </div>
        <div className="text-sm text-gray-500">
          <p>Số dư gần nhất: -199,033 đ</p>
          <p>11 Thg 09 2024, 16:28</p>
        </div>
        {/* Lặp lại các giao dịch */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-between items-center mt-4">
            <span className="font-bold">Điều chỉnh thủ công</span>
            <span className="text-green-600 font-bold">+1,000 đ</span>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default GiaoDich;

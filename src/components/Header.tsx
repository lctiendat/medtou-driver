import { IonAvatar, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from "@ionic/react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useHistory } from "react-router";

export default function Header() {
    const { user } = useSelector((state: RootState) => state.user);
    const history = useHistory();

    const handleAvatarClick = () => {
        // Open the menu
        document.querySelector('ion-menu')?.open();
    };

    return (
        <div>
            <IonMenu side="start" contentId="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Menu</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <a href="/home"> <IonItem>
                            <IonLabel>Trang chủ</IonLabel>
                        </IonItem> </a>
                        <a href="/history">  <IonItem >
                            <IonLabel>Lịch sử đơn hàng</IonLabel>
                        </IonItem></a>
                        <a href="/payment"> <IonItem>
                            <IonLabel>Ví tiền</IonLabel>
                        </IonItem></a>
                        <a href="/logout">
                            <IonItem>
                                <IonLabel>Logout</IonLabel>
                            </IonItem></a>
                    </IonList>
                </IonContent>
            </IonMenu>
            <div className='flex items-center my-3 px-3 cursor-pointer' onClick={handleAvatarClick}>
                <IonAvatar className="w-12 h-12 rounded-full">
                    <img src="https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png" alt="User Avatar" />
                </IonAvatar>
                <div className="ml-3">
                    <div className='text-md font-bold'>{user?.name || 'User'}</div>
                    <p className="text-sm text-gray-500">Đang làm việc</p>
                </div>
            </div>
        </div>
    );
}

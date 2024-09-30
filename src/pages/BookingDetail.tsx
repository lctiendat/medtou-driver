import { IonPage, IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import env from '../env';

interface RideRequest {
    id: string;
    bookings: string[];
    fromAddress: string;
    toAddress: string;
    fromLat: number;
    fromLng: number;
    toLat: number;
    toLng: number;
    distance: number;
    cost: number;
    userID: Object;
    driverID: Object;
    type: 'driver' | 'delivery'; // Thêm loại đơn
}

export default function BookingDetail(params) {
    const [dataBooking, setDataBooking] = useState<RideRequest>({} as RideRequest);
    const { id } = useParams();
    const history = useHistory()

    // Trạng thái đơn hàng: Nếu driver thì chỉ có 'waiting', 'arrived', 'completed'
    // Nếu delivery thì có thêm 'pickup', 'delivered'
    const [status, setStatus] = useState<'waiting' | 'arrived' | 'pickup' | 'delivered' | 'completed'>('waiting');

    const getBookingDetail = async () => {
        const response = await fetch(`${env.API_URL}booking/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
            },
        });
        const data = await response.json();

        console.log(data.data);

        setDataBooking(data.data);
    };

    useEffect(() => {
        getBookingDetail();
    }, [id]);

    const handleStatusChange = async () => {
        if (dataBooking.type === 'driver') {
            // Nếu loại là 'driver', chỉ có 2 bước
            if (status === 'waiting') {
                await fetch(`${env.API_URL}booking/arrived/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                    },
                });
                setStatus('arrived');
            } else if (status === 'arrived') {
                await fetch(`${env.API_URL}booking/completed/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                    },
                });
                setStatus('completed');
                history.push('/home');
            }
        } else if (dataBooking.type === 'delivery') {
            // Nếu loại là 'delivery', có thêm bước 'pickup' và 'delivered'
            if (status === 'waiting') {
                await fetch(`${env.API_URL}booking/pickup/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                    },
                });
                setStatus('pickup');
            } else if (status === 'pickup') {
                await fetch(`${env.API_URL}booking/delivered/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                    },
                });
                setStatus('delivered');
            } else if (status === 'delivered') {
                await fetch(`${env.API_URL}booking/completed/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                    },
                });
                setStatus('completed');
                //history.push('/home');
                window.location.href = '/home'

            }
        }
    };

    return (
        <IonPage>
            <IonContent>
                <div className='h-32 bg-red-500 flex justify-center items-center rounded-b-xl'>
                    <div>
                        <p className='text-md text-white'>Số tiền nhận</p>
                        <div className='flex items-center'>
                            <p className='text-3xl text-white font-bold'>{dataBooking.cost}</p> <sup className='text-lg text-white'>đ</sup>
                        </div>
                    </div>
                </div>

                <div className='p-4 w-full'>
                    <div>
                        <p className='text-lg font-bold'>Thông tin khách:</p>
                        <p>Họ và tên : {dataBooking.userID?.name}</p>
                        <p>Số điện thoại : {dataBooking.userID?.phoneNumber}</p>
                    </div>
                    <div className='h-[1px] bg-gray-200 w-full mt-3 mb-3'></div>
                    <div>
                        <div className='flex space-x-2 items-center'>
                            <div className='h-2 w-2 bg-green-500 rounded'></div>
                            <p className='text-md text-gray-400'>{dataBooking.type === 'delivery' ? 'Giao hàng' : 'Đón khách'}  tại :</p>
                        </div>
                        <p>Địa chỉ: {dataBooking.fromAddress}</p>
                        <div className='h-[1px] bg-gray-200 w-full mt-3 mb-3'></div>
                        <div className='flex space-x-2 items-center'>
                            <div className='h-2 w-2 bg-red-500 rounded'></div>
                            <p className='text-md text-gray-400'>{dataBooking.type === 'delivery' ? 'Lấy hàng' : 'Trả khách'}  tại :</p>
                        </div>
                        <p>Địa chỉ: {dataBooking.toAddress}</p>
                    </div>
                </div>

                {/* Hiển thị nút dựa theo loại và trạng thái */}
                <div className='flex justify-center'>
                    {dataBooking.type === 'driver' && status === 'waiting' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-green-500 text-white p-4 rounded-xl'
                            onClick={handleStatusChange}>Đã đến điểm đón</button>
                    )}
                    {dataBooking.type === 'driver' && status === 'arrived' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-blue-500 text-white p-4 rounded-xl'
                            onClick={handleStatusChange}>Hoàn thành</button>
                    )}

                    {dataBooking.type === 'delivery' && status === 'waiting' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-green-500 text-white p-4 rounded-xl'
                            onClick={handleStatusChange}>Đã lấy hàng</button>
                    )}
                    {dataBooking.type === 'delivery' && status === 'pickup' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-yellow-500 text-white p-4 rounded-xl'
                            onClick={handleStatusChange}>Đã đến điểm giao</button>
                    )}
                    {dataBooking.type === 'delivery' && status === 'delivered' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-blue-500 text-white p-4 rounded-xl'
                            onClick={handleStatusChange}>Hoàn thành</button>
                    )}

                    {status === 'completed' && (
                        <button className='bottom-28 fixed z-100 w-11/12 h-14 flex justify-center items-center bg-gray-500 text-white p-4 rounded-xl' disabled>
                            Đã hoàn thành
                        </button>
                    )}
                </div>

                <div className='p-4 w-full'>
                    <div className='h-[1px] bg-gray-200 w-full mt-3 mb-3'></div>

                    {dataBooking.type === 'delivery' && (

                        <div>
                            <p className='text-lg font-bold mb-2'>Thông tin đơn hàng: </p>

                            {dataBooking.bookings.map((medicine, index) => (
                                <div key={index} className="mb-4 flex items-center justify-between">
                                    <img
                                        src={medicine?.image || 'https://via.placeholder.com/150'}
                                        alt={medicine?.name}
                                        className="w-16 h-16 object-cover rounded-md mr-4"
                                    />
                                    <p><strong>Tên:</strong> <br /><p>{medicine?.name}</p></p>
                                    <p><strong>Số lượng:</strong> <br /> {medicine?.quantity}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Footer navigation */}
                <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
                    <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                        <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.427 14.768L17.2 13.542a1.733 1.733 0 0 0-2.45 0l-.613.613a1.732 1.732 0 0 1-2.45 0l-1.838-1.84a1.735 1.735 0 0 1 0-2.452l.612-.613a1.735 1.735 0 0 0 0-2.452L9.237 5.572a1.6 1.6 0 0 0-2.45 0c-3.223 3.2-1.702 6.896 1.519 10.117 3.22 3.221 6.914 4.745 10.12 1.535a1.601 1.601 0 0 0 0-2.456Z" />
                            </svg>
                            <span className="text-sm text-gray-500">Gọi khách</span>
                        </button>
                        <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                            </svg>
                            <span className="text-sm text-gray-500">Chat</span>
                        </button>
                        <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group">
                            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L17.94 6M18 18L6.06 6" />
                            </svg>
                            <span className="text-sm text-gray-500">Huỷ</span>
                        </button>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

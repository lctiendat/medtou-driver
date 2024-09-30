import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonButton, IonSkeletonText } from '@ionic/react';
import env from '../env';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const History: React.FC = () => {
    const [segment, setSegment] = useState('history');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSegmentChange = (e: CustomEvent) => {
        setSegment(e.detail.value);
    };

    useEffect(() => {
        // Show skeleton for 2 seconds and then fetch data
        const timer = setTimeout(() => {
            getHistory();
        }, 2000);

        return () => clearTimeout(timer); // Cleanup timeout if the component is unmounted
    }, []);

    const getHistory = async () => {
        try {
            const response = await fetch(`${env.API_URL}booking/driver/history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('medtou-accesstoken')}`,
                },
            });
            const data = await response.json();
            console.log(data);

            setData(data.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    return (
        <IonPage>
            <IonContent>
                <Header />
                <div className='p-4 h-[35px] w-full mb-5  '>
                    <div className="flex items-center mb-4 border-b-gray-300 h-[40px] justify-center ">
                        {/* <button className="text-orange-500 mr-4">
                            ←
                        </button> */}
                        <h1 className="text-xl font-semibold">Lịch sử giao dịch</h1>
                    </div>
                </div>
                {segment === 'ongoing' ? (
                    <div className="text-center text-gray-500 mt-4">No ongoing orders.</div>
                ) : (
                    <div className="p-4">
                        {loading ? (
                            // Skeleton loader while data is loading
                            <div>
                                <div className="bg-white rounded-lg shadow p-4 mb-4">
                                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '12px' }} />
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 mb-4">
                                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '12px' }} />
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 mb-4">
                                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '12px' }} />
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 mb-4">
                                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '12px' }} />
                                </div>
                                <div className="bg-white rounded-lg shadow p-4 mb-4">
                                    <IonSkeletonText animated style={{ width: '100%', height: '20px' }} />
                                    <IonSkeletonText animated style={{ width: '60%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '40%', height: '16px', marginTop: '12px' }} />
                                    <IonSkeletonText animated style={{ width: '100%', height: '16px', marginTop: '12px' }} />
                                </div>
                            </div>
                        ) : (
                            // Render the fetched data after loading completes
                            data.map((order: any, index: number) => (
                                <div key={index} className="bg-white rounded-lg shadow p-4 mb-4">
                                    <div className="items-center justify-between">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm">
                                                <span className="text-[12px] bg-red-500 text-white px-2 py-1">
                                                    {order.type === 'driver' ? 'Driver' : 'Delivery'}
                                                </span>
                                                <span className="ml-2 font-bold">#{order.bookingID}</span>
                                            </p>
                                            <p className="text-sm text-gray-500">{order.createdAt}</p>
                                        </div>
                                        <div className="mt-2">
                                            {order.type === 'driver' ? (
                                                <div className="mt-3">
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-red-500 rounded"></div>
                                                        <p className="ml-2 text-sm text-gray-500">Điểm bắt đầu: </p>
                                                        <p className="text-sm ml-3">{order.fromAddress}</p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded"></div>
                                                        <p className="ml-2 text-sm text-gray-500">Điểm kết thúc: </p>
                                                        <p className="text-sm ml-3">{order.toAddress}</p>
                                                    </div>

                                                </div>
                                            ) : (
                                                <div>
                                                    <h2 className="font-bold text-md items-center">
                                                        {order.toAddress}
                                                    </h2>
                                                    <p className="text-sm text-gray-500 mt-2">{order.item}</p>
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-bold text-green-500">+ {order.cost}đ</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </IonContent>
        </IonPage >
    );
};

export default History;

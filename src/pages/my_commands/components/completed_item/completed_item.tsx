import React from 'react';
import { IonAvatar, IonContent, IonImg, IonItem, IonText, IonButton, IonAccordion } from '@ionic/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faBoxArchive, faCircleInfo, faDolly, faInfo, faInfoCircle, faLocation, faMotorcycle, faPersonBiking, faRoad, faTruck, faTruckPickup } from '@fortawesome/free-solid-svg-icons';

import img from '../../../../assets/images/abic_logo.png';

import './completed_item.scss';
import ProgressBar from '../progress_bar/progress_bar';
import { useAppSelector } from '../../../../hooks/redux_hooks';
import { v4 as uuid } from 'uuid';


interface completedItemProps{
    orderId:string,
    consumerId:string,
    consumerName:string,
    consumerPhoto:string,
    amount:number,
    consumerLocation:string,
    clientName?:string,
    clientPhoto?:string,
    deliveryLocation?:string,
    delivery:any | null,
    products:{name:string, quantity:number, unitPrice:number}[],
    date:string
    socket?:any;

}

const CompletedItem:React.FC<completedItemProps> = ({orderId, consumerId, consumerName, consumerPhoto, delivery, products, amount, consumerLocation, deliveryLocation, clientName, clientPhoto, date, socket}):JSX.Element => {
    const user = useAppSelector(state => state.user);

    const alertConsumer = () => {
        let notification = {
            id:uuid(),
            source:user.name,
            message:"Your package is around you, go collect it",
            timeDate:new Date()
        }
        socket.emit('delivery-notify-consumer', {consumerId, notification});
    }

    return(
        <IonAccordion value={orderId} className='ongoing-command-item'>
            <IonItem slot='header'>
                <IonAvatar>
                    <img alt="merchant" src={consumerPhoto} />
                </IonAvatar>
                <div className='top-details'>
                    <IonText className='ongoing-command-name'>{consumerName}</IonText>
                    <IonText className='ongoing-command-date'>{date.slice(0, 10).split("-").reverse().join("/")}     {date.slice(11, 16)}</IonText>
                </div>
            </IonItem>
            <div slot='content' className='accordion-body'>
                {
                    user.role === 'merchant' &&
                    <div className='pending-location'>
                        <h6>
                            <FontAwesomeIcon icon={faLocation} />
                            Client's Location
                        </h6>
                        <IonText>
                            {consumerLocation}
                        </IonText>
                    </div>
                }
                { 
                    delivery !== null &&
                    <div className='delivery-section'>
                        <h6>
                            <FontAwesomeIcon icon={faDolly} />
                            In charge of delivery
                        </h6>
                        
                            <div>
                                <img src={delivery.image} className='delivery-img' alt='delivery description' />
                                <p className='delivery-name'>{delivery.name}</p>
                                <div className='vehicle-icon'>
                                    {
                                        delivery.vehicle === 'bike'?
                                            <FontAwesomeIcon icon={faPersonBiking} />
                                        :(delivery.vehicle === 'tricycle')?
                                        <FontAwesomeIcon icon={faMotorcycle} />
                                        :(delivery.vehicle === 'pickup')?
                                        <FontAwesomeIcon icon={faTruckPickup} />
                                        :<FontAwesomeIcon icon={faTruck} />
                                    }
                                </div>
                            </div>
                    </div>
                 }
                 {
                    user.role === 'delivery' && 
                    <div className='pending-location'>
                        <IonText className='users-location'>
                            <b>Merchant:</b>
                            <span>{consumerLocation}</span>
                        </IonText>
                        <span className='road-icon'><FontAwesomeIcon icon={faRoad} /></span>
                        <IonText className='users-location'>
                            <b>Client</b>
                            <span>{deliveryLocation}</span>
                        </IonText>
                    </div>
                 }
                 {
                    user.role === 'delivery' &&
                    <div className='delivery-section'>
                        <h6>
                            <FontAwesomeIcon icon={faDolly} />
                            Deliver to...
                        </h6>
                        
                            <div>
                                <img src={clientPhoto} className='delivery-img' alt='delivery description' />
                                <p className='delivery-name'>{clientName}</p>
                                <div className='vehicle-icon'>
                                    
                                </div>
                            </div>
                    </div>
                 }
                <table>
                    <tr>
                        <th>Product</th>
                        <th>Quantity(Kg)</th>
                        {user.role !== 'delivery' && <th>Unit Total</th>}
                        {/* <th>Total price</th> */}
                    </tr>
                    {products.map((product:{name:string, quantity:number, unitPrice:number}) => (
                        <tr>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            {
                                user.role !== 'delivery' &&
                                <td key={product.name+orderId}>{product.quantity * product.unitPrice} CFA </td>
                            }
                        </tr>
                    ))}
                </table>
                <div className='ongoing-item-footer'>
                    <h6>Incoming: {amount} CFA</h6>
                    {
                        user.role === "merchant" &&
                        <button color='primary' type="button" onClick={() => alertConsumer()} className='delivery-alert-button'>
                            Alert {clientName?.split(' ')[0]}
                        </button>
                    }
                    {user.role === 'merchant' &&
                        <React.Fragment>
                            <h6>Delivery Charges: {delivery?.deliveryRate | 0} CFA</h6>
                            <h6>Profit: {amount - delivery?.deliveryRate | 0} CFA</h6>
                        </React.Fragment>
                        
                    }
                </div>
            </div>
        </IonAccordion>
    );
} 

export default CompletedItem;
import React, {useState} from 'react';
import "./order_progress.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHome } from '@fortawesome/free-solid-svg-icons';
import { IonText } from '@ionic/react';

interface orderProgressProps{
    progress:number
}

/*progress key values
>>25:Payment has been made
>>50:Merchant has paid a delivery service or accepted the order
>>75:Delivery has accepeted merchant request and has recieved pay
>>100: order confirmed as complete by user
*/

const OrderProgress:React.FC<orderProgressProps> = ({progress}):JSX.Element => {

    return(
        <div>
             <div className='order-status'>
                    <IonText className="order-status-message">
                        {
                            (progress <= 25)?"Merchant is packaging your product":((progress <= 50)?"A delivery service is recieving your package":"Your package is on the way")
                        }
                    </IonText>
                    <div className='order-meter'>
                        <div className='order-meter-level' style={{width:`${progress}%`}}>
                            <div className="order-meter-item" style={progress > 0?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faShoppingBag} />
                            </div>
                            <div className='order-meter-item' style={progress >= 50?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div className='order-meter-item' style={progress > 75?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faHome} />
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default OrderProgress;
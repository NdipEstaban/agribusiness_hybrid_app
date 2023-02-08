import React, {useState} from 'react';
import "./order_progress.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faShoppingBag, faHome } from '@fortawesome/free-solid-svg-icons';
import { IonText } from '@ionic/react';


const OrderProgress:React.FC = () => {
    const [progress, setProgress] = useState<number>(50);
    const level = 75;

    return(
        <div>
             <div className='order-status'>
                    <IonText className="order-status-message">
                        {
                            (level <= 25)?"Merchant is packaging your product":((level <= 50)?"A delivery service is recieving your package":"Your package is on the way")
                        }
                    </IonText>
                    <div className='order-meter'>
                        <div className='order-meter-level' style={{width:`${level}%`}}>
                            <div className="order-meter-item" style={level > 0?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faShoppingBag} />
                            </div>
                            <div className='order-meter-item' style={level >= 50?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faTruck} />
                            </div>
                            <div className='order-meter-item' style={level > 75?{background:"#3c7aff"}:{}}>
                                <FontAwesomeIcon icon={faHome} />
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default OrderProgress;
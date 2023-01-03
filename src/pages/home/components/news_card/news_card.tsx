import React from 'react';
import { IonContent, IonCard, IonCardTitle, IonCardSubtitle, IonHeader, IonImg, IonItem, IonTitle, IonButton, IonText } from '@ionic/react';
import '@fortawesome/react-fontawesome';
import {faTrash, faCartShopping} from '@fortawesome/free-solid-svg-icons';
import img from '../../../../assets/images/abic_logo.png';
import './news_card.scss';
import textShortener from '../../../../utils/text_shortener';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NewsCardProps{
    img:string,
    info:string,
}

const NewsCard:React.FC = () => {
    return(
        <div id='news-card'>
            <IonImg id='news-img' src={img} />
            <IonText id='info'>
                {
                    textShortener('Lorem ipsum, dolor sit amet consectetur adipisicing elit. Neque eum, atque recusandaelaudantium maxime facere alias officia omnisamet distinctio ullam quidem! Sapiente soluta vitae excepturi ex voluptatibus. Quidem, quia.', 80)
                }
            </IonText>
        </div>
    );
}

export default NewsCard;
import React from 'react';
import { IonContent, IonGrid, IonItemGroup, IonList } from "@ionic/react";
import './featured.scss';

import ProductCard from '../../components/product_card/product_card';
import NewsCard from '../../components/news_card/news_card';
import { Interface } from 'readline';

interface featuredProps{
    cardAction:(param:string) => void
}

const Featured:React.FC<featuredProps> = (props):JSX.Element => {
    
    return(
        <div className='featured'>
            <IonList>
                <NewsCard />
                <ProductCard name='banane' price='7000' cardIcon='delete' cardAction={() => props.cardAction('')} />
                <ProductCard name='banane' price='7000' cardIcon='delete' cardAction={() => props.cardAction('')} />
                <ProductCard name='banane' price='7000' cardIcon='delete' cardAction={() => props.cardAction('')} />
                <ProductCard name='banane' price='7000' cardIcon='delete' cardAction={() => props.cardAction('')} />
                <NewsCard />
            </IonList>
        </div>
    );
}

export default Featured;
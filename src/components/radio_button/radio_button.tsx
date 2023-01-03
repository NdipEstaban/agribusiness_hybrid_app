import React, {useRef} from "react";
import './radio_button.scss';
import { IonContent, IonItem, IonLabel, IonRadio, IonRadioGroup } from "@ionic/react";

interface RadioProps{
    option1:string,
    option2:string,

    setHome:(param:string) => void,
}

const RadioButton:React.FC<RadioProps> = (props): JSX.Element => {

    const option2Radio = useRef<HTMLButtonElement>(null);
    const option1Radio = useRef<HTMLButtonElement>(null);

    const setCurrentHome = (radioButton:string, tab:string) => {
        props.setHome(tab);
        
        let clickedRadio = (radioButton == 'option1Radio')?option1Radio:option2Radio;
        let dormmyRadio = (radioButton == 'option1Radio')?option2Radio:option1Radio;
        clickedRadio.current!.classList.add('radio-btn-selected');
        dormmyRadio.current!.classList.remove('radio-btn-selected');
    }

    return(
            <div className='radio-btn-container'>
                <button ref={option1Radio} onClick={() => setCurrentHome('option1Radio', props.option1)} className='radio-btn option-1 radio-btn-selected'>
                    {props.option1}
                </button>
                <button ref={option2Radio} onClick={() => setCurrentHome('option2Radio', props.option2)} className='radio-btn option-2'>
                    {props.option2}
                </button>
            </div>
    );
};

export default RadioButton;
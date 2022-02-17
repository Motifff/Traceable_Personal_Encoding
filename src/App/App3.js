import React, { useState, useContext, createContext } from 'react';
import { Button, notification, Input } from 'antd';
import App1 from './App1';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import '../Style1.css';

export const playerName = createContext({string : '',touchTime : 0});

export const App3 = (props) => {
    const [name, setName] = useState("default");
    const [touch,setTouch] = useState(0);
    const [api, contextHolder] = notification.useNotification();
    const indata = useContext(playerName);
    const openNotification = placement => {
        indata.touchTime=touch;
        ;
        api.info({
            message: `Notification`,
            description: <playerName.Consumer>{(name) => `Hello, ${name}!`}</playerName.Consumer>,
            placement,
        });
    };
    return (
        <div style={{ justifyContent: 'center' }}>
            <div className='strictBox' style={{marginTop:'80vh',marginLeft:props.x*0.382*0.5,alignItems:'center'}}>
                <Input
                    style={{width:props.x*0.618*0.618,height:'10vh',textAlign: 'center', alignItems:'center'}}
                    id='userName'
                    placeholder="Type Your Name"
                    onChange={(e) => setName(String(e.target.value))} />
                <playerName.Provider value={name}>
                    {contextHolder}
                    <Button
                        type="primary"
                        style={{width:props.x*0.618*0.382,height:'10vh',textAlign: 'center', alignItems:'center'}}
                        onClick={() => {setTouch(touch+1);openNotification('topLeft')}}
                    >
                        Join in!
                    </Button>
                </playerName.Provider>
                <text>{indata.touchTime}</text>
            </div>
        </div>
    );
};
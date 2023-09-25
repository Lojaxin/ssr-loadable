import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import './index.scss';

export default function (props) {
    console.log('%c [ props ]-4', 'font-size:13px; background:pink; color:#bf2c9f;', props)

    const handleClick = () => {
        console.log('handleClick')
    };

    useEffect(() => {
        console.log('useEffect执行了')
    }, [])

    return (
        <div>
            <h1 className="test">Home</h1>
            <img src="/images/wate.png" alt="" width={200} />
            <Link to="/some">some</Link>
            <button onClick={handleClick}>按钮</button>
        </div>
    )

}
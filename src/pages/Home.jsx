import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// import './index.scss';

export default function (props) {
    console.log('%c [ props ]-4', 'font-size:13px; background:pink; color:#bf2c9f;', props)

    const handleClick = () => {
        console.log('handleClick')
    };

    useEffect(() => {
        console.log('useEffect')
    }, [])
    return (
        <div>
            <h1 className="test">Home</h1>
            <img src="/wate.png" alt="" width={200} />
            <button onClick={handleClick}>按钮</button>
            <br />
            <Link to="/some">some 页面</Link>
        </div>
    )

}
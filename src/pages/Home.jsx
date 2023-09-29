import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import HomeContext from "../store/home";
import styles from './index.module.scss';

export default function (props) {

    const store = useContext(HomeContext);
    console.log('%c [ store ]-9', 'font-size:13px; background:pink; color:#bf2c9f;', store)

    const [num, setNum] = useState(0);

    const handleClick = () => {
        console.log(num)
        setNum(num + 1);
    };

    useEffect(() => {
        console.log('useEffect')
    }, [])
    return (
        <div>
            <h1 className={styles.home}>Home</h1>
            <img src="/wate.png" alt="hhh" width={200} />
            <button onClick={handleClick}>按钮</button>
            <p>num is{num}</p>
            <br />
            <Link to="/some">some 页面</Link>
        </div>
    )

}
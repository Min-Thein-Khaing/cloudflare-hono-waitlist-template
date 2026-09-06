import {useEffect,useState} from "react";


export const ServerStatus = () => {
    const [data,setData] = useState(null)
    useEffect(() => {
        fetch('/api/health').then(res => res.json()).then(data => {
            setData(data)
        }).catch(err => {
            console.log(err)
        })
    },[])
return (
    <div>
        <h1>status</h1>
        <p>{data}</p>
    </div>
)}
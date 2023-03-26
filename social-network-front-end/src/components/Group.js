import { useParams } from "react-router-dom"

function Group(){
    let {id} = useParams()

    return (
        <>
        <div>{id}</div>
        </>
    )
}

export default Group
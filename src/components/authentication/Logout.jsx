import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const { setAuthToken } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setAuthToken('');
            navigate("/", { replace: true })
        }, 1000)
    }, [])

    return (
        <h1>
            Sinut on kirjattu ulos
        </h1>
    )
}

export default Logout;
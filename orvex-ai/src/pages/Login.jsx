import { LOGIN_IMG } from "../utils/constant"

const Login = () =>{

    return(

        <div>

            <div className="flex min-h-screen w-full flex-col bg-black text-white">

                <img
                alt="img"
                src={LOGIN_IMG}
                className="absolute inset-0 w-full h-full object-cover object-center"
                />

                </div>
        </div>
    )
}

export default Login;
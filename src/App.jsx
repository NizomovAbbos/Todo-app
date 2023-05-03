import React from "react";
import Todo from "./components/Todo";
import miracleApi from "miracle-api";

export const API_PATH = "https://todo-y7ot.onrender.com/";

function App() {
    const [isLogin, setIsLogin] = React.useState(
        localStorage.getItem("token") || null
    );
    const emailRef = React.useRef();
    const passwordRef = React.useRef();

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const emailValue = emailRef.current.value;
        const passwordValue = passwordRef.current.value;

        const data = {
            email: emailValue,
            password: passwordValue,
        };

        miracleApi
            .post(API_PATH + "user/login", data)
            .then((res) => {
                if (res.token) {
                    localStorage.setItem("token", res.token);
                    setIsLogin(res.token);
                }
            })
            .catch((err) => console.log(err));
    };

    if (isLogin) return <Todo isLogin={isLogin} />;

    return (
        <>
            <div className='container'>
                <div className='row d-flex vh-100 align-items-center'>
                    <div className='col-4 offset-4'>
                        <div className='card'>
                            <div className='card-header'>
                                <h1 className='text-center'>Login</h1>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={(evt) => handleSubmit(evt)}>
                                    <input
                                        className='form-control mb-3'
                                        type='email'
                                        name='email'
                                        ref={emailRef}
                                        autoComplete='current-email'
                                        placeholder='Email'
                                    />
                                    <input
                                        className='form-control mb-3'
                                        type='password'
                                        name='password'
                                        ref={passwordRef}
                                        autoComplete='current-password'
                                        placeholder='Password'
                                    />

                                    <button
                                        className='btn btn-primary w-100'
                                        type='submit'
                                    >
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;

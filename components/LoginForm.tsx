import React, { useState } from 'react'
import TextInput from './TextInput'

interface ILoginForm {
    handleLogin: (email: string, password: string) => Promise<void>
    sendPasswordReset: (email:string) => Promise<void>
    loading: boolean
}

const LoginForm: React.FC<ILoginForm> = ({ handleLogin, sendPasswordReset, loading }: ILoginForm) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <form className='flex flex-col'>
            <TextInput
                type='email'
                value={email}
                name='email'
                label='Email address'
                placeholder='Enter your email address'
                onChange={email => setEmail(email)}
                textInputClass='mb-8'
            />
            <TextInput
                type='password'
                value={password}
                name='password'
                label='Password'
                placeholder='Enter your password'
                onChange={password => setPassword(password)}
                textInputClass='mb-8'
            />
            <button
                onClick={async () => await handleLogin(email, password)}
                disabled={loading}
                className='bg-primary-blue text-white font-bold rounded py-2 mb-8'
            >
                <span>{loading ? 'Loading...' : 'Sign In'}</span>
            </button>
            <button
                className='underline'
                onClick={(e) => {
                    e.preventDefault()
                    sendPasswordReset(email)
                }}
                disabled={loading}
            >
                Forgot Password?
            </button>
        </form>
    )
}

export default LoginForm
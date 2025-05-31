import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function Signup({ onSwitchToLogin }) {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password, name);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-purple-600">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-white bg-opacity-90 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-green-600 hover:underline"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

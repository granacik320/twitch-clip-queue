import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { login, logout, selectUsername, selectProfilePictureUrl } from '../../features/auth/authSlice';
import {Logout, Settings} from "tabler-icons-react";

export default function Header() {
    const dispatch = useAppDispatch();
    const username = useAppSelector(selectUsername);
    const profilePictureUrl = useAppSelector(selectProfilePictureUrl);
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-surface border-b border-border h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1 rounded">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98A.998.998 0 0 0 8 6.82z" fill="currentColor"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white">CLIPIT</span>
                </Link>

                <nav className="flex items-center gap-6">
                    <NavLink to="/" isActive={location.pathname === '/'}>Home</NavLink>
                    <NavLink to="/clips" isActive={location.pathname === '/clips'}>Clips</NavLink>
                    <NavLink to="/history" isActive={location.pathname === '/history'}>History</NavLink>
                    <NavLink to="/toplist" isActive={location.pathname === '/toplist'}>Toplist</NavLink>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {username ? (
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 hover:bg-card px-2 py-1 rounded-md"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <img
                                src={profilePictureUrl || '/default-avatar.png'}
                                alt={username}
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="text-text-primary">{username}</span>
                            <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10">
                                <UserMenuItem
                                    icon={<Settings size={18} />}
                                    label="Settings"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        // Open settings modal
                                    }}
                                />
                                <div className="border-t border-border my-1"></div>
                                <UserMenuItem
                                    icon={<Logout size={18} />}
                                    label="Log out"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        dispatch(logout());
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                        onClick={() => dispatch(login(location.pathname))}
                    >
                        Login with Twitch
                    </button>
                )}
            </div>
        </header>
    );
}

function NavLink({ to, children, isActive }) {
    return (
        <Link
            to={to}
            className={`text-sm ${isActive ? 'text-white font-medium' : 'text-text-secondary hover:text-white'} transition-colors`}
        >
            {children}
        </Link>
    );
}

function UserMenuItem({ icon, label, onClick }) {
    return (
        <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-secondary transition-colors"
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-8">
                <Outlet />
            </main>
        </div>
    )
}
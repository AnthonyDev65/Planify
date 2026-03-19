import { NavLink } from 'react-router-dom';
import { Home, Calendar, CreditCard, Lock } from 'lucide-react';

function BottomNav() {
    const navItemBase = "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer";
    const navItemInactive = "hover:bg-white/5";
    const navItemActive = "bg-accent-gradient text-white";

    return (
        <nav className="fixed bottom-0  left-0 right-0 bg-bg-card/95 backdrop-blur-md border-t border-white/5 z-50 md:hidden"
            style={{
                paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
                paddingLeft: 'max(1rem, env(safe-area-inset-left))',
                paddingRight: 'max(1rem, env(safe-area-inset-right))',
            }}>
            <div className="max-w-app mx-auto flex justify-around items-center pt-2">
                <NavLink
                    to="/"
                    className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
                    end
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 12 12">
                        <line x1="6" y1="10.75" x2="6" y2="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" data-color="color-2"></line>
                        <path d="m1.685,3.5L5.435.934c.34-.233.789-.233,1.129,0l3.75,2.566c.272.186.435.495.435.825v4.425c0,1.105-.895,2-2,2H3.25c-1.105,0-2-.895-2-2v-4.425c0-.33.163-.639.435-.825Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
                    </svg>
                    <span hidden className="text-xs font-medium">Home</span>
                </NavLink>

                <NavLink
                    to="/planner"
                    className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 18 18">
                    <line x1="5.75" y1="2.75" x2="5.75" y2=".75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></line>
                    <line x1="12.25" y1="2.75" x2="12.25" y2=".75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></line>
                    <rect x="2.25" y="2.75" width="13.5" height="12.5" rx="2" ry="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></rect>
                    <line x1="2.25" y1="6.25" x2="15.75" y2="6.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></line>
                    <path d="M9,8.25c-.551,0-1,.449-1,1s.449,1,1,1,1-.449,1-1-.449-1-1-1Z" fill="currentColor" data-color="color-2"></path>
                    <path d="M12.5,10.25c.551,0,1-.449,1-1s-.449-1-1-1-1,.449-1,1,.449,1,1,1Z" fill="currentColor" data-color="color-2"></path>
                    <path d="M9,11.25c-.551,0-1,.449-1,1s.449,1,1,1,1-.449,1-1-.449-1-1-1Z" fill="currentColor" data-color="color-2"></path>
                    <path d="M5.5,11.25c-.551,0-1,.449-1,1s.449,1,1,1,1-.449,1-1-.449-1-1-1Z" fill="currentColor" data-color="color-2"></path>
                    <path d="M12.5,11.25c-.551,0-1,.449-1,1s.449,1,1,1,1-.449,1-1-.449-1-1-1Z" fill="currentColor" data-color="color-2"></path>
                    </svg>
                    <span hidden className="text-xs font-medium">Planner</span>
                </NavLink>

                <NavLink
                    to="/subscriptions"
                    className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
                >
                    <CreditCard hidden size={22} />
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 18 18">
                        <line x1="1.75" y1="7.25" x2="16.25" y2="7.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-color="color-2"></line>
                        <rect x="1.75" y="3.75" width="14.5" height="10.5" rx="2" ry="2" transform="translate(18 18) rotate(180)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></rect>
                        <line x1="4.25" y1="11.25" x2="7.25" y2="11.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-color="color-2"></line>
                        <line x1="12.75" y1="11.25" x2="13.75" y2="11.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-color="color-2"></line>
                        </svg>
                    <span hidden className="text-xs font-medium">Subs</span>
                </NavLink>

                <NavLink
                    to="/vault"
                    className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
                >
                    <Lock hidden size={22} />
                    <span hidden className="text-xs font-medium">Vault</span>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 18 18">
                    <rect x="2.75" y="2.75" width="12.5" height="12.5" rx="2" ry="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></rect>
                    <line x1="4.75" y1="15.25" x2="4.75" y2="16.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line>
                    <line x1="13.25" y1="15.25" x2="13.25" y2="16.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line>
                    <line x1="1.75" y1="9" x2="3.75" y2="9" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line>
                    <line x1="1.75" y1="5.75" x2="3.75" y2="5.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line>
                    <line x1="1.75" y1="12.25" x2="3.75" y2="12.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></line>
                    <circle cx="9" cy="8.25" r="1.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-color="color-2"></circle>
                    <line x1="9" y1="11.75" x2="9" y2="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-color="color-2"></line>
                    </svg>
                </NavLink>
            </div>
        </nav>
    );
}

export default BottomNav;

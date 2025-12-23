import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
    Hospital,
    Menu,
    X,
    Home,
    Info,
    Stethoscope,
    Calendar,
    Building2,
    Phone,
    UserPlus,
    LogIn,
    ChevronDown,
    Heart,
    Clock,
    MapPin,
} from "lucide-react";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // Navigation items
    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "About", href: "/about", icon: Info },
        { name: "Doctors", href: "/doctors", icon: Stethoscope },
        { name: "Departments", href: "/departments", icon: Building2 },
        { name: "Appointment", href: "/appointment", icon: Calendar },
        { name: "Contact", href: "/contact", icon: Phone },
    ];

    // Services dropdown
    const services = [
        { name: "Emergency Care", href: "/services/emergency", icon: Heart },
        { name: "OPD Services", href: "/services/opd", icon: Clock },
        { name: "Lab & Diagnostics", href: "/services/lab", icon: Stethoscope },
        { name: "Pharmacy", href: "/services/pharmacy", icon: Building2 },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-blue-600 text-white text-xs py-2 px-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="font-medium">Emergency: +91 1800-123-4567</span>
                        </span>
                        <span className="hidden lg:flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            Medical City
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span>info@medicare.com</span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            8AM - 10PM
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Header - White Theme */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                            <div className="bg-blue-600 p-2.5 rounded-xl">
                                <Hospital className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-blue-600">MediCare</h1>
                                <p className="text-gray-500 text-xs">Your Health, Our Priority</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-1">
                            {navItems.slice(0, 4).map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}

                            {/* Services Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                                    onBlur={() => setTimeout(() => setIsServicesOpen(false), 150)}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 text-sm font-medium whitespace-nowrap transition-colors"
                                >
                                    Services
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isServicesOpen && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                        {services.map((service) => (
                                            <Link
                                                key={service.name}
                                                to={service.href}
                                                className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                                            >
                                                <service.icon className="h-4 w-4 text-blue-500" />
                                                {service.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <NavLink
                                to="/contact"
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    }`
                                }
                            >
                                Contact
                            </NavLink>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Book Appointment */}
                            <Link
                                to="/appointment"
                                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors whitespace-nowrap"
                            >
                                <Calendar className="h-4 w-4" />
                                Book Appointment
                            </Link>

                            {/* Login */}
                            <Link
                                to="/login"
                                className="hidden md:flex items-center gap-2 px-4 py-2.5 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
                            >
                                <LogIn className="h-4 w-4" />
                                Login
                            </Link>

                            {/* Register */}
                            <Link
                                to="/register"
                                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                                <UserPlus className="h-4 w-4" />
                                Register
                            </Link>

                            {/* Mobile Menu */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="xl:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="xl:hidden border-t border-gray-200 bg-white">
                        <nav className="px-4 py-4 space-y-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "text-blue-600 bg-blue-50 font-medium"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </NavLink>
                            ))}

                            {/* Mobile Auth Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Register
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

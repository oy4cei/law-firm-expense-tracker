import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Панель управління
                </h1>
                <p className="text-gray-600">
                    Оберіть розділ для роботи з системою
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <DashboardCard
                    to="/expenses"
                    icon={<ExpensesIcon />}
                    title="Витрати"
                    description="Перегляд та додавання витрат фірми"
                    gradient="from-red-500 to-pink-500"
                />
                <DashboardCard
                    to="/incomes"
                    icon={<IncomesIcon />}
                    title="Доходи"
                    description="Перегляд та додавання доходів"
                    gradient="from-green-500 to-emerald-500"
                />
                <DashboardCard
                    to="/clients"
                    icon={<ClientsIcon />}
                    title="Клієнти"
                    description="Довідник клієнтів та їх інформація"
                    gradient="from-blue-500 to-cyan-500"
                />
                <DashboardCard
                    to="/cases"
                    icon={<CasesIcon />}
                    title="Справи"
                    description="Керування справами та прив'язка до клієнтів"
                    gradient="from-purple-500 to-indigo-500"
                />
                <DashboardCard
                    to="/report"
                    icon={<ReportIcon />}
                    title="Звіт"
                    description="Фінансовий звіт: доходи та витрати за період"
                    gradient="from-orange-500 to-amber-500"
                />
                <DashboardCard
                    href="/api/export"
                    icon={<ExportIcon />}
                    title="Експорт в Excel"
                    description="Завантажити повний звіт у форматі .xlsx"
                    gradient="from-teal-500 to-green-500"
                    external
                />
            </div>
        </div>
    );
}

// Dashboard Card Component
function DashboardCard({ to, href, icon, title, description, gradient, external }) {
    const baseClasses = "block p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-opacity-100 card-hover relative overflow-hidden group animate-fade-in";

    const content = (
        <>
            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                    {icon}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                    {title}
                </h5>
                <p className="font-normal text-gray-600 text-sm">
                    {description}
                </p>
            </div>

            {/* Arrow Icon */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </div>
        </>
    );

    if (external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
                {content}
            </a>
        );
    }

    return (
        <Link to={to} className={baseClasses}>
            {content}
        </Link>
    );
}

// Icon Components
function ExpensesIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function IncomesIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ClientsIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function CasesIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

function ReportIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}

function ExportIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );
}

import Breadcrumb from './Breadcrumb';

export default function BreadcrumbBar() {
    return (
        <div className="w-full bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <Breadcrumb />
            </div>
        </div>
    );
} 
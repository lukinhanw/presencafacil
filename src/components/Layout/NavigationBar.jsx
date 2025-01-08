import Breadcrumb from './Breadcrumb';

export default function NavigationBar() {

    return (
        <div className="w-full bg-white/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <Breadcrumb />
                    </div>
                </div>
            </div>
        </div>
    );
} 
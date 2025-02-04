export default function ConfigSection({ title, description, children, icon: Icon }) {
    return (
        <div className="glass-card p-6 space-y-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary-500/10">
                    <Icon className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {description}
                    </p>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {children}
            </div>
        </div>
    );
} 
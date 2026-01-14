export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 md:ml-64">
            <div>
                {/* Breadcrumbs or Tile could go here */}
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-700">Administrator</div>
                <div className="h-8 w-8 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                    A
                </div>
            </div>
        </header>
    );
}

import { Leaf } from 'lucide-react';

interface AuthHeaderProps {
    title?: string;
    subtitle?: string;
    showLogo?: boolean;
}

export default function AuthHeader({
    title = 'TANI TECH',
    subtitle = 'Connect. Compare. Trade.',
    showLogo = true
}: AuthHeaderProps) {
    return (
        <div className="text-center mb-8">
            {showLogo && (
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tani-green mb-4">
                    <Leaf className="w-8 h-8 text-white" />
                </div>
            )}
            <h1 className="text-2xl font-bold text-tani-green">{title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
    );
}

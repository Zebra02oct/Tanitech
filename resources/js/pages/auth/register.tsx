import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import AuthHeader from '@/components/auth-header';
import { Scale } from 'lucide-react';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const { props } = usePage();
    const selectedRole = (props as any).selectedRole || '';
    const [role, setRole] = useState(selectedRole);

    return (
        <>
            <Head title="Daftar - TANI TECH" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-green-900/20 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border p-8">
                        <AuthHeader />

                        {/* Role Selection */}
                        <div className="mb-6">
                            <Label className="text-base font-medium">Daftar sebagai:</Label>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <label
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        role === 'farmer'
                                            ? 'border-tani-green bg-tani-green/5'
                                            : 'border-border hover:border-tani-green/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="farmer"
                                        checked={role === 'farmer'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                        role === 'farmer' ? 'bg-tani-green text-white' : 'bg-muted'
                                    }`}>
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L12 22M12 2C9 5 7 9 7 12M12 2C15 5 17 9 17 12" />
                                        </svg>
                                    </div>
                                    <span className={`font-medium ${role === 'farmer' ? 'text-tani-green' : ''}`}>
                                        Petani
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Jual hasil panen
                                    </span>
                                    {role === 'farmer' && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tani-green flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </label>

                                <label
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        role === 'buyer'
                                            ? 'border-tani-green bg-tani-green/5'
                                            : 'border-border hover:border-tani-green/50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="buyer"
                                        checked={role === 'buyer'}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                                        role === 'buyer' ? 'bg-tani-green text-white' : 'bg-muted'
                                    }`}>
                                        <Scale className="w-6 h-6" />
                                    </div>
                                    <span className={`font-medium ${role === 'buyer' ? 'text-tani-green' : ''}`}>
                                        Pembeli
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Beli komoditas
                                    </span>
                                    {role === 'buyer' && (
                                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-tani-green flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Hidden role input */}
                                    <input type="hidden" name="role" value={role} />

                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Nama Lengkap</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                name="name"
                                                placeholder="Masukkan nama lengkap Anda"
                                                className="h-11"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@contoh.com"
                                                className="h-11"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                tabIndex={3}
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Minimal 8 karakter"
                                                className="h-11"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password_confirmation">
                                                Konfirmasi Password
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                required
                                                tabIndex={4}
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Masukkan password lagi"
                                                className="h-11"
                                            />
                                            <InputError
                                                message={errors.password_confirmation}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-tani-green hover:bg-tani-green/90 text-white font-medium rounded-lg mt-2"
                                            tabIndex={5}
                                            disabled={!role || processing}
                                        >
                                            {processing && <Spinner className="mr-2" />}
                                            Daftar Sekarang
                                        </Button>
                                    </div>

                                    <div className="text-center text-sm">
                                        <span className="text-muted-foreground">
                                            Sudah punya akun?{' '}
                                        </span>
                                        <TextLink href={login()} tabIndex={6} className="text-tani-green font-medium hover:underline">
                                            Masuk
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-muted-foreground">
                        <p>&copy; 2026 TANI TECH. Hak cipta dilindungi.</p>
                        <div className="mt-2 space-x-2">
                            <a href="/privacy-policy" className="hover:text-tani-green">Kebijakan Privasi</a>
                            <span>•</span>
                            <a href="/terms-of-service" className="hover:text-tani-green">Syarat & Ketentuan</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Daftar Akun',
    description: 'Bergabung dengan TANI TECH',
};

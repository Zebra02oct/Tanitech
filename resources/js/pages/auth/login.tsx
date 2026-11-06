import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthHeader from '@/components/auth-header';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';
import { request } from '@/routes/password';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk - TANI TECH" />

            {/* @chisel-passkeys */}
            <PasskeyVerify />
            {/* @end-chisel-passkeys */}

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-green-900/20 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border p-8">
                        <AuthHeader />

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Alamat Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@contoh.com"
                                                className="h-11"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Kata Sandi</Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-sm text-tani-green hover:underline"
                                                        tabIndex={5}
                                                    >
                                                        Lupa kata sandi?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Masukkan kata sandi"
                                                className="h-11"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember" className="text-sm cursor-pointer">Ingat saya</Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-tani-green hover:bg-tani-green/90 text-white font-medium rounded-lg mt-2"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner className="mr-2" />}
                                            Masuk
                                        </Button>
                                    </div>

                                    {/* @chisel-registration */}
                                    <div className="text-center text-sm">
                                        <span className="text-muted-foreground">
                                            Belum punya akun?{' '}
                                        </span>
                                        <TextLink href={register()} tabIndex={5} className="text-tani-green font-medium hover:underline">
                                            Daftar sekarang
                                        </TextLink>
                                    </div>
                                    {/* @end-chisel-registration */}
                                </>
                            )}
                        </Form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600 dark:text-green-400">
                                {status}
                            </div>
                        )}
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

Login.layout = {
    title: 'Masuk ke akun TANI TECH',
    description: 'Masuk untuk mengakses akun TANI TECH Anda',
};

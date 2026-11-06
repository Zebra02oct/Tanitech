// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthHeader from '@/components/auth-header';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Password - TANI TECH" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-green-900/20 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border p-8">
                        <AuthHeader />

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-tani-green" />
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-lg font-semibold mb-2">Lupa Password?</h2>
                            <p className="text-sm text-muted-foreground">
                                Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mengatur ulang password.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center">
                                {status}
                            </div>
                        )}

                        <Form {...email.form()} className="space-y-5">
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                            placeholder="email@contoh.com"
                                            className="h-11"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-tani-green hover:bg-tani-green/90 text-white font-medium rounded-lg"
                                        disabled={processing}
                                        data-test="email-password-reset-link-button"
                                    >
                                        {processing ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        Kirim Tautan Reset Password
                                    </Button>
                                </>
                            )}
                        </Form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">
                                Ingat password Anda?{' '}
                            </span>
                            <TextLink href={login()} className="text-tani-green font-medium hover:underline">
                                Masuk
                            </TextLink>
                        </div>
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

ForgotPassword.layout = {
    title: 'Lupa Password',
    description: 'Atur ulang password akun TANI TECH Anda',
};

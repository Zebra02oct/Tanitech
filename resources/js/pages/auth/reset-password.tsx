import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthHeader from '@/components/auth-header';
import { Lock } from 'lucide-react';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset Password - TANI TECH" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-green-900/20 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Card Container */}
                    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border p-8">
                        <AuthHeader />

                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center">
                                <Lock className="w-8 h-8 text-tani-green" />
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-lg font-semibold mb-2">Atur Ulang Password</h2>
                            <p className="text-sm text-muted-foreground">
                                Masukkan password baru untuk akun Anda.
                            </p>
                        </div>

                        <Form
                            {...update.form()}
                            transform={(data) => ({ ...data, token, email })}
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            readOnly
                                            className="h-11 bg-muted cursor-not-allowed"
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password Baru</Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            autoComplete="new-password"
                                            autoFocus
                                            placeholder="Minimal 8 karakter"
                                            passwordrules={passwordRules}
                                            className="h-11"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi Password
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder="Masukkan password lagi"
                                            passwordrules={passwordRules}
                                            className="h-11"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                            className="mt-2"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-tani-green hover:bg-tani-green/90 text-white font-medium rounded-lg mt-2"
                                        disabled={processing}
                                        data-test="reset-password-button"
                                    >
                                        {processing && <Spinner className="mr-2" />}
                                        Reset Password
                                    </Button>
                                </div>
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

ResetPassword.layout = {
    title: 'Reset Password',
    description: 'Atur ulang password akun TANI TECH Anda',
};

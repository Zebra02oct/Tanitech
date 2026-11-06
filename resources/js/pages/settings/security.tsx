import { Form, Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Scale, Shield } from 'lucide-react';
import { edit } from '@/routes/security';
/* @chisel-passkeys */
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
/* @end-chisel-passkeys */
/* @chisel-2fa */
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
/* @end-chisel-2fa */

// oxfmt-ignore
type Props = {
    passwordRules: string;
} /* @chisel-passkeys */ & ManagePasskeysProps /* @end-chisel-passkeys */ /* @chisel-2fa */ &
    ManageTwoFactorProps /* @end-chisel-2fa */;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Keamanan - TANI TECH" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-sm text-muted-foreground hover:text-tani-green transition-colors"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8 max-w-2xl">
                    {/* Page Title */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-tani-green/10 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-tani-green" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Keamanan</h1>
                                <p className="text-muted-foreground mt-1">
                                    Kelola kata sandi dan keamanan akun Anda
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Password Card */}
                    <div className="bg-white dark:bg-zinc-800 rounded-xl border dark:border-zinc-700 p-6 mb-6">
                        <h2 className="font-semibold text-lg mb-1">Ubah Password</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Pastikan akun Anda menggunakan password yang kuat dan unik.
                        </p>

                        <Form
                            {...SecurityController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-5"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_password">
                                            Password Saat Ini
                                        </Label>
                                        <PasswordInput
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            autoComplete="current-password"
                                            placeholder="Masukkan password saat ini"
                                            className="h-11"
                                        />
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password Baru</Label>
                                        <PasswordInput
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            autoComplete="new-password"
                                            placeholder="Minimal 8 karakter"
                                            passwordrules={props.passwordRules}
                                            className="h-11"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Konfirmasi Password Baru
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            autoComplete="new-password"
                                            placeholder="Masukkan password baru lagi"
                                            passwordrules={props.passwordRules}
                                            className="h-11"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <Button
                                        className="bg-tani-green hover:bg-tani-green/90 text-white"
                                        disabled={processing}
                                        data-test="update-password-button"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Password'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* @chisel-2fa */}
                    <ManageTwoFactor
                        canManageTwoFactor={props.canManageTwoFactor}
                        requiresConfirmation={props.requiresConfirmation}
                        twoFactorEnabled={props.twoFactorEnabled}
                    />
                    {/* @end-chisel-2fa */}

                    {/* @chisel-passkeys */}
                    <ManagePasskeys
                        canManagePasskeys={props.canManagePasskeys}
                        passkeys={props.passkeys}
                    />
                    {/* @end-chisel-passkeys */}
                </div>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Keamanan',
            href: edit(),
        },
    ],
};

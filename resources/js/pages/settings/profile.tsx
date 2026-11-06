import { Form, Head, usePage, Link } from '@inertiajs/react';
/* @chisel-email-verification */
/* @end-chisel-email-verification */
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Scale } from 'lucide-react';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
/* @chisel-email-verification */
import { send } from '@/routes/verification';
/* @end-chisel-email-verification */

type PageProps = {
    auth: Auth;
};

export default function Profile(
    /* @chisel-email-verification */
    {
        mustVerifyEmail,
        status,
    }: {
        mustVerifyEmail: boolean;
        status?: string;
    },
    /* @end-chisel-email-verification */
) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil - TANI TECH" />

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
                        <h1 className="text-2xl font-bold">Pengaturan Profil</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola informasi profil akun Anda
                        </p>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-white dark:bg-zinc-800 rounded-xl border dark:border-zinc-700 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b dark:border-zinc-700">
                            <div className="w-16 h-16 rounded-full bg-tani-green/10 flex items-center justify-center">
                                <User className="w-8 h-8 text-tani-green" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg">{auth.user.name}</h2>
                                <p className="text-sm text-muted-foreground">{auth.user.email}</p>
                            </div>
                        </div>

                        <Form
                            {...ProfileController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Nama lengkap"
                                            className="h-11"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Alamat Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="email"
                                            placeholder="Email"
                                            className="h-11"
                                        />
                                        <InputError
                                            className="mt-2"
                                            message={errors.email}
                                        />
                                    </div>

                                    {/* @chisel-email-verification */}
                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at === null && (
                                            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                                <p className="text-sm text-yellow-800 -mt-2">
                                                    Email Anda belum diverifikasi.{' '}
                                                    <Link
                                                        href={send()}
                                                        as="button"
                                                        className="text-tani-green underline underline-offset-4 hover:text-tani-green/80"
                                                    >
                                                        Klik di sini untuk mengirim ulang tautan verifikasi.
                                                    </Link>
                                                </p>

                                                {status === 'verification-link-sent' && (
                                                    <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800 font-medium">
                                                        Tautan verifikasi baru telah dikirim ke email Anda.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    {/* @end-chisel-email-verification */}

                                    <div className="flex items-center gap-4 pt-4">
                                        <Button
                                            className="bg-tani-green hover:bg-tani-green/90 text-white"
                                            disabled={processing}
                                            data-test="update-profile-button"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Danger Zone */}
                    <DeleteUser />
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};

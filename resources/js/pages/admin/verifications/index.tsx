import { Head, usePage, Link } from '@inertiajs/react';
import { Check, X, Eye } from 'lucide-react';

interface BuyerProfile {
    id: number;
    business_name: string;
    description: string | null;
    phone: string;
    village: string;
    district: string;
    regency: string;
    province: string;
    verification_status: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface PageProps {
    pendingVerifications: {
        data: BuyerProfile[];
    };
    revisionVerifications: {
        data: BuyerProfile[];
    };
}

export default function VerificationsIndex() {
    const { pendingVerifications, revisionVerifications } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Verifikasi - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L12 22M12 2C9 5 7 9 7 12M12 2C15 5 17 9 17 12" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link href="/admin/dashboard" className="text-sm text-muted-foreground">
                                Kembali
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Verifikasi Pembeli</h1>
                        <p className="text-muted-foreground">Tinjau dan verifikasi akun pembeli</p>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-xl border mb-8 dark:bg-zinc-800">
                        <div className="p-6 border-b">
                            <h2 className="font-semibold">Menunggu Verifikasi ({pendingVerifications.data.length})</h2>
                        </div>
                        <div className="divide-y">
                            {pendingVerifications.data.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    Tidak ada yang menunggu verifikasi
                                </div>
                            ) : (
                                pendingVerifications.data.map((buyer) => (
                                    <div key={buyer.id} className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{buyer.business_name}</h3>
                                                <p className="text-sm text-muted-foreground">{buyer.user.name} ({buyer.user.email})</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {buyer.phone} | {[buyer.village, buyer.district, buyer.regency].filter(Boolean).join(', ')}
                                                </p>
                                                {buyer.description && (
                                                    <p className="text-sm text-muted-foreground mt-2">{buyer.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <form action={`/admin/verifications/${buyer.id}`} method="post" className="flex-1">
                                                <input type="hidden" name="_method" value="PUT" />
                                                <input type="hidden" name="status" value="approved" />
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Setujui
                                                </button>
                                            </form>
                                            <form action={`/admin/verifications/${buyer.id}`} method="post" className="flex-1">
                                                <input type="hidden" name="_method" value="PUT" />
                                                <input type="hidden" name="status" value="revision" />
                                                <input type="hidden" name="admin_note" value="Mohon lengkapi data profil bisnis Anda." />
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Minta Revisi
                                                </button>
                                            </form>
                                            <form action={`/admin/verifications/${buyer.id}`} method="post" className="flex-1">
                                                <input type="hidden" name="_method" value="PUT" />
                                                <input type="hidden" name="status" value="rejected" />
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Tolak
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Revision */}
                    <div className="bg-white rounded-xl border dark:bg-zinc-800">
                        <div className="p-6 border-b">
                            <h2 className="font-semibold">Menunggu Revisi ({revisionVerifications.data.length})</h2>
                        </div>
                        <div className="divide-y">
                            {revisionVerifications.data.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    Tidak ada yang menunggu revisi
                                </div>
                            ) : (
                                revisionVerifications.data.map((buyer) => (
                                    <div key={buyer.id} className="p-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{buyer.business_name}</div>
                                            <div className="text-sm text-muted-foreground">{buyer.user.name}</div>
                                        </div>
                                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                                            Menunggu Revisi
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

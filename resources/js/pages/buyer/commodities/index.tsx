import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Scale, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Grade {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    latest_price: {
        price: number;
        unit: string;
        confirmed_at: string;
    } | null;
}

interface Commodity {
    id: number;
    name: string;
    unit: string;
}

interface BuyerCommodity {
    id: number;
    is_active: boolean;
    commodity: Commodity;
    grades: Grade[];
}

interface PageProps {
    buyerCommodities: BuyerCommodity[];
    availableCommodities: Commodity[];
}

export default function CommoditiesIndex() {
    const { buyerCommodities, availableCommodities } = usePage<PageProps>().props;
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddGradeModal, setShowAddGradeModal] = useState<number | null>(null);
    const [editingGrades, setEditingGrades] = useState<Record<string, { name: string; description: string }>>({});

    return (
        <>
            <Head title="Komoditas - TANI TECH" />

            <div className="min-h-screen bg-background">
                <header className="border-b bg-white dark:bg-zinc-900">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-xl bg-tani-green flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-tani-green">TANI TECH</span>
                            </Link>
                            <Link href="/buyer/dashboard" className="text-sm text-muted-foreground hover:text-tani-green">
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">Kelola Komoditas</h1>
                            <p className="text-muted-foreground">Atur komoditas dan harga yang Anda beli</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Komoditas
                        </button>
                    </div>

                    {/* Active Commodities */}
                    <div className="space-y-6">
                        {buyerCommodities.length === 0 ? (
                            <div className="bg-white rounded-xl border p-12 text-center dark:bg-zinc-800">
                                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                    <Scale className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground mb-2">Belum ada komoditas.</p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Tambahkan komoditas yang Anda beli untuk mulai menerima petani.
                                </p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Komoditas Pertama
                                </button>
                            </div>
                        ) : (
                            buyerCommodities.map((bc) => (
                                <div key={bc.id} className="bg-white rounded-xl border dark:bg-zinc-800 overflow-hidden">
                                    {/* Header */}
                                    <div className="p-6 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{bc.commodity.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    per {bc.commodity.unit}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                bc.is_active
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {bc.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/buyer/prices`}
                                                className="px-4 py-2 rounded-lg bg-tani-green text-white text-sm font-medium hover:bg-tani-green/90 transition-colors"
                                            >
                                                Update Harga
                                            </Link>
                                            <form action={`/buyer/commodities/${bc.id}`} method="post">
                                                <input type="hidden" name="_method" value="DELETE" />
                                                <button
                                                    type="submit"
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    onClick={(e) => {
                                                        if (!confirm('Hapus komoditas ini?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Grades */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">Grade</h4>
                                            <button
                                                onClick={() => setShowAddGradeModal(bc.id)}
                                                className="text-sm text-tani-green font-medium hover:underline flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Tambah Grade
                                            </button>
                                        </div>

                                        {bc.grades.length === 0 ? (
                                            <div className="text-center py-4 text-muted-foreground">
                                                <p className="text-sm">Belum ada grade. Tambahkan grade untuk menampilkan harga.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {bc.grades.map((grade) => {
                                                    const editData = editingGrades[grade.id];
                                                    const isEditing = !!editData;

                                                    return (
                                                        <div key={grade.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                                                            {isEditing ? (
                                                                <form
                                                                    action={`/buyer/grades/${grade.id}`}
                                                                    method="post"
                                                                    className="flex-1 flex items-center gap-2"
                                                                >
                                                                    <input type="hidden" name="_method" value="PUT" />
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        defaultValue={grade.name}
                                                                        className="flex-1 px-3 py-2 rounded border text-sm"
                                                                        required
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        name="description"
                                                                        defaultValue={grade.description || ''}
                                                                        placeholder="Deskripsi (opsional)"
                                                                        className="flex-1 px-3 py-2 rounded border text-sm"
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                                    >
                                                                        <Check className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newEditing = {...editingGrades};
                                                                            delete newEditing[grade.id];
                                                                            setEditingGrades(newEditing);
                                                                        }}
                                                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </form>
                                                            ) : (
                                                                <>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium">{grade.name}</div>
                                                                        {grade.description && (
                                                                            <div className="text-sm text-muted-foreground">{grade.description}</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        {grade.latest_price ? (
                                                                            <>
                                                                                <div className="font-bold text-tani-green">
                                                                                    Rp {grade.latest_price.price.toLocaleString('id-ID')} / {grade.latest_price.unit}
                                                                                </div>
                                                                                <div className="text-xs text-muted-foreground">
                                                                                    Update {new Date(grade.latest_price.confirmed_at).toLocaleDateString('id-ID')}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <div className="text-sm text-red-500">Belum ada harga</div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={() => setEditingGrades({
                                                                                ...editingGrades,
                                                                                [grade.id]: { name: grade.name, description: grade.description || '' }
                                                                            })}
                                                                            className="p-2 hover:bg-muted rounded"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                        </button>
                                                                        <form action={`/buyer/grades/${grade.id}`} method="post">
                                                                            <input type="hidden" name="_method" value="DELETE" />
                                                                            <button
                                                                                type="submit"
                                                                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                                                                onClick={(e) => {
                                                                                    if (!confirm('Hapus grade ini?')) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Commodity Modal */}
            {showAddModal && (
                <AddCommodityModal
                    availableCommodities={availableCommodities}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* Add Grade Modal */}
            {showAddGradeModal !== null && (
                <AddGradeModal
                    onClose={() => setShowAddGradeModal(null)}
                />
            )}
        </>
    );
}

function AddCommodityModal({
    availableCommodities,
    onClose
}: {
    availableCommodities: Commodity[];
    onClose: () => void;
}) {
    const [commodityId, setCommodityId] = useState('');
    const [grades, setGrades] = useState<{ name: string; price: string; description: string }[]>([
        { name: '', price: '', description: '' }
    ]);

    const addGrade = () => {
        setGrades([...grades, { name: '', price: '', description: '' }]);
    };

    const removeGrade = (index: number) => {
        if (grades.length > 1) {
            setGrades(grades.filter((_, i) => i !== index));
        }
    };

    const updateGrade = (index: number, field: string, value: string) => {
        const newGrades = [...grades];
        (newGrades[index] as any)[field] = value;
        setGrades(newGrades);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-lg font-bold">Tambah Komoditas</h2>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form action="/buyer/commodities" method="post" className="p-6 space-y-4" onSubmit={(e) => {
                        if (!commodityId) {
                            e.preventDefault();
                            alert('Pilih komoditas');
                            return;
                        }
                        const validGrades = grades.filter(g => g.name && g.price);
                        if (validGrades.length === 0) {
                            e.preventDefault();
                            alert('Tambahkan minimal 1 grade');
                            return;
                        }
                    }}>
                        <div>
                            <label className="block text-sm font-medium mb-2">Komoditas</label>
                            <select
                                name="commodity_id"
                                value={commodityId}
                                onChange={(e) => setCommodityId(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                required
                            >
                                <option value="">Pilih Komoditas</option>
                                {availableCommodities.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Grade</label>
                                <button type="button" onClick={addGrade} className="text-sm text-tani-green font-medium">
                                    + Tambah Grade
                                </button>
                            </div>
                            <div className="space-y-3">
                                {grades.map((grade, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-muted/50 border">
                                        <div className="grid grid-cols-3 gap-2 mb-2">
                                            <input
                                                type="text"
                                                name={`grades[${index}][name]`}
                                                value={grade.name}
                                                onChange={(e) => updateGrade(index, 'name', e.target.value)}
                                                placeholder="Nama grade"
                                                className="px-3 py-2 rounded border text-sm"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name={`grades[${index}][price]`}
                                                value={grade.price}
                                                onChange={(e) => updateGrade(index, 'price', e.target.value)}
                                                placeholder="Harga"
                                                className="px-3 py-2 rounded border text-sm"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name={`grades[${index}][description]`}
                                                value={grade.description}
                                                onChange={(e) => updateGrade(index, 'description', e.target.value)}
                                                placeholder="Deskripsi"
                                                className="px-3 py-2 rounded border text-sm"
                                            />
                                        </div>
                                        {grades.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeGrade(index)}
                                                className="text-sm text-red-500 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted">
                                Batal
                            </button>
                            <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

function AddGradeModal({ onClose }: { onClose: () => void }) {
    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b flex items-center justify-between">
                        <h2 className="text-lg font-bold">Tambah Grade</h2>
                        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form action="" method="post" className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nama Grade</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Contoh: Super, Grade A, Standard"
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Harga per Unit</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Contoh: 15000"
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Deskripsi (Opsional)</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Kriteria grade"
                                className="w-full px-4 py-2.5 rounded-lg border bg-background"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border hover:bg-muted">
                                Batal
                            </button>
                            <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-tani-green text-white font-medium hover:bg-tani-green/90">
                                Simpan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
